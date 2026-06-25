require('dotenv').config();

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');
const bcrypt  = require('bcrypt');
const cors    = require('cors');
const multer  = require('multer');
const fs      = require('fs');
const jwt     = require('jsonwebtoken');
const db      = require('../colorjorge/database/database');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'colorjorge_dev_secret';
const JWT_EXPIRES = '8h';

// ─── MIDDLEWARE DE AUTENTICAÇÃO ────────────────────────────────
function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
}

// ─── UPLOAD DE FOTOS ──────────────────────────────────────────
const pastaUploads = path.join(__dirname, 'uploads', 'fotos');
if (!fs.existsSync(pastaUploads)) fs.mkdirSync(pastaUploads, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, pastaUploads),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Somente imagens são permitidas.'));
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/',         express.static(path.join(__dirname, '../colorjorge/build')));
app.use('/projetor', express.static(path.join(__dirname, '../colorjorge-p5js')));

// ─── ROTAS PÚBLICAS ───────────────────────────────────────────

app.post('/api/usuarios', upload.single('foto'), async (req, res) => {
  const { username, email, senha } = req.body;

  if (!username || !email || !senha)
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });

  const fotoPath = req.file ? `/uploads/fotos/${req.file.filename}` : null;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (username, email, senha, foto_path) VALUES (?, ?, ?, ?)',
      [username, email, senhaHash, fotoPath]
    );
    res.status(201).json({
      mensagem: 'Perfil criado com sucesso!',
      id: result.insertId,
      foto_url: fotoPath ? `http://localhost:${process.env.PORT || 8080}${fotoPath}` : null,
    });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao criar perfil.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: 'Informe e-mail e senha.' });

  try {
    const [rows] = await db.query(
      'SELECT id, username, email, senha, foto_path FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0 || !(await bcrypt.compare(senha, rows[0].senha)))
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    const usuario = rows[0];
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        foto_url: usuario.foto_path
          ? `http://localhost:${process.env.PORT || 8080}${usuario.foto_path}`
          : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
});

// ─── ROTAS PROTEGIDAS ─────────────────────────────────────────

app.get('/api/eu', autenticar, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, foto_path, criado_em FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const u = rows[0];
    res.json({
      ...u,
      foto_url: u.foto_path
        ? `http://localhost:${process.env.PORT || 8080}${u.foto_path}`
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar perfil.' });
  }
});

app.get('/api/usuarios', autenticar, async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, foto_path, criado_em FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

// ─── WEBSOCKET COM AUTENTICAÇÃO ────────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Token não fornecido.'));

  try {
    socket.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error('Token inválido ou expirado.'));
  }
});

io.on('connection', (socket) => {
  console.log(`🟢 ${socket.usuario.username} conectou! ID: ${socket.id}`);

  socket.on('projetor_conectado', () => {
    console.log('PROJETOR P5JS CONECTOU NO SERVIDOR');
  });

  socket.on('enviar_voto', (dadosDoVoto) => {
    console.log(`🎯 Voto de ${socket.usuario.username}:`, dadosDoVoto);
    io.emit('atualizar_tela', { ...dadosDoVoto, jogador: socket.usuario.username });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 ${socket.usuario.username} desconectou.`);
  });
});

// ─── INICIALIZAÇÃO ─────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

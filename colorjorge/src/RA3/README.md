# ColorJorge

Jogo multiplayer de adivinhação de cores em tempo real. O mestre do jogo exibe cores e palavras-chave num projetor (p5.js), enquanto os jogadores respondem pelo celular via React. A comunicação acontece em tempo real via WebSocket, com autenticação JWT e persistência em MySQL.

---

## Estrutura de Pastas

```
ColorJorge/
├── colorjorge/                  # Front-end React (celulares dos jogadores)
│   ├── src/
│   │   ├── App.js               # Roteamento principal
│   │   ├── features/
│   │   │   ├── auth/            # Autenticação JWT
│   │   │   │   ├── useAuth.js       # Hook central de auth
│   │   │   │   ├── LoginForm.jsx    # Formulário de login
│   │   │   │   ├── LoginScreen.jsx  # Tela de login
│   │   │   │   ├── RotaProtegida.jsx # Guard de rotas
│   │   │   │   └── auth.css         # Estilos compartilhados de auth
│   │   │   ├── profile/         # Perfil do jogador
│   │   │   │   ├── ProfileForm.jsx       # Formulário de cadastro (2 steps)
│   │   │   │   ├── ProfileScreen.jsx     # Página de perfil
│   │   │   │   ├── CreateProfileScreen.jsx
│   │   │   │   └── ProfileScreen.css
│   │   │   ├── game/            # Lógica do jogo
│   │   │   │   ├── useWebSocket.js  # Hook de WebSocket com reconexão
│   │   │   │   ├── useRoom.js       # Hook de sala (contexto)
│   │   │   │   ├── RoomProvider.jsx # Provider de estado da sala
│   │   │   │   ├── GameShell.jsx    # Layout base de todas as telas
│   │   │   │   └── GameShell.css    # Fundo, grain overlay, variáveis CSS
│   │   │   ├── lobby/           # Tela de entrada na sala
│   │   │   ├── master/          # Tela do mestre (ColorBoard)
│   │   │   ├── board/           # Tabuleiro dos jogadores
│   │   │   └── scoreboard/      # Placar
│   │   └── components/ui/       # Componentes reutilizáveis
│   └── database/
│       ├── database.js          # Pool de conexões MySQL
│       └── colorjorge.sql       # Schema do banco
│
├── colorjorge-server/           # Back-end Node.js
│   ├── server.js                # Servidor Express + Socket.io
│   ├── uploads/fotos/           # Fotos de perfil salvas (gerado automaticamente)
│   ├── .env                     # Variáveis de ambiente (não vai pro git)
│   └── package.json
│
└── colorjorge-p5js/             # Projetor p5.js (tela grande)
```

---

## WebSocket

### Como está implementado

O projeto usa duas camadas de WebSocket: um hook de baixo nível (`useWebSocket.js`) que gerencia a conexão bruta, e o Socket.io no servidor que oferece eventos nomeados e salas.

**No servidor** (`colorjorge-server/server.js`), o Socket.io é inicializado sobre o mesmo servidor HTTP do Express:

```js
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
```

Isso significa que a porta 8080 serve tanto as rotas REST (`/api/...`) quanto as conexões WebSocket — não é necessário abrir uma segunda porta.

**No front-end**, o hook `useWebSocket.js` gerencia a conexão nativa do browser com reconexão automática exponencial:

```
Tentativa 1 → aguarda 1s
Tentativa 2 → aguarda 2s
Tentativa 3 → aguarda 4s
...máximo de 8s entre tentativas
```

O hook expõe quatro valores: `connectionStatus`, `connect`, `disconnect` e `send`. Os componentes nunca tocam no WebSocket diretamente — tudo passa pelo hook ou pelo `useRoom`.

### Como funciona o fluxo de um voto

```
Jogador clica em uma cor
        ↓
send({ tipo: 'enviar_voto', cor: '#ff0000' })
        ↓
Servidor recebe no evento 'enviar_voto'
        ↓
io.emit('atualizar_tela', { ...voto, jogador: socket.usuario.username })
        ↓
TODOS os clientes conectados recebem 'atualizar_tela'
        ↓
Projetor p5.js atualiza a tela em tempo real
```

### Autenticação no WebSocket

O Socket.io exige o token JWT no handshake antes de aceitar qualquer conexão. O middleware `io.use(...)` roda antes de qualquer evento:

```js
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Token não fornecido.'));
  try {
    socket.usuario = jwt.verify(token, JWT_SECRET);
    next(); // libera a conexão
  } catch {
    next(new Error('Token inválido ou expirado.'));
  }
});
```

Do lado do React, o token é enviado assim ao conectar:

```js
const socket = io('http://localhost:8080', {
  auth: { token: localStorage.getItem('cj_token') }
});
```

Após autenticado, `socket.usuario` fica disponível em todos os eventos daquele socket, então é possível saber quem enviou cada mensagem sem que o cliente precise informar o nome.

---

## Autenticação JWT

### Como está implementado

O fluxo completo de autenticação vive em três lugares: o servidor (geração e verificação do token), o hook `useAuth.js` (estado do usuário no React) e o componente `RotaProtegida.jsx` (proteção de rotas).

### Fluxo de login

```
1. Usuário envia email + senha para POST /api/login
2. Servidor busca o usuário no banco pelo email
3. bcrypt.compare() verifica a senha contra o hash armazenado
4. Se correto → jwt.sign() gera um token com { id, username, email }
5. Token retorna para o front-end
6. Front salva no localStorage com a chave 'cj_token'
7. Todas as requisições seguintes incluem: Authorization: Bearer <token>
```

O token expira em **8 horas** — tempo suficiente para uma sessão de jogo sem forçar relogin frequente.

### Verificação em rotas protegidas

O middleware `autenticar` é adicionado individualmente em cada rota que precisa de login:

```js
function autenticar(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
}

// Uso:
app.get('/api/eu', autenticar, async (req, res) => { ... });
app.get('/api/usuarios', autenticar, async (req, res) => { ... });
```

### Hook useAuth

O `useAuth.js` é o ponto central de autenticação no React. Ao montar, ele verifica automaticamente se há um token salvo e o valida contra a rota `/api/eu` — se o token estiver expirado, é removido do localStorage e o usuário é considerado deslogado.

```js
const { usuario, login, logout, getToken, carregando } = useAuth();
```

Para usar o token em qualquer `fetch` do app:

```js
fetch('/api/alguma-rota', {
  headers: { Authorization: `Bearer ${getToken()}` }
});
```

### Proteção de rotas no React

O componente `RotaProtegida` envolve qualquer rota que exige login. Enquanto o `useAuth` ainda está verificando o token (`carregando === true`), mostra uma mensagem de espera em vez de redirecionar incorretamente:

```jsx
// App.js
<Route path="/mestre" element={
  <RotaProtegida><MasterScreen /></RotaProtegida>
} />
```

Rotas públicas (login e criar perfil) ficam fora do `RotaProtegida` e são acessíveis sem token.

---

## Banco de Dados (MySQL + mysql2)

### Como está implementado

A conexão com o banco vive inteiramente em `colorjorge/database/database.js` e é compartilhada com o servidor via `require`. O servidor importa o pool e o usa diretamente nas rotas.

### Pool de conexões

Em vez de `createConnection` (que cria uma única conexão que pode cair), o projeto usa `createPool`:

```js
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'colorjorge',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

O pool mantém até 10 conexões abertas simultaneamente. Quando uma rota precisa do banco, pega uma conexão disponível do pool e a devolve automaticamente ao terminar — sem necessidade de abrir e fechar manualmente.

### Como usar nas rotas

O `mysql2/promise` permite `async/await` diretamente, sem callbacks:

```js
const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
```

O segundo argumento são os parâmetros, que o mysql2 escapa automaticamente — isso previne SQL injection sem nenhum esforço extra.

### Schema da tabela

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  senha      VARCHAR(255) NOT NULL,
  foto_path  VARCHAR(255) DEFAULT NULL,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Variáveis de ambiente

Todas as credenciais ficam no `.env` do servidor, nunca hardcoded:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=colorjorge
```

O `.env` está no `.gitignore` e não vai para o repositório.

---

## Upload de Imagem

### Como está implementado

O upload é feito com `multer`, um middleware Express especializado em `multipart/form-data`. A configuração define onde salvar, como nomear e quais arquivos aceitar:

```js
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/fotos/'),
  filename:    (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máx 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Somente imagens são permitidas.'));
  },
});
```

A pasta `uploads/fotos/` é criada automaticamente se não existir ao subir o servidor.

### Fluxo completo

```
1. Usuário seleciona a foto no ProfileForm
2. FormData é montado com username, email, senha e o arquivo
3. fetch POST /api/usuarios sem Content-Type (o browser define o boundary)
4. multer intercepta a requisição antes do handler da rota
5. Arquivo é salvo em colorjorge-server/uploads/fotos/1718000000-foto.jpg
6. req.file.filename fica disponível no handler
7. O caminho /uploads/fotos/arquivo.jpg é salvo na coluna foto_path do banco
8. O servidor serve os arquivos como estáticos via app.use('/uploads', express.static(...))
9. O front acessa a foto em http://localhost:8080/uploads/fotos/arquivo.jpg
```

O nome do arquivo usa `Date.now()` como prefixo para garantir unicidade mesmo que dois usuários façam upload de arquivos com o mesmo nome.

Se ocorrer qualquer erro após o arquivo ser salvo (por exemplo, e-mail duplicado no banco), o arquivo é removido do disco para não deixar lixo:

```js
if (req.file) fs.unlink(req.file.path, () => {});
```

---

## Formulário de Criação de Perfil

### Estrutura em 2 steps

O cadastro foi dividido em dois passos para não sobrecarregar o usuário com todos os campos de uma vez:

**Step 1 — Identidade**
- Nickname (nome de jogador)
- Foto de perfil (opcional)

**Step 2 — Acesso**
- E-mail
- Senha (mínimo 6 caracteres, com toggle de visibilidade)

O indicador de progresso no topo (dois pontos animados) deixa claro em qual step o usuário está. O botão "Voltar" no step 2 retorna ao step 1 sem perder os dados já digitados — o estado é mantido no React entre os steps.

### Manipulação de dados

O `ProfileForm` gerencia todo o estado localmente com `useState`. A foto é tratada com `useRef` para acionar o `<input type="file">` escondido ao clicar na área de preview, criando uma área clicável customizada em vez do input nativo feio do browser:

```js
const fotoRef = useRef(null);

// Usuário clica na área → aciona o input escondido
<div onClick={() => fotoRef.current.click()}>
  ...
</div>
<input ref={fotoRef} type="file" style={{ display: 'none' }} onChange={handleFoto} />
```

O preview da foto é gerado com `URL.createObjectURL(file)`, que cria uma URL temporária local sem precisar fazer upload antes de submeter.

### Login automático após cadastro

Após criar o perfil com sucesso, o formulário faz login automaticamente — o usuário não precisa preencher email e senha novamente na tela de login:

```js
// Cadastro OK → login imediato com as mesmas credenciais
const loginRes = await fetch(`/api/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha }),
});
const loginData = await loginRes.json();
localStorage.setItem('cj_token', loginData.token);
navigate('/perfil'); // redireciona direto para o perfil
```

---

## Front-end — Estrutura e Estilo

### GameShell como layout base

Todas as telas do app usam o `GameShell` como wrapper. Ele fornece o fundo com gradiente (azul escuro com toque roxo), o grain overlay (textura sutil de pontos) e a marca do projeto no canto. Qualquer nova tela só precisa:

```jsx
<GameShell panelLabel="Nome da tela" showNav={false}>
  <SeuConteudo />
</GameShell>
```

### Variáveis CSS

O `GameShell.css` define as variáveis que toda a aplicação usa:

```css
--panel-bg: rgba(55, 57, 65, 0.94);
--text-main: #f2f6ff;
--text-soft: #9ca6c6;
--accent:    #19d7ea;
```

### Fontes

O projeto usa duas fontes do Google Fonts:

- **Archivo Black** — títulos, nomes, códigos de sala. Peso único, impacto visual alto.
- **Manrope** — todo o resto. Usada em pesos 500 a 800 dependendo da hierarquia.

### auth.css — estilos compartilhados

O arquivo `auth.css` é importado tanto pelo `LoginForm` quanto pelo `ProfileForm`, centralizando os estilos dos campos, botões, mensagens de erro e animações das duas telas. Isso evita duplicação e garante consistência visual.

A animação de entrada (`fadeSlideUp`) é aplicada no `.auth-card` e roda toda vez que a tela é montada, dando sensação de transição suave entre login e cadastro.

### Organização por feature

Cada funcionalidade tem sua própria pasta dentro de `src/features/`. Componentes, hooks, contextos e estilos de uma feature ficam juntos — em vez de separar por tipo de arquivo (`/components`, `/hooks`, `/styles`). Isso facilita encontrar tudo relacionado a um mesmo domínio num só lugar.

```
features/
├── auth/       → tudo de login/logout/token
├── profile/    → criação e exibição de perfil
├── game/       → websocket, sala, contexto compartilhado
├── lobby/      → entrada na sala
├── master/     → tela do mestre do jogo
├── board/      → tabuleiro dos jogadores
└── scoreboard/ → placar
```

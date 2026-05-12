const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// ROTAS DE ARQUIVOS ESTÁTICOS (SEM INTERNET)

// Quando acessarem o IP do servidor (ex: 192.168.1.100), entrega o React
// Nota: O React precisará ser "buildado" (compilado) para gerar essa pasta 'build'
const caminhoReact = path.join(__dirname, '../colorjorge-react/build');
app.use('/', express.static(caminhoReact));

// Quando acessarem IP/projetor (ex: 192.168.1.100/projetor), entrega o p5.js
const caminhoP5 = path.join(__dirname, '../telaopc');
app.use('/projetor', express.static(caminhoP5));

const caminhoP5 = path.join(__dirname, '../telaopc');
app.use('/projetor', express.static(caminhoP5));


// COMUNICAÇÃO EM TEMPO REAL (WEBSOCKETS)

io.on('connection', (socket) => {
    console.log(`🟢 Novo dispositivo conectado! ID: ${socket.id}`);

    // Exemplo de como o servidor vai escutar o p5.js
    socket.on('projetor_conectado', () => {
        console.log('PROJETOR P5JS CONECTOU NO SERVIDOR');
    });

    // Exemplo de como o servidor vai escutar um celular enviando um voto
    socket.on('enviar_voto', (dadosDoVoto) => {
        console.log(`🎯 Voto recebido do jogador:`, dadosDoVoto);
        
        // Aqui entrará a lógica do GameController depois
        
        // O servidor avisa todo mundo (inclusive o p5.js) sobre o voto
        io.emit('atualizar_tela', dadosDoVoto); 
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Dispositivo desconectou: ${socket.id}`);
    });
});



// 3. INICIALIZAÇÃO DO SERVIDOR


const PORT = 8080;

// O '0.0.0.0' é a MÁGICA para funcionar no dispositivo da sua amiga. 
// Isso diz ao Node para aceitar conexões de toda a rede Wi-Fi local, e não apenas do próprio computador (localhost).
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando!`);
    console.log(`Projetor (p5.js): Acesse http://localhost:${PORT}/projetor no PC local`);
    console.log(`Celulares (React): Acesse http://[IP-DO-COMPUTADOR]:${PORT} no Wi-Fi`);
});
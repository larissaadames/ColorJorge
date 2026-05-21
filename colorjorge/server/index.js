const http = require('http');
const { WebSocketServer } = require('ws');
const { MESSAGE_TYPES, parseMessage, send } = require('./protocol');
const { createRoom, joinRoom, sendTip, sendAnswer, handleDisconnect } = require('./rooms');

const PORT = Number(process.env.PORT) || 8080;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ColorJorge WebSocket server');
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  ws.on('message', raw => {
    const message = parseMessage(raw.toString());

    if (!message) {
      send(ws, MESSAGE_TYPES.JOIN_ERROR, { message: 'Mensagem invalida.' });
      return;
    }

    switch (message.type) {
      case MESSAGE_TYPES.CREATE_ROOM:
        createRoom(ws);
        break;

      case MESSAGE_TYPES.JOIN_ROOM:
        joinRoom(ws, message.code, message.name);
        break;

      case MESSAGE_TYPES.SEND_TIP:
        sendTip(ws, message.keyword, message.drawnColor);
        break;

      case MESSAGE_TYPES.SEND_ANSWER:
        sendAnswer(ws, message.text);
        break;

      default:
        send(ws, MESSAGE_TYPES.JOIN_ERROR, { message: 'Tipo de mensagem desconhecido.' });
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws);
  });
});

server.listen(PORT, () => {
  console.log(`ColorJorge WebSocket server listening on port ${PORT}`);
});

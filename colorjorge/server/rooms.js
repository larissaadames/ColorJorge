const { randomBytes } = require('crypto');
const { MESSAGE_TYPES, ROLES, send } = require('./protocol');

const DEFAULT_DRAWN_COLOR = {
  code: 'F 29',
  hex: '#581299'
};

const rooms = new Map();
const connectionMeta = new WeakMap();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let i = 0; i < 4; i += 1) {
    const index = randomBytes(1)[0] % chars.length;
    code += chars[index];
  }

  if (rooms.has(code)) {
    return generateRoomCode();
  }

  return code;
}

function generatePlayerId() {
  return randomBytes(4).toString('hex');
}

function serializeRoomState(room) {
  return {
    code: room.code,
    drawnColor: room.drawnColor,
    keyword: room.keyword,
    answers: room.answers,
    players: Array.from(room.players.values()).map(player => ({
      id: player.id,
      name: player.name
    }))
  };
}

function broadcastRoom(room, type, payload) {
  if (room.master) {
    send(room.master, type, payload);
  }

  room.players.forEach((_player, ws) => {
    send(ws, type, payload);
  });
}

function createRoom(ws) {
  const code = generateRoomCode();
  const room = {
    code,
    master: ws,
    players: new Map(),
    drawnColor: { ...DEFAULT_DRAWN_COLOR },
    keyword: null,
    answers: []
  };

  rooms.set(code, room);
  connectionMeta.set(ws, { role: ROLES.MASTER, roomCode: code });

  send(ws, MESSAGE_TYPES.ROOM_CREATED, {
    code,
    drawnColor: room.drawnColor
  });

  send(ws, MESSAGE_TYPES.ROOM_STATE, serializeRoomState(room));
}

function joinRoom(ws, code, name) {
  const normalizedCode = String(code || '')
    .trim()
    .toUpperCase();
  const room = rooms.get(normalizedCode);

  if (!room) {
    send(ws, MESSAGE_TYPES.JOIN_ERROR, { message: 'Sala nao encontrada.' });
    return;
  }

  const playerId = generatePlayerId();
  const player = { id: playerId, name: name?.trim() || null };

  room.players.set(ws, player);
  connectionMeta.set(ws, { role: ROLES.PLAYER, roomCode: normalizedCode, playerId });

  send(ws, MESSAGE_TYPES.ROOM_STATE, serializeRoomState(room));

  if (room.master) {
    send(room.master, MESSAGE_TYPES.PLAYER_JOINED, {
      playerId: player.id,
      name: player.name
    });
  }
}

function sendTip(ws, keyword, drawnColor) {
  const meta = connectionMeta.get(ws);
  if (!meta || meta.role !== ROLES.MASTER) {
    return;
  }

  const room = rooms.get(meta.roomCode);
  if (!room) {
    return;
  }

  const cleanKeyword = String(keyword || '').trim();
  if (!cleanKeyword) {
    return;
  }

  room.keyword = cleanKeyword;

  if (drawnColor?.code && drawnColor?.hex) {
    room.drawnColor = {
      code: drawnColor.code,
      hex: drawnColor.hex
    };
  }

  broadcastRoom(room, MESSAGE_TYPES.TIP_UPDATED, {
    keyword: room.keyword,
    drawnColor: room.drawnColor
  });
}

function sendAnswer(ws, text) {
  const meta = connectionMeta.get(ws);
  if (!meta || meta.role !== ROLES.PLAYER) {
    return;
  }

  const room = rooms.get(meta.roomCode);
  if (!room) {
    return;
  }

  const cleanText = String(text || '').trim();
  if (!cleanText) {
    return;
  }

  const answer = {
    playerId: meta.playerId,
    text: cleanText,
    at: new Date().toISOString()
  };

  room.answers.push(answer);
  broadcastRoom(room, MESSAGE_TYPES.ANSWER_RECEIVED, answer);
}

function handleDisconnect(ws) {
  const meta = connectionMeta.get(ws);
  if (!meta) {
    return;
  }

  const room = rooms.get(meta.roomCode);
  if (!room) {
    connectionMeta.delete(ws);
    return;
  }

  if (meta.role === ROLES.MASTER) {
    room.master = null;
    broadcastRoom(room, MESSAGE_TYPES.ROOM_STATE, serializeRoomState(room));

    if (room.players.size === 0) {
      rooms.delete(meta.roomCode);
    }
  } else {
    room.players.delete(ws);

    if (!room.master && room.players.size === 0) {
      rooms.delete(meta.roomCode);
    }
  }

  connectionMeta.delete(ws);
}

module.exports = {
  createRoom,
  joinRoom,
  sendTip,
  sendAnswer,
  handleDisconnect
};

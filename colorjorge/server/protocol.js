const MESSAGE_TYPES = {
  CREATE_ROOM: 'create_room',
  ROOM_CREATED: 'room_created',
  JOIN_ROOM: 'join_room',
  JOIN_ERROR: 'join_error',
  ROOM_STATE: 'room_state',
  SEND_TIP: 'send_tip',
  TIP_UPDATED: 'tip_updated',
  SEND_ANSWER: 'send_answer',
  ANSWER_RECEIVED: 'answer_received',
  PLAYER_JOINED: 'player_joined'
};

const ROLES = {
  MASTER: 'master',
  PLAYER: 'player'
};

function parseMessage(raw) {
  try {
    const message = JSON.parse(raw);
    if (!message || typeof message.type !== 'string') {
      return null;
    }
    return message;
  } catch {
    return null;
  }
}

function send(ws, type, payload = {}) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type, ...payload }));
  }
}

module.exports = {
  MESSAGE_TYPES,
  ROLES,
  parseMessage,
  send
};

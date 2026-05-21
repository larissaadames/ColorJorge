import { GameContext } from './RoomProvider';

const defaultMockRoomValue = {
  connectionStatus: 'idle',
  roomCode: null,
  role: null,
  drawnColor: { code: 'F 29', hex: '#581299' },
  keyword: null,
  answers: [],
  players: [],
  error: null,
  isConnected: false,
  createRoom: jest.fn(),
  joinRoom: jest.fn(),
  sendTip: jest.fn(),
  sendAnswer: jest.fn(),
  setKeyword: jest.fn(),
  disconnect: jest.fn()
};

export function createMockRoomValue(overrides = {}) {
  return {
    ...defaultMockRoomValue,
    ...overrides
  };
}

export function MockRoomProvider({ children, value = defaultMockRoomValue }) {
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

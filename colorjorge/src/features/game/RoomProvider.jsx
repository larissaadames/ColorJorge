import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocket } from './useWebSocket';

const DEFAULT_DRAWN_COLOR = {
  code: 'F 29',
  hex: '#581299'
};

export const GameContext = createContext(null);
export const RoomContext = GameContext;

export function RoomProvider({ children }) {
  const [shouldConnect, setShouldConnect] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [role, setRole] = useState(null);
  const [drawnColor, setDrawnColor] = useState(DEFAULT_DRAWN_COLOR);
  const [keyword, setKeyword] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const pendingActionRef = useRef(null);
  const pendingJoinCodeRef = useRef(null);

  const handleMessage = useCallback(message => {
    switch (message.type) {
      case 'room_created':
        setRoomCode(message.code);
        setDrawnColor(message.drawnColor ?? DEFAULT_DRAWN_COLOR);
        setError(null);
        break;

      case 'room_state':
        setRoomCode(message.code ?? null);
        setDrawnColor(message.drawnColor ?? DEFAULT_DRAWN_COLOR);
        setKeyword(message.keyword ?? null);
        setAnswers(message.answers ?? []);
        setPlayers(message.players ?? []);
        setError(null);
        break;

      case 'tip_updated':
        setKeyword(message.keyword ?? null);
        if (message.drawnColor) {
          setDrawnColor(message.drawnColor);
        }
        break;

      case 'answer_received':
        setAnswers(current => [...current, message]);
        break;

      case 'player_joined':
        setPlayers(current => {
          if (current.some(player => player.id === message.playerId)) {
            return current;
          }

          return [...current, { id: message.playerId, name: message.name ?? null }];
        });
        break;

      case 'join_error':
        setError(message.message ?? 'Erro ao entrar na sala.');
        setRoomCode(null);
        setRole(null);
        pendingActionRef.current = null;
        pendingJoinCodeRef.current = null;
        setShouldConnect(false);
        break;

      default:
        break;
    }
  }, []);

  const { connectionStatus, send, disconnect } = useWebSocket({
    enabled: shouldConnect,
    onMessage: handleMessage
  });

  useEffect(() => {
    if (connectionStatus !== 'connected' || !pendingActionRef.current) {
      return;
    }

    if (pendingActionRef.current === 'create') {
      send({ type: 'create_room', role: 'master' });
      pendingActionRef.current = null;
      return;
    }

    if (pendingActionRef.current === 'join' && pendingJoinCodeRef.current) {
      send({ type: 'join_room', code: pendingJoinCodeRef.current, role: 'player' });
      pendingActionRef.current = null;
    }
  }, [connectionStatus, send]);

  const createRoom = useCallback(() => {
    setError(null);
    setRole('master');
    setRoomCode(null);
    setKeyword(null);
    setAnswers([]);
    setPlayers([]);
    pendingActionRef.current = 'create';
    setShouldConnect(true);
  }, []);

  const joinRoom = useCallback(code => {
    const normalizedCode = String(code || '')
      .trim()
      .toUpperCase();

    if (!normalizedCode) {
      setError('Informe o codigo da sala.');
      return;
    }

    setError(null);
    setRole('player');
    setKeyword(null);
    setAnswers([]);
    setPlayers([]);
    pendingJoinCodeRef.current = normalizedCode;
    pendingActionRef.current = 'join';
    setShouldConnect(true);
  }, []);

  const sendTip = useCallback(
    tipKeyword => {
      const cleanKeyword = String(tipKeyword || '').trim();
      if (!cleanKeyword) {
        return;
      }

      send({
        type: 'send_tip',
        keyword: cleanKeyword,
        drawnColor
      });
    },
    [drawnColor, send]
  );

  const sendAnswer = useCallback(
    text => {
      const cleanText = String(text || '').trim();
      if (!cleanText) {
        return;
      }

      send({ type: 'send_answer', text: cleanText });
    },
    [send]
  );

  const resetSession = useCallback(() => {
    pendingActionRef.current = null;
    pendingJoinCodeRef.current = null;
    disconnect();
    setShouldConnect(false);
    setRoomCode(null);
    setRole(null);
    setDrawnColor(DEFAULT_DRAWN_COLOR);
    setKeyword(null);
    setAnswers([]);
    setPlayers([]);
    setError(null);
  }, [disconnect]);

  const value = useMemo(
    () => ({
      connectionStatus,
      roomCode,
      role,
      drawnColor,
      keyword,
      answers,
      players,
      error,
      isConnected: connectionStatus === 'connected' && Boolean(roomCode),
      createRoom,
      joinRoom,
      sendTip,
      sendAnswer,
      setKeyword: sendTip,
      disconnect: resetSession
    }),
    [
      answers,
      connectionStatus,
      createRoom,
      drawnColor,
      error,
      joinRoom,
      keyword,
      players,
      resetSession,
      role,
      roomCode,
      sendAnswer,
      sendTip
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const GameProvider = RoomProvider;

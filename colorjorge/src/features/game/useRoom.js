import { useContext } from 'react';
import { GameContext } from './RoomProvider';

export function useRoom() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useRoom must be used inside RoomProvider');
  }

  return context;
}

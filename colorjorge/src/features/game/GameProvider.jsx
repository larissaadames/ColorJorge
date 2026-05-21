import { createContext, useMemo, useState } from 'react';

const DEFAULT_DRAWN_COLOR = {
  code: 'F 29',
  hex: '#581299'
};

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [keyword, setKeyword] = useState(null);

  const value = useMemo(
    () => ({
      drawnColor: DEFAULT_DRAWN_COLOR,
      keyword,
      setKeyword
    }),
    [keyword]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// src/gameLogic.js
export const BOARD_CONFIG = {
  linhas: 16,
  colunas: 16,
  corFundo: 26,
  offset: 30,
};

// Centralizamos a lógica de cor aqui para ser idêntica em todo lugar
export const getSquareColor = (p5, i, j, colunas, linhas) => {
  let r = p5.map(i, 0, colunas, 0, 255);
  let g = p5.map(j, 0, linhas, 0, 255);
  return { r, g, b: 100 };
};
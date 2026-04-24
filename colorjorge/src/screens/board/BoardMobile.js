import React, { useState } from 'react';
import Sketch from 'react-p5';
import { BOARD_CONFIG, getSquareColor } from '../../gameLogic'; // Importa a lógica central

function BoardMobile() {
  const { linhas, colunas, offset } = BOARD_CONFIG;
  let CSquares = [];

  const setup = (p5, canvasParentRef) => {
    const screenWidth = Math.min(p5.windowWidth - 40, 500);
    p5.createCanvas(screenWidth, screenWidth).parent(canvasParentRef);
    
    const gap = (screenWidth - offset) / colunas;

    for (let i = 0; i < colunas; i++) {
      CSquares[i] = [];
      for (let j = 0; j < linhas; j++) {
        const { r, g, b } = getSquareColor(p5, i, j, colunas, linhas);
        CSquares[i][j] = {
          x: offset + (i * gap),
          y: offset + (j * gap),
          size: gap,
          r, g, b
        };
      }
    }
  };

  const draw = (p5) => {
    p5.background(BOARD_CONFIG.corFundo);
    const gap = (p5.width - offset) / colunas;

    // Legendas (usando as variáveis do arquivo central)
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(200);
    for (let i = 0; i < colunas; i++) {
      p5.text(String.fromCharCode(65 + i), offset + (i * gap) + (gap / 2), offset / 2);
    }
    for (let j = 0; j < linhas; j++) {
      p5.text(j + 1, offset / 2, offset + (j * gap) + (gap / 2));
    }

    // Desenho dos quadrados
    for (let i = 0; i < colunas; i++) {
      for (let j = 0; j < linhas; j++) {
        const s = CSquares[i][j];
        p5.fill(s.r, s.g, s.b);
        p5.noStroke();
        p5.rect(s.x, s.y, s.size, s.size);
      }
    }
  };
  const mousePressed = (p5) => {
    const screenWidth = p5.width;
    const gap = (screenWidth - offset) / colunas;
    
    // Ajustamos a detecção do clique subtraindo o offset
    let i = Math.floor((p5.mouseX - offset) / gap);
    let j = Math.floor((p5.mouseY - offset) / gap);

    if (i >= 0 && i < colunas && j >= 0 && j < linhas) {
      const letra = String.fromCharCode(65 + i);
      const numero = j + 1;
      console.log(`Coordenada: ${letra}${numero}`);
    }
  };

  return (
    <GameShell panelLabel="Seleção de Cores">
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />
      </div>
    </GameShell>
  );
}

export default BoardMobile;
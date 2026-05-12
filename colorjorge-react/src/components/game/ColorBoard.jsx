/**
 * ColorBoard.jsx
 * Componente isolado do tabuleiro de "Cores com Dicas"
 * 
 * Props:
 *   players      – array de { name: string }
 *   clue         – { coord: "B3", text: "O mar raso das Maldivas" }
 *   votes        – { [playerIdx]: coord } — votos já registrados nesta rodada
 *   onVote       – (playerIdx, coord) => void
 *   phase        – "voting" | "reveal"
 *   correctCoord – string (apenas em phase="reveal")
 *   disabled     – bool
 */

import Sketch from "react-p5";
import { useRef, useCallback } from "react";

// ─── Dados da Grade ──────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 7;
const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
const CELL_SIZE = 54;
const HEADER = 28;

// Paleta de cores graduais (espectro completo, igual ao jogo físico)
// Cada linha tem seu próprio matiz base e varia em saturação/brilho ao longo das colunas
function buildGradientPalette(p5) {
  const palette = [];
  const rowHues = [0, 30, 60, 120, 180, 240, 300]; // vermelho → laranja → amarelo → verde → ciano → azul → magenta

  for (let r = 0; r < ROWS; r++) {
    const row = [];
    const baseHue = rowHues[r];
    for (let c = 0; c < COLS; c++) {
      // Varia o matiz levemente ao longo da coluna (+/- 18 graus)
      // e a luminosidade de escuro→claro→escuro (arco)
      const hShift = p5.map(c, 0, COLS - 1, -18, 18);
      const h = (baseHue + hShift + 360) % 360;
      // Luminosidade: forma de sino — mais claro no meio
      const lumCenter = 0.5 + 0.18 * Math.cos(Math.PI * ((c / (COLS - 1)) - 0.5) * 2);
      const s = 0.82 - 0.08 * Math.abs(c / (COLS - 1) - 0.5);

      // Converte HSL → RGB
      const [rr, gg, bb] = hslToRgb(h / 360, s, lumCenter);
      row.push({ r: rr, g: gg, b: bb });
    }
    palette.push(row);
  }
  return palette;
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function coordToIndex(coord) {
  // "B3" → { row: 1, col: 2 }
  const letter = coord[0].toUpperCase();
  const num = parseInt(coord.slice(1), 10) - 1;
  const row = LETTERS.indexOf(letter);
  return { row, col: num };
}

function indexToCoord(row, col) {
  return `${LETTERS[row]}${col + 1}`;
}

// Luminância para decidir cor do texto sobre a célula
function luminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Cores de marcador por jogador
const PLAYER_MARKERS = [
  [230, 60, 60],   // vermelho-jogador
  [50, 140, 240],  // azul
  [40, 200, 100],  // verde
  [240, 180, 20],  // amarelo
  [200, 80, 220],  // roxo
  [255, 130, 30],  // laranja
];

// ─── Componente ──────────────────────────────────────────────────────────────
export default function ColorBoard({
  players = [],
  clue = null,
  votes = {},
  onVote,
  phase = "voting",
  correctCoord = null,
  disabled = false,
}) {
  const paletteRef = useRef(null);
  const hoverRef = useRef(null);

  const canvasW = HEADER + COLS * CELL_SIZE;
  const canvasH = HEADER + ROWS * CELL_SIZE;

  const setup = useCallback((p5, canvasParentRef) => {
    p5.createCanvas(canvasW, canvasH).parent(canvasParentRef);
    p5.colorMode(p5.RGB);
    p5.textFont("monospace");
    p5.noLoop(); // redesenha só quando necessário
    paletteRef.current = buildGradientPalette(p5);
  }, [canvasW, canvasH]);

  const draw = useCallback((p5) => {
    if (!paletteRef.current) return;
    const palette = paletteRef.current;
    p5.background(18, 18, 20);

    // ── Cabeçalhos de coluna (números) ──────────────────────────────────────
    p5.fill(120);
    p5.noStroke();
    p5.textSize(11);
    p5.textAlign(p5.CENTER, p5.CENTER);
    for (let c = 0; c < COLS; c++) {
      p5.text(c + 1, HEADER + c * CELL_SIZE + CELL_SIZE / 2, HEADER / 2);
    }

    // ── Cabeçalhos de linha (letras) ────────────────────────────────────────
    for (let r = 0; r < ROWS; r++) {
      p5.text(LETTERS[r], HEADER / 2, HEADER + r * CELL_SIZE + CELL_SIZE / 2);
    }

    // ── Células da grade ────────────────────────────────────────────────────
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const { r: cr, g: cg, b: cb } = palette[r][c];
        const x = HEADER + c * CELL_SIZE;
        const y = HEADER + r * CELL_SIZE;
        const coord = indexToCoord(r, c);

        const isCorrect = phase === "reveal" && coord === correctCoord;
        const isHover = hoverRef.current === coord && !disabled;

        // Bordas de hover/correto
        if (isCorrect) {
          p5.stroke(255, 255, 255);
          p5.strokeWeight(3);
        } else if (isHover) {
          p5.stroke(255, 255, 255, 160);
          p5.strokeWeight(2);
        } else {
          p5.stroke(30, 30, 32);
          p5.strokeWeight(1);
        }

        // Preenchimento com gradiente
        p5.fill(cr, cg, cb);
        p5.rect(x, y, CELL_SIZE, CELL_SIZE);

        // ── Marcadores de votos dos jogadores ──────────────────────────────
        const playersWhoVotedHere = Object.entries(votes).filter(([, vc]) => vc === coord);

        if (playersWhoVotedHere.length > 0) {
          const markerSize = Math.min(14, CELL_SIZE / (playersWhoVotedHere.length + 1));
          playersWhoVotedHere.forEach(([pidxStr], i) => {
            const pidx = parseInt(pidxStr, 10);
            const [mr, mg, mb] = PLAYER_MARKERS[pidx % PLAYER_MARKERS.length];
            const mx = x + 4 + i * (markerSize + 2);
            const my = y + 4;
            p5.fill(mr, mg, mb);
            p5.noStroke();
            p5.ellipse(mx + markerSize / 2, my + markerSize / 2, markerSize, markerSize);
            // Inicial do jogador dentro do círculo
            const lum = luminance(mr, mg, mb);
            p5.fill(lum > 140 ? 30 : 240);
            p5.textSize(7);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text((players[pidx]?.name?.[0] ?? "?").toUpperCase(), mx + markerSize / 2, my + markerSize / 2);
          });
        }

        // ── Reveal: cubo de gabarito ────────────────────────────────────────
        if (phase === "reveal" && isCorrect) {
          // Brilho pulsante ao redor da célula correta
          p5.noFill();
          p5.stroke(255, 255, 100, 200);
          p5.strokeWeight(3);
          p5.rect(x - 2, y - 2, CELL_SIZE + 4, CELL_SIZE + 4, 4);

          // Feedback de acerto/erro para cada jogador
          const allVoters = Object.entries(votes);
          if (allVoters.length > 0) {
            const correct = allVoters.filter(([, vc]) => vc === coord);
            const wrong = allVoters.filter(([, vc]) => vc !== coord);

            // Marca os errados
            wrong.forEach(([pidxStr, wrongCoord]) => {
              const { row: wr, col: wc } = coordToIndex(wrongCoord);
              const wx = HEADER + wc * CELL_SIZE;
              const wy = HEADER + wr * CELL_SIZE;
              const [mr, mg, mb] = PLAYER_MARKERS[parseInt(pidxStr, 10) % PLAYER_MARKERS.length];

              // Cruz vermelha sobre a escolha errada
              p5.stroke(255, 50, 50, 220);
              p5.strokeWeight(2.5);
              p5.line(wx + 6, wy + 6, wx + CELL_SIZE - 6, wy + CELL_SIZE - 6);
              p5.line(wx + CELL_SIZE - 6, wy + 6, wx + 6, wy + CELL_SIZE - 6);

              // Seta apontando para o correto
              drawArrow(p5,
                wx + CELL_SIZE / 2, wy + CELL_SIZE / 2,
                x + CELL_SIZE / 2, y + CELL_SIZE / 2,
                mr, mg, mb
              );
            });
          }

          // Checkmark sobre o correto
          p5.stroke(60, 240, 100, 230);
          p5.strokeWeight(3);
          p5.noFill();
          const cx = x + CELL_SIZE / 2;
          const cy = y + CELL_SIZE / 2;
          p5.line(cx - 10, cy, cx - 3, cy + 8);
          p5.line(cx - 3, cy + 8, cx + 10, cy - 8);
        }

        // ── Coordenada no canto ─────────────────────────────────────────────
        const lum = luminance(cr, cg, cb);
        p5.noStroke();
        p5.fill(lum > 140 ? 0 : 255, lum > 140 ? 0 : 255, lum > 140 ? 0 : 255, 80);
        p5.textSize(9);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(coord, x + 3, y + 3);
      }
    }
  }, [votes, phase, correctCoord, players, disabled]);

  // Redesenha quando props mudam
  const drawRef = useRef(draw);
  drawRef.current = draw;

  const mouseMoved = useCallback((p5) => {
    const col = Math.floor((p5.mouseX - HEADER) / CELL_SIZE);
    const row = Math.floor((p5.mouseY - HEADER) / CELL_SIZE);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const coord = indexToCoord(row, col);
      if (hoverRef.current !== coord) {
        hoverRef.current = coord;
        p5.redraw();
      }
    } else {
      if (hoverRef.current !== null) {
        hoverRef.current = null;
        p5.redraw();
      }
    }
  }, []);

  const mouseClicked = useCallback((p5) => {
    if (disabled || phase === "reveal") return;
    const col = Math.floor((p5.mouseX - HEADER) / CELL_SIZE);
    const row = Math.floor((p5.mouseY - HEADER) / CELL_SIZE);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const coord = indexToCoord(row, col);
      if (onVote) onVote(coord);
    }
  }, [disabled, phase, onVote]);

  // Força redraw quando votes/phase muda
  const sketchRef = useRef(null);

  return (
    <div style={{ display: "inline-block", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.6)" }}>
      <Sketch
        setup={setup}
        draw={(p5) => { drawRef.current(p5); }}
        mouseMoved={mouseMoved}
        mouseClicked={mouseClicked}
        ref={sketchRef}
      />
    </div>
  );
}

// ── Utilitário: seta de A → B ──────────────────────────────────────────────
function drawArrow(p5, x1, y1, x2, y2, r, g, b) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 20) return;
  const nx = dx / dist, ny = dy / dist;
  const startX = x1 + nx * 20, startY = y1 + ny * 20;
  const endX = x2 - nx * 20, endY = y2 - ny * 20;

  p5.stroke(r, g, b, 200);
  p5.strokeWeight(1.5);
  p5.line(startX, startY, endX, endY);

  // Ponta da seta
  const angle = Math.atan2(endY - startY, endX - startX);
  const hs = 8;
  p5.fill(r, g, b, 200);
  p5.noStroke();
  p5.triangle(
    endX, endY,
    endX - hs * Math.cos(angle - 0.5), endY - hs * Math.sin(angle - 0.5),
    endX - hs * Math.cos(angle + 0.5), endY - hs * Math.sin(angle + 0.5)
  );
}


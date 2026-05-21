const CSquares = [];
const linhas = 30;
const colunas = 30;
const gap = 50;

class Table {
  gerar(x, y) {
    for (let i = 0; i < colunas; i++) {
      CSquares[i] = [];

      for (let j = 0; j < linhas; j++) {
        const r = map(i, 0, colunas, 0, 255);
        const g = map(j, 0, linhas, 0, 255);
        const b = 100;

        const cs = new ColorSquare({
          x: i * gap + x,
          y: j * gap + y,
          size: 50,
          r,
          g,
          b,
          linha: i,
          coluna: j
        });

        CSquares[i][j] = cs;
      }
    }
  }

  draw() {
    for (let i = 0; i < colunas; i++) {
      for (let j = 0; j < linhas; j++) {
        CSquares[i][j].draw();
      }
    }
  }
}

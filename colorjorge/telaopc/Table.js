let CSquares = [];
const linhas = 30;
const colunas = 30;
const gap = 50;

class Table {
  gerar(x,y){


    for (let i = 0; i < colunas; i++) {
      CSquares[i] = [];

      for (let j = 0; j < linhas; j++) {
        
        let r = map(i,0,colunas,0,255)
        let g = map(j,0,linhas,0,255)
        let b = 100
        
        // isso aqui cria meio que um "pacote" com as configurações do quadrado
        // que ele acessa dentro do quadrado
        let cs = new ColorSquare({
          x: i * gap + x,
          y: j * gap + y,
          size: 50,
          
          r: r, g: g, b: b,
          // cor: j * 10 + i * 10,
          linha: i,
          coluna: j,
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

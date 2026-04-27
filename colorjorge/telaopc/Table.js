// ESSA CLASSE É O TABULEIRO EM SI, A GRID DE ColorSquares
// CADA QUADRADO É UM OBJETO DA CLASSE ColorSquare

class Table {
  constructor(x,y){
    this.CSquares = []
    this.linhas = 10;
    this.colunas = 10;
    this.gap = 40; // se o this.gap for igual o tamanho do quadrado ele fica grudado
    this.x = x
    this.y = y
    
    for (let i = 0; i < this.colunas; i++) {
      this.CSquares[i] = [];

      for (let j = 0; j < this.linhas; j++) {
        
        let r = map(i,0,this.colunas,0,255)
        let g = map(j,0,this.linhas,0,255)
        let b = 100
        
        // isso aqui cria meio que um "pacote" com as configurações do quadrado
        // que ele acessa dentro do quadrado
        let cs = new ColorSquare({
          x: i * this.gap + x,
          y: j * this.gap + y,
          size: 40,
          
          r: r, g: g, b: b,
          // cor: j * 10 + i * 10,
          linha: i,
          coluna: j,
        });

        this.CSquares[i][j] = cs;
      }
    }
  }
  

  draw() {
    for (let i = 0; i < this.colunas; i++) {
      for (let j = 0; j < this.linhas; j++) {
        this.CSquares[i][j].draw();
      }
    }
  }
  
  squareMatch(x,y){
    // fazer funcao q acha o quadrado daquela coordenada, retorna o obj quadrado
    // ---tratar multiplos inputs ao "mesmo tempo": fazer um stream eu acho
    // 
    // percorre todos os quadrados
    for (let i = 0; i < this.colunas; i++) {
      for (let j = 0; j < this.linhas; j++) {
        // e ve se o x e y ta dentro do quadrado
        let cs = this.CSquares[i][j].checarMatch(x,y)
        
        // tem q checar pra ver se nao é nulo,
        // se nao for nulo ai devolve o quadrado
        if(cs){
          return cs
        }
        
      }
    }
  }
  
  
  
  getRightX(){
    return this.CSquares[this.colunas-1][0].x + this.CSquares[this.colunas-1][0].size
  }
  
  getBottomY(){
    return this.CSquares[0][this.linhas-1].y + this.CSquares[0][this.linhas-1].size
  }
}

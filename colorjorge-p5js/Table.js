// ESSA CLASSE É O TABULEIRO EM SI, A GRID DE ColorSquares
// CADA QUADRADO É UM OBJETO DA CLASSE ColorSquare

class Table {
  constructor(x,y){
    this.CSquares = []
    this.linhas = 10;
    this.colunas = 10;
    this.gap = 30; // se o this.gap for igual o tamanho do quadrado ele fica grudado
    this.x = x
    this.y = y
    
    for (let j = 0; j < this.colunas; j++) {
      this.CSquares[j] = [];

      for (let i = 0; i < this.linhas; i++) {
        
        let r = map(j,0,this.colunas,0,255)
        let g = map(i,0,this.linhas,0,255)
        let b = 75
        
        // isso aqui cria meio que um "pacote" com as configurações do quadrado
        // que ele acessa dentro do quadrado
        let cs = new ColorSquare({
          x: j * this.gap + x,
          y: i * this.gap + y,
          size: 30,
          
          r: r, g: g, b: b,
          // cor: i * 10 + j * 10,
          linha: i,
          coluna: j,
        });

        this.CSquares[j][i] = cs;
      }
    }
  }
  

  draw() {
    // desenha os quadrados
    for (let j = 0; j < this.colunas; j++) {
      for (let i = 0; i < this.linhas; i++) {
        this.CSquares[j][i].draw();
      }
    }
    
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(0); 

  // desenha os numeros das colunas
  for (let j = 0; j < this.colunas; j++) {
    // j + 1 para começar do "1" em vez do "0"
    let txt = j + 1; 
    let posX = this.x + (j * this.gap) + (this.gap / 2);
    let posY = this.y - 20;
    text(txt, posX, posY);
  }

  // desenha as letras das linhas
  for (let i = 0; i < this.linhas; i++) {
    // 65 é 'A' em ASCII
    let letra = String.fromCharCode(65 + i); 
    let posX = this.x - 20;
    let posY = this.y + (i * this.gap) + (this.gap / 2);
    text(letra, posX, posY);
  }

  }
  
  squareMatch(x,y){
    // fazer funcao q acha o quadrado daquela coordenada, retorna o obj quadrado
    // ---tratar multiplos inputs ao "mesmo tempo": fazer um stream eu acho
    // 
    // percorre todos os quadrados
    for (let j = 0; j < this.colunas; j++) {
      for (let i = 0; i < this.linhas; i++) {
        // e ve se o x e y ta dentro do quadrado
        let cs = this.CSquares[j][i].checarMatch(x,y)
        
        // tem q checar pra ver se nao é nulo,
        // se nao for nulo ai devolve o quadrado
        if(cs){
          return cs
        }
        
      }
    }
  }
  
  
  
  getRightX(){
    return this.x + (this.colunas * this.gap);
  }
  
  getBottomY(){
    return this.y + (this.linhas * this.gap);
  }
}

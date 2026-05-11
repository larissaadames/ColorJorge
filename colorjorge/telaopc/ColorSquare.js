class ColorSquare {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
    this.r = config.r;
    this.g = config.g;
    this.b = config.b;
    this.lin = config.linha;
    this.col = config.coluna;
    
    // noStroke();
    // stroke(0,0,0,10)
    // strokeWeight(2)
    

    this.id = `${this.lin}-${this.col}`;
    // NAO ESTOU USANDO ID PARA MAIS NADA ALEM DESSA STRING
    // PARA TRATAR VOTOS E POSICOES ESTOU USANDO LINHAS E COLUNAS
  }

  checarMatch(x, y) {
    if (
      x > this.x && x < this.x + this.size &&
      y > this.y && y < this.y + this.size
    ) {
      console.log("x: ", x," e y: ", y, " está dentro de ", this.id)
      this.g = 0
      return this;
    }
  }

  update() {}

  draw() {
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.size, this.size);
  }
}

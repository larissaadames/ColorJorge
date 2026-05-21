/// <reference types="p5/global" />

type ColorSquareConfig = {
  x: number;
  y: number;
  size: number;
  r: number;
  g: number;
  b: number;
  linha: number;
  coluna: number;
};

class ColorSquare {
  x: number;
  y: number;
  size: number;
  r: number;
  g: number;
  b: number;
  lin: number;
  col: number;
  id: string;

  constructor(config: ColorSquareConfig) {
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
    this.r = config.r;
    this.g = config.g;
    this.b = config.b;
    this.lin = config.linha;
    this.col = config.coluna;

    this.id = `${this.lin}-${this.col}`;
  }

  update() {}

  draw() {
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.size, this.size);
  }
}

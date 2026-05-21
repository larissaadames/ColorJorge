let fc = false;
let table;

function setup() {
  createCanvas(1920, 1080);
  fc = false;
}

function draw() {
  background(220);
  table = new Table();
  table.gerar(50, 50);
  table.draw();
}

function keyPressed() {
  if (key.toLowerCase() === 'f') {
    fc = !fc;
    fullscreen(fc);
  }
}

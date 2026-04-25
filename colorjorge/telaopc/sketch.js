let fc = false;
const debugAtivo = true;

function setup() {
  createCanvas(1920, 1080);
  
  gc = new GameController();
  
  table = new Table();
  table.gerar(50,50);
  
  if(debugAtivo) {
    debug = new Debug();
    debug.iniciar();
    }
}

function draw() {
  background(220);
  
  table.draw();
  
}

function keyPressed(){
  if(key.toLowerCase() == 'f'){
    
    fc = !fc
    fullscreen(fc)
    
  }
}

function mouseClicked(){
    table.squareMatch(mouseX,mouseY)
}
  
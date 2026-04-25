let fc = false;
const debugAtivo = true;

function setup() {
  createCanvas(1920, 1080);
  
  gc = new GameController();
  
  table = new Table();
  table.gerar(100,100);
  
  if(debugAtivo) {
    debug = new Debug();
    debug.iniciar();
    }

}

function draw() {
  dt = deltaTime / 1000;
  background(220);
  
  table.draw();
  
  gc.turnoController()
  gc.update();
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
  
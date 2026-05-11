let fc = false;
const debugAtivo = false;

function setup() {
  createCanvas(1920, 1080);
  
  table = new Table(100,100);
  
  gc = new GameController();
  vc = new ViewController();

  
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
  
  vc.draw();
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
  
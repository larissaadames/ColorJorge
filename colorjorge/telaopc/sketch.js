let fc = false;

function setup() {
  createCanvas(3000, 20000);
  let fc = false;
}

function draw() {
  background(220);
  
  table = new Table();
  
  table.gerar(50,50);
  table.draw();
}

function keyPressed(){
  if(key.toLowerCase() == 'f'){
    
    fc = !fc
    fullscreen(fc)
    
  }
}
  
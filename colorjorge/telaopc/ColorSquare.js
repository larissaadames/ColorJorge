class ColorSquare {
  
  constructor(config){
    this.x = config.x
    this.y = config.y
    this.size = config.size
    this.r = config.r
    this.g = config.g
    this.b = config.b
    this.lin = config.linha
    this.col = config.coluna
    
    this.id = `${this.lin}-${this.col}`
  }
  
  update() {
    
  }
  
  draw() {
    
    fill(this.r,this.g,this.b)
    rect(this.x,this.y,this.size,this.size)
    
  }
  
}
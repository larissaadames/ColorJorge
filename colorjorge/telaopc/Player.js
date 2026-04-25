class Player{
  
  constructor(id){
    this.id = id;
    this.isMaster = false
    this.squareChosen = null;
    this.cor = "red" // FAZER LISTA DE CORES
    this.voto = [];
    
    
    console.log("jogador ", id, " criado!")
  }
  
  voteSquare(lin,col){
    
  }
  
  
  // secao dos debug 
  
  criarDebug(){
    let x = debug.getPosX(); 
    let y = debug.getLastY();
    let d = debug.getDistancia();
    
    this.inputLinha = createInput('linha')
    this.inputColuna = createInput('coluna')
    
    fill(this.cor)
    square(x-20,y,10)
    
    
    this.inputLinha.position(x,y)
    this.inputLinha.size(40,20)
    this.inputColuna.position(x + d, y)
    this.inputColuna.size(40,20)
    
    this.btnSubmit = createButton("enviar")
    this.btnSubmit.position(x + d*2 ,y)
    
    this.btnSubmit.mousePressed(() => {
      this.getVoto();
      this.submitVoto();
    })
    
    this.btnChoose = createButton("escolher")
    this.btnChoose.position(x - d ,y)
    
    
  }
  
  getVoto(){
    this.voto = [this.inputLinha.value(),this.inputColuna.value()]
    return this.voto;
  }
  
  submitVoto(){
    gc.setPlayerVoto(this.id,this.voto)
  }
  
  
}
class Player{
  
  constructor(id){
    this.id = id;
    this.nome = null; // nome?
    this.isMaster = false
    this.cor = "red" // FAZER LISTA DE CORES (queria fazer cada jogador ter um identificador colorido)
    
    this.voto = [];
    this.podeVotar = true;
    
    
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
      this.submitVoto(this.getVoto());
    })
    
    this.btnChoose = createButton("escolher")
    this.btnChoose.position(x - d ,y)
    
    
  }
  // LARI VOCE PROVAVELMENTE vai ter que trocar aqui da onde ele ta pegando o input.
  // lembra de validar bem o input pra ele só pegar coordenadas validas, eu vou tentar tratar no "back"
  // mas faça sua parte <3!
  getVoto(){
    this.voto = [this.inputLinha.value(),this.inputColuna.value()]
    return this.voto;
  }
  
  submitVoto(voto){
    gc.setPlayerVoto(this.id,voto)
  }
  
  setMaster(valor){
    this.isMaster = valor
  }
  
}
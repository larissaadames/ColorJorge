
class Debug {

  constructor(id){
    this.id = id
    this.lastX = 0;
    this.lastY = 50;
    this.posX = 0;
    this.btnJgdr = null;
    this.distancia = 80;
  }
  
  iniciar(){
      
      this.posX = table.getRightX() + this.distancia + this.lastX
      
      this.btnJgdr = createButton("Criar Jogador" + " " + gc.getPlayers().length);
      this.btnJgdr.position(this.posX, this.lastY)
    
      this.btnJgdr.mousePressed(() => {
        
        // cria o jogador no gc e o debug no jogador
        let player = gc.createPlayer();
        player.criarDebug();
        
        //apaga o botao de criar o jogador
        this.btnJgdr.remove();
        
        //começa de novo
        this.lastY += this.distancia;
        this.iniciar()
      });
 
    }
  
  getLastY(){return this.lastY}
  getLastX(){return this.lastX}
  getPosX(){return this.posX}
  getDistancia(){return this.distancia}
}
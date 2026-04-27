class ViewController {
  
  constructor(){
      this.h3AddJgd = createElement('h3', 'ADICIONAR JOGADOR')
      this.inpNomeJgd = createInput()
      this.btnCriarJgd = createButton('criar')
      this.btnIniciarJogo = createButton('iniciar jogo!')

      this.inpNomeJgd.position(300,800 + 100)
      this.btnCriarJgd.position(200,800 + 100)
      this.h3AddJgd.position(200,800 + 40)
      this.btnIniciarJogo.position(500,800 + 100)
    
      this.btnCriarJgd.mousePressed(() => {
          
          if(gc.players.some(p => p.nome == this.inpNomeJgd.value())){
            console.log("nome ja foi")
          } else {
            gc.createPlayer(this.inpNomeJgd.value());
            this.insertPlayerPlacar();
          }
          
       })
    
      this.btnIniciarJogo.mousePressed(() => {
        
        if(gc.qtdPlayers >= gc.minPlayers){
          gc.iniciarJogo = true;
          this.h3AddJgd.remove();
          this.inpNomeJgd.remove();
          this.btnCriarJgd.remove();
          this.btnIniciarJogo.remove();
        }
      })
    

  }
  
  insertVotoJogador(jogador){
    if(gc.players.some(p => p.nome == jogador.nome)) {
      jogador.inpLinha = createInput();
      jogador.inpColuna = createInput();
      jogador.btnConfirm = createButton('Confirmar escolha')
    } 
  }

   draw(){
     
  }
  
  drawPlayers(){
    const x = table.getRightX() + table.gap 
    const y = table.y
    gc.players.forEach((p, i) => {
      // let h3 = createElement('h3', p.nome)
      //h3.position(x,y + p.id * table.gap)
      this.insertPlayerPlacar(p)
//       const yCerto = y + p.id * table.gap
      
//       fill('black')
//       text(p.nome, x, yCerto)
//       text('pontuacao: ' + p.pontuacao , x, yCerto + 30)

    })
  }
  
  insertPlayerPlacar(){
    const p = gc.players[gc.players.length-1]
    const x = table.getRightX() + table.gap 
    const y = table.y + p.id * table.gap
    
    let h3 = createElement('h3', p.nome)
    h3.position(x,y)
    
    p.textPontuacao = createElement('h4', 'pontuação: ' + p.pontuacao) 
    p.textPontuacao.position(x,y+ table.gap/4)
  
  }
}
class ViewController {
  
  constructor(){
      this.h3AddJgd = createElement('h3', 'ADICIONAR JOGADOR')
      this.inpNomeJgd = createInput()
      this.btnCriarJgd = createButton('criar')
      this.btnIniciarJogo = createButton('iniciar jogo!')

      this.inpNomeJgd.position(300,table.getBottomY() + 200)
      this.btnCriarJgd.position(200,table.getBottomY() + 200)
      this.h3AddJgd.position(200,table.getBottomY() + 150)
      this.btnIniciarJogo.position(500,table.getBottomY() + 200)
    
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
      let x = table.x 
      let y = table.getBottomY()
      let h3Linha = createElement('h3','linha')
      h3Linha.position(x + 100,y + 100)
      let h3Coluna = createElement('h3','coluna')
      h3Coluna.position(x + 300,y + 100)
      
 
      jogador.inpLinha = createInput();
      jogador.inpColuna = createInput();
      jogador.btnConfirm = createButton('Confirmar escolha')
    
      jogador.inpLinha.position(x + 100, y + 150) 
      jogador.inpColuna.position(x + 300, y + 150) 
      jogador.btnConfirm.position(x + 500, y + 150) 
      
      jogador.btnConfirm.mousePressed(() => {
      let valLinha = jogador.inpLinha.value().toUpperCase().trim();
      let valColuna = jogador.inpColuna.value().trim();

      let regexLinha = /^[A-Z]$/;
  
      let regexColuna = /^([0-9]|1[0-9]|20)$/;
        
        
      if (regexLinha.test(valLinha) && regexColuna.test(valColuna)) {
    
      jogador.voto = [valLinha, valColuna];
      jogador.jaVotou = true;

      jogador.inpLinha.remove();
      jogador.inpColuna.remove();
      jogador.btnConfirm.remove();
      h3Linha.remove();
      h3Coluna.remove();


  } else {
    console.log("voto invalido");
    
    jogador.inpLinha.value('');
    jogador.inpColuna.value('');
  }
      })
  }

   draw(){
     
  }
  
  drawPlayers(){
    const x = table.getRightX() + table.gap  + 200
    const y = table.y
    gc.players.forEach((p, i) => {

      this.insertPlayerPlacar(p)

    })
  }
  
  insertPlayerPlacar(){
    const p = gc.players[gc.players.length-1]
    const x = table.getRightX() + table.gap 
    const y = table.y + p.id * table.gap
    
    let h3 = createElement('h3', p.nome)
    h3.position(x,y)
    
    p.textPontuacao = createElement('h4', 'pontuação: ' + p.pontuacao) 
    p.textPontuacao.position(x,y+ table.gap/3)
  
  }
}
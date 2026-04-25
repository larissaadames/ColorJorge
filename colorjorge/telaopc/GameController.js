let players = [];
// PARA NAO DAR PROBLEMA NO ID DOS JOGADORES, NAO REMOVA NINGUEM DA LISTA, APENAS DEIXE NULO SE UM JOGADOR SAIR.

class GameController{
  
  constructor(){
    this.turno = 0; // turno 0 = prejogo
    this.lastTurno = 11; // 
    this.turnoSecao = 0 // master/jogadores/pontuacao
    
    this.votos = new Map(); // Map é um objeto que atrela um valor a outro, tipo um hash.
  }
  
  turnoController(turno,secao){
    
    if(this.turno == 0){
      // turno 0 é o prejogo!
      // liberar entrada dos jogadores
      // colocar contador, ou algo pro 'adm' prosseguir o jogo
      // fechar entrada dos jogadores
      // sortear jogador que será o master
      // fim do turno, turno++
      
    } else if(this.turno == this.lastTurno){
      // mostra estatísticas gerais do jogo e finaliza
    } else {
      if(this.secao == 0){
        // master recebe a cor e manda a pista pros jogadores
        // timer, timer quase acaba quando master manda pista
        // secao++
      } else if (this.secao == 1){
        // jogadores votam
        // MAIS DIFICIL -> mostrar voto dos jogadores em tempo real
        // timer, timer quase acaba quando jogadores votam
        // secao++
      } else if (this.secao == 2){
        // mostra todos os votos
        // mostra a cor de verdade e a pontuacao
        // secao = 0 e turno++
      }
    }
  }
  
  setPlayerVoto(playerid,voto){
    this.votos.set(playerid,voto)
    console.log(playerid + " votou em " + this.votos.playerid)
  }

  // ESSA CLASSE DEVE:
  // possuir a info de 
  // qts e quais jogadores existem,
  // qual rodada está
  // qual momento da rodada está (callout da cor / jogadores escolhendo / mostrando resultados )
  
  // ele deve gerenciar votos dos jogadores
  // ...mais
  
  
  
  // acredito que aqui deve ser passada como param alguma info do jogador q a gente pega no cliente dele
  
  // dps tem q fazer o randomizador de quem vai ser o mestre
  
  createPlayer(){
    
    let id = players.length
    let player = new Player(id);
    players.push(player)
    
    return player
  }
  
  getPlayers(){
    return players;
  }
  
  
}
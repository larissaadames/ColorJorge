// CLASSE QUE CONTROLA OS ELEMENTOS, RODADAS, JOGADORES
// coisas a considerar:
// qualquer jogador pode fechar o site a qualquer momento. se esse jogador for o mestre, estamos fritos!
// acho que é só redesignar o mestre daí mas tem que tomar um cuidado com o codigo e design hein

class GameController{
  
  constructor(){
    this.turno = 0; // turno 0 = prejogo
    this.lastTurno = 11; // 
    this.secao = 0 // seção do turno -> master/jogadores/pontuacao. como sao poucas nao acho q precisa de constantes.
    
    // PARA NAO DAR PROBLEMA NO ID DOS JOGADORES, NAO REMOVA NINGUEM DA LISTA. APENAS DEIXE NULO SE UM JOGADOR SAIR.
    this.players = []; 
    this.placar = [];
    this.votos = new Map(); // Map é um objeto que atrela um valor a outro, tipo um hash. usa isso pois linha-coluna
    this.qtdPlayers = 0;
    this.minPlayers = 2;
    
    this.timerVisual = createElement('h1', 'aaa');
    this.timerTexto = '';
    this.titulo = createElement('h1', 'texto inicial');
    this.tituloTexto = 'texto inicial';
    this.aviso = createElement('h2', ' aviso');
    this.avisoTexto = 'aviso';
    
    this.pista = null;
    this.pistas = new Map();
    
    let dt;
    this.timer = 0;
    this.timerAtivo = false;
    this.iniciarJogo = false;
  }
  
  // PARECE CONFUSO MAS NAO É!
  // por mais que tenha varios ifs aninhados, se liga lari:
  // tem o if que checa o turno, se for 0 é prejogo, se for lastTurno é o ultimo turno,
  // se for qualquer outra coisa ele ai ele faz o jogo normal
  turnoController(){
    
    // muda os textos
    this.atualizarTextos(this.timerTexto,this.tituloTexto,this.avisoTexto) // futuramente acho q passa o placar aqui tb
    
    // turno 0 é o prejogo!
    if(this.turno == 0){
      const preJogoTempo = 5;
      
      if(this.qtdPlayers < this.minPlayers && this.iniciarJogo) {
        this.avisoTexto = "São necessários pelo menos " + this.minPlayers + "jogadores para iniciar o jogo"
      }
      
      let tempoRestante = preJogoTempo - this.timer;
      if(this.qtdPlayers >= this.minPlayers){
        this.timerAtivo = true;
      }
      
      this.avisoTexto = "Aguardando jogadores! " + this.qtdPlayers + " jogadores presentes" 
      if(tempoRestante <= 0){
        
        this.randomizarMaster();
        
        //fazer fecha a entrada dos jogadores
        this.timer = 0;
        this.turno++
        console.log(this.turno)
        return
      }
      
      this.tituloTexto = ("FASE Pré-Jogo! " + (preJogoTempo - this.timer).toFixed(0))
      this.timerTexto = (preJogoTempo - this.timer).toFixed(0)
        
      // liberar entrada dos jogadores (n faço ideia de como vai fazer isso)
      // colocar contador, ou algo pro 'adm' prosseguir o jogo
      // fechar entrada dos jogadores
      // sortear jogador que será o master
      // fim do turno, this.turno++
      
    } else if(this.turno == this.lastTurno){
      // mostra estatísticas gerais do jogo e finaliza
    } else {
        // secao 0 é master, recebe a cor e manda a pista pros jogadores
      if(this.secao == 0){
        const tempoSecao = 5;
        let temPista = false;
        let tempoRestante = tempoSecao - this.timer;
        
        if(!temPista && this.timer <= 5) this.tituloTexto = ("O MESTRE ESTÁ PENSANDO NA PISTA...")
        
        if(!temPista && this.timer > 5) {temPista = true;}
        if(temPista){
          
          // randomiza a pista e gera, mas por enquanto vou deixar uma fixa só pra ter a ideia da logica principal
          // da pra fazer um json com chave de cada quadrado e pista, mas acho isso chato e n da pra brincar com diferentes tamanhos de tabuleiro
          // o q pensei q é legal é: sortear um quadrado, verificar as cores predominantes, com base nisso fazer um algoritmo
          // q tem um banco de palavras de acordo com os tons predominantes. fazível.
          this.pista = "kiwi assado"
          this.avisoTexto = ("A PISTA É: " + this.pista)
          this.tituloTexto = ("A PISTA É: " + this.pista)
        }
        
        if(temPista && this.timer >= tempoSecao){
          this.timer = 0;
          this.secao++
          return
        }
        this.timerTexto = (tempoSecao - this.timer).toFixed(0)
        
        
      } else if (this.secao == 1){
        let vezDoID = 0
//         let jaInseriu = [] // lista dos jogadores que ja foram criados inserts 
        console.log('jogador pegado ' + this.getPlayerById(vezDoID))
//         jaInseriu.find(p => )
                       vc.insertVotoJogador(this.getPlayerById(vezDoID))
        // jogadores votam
        // MAIS DIFICIL -> mostrar voto dos jogadores em tempo real
        // timer, timer quase acaba quando jogadores votam
        // this.secao++
      } else if (this.secao == 2){
        // mostra todos os votos
        // mostra a cor de verdade e a pontuacao
        // this.secao = 0 e this.turno++
      }
    }
  }
  
  setPlayerVoto(playerid,voto){
    this.votos.set(playerid,voto)
    console.log(playerid + " votou em " + this.votos.get(playerid))
  }

  // ESSA CLASSE DEVE:
  // possuir a info de 
  // qts e quais jogadores existem,
  // qual rodada está
  // qual momento da rodada está (callout da cor / jogadores escolhendo / mostrando resultados )
  
  // ele deve gerenciar votos dos jogadores
  // ...mais
  
  
  
  // acredito que aqui deve ser passada como param alguma info do jogador q a gente pega no cliente dele
  
  createPlayer(nome){
    // ainda nao há validacao se o player saiu, nem sei como iremos detectar isso
    let id = this.qtdPlayers
    let player = new Player(id,nome);
    this.players.push(player);
    this.qtdPlayers = this.players.length;
    
    return player
  }
    
  deletePlayer(playerid){
    // tem que percorrer a lista, achar o player q saiu, definir ele como nulo, e diminuir a this.qtdPlayers
  }
  
  getPlayers(){
    return this.players;
  }
      
  getPlayerById(id){
    return this.players.find(p => p.id == id);
  }
    
  randomizarMaster(){
    let master = random(this.players)
    master.setMaster(true)
    console.log(master.id + " é o master")
  }
  
  update(){
    dt = deltaTime / 1000; // diferenca de tempo entre frames, em segundos
    
    
    if(this.qtdPlayers >= this.minPlayers && this.iniciarJogo) this.timer = this.timer + dt
    
  }
  
  draw(){
    
  }
    
  atualizarTextos(timerVisual,titulo,aviso){
    this.timerVisual.html(timerVisual)
    this.timerVisual.position(table.getRightX()/2,10)
    
    console.log(table.getRightX())
    this.titulo.html(titulo)
    this.titulo.position(100,30)
    
    this.aviso.html(aviso)
    this.aviso.position(100, table.getBottomY() + 50)
  }
  
  
}
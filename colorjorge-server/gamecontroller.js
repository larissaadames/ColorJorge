// GameController.js (no Servidor)

class GameController {
  constructor() {
    this.turno = 0; 
    this.lastTurno = 3; 
    this.secao = 0; 

    this.players = [];
    this.masterPlayer = null; // Agora dita quem é a autoridade da rodada
    this.votos = new Map(); 
    this.vezDoId = 0;
    this.qtdPlayers = 0;
    this.minPlayers = 2;

    this.timerTexto = "";
    this.tituloTexto = "texto inicial";
    this.avisoTexto = "aviso";

    this.pista = "";
    this.quadradoAlvo = null;

    this.timer = 0;
    this.temDica = false;
    this.timerAtivo = false;
    this.iniciarJogo = false;

    this.tableConfig = { linhas: 15, colunas: 15 }; 
  }

  // Função auxiliar para substituir o random() nativo do p5
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  turnoController() {
    if (this.turno == 0) {
      const preJogoTempo = 5;

      if (this.qtdPlayers < this.minPlayers && this.iniciarJogo) {
        this.avisoTexto = `São necessários pelo menos ${this.minPlayers} jogadores para iniciar o jogo`;
      }

      let tempoRestante = preJogoTempo - this.timer;
      if (this.qtdPlayers >= this.minPlayers) {
        this.timerAtivo = true;
      }

      this.avisoTexto = `Aguardando jogadores! ${this.qtdPlayers} jogadores presentes`;
      
      if (tempoRestante <= 0 && this.qtdPlayers >= this.minPlayers) {
        this.randomizarMaster();
        this.timer = 0;
        this.turno++;
        return;
      }

      this.tituloTexto = "FASE Pré-Jogo! ";
      this.timerTexto = Math.max(0, tempoRestante).toFixed(0);

    } else if (this.turno == this.lastTurno) {
        this.finalizarJogo();
    } else {
      
      if (this.secao == 0) {
        // SEÇÃO 0: ESPERANDO O MESTRE DIGITAR A DICA
        
        if (!this.quadradoAlvo) {
          let randLinha = Math.floor(Math.random() * this.tableConfig.linhas);
          let randColuna = Math.floor(Math.random() * this.tableConfig.colunas);
          this.quadradoAlvo = { lin: randLinha, col: randColuna };
          
          // Agora usamos o masterPlayer diretamente! Mais rápido e limpo.
          this.tituloTexto = `Vez de ${this.masterPlayer.nome} dar a dica!`;
          this.avisoTexto = "O mestre está pensando...";
          
          this.timer = 0; 
        }

        const tempoParaMestre = 30;
        this.timerTexto = Math.max(0, tempoParaMestre - this.timer).toFixed(0);

        if (this.temDica || this.timer >= tempoParaMestre) {
          if (!this.temDica) {
            // PLANO B: O Mestre não mandou a dica a tempo!
            // Como o servidor não tem as cores RGB para gerar a dica perfeitamente agora,
            // podemos colocar uma punição genérica ou você pode integrar sua função gerarDica() aqui.
            this.pista = "Dica Automática (Tempo Esgotado!)"; 
            console.log(`Tempo do Mestre ${this.masterPlayer.nome} esgotou. Dica automática aplicada.`);
          }
          
          this.avisoTexto = `A PISTA É: ${this.pista}`;
          this.tituloTexto = `A PISTA É: ${this.pista}`;
          
          this.timer = 0;
          this.secao++; 
          return;
        }

      } else if (this.secao == 1) {
        let player = this.getPlayerById(this.vezDoId);

        if (!player) {
          this.tituloTexto = "Todos já votaram!";
          this.timer = 0;
          this.vezDoId = 0;
          this.secao = 2;
          return;
        }

        this.tituloTexto = `Vez de ${player.nome}`;

        if (player.jaVotou) {
          this.vezDoId++;
        }

      } else if (this.secao == 2) {
        this.calcularPontos();
        this.tituloTexto = "RESULTADOS DA RODADA!";
        
        let letraAlvo = String.fromCharCode(65 + this.quadradoAlvo.lin);
        let numeroAlvo = this.quadradoAlvo.col + 1;
        this.avisoTexto = `O quadrado correto era: ${letraAlvo}${numeroAlvo}`;

        const tempoResultados = 7;
        this.timerTexto = Math.max(0, tempoResultados - this.timer).toFixed(0);

        if (this.timer >= tempoResultados) {
          this.proximoTurno();
        }
      }
    }
  }

  // NOVA FUNÇÃO: O Leão de Chácara das dicas
  receberDicaMaster(playerId, textoDaDica) {
    // Checagem de segurança: Só aceita se quem mandou for o masterPlayer oficial
    if (this.masterPlayer && this.masterPlayer.id === playerId) {
        this.pista = textoDaDica;
        this.temDica = true;
        console.log(`Dica recebida do mestre ${this.masterPlayer.nome}: ${textoDaDica}`);
    } else {
        console.log(`⚠️ ALERTA DE SEGURANÇA: Jogador ID ${playerId} tentou enviar dica sem ser o mestre!`);
    }
  }

  setPlayerVoto(playerid, voto) {
    let player = this.getPlayerById(playerid);
    if (player) {
        player.voto = voto;
        player.jaVotou = true;
        this.votos.set(playerid, voto);
    }
  }

  createPlayer(nome, socketId) {
    let id = this.players.length;
    let player = {
        id: id,
        socketId: socketId,
        nome: nome,
        pontuacao: 0,
        jaVotou: false,
        pontuado: false,
        voto: null,
        isMaster: false
    };
    this.players.push(player);
    this.qtdPlayers = this.players.length;
    return player;
  }

  getPlayerById(id) {
    return this.players.find((p) => p && p.id == id);
  }

  randomizarMaster() {
    // Limpa a flag de todos os jogadores
    this.players.forEach(p => p.isMaster = false);
    
    // Sorteia o novo e atualiza a referência oficial
    this.masterPlayer = this.getRandomElement(this.players);
    
    if (this.masterPlayer) {
        this.masterPlayer.isMaster = true;
        console.log(`👑 O novo mestre da rodada é: ${this.masterPlayer.nome}`);
    }
  }

  update(dt) {
    if (this.qtdPlayers >= this.minPlayers && this.iniciarJogo) {
      this.timer += dt;
    }
  }

  calcularPontos() {
    this.players.forEach((p) => {
      if (p && p.voto && !p.pontuado) {
        let linhaVoto = p.voto[0].toUpperCase().charCodeAt(0) - 65;
        let colunaVoto = parseInt(p.voto.substring(1)) - 1;

        let diffCol = colunaVoto - this.quadradoAlvo.col;
        let diffLin = linhaVoto - this.quadradoAlvo.lin;
        let distancia = Math.sqrt(diffCol * diffCol + diffLin * diffLin);

        let pontosGanhos = Math.max(0, 10 - Math.floor(distancia * 2));
        p.pontuacao += pontosGanhos;
        p.pontuado = true;
      }
    });
  }

  proximoTurno() {
    this.turno++;
    if (this.turno >= this.lastTurno) return;

    this.secao = 0;
    this.timer = 0;
    this.vezDoId = 0;
    this.quadradoAlvo = null;
    this.temDica = false;

    this.players.forEach((p) => {
      if (p) {
        p.jaVotou = false;
        p.pontuado = false;
        p.voto = null;
      }
    });
  }

  finalizarJogo() {
    let jogadoresOrdenados = [...this.players].sort((a, b) => b.pontuacao - a.pontuacao);
    let maiorPontuacao = jogadoresOrdenados[0].pontuacao;
    let vencedores = jogadoresOrdenados.filter(p => p.pontuacao === maiorPontuacao);

    if (vencedores.length > 1) {
      this.tituloTexto = "EMPATE! Vencedores: " + vencedores.map(p => p.nome).join(" e ");
    } else {
      this.tituloTexto = "VENCEDOR: " + vencedores[0].nome + "!";
    }
    this.avisoTexto = `Com um total de ${maiorPontuacao} pontos!`;
    this.timerTexto = "FIM";
  }
}

module.exports = GameController;
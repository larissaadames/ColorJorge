// CLASSE QUE CONTROLA OS ELEMENTOS, RODADAS, JOGADORES
// coisas a considerar:
// qualquer jogador pode fechar o site a qualquer momento. se esse jogador for o mestre, estamos fritos!
// acho que é só redesignar o mestre daí mas tem que tomar um cuidado com o codigo e design hein

class GameController {
  constructor() {
    this.turno = 0; // turno 0 = prejogo
    this.lastTurno = 3; //
    this.secao = 0; // seção do turno -> master/jogadores/pontuacao. como sao poucas nao acho q precisa de constantes.

    // PARA NAO DAR PROBLEMA NO ID DOS JOGADORES, NAO REMOVA NINGUEM DA LISTA. APENAS DEIXE NULO SE UM JOGADOR SAIR.
    this.players = [];
    this.placar = [];
    this.votos = new Map(); // Map é um objeto que atrela um valor a outro, tipo um hash. usa isso pois linha-coluna
    this.vezDoId = 0;
    this.qtdPlayers = 0;
    this.minPlayers = 2;

    this.timerVisual = createElement("h1", "aaa");
    this.timerTexto = "";
    this.titulo = createElement("h1", "texto inicial");
    this.tituloTexto = "texto inicial";
    this.aviso = createElement("h2", " aviso");
    this.avisoTexto = "aviso";

    this.dica = [];
    this.dicas = new Map();
    this.quadradoAlvo = null;

    let dt;
    this.timer = 0;
    this.timerAtivo = false;
    this.iniciarJogo = false;
  }

  // PARECE CONFUSO MAS NAO É!
  // por mais que tenha varios ifs aninhados, se liga lari:
  // tem o if que checa o turno, se for 0 é prejogo, se for lastTurno é o ultimo turno,
  // se for qualquer outra coisa ele ai ele faz o jogo normal
  turnoController() {
    // muda os textos
    this.atualizarTextos(this.timerTexto, this.tituloTexto, this.avisoTexto); // futuramente acho q passa o placar aqui tb

    // turno 0 é o prejogo!
    if (this.turno == 0) {
      const preJogoTempo = 5;

      if (this.qtdPlayers < this.minPlayers && this.iniciarJogo) {
        this.avisoTexto =
          "São necessários pelo menos " +
          this.minPlayers +
          "jogadores para iniciar o jogo";
      }

      let tempoRestante = preJogoTempo - this.timer;
      if (this.qtdPlayers >= this.minPlayers) {
        this.timerAtivo = true;
      }

      this.avisoTexto =
        "Aguardando jogadores! " + this.qtdPlayers + " jogadores presentes";
      if (tempoRestante <= 0) {
        this.randomizarMaster();
        this.timer = 0;
        this.turno++;
        return;
      }

      this.tituloTexto = "FASE Pré-Jogo! ";
      this.timerTexto = (preJogoTempo - this.timer).toFixed(0);
    } else if (this.turno == this.lastTurno) {
      // mostra estatísticas gerais do jogo e finaliza
    } else {
      // secao 0 é master, recebe a cor e manda a pista pros jogadores
      if (this.secao == 0) {
        const tempoSecao = 5;
        let temDica = false;
        let tempoRestante = tempoSecao - this.timer;

        if (!temDica && this.timer <= 5)
          this.tituloTexto = "O MESTRE ESTÁ PENSANDO NA DICA...";

        if (!temDica && this.timer > 5) {
          let randLinha = floor(random(table.linhas));
          let randColuna = floor(random(table.colunas));

          this.quadradoAlvo = table.CSquares[randColuna][randLinha];
          console.log("quadrado alvo id: " + this.quadradoAlvo.id);

          this.pista = this.gerarDica(
            this.quadradoAlvo.r,
            this.quadradoAlvo.g,
            this.quadradoAlvo.b
          );
          this.avisoTexto = "A PISTA É: " + this.pista;
          this.tituloTexto = "A PISTA É: " + this.pista;
          temDica = true;
        }

        if (temDica && this.timer >= tempoSecao) {
          this.timer = 0;
          this.secao++;
          return;
        }
        this.timerTexto = (tempoSecao - this.timer).toFixed(0);
      } else if (this.secao == 1) {
        // secao voto jogador

        let player = this.getPlayerById(this.vezDoId);

        // se não há mais jogadores, executa esse bloco
        if (!player) {
          this.tituloTexto = "Todos já votaram!";
          this.timer = 0;
          this.vezDoId = 0;
          this.secao = 2;
          return;
        }
        //         console.log("player " + player)
        //         console.log("id " + player.id)

        if (!player.jaInseriu) {
          vc.insertVotoJogador(player);
          this.tituloTexto = "Vez de " + player.nome;
          player.jaInseriu = true;
        }

        // ! o botao que está no viewcontroller capta quando o jogador envia o input, e ativa a flag jaVotou

        if (player.jaVotou) {
          this.vezDoId++;
        }

        // jogadores votam
      } else if (this.secao == 2) {
        this.calcularPontos();
        this.tituloTexto = "RESULTADOS DA RODADA!";
        
        let letraAlvo = String.fromCharCode(65 + this.quadradoAlvo.lin);
        let numeroAlvo = this.quadradoAlvo.col + 1;
        this.avisoTexto = `O quadrado correto era: ${letraAlvo}${numeroAlvo}`;

        this.calcularPontos();

        const tempoResultados = 7;
        this.timerTexto = (tempoResultados - this.timer).toFixed(0);

        if (this.timer >= tempoResultados) {
          this.proximoTurno();
        }

        if (this.turno >= this.lastTurno) {
          this.finalizarJogo();
        }
      }
    }
  }

  setPlayerVoto(playerid, voto) {
    this.votos.set(playerid, voto);
    console.log(playerid + " votou em " + this.votos.get(playerid));
  }

  createPlayer(nome) {
    let id = this.qtdPlayers;
    let player = new Player(id, nome);
    this.players.push(player);
    this.qtdPlayers = this.players.length;

    return player;
  }

  deletePlayer(playerid) {
    // tem que percorrer a lista, achar o player q saiu, definir ele como nulo, e diminuir a this.qtdPlayers
  }

  getPlayers() {
    return this.players;
  }

  getPlayerById(id) {
    return this.players.find((p) => p.id == id);
  }

  randomizarMaster() {
    let master = random(this.players);
    master.setMaster(true);
    console.log(master.id + " é o master");
  }

  update() {
    dt = deltaTime / 1000; // diferenca de tempo entre frames, em segundos

    if (this.qtdPlayers >= this.minPlayers && this.iniciarJogo)
      this.timer = this.timer + dt;
  }

  draw() {}

  atualizarTextos(timerVisual, titulo, aviso) {
    this.timerVisual.html(timerVisual);
    this.timerVisual.position(table.getRightX() / 2, 10);

    this.titulo.html(titulo);
    this.titulo.position(100, 30);

    this.aviso.html(aviso);
    this.aviso.position(100, table.getBottomY() + 50);
  }

  gerarDica(r, g, b) {
    let luz = (r + g + b) / 3; // a media diz se é claro ou escuro
    let categoriaLuz;

    if (luz > 210) categoriaLuz = "muitoClaro";
    else if (luz > 160) categoriaLuz = "claro";
    else if (luz > 100) categoriaLuz = "medio";
    else if (luz > 50) categoriaLuz = "escuro";
    else categoriaLuz = "muitoEscuro";

    let categoriaCor;
    let maiorCanal = Math.max(r, g, b);
    let menorCanal = Math.min(r, g, b);

    // calculos pra saber em qual range de cor ela ta
    if (maiorCanal - menorCanal < 30) {
      categoriaCor = "empate";
    } else if (r > 150 && g > 150 && b < 100) {
      categoriaCor = "amarelo";
    } else if (r > 150 && b > 150 && g < 100) {
      categoriaCor = "roxo";
    } else if (maiorCanal === r) {
      categoriaCor = "vermelho";
    } else if (maiorCanal === g) {
      categoriaCor = "verde";
    } else {
      categoriaCor = "azul";
    }

    let palavra1 = random(dicas.substantivos[categoriaCor]);
    let palavra2 = random(dicas.adjetivos[categoriaLuz]);

    return palavra1 + " " + palavra2;
  }

  calcularPontos() {
    this.players.forEach((p) => {
      if (p && p.voto && !p.pontuado) {
        // converte as letras pra numero, e o numero pra numero certo
        let linhaVoto = p.voto[0].toUpperCase().charCodeAt(0) - 65;
        let colunaVoto = parseInt(p.voto[1]) - 1;

        // calcula a distancia entre o quadradoCorreto e o voto
        // com base na formula de distancia: raiz((x2-x1)² + (y2-y1)²)
        let diffCol = colunaVoto - this.quadradoAlvo.col;
        let diffLin = linhaVoto - this.quadradoAlvo.lin;
        let distancia = Math.sqrt(diffCol * diffCol + diffLin * diffLin);

        let pontosGanhos = Math.max(0, 10 - Math.floor(distancia * 2));
        p.pontuacao += pontosGanhos;

        p.pontuado = true;

        if (p.textPontuacao) {
          p.textPontuacao.html("pontuação: " + p.pontuacao);
        }

        console.log(
          `${p.nome} votou em ${p.voto} e ganhou ${pontosGanhos} pontos.`
        );
      }
    });
  }

  proximoTurno() {
    this.turno++;

    // checa se o jogo acabou
    if (this.turno >= this.lastTurno) {
      this.turno = this.lastTurno;
      console.log("Fim de jogo!");
      return;
    }

    // reseta os controladores de fluxo e tempo
    this.secao = 0;
    this.timer = 0;
    this.vezDoId = 0;
    this.quadradoAlvo = null;

    // limpa todas as flags dos jogadores
    this.players.forEach((p) => {
      if (p) {
        p.jaVotou = false;
        p.jaInseriu = false;
        p.pontuado = false;
        p.voto = [];
        // p.isMaster = false;
      }
    });

    // this.randomizarMaster();
  }
  
  finalizarJogo(){

    // clona e ordena a lista de jogadores
    let jogadoresOrdenados = [...this.players].sort((a, b) => b.pontuacao - a.pontuacao);

    // vencedor é o primeiro da lista ordenada
    let maiorPontuacao = jogadoresOrdenados[0].pontuacao;

    // verifica empate
    let vencedores = jogadoresOrdenados.filter(p => p.pontuacao === maiorPontuacao);

    if (vencedores.length > 1) {
      // se teve empatde junta o nome de todo mundo
      let nomes = vencedores.map(p => p.nome).join(" e ");
      this.tituloTexto = "EMPATE! Vencedores: " + nomes;
    } else {
      this.tituloTexto = "VENCEDOR: " + vencedores[0].nome + "!";
    }

    this.avisoTexto = "Com um total de " + maiorPontuacao + " pontos!";
    this.timerTexto = "FIM";
    
  }
}

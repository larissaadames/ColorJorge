/**
 * useColorGame.js
 * Hook de lógica de partida para Cores com Dicas
 * 
 * Gerencia: rodadas, dicas, votos de todos os jogadores, gabarito e pontuação
 */

import { useState, useCallback } from "react";

// ─── Dicionário completo de coordenadas → cor → dica ─────────────────────────
// Grade 7×10 = 70 posições (A-G × 1-10)
export const CLUE_DICTIONARY = {
  // Linha A – De tons bordô a marrons terrosos
  A1:  { color: "Vinho Profundo",   hex: "#911238", clue: "O veludo das poltronas de um teatro antigo" },
  A2:  { color: "Carmim Escuro",    hex: "#a51335", clue: "A pétala de uma rosa que começou a murchar" },
  A3:  { color: "Rubi Queimado",    hex: "#d71838", clue: "O calor que emana de uma brasa ainda viva" },
  A4:  { color: "Coral Fechado",    hex: "#eb4253", clue: "O tom de uma fruta silvestre colhida cedo demais" },
  A5:  { color: "Rosa Salmão",      hex: "#ef666a", clue: "O rubor súbito de um rosto envergonhado" },
  A6:  { color: "Pêssego Rosado",   hex: "#ef6a66", clue: "A luz suave que atravessa a palma da mão" },
  A7:  { color: "Laranja Outonal",  hex: "#eb5342", clue: "O reflexo do sol em telhas de barro molhadas" },
  A8:  { color: "Terracota Vivo",   hex: "#d73818", clue: "O pigmento extraído de argilas vulcânicas" },
  A9:  { color: "Castanho Avermelhado", hex: "#a53513", clue: "A casca de uma amêndoa tostada" },
  A10: { color: "Marrom Argila",    hex: "#913812", clue: "O rastro de terra seca em um caminho antigo" },

  // Linha B – Tons de ferrugem, ocre e oliva seco
  B1:  { color: "Ferrugem",         hex: "#912b12", clue: "O ferro esquecido ao relento por anos" },
  B2:  { color: "Bronze Antigo",    hex: "#a53a13", clue: "A pátina de uma moeda guardada por gerações" },
  B3:  { color: "Âmbar Escuro",     hex: "#d75818", clue: "A seiva que escorre de um tronco de pinheiro" },
  B4:  { color: "Ocre Vibrante",    hex: "#eb8642", clue: "A polpa de um caqui doce e muito maduro" },
  B5:  { color: "Dourado Mate",     hex: "#efa666", clue: "O brilho das dunas ao primeiro sinal do dia" },
  B6:  { color: "Trigo",            hex: "#efaf66", clue: "O campo pronto para a colheita no final do verão" },
  B7:  { color: "Mostarda",         hex: "#e4a547", clue: "O tempero que colore o molho de uma especiaria" },
  B8:  { color: "Ouro Velho",       hex: "#d79718", clue: "O interior de um medalhão que perdeu o brilho" },
  B9:  { color: "Oliva Fechado",    hex: "#a57e13", clue: "O óleo prensado de frutos ainda verdes" },
  B10: { color: "Laranja Sangue",   hex: "#d73818", clue: "A cor de advertência de uma criatura venenosa" },

  // Linha C – Verdes ácidos e amarelos limão
  C1:  { color: "Musgo Amarelado",  hex: "#916b12", clue: "O líquen que cresce no lado norte da árvore" },
  C2:  { color: "Dourado Ácido",    hex: "#a58313", clue: "O mel denso visto contra a luz de uma lâmpada" },
  C3:  { color: "Citrina",          hex: "#d7b718", clue: "O brilho de um mineral de quartzo impuro" },
  C4:  { color: "Amarelo Canário",  hex: "#ebda42", clue: "O pólen que se desprende das flores de primavera" },
  C5:  { color: "Verde Amarelado",  hex: "#efeb66", clue: "A casca de uma fruta cítrica que ainda vai amadurecer" },
  C6:  { color: "Limão Siciliano",  hex: "#ebef66", clue: "A acidez que faz os olhos cerrarem ao provar" },
  C7:  { color: "Lima Neon",        hex: "#daeb42", clue: "O destaque de uma caneta marca-texto nova" },
  C8:  { color: "Verde Pistache",   hex: "#b7d718", clue: "O recheio de um macaron feito de sementes verdes" },
  C9:  { color: "Abacate",          hex: "#83a513", clue: "A gordura boa escondida sob uma casca rugosa" },
  C10: { color: "Verde Floresta",   hex: "#6b9112", clue: "O dossel da mata onde a luz mal consegue entrar" },

  // Linha D – Verdes vibrantes a esmeralda
  D1:  { color: "Verde Relva",      hex: "#389112", clue: "O cheiro de um jardim logo após a poda" },
  D2:  { color: "Verde Folha",      hex: "#3ba31c", clue: "A energia que a planta absorve do sol" },
  D3:  { color: "Verde Elétrico",   hex: "#38d718", clue: "O brilho de um visor noturno em filmes de ação" },
  D4:  { color: "Verde Menta",      hex: "#53eb42", clue: "O frescor gélido de uma folha de hortelã" },
  D5:  { color: "Verde Pastel",     hex: "#6aef66", clue: "O tom desbotado de uma planta de interior bem cuidada" },
  D6:  { color: "Verde Alface",     hex: "#66ef6a", clue: "A crocância de uma salada fresca de verão" },
  D7:  { color: "Verde Esmeralda",  hex: "#42eb53", clue: "A pedra que simboliza o conhecimento e a cura" },
  D8:  { color: "Verde Mar",        hex: "#18d738", clue: "As águas rasas de uma enseada protegida" },
  D9:  { color: "Verde Bandeira",   hex: "#13a535", clue: "O orgulho de uma nação estendido ao vento" },
  D10: { color: "Verde Musgo Vivo", hex: "#129138", clue: "O tapete natural que cobre as pedras da cachoeira" },

  // Linha E – Cianos e Azuis Piscina
  E1:  { color: "Ciano Escuro",     hex: "#12916b", clue: "A profundidade de um lago que nunca viu o sol" },
  E2:  { color: "Pintado",          hex: "#13a583", clue: "O reflexo de um azulejo antigo de cozinha colonial" },
  E3:  { color: "Turquesa Vibrante", hex: "#18d7b7", clue: "O mineral precioso das joias dos faraós" },
  E4:  { color: "Ciano Neon",       hex: "#42ebda", clue: "A luz de um computador em um quarto escuro" },
  E5:  { color: "Água Marinha",     hex: "#66efeb", clue: "A clareza de um cristal encontrado no leito do rio" },
  E6:  { color: "Ciano Pastel",     hex: "#66ebef", clue: "O sopro de ar frio de um ar-condicionado" },
  E7:  { color: "Azul Céu",         hex: "#42daeb", clue: "O horizonte infinito em um dia sem nuvens" },
  E8:  { color: "Azul Piscina",     hex: "#18b7d7", clue: "O convite para um mergulho em tarde de calor" },
  E9:  { color: "Azul Oceano",      hex: "#1383a5", clue: "Onde o recife termina e o abismo começa" },
  E10: { color: "Azul Aço",         hex: "#126b91", clue: "A superfície de um metal polido sob o luar" },

  // Linha F – Azuis Elétricos e Violetas
  F1:  { color: "Azul Safira",      hex: "#123891", clue: "A tinta densa que escreve contratos importantes" },
  F2:  { color: "Azul Cobalto",     hex: "#1335a5", clue: "O vidro de um frasco de perfume importado" },
  F3:  { color: "Azul Elétrico",    hex: "#1838d7", clue: "A centelha que salta entre dois fios de alta tensão" },
  F4:  { color: "Azul Indigo",      hex: "#4253eb", clue: "O tingimento original de um jeans bruto" },
  F5:  { color: "Violeta Claro",    hex: "#666aef", clue: "A flor da íris que nasce no começo da manhã" },
  F6:  { color: "Periwinkle",       hex: "#6a66ef", clue: "O tom mágico de um crepúsculo de inverno" },
  F7:  { color: "Roxo Real",        hex: "#5342eb", clue: "O manto pesado de um rei em dia de coroação" },
  F8:  { color: "Ultra Violeta",    hex: "#3818d7", clue: "A luz que revela o que é invisível aos olhos" },
  F9:  { color: "Deep Purple",      hex: "#3513a5", clue: "O mistério de uma nebulosa no espaço profundo" },
  F10: { color: "Roxo Fechado",     hex: "#381291", clue: "O suco concentrado de uma amora silvestre" },

  // Linha G – Magentas e Rosas Intensos
  G1:  { color: "Roxo Místico",     hex: "#6b1291", clue: "A poção borbulhante em um caldeirão de bruxa" },
  G2:  { color: "Magenta Escuro",   hex: "#8313a5", clue: "A casca externa de uma cebola roxa" },
  G3:  { color: "Fúcsia Profundo",  hex: "#b718d7", clue: "A flor de brinco-de-princesa balançando ao vento" },
  G4:  { color: "Orquídea Viva",    hex: "#da42eb", clue: "A pétala central de uma flor exótica e rara" },
  G5:  { color: "Rosa Shocking",    hex: "#eb66ef", clue: "O batom que não passa despercebido em ninguém" },
  G6:  { color: "Magenta Chiclete", hex: "#ef66eb", clue: "O sabor artificial de um doce de infância" },
  G7:  { color: "Rosa Choque",      hex: "#eb42da", clue: "O rastro de tinta de uma caneta gel neon" },
  G8:  { color: "Magenta Elétrico", hex: "#d718b7", clue: "A energia vibrante de uma festa retro dos anos 80" },
  G9:  { color: "Borgonha Rosado",  hex: "#a51383", clue: "A mancha de vinho tinto sobre um tecido claro" },
  G10: { color: "Beterraba",        hex: "#91126b", clue: "A cor intensa que tinge as mãos ao cozinhar a raiz" },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Hook principal ───────────────────────────────────────────────────────────
export function useColorGame(players, totalRounds = 3) {
  const allCoords = Object.keys(CLUE_DICTIONARY);

  const [gameState, setGameState] = useState(() => ({
    phase: "idle", // idle | voting | reveal | finished
    round: 0,
    clueQueue: [],
    currentClueIdx: 0,
    votes: {}, // { [playerIdx]: coord }
    scores: players.map(() => 0),
    history: [], // { coord, votes, correctCoord }
  }));

  const currentClueEntry = () => {
    const coord = gameState.clueQueue[gameState.currentClueIdx];
    return coord ? { coord, ...CLUE_DICTIONARY[coord] } : null;
  };

  const startGame = useCallback(() => {
    setGameState({
      phase: "voting",
      round: 1,
      clueQueue: shuffle(allCoords),
      currentClueIdx: 0,
      votes: {},
      scores: players.map(() => 0),
      history: [],
    });
  }, [players, allCoords]);

  const castVote = useCallback((playerIdx, coord) => {
    setGameState(prev => {
      if (prev.phase !== "voting") return prev;
      return {
        ...prev,
        votes: { ...prev.votes, [playerIdx]: coord },
      };
    });
  }, []);

  const allVoted = (votes) => players.every((_, i) => votes[i] !== undefined);

  const revealAnswer = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== "voting") return prev;
      const coord = prev.clueQueue[prev.currentClueIdx];
      const correct = coord;

      // Calcula pontos: quem votou certo ganha 1 ponto
      const newScores = [...prev.scores];
      Object.entries(prev.votes).forEach(([pidx, votedCoord]) => {
        if (votedCoord === correct) newScores[parseInt(pidx, 10)]++;
      });

      return {
        ...prev,
        phase: "reveal",
        scores: newScores,
        history: [...prev.history, { coord, votes: { ...prev.votes } }],
      };
    });
  }, []);

  const nextClue = useCallback(() => {
    setGameState(prev => {
      const nextIdx = prev.currentClueIdx + 1;
      const cluesPerRound = Math.ceil(allCoords.length / totalRounds);

      if (nextIdx >= prev.clueQueue.length) {
        return { ...prev, phase: "finished" };
      }

      // Verifica se passou de rodada
      const newRound = Math.floor(nextIdx / cluesPerRound) + 1;
      const isLastRound = newRound > totalRounds;

      return {
        ...prev,
        phase: isLastRound ? "finished" : "voting",
        round: Math.min(newRound, totalRounds),
        currentClueIdx: nextIdx,
        votes: {},
      };
    });
  }, [allCoords.length, totalRounds]);

  const resetGame = useCallback(() => {
    setGameState({
      phase: "idle",
      round: 0,
      clueQueue: [],
      currentClueIdx: 0,
      votes: {},
      scores: players.map(() => 0),
      history: [],
    });
  }, [players]);

  const clue = currentClueEntry();
  const correctCoord = gameState.phase === "reveal"
    ? gameState.clueQueue[gameState.currentClueIdx]
    : null;

  return {
    phase: gameState.phase,
    round: gameState.round,
    totalRounds,
    clue,
    votes: gameState.votes,
    scores: gameState.scores,
    history: gameState.history,
    correctCoord,
    allVoted: allVoted(gameState.votes),
    startGame,
    castVote,
    revealAnswer,
    nextClue,
    resetGame,
  };
}

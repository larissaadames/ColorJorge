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
  // Linha A – matizes de vermelho/laranja
  A1:  { color: "Vermelho vivo",   hex: "#E53935", clue: "O sangue que corre pelas veias" },
  A2:  { color: "Vermelho escuro", hex: "#B71C1C", clue: "O vinho tinto envelhecido" },
  A3:  { color: "Laranja forte",   hex: "#FB8C00", clue: "A fruta que deu nome à cor" },
  A4:  { color: "Laranja claro",   hex: "#FFCC02", clue: "O mel no favo de cera" },
  A5:  { color: "Âmbar",          hex: "#FFB300", clue: "A resina fossilizada com inseto" },
  A6:  { color: "Dourado",         hex: "#F9A825", clue: "O troféu de campeão do mundo" },
  A7:  { color: "Amarelo sol",     hex: "#FDD835", clue: "O sol no pico do meio-dia" },
  A8:  { color: "Amarelo claro",   hex: "#FFF176", clue: "O limão siciliano recém-cortado" },
  A9:  { color: "Creme",           hex: "#FFF8DC", clue: "A baunilha no sorvete artesanal" },
  A10: { color: "Bege",            hex: "#D7CCC8", clue: "A areia da praia ao entardecer" },

  // Linha B – amarelo-verde → verde
  B1:  { color: "Lima",            hex: "#CDDC39", clue: "A folha nova da primavera" },
  B2:  { color: "Verde lima",      hex: "#8BC34A", clue: "O pistache descascado" },
  B3:  { color: "Verde médio",     hex: "#4CAF50", clue: "A grama recém-cortada" },
  B4:  { color: "Verde floresta",  hex: "#2E7D32", clue: "A floresta Amazônica densa" },
  B5:  { color: "Verde musgo",     hex: "#558B2F", clue: "O musgo sobre pedras úmidas" },
  B6:  { color: "Oliva",           hex: "#827717", clue: "O uniforme militar camuflado" },
  B7:  { color: "Verde escuro",    hex: "#1B5E20", clue: "O abacate maduro por dentro" },
  B8:  { color: "Esmeralda",       hex: "#00897B", clue: "A pedra preciosa mais cobiçada" },
  B9:  { color: "Verde água",      hex: "#00BCD4", clue: "A piscina natural da gruta" },
  B10: { color: "Menta",           hex: "#80CBC4", clue: "A pastilha refrescante de hortelã" },

  // Linha C – ciano → azul claro
  C1:  { color: "Turquesa",        hex: "#26A69A", clue: "As pedras da jóia andina" },
  C2:  { color: "Ciano vibrante",  hex: "#00ACC1", clue: "O mar raso das Maldivas" },
  C3:  { color: "Azul piscina",    hex: "#29B6F6", clue: "A piscina olímpica vista de cima" },
  C4:  { color: "Azul céu",        hex: "#42A5F5", clue: "O céu limpo de inverno" },
  C5:  { color: "Azul médio",      hex: "#1E88E5", clue: "O planeta Terra visto do espaço" },
  C6:  { color: "Azul royal",      hex: "#1565C0", clue: "O manto da realeza europeia" },
  C7:  { color: "Azul marinho",    hex: "#0D47A1", clue: "O uniforme da marinha de guerra" },
  C8:  { color: "Azul prussiano",  hex: "#0A1172", clue: "O pigmento do pintor renascentista" },
  C9:  { color: "Azul petróleo",   hex: "#006064", clue: "O fundo do oceano profundo" },
  C10: { color: "Azul gelo",       hex: "#B3E5FC", clue: "O iceberg à deriva no Ártico" },

  // Linha D – roxo → violeta
  D1:  { color: "Índigo",          hex: "#3949AB", clue: "O jeans desbotado favorito" },
  D2:  { color: "Roxo",            hex: "#8E24AA", clue: "A cor da realeza medieval" },
  D3:  { color: "Violeta",         hex: "#7B1FA2", clue: "A orquídea no jardim botânico" },
  D4:  { color: "Lilás",           hex: "#CE93D8", clue: "O campo de lavanda da Provence" },
  D5:  { color: "Lavanda",         hex: "#E1BEE7", clue: "O sabonete perfumado de farmácia" },
  D6:  { color: "Uva",             hex: "#6A1B9A", clue: "O suco de uva escura e doce" },
  D7:  { color: "Ametista",        hex: "#AB47BC", clue: "A pedra semipreciosa roxa" },
  D8:  { color: "Magnólia",        hex: "#F3E5F5", clue: "A flor branco-lilás da magnólia" },
  D9:  { color: "Berinjela",       hex: "#4A148C", clue: "A casca roxa da berinjela" },
  D10: { color: "Orquídea",        hex: "#E040FB", clue: "A flor exótica do cerrado" },

  // Linha E – rosa → magenta
  E1:  { color: "Rosa choque",     hex: "#F06292", clue: "O flamingo em pé na lagoa" },
  E2:  { color: "Rosa médio",      hex: "#E91E63", clue: "A flor-de-cerejeira japonesa" },
  E3:  { color: "Rosa escuro",     hex: "#C2185B", clue: "O batom mais ousado da festa" },
  E4:  { color: "Magenta",         hex: "#D81B60", clue: "A tinta da impressora esgotando" },
  E5:  { color: "Carmesim",        hex: "#B71C1C", clue: "O tapete vermelho do cinema" },
  E6:  { color: "Coral",           hex: "#FF7043", clue: "O recife embaixo do mar cristalino" },
  E7:  { color: "Salmão",          hex: "#EF9A9A", clue: "O peixe grelhado no prato" },
  E8:  { color: "Pêssego",         hex: "#FFCCBC", clue: "A polpa da fruta madura no verão" },
  E9:  { color: "Terracota",       hex: "#BF360C", clue: "O vaso de barro artesanal" },
  E10: { color: "Tijolo",          hex: "#8D3B2B", clue: "A fachada antiga de casa colonial" },

  // Linha F – marrom → bege
  F1:  { color: "Marrom escuro",   hex: "#4E342E", clue: "O chocolate amargo 70%" },
  F2:  { color: "Marrom médio",    hex: "#6D4C41", clue: "O tronco do carvalho velho" },
  F3:  { color: "Caramelo",        hex: "#8D6E63", clue: "A calda quente na sobremesa" },
  F4:  { color: "Café",            hex: "#795548", clue: "O expresso recém-passado" },
  F5:  { color: "Siena",           hex: "#A1887F", clue: "A pintura rupestre da caverna" },
  F6:  { color: "Nude",            hex: "#D7BEA8", clue: "O esmalte de tom neutro" },
  F7:  { color: "Areia",           hex: "#F5DEB3", clue: "O deserto do Saara ao meio-dia" },
  F8:  { color: "Marfim",          hex: "#FFFFF0", clue: "A tecla do piano antigo" },
  F9:  { color: "Cobre",           hex: "#B87333", clue: "O fio elétrico sem revestimento" },
  F10: { color: "Bronze",          hex: "#CD7F32", clue: "A estátua antiga na praça" },

  // Linha G – preto → branco (neutros)
  G1:  { color: "Preto",           hex: "#212121", clue: "A tinta da caneta esferográfica" },
  G2:  { color: "Grafite escuro",  hex: "#424242", clue: "O asfalto molhado depois da chuva" },
  G3:  { color: "Cinza escuro",    hex: "#616161", clue: "A fumaça saindo da chaminé" },
  G4:  { color: "Cinza médio",     hex: "#9E9E9E", clue: "O elefante africano de perto" },
  G5:  { color: "Cinza claro",     hex: "#BDBDBD", clue: "A nuvem de chuva pesada" },
  G6:  { color: "Prata",           hex: "#C0C0C0", clue: "A medalha olímpica de segundo lugar" },
  G7:  { color: "Quase branco",    hex: "#E0E0E0", clue: "A parede recém-pintada de branco" },
  G8:  { color: "Branco gelo",     hex: "#F5F5F5", clue: "A neve fresca das montanhas" },
  G9:  { color: "Branco puro",     hex: "#FFFFFF", clue: "A página em branco do caderno novo" },
  G10: { color: "Pérola",          hex: "#F8F6F0", clue: "O colar da avó guardado na caixinha" },
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

# ColorJorge — Cores com Dicas (Digital)

## Estrutura de arquivos

```
src/
├── components/
│   └── ColorBoard.jsx      ← Tabuleiro p5.js (componente isolado)
├── hooks/
│   └── useColorGame.js     ← Lógica de partida + dicionário de dicas
└── pages/
    └── GamePage.jsx        ← Exemplo de página completa
```

---

## Instalação

```bash
npm install react-p5 p5
```

---

## ColorBoard — Componente de Tabuleiro

```jsx
import ColorBoard from "./components/ColorBoard";

<ColorBoard
  players={[{ name: "Larissa" }, { name: "Jorge" }]}
  clue={{ coord: "C5", text: "O planeta Terra visto do espaço" }}
  votes={{ 0: "C5", 1: "B4" }}
  onVote={(coord) => console.log("Votou em:", coord)}
  phase="reveal"          // "voting" | "reveal"
  correctCoord="C5"       // só em phase="reveal"
  disabled={false}
/>
```

### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `players` | `{ name: string }[]` | Lista de jogadores |
| `clue` | `{ coord, text }` | Dica da rodada atual |
| `votes` | `{ [playerIdx]: coord }` | Votos já registrados |
| `onVote` | `(coord) => void` | Callback ao clicar numa célula |
| `phase` | `"voting" \| "reveal"` | Fase atual |
| `correctCoord` | `string` | Coordenada correta (reveal) |
| `disabled` | `bool` | Bloqueia cliques |

---

## useColorGame — Hook de Partida

```jsx
import { useColorGame } from "./hooks/useColorGame";

const {
  phase,          // "idle" | "voting" | "reveal" | "finished"
  round,          // número da rodada atual
  clue,           // { coord, color, hex, clue }
  votes,          // { [playerIdx]: coord }
  scores,         // [number, number, ...]
  correctCoord,   // string (só em "reveal")
  allVoted,       // boolean — todos os jogadores votaram?
  startGame,      // () => void
  castVote,       // (playerIdx, coord) => void
  revealAnswer,   // () => void — mostra o gabarito
  nextClue,       // () => void — avança para a próxima dica
  resetGame,      // () => void
} = useColorGame(players, totalRounds);
```

---

## Mecânica do jogo

1. Uma **dica** aparece para todos os jogadores
2. Cada jogador clica na cor que acha que a dica descreve (turnos sequenciais)
3. Quando todos votaram → botão "Ver gabarito"
4. O tabuleiro **revela a cor correta** com:
   - Checkmark verde na célula correta
   - Cruz vermelha nas escolhas erradas
   - Seta apontando do erro → certo
5. +1 ponto para quem acertou
6. Avança para a próxima dica
7. Ao fim de todas as rodadas → tela de resultado com ranking

---

## Dicionário de dicas

70 coordenadas (A-G × 1-10), organizadas por faixa de cor:

- **Linha A** — Vermelhos, laranjas, amarelos, bege
- **Linha B** — Lima, verdes, esmeralda, ciano
- **Linha C** — Turquesa, azuis, azul-gelo
- **Linha D** — Índigo, roxo, lilás, lavanda
- **Linha E** — Rosa, coral, salmão, terracota
- **Linha F** — Marrons, caramelo, areia, bronze
- **Linha G** — Neutros (preto → branco)

As dicas são embaralhadas a cada partida.

---

## Usar o tabuleiro em outra página

```jsx
// Em qualquer página do seu projeto:
import ColorBoard from "../components/ColorBoard";
import { useColorGame } from "../hooks/useColorGame";

export default function MinhaOutraPagina() {
  const players = [{ name: "P1" }, { name: "P2" }];
  const game = useColorGame(players, 2);

  return (
    <div>
      <h1>Minha página customizada</h1>
      <ColorBoard
        players={players}
        clue={game.clue}
        votes={game.votes}
        onVote={(coord) => game.castVote(/* currentPlayer */, coord)}
        phase={game.phase}
        correctCoord={game.correctCoord}
      />
    </div>
  );
}
```

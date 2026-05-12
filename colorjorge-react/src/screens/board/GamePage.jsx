/**
 * GamePage.jsx
 * Exemplo de página que monta o tabuleiro + lógica de partida
 * Importe ColorBoard e useColorGame em qualquer página do seu projeto.
 */

import { useState } from "react";
import ColorBoard from "../../components/game/ColorBoard";
import { useColorGame } from "../../useColorGame.js";

const PLAYER_COLORS = ["#E53935","#1E88E5","#43A047","#FDD835","#9C27B0","#FF7043"];

export default function GamePage() {
  // ── Setup de jogadores ───────────────────────────────────────────────────
  const [setupDone, setSetupDone] = useState(false);
  const [playerNames, setPlayerNames] = useState(["Larissa", "Jorge"]);
  const [totalRounds, setTotalRounds] = useState(3);

  const players = playerNames.map(name => ({ name }));

  const {
    phase, round, clue, votes, scores, correctCoord, allVoted,
    startGame, castVote, revealAnswer, nextClue, resetGame,
  } = useColorGame(players, totalRounds);

  // ── Qual jogador está votando agora? ─────────────────────────────────────
  const currentVoterIdx = players.findIndex((_, i) => votes[i] === undefined);

  const handleVote = (coord) => {
    if (phase !== "voting" || currentVoterIdx < 0) return;
    castVote(currentVoterIdx, coord);
  };

  // ── Tela de Setup ─────────────────────────────────────────────────────────
  if (!setupDone) {
    return (
      <div style={styles.page}>
        <div style={styles.setupCard}>
          <h1 style={styles.title}>CORES <span style={{ color: "#FB8C00" }}>com Dicas</span></h1>
          <p style={styles.subtitle}>edição digital</p>

          <div style={styles.sectionLabel}>Jogadores</div>
          {playerNames.map((name, i) => (
            <div key={i} style={styles.playerRow}>
              <div style={{ ...styles.playerDot, background: PLAYER_COLORS[i] + "33", borderColor: PLAYER_COLORS[i], color: PLAYER_COLORS[i] }}>
                {i + 1}
              </div>
              <input
                style={styles.input}
                value={name}
                onChange={e => {
                  const n = [...playerNames];
                  n[i] = e.target.value;
                  setPlayerNames(n);
                }}
                placeholder={`Jogador ${i + 1}`}
              />
              {playerNames.length > 2 && (
                <button style={styles.removeBtn} onClick={() => setPlayerNames(playerNames.filter((_, j) => j !== i))}>✕</button>
              )}
            </div>
          ))}
          {playerNames.length < 6 && (
            <button style={styles.addBtn} onClick={() => setPlayerNames([...playerNames, `Jogador ${playerNames.length + 1}`])}>
              + Adicionar jogador
            </button>
          )}

          <div style={{ ...styles.sectionLabel, marginTop: 20 }}>Rodadas</div>
          <div style={styles.roundRow}>
            {[1, 2, 3, 4, 5].map(r => (
              <button key={r}
                style={{ ...styles.roundBtn, ...(totalRounds === r ? styles.roundBtnActive : {}) }}
                onClick={() => setTotalRounds(r)}>
                {r}
              </button>
            ))}
          </div>

          <button style={styles.primaryBtn} onClick={() => { setSetupDone(true); startGame(); }}>
            COMEÇAR PARTIDA
          </button>
        </div>
      </div>
    );
  }

  // ── Tela de Resultado Final ──────────────────────────────────────────────
  if (phase === "finished") {
    const ranked = players
      .map((p, i) => ({ name: p.name, score: scores[i], idx: i }))
      .sort((a, b) => b.score - a.score);

    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <h2 style={{ ...styles.title, fontSize: 28 }}>Resultado Final</h2>
          {ranked.map((p, rank) => (
            <div key={p.idx} style={styles.rankRow}>
              <span style={styles.rankPos}>{["🥇","🥈","🥉"][rank] ?? `${rank+1}º`}</span>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: PLAYER_COLORS[p.idx], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 16, color: PLAYER_COLORS[p.idx], fontWeight: 700 }}>{p.name}</span>
              <span style={styles.scoreNum}>{p.score} pts</span>
            </div>
          ))}
          <button style={{ ...styles.primaryBtn, marginTop: 28 }} onClick={() => { resetGame(); setSetupDone(false); }}>
            Jogar novamente
          </button>
        </div>
      </div>
    );
  }

  // ── Tela de Jogo ──────────────────────────────────────────────────────────
  const currentVoter = phase === "voting" && currentVoterIdx >= 0 ? players[currentVoterIdx] : null;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.roundBadge}>Rodada {round}/{totalRounds}</span>
        {phase === "voting" && currentVoter && (
          <div style={styles.turnBadge}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PLAYER_COLORS[currentVoterIdx] }} />
            <span style={{ color: PLAYER_COLORS[currentVoterIdx], fontWeight: 700 }}>
              Vez de {currentVoter.name}
            </span>
          </div>
        )}
        {phase === "reveal" && (
          <div style={{ ...styles.turnBadge, borderColor: "#4CAF50" }}>
            <span style={{ color: "#4CAF50", fontWeight: 700 }}>Gabarito!</span>
          </div>
        )}
      </div>

      {/* Caixa de dica */}
      {clue && (
        <div style={styles.clueBox}>
          <span style={styles.clueLabel}>DICA</span>
          <span style={styles.clueText}>{clue.clue}</span>
          <span style={styles.clueCoord}>{clue.coord}</span>
        </div>
      )}

      {/* Tabuleiro p5 */}
      {clue && (
        <div style={{ marginBottom: 16, overflowX: "auto" }}>
          <ColorBoard
            players={players}
            clue={clue}
            votes={votes}
            onVote={handleVote}
            phase={phase}
            correctCoord={correctCoord}
            disabled={phase === "reveal" || allVoted}
          />
        </div>
      )}

      {/* Votos registrados */}
      {phase === "voting" && (
        <div style={styles.votesRow}>
          {players.map((p, i) => (
            <div key={i} style={styles.voteChip}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: PLAYER_COLORS[i] }} />
              <span style={{ fontSize: 12, color: votes[i] ? "#eee" : "#555" }}>
                {p.name}: {votes[i] ?? "aguardando..."}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Reveal: mostra quem acertou */}
      {phase === "reveal" && clue && (
        <div style={styles.revealBox}>
          <div style={styles.revealCorrect}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: clue.hex, border: "2px solid #fff" }} />
            <span style={{ color: "#eee", fontSize: 15 }}>
              A cor era <strong style={{ color: "#FDD835" }}>{clue.color}</strong>
            </span>
          </div>
          <div style={styles.voteSummary}>
            {players.map((p, i) => {
              const voted = votes[i];
              const correct = voted === correctCoord;
              return (
                <div key={i} style={{ ...styles.voteResult, borderColor: correct ? "#4CAF50" : "#E53935" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: PLAYER_COLORS[i] }} />
                  <span style={{ fontSize: 13, color: "#ccc", flex: 1 }}>{p.name}</span>
                  <span style={{ color: correct ? "#4CAF50" : "#E53935", fontSize: 13, fontWeight: 700 }}>
                    {correct ? "+1 ✓" : `${voted ?? "sem voto"} ✗`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botões de ação */}
      <div style={styles.actions}>
        {phase === "voting" && allVoted && (
          <button style={styles.primaryBtn} onClick={revealAnswer}>
            Ver gabarito
          </button>
        )}
        {phase === "reveal" && (
          <button style={styles.primaryBtn} onClick={nextClue}>
            Próxima dica
          </button>
        )}
      </div>

      {/* Placar lateral */}
      <div style={styles.scoreboard}>
        {players.map((p, i) => (
          <div key={i} style={styles.scoreItem}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: PLAYER_COLORS[i] }} />
            <span style={{ fontSize: 12, color: "#aaa", flex: 1 }}>{p.name}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: PLAYER_COLORS[i] }}>{scores[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// export default GamePage;

// ── Estilos ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0d10",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 16px 40px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#f0ece0",
    gap: 14,
  },
  setupCard: {
    background: "#1a1a1e",
    border: "1px solid #2a2a2e",
    borderRadius: 20,
    padding: "36px 32px",
    width: "100%",
    maxWidth: 420,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: -1,
    textAlign: "center",
    marginBottom: 4,
    color: "#f0ece0",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#555",
    marginBottom: 12,
  },
  playerRow: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10 },
  playerDot: {
    width: 34, height: 34, borderRadius: "50%",
    border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  input: {
    flex: 1, background: "#111", border: "1px solid #333", borderRadius: 10,
    padding: "9px 14px", color: "#f0ece0", fontSize: 14, outline: "none",
  },
  removeBtn: {
    background: "none", border: "1px solid #333", borderRadius: 8,
    color: "#555", width: 30, height: 30, cursor: "pointer", fontSize: 14,
  },
  addBtn: {
    width: "100%", background: "none", border: "1px dashed #333",
    borderRadius: 10, padding: 10, color: "#555", cursor: "pointer", fontSize: 13,
    marginBottom: 8,
  },
  roundRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 },
  roundBtn: {
    background: "#111", border: "1px solid #333", borderRadius: 8,
    padding: "8px 18px", color: "#777", cursor: "pointer", fontSize: 14,
  },
  roundBtnActive: { background: "#FB8C00", borderColor: "#FB8C00", color: "#fff", fontWeight: 700 },
  primaryBtn: {
    width: "100%", background: "linear-gradient(135deg,#fb8c00,#e65100)",
    border: "none", borderRadius: 12, padding: "14px 0", color: "#fff",
    fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 1,
  },
  header: {
    width: "100%", maxWidth: 620,
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
  },
  roundBadge: {
    fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#555",
  },
  turnBadge: {
    background: "#1a1a1e", border: "1px solid #2a2a2e",
    borderRadius: 30, padding: "6px 16px",
    display: "flex", alignItems: "center", gap: 8,
  },
  clueBox: {
    width: "100%", maxWidth: 620,
    background: "#1a1a1e", border: "1px solid #2a2a2e",
    borderRadius: 14, padding: "16px 20px",
    display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
  },
  clueLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "#444" },
  clueText: { fontSize: 20, fontWeight: 800, color: "#f7c59f", flex: 1 },
  clueCoord: {
    fontSize: 12, color: "#555", background: "#111",
    border: "1px solid #222", borderRadius: 6, padding: "3px 10px", fontFamily: "monospace",
  },
  votesRow: {
    width: "100%", maxWidth: 620,
    display: "flex", flexWrap: "wrap", gap: 8,
  },
  voteChip: {
    background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8,
    padding: "5px 12px", display: "flex", alignItems: "center", gap: 7,
  },
  revealBox: {
    width: "100%", maxWidth: 620,
    background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 14, padding: "16px 20px",
  },
  revealCorrect: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  voteSummary: { display: "flex", flexDirection: "column", gap: 8 },
  voteResult: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#111", borderRadius: 8, padding: "7px 12px",
    border: "1px solid",
  },
  actions: { width: "100%", maxWidth: 620 },
  scoreboard: {
    width: "100%", maxWidth: 620,
    background: "#1a1a1e", border: "1px solid #2a2a2e",
    borderRadius: 12, padding: "12px 16px",
    display: "flex", flexDirection: "column", gap: 8,
  },
  scoreItem: { display: "flex", alignItems: "center", gap: 8 },
  resultCard: {
    background: "#1a1a1e", border: "1px solid #2a2a2e",
    borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 420, marginTop: 20,
  },
  rankRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 0", borderBottom: "1px solid #1f1f1f",
  },
  rankPos: { fontSize: 22, width: 32 },
  scoreNum: { fontSize: 20, fontWeight: 900, color: "#FB8C00" },
};

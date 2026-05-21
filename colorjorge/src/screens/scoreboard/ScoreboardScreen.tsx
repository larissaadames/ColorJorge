import GameShell from '../../components/game/GameShell';
import ScreenNoticeCard from '../../components/game/ScreenNoticeCard';

function ScoreboardScreen() {
  return (
    <GameShell panelLabel="Tela do placar">
      <ScreenNoticeCard
        title="Placar"
        text="Espaco reservado para ranking, rodadas e historico de acertos da partida."
      />
    </GameShell>
  );
}

export default ScoreboardScreen;

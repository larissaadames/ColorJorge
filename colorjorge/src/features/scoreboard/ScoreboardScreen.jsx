import ScreenNoticeCard from '../../components/ui/ScreenNoticeCard';
import GameShell from '../game/GameShell';
import { useGame } from '../game/useGame';

function ScoreboardScreen() {
  const { keyword } = useGame();
  const keywordText = keyword ?? 'aguardando mestre...';

  return (
    <GameShell panelLabel="Tela do placar">
      <ScreenNoticeCard
        title="Placar"
        text={`Palavra-chave: ${keywordText}. Espaco reservado para ranking, rodadas e historico de acertos da partida.`}
      />
    </GameShell>
  );
}

export default ScoreboardScreen;

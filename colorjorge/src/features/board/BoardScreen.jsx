import ScreenNoticeCard from '../../components/ui/ScreenNoticeCard';
import GameShell from '../game/GameShell';
import { useGame } from '../game/useGame';

function BoardScreen() {
  const { keyword } = useGame();
  const keywordText = keyword ?? 'aguardando mestre...';

  return (
    <GameShell panelLabel="Tela do tabuleiro">
      <ScreenNoticeCard
        title="Tabuleiro"
        text={`Palavra-chave: ${keywordText}. Aqui vai entrar a matriz de cores completa para os jogadores fazerem a escolha.`}
      />
    </GameShell>
  );
}

export default BoardScreen;

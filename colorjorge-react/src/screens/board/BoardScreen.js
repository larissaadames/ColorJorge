import GameShell from '../../components/game/GameShell';
import ScreenNoticeCard from '../../components/game/ScreenNoticeCard';

function BoardScreen() {
  return (
    <GameShell panelLabel="Tela do tabuleiro">
      <ScreenNoticeCard
        title="Tabuleiro"
        text="Aqui vai entrar a matriz de cores completa para os jogadores fazerem a escolha."
      />
    </GameShell>
  );
}

export default BoardScreen;

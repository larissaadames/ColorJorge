import ColorCard from './ColorCard';
import GameShell from '../game/GameShell';
import KeywordForm from './KeywordForm';
import { useGame } from '../game/useGame';

function MasterScreen() {
  const { drawnColor, setKeyword } = useGame();

  return (
    <GameShell panelLabel="Tela mestre do jogo">
      <ColorCard
        code={drawnColor.code}
        color={drawnColor.hex}
        colorLabel="Cor sorteada da rodada"
      />
      <KeywordForm onSubmit={setKeyword} />
    </GameShell>
  );
}

export default MasterScreen;

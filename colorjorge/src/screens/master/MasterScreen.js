import ColorCard from '../../components/game/ColorCard';
import GameShell from '../../components/game/GameShell';
import KeywordForm from '../../components/game/KeywordForm';

function MasterScreen() {
  const handleKeywordSubmit = () => {};

  return (
    <GameShell panelLabel="Tela mestre do jogo">
      <ColorCard code="F 29" color="#19d7ea" colorLabel="Cor sorteada da rodada" />
      <KeywordForm onSubmit={handleKeywordSubmit} />
    </GameShell>
  );
}

export default MasterScreen;

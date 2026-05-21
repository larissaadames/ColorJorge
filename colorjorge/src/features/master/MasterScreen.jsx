import ColorCard from './ColorCard';
import GameShell from '../game/GameShell';
import KeywordForm from './KeywordForm';
import AnswerList from '../game/AnswerList';
import { useGame } from '../game/useGame';
import '../game/RoomBanner.css';

function MasterScreen() {
  const { drawnColor, sendTip, roomCode, answers } = useGame();

  return (
    <GameShell panelLabel="Tela mestre do jogo">
      {roomCode && <p className="room-banner">Sala: {roomCode}</p>}
      <ColorCard
        code={drawnColor.code}
        color={drawnColor.hex}
        colorLabel="Cor sorteada da rodada"
      />
      <KeywordForm onSubmit={sendTip} />
      <AnswerList answers={answers} />
    </GameShell>
  );
}

export default MasterScreen;

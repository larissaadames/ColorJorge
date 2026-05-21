import ScreenNoticeCard from '../../components/ui/ScreenNoticeCard';
import GameShell from '../game/GameShell';
import AnswerForm from './AnswerForm';
import { useGame } from '../game/useGame';
import '../game/RoomBanner.css';

function BoardScreen() {
  const { keyword, roomCode, sendAnswer } = useGame();
  const keywordText = keyword ?? 'aguardando mestre...';

  return (
    <GameShell panelLabel="Tela do tabuleiro">
      {roomCode && <p className="room-banner">Sala: {roomCode}</p>}
      <ScreenNoticeCard
        title="Tabuleiro"
        text={`Palavra-chave: ${keywordText}. Aqui vai entrar a matriz de cores completa para os jogadores fazerem a escolha.`}
      />
      <AnswerForm onSubmit={sendAnswer} />
    </GameShell>
  );
}

export default BoardScreen;

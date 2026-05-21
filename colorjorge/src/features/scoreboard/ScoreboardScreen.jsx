import ScreenNoticeCard from '../../components/ui/ScreenNoticeCard';
import GameShell from '../game/GameShell';
import AnswerList from '../game/AnswerList';
import { useGame } from '../game/useGame';
import '../game/RoomBanner.css';

function ScoreboardScreen() {
  const { keyword, roomCode, answers } = useGame();
  const keywordText = keyword ?? 'aguardando mestre...';

  return (
    <GameShell panelLabel="Tela do placar">
      {roomCode && <p className="room-banner">Sala: {roomCode}</p>}
      <ScreenNoticeCard
        title="Placar"
        text={`Palavra-chave: ${keywordText}. Ranking e historico de acertos da partida.`}
      />
      <AnswerList answers={answers} title="Respostas ao vivo" />
    </GameShell>
  );
}

export default ScoreboardScreen;

import ColorCard from '../../components/game/ColorCard';
import GameShell from '../../components/game/GameShell';
import KeywordForm from '../../components/game/KeywordForm';
import { useNavigate } from 'react-router-dom';

function MasterScreen() {
  const handleKeywordSubmit = () => {};
  const navigate = useNavigate();

  return (
    <GameShell panelLabel="Tela mestre do jogo">
      <ColorCard code="F 29" color="#581299" colorLabel="Cor sorteada da rodada" />
      <KeywordForm onSubmit={handleKeywordSubmit} />

      <button 
        className="seu-botao-estilo" 
        onClick={() => navigate('/criar-perfil')}
      >
        Criar Novo Perfil
      </button>

    </GameShell>
  );
}

export default MasterScreen;

import RoleNav from './RoleNav';
import './GameShell.css';
import { useNavigate } from 'react-router-dom';

function GameShell({ panelLabel, children }) {
  const navigate = useNavigate();

  return (
    <main className="game-screen">
      <div className="game-grain-overlay" aria-hidden="true" />

      <div className="game-brand">
      <p className="visao">VisaoMaster</p>
      <button 
        onClick={() => navigate('/criar-perfil')} 
        className="btn-criar-perfil"
      >
        Criar Perfil
      </button>
      </div>

      <section className="game-panel" aria-label={panelLabel}>
        <RoleNav />
        {children}
      </section>
    </main>
  );
}

export default GameShell;

import RoleNav from './RoleNav';
import './GameShell.css';

function GameShell({ panelLabel, children }) {
  return (
    <main className="game-screen">
      <div className="game-grain-overlay" aria-hidden="true" />

      <p className="game-brand">VisaoMaster</p>

      <section className="game-panel" aria-label={panelLabel}>
        <RoleNav />
        {children}
      </section>
    </main>
  );
}

export default GameShell;

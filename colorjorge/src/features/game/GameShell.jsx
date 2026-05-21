import RoleNav from './RoleNav';
import './GameShell.css';

function GameShell({ panelLabel, children, showNav = true }) {
  return (
    <main className="game-screen">
      <div className="game-grain-overlay" aria-hidden="true" />

      <p className="game-brand">VisaoMaster</p>

      <section className="game-panel" aria-label={panelLabel}>
        {showNav ? <RoleNav /> : null}
        {children}
      </section>
    </main>
  );
}

export default GameShell;

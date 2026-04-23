import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/mestre', label: 'Mestre', iconClass: 'game-tab-icon-diamond' },
  { to: '/tabuleiro', label: 'Tabuleiro', iconClass: 'game-tab-icon-circle' },
  { to: '/placar', label: 'Placar', iconClass: 'game-tab-icon-star' }
];

function RoleNav() {
  return (
    <nav className="game-tab-nav" aria-label="Navegacao da tela">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => (isActive ? 'game-tab game-tab-active' : 'game-tab')}
        >
          <span className={`game-tab-icon ${tab.iconClass}`} aria-hidden="true" />
          <span className="game-tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default RoleNav;

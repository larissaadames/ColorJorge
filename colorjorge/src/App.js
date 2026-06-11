import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MasterScreen        from './features/master/MasterScreen';
import BoardScreen         from './features/board/BoardScreen';
import ScoreboardScreen    from './features/scoreboard/ScoreboardScreen';
import LobbyScreen         from './features/lobby/LobbyScreen';
import ProfileScreen       from './features/profile/ProfileScreen';
import ProfileCreateScreen from './features/profile/CreateProfileScreen';
import BoardMobile         from './screens/board/BoardMobile';
import GamePage            from './screens/board/GamePage';
import LoginScreen         from './features/auth/LoginScreen';
import RotaProtegida       from './features/auth/RotaProtegida';

function App() {
  return (
    <div className="app-shell">
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/login"        element={<LoginScreen />} />
        <Route path="/criar-perfil" element={<ProfileCreateScreen />} />

        {/* ── Protegidas ── */}
        <Route path="/" element={
          <RotaProtegida><LobbyScreen /></RotaProtegida>
        } />
        <Route path="/perfil" element={
          <RotaProtegida><ProfileScreen /></RotaProtegida>
        } />
        <Route path="/mestre" element={
          <RotaProtegida><MasterScreen /></RotaProtegida>
        } />
        <Route path="/tabuleiro" element={
          <RotaProtegida><BoardScreen /></RotaProtegida>
        } />
        <Route path="/placar" element={
          <RotaProtegida><ScoreboardScreen /></RotaProtegida>
        } />
        <Route path="/mobile"  element={<BoardMobile />} />
        <Route path="/defesa1" element={<GamePage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

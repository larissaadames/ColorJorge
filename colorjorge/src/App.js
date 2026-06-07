import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MasterScreen from './features/master/MasterScreen';
import BoardScreen from './features/board/BoardScreen';
import ScoreboardScreen from './features/scoreboard/ScoreboardScreen';
import LobbyScreen from './features/lobby/LobbyScreen';
import RoomRouteGuard from './features/game/RoomRouteGuard';
import Profile from './features/profile/Profile';
import ProfileCreateScreen from './features/profile/CreateProfileScreen';
import BoardMobile from './screens/board/BoardMobile';
import GamePage from './screens/board/GamePage';

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route
          path="/mestre"
          element={
            //<RoomRouteGuard requiredRole="master">
              <MasterScreen />
            //</RoomRouteGuard>
          }
        />
        <Route
          path="/criar-perfil"
          element={
              <ProfileCreateScreen/>
          }
        />
        <Route
          path="/perfil"
          element ={
            <Profile/>}
        />
        <Route
          path="/tabuleiro"
          element={
           // <RoomRouteGuard requiredRole="player">
              <BoardScreen />
           // </RoomRouteGuard>
          }
        />
        <Route
          path="/placar"
          element={
          //  <RoomRouteGuard requiredRole="master">
              <ScoreboardScreen />
            //</RoomRouteGuard>
          }
        />
        <Route path="/mobile" element={<BoardMobile />} />
        <Route path="/defesa1" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MasterScreen from './screens/master/MasterScreen';
import BoardScreen from './screens/board/BoardScreen';
import ScoreboardScreen from './screens/scoreboard/ScoreboardScreen';
import BoardMobile from './screens/board/BoardMobile';

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to="/mestre" replace />} />
        <Route path="/mestre" element={<MasterScreen />} />
        <Route path="/tabuleiro" element={<BoardScreen />} />
        <Route path="/placar" element={<ScoreboardScreen />} />
        <Route path="*" element={<Navigate to="/mestre" replace />} />
        <Route path="/mobile" element= {<BoardMobile/>}/>
      </Routes>
    </div>
  );
}

export default App;

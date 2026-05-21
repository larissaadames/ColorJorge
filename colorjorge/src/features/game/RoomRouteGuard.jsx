import { Navigate, useLocation } from 'react-router-dom';
import { useRoom } from '../game/useRoom';

function RoomRouteGuard({ children, requiredRole }) {
  const { isConnected, role } = useRoom();
  const location = useLocation();

  if (!isConnected) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && role !== requiredRole) {
    if (role === 'master') {
      return <Navigate to="/mestre" replace />;
    }

    if (role === 'player') {
      return <Navigate to="/tabuleiro" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoomRouteGuard;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../game/GameShell';
import { useRoom } from '../game/useRoom';
import './LobbyScreen.css';

function LobbyScreen() {
  const navigate = useNavigate();
  const { connectionStatus, roomCode, role, error, isConnected, createRoom, joinRoom } = useRoom();
  const [selectedRole, setSelectedRole] = useState(null);
  const [joinCode, setJoinCode] = useState('');

  const isConnecting = connectionStatus === 'connecting';
  const masterReady = role === 'master' && isConnected;
  const playerReady = role === 'player' && isConnected;

  const handleMasterCreate = () => {
    setSelectedRole('master');
    createRoom();
  };

  const handlePlayerJoin = event => {
    event.preventDefault();
    setSelectedRole('player');
    joinRoom(joinCode);
  };

  const handleEnterGame = () => {
    if (role === 'master') {
      navigate('/mestre');
      return;
    }

    if (role === 'player') {
      navigate('/tabuleiro');
    }
  };

  return (
    <GameShell panelLabel="Entrada na sala" showNav={false}>
      <div className="lobby-screen">
        <button 
        className="profile-btn-top-right" 
        onClick={() => navigate('/criar-perfil')}
      >
        Criar Perfil
      </button>

        <h1 className="lobby-title">ColorJorge</h1>
        <p className="lobby-subtitle">
          Escolha seu papel e entre na mesma sala para jogar em tempo real.
        </p>

        <div className="lobby-role-buttons">
          <button
            type="button"
            className={
              selectedRole === 'master'
                ? 'lobby-role-button lobby-role-button-active'
                : 'lobby-role-button'
            }
            onClick={() => setSelectedRole('master')}
          >
            Mestre
          </button>
          <button
            type="button"
            className={
              selectedRole === 'player'
                ? 'lobby-role-button lobby-role-button-active'
                : 'lobby-role-button'
            }
            onClick={() => setSelectedRole('player')}
          >
            Jogador
          </button>
        </div>

        {selectedRole === 'master' && (
          <>
            {!masterReady ? (
              <button
                type="button"
                className="lobby-action-button"
                onClick={handleMasterCreate}
                disabled={isConnecting}
              >
                {isConnecting ? 'Conectando...' : 'Criar sala'}
              </button>
            ) : (
              <>
                <p className="lobby-subtitle">Compartilhe este codigo com os jogadores:</p>
                <p className="lobby-room-code">{roomCode}</p>
                <button type="button" className="lobby-action-button" onClick={handleEnterGame}>
                  Entrar no jogo
                </button>
              </>
            )}
          </>
        )}

        {selectedRole === 'player' && (
          <form onSubmit={handlePlayerJoin} className="lobby-screen">
            <input
              type="text"
              className="lobby-input"
              placeholder="Codigo da sala"
              value={joinCode}
              onChange={event => setJoinCode(event.target.value.toUpperCase())}
              maxLength={4}
              autoComplete="off"
            />
            {!playerReady ? (
              <button type="submit" className="lobby-action-button" disabled={isConnecting}>
                {isConnecting ? 'Conectando...' : 'Entrar'}
              </button>
            ) : (
              <button type="button" className="lobby-action-button" onClick={handleEnterGame}>
                Entrar no jogo
              </button>
            )}
          </form>
        )}

        {error && <p className="lobby-error">{error}</p>}

        {isConnecting && !error && (
          <p className="lobby-status">Estabelecendo conexao WebSocket...</p>
        )}
      </div>
    </GameShell>
  );
}

export default LobbyScreen;

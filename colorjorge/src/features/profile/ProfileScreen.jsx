import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfileScreen.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro]       = useState('');

  useEffect(() => {
    const token = localStorage.getItem('cj_token');
    if (!token) { navigate('/login'); return; }

    fetch(`${SERVER_URL}/api/eu`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setUsuario)
      .catch(() => { setErro('Não foi possível carregar o perfil.'); });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('cj_token');
    navigate('/login');
  }

  if (erro) return (
    <div className="perfil-shell">
      <p className="perfil-erro">{erro}</p>
      <Link to="/login" className="perfil-btn-acao">Voltar ao login</Link>
    </div>
  );

  if (!usuario) return (
    <div className="perfil-shell">
      <p className="perfil-carregando">Carregando perfil…</p>
    </div>
  );

  const iniciais = usuario.username
    .split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  const dataEntrada = new Date(usuario.criado_em).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="perfil-shell">
      <div className="perfil-card">

        {/* Avatar */}
        <div className="perfil-avatar-wrap">
          {usuario.foto_url ? (
            <img src={usuario.foto_url} alt="Foto de perfil" className="perfil-avatar-img" />
          ) : (
            <div className="perfil-avatar-placeholder">{iniciais}</div>
          )}
        </div>

        {/* Nome e e-mail */}
        <h1 className="perfil-username">{usuario.username}</h1>
        <p className="perfil-email">{usuario.email}</p>

        {/* Divider */}
        <div className="perfil-divider" />

        {/* Info */}
        <div className="perfil-info-row">
          <span className="perfil-info-label">Membro desde</span>
          <span className="perfil-info-valor">{dataEntrada}</span>
        </div>

        <div className="perfil-info-row">
          <span className="perfil-info-label">ID do jogador</span>
          <span className="perfil-info-valor perfil-id">#{String(usuario.id).padStart(4, '0')}</span>
        </div>

        {/* Ações */}
        <div className="perfil-acoes">
          <Link to="/" className="perfil-btn-acao">
            Ir para o Lobby
          </Link>
          <button className="perfil-btn-sair" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

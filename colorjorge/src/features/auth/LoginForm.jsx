import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import './auth.css';

export default function LoginForm() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [email, setEmail]   = useState('');
  const [senha, setSenha]   = useState('');
  const [erro, setErro]     = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const resultado = await login(email, senha);
    if (resultado.ok) {
      navigate('/');
    } else {
      setErro(resultado.erro);
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">

      <div className="auth-logo">
        <div className="auth-logo-badge">🎨</div>
        <div>
          <h1 className="auth-title">ColorJorge</h1>
          <p className="auth-subtitle">Entre para continuar jogando</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="auth-fields">

          <div className="auth-field">
            <label className="auth-label">E-mail</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉</span>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Senha</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                className="auth-input"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                style={{
                  position: 'absolute', right: '14px', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'rgba(156,166,198,0.6)',
                  fontSize: '1rem', padding: 0, lineHeight: 1,
                }}
              >
                {mostrarSenha ? '🙈' : '👁'}
              </button>
            </div>
          </div>

        </div>

        {erro && <p className="auth-erro">{erro}</p>}

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="auth-footer">
        Não tem conta?{' '}
        <Link to="/criar-perfil">Criar perfil</Link>
      </p>
    </div>
  );
}

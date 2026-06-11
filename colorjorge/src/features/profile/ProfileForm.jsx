import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../auth/auth.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

export default function ProfileForm() {
  const navigate  = useNavigate();
  const fotoRef   = useRef(null);

  // Step 1: nome + foto | Step 2: email + senha
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('');
  const [foto, setFoto]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erro, setErro]             = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) { setFoto(file); setPreview(URL.createObjectURL(file)); }
  };

  const avancar = (e) => {
    e.preventDefault();
    if (!username.trim()) { setErro('Digite seu nickname.'); return; }
    setErro('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('senha', senha);
    if (foto) formData.append('foto', foto);

    try {
      const res = await fetch(`${SERVER_URL}/api/usuarios`, { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        // Login automático após cadastro
        const loginRes = await fetch(`${SERVER_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) localStorage.setItem('cj_token', loginData.token);
        navigate('/perfil');
      } else {
        setErro(data.erro || 'Erro ao criar perfil.');
        setCarregando(false);
      }
    } catch {
      setErro('Não foi possível conectar ao servidor.');
      setCarregando(false);
    }
  };

  return (
    <div className="auth-card">

      {/* Logo */}
      <div className="auth-logo">
        <div className="auth-logo-badge">🎨</div>
        <div>
          <h1 className="auth-title">Criar Perfil</h1>
          <p className="auth-subtitle">
            {step === 1 ? 'Como quer ser chamado?' : 'Agora os dados de acesso'}
          </p>
        </div>
      </div>

      {/* Indicador de steps */}
      <div className="auth-steps">
        <div className={`auth-step-dot ${step === 1 ? 'auth-step-dot-active' : 'auth-step-dot-done'}`} />
        <div className={`auth-step-dot ${step === 2 ? 'auth-step-dot-active' : ''}`} />
      </div>

      {/* ── STEP 1: nickname + foto ── */}
      {step === 1 && (
        <form onSubmit={avancar}>
          <div className="auth-fields">

            <div className="auth-field">
              <label className="auth-label">Nickname</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🎮</span>
                <input
                  className="auth-input"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErro(''); }}
                  placeholder="Como quer ser chamado?"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Foto de perfil</label>
              <div className="auth-foto-area" onClick={() => fotoRef.current.click()}>
                {preview
                  ? <img src={preview} alt="Preview" className="auth-foto-preview" />
                  : <div className="auth-foto-placeholder">📷</div>
                }
                <div className="auth-foto-texto">
                  <span className="auth-foto-titulo">
                    {preview ? 'Trocar foto' : 'Escolher foto'}
                  </span>
                  <span className="auth-foto-hint">JPG, PNG • máx 5 MB</span>
                </div>
                <input
                  ref={fotoRef}
                  className="auth-foto-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFoto}
                />
              </div>
            </div>

          </div>

          {erro && <p className="auth-erro">{erro}</p>}

          <button className="auth-btn" type="submit">Continuar →</button>
        </form>
      )}

      {/* ── STEP 2: email + senha ── */}
      {step === 2 && (
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
                  onChange={(e) => { setEmail(e.target.value); setErro(''); }}
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
                  onChange={(e) => { setSenha(e.target.value); setErro(''); }}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  minLength={6}
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

          <button className="auth-btn" type="submit" disabled={carregando}>
            {carregando ? 'Criando perfil…' : 'Criar Perfil'}
          </button>

          <button className="auth-btn-ghost" type="button" onClick={() => { setStep(1); setErro(''); }}>
            ← Voltar
          </button>
        </form>
      )}

      <p className="auth-footer">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}

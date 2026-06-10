import React, { useState } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

export default function ProfileForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [foto, setFoto]         = useState(null);
  const [preview, setPreview]   = useState(null);

  const [status, setStatus] = useState(null); // 'sucesso' | 'erro'
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setStatus(null);

    try {
      const response = await fetch(`${SERVER_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('sucesso');
        setMensagem(data.mensagem);
        // Limpa o formulário
        setUsername('');
        setEmail('');
        setSenha('');
        setFoto(null);
        setPreview(null);
      } else {
        setStatus('erro');
        setMensagem(data.erro || 'Erro ao criar perfil.');
      }
    } catch (err) {
      setStatus('erro');
      setMensagem('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <label>
        Nome de Jogador:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite seu nickname"
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />
      </label>

      <label>
        Senha:
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Sua senha"
          required
        />
      </label>

      <div>
        <label>
          Escolher Foto:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {preview && (
          <img
            src={preview}
            alt="Preview da foto"
            style={{ width: '100px', height: '100px', borderRadius: '50%', display: 'block', marginTop: '10px' }}
          />
        )}
      </div>

      {mensagem && (
        <p style={{ color: status === 'sucesso' ? 'green' : 'red' }}>
          {mensagem}
        </p>
      )}

      <button type="submit" disabled={carregando}>
        {carregando ? 'Criando...' : 'Criar Perfil'}
      </button>
    </form>
  );
}

import React, { useState } from 'react';

export default function ProfileForm({ onSubmitProfile }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Passa as informações preenchidas para a função que veio do componente pai (Profile.jsx)
    if (onSubmitProfile) {
      onSubmitProfile({ username, email, senha });
    }

    // Aqui você também poderá disparar a ação para salvar no banco de dados via WebSocket no futuro
    console.log("Perfil criado para o jogador:", username);
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFoto(file);
    setPreview(URL.createObjectURL(file));
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
            <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            />
        </label>

        {preview && (
            <img 
            src={preview} 
            alt="Preview da foto" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', display: 'block', marginTop: '10px' }} 
            />
        )}
        </div>
      
      <button type="submit">Criar Perfil</button>
    </form>
  );
}
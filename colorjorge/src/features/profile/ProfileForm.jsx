
import React, { useState } from 'react';

export default function ProfileForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // aqui depois a gente tem que colocar jwt e salvar o perfil no banco de dados tb
    // Aqui você pode disparar a ação para salvar o perfil via WebSocket ou Contexto
    console.log("Perfil criado para o jogador:", username);
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
        email:
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Digite seu email"
          required
        />
      </label>

      <label>
        senha:
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          placeholder="Sua senha"
          required
        />
      </label>
      
      <button type="submit">Criar Perfil</button>
    </form>
  );
}
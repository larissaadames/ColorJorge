import React, { useState } from 'react';
import ProfileForm from './ProfileForm';

export default function Profile() {
  // Estado para armazenar os dados recebidos do formulário
    const [playerData, setPlayerData] = useState(null);

  // Função que será passada para o ProfileForm
    const handleSaveProfile = (data) => {
    setPlayerData(data);
    };

    return (
    <div className="profile-container">
      {/* Se os dados do jogador existirem (não forem null), renderiza as informações */}
        {playerData ? (
        <div className="player-info-card">
            <h2>Bem-vindo(a), {playerData.username}!</h2>
            <p><strong>Email:</strong> {playerData.email}</p>
          {/* Nota: É uma boa prática de segurança NÃO printar a senha na tela */}
            
            <button onClick={() => setPlayerData(null)}>Editar Perfil</button>
        </div>
        ) : (
        /* Se ainda não tiver dados, renderiza o formulário e passa a função como prop */
        <div>
            <h2>Complete seu cadastro</h2>
            <ProfileForm onSubmitProfile={handleSaveProfile} />
        </div>
        )}
    </div>
    );    
}
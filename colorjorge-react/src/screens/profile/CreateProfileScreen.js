import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../components/game/GameShell'; // Ajuste o caminho se necessário

function CreateProfileScreen() {
  const navigate = useNavigate();

  // 1. MANIPULAÇÃO DE DADOS: Estado unificado para o formulário
  const [formData, setFormData] = useState({
    nome: '',
    apelido: '',
    corAvatar: '#19d7ea', // Cor inicial padrão usando o azul neon do seu projeto
    funcao: 'Jogador'
  });

  // 2. MANIPULAÇÃO DE DADOS: Função dinâmica para atualizar os campos conforme o usuário digita
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Atualiza apenas a propriedade modificada, preservando as outras
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // 3. MANIPULAÇÃO DE DADOS: Função executada ao clicar em "Salvar"
  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o comportamento padrão do HTML de recarregar a página

    // Exemplo de validação simples (Manipulação/Validação de dados)
    if (!formData.nome.trim() || !formData.apelido.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Aqui os dados estão prontos e manipulados no objeto `formData`
    console.log('Dados prontos para enviar ao servidor:', formData);

    // [Mais tarde]: Aqui você vai disparar o evento via socket/API para registrar no jogo
    
    // Após salvar com sucesso, navega de volta para a tela inicial
    navigate('/mestre');
  };

  return (
    <GameShell panelLabel="Formulário de criação de perfis">
      <div style={{ width: '100%', padding: '0 10px' }}>
        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.4rem', marginBottom: '20px', color: '#12bfff' }}>
          Criar Perfil
        </h2>

        {/* IMPLEMENTAÇÃO DO FORMULÁRIO */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Campo: Nome */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="nome" style={{ fontFamily: 'Manrope', fontSize: '0.85rem', color: '#9ca6c6' }}>Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome" // O 'name' deve ser idêntico à chave do useState
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
          </div>

          {/* Campo: Apelido */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="apelido" style={{ fontFamily: 'Manrope', fontSize: '0.85rem', color: '#9ca6c6' }}>Apelido no Jogo:</label>
            <input
              type="text"
              id="apelido"
              name="apelido"
              value={formData.apelido}
              onChange={handleChange}
              placeholder="Como quer ser chamado"
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
          </div>

          {/* Campo: Seletor de Cor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="corAvatar" style={{ fontFamily: 'Manrope', fontSize: '0.85rem', color: '#9ca6c6' }}>Cor do Perfil:</label>
            <input
              type="color"
              id="corAvatar"
              name="corAvatar"
              value={formData.corAvatar}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
            />
          </div>

          {/* Campo: Seleção de Função */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="funcao" style={{ fontFamily: 'Manrope', fontSize: '0.85rem', color: '#9ca6c6' }}>Função:</label>
            <select
              id="funcao"
              name="funcao"
              value={formData.funcao}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#35363c', color: '#fff' }}
            >
              <option value="Jogador">Jogador</option>
              <option value="Espectador">Espectador</option>
            </select>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/mestre')}
              style={{ flex: 1, padding: '12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '12px', borderRadius: '999px', border: 'none', background: '#19d7ea', color: '#14161e', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Salvar Perfil
            </button>
          </div>

        </form>
      </div>
    </GameShell>
  );
}

export default CreateProfileScreen;
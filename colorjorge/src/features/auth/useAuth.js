import { useState, useEffect } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

// Hook central de autenticação — use em qualquer componente que precise saber
// se o usuário está logado ou para fazer login/logout.
//
// Exemplo:
//   const { usuario, login, logout, getToken, carregando } = useAuth();

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao montar: verifica se já tem token salvo e valida com o servidor
  useEffect(() => {
    const token = localStorage.getItem('cj_token');
    if (!token) {
      setCarregando(false);
      return;
    }

    fetch(`${SERVER_URL}/api/eu`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUsuario(data);
        else localStorage.removeItem('cj_token'); // token expirado
      })
      .catch(() => localStorage.removeItem('cj_token'))
      .finally(() => setCarregando(false));
  }, []);

  async function login(email, senha) {
    const response = await fetch(`${SERVER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('cj_token', data.token);
      setUsuario(data.usuario);
      return { ok: true };
    }

    return { ok: false, erro: data.erro };
  }

  function logout() {
    localStorage.removeItem('cj_token');
    setUsuario(null);
  }

  // Use para autenticar fetch: headers: { Authorization: `Bearer ${getToken()}` }
  function getToken() {
    return localStorage.getItem('cj_token');
  }

  return { usuario, login, logout, getToken, carregando };
}

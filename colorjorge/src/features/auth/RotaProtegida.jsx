import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Envolva qualquer rota que precise de login:
//   <Route path="/mestre" element={<RotaProtegida><MasterScreen /></RotaProtegida>} />
//
// Se não estiver logado, redireciona para /login automaticamente.

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) return <p style={{ padding: '2rem' }}>Verificando sessão...</p>;
  if (!usuario)   return <Navigate to="/login" replace />;

  return children;
}

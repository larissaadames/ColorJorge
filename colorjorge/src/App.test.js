import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { GameProvider } from './features/game/GameProvider';

test('renders master game screen shell', () => {
  render(
    <GameProvider>
      <MemoryRouter
        initialEntries={['/mestre']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </GameProvider>
  );

  expect(screen.getByText(/visaoMaster/i)).toBeInTheDocument();
  expect(screen.getByText(/f 29/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enviar pista/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /tabuleiro/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /placar/i })).toBeInTheDocument();
});

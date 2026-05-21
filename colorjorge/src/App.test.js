import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { MockRoomProvider, createMockRoomValue } from './features/game/testUtils';

test('renders lobby with role choices', () => {
  render(
    <MockRoomProvider>
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </MockRoomProvider>
  );

  expect(screen.getByText(/colorjorge/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /mestre/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /jogador/i })).toBeInTheDocument();
});

test('renders master game screen shell when connected', () => {
  render(
    <MockRoomProvider
      value={createMockRoomValue({
        connectionStatus: 'connected',
        roomCode: 'AB12',
        role: 'master',
        isConnected: true
      })}
    >
      <MemoryRouter
        initialEntries={['/mestre']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </MockRoomProvider>
  );

  expect(screen.getByText(/visaoMaster/i)).toBeInTheDocument();
  expect(screen.getByText(/f 29/i)).toBeInTheDocument();
  expect(screen.getByText(/sala: ab12/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enviar pista/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /placar/i })).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders master game screen shell', () => {
  render(<App />);
  expect(screen.getByText(/visaoMaster/i)).toBeInTheDocument();
  expect(screen.getByText(/f 29/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enviar pista/i })).toBeInTheDocument();
});

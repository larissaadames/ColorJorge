import GameShell from '../game/GameShell';
import LoginForm from './LoginForm';

export default function LoginScreen() {
  return (
    <GameShell panelLabel="Login" showNav={false}>
      <LoginForm />
    </GameShell>
  );
}

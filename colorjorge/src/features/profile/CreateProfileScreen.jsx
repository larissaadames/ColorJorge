import GameShell from '../game/GameShell';
import ProfileForm from './ProfileForm';

export default function CreateProfileScreen() {
  return (
    <GameShell panelLabel="Criar perfil" showNav={false}>
      <ProfileForm />
    </GameShell>
  );
}

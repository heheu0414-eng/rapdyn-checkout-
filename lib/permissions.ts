import { getProfile } from './auth';

export async function checkPermission(requiredRole: 'ADMIN' | 'USER') {
  const profile = await getProfile();

  if (!profile) return null;

  if (requiredRole === 'ADMIN' && profile.role !== 'ADMIN') {
    return null;
  }

  return profile;
}

export async function validateAdmin() {
  const profile = await checkPermission('ADMIN');
  if (!profile) {
    throw new Error('Acesso negado: Requer privilégios de administrador');
  }
  return profile;
}

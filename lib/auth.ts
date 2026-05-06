import { createClient } from './supabase/server';
import { db } from './db';
import { env } from './env';

export async function getServerSession() {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch (error) {
    console.error('[AUTH ERROR]:', error);
    return null;
  }
}

export async function getProfile() {
  try {
    const user = await getServerSession();
    if (!user) return null;

    const adminEmail = env.ADMIN_EMAIL;
    const role = user.email === adminEmail ? 'ADMIN' : 'USER';

    // Sincronização automática do Perfil
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        email: user.email!,
        role: role,
      },
      create: {
        userId: user.id,
        email: user.email!,
        role: role,
      },
    });

    return profile;
  } catch (error) {
    console.error('[PROFILE SYNC ERROR]:', error);
    return null;
  }
}

export async function isAdmin() {
  try {
    const profile = await getProfile();
    const adminEmail = env.ADMIN_EMAIL;
    if (profile?.role === 'ADMIN') return true;
    
    const user = await getServerSession();
    return user?.email === adminEmail;
  } catch (error) {
    return false;
  }
}

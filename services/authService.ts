import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

/**
 * Serviço de autenticação
 */
export class AuthService {
  /**
   * Fazer login com email e senha
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user: data.user, error };
  }

  /**
   * Registrar novo usuário
   */
  static async signUp(email: string, password: string, name?: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    return { user: data.user, error };
  }

  /**
   * Fazer logout
   */
  static async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Obter usuário atual
   */
  static async getCurrentUser(): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  }

  /**
   * Obter sessão atual
   */
  static async getCurrentSession(): Promise<{ session: Session | null; error: any }> {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  }

  /**
   * Escutar mudanças de autenticação
   */
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Resetar senha
   */
  static async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  }

  /**
   * Atualizar senha
   */
  static async updatePassword(password: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    return { error };
  }

  /**
   * Atualizar perfil do usuário
   */
  static async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });

    return { error };
  }
}
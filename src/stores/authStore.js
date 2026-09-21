import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: false,
      initialized: false,

      initialize: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await get().fetchProfile(session.user.id);
            set({ user: session.user, profile, initialized: true, loading: false });
          } else {
            set({ user: null, profile: null, initialized: true, loading: false });
          }
        } catch {
          set({ initialized: true, loading: false });
        }
      },

      fetchProfile: async (userId) => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          return data;
        } catch {
          return null;
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          const profile = await get().fetchProfile(data.user.id);
          set({ user: data.user, profile, loading: false });
          return { success: true, role: profile?.role || 'customer' };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      register: async ({ email, password, full_name, phone }) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name, phone, role: 'customer' } },
          });
          if (error) throw error;
          
          if (data.user && data.session) {
            const profile = await get().fetchProfile(data.user.id);
            set({ user: data.user, profile, loading: false });
          } else {
            // Email confirmation required case
            set({ loading: false });
          }
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null });
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .select()
            .single();
          if (error) throw error;
          set({ profile: data });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      isAdmin: () => get().profile?.role === 'admin',
      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'pavalam-auth',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

// Listen for auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  if (event === 'SIGNED_IN' && session?.user) {
    const profile = await store.fetchProfile(session.user.id);
    useAuthStore.setState({ user: session.user, profile });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, profile: null });
  }
});

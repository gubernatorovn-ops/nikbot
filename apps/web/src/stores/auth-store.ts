import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, usersApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  memberships: Array<{
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; organizationName?: string }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setOrganization: (org: Organization) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login({ email, password });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          await get().fetchUser();
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (registerData) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.register(registerData);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          await get().fetchUser();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, organization: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        try {
          const { data } = await usersApi.getMe();
          const org = data.memberships[0]?.organization || null;
          set({ user: data, organization: org, isAuthenticated: true });
        } catch (error) {
          set({ user: null, organization: null, isAuthenticated: false });
        }
      },

      setOrganization: (org) => {
        set({ organization: org });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, organization: state.organization, isAuthenticated: state.isAuthenticated }),
    }
  )
);

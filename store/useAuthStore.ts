import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
  addresses: Address[];
  favoriteOrders: string[];
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  building?: string;
  floor?: string;
  instructions?: string;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  addFavoriteOrder: (orderId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      addAddress: (address) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: [...state.user.addresses, address] }
            : null,
        })),
      removeAddress: (addressId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: state.user.addresses.filter((a) => a.id !== addressId),
              }
            : null,
        })),
      addFavoriteOrder: (orderId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                favoriteOrders: [...state.user.favoriteOrders, orderId],
              }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

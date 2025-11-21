import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  options?: {
    size?: string;
    extras?: string[];
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
        get().calculateTotal();
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
        get().calculateTotal();
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
        get().calculateTotal();
      },
      clearCart: () => set({ items: [], total: 0 }),
      calculateTotal: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ total });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

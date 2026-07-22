"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FREE_SHIPPING_THRESHOLD } from "./utils";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  variant?: string;
  imageUrl: string;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  specialInstructions: string;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setSpecialInstructions: (text: string) => void;

  // Computed (derived in selectors below)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      specialInstructions: "",

      addItem: (newItem) => {
        const existing = get().items.find(
          (i) => i.productId === newItem.productId && i.variant === newItem.variant
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
            isDrawerOpen: true,
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              { ...newItem, id: `${newItem.productId}-${newItem.variant ?? "default"}-${Date.now()}` },
            ],
            isDrawerOpen: true,
          }));
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [], specialInstructions: "" }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      setSpecialInstructions: (text) => set({ specialInstructions: text }),
    }),
    {
      name: "rangriwaaz-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selectors
export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((acc, i) => acc + i.price * i.quantity, 0));

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

export const useShippingFee = () => {
  const total = useCartTotal();
  return total >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
};

export const useAmountForFreeShipping = () => {
  const total = useCartTotal();
  return Math.max(0, FREE_SHIPPING_THRESHOLD - total);
};

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  imageUrl: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const exists = get().items.some((i) => i.id === newItem.id);
        if (!exists) {
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
      },
      hasItem: (productId) => {
        return get().items.some((i) => i.id === productId);
      },
    }),
    {
      name: "rangriwaaz-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

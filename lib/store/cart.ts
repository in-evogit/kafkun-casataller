import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  type: "course" | "product";
  title: string;
  price_clp: number;
  thumbnail_url: string;
  quantity: number;
};

export type AppliedCoupon = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
};

type CartStore = {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            if (item.type === "course") return state;
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i
          ),
        }));
      },

      clear: () => set({ items: [], coupon: null }),

      setCoupon: (coupon) => set({ coupon }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price_clp * i.quantity, 0),

      discount: () => {
        const { coupon, subtotal } = get();
        if (!coupon) return 0;
        if (coupon.discount_type === "percent") {
          return Math.round(subtotal() * coupon.discount_value / 100);
        }
        return Math.min(coupon.discount_value, subtotal());
      },

      total: () => get().subtotal() - get().discount(),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "kafkun-cart" }
  )
);

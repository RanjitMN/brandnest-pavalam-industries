import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, variant = null, quantity = 1) => {
        const { items } = get();
        const key = variant ? `${product.id}-${variant.id}` : product.id;
        const existing = items.find((i) => i.key === key);

        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                key,
                product,
                variant,
                quantity,
                price: variant ? variant.price : product.price,
                image: product.images?.[0] || null,
              },
            ],
          });
        }
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => i.key !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      // Computed values
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getDiscount: () => {
        const { coupon } = get();
        const subtotal = get().getSubtotal();
        if (!coupon) return 0;
        if (coupon.discount_type === 'percentage') {
          const disc = (subtotal * coupon.discount_value) / 100;
          return coupon.max_discount_amount
            ? Math.min(disc, coupon.max_discount_amount)
            : disc;
        }
        return Math.min(coupon.discount_value, subtotal);
      },

      getDeliveryCharge: (settings) => {
        const subtotal = get().getSubtotal();
        const freeAbove = parseFloat(settings?.free_delivery_above || 500);
        const charge = parseFloat(settings?.delivery_charge || 60);
        return subtotal >= freeAbove ? 0 : charge;
      },

      getGST: (settings) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxable = subtotal - discount;
        const gstRate = parseFloat(settings?.gst_rate || 5);
        return (taxable * gstRate) / 100;
      },

      getTotal: (settings) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const delivery = get().getDeliveryCharge(settings);
        const gst = get().getGST(settings);
        return subtotal - discount + delivery + gst;
      },
    }),
    {
      name: 'pavalam-cart',
    }
  )
);

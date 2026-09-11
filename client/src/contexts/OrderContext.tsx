/** Pantry Modernism: shared order state behaves like a neat, legible work order. */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { BakeryItem } from "@/lib/bakery-data";

export type BasketItem = BakeryItem & { quantity: number };

type OrderContextValue = {
  basket: BasketItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: BakeryItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBasket: () => void;
  itemCount: number;
  subtotal: number;
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addItem = (item: BakeryItem) => {
    setBasket((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      return existing
        ? current.map((entry) => (entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry))
        : [...current, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to your order`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setBasket((current) => current.flatMap((entry) => (entry.id === id && quantity < 1 ? [] : entry.id === id ? [{ ...entry, quantity }] : [entry])));
  };

  const value = useMemo(() => ({
    basket,
    isCartOpen,
    setCartOpen,
    addItem,
    updateQuantity,
    clearBasket: () => setBasket([]),
    itemCount: basket.reduce((total, item) => total + item.quantity, 0),
    subtotal: basket.reduce((total, item) => total + item.price * item.quantity, 0),
  }), [basket, isCartOpen]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used inside OrderProvider");
  return context;
}


/** Pantry Modernism: the order drawer acts like a tidy paper docket, not a generic checkout overlay. */
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";
import { toast } from "sonner";

export function OrderDrawer() {
  const { basket, isCartOpen, setCartOpen, subtotal, updateQuantity, clearBasket } = useOrder();
  const submitOrder = () => {
    if (!basket.length) return;
    clearBasket();
    setCartOpen(false);
    toast.success("Order saved — pickup time will be confirmed shortly.");
  };
  return <>
    <div className={isCartOpen ? "drawer-backdrop visible" : "drawer-backdrop"} onClick={() => setCartOpen(false)} />
    <aside className={isCartOpen ? "order-drawer open" : "order-drawer"} aria-label="Your order" aria-hidden={!isCartOpen}>
      <div className="drawer-header"><div><span className="eyebrow">Your counter order</span><h2>Good things, pending.</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close order"><X /></button></div>
      {!basket.length ? <div className="empty-order"><ShoppingBag size={30} strokeWidth={1.2} /><h3>Your order is still open.</h3><p>Choose something from today’s bake to start a pickup order.</p></div> : <>
        <div className="basket-lines">{basket.map((item) => <div className="basket-line" key={item.id}>
          <div><h3>{item.name}</h3><p>${item.price.toFixed(2)} each</p></div>
          <div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button></div>
        </div>)}</div>
        <div className="drawer-footer"><div className="order-total"><span>Estimated total</span><strong>${subtotal.toFixed(2)}</strong></div><p>Pickup is free. Delivery availability is confirmed after your order is received.</p><button className="button button-primary full" onClick={submitOrder}>Send pickup order</button></div>
      </>}
    </aside>
  </>;
}


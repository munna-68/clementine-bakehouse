/** Pantry Modernism: navigation is a calm service counter—direct, slim, and always legible. */
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { useOrder } from "@/contexts/OrderContext";

const links = [
  ["Menu", "/shop"],
  ["Custom orders", "/custom-orders"],
  ["Track an order", "/track-order"],
  ["Our kitchen", "/about"],
];

export function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { itemCount, setCartOpen } = useOrder();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-link" aria-label="Clementine Bakehouse home"><BrandMark /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className={location === href ? "nav-link active" : "nav-link"}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open order, ${itemCount} items`}>
            <ShoppingBag size={18} strokeWidth={1.8} /><span>Order</span>{itemCount > 0 && <b>{itemCount}</b>}
          </button>
          <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={location === href ? "nav-link active" : "nav-link"}>{label}</Link>)}
      </nav>}
    </header>
  );
}


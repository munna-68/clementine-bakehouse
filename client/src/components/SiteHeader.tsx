/** Pantry Modernism: navigation is a calm service counter—direct, slim, and always legible. */
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { useOrder } from "@/contexts/OrderContext";
import { useBodyLock, useEscape } from "@/hooks/useBodyLock";
import { getStoreStatus } from "@/lib/bakery-data";

const links = [
  ["Menu", "/shop"],
  ["Custom orders", "/custom-orders"],
  ["Track an order", "/track-order"],
  ["Our kitchen", "/about"],
];

export function SiteHeader() {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount, setCartOpen } = useOrder();
  const status = getStoreStatus();

  const close = useCallback(() => setOpen(false), []);
  useBodyLock(open);
  useEscape(open, close);

  // a route change should never leave the panel hanging open
  useEffect(() => { setOpen(false); setSearching(false); }, [location]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;
    const match = ["bun", "coffee", "cupcake", "cookie", "loaf", "sourdough", "seeded", "chocolate", "vanilla", "lemon", "raspberry", "salt"]
      .some((needle) => term.includes(needle));
    navigate(match ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    setSearching(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-link" aria-label="Clementine Bakehouse home"><BrandMark /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className={location === href ? "nav-link active" : "nav-link"}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="icon-trigger search-trigger" type="button" onClick={() => setSearching((value) => !value)} aria-label="Search the counter" aria-expanded={searching}>
            <Search size={17} strokeWidth={1.9} />
          </button>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open order, ${itemCount} items`}>
            <ShoppingBag size={18} strokeWidth={1.8} /><span>Order</span>{itemCount > 0 && <b>{itemCount}</b>}
          </button>
          <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>

      {searching && <form className="header-search" onSubmit={submitSearch} role="search">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the counter — sourdough, cupcake, cookie…" aria-label="Search the counter" autoFocus />
        <button className="button button-primary" type="submit">Search</button>
      </form>}

      {open && <>
        <div className="mobile-nav-scrim" onClick={close} aria-hidden="true" />
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="mobile-nav-status">
            <i className={status.open ? "open" : "closed"} />
            <span><strong>{status.label}</strong>{status.detail}</span>
          </div>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={close} className={location === href ? "nav-link active" : "nav-link"}>{label}</Link>)}
          <button className="button button-primary mobile-nav-cta" type="button" onClick={() => { close(); setCartOpen(true); }}>View your order{itemCount > 0 ? ` · ${itemCount}` : ""}</button>
        </nav>
      </>}
    </header>
  );
}

/** Pantry Modernism: the shop is a bright, practical display tray with instant price clarity. */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { withBase } from "@/lib/withBase";
import { bakeryItems } from "@/lib/bakery-data";
import { useOrder } from "@/contexts/OrderContext";

const categories = ["All", "Breakfast", "Cupcakes", "Cookies", "Daily loaves"] as const;

const readQuery = () =>
  typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") ?? "";

export default function Shop() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState(readQuery);
  const { addItem, setCartOpen, itemCount } = useOrder();

  // the header search lands here with ?q=, including on a fresh page load
  useEffect(() => {
    const sync = () => setQuery(readQuery());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return bakeryItems.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      if (!inCategory) return false;
      if (!term) return true;
      return `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(term);
    });
  }, [category, query]);

  return <>
    <section className="page-intro shop-intro"><div className="page-rail" data-reveal="fade"><span>01</span><i /></div><div data-reveal="up"><span className="eyebrow">The counter, today</span><h1>Choose your<br /><em>everyday good.</em></h1></div><div className="page-intro-aside" data-reveal="up"><p>Daily bakes are ready to order right now. No quote, no guessing—just pick a pickup and we’ll make it happen.</p><button className="text-link" onClick={() => setCartOpen(true)}>View order <span>{itemCount}</span> <ArrowUpRight size={16} /></button></div></section>
    <section className="shop-body"><div className="shop-sticky"><p className="eyebrow">Filter the case</p><div className="category-list">{categories.map((entry) => <button key={entry} className={category === entry ? "selected" : ""} onClick={() => setCategory(entry)}>{entry}<span>{entry === "All" ? bakeryItems.length : bakeryItems.filter((item) => item.category === entry).length}</span></button>)}</div><div className="shop-note"><i /><p><b>Good to know</b><br />We mix a limited number of each bake. Order by 3pm for next-day pickup.</p></div></div>
      <div className="product-grid">
        {query.trim() && <div className="search-banner">
          <p><b>{filtered.length}</b> {filtered.length === 1 ? "bake matches" : "bakes match"} “{query.trim()}”</p>
          <button type="button" onClick={() => setQuery("")}><X size={14} /> Clear search</button>
        </div>}
        {filtered.length === 0 ? <div className="empty-search"><p>Nothing on the counter matches “{query.trim()}”.</p><button className="text-link" type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Show everything</button></div> : filtered.map((item, index) => <article key={item.id} className={`product-card accent-${item.accent}`} data-reveal="up">
          <div className="product-visual"><span className="product-number">0{index + 1}</span><img src={withBase(`/images/${item.image}`)} alt={item.imageAlt} loading="lazy" decoding="async" />{item.badge && <span className="product-badge">{item.badge}</span>}</div>
          <div className="product-info"><div><span className="product-category">{item.category}</span><h2>{item.name}</h2><p>{item.description}</p></div><div className="product-buy"><strong>${item.price.toFixed(2)}</strong><button onClick={() => addItem(item)} aria-label={`Add ${item.name} to order`}><Plus size={19} /></button></div></div>
        </article>)}
      </div>
    </section>
    <section className="shop-bottom-note"><span className="citrus-dot" /><p>Looking for something that needs a little more planning? <a href="/custom-orders">Start a custom order.</a></p></section>
  </>;
}

/** Pantry Modernism: the shop is a bright, practical display tray with instant price clarity. */
import { useMemo, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { withBase } from "@/lib/withBase";
import { bakeryItems } from "@/lib/bakery-data";
import { useOrder } from "@/contexts/OrderContext";

const categories = ["All", "Breakfast", "Cupcakes", "Cookies", "Daily loaves"] as const;

export default function Shop() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const { addItem, setCartOpen, itemCount } = useOrder();
  const filtered = useMemo(() => category === "All" ? bakeryItems : bakeryItems.filter((item) => item.category === category), [category]);
  return <>
    <section className="page-intro shop-intro"><div className="page-rail" data-reveal="fade"><span>01</span><i /></div><div data-reveal="up"><span className="eyebrow">The counter, today</span><h1>Choose your<br /><em>everyday good.</em></h1></div><div className="page-intro-aside" data-reveal="up"><p>Daily bakes are ready to order right now. No quote, no guessing—just pick a pickup and we’ll make it happen.</p><button className="text-link" onClick={() => setCartOpen(true)}>View order <span>{itemCount}</span> <ArrowUpRight size={16} /></button></div></section>
    <section className="shop-body"><div className="shop-sticky"><p className="eyebrow">Filter the case</p><div className="category-list">{categories.map((entry) => <button key={entry} className={category === entry ? "selected" : ""} onClick={() => setCategory(entry)}>{entry}<span>{entry === "All" ? bakeryItems.length : bakeryItems.filter((item) => item.category === entry).length}</span></button>)}</div><div className="shop-note"><i /><p><b>Good to know</b><br />We mix a limited number of each bake. Order by 3pm for next-day pickup.</p></div></div>
      <div className="product-grid">{filtered.map((item, index) => <article key={item.id} className={`product-card accent-${item.accent}`} data-reveal="up">
        <div className="product-visual"><span className="product-number">0{index + 1}</span><img src={withBase(`/images/${item.image}`)} alt={item.imageAlt} loading="lazy" decoding="async" />{item.badge && <span className="product-badge">{item.badge}</span>}</div>
        <div className="product-info"><div><span className="product-category">{item.category}</span><h2>{item.name}</h2><p>{item.description}</p></div><div className="product-buy"><strong>${item.price.toFixed(2)}</strong><button onClick={() => addItem(item)} aria-label={`Add ${item.name} to order`}><Plus size={19} /></button></div></div>
      </article>)}</div>
    </section>
    <section className="shop-bottom-note"><span className="citrus-dot" /><p>Looking for something that needs a little more planning? <a href="/custom-orders">Start a custom order.</a></p></section>
  </>;
}

import { withBase } from "@/lib/withBase";
/** Pantry Modernism: the home page puts food and service clarity side by side on a composed workbench. */
import { ArrowDownRight, ArrowUpRight, CalendarDays, ChevronRight, ClipboardCheck, CreditCard, PackageCheck } from "lucide-react";
import { Link } from "wouter";
import { bakeryItems, DEPOSIT_RATE, LEAD_TIME_DAYS } from "@/lib/bakery-data";
import { useOrder } from "@/contexts/OrderContext";

export default function Home() {
  const { addItem } = useOrder();
  const ticker = [...bakeryItems, ...bakeryItems];
  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-kicker" data-reveal="fade"><span className="citrus-dot" /> Maplewood, New Jersey <i>•</i> Wednesday–Saturday</div>
        <h1>
          <span className="hero-line" data-reveal="up">Small-batch cakes</span>
          <span className="hero-line" data-reveal="up">for <em>big local moments.</em></span>
        </h1>
        <p data-reveal="up">Custom cakes, everyday bakes, and a calmer way to place the order.</p>
        <div className="hero-actions" data-reveal="up"><Link className="button button-primary" href="/custom-orders">Start a custom order <ChevronRight size={16} /></Link><Link className="text-link" href="/shop">See today’s counter <ArrowDownRight size={17} /></Link></div>
      </div>
      <div className="hero-image"><img src={withBase("/images/clementine-hero_cf591ab0.jpg")} alt="A buttercream celebration cake topped with citrus" data-parallax="0.05" /><div className="hero-image-note"><span>01</span><p><b>This week’s feature</b><br />Citrus blossom cake</p></div></div>
      <div className="hero-rail"><span>THE GOOD STUFF, MADE TO ORDER</span></div>
    </section>

    <section className="operational-strip" data-reveal="fade"><span>Two ways to order</span><p>Everyday bakes, ready when you are <i>→</i> Custom work, built around your date</p><Link href="/track-order">Track an order <ArrowUpRight size={15} /></Link></section>

    <section className="menu-highlights">
      <div className="section-heading" data-reveal="up"><div><span className="eyebrow">From the counter</span><h2>Good things, <em>today.</em></h2></div><Link className="text-link" href="/shop">All daily bakes <ArrowUpRight size={16} /></Link></div>
      <div className="highlight-grid">{bakeryItems.slice(0, 3).map((item, index) => <article key={item.id} className={`highlight-card highlight-${index}`} data-reveal="up"><div className="highlight-art"><span>0{index + 1}</span><img src={withBase(`/images/${item.image}`)} alt={item.imageAlt} loading="lazy" decoding="async" /></div><div><p>{item.category}</p><h3>{item.name}</h3><div className="highlight-order"><strong>${item.price.toFixed(2)}</strong><button onClick={() => addItem(item)}>Add to order <span>+</span></button></div></div></article>)}</div>
    </section>

    <section className="marquee" aria-label="Today’s counter, with prices">
      <div className="marquee-track">
        <div className="marquee-group">{ticker.map((item, index) => <span key={index}><i />{item.name}<b>${item.price.toFixed(2)}</b></span>)}</div>
        <div className="marquee-group" aria-hidden="true">{ticker.map((item, index) => <span key={index}><i />{item.name}<b>${item.price.toFixed(2)}</b></span>)}</div>
      </div>
    </section>

    <section className="custom-pitch"><div className="pitch-copy" data-reveal="up"><span className="eyebrow">Custom cake service</span><h2>The cake has a plan.<br /><em>Now, so do you.</em></h2><p>Our custom order form catches the size, flavors, design direction, and date details before a single message gets lost in the shuffle.</p><Link href="/custom-orders" className="button button-navy">Build your cake brief <ChevronRight size={16} /></Link></div><div className="pitch-process" data-reveal="up"><div className="recipe-tape">FROM “WHAT’S POSSIBLE?” TO “IT’S READY.”</div><div className="process-steps"><article data-reveal="up"><span>01</span><ClipboardCheck size={21} /><h3>Share the details</h3><p>Style, servings, flavors, and your inspiration—right in one request.</p></article><article data-reveal="up"><span>02</span><CalendarDays size={21} /><h3>Hold the date</h3><p>Open days only. Our capacity is visible before you choose.</p></article><article data-reveal="up"><span>03</span><CreditCard size={21} /><h3>Approve the quote</h3><p>Accept your quote and pay a 50% deposit to confirm.</p></article><article data-reveal="up"><span>04</span><PackageCheck size={21} /><h3>Pick up happy</h3><p>Track progress, then come collect the good part.</p></article></div></div></section>

    <section className="kitchen-band"><div className="kitchen-visual"><img className="kitchen-photo" src={withBase("/images/clementine-kitchen.jpg")} alt="A baker working a piece of dough by hand at the bench" loading="lazy" decoding="async" data-parallax="0.05" /><div className="kitchen-stamp"><span className="citrus-mark large"><i /><i /><i /><i /><i /><i /><i /><i /></span><p>Carefully<br />made here.</p></div></div><div className="kitchen-copy" data-reveal="up"><span className="eyebrow">A local kitchen</span><h2>Built for the part<br />of the day <em>people remember.</em></h2><p>We keep our menu short, our windows clear, and our buttercream soft. The result is a bakery that feels personal because it is.</p><Link href="/about" className="text-link">Meet our kitchen <ArrowUpRight size={16} /></Link></div></section>

    <section className="home-signals"><div data-reveal="up"><span className="citrus-dot" /><h3>Custom, not complicated.</h3><p>One considered request form replaces the long, uncertain message thread.</p></div><div data-reveal="up"><span className="citrus-dot" /><h3>Capacity you can see.</h3><p>Full dates lock automatically, so we only promise what we can make well.</p></div><div data-reveal="up"><span className="citrus-dot" /><h3>Clear from quote to cake.</h3><p>Deposits and balances are visible before the final pickup moment.</p></div></section>

    <section className="stat-band">
      <div data-reveal="up"><span className="stat-value" data-count-to={bakeryItems.length} data-count-pad="2">{String(bakeryItems.length).padStart(2, "0")}</span><p>Daily bakes on the counter, mixed in small batches.</p></div>
      <div data-reveal="up"><span className="stat-value" data-count-to={LEAD_TIME_DAYS} data-count-pad="2">{String(LEAD_TIME_DAYS).padStart(2, "0")}</span><p>Days minimum lead time on any custom cake.</p></div>
      <div data-reveal="up"><span className="stat-value" data-count-to={DEPOSIT_RATE * 100} data-count-suffix="%">50%</span><p>Deposit holds your bake date once the quote is approved.</p></div>
      <div data-reveal="up"><span className="stat-value" data-count-to={5} data-count-pad="2">05</span><p>Status stages you can follow from request to pickup.</p></div>
    </section>
  </>;
}

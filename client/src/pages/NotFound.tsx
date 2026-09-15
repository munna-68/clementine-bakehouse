/** Pantry Modernism: a wrong turn still gets the workbench treatment — same type, same signals, same way back. */
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";

const suggestions: [string, string][] = [
  ["Today’s counter", "/shop"],
  ["Custom orders", "/custom-orders"],
  ["Track an order", "/track-order"],
  ["Our kitchen", "/about"],
];

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <section className="notfound-page">
      <div className="notfound-card" data-reveal="scale">
        <span className="citrus-mark large" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></span>
        <span className="eyebrow">404 · Off the workbench</span>
        <h1>This shelf is<br /><em>empty.</em></h1>
        <p>The page you were looking for isn’t on the counter. It may have moved, or the link may have picked up a crumb.</p>
        <div className="notfound-actions">
          <button className="button button-primary" type="button" onClick={() => setLocation("/")}><ArrowLeft size={16} /> Back to the bakehouse</button>
          <Link className="text-link" href="/shop">See today’s counter <ArrowUpRight size={16} /></Link>
        </div>
        <nav className="notfound-links" aria-label="Popular pages">
          {suggestions.map(([label, href]) => <Link key={href} href={href}>{label}<ChevronRight size={14} /></Link>)}
        </nav>
      </div>
    </section>
  );
}

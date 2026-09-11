/** Pantry Modernism: the footer is a composed last workbench, with useful information and a bright citrus exit point. */
import { Link } from "wouter";
import { ArrowUpRight, Instagram, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-cta"><div className="footer-cta-copy"><span className="footer-counter-note"><i /> COUNTER NOTE · CUSTOM WORK</span><span className="eyebrow">A date worth celebrating?</span><h2>Tell us the plan.<br /><em>We’ll bring the buttercream.</em></h2></div><div className="footer-cta-action"><span className="footer-docket">CB / 01</span><Link className="round-link" href="/custom-orders" aria-label="Start a custom order"><ArrowUpRight size={28} /></Link></div></div>
    <div className="footer-grid"><div><BrandMark /><p className="footer-note">Small-batch cakes and everyday comforts, made in our local kitchen.</p></div><div><span className="footer-label">Find us</span><p><MapPin size={15} /> 518 Cypress Avenue<br />Maplewood, NJ 07040</p><p><Phone size={15} /> (973) 555-0148</p></div><div><span className="footer-label">Hours</span><p>Wed–Fri, 8–4<br />Sat, 8–2<br />Sun–Tue, mixing bowls at rest</p></div><div><span className="footer-label">Stay close</span><a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social"><Instagram size={17} /> Behind the bench</a><Link href="/track-order" className="footer-social">Track an order <ArrowUpRight size={16} /></Link></div></div>
    <div className="footer-bottom"><span>© 2026 Clementine Bakehouse</span><span>Made for local moments.</span></div>
  </footer>;
}

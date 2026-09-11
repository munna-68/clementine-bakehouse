/** Pantry Modernism: the about page shows warm competence through materials, process, and direct contact. */
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Clock3, MapPinned, Send } from "lucide-react";
import { toast } from "sonner";

export default function About() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); toast.success("Your note is on our kitchen counter."); };
  return <>
    <section className="about-hero"><div className="about-copy"><span className="eyebrow">Our kitchen</span><h1>A small bakery<br />with a <em>big soft spot</em><br />for the details.</h1><p>Clementine is a neighborhood bakehouse for celebration cakes, weekday pastries, and the particular joy of bringing something beautiful through someone’s front door.</p></div><div className="about-collage"><div className="collage-main"><div className="mixing-bowl"><i /><i /><i /></div><span>Working surface, 8:13am</span></div><div className="collage-note">Baked with our whole heart,<br />and an exacting timer.</div><div className="collage-citrus"><span className="citrus-mark large"><i /><i /><i /><i /><i /><i /><i /><i /></span></div></div></section>
    <section className="values-section"><div><span className="eyebrow">How we work</span><h2>The useful kind<br />of <em>particular.</em></h2></div><div className="values-list"><article><span>01</span><h3>Make fewer, better things.</h3><p>Every day has a limit. That leaves room for clean finishes, good conversations, and cake that arrives as imagined.</p></article><article><span>02</span><h3>Be clear before we’re cute.</h3><p>Dates, deposits, and pickup windows should never live in a vague string of DMs. We make the logistics kind.</p></article><article><span>03</span><h3>Keep the good parts close.</h3><p>Our kitchen is local, our pickup is personal, and our cakes are made for the people you’re actually celebrating.</p></article></div></section>
    <section className="contact-section"><div className="contact-facts"><span className="eyebrow">Come say hello</span><h2>Find the<br /><em>good smell.</em></h2><p><MapPinned size={18} /> 518 Cypress Avenue<br />Maplewood, NJ 07040</p><p><Clock3 size={18} /> Wed–Fri, 8–4 · Sat, 8–2</p><a href="https://maps.google.com" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a></div><form className="contact-form" onSubmit={submit}><span className="eyebrow">A quick note</span><h3>{sent ? "We’ll be in touch soon." : "Something sweet on your mind?"}</h3>{!sent && <><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@email.com" /></label><label>Message<textarea required rows={4} placeholder="Tell us what you’re planning…" /></label><button className="button button-primary" type="submit">Send a note <Send size={16} /></button></>}</form></section>
  </>;
}


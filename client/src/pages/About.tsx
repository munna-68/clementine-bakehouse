/** Pantry Modernism: the about page shows warm competence through materials, process, and direct contact. */
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Clock3, MapPinned, Send } from "lucide-react";
import { withBase } from "@/lib/withBase";
import { toast } from "sonner";

const ADDRESS = "518 Cypress Avenue, Maplewood, NJ 07040";
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export default function About() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); toast.success(`Thanks ${name.trim() || "there"} — your note is on our kitchen counter.`); };
  return <>
    <section className="about-hero"><div className="about-copy"><span className="eyebrow" data-reveal="fade">Our kitchen</span><h1 data-reveal="up">A small bakery<br />with a <em>big soft spot</em><br />for the details.</h1><p data-reveal="up">Clementine is a neighborhood bakehouse for celebration cakes, weekday pastries, and the particular joy of bringing something beautiful through someone’s front door.</p></div><div className="about-collage"><div className="collage-main"><img className="collage-photo" src={withBase("/images/clementine-collage.jpg")} alt="The bakery display case, pastries laid out with handwritten price cards" loading="lazy" decoding="async" data-parallax="0.05" /><span>Working surface, 8:13am</span></div><div className="collage-note">Baked with our whole heart,<br />and an exacting timer.</div><div className="collage-citrus"><span className="citrus-mark large"><i /><i /><i /><i /><i /><i /><i /><i /></span></div></div></section>
    <section className="values-section"><div data-reveal="right"><span className="eyebrow">How we work</span><h2>The useful kind<br />of <em>particular.</em></h2></div><div className="values-list"><article data-reveal="up"><span>01</span><h3>Make fewer, better things.</h3><p>Every day has a limit. That leaves room for clean finishes, good conversations, and cake that arrives as imagined.</p></article><article data-reveal="up"><span>02</span><h3>Be clear before we’re cute.</h3><p>Dates, deposits, and pickup windows should never live in a vague string of DMs. We make the logistics kind.</p></article><article data-reveal="up"><span>03</span><h3>Keep the good parts close.</h3><p>Our kitchen is local, our pickup is personal, and our cakes are made for the people you’re actually celebrating.</p></article></div></section>
    <section className="contact-section"><div className="contact-facts" data-reveal="right"><span className="eyebrow">Come say hello</span><h2>Find the<br /><em>good smell.</em></h2><p><MapPinned size={18} /> 518 Cypress Avenue<br />Maplewood, NJ 07040</p><p><Clock3 size={18} /> Wed–Fri, 8–4 · Sat, 8–2</p><a href={DIRECTIONS} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a></div><form className="contact-form" onSubmit={submit} data-reveal="left"><span className="eyebrow">A quick note</span><h3>{sent ? "We’ll be in touch soon." : "Something sweet on your mind?"}</h3>{sent ? <button className="button button-navy" type="button" onClick={() => { setSent(false); setName(""); }}>Send another note</button> : <><label>Name<input required placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input required type="email" placeholder="you@email.com" /></label><label>Message<textarea required rows={4} placeholder="Tell us what you’re planning…" /></label><button className="button button-primary" type="submit">Send a note <Send size={16} /></button></>}</form></section>
  </>;
}

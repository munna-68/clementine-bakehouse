/** Pantry Modernism: custom ordering replaces DM back-and-forth with a clear, welcoming work order. */
import { useState, type FormEvent } from "react";
import { Check, ChevronRight, ImagePlus, Info, Sparkles } from "lucide-react";
import { getCapacityDates } from "@/lib/bakery-data";
import { toast } from "sonner";

const sizes = ["8–12 guests", "16–20 guests", "24–32 guests", "40+ guests"];
const flavors = ["Vanilla bean", "Dark chocolate", "Lemon olive oil", "Confetti"];
const fillings = ["Salted caramel", "Raspberry preserve", "Chocolate mousse", "Lemon curd"];
const styles = ["Clean + classic", "Floral + textured", "Illustrated", "Something else entirely"];

export default function CustomOrders() {
  const dates = getCapacityDates();
  const [size, setSize] = useState(sizes[1]);
  const [flavor, setFlavor] = useState(flavors[0]);
  const [filling, setFilling] = useState(fillings[0]);
  const [style, setStyle] = useState(styles[0]);
  const firstDate = dates.find((item) => item.available)?.iso ?? "";
  const [date, setDate] = useState(firstDate);
  const [photoName, setPhotoName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const choose = <T,>(entries: T[], active: T, setActive: (value: T) => void) => <div className="choice-row">{entries.map((entry) => <button type="button" key={String(entry)} className={entry === active ? "choice selected" : "choice"} onClick={() => setActive(entry)}>{String(entry)}{entry === active && <Check size={14} />}</button>)}</div>;
  const submit = (event: FormEvent) => { event.preventDefault(); if (!date) return toast.error("Please choose an available bake date."); setSubmitted(true); toast.success("Your custom request is ready for review."); };
  if (submitted) return <section className="confirmation-page"><div className="confirmation-card"><span className="confirmation-stamp"><Check size={34} /></span><span className="eyebrow">Request received</span><h1>Your cake is<br /><em>on the docket.</em></h1><p>We’ve reserved your request details for review. Expect a tailored quote by the next business day; nothing is confirmed or charged until you accept it.</p><div className="request-code"><span>YOUR TRACKING CODE</span><strong>CB-9051</strong></div><a className="button button-primary" href="/track-order">Track this request <ChevronRight size={16} /></a></div></section>;
  return <>
    <section className="page-intro custom-intro"><div className="page-rail"><span>02</span><i /></div><div><span className="eyebrow">Custom work</span><h1>Make the moment.<br /><em>We’ll make the cake.</em></h1></div><div className="page-intro-aside"><p>A few thoughtful answers now means fewer messages later—and more time for the joyful details.</p></div></section>
    <section className="custom-layout"><aside className="custom-aside"><div className="aside-photo"><img src="/images/clementine-hero_cf591ab0.jpg" alt="A finished celebration cake from Clementine Bakehouse" /><span>Made to order</span></div><div className="lead-time"><Sparkles size={19} /><p><b>Five days is our sweet spot.</b><br />We need a minimum of five days to make custom work with care. Full dates are locked before you get to the details.</p></div><div className="capacity-key"><span><i className="open" /> Available</span><span><i className="limited" /> 1–2 openings</span><span><i className="full" /> Full</span></div></aside>
      <form className="custom-form" onSubmit={submit}>
        <div className="form-section"><div className="form-section-title"><span>01</span><div><h2>The gathering</h2><p>How many forks should we plan for?</p></div></div>{choose(sizes, size, setSize)}<label className="field-label">Occasion<input required placeholder="A 30th, a Tuesday, a tiny victory..." /></label></div>
        <div className="form-section"><div className="form-section-title"><span>02</span><div><h2>The inside story</h2><p>Start with cake, then choose the good middle.</p></div></div><div className="form-choice-stack"><div><label>CAKE FLAVOR</label>{choose(flavors, flavor, setFlavor)}</div><div><label>FILLING</label>{choose(fillings, filling, setFilling)}</div></div></div>
        <div className="form-section"><div className="form-section-title"><span>03</span><div><h2>The outside</h2><p>Tell us the look; a reference helps, but isn’t required.</p></div></div>{choose(styles, style, setStyle)}<label className="upload-field"><input type="file" accept="image/*" onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")} /><ImagePlus size={19} /><span>{photoName || "Add an inspiration photo"}</span><small>JPG or PNG</small></label><label className="field-label">Details we should know<textarea rows={4} placeholder="Color, message, favorite flower, the moment you’re trying to make…" /></label></div>
        <div className="form-section date-section"><div className="form-section-title"><span>04</span><div><h2>Pick a bake date</h2><p>Choose an open date after our five-day lead time.</p></div></div><div className="date-grid">{dates.map((item) => <button type="button" key={item.iso} disabled={!item.available} onClick={() => setDate(item.iso)} className={`${date === item.iso ? "selected " : ""}${!item.available ? "unavailable" : ""}`}><span>{item.day}</span><strong>{item.date}</strong><small>{item.available ? `${item.remaining} ${item.remaining === 1 ? "opening" : "openings"}` : "full"}</small></button>)}</div><p className="form-hint"><Info size={15} /> Can’t find your date? Send the request anyway and we’ll share the nearest opening.</p></div>
        <div className="form-submit"><p><b>Next:</b> We’ll review your request, send a custom quote, and reserve the date when the deposit is paid.</p><button className="button button-primary" type="submit">Send custom request <ChevronRight size={16} /></button></div>
      </form>
    </section>
  </>;
}


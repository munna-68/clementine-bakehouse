import { withBase } from "@/lib/withBase";
/** Pantry Modernism: custom ordering replaces DM back-and-forth with a clear, welcoming work order. */
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, ChevronRight, ImagePlus, Info, Sparkles } from "lucide-react";
import { getCapacityDates, servingTiers, DEPOSIT_RATE, LEAD_TIME_DAYS } from "@/lib/bakery-data";
import { estimateQuote, nextCode, saveRequest, type CustomRequest } from "@/lib/requests";
import { toast } from "sonner";

const flavors = ["Vanilla bean", "Dark chocolate", "Lemon olive oil", "Confetti"];
const fillings = ["Salted caramel", "Raspberry preserve", "Chocolate mousse", "Lemon curd"];
const styles = ["Clean + classic", "Floral + textured", "Illustrated", "Something else entirely"];

const STEPS = [
  { title: "The gathering", hint: "How many forks should we plan for?" },
  { title: "The inside story", hint: "Start with cake, then choose the good middle." },
  { title: "The outside", hint: "Tell us the look; a reference helps, but isn’t required." },
  { title: "Pick a bake date", hint: `Choose an open date after our ${LEAD_TIME_DAYS}-day lead time.` },
];

export default function CustomOrders() {
  const dates = getCapacityDates();
  const firstOpen = dates.find((item) => item.available)?.iso ?? "";

  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState(18);
  const [flavor, setFlavor] = useState(flavors[0]);
  const [filling, setFilling] = useState(fillings[0]);
  const [style, setStyle] = useState(styles[0]);
  const [occasion, setOccasion] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState<{ name: string; url: string } | null>(null);
  const [date, setDate] = useState(firstOpen);
  const [submitted, setSubmitted] = useState<CustomRequest | null>(null);
  const formTop = useRef<HTMLDivElement>(null);

  const tier = useMemo(() => {
    let best = servingTiers[0];
    let bestGap = Infinity;
    for (const entry of servingTiers) {
      const gap = Math.abs(entry.guests - guests);
      if (gap < bestGap) { best = entry; bestGap = gap; }
    }
    return best;
  }, [guests]);

  const estimate = estimateQuote(tier.label, filling, style);
  const chosenDate = dates.find((item) => item.iso === date);

  // release the object URL when the reference photo is replaced or unmounted
  useEffect(() => () => { if (photo?.url) URL.revokeObjectURL(photo.url); }, [photo]);

  const choose = <T,>(entries: T[], active: T, setActive: (value: T) => void) =>
    <div className="choice-row">{entries.map((entry) => <button type="button" key={String(entry)} className={entry === active ? "choice selected" : "choice"} onClick={() => setActive(entry)}>{String(entry)}{entry === active && <Check size={14} />}</button>)}</div>;

  const goTo = (next: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)));
    requestAnimationFrame(() => {
      const top = formTop.current?.getBoundingClientRect().top ?? 0;
      window.scrollTo({ top: Math.max(0, window.scrollY + top - 110), behavior: "smooth" });
    });
  };

  const advance = () => {
    if (step === 0 && !occasion.trim()) {
      toast.error("Tell us the occasion so we can size the cake properly.");
      return;
    }
    if (step === 1 && !filling) {
      toast.error("Pick a filling to continue.");
      return;
    }
    if (step === STEPS.length - 1) return;
    goTo(step + 1);
  };

  const submitRequest = () => {
    if (!date) {
      toast.error("Please choose an available bake date.");
      return;
    }
    const request: CustomRequest = {
      code: nextCode(),
      occasion: occasion.trim(),
      size: tier.label,
      flavor,
      filling,
      style,
      details: details.trim(),
      date,
      photoName: photo?.name ?? "",
      estimateLow: estimate.low,
      estimateHigh: estimate.high,
      stepIndex: 0,
      depositPaid: false,
      createdAt: new Date().toISOString(),
    };
    saveRequest(request);
    setSubmitted(request);
    toast.success("Your custom request is ready for review.");
  };

  const submit = (event: FormEvent) => { event.preventDefault(); submitRequest(); };

  if (submitted) {
    const when = dates.find((item) => item.iso === submitted.date);
    return <section className="confirmation-page"><div className="confirmation-card" data-reveal="scale">
      <span className="confirmation-stamp"><Check size={34} /></span>
      <span className="eyebrow">Request received</span>
      <h1>Your cake is<br /><em>on the docket.</em></h1>
      <p>We’ve reserved your request details for review. Expect a tailored quote by the next business day; nothing is confirmed or charged until you accept it.</p>
      <div className="request-code"><span>YOUR TRACKING CODE</span><strong>{submitted.code}</strong></div>
      <div className="confirmation-summary">
        <span><b>Occasion</b>{submitted.occasion}</span>
        <span><b>Size</b>{submitted.size} · {tier.size}</span>
        <span><b>Flavor</b>{submitted.flavor} with {submitted.filling.toLowerCase()}</span>
        <span><b>Look</b>{submitted.style}</span>
        <span><b>Bake date</b>{when ? `${when.day}, ${when.date}` : submitted.date}</span>
      </div>
      <p className="confirmation-note">Use this code on the tracker to follow the request. It’s saved in this browser, so keep it handy.</p>
      <div className="confirmation-actions">
        <a className="button button-primary" href={`/track-order?code=${submitted.code}`}>Track this request <ChevronRight size={16} /></a>
        <button className="text-link" type="button" onClick={() => { setSubmitted(null); setStep(0); }}>Start another brief</button>
      </div>
    </div></section>;
  }

  const stepBody = [
    <div className="form-section" key="gathering">
      <div className="form-section-title"><span>01</span><div><h2>The gathering</h2><p>{STEPS[0].hint}</p></div></div>
      <div className="guest-control">
        <div className="guest-readout">
          <span className="eyebrow">Servings</span>
          <strong>About {guests} guests</strong>
          <span>{tier.size} · {tier.label}</span>
        </div>
        <input
          className="guest-slider"
          type="range"
          min={8}
          max={60}
          step={2}
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
          aria-label="Estimated number of guests"
        />
        <div className="guest-scale"><span>8</span><span>60</span></div>
      </div>
      {choose(servingTiers.map((entry) => entry.label), tier.label, (label) => setGuests(servingTiers.find((entry) => entry.label === label)?.guests ?? guests))}
      <label className="field-label">Occasion<input required value={occasion} onChange={(event) => setOccasion(event.target.value)} placeholder="A 30th, a Tuesday, a tiny victory..." /></label>
    </div>,

    <div className="form-section" key="inside">
      <div className="form-section-title"><span>02</span><div><h2>The inside story</h2><p>{STEPS[1].hint}</p></div></div>
      <div className="form-choice-stack"><div><label>CAKE FLAVOR</label>{choose(flavors, flavor, setFlavor)}</div><div><label>FILLING</label>{choose(fillings, filling, setFilling)}</div></div>
    </div>,

    <div className="form-section" key="outside">
      <div className="form-section-title"><span>03</span><div><h2>The outside</h2><p>{STEPS[2].hint}</p></div></div>
      {choose(styles, style, setStyle)}
      <label className="upload-field">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (photo?.url) URL.revokeObjectURL(photo.url);
            setPhoto({ name: file.name, url: URL.createObjectURL(file) });
            toast.success(`${file.name} attached to your brief.`);
          }}
        />
        <ImagePlus size={19} />
        <span>{photo?.name || "Add an inspiration photo"}</span>
        <small>JPG or PNG</small>
      </label>
      {photo && <div className="upload-preview"><img src={photo.url} alt={`Reference attached: ${photo.name}`} /><button type="button" onClick={() => { URL.revokeObjectURL(photo.url); setPhoto(null); }}>Remove</button></div>}
      <label className="field-label">Details we should know<textarea rows={4} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Color, message, favorite flower, the moment you’re trying to make…" /></label>
    </div>,

    <div className="form-section date-section" key="date">
      <div className="form-section-title"><span>04</span><div><h2>Pick a bake date</h2><p>{STEPS[3].hint}</p></div></div>
      <div className="date-grid">{dates.map((item) => <button type="button" key={item.iso} disabled={!item.available} onClick={() => setDate(item.iso)} aria-pressed={date === item.iso} className={`${date === item.iso ? "selected " : ""}${!item.available ? "unavailable" : ""}`}><span>{item.day}</span><strong>{item.date}</strong><small>{item.available ? `${item.remaining} ${item.remaining === 1 ? "opening" : "openings"}` : "full"}</small></button>)}</div>
      <p className="form-hint"><Info size={15} /> Can’t find your date? Send the request anyway and we’ll share the nearest opening.</p>
    </div>,
  ];

  return <>
    <section className="page-intro custom-intro"><div className="page-rail" data-reveal="fade"><span>02</span><i /></div><div data-reveal="up"><span className="eyebrow">Custom work</span><h1>Make the moment.<br /><em>We’ll make the cake.</em></h1></div><div className="page-intro-aside" data-reveal="up"><p>A few thoughtful answers now means fewer messages later—and more time for the joyful details.</p></div></section>
    <section className="custom-layout">
      <aside className="custom-aside">
        <div className="aside-photo"><img src={withBase("/images/clementine-cake-detail.jpg")} alt="A finished buttercream cake decorated with white flowers" /><span>Made to order</span></div>
        <div className="lead-time"><Sparkles size={19} /><p><b>Five days is our sweet spot.</b><br />We need a minimum of five days to make custom work with care. Full dates are locked before you get to the details.</p></div>
        <div className="capacity-key"><span><i className="open" /> Available</span><span><i className="limited" /> 1–2 openings</span><span><i className="full" /> Full</span></div>
        <div className="summary-panel">
          <span className="eyebrow">Your brief so far</span>
          <div className="summary-line"><span>Occasion</span><strong>{occasion.trim() || "—"}</strong></div>
          <div className="summary-line"><span>Size</span><strong>{tier.size} · {tier.label}</strong></div>
          <div className="summary-line"><span>Flavor</span><strong>{flavor}</strong></div>
          <div className="summary-line"><span>Filling</span><strong>{filling}</strong></div>
          <div className="summary-line"><span>Look</span><strong>{style}</strong></div>
          <div className="summary-line"><span>Bake date</span><strong>{chosenDate ? `${chosenDate.day}, ${chosenDate.date}` : "—"}</strong></div>
          <div className="summary-line"><span>Reference</span><strong>{photo?.name ?? "None yet"}</strong></div>
          <div className="summary-estimate"><span>Indicative estimate</span><strong>${estimate.low}–${estimate.high}</strong><small>A starting range only. Your quote is confirmed after review, and a {Math.round(DEPOSIT_RATE * 100)}% deposit holds the date.</small></div>
        </div>
      </aside>

      <form className="custom-form" onSubmit={submit}>
        <div ref={formTop} />
        <ol className="wizard-steps">
          {STEPS.map((entry, index) => <li key={entry.title} className={index === step ? "current" : index < step ? "done" : ""}>
            <button type="button" onClick={() => (index <= step ? goTo(index) : advance())} aria-current={index === step ? "step" : undefined}>
              <span>{index < step ? <Check size={13} /> : index + 1}</span>
              <em>{entry.title}</em>
            </button>
          </li>)}
        </ol>

        {stepBody[step]}

        <div className="form-submit">
          <p><b>Next:</b> We’ll review your request, send a custom quote, and reserve the date when the deposit is paid.</p>
          <div className="form-submit-actions">
            {step > 0 && <button className="text-link" type="button" onClick={() => goTo(step - 1)}><ArrowLeft size={15} /> Back</button>}
            {step < STEPS.length - 1
              ? <button className="button button-primary" type="button" onClick={advance}>Continue <ChevronRight size={16} /></button>
              : <button className="button button-primary" type="submit">Send custom request <ChevronRight size={16} /></button>}
          </div>
        </div>

        <div className="step-bar">
          <div className="step-bar-summary">
            <span>{STEPS[step].title} · {step + 1}/{STEPS.length}</span>
            <strong>{tier.label} · {flavor}</strong>
          </div>
          <div className="step-bar-actions">
            {step > 0 && <button className="step-bar-back" type="button" onClick={() => goTo(step - 1)} aria-label="Back a step"><ArrowLeft size={17} /></button>}
            {step < STEPS.length - 1
              ? <button className="button button-primary" type="button" onClick={advance}>Continue <ChevronRight size={16} /></button>
              : <button className="button button-primary" type="submit">Send request <ChevronRight size={16} /></button>}
          </div>
        </div>
      </form>
    </section>
  </>;
}

/** Pantry Modernism: order tracking makes each next step visible, specific, and reassuring. */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Check, ChevronRight, CreditCard, MapPin, PackageCheck, ReceiptText } from "lucide-react";
import { getStoreStatus, trackingSteps } from "@/lib/bakery-data";
import { findRequest, SAMPLE_CODES, updateRequest, type CustomRequest } from "@/lib/requests";
import { toast } from "sonner";

type Resolved =
  | { kind: "request"; request: CustomRequest }
  | { kind: "sample"; code: string }
  | { kind: "none" };

const initialCode = () => {
  if (typeof window === "undefined") return "CB-2408";
  return new URLSearchParams(window.location.search).get("code")?.toUpperCase() || "CB-2408";
};

export default function TrackOrder() {
  const [code, setCode] = useState(initialCode);
  const [resolved, setResolved] = useState<Resolved>({ kind: "sample", code: initialCode() });
  const [depositPaid, setDepositPaid] = useState(false);
  const status = useMemo(() => getStoreStatus(), []);

  // a code arriving from the custom-order confirmation should resolve on load
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get("code");
    if (!incoming) return;
    const stored = findRequest(incoming);
    if (stored) {
      setResolved({ kind: "request", request: stored });
      setDepositPaid(stored.depositPaid);
      toast.success(`Found ${stored.code} — ${stored.occasion}.`);
    }
  }, []);

  const search = (event: FormEvent) => {
    event.preventDefault();
    const wanted = code.trim().toUpperCase();
    const stored = findRequest(wanted);
    if (stored) {
      setResolved({ kind: "request", request: stored });
      setDepositPaid(stored.depositPaid);
      toast.success(`Found ${stored.code} — ${stored.occasion}.`);
      return;
    }
    if ((SAMPLE_CODES as readonly string[]).includes(wanted)) {
      setResolved({ kind: "sample", code: wanted });
      setDepositPaid(false);
      return;
    }
    setResolved({ kind: "none" });
    toast.error("We couldn’t find that order. Try CB-2408, or the code from your request.");
  };

  const payDeposit = () => {
    setDepositPaid(true);
    if (resolved.kind === "request") {
      updateRequest(resolved.request.code, { depositPaid: true, stepIndex: 2 });
      setResolved({ kind: "request", request: { ...resolved.request, depositPaid: true, stepIndex: 2 } });
    }
    toast.success("Deposit recorded. Your bake date is confirmed.");
  };

  const isRequest = resolved.kind === "request";
  const stepIndex = resolved.kind === "sample"
    ? (resolved.code === "CB-9051" ? 0 : depositPaid ? 2 : 1)
    : depositPaid ? 2 : resolved.request.stepIndex;

  return <>
    <section className="page-intro track-intro"><div className="page-rail" data-reveal="fade"><span>03</span><i /></div><div data-reveal="up"><span className="eyebrow">Order tracker</span><h1>Less wondering.<br /><em>More looking forward.</em></h1></div><div className="page-intro-aside" data-reveal="up"><p>Use the code in your order email to see where things stand. For a tour of the flow, try the sample order below.</p></div></section>

    <section className="track-layout">
      <div className="track-search-card" data-reveal="right">
        <span className="eyebrow">Look up an order</span>
        <h2>Where’s my cake?</h2>
        <div className={`counter-status ${status.open ? "is-open" : "is-closed"}`}>
          <i />
          <div><strong>{status.label}</strong><span>{status.detail}</span></div>
        </div>
        <form onSubmit={search}>
          <input value={code} onChange={(event) => setCode(event.target.value)} aria-label="Order tracking code" placeholder="CB-2408" />
          <button className="button button-primary" type="submit">Find order <ArrowRight size={16} /></button>
        </form>
        <p>Sample tracking code: <button type="button" onClick={() => { setCode("CB-2408"); setResolved({ kind: "sample", code: "CB-2408" }); setDepositPaid(false); }}>CB-2408</button></p>
      </div>

      {resolved.kind === "none" ? <div className="not-found" data-reveal="up"><span className="citrus-mark mini"><i /><i /><i /><i /><i /><i /><i /><i /></span><h2>No order found.</h2><p>Check the order code in your email or try the sample code above.</p></div> : <div className="track-result" data-reveal="up">
        <div className="track-result-header">
          <div>
            <span className="eyebrow">{isRequest ? "Request in review" : resolved.code === "CB-9051" ? "Request in review" : "Cake order"}</span>
            <h2>{isRequest ? resolved.request.occasion : resolved.code === "CB-9051" ? "Your custom request" : "Daphne’s 30th birthday cake"}</h2>
          </div>
          <span className="status-chip">{trackingSteps[stepIndex]}</span>
        </div>

        <div className="tracker">{trackingSteps.map((step, index) => <div key={step} className={index <= stepIndex ? "track-step complete" : "track-step"}><span>{index < stepIndex ? <Check size={13} /> : index + 1}</span><p>{step}</p></div>)}</div>

        {isRequest ? <>
          <div className="order-detail-grid">
            <div><CalendarDays size={18} /><span>Bake date</span><strong>{resolved.request.date}</strong></div>
            <div><MapPin size={18} /><span>From</span><strong>518 Cypress Ave.<br />Maplewood</strong></div>
            <div><PackageCheck size={18} /><span>Order</span><strong>{resolved.request.size}<br />{resolved.request.flavor} + {resolved.request.filling.toLowerCase()}</strong></div>
          </div>
          <div className="request-status"><ReceiptText size={23} /><div><h3>We have your details.</h3><p>{resolved.request.style} finish{resolved.request.details ? `, plus your note: “${resolved.request.details}”` : ""}{resolved.request.photoName ? `. Reference attached: ${resolved.request.photoName}.` : "."} We’ll send your custom quote to the email you provided by the next business day. Once you accept it, a 50% deposit holds your bake date.</p></div></div>
          <div className="quote-card">
            <div className="quote-card-title"><div><span className="eyebrow">Indicative estimate</span><h3>${resolved.request.estimateLow}–${resolved.request.estimateHigh}</h3></div><ReceiptText size={22} /></div>
            <div className="quote-lines">
              <span>Base for {resolved.request.size} <strong>included</strong></span>
              <span>Finish — {resolved.request.style} <strong>included</strong></span>
              <span>Filling — {resolved.request.filling} <strong>included</strong></span>
            </div>
            <p className="quote-note">A starting range only. Your firm quote is confirmed after review.</p>
            {!depositPaid
              ? <div className="deposit-callout"><div><CreditCard size={18} /><p><b>A 50% deposit confirms your date.</b><br />Pay ${(resolved.request.estimateLow / 2).toFixed(2)} based on the low estimate. We’ll confirm the exact figure with your quote.</p></div><button className="button button-primary" onClick={payDeposit}>Pay deposit <ChevronRight size={16} /></button></div>
              : <div className="deposit-paid"><Check size={18} /><p><b>Deposit paid—your date is held.</b><br />Your remaining balance will be requested two days before pickup.</p></div>}
          </div>
        </> : resolved.code === "CB-9051" ? <div className="request-status"><ReceiptText size={23} /><div><h3>We have your details.</h3><p>We’ll send your custom quote to the email you provided by the next business day. Once you accept it, a 50% deposit holds your bake date.</p></div></div> : <>
          <div className="order-detail-grid"><div><CalendarDays size={18} /><span>Pickup</span><strong>Saturday, Sep 5<br />11:00–11:30am</strong></div><div><MapPin size={18} /><span>From</span><strong>518 Cypress Ave.<br />Maplewood</strong></div><div><PackageCheck size={18} /><span>Order</span><strong>8-inch custom cake<br />Vanilla + raspberry</strong></div></div>
          <div className="quote-card"><div className="quote-card-title"><div><span className="eyebrow">Your approved quote</span><h3>$184.00 total</h3></div><ReceiptText size={22} /></div><div className="quote-lines"><span>Custom 8-inch cake <strong>$160.00</strong></span><span>Hand-piped message <strong>$12.00</strong></span><span>Delivery adjustment <strong>$12.00</strong></span></div>{!depositPaid ? <div className="deposit-callout"><div><CreditCard size={18} /><p><b>A 50% deposit confirms your date.</b><br />Pay $92.00 today. Your remaining $92.00 is due 48 hours before pickup.</p></div><button className="button button-primary" onClick={payDeposit}>Pay $92 deposit <ChevronRight size={16} /></button></div> : <div className="deposit-paid"><Check size={18} /><p><b>Deposit paid—your date is held.</b><br />Your remaining balance of $92.00 will be requested two days before pickup.</p></div>}</div>
        </>}
      </div>}
    </section>
  </>;
}

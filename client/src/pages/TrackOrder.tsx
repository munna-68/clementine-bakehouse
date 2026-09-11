/** Pantry Modernism: order tracking makes each next step visible, specific, and reassuring. */
import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Check, ChevronRight, CreditCard, MapPin, PackageCheck, ReceiptText } from "lucide-react";
import { trackingSteps } from "@/lib/bakery-data";
import { toast } from "sonner";

export default function TrackOrder() {
  const [code, setCode] = useState("CB-2408");
  const [active, setActive] = useState(true);
  const [depositPaid, setDepositPaid] = useState(false);
  const search = (event: FormEvent) => { event.preventDefault(); setActive(["CB-2408", "CB-9051"].includes(code.toUpperCase())); if (!["CB-2408", "CB-9051"].includes(code.toUpperCase())) toast.error("We couldn’t find that order. Try CB-2408."); };
  const stepIndex = code.toUpperCase() === "CB-9051" ? 0 : depositPaid ? 2 : 1;
  const payDeposit = () => { setDepositPaid(true); toast.success("Deposit recorded. Your bake date is confirmed."); };
  return <>
    <section className="page-intro track-intro"><div className="page-rail"><span>03</span><i /></div><div><span className="eyebrow">Order tracker</span><h1>Less wondering.<br /><em>More looking forward.</em></h1></div><div className="page-intro-aside"><p>Use the code in your order email to see where things stand. For a tour of the flow, try the sample order below.</p></div></section>
    <section className="track-layout"><div className="track-search-card"><span className="eyebrow">Look up an order</span><h2>Where’s my cake?</h2><form onSubmit={search}><input value={code} onChange={(event) => setCode(event.target.value)} aria-label="Order tracking code" placeholder="CB-2408" /><button className="button button-primary" type="submit">Find order <ArrowRight size={16} /></button></form><p>Sample tracking code: <button onClick={() => { setCode("CB-2408"); setActive(true); }}>CB-2408</button></p></div>
      {active ? <div className="track-result"><div className="track-result-header"><div><span className="eyebrow">{code.toUpperCase() === "CB-9051" ? "Request in review" : "Cake order"}</span><h2>{code.toUpperCase() === "CB-9051" ? "Your custom request" : "Daphne’s 30th birthday cake"}</h2></div><span className="status-chip">{trackingSteps[stepIndex]}</span></div><div className="tracker">{trackingSteps.map((step, index) => <div key={step} className={index <= stepIndex ? "track-step complete" : "track-step"}><span>{index < stepIndex ? <Check size={13} /> : index + 1}</span><p>{step}</p></div>)}</div>
        {code.toUpperCase() === "CB-9051" ? <div className="request-status"><ReceiptText size={23} /><div><h3>We have your details.</h3><p>We’ll send your custom quote to the email you provided by the next business day. Once you accept it, a 50% deposit holds your bake date.</p></div></div> : <>
          <div className="order-detail-grid"><div><CalendarDays size={18} /><span>Pickup</span><strong>Saturday, Sep 5<br />11:00–11:30am</strong></div><div><MapPin size={18} /><span>From</span><strong>518 Cypress Ave.<br />Maplewood</strong></div><div><PackageCheck size={18} /><span>Order</span><strong>8-inch custom cake<br />Vanilla + raspberry</strong></div></div>
          <div className="quote-card"><div className="quote-card-title"><div><span className="eyebrow">Your approved quote</span><h3>$184.00 total</h3></div><ReceiptText size={22} /></div><div className="quote-lines"><span>Custom 8-inch cake <strong>$160.00</strong></span><span>Hand-piped message <strong>$12.00</strong></span><span>Delivery adjustment <strong>$12.00</strong></span></div>{!depositPaid ? <div className="deposit-callout"><div><CreditCard size={18} /><p><b>A 50% deposit confirms your date.</b><br />Pay $92.00 today. Your remaining $92.00 is due 48 hours before pickup.</p></div><button className="button button-primary" onClick={payDeposit}>Pay $92 deposit <ChevronRight size={16} /></button></div> : <div className="deposit-paid"><Check size={18} /><p><b>Deposit paid—your date is held.</b><br />Your remaining balance of $92.00 will be requested two days before pickup.</p></div>}</div>
        </>}
      </div> : <div className="not-found"><span className="citrus-mark mini"><i /><i /><i /><i /><i /><i /><i /><i /></span><h2>No order found.</h2><p>Check the order code in your email or try the sample code above.</p></div>}
    </section>
  </>;
}


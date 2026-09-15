/** Pantry Modernism: the motion layer is a single quiet system, mounted once for the whole shell. */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowUp } from "lucide-react";
import { registerReveals, scrollToTop, startMotion } from "@/lib/motion";

export function MotionSystem() {
  const [location] = useLocation();

  useEffect(() => {
    startMotion();
  }, []);

  // a route swap replaces the whole page body — re-register on the next frame
  useEffect(() => {
    const id = requestAnimationFrame(() => registerReveals());
    return () => cancelAnimationFrame(id);
  }, [location]);

  return <>
    <div className="scroll-rail" aria-hidden="true"><i /></div>
    <button className="back-to-top" type="button" onClick={scrollToTop} aria-label="Back to top">
      <ArrowUp size={17} strokeWidth={1.9} />
    </button>
  </>;
}

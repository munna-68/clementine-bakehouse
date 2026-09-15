/**
 * Pantry Modernism motion engine.
 *
 * One IntersectionObserver reveals anything marked with `data-reveal`; one
 * rAF-throttled scroll listener writes custom properties onto <html>. Nothing
 * here touches React state, so a scroll never costs a render.
 *
 * Reveal state lives in the `data-revealed` ATTRIBUTE rather than a class:
 * React rewrites `className` whenever a component's class string changes, which
 * would silently wipe imperatively-added classes. Attributes React never
 * renders are left alone.
 */

export type RevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale";

const REVEALED = "data-revealed";
const BOUND = "data-motion-bound";
const REDUCED = "(prefers-reduced-motion: reduce)";

let observer: IntersectionObserver | null = null;
let mutation: MutationObserver | null = null;
let started = false;
let scrollQueued = false;
let rescanQueued = false;
let reduced = false;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED).matches;

/** Elements the engine currently watches, so parallax can skip the rest. */
const parallaxNodes = new Set<HTMLElement>();
const countNodes = new Set<HTMLElement>();

function revealElement(el: HTMLElement) {
  if (el.hasAttribute(REVEALED)) return;
  el.setAttribute(REVEALED, "");
  const counter = el.querySelector<HTMLElement>("[data-count-to]") ?? (el.hasAttribute("data-count-to") ? el : null);
  if (counter) runCountUp(counter);
}

/**
 * Count-up statistics. The final value is written immediately when motion is
 * reduced so the number is never left mid-animation.
 */
function runCountUp(el: HTMLElement) {
  const target = Number(el.dataset.countTo ?? "0");
  if (!Number.isFinite(target)) return;
  const duration = Number(el.dataset.countDuration ?? "1100");
  const pad = Number(el.dataset.countPad ?? "0");
  const prefix = el.dataset.countPrefix ?? "";
  const suffix = el.dataset.countSuffix ?? "";

  const write = (value: number) => {
    const rounded = Math.round(value);
    el.textContent = `${prefix}${pad ? String(rounded).padStart(pad, "0") : String(rounded)}${suffix}`;
  };

  if (reduced || duration <= 0) {
    write(target);
    return;
  }

  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // ease-out cubic, matching the 700ms settle used by reveals
    write(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealElement(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      }
    },
    // fire a little before the element is fully in view so the settle reads as
    // "already arriving" rather than "popped in after you looked"
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );
  return observer;
}

/** Register any not-yet-bound reveal targets under `root`. */
export function registerReveals(root: ParentNode = document) {
  const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
  targets.forEach((el) => {
    if (el.hasAttribute(BOUND)) return;
    el.setAttribute(BOUND, "");
    if (reduced) {
      // reduced motion: no transition, no observer, content simply present
      el.setAttribute(REVEALED, "");
      const counter = el.querySelector<HTMLElement>("[data-count-to]");
      if (counter) runCountUp(counter);
      return;
    }
    ensureObserver().observe(el);
  });

  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    if (reduced) {
      el.style.removeProperty("--parallax");
      return;
    }
    parallaxNodes.add(el);
  });

  root.querySelectorAll<HTMLElement>("[data-count-to]").forEach((el) => {
    if (!el.closest("[data-reveal]")) countNodes.add(el);
  });

  for (const el of countNodes) {
    if (!el.hasAttribute(BOUND)) {
      el.setAttribute(BOUND, "");
      if (reduced) runCountUp(el);
      else ensureObserver().observe(el);
    }
  }
}

function updateScrollState() {
  const doc = document.documentElement;
  const y = window.scrollY || doc.scrollTop || 0;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, y / max));

  doc.style.setProperty("--scroll-progress", progress.toFixed(4));
  doc.style.setProperty("--scroll-y", `${Math.round(y)}px`);
  doc.classList.toggle("has-scrolled", y > 8);
  doc.classList.toggle("scrolled", y > 220);

  if (!reduced && parallaxNodes.size) {
    const vh = window.innerHeight;
    for (const el of parallaxNodes) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -160 || rect.top > vh + 160) continue;
      const strength = Number(el.dataset.parallax || "0.1");
      const offset = (rect.top + rect.height / 2 - vh / 2) * strength;
      el.style.setProperty("--parallax", `${offset.toFixed(2)}px`);
    }
  }
}

function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    updateScrollState();
  });
}

function queueRescan() {
  if (rescanQueued) return;
  rescanQueued = true;
  requestAnimationFrame(() => {
    rescanQueued = false;
    registerReveals();
    updateScrollState();
  });
}

/**
 * Boot the engine. Safe to call more than once — listeners are attached a
 * single time and route changes are handled by the MutationObserver.
 */
export function startMotion() {
  if (started || typeof window === "undefined") return;
  started = true;
  reduced = reducedMotion();

  document.documentElement.classList.add("js-motion");
  if (reduced) document.documentElement.classList.add("reduced-motion");

  registerReveals();
  updateScrollState();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", queueRescan, { passive: true });

  // route changes and list re-renders swap the DOM without a page load
  mutation = new MutationObserver((records) => {
    for (const record of records) {
      if (record.addedNodes.length) {
        queueRescan();
        return;
      }
    }
  });
  mutation.observe(document.body, { childList: true, subtree: true });

  const media = window.matchMedia(REDUCED);
  media.addEventListener("change", () => {
    reduced = media.matches;
    document.documentElement.classList.toggle("reduced-motion", reduced);
    if (reduced) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        observer?.unobserve(el);
        el.setAttribute(REVEALED, "");
      });
      parallaxNodes.forEach((el) => el.style.removeProperty("--parallax"));
    } else {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.removeAttribute(BOUND));
      registerReveals();
    }
    queueRescan();
  });
}

/** Scroll to the top, honouring reduced motion. Used by the back-to-top control. */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export const prefersReducedMotion = () => reducedMotion();

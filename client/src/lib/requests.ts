/**
 * Pantry Modernism: custom requests live in the browser so the tracking code a
 * customer receives actually resolves. No backend, no network — the request is
 * written to localStorage under a generated code and read back by the tracker.
 */
import { servingTiers, trackingSteps } from "@/lib/bakery-data";

export type CustomRequest = {
  code: string;
  occasion: string;
  size: string;
  flavor: string;
  filling: string;
  style: string;
  details: string;
  date: string;
  photoName: string;
  estimateLow: number;
  estimateHigh: number;
  stepIndex: number;
  depositPaid: boolean;
  createdAt: string;
};

const KEY = "clementine.requests.v1";

/** The two codes the site documents as samples, kept resolvable. */
export const SAMPLE_CODES = ["CB-2408", "CB-9051"] as const;

const FILLING_PREMIUM: Record<string, number> = {
  "Salted caramel": 8,
  "Raspberry preserve": 6,
  "Chocolate mousse": 9,
  "Lemon curd": 6,
};

const STYLE_PREMIUM: Record<string, number> = {
  "Clean + classic": 0,
  "Floral + textured": 34,
  Illustrated: 46,
  "Something else entirely": 28,
};

/** Indicative range built from the same tiers and add-ons the copy quotes. */
export function estimateQuote(size: string, filling: string, style: string) {
  const tier = servingTiers.find((entry) => entry.label === size) ?? servingTiers[1];
  const total = tier.base + (FILLING_PREMIUM[filling] ?? 0) + (STYLE_PREMIUM[style] ?? 0);
  return { low: Math.round(total * 0.94), high: Math.round(total * 1.12), base: tier.base, size: tier.size };
}

function read(): CustomRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CustomRequest[]) : [];
  } catch {
    return [];
  }
}

function write(all: CustomRequest[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all.slice(-24)));
  } catch {
    /* storage unavailable — the flow still completes for this session */
  }
}

export function loadRequests(): CustomRequest[] {
  return read();
}

export function findRequest(code: string): CustomRequest | undefined {
  const wanted = code.trim().toUpperCase();
  return read().find((entry) => entry.code === wanted);
}

/** Generate a code that cannot collide with an existing one or a sample. */
export function nextCode(): string {
  const taken = new Set<string>([...SAMPLE_CODES, ...read().map((entry) => entry.code)]);
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const code = `CB-${Math.floor(1000 + Math.random() * 8999)}`;
    if (!taken.has(code)) return code;
  }
  return `CB-${Date.now().toString().slice(-4)}`;
}

export function saveRequest(request: CustomRequest) {
  write([...read().filter((entry) => entry.code !== request.code), request]);
}

export function updateRequest(code: string, patch: Partial<CustomRequest>) {
  const all = read();
  const index = all.findIndex((entry) => entry.code === code.toUpperCase());
  if (index === -1) return false;
  all[index] = { ...all[index], ...patch };
  write(all);
  return true;
}

export function clearRequests() {
  write([]);
}

export const stepCount = trackingSteps.length;

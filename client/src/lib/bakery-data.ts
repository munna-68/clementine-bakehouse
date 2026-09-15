/** Pantry Modernism: operational bakery data is calm, specific, and designed to support confident ordering. */
export type BakeryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Breakfast" | "Cupcakes" | "Cookies" | "Daily loaves";
  accent: "orange" | "blue" | "yellow" | "navy";
  badge?: string;
  /** Photograph in client/public/images, resolved through withBase() at render time. */
  image: string;
  /** Alt text describing the photograph itself, not the product name. */
  imageAlt: string;
};

export const bakeryItems: BakeryItem[] = [
  { id: "morning-bun", name: "Meyer Lemon Morning Bun", description: "Cardamom sugar, lemon peel, cultured butter.", price: 5.5, category: "Breakfast", accent: "yellow", badge: "Saturday favorite", image: "clementine-morning-bun.jpg", imageAlt: "Golden swirled morning buns cooling on a bakery tray" },
  { id: "coffee-cake", name: "Olive Oil Coffee Cake", description: "Tender crumb, citrus glaze, sesame brittle.", price: 4.75, category: "Breakfast", accent: "blue", image: "clementine-coffee-cake.jpg", imageAlt: "A single glazed coffee cake swirl on a white plate" },
  { id: "vanilla-cupcake", name: "Vanilla Cloud Cupcake", description: "Vanilla bean cake, whipped frosting, flaky salt.", price: 4.25, category: "Cupcakes", accent: "orange", image: "clementine-vanilla-cupcake.jpg", imageAlt: "Vanilla cupcakes with swirled white buttercream" },
  { id: "chocolate-cupcake", name: "Midnight Chocolate Cupcake", description: "Deep cocoa cake, milk chocolate frosting.", price: 4.5, category: "Cupcakes", accent: "navy", image: "clementine-chocolate-cupcake.jpg", imageAlt: "Dark chocolate cupcakes on pale studio plinths" },
  { id: "jam-cookie", name: "Raspberry Window Cookie", description: "Buttery shortbread, bright raspberry preserve.", price: 3.25, category: "Cookies", accent: "orange", image: "clementine-jam-cookie.jpg", imageAlt: "Round shortbread cookies with raspberry jam centres" },
  { id: "sea-salt-cookie", name: "Sea Salt Chocolate Chunk", description: "Brown butter dough, dark chocolate, flaky salt.", price: 3.5, category: "Cookies", accent: "yellow", image: "clementine-sea-salt-cookie.jpg", imageAlt: "A stack of chocolate chunk cookies on a white plate" },
  { id: "country-loaf", name: "Country Sourdough", description: "Naturally leavened, crackling crust, open crumb.", price: 9, category: "Daily loaves", accent: "blue", image: "clementine-country-loaf.jpg", imageAlt: "A cut sourdough loaf on a wooden board" },
  { id: "seeded-loaf", name: "Seeded Table Loaf", description: "Whole grain, sesame, sunflower, poppy.", price: 10, category: "Daily loaves", accent: "navy", image: "clementine-seeded-loaf.jpg", imageAlt: "A seeded whole grain loaf on a woven mat" },
];


export type CapacityDate = {
  iso: string;
  day: string;
  date: string;
  available: boolean;
  remaining: number;
};

export function getCapacityDates(): CapacityDate[] {
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() + 5);
  const seeds = [2, 1, 0, 3, 2, 0, 1, 2, 3, 1];
  return Array.from({ length: 10 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    const remaining = seeds[index];
    return {
      iso: current.toISOString().slice(0, 10),
      day: current.toLocaleDateString("en-US", { weekday: "short" }),
      date: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      available: remaining > 0,
      remaining,
    };
  });
}

export const trackingSteps = ["Requested", "Quoted", "Deposit paid", "In production", "Ready"];

/** Real counter hours, mirroring the footer. 0 = Sunday. */
export const storeHours: Record<number, { open: number; close: number } | null> = {
  0: null, 1: null, 2: null,
  3: { open: 8, close: 16 },
  4: { open: 8, close: 16 },
  5: { open: 8, close: 16 },
  6: { open: 8, close: 14 },
};

export type StoreStatus = {
  open: boolean;
  label: string;
  detail: string;
};

/** Live counter status from the real opening hours — no network, no guessing. */
export function getStoreStatus(now: Date = new Date()): StoreStatus {
  const today = storeHours[now.getDay()];
  const hour = now.getHours() + now.getMinutes() / 60;

  if (today && hour >= today.open && hour < today.close) {
    const left = today.close - hour;
    const detail = left < 1
      ? "Closing within the hour"
      : `${Math.floor(left)} ${Math.floor(left) === 1 ? "hour" : "hours"} left today`;
    return { open: true, label: "Open now", detail };
  }

  if (today && hour < today.open) {
    return { open: false, label: "Opening soon", detail: `Doors at ${today.open}am` };
  }

  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const day = storeHours[(now.getDay() + ahead) % 7];
    if (day) {
      const name = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(now.getDay() + ahead) % 7];
      return { open: false, label: "Closed", detail: `Back ${ahead === 1 ? "tomorrow" : name} at ${day.open}am` };
    }
  }
  return { open: false, label: "Closed", detail: "Back Wednesday at 8am" };
}

/** Serving tiers used by the custom-order estimator. */
export const servingTiers = [
  { guests: 10, label: "8–12 guests", size: '6" round', base: 78 },
  { guests: 18, label: "16–20 guests", size: '8" round', base: 160 },
  { guests: 28, label: "24–32 guests", size: '10" round', base: 235 },
  { guests: 48, label: "40+ guests", size: "Two-tier", base: 390 },
];

/** Lead time and deposit terms, quoted from the same rules the copy states. */
export const LEAD_TIME_DAYS = 5;
export const DEPOSIT_RATE = 0.5;



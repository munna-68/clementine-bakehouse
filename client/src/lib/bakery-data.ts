/** Pantry Modernism: operational bakery data is calm, specific, and designed to support confident ordering. */
export type BakeryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Breakfast" | "Cupcakes" | "Cookies" | "Daily loaves";
  accent: "orange" | "blue" | "yellow" | "navy";
  badge?: string;
};

export const bakeryItems: BakeryItem[] = [
  { id: "morning-bun", name: "Meyer Lemon Morning Bun", description: "Cardamom sugar, lemon peel, cultured butter.", price: 5.5, category: "Breakfast", accent: "yellow", badge: "Saturday favorite" },
  { id: "coffee-cake", name: "Olive Oil Coffee Cake", description: "Tender crumb, citrus glaze, sesame brittle.", price: 4.75, category: "Breakfast", accent: "blue" },
  { id: "vanilla-cupcake", name: "Vanilla Cloud Cupcake", description: "Vanilla bean cake, whipped frosting, flaky salt.", price: 4.25, category: "Cupcakes", accent: "orange" },
  { id: "chocolate-cupcake", name: "Midnight Chocolate Cupcake", description: "Deep cocoa cake, milk chocolate frosting.", price: 4.5, category: "Cupcakes", accent: "navy" },
  { id: "jam-cookie", name: "Raspberry Window Cookie", description: "Buttery shortbread, bright raspberry preserve.", price: 3.25, category: "Cookies", accent: "orange" },
  { id: "sea-salt-cookie", name: "Sea Salt Chocolate Chunk", description: "Brown butter dough, dark chocolate, flaky salt.", price: 3.5, category: "Cookies", accent: "yellow" },
  { id: "country-loaf", name: "Country Sourdough", description: "Naturally leavened, crackling crust, open crumb.", price: 9, category: "Daily loaves", accent: "blue" },
  { id: "seeded-loaf", name: "Seeded Table Loaf", description: "Whole grain, sesame, sunflower, poppy.", price: 10, category: "Daily loaves", accent: "navy" },
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


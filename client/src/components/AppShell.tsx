/** Pantry Modernism: page chrome maintains a subtle workbench rhythm around every task. */
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OrderDrawer } from "@/components/OrderDrawer";
import { MotionSystem } from "@/components/MotionSystem";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><MotionSystem /><SiteHeader /><main id="main">{children}</main><SiteFooter /><OrderDrawer /></div>;
}

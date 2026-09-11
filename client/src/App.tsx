/** Pantry Modernism: every route shares a composed, functional bakery service surface. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { OrderProvider } from "./contexts/OrderContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CustomOrders from "./pages/CustomOrders";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  return <AppShell><Switch>
    <Route path="/" component={Home} />
    <Route path="/shop" component={Shop} />
    <Route path="/custom-orders" component={CustomOrders} />
    <Route path="/track-order" component={TrackOrder} />
    <Route path="/about" component={About} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></AppShell>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><OrderProvider><Toaster richColors position="top-center" /><WouterRouter base={routerBase}><AppRoutes /></WouterRouter></OrderProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;

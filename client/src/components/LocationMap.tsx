/**
 * Pantry Modernism: a self-contained location block.
 *
 * This replaces the earlier Google Maps component, which required a
 * VITE_FRONTEND_FORGE_API_KEY that the project does not have and therefore
 * rendered an empty 500px box. This version is drawn locally, needs no key and
 * no network, and always renders.
 */
import { MapPin, Navigation } from "lucide-react";

export const ADDRESS = "518 Cypress Avenue, Maplewood, NJ 07040";
export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export function LocationMap({ label = "Clementine Bakehouse" }: { label?: string }) {
  return (
    <div className="location-block">
      <div className="location-map">
        <svg viewBox="0 0 600 260" role="img" aria-label={`Map showing ${label} at ${ADDRESS}`}>
          <rect width="600" height="260" fill="#dbe6e7" />
          <rect x="28" y="26" width="150" height="82" rx="6" fill="#cbdadb" />
          <rect x="200" y="26" width="118" height="82" rx="6" fill="#cbdadb" />
          <rect x="340" y="26" width="104" height="82" rx="6" fill="#d3e0d8" />
          <rect x="466" y="26" width="106" height="82" rx="6" fill="#cbdadb" />
          <rect x="28" y="150" width="150" height="84" rx="6" fill="#cbdadb" />
          <rect x="200" y="150" width="118" height="84" rx="6" fill="#cbdadb" />
          <rect x="340" y="150" width="104" height="84" rx="6" fill="#cbdadb" />
          <rect x="466" y="150" width="106" height="84" rx="6" fill="#d3e0d8" />
          <g stroke="#f6f5f1" strokeLinecap="square">
            <path d="M0 124h600" strokeWidth="16" />
            <path d="M182 0v260" strokeWidth="13" />
            <path d="M322 0v260" strokeWidth="13" />
            <path d="M448 0v260" strokeWidth="13" />
            <path d="M0 44v0" strokeWidth="0" />
          </g>
          <path d="M0 240L600 96" stroke="#f6f5f1" strokeWidth="9" opacity="0.85" />
          <text x="18" y="118" fill="#8ea3a6" fontFamily="system-ui, sans-serif" fontSize="11" letterSpacing="2">CYPRESS AVE</text>
          <text x="330" y="248" fill="#8ea3a6" fontFamily="system-ui, sans-serif" fontSize="11" letterSpacing="2">MAPLEWOOD</text>
        </svg>
        <span className="location-pin" aria-hidden="true" />
      </div>
      <div className="location-meta">
        <p><MapPin size={15} /> 518 Cypress Avenue<br />Maplewood, NJ 07040</p>
        <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">Open in maps <Navigation size={15} /></a>
      </div>
    </div>
  );
}

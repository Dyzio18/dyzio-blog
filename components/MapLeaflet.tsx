'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { useT } from '@/lib/i18n/I18nProvider';

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  post?: string;
  trip?: string;
}

interface MapProps {
  locations: MapLocation[] | MapLocation;
  title?: string;
  zoom?: number;
  height?: string;
}

function fixLeafletIcon() {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }
}

export default function MapLeaflet({ locations, title, zoom = 10, height = 'h-64' }: MapProps) {
  // resolvedTheme is undefined until the client has hydrated — use that as the mounted check
  const { resolvedTheme } = useTheme();
  const { dict } = useT();

  if (typeof window === 'undefined') {
    return null;
  }

  fixLeafletIcon();

  const locs = Array.isArray(locations) ? locations : [locations];

  const center: [number, number] =
    locs.length === 1
      ? [locs[0].lat, locs[0].lng]
      : [
          locs.reduce((sum, l) => sum + l.lat, 0) / locs.length,
          locs.reduce((sum, l) => sum + l.lng, 0) / locs.length,
        ];

  const positions: [number, number][] = locs.map((l) => [l.lat, l.lng]);
  const isRoute = positions.length > 1;

  const googleMapsUrl =
    locs.length === 1
      ? `https://www.google.com/maps?q=${locs[0].lat},${locs[0].lng}`
      : `https://www.google.com/maps/dir/${locs.map((l) => `${l.lat},${l.lng}`).join('/')}`;

  // resolvedTheme is undefined before hydration; default to light tiles until resolved
  const isDark = resolvedTheme === 'dark';
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="my-6">
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      <div className={`${height} w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
        <MapContainer center={center} zoom={zoom} className="w-full h-full" scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
            subdomains="abcd"
            maxZoom={19}
          />

          {isRoute && <Polyline positions={positions} color="#e11d48" weight={3} dashArray="5, 10" />}

          {locs.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{loc.name}</p>
                  {loc.trip && <p className="text-xs text-gray-600">{loc.trip}</p>}
                  {loc.post && (
                    <a href={loc.post} className="text-primary-600 hover:underline mt-1 inline-block">
                      {dict.travelMap.readMore} →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-2 text-sm">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
        >
          📍 {isRoute ? 'View route in Google Maps' : `${locs[0].name} — Open in Google Maps`}
        </a>
      </div>
    </div>
  );
}

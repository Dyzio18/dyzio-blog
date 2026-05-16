'use client';

import dynamic from 'next/dynamic';
import type { MapLocation } from './MapLeaflet';

const Map = dynamic(() => import('./MapLeaflet'), { ssr: false });

interface TravelMapClientProps {
  locations: MapLocation[];
}

export default function TravelMapClient({ locations }: TravelMapClientProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg">
      <Map locations={locations} title="" zoom={2} height="h-[500px] md:h-[600px]" />
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./MapLeaflet'), { ssr: false });

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface TravelMapClientProps {
  locations: Location[];
}

export default function TravelMapClient({ locations }: TravelMapClientProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <Map locations={locations} title="" zoom={2} height="h-[500px]" />
    </div>
  );
}
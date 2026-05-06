'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./MapLeaflet'), { ssr: false });

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapProps {
  locations: Location[] | Location;
  title?: string;
  zoom?: number;
  height?: string;
}

export default function MapClient(props: MapProps) {
  return <LeafletMap {...props} />;
}
'use client';

import dynamic from 'next/dynamic';
import type { MapLocation } from './MapLeaflet';

const LeafletMap = dynamic(() => import('./MapLeaflet'), { ssr: false });

interface MapProps {
  locations: MapLocation[] | MapLocation;
  title?: string;
  zoom?: number;
  height?: string;
}

export default function MapClient(props: MapProps) {
  return <LeafletMap {...props} />;
}
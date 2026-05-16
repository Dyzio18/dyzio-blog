'use client';

import MapClient from './MapClient';
import type { MapLocation } from './MapLeaflet';

export type { MapLocation };

export interface MapProps {
  locations: MapLocation[] | MapLocation;
  title?: string;
  zoom?: number;
  height?: string;
}

export default function Map(props: MapProps) {
  return <MapClient {...props} />;
}
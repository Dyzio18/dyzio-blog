import MapClient from './MapClient';

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface MapProps {
  locations: Location[] | Location;
  title?: string;
  zoom?: number;
  height?: string;
}

export default function Map(props: MapProps) {
  return <MapClient {...props} />;
}
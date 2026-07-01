import React, { useEffect, useRef, useState } from 'react';

interface LeafletFallbackMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LeafletFallbackMap({
  lat,
  lng,
  onLocationChange,
}: LeafletFallbackMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet resources dynamically from CDN
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Append Leaflet CSS to document head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Append Leaflet script to document body
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Keep loaded for subsequent renders/components
    };
  }, []);

  // Sync Leaflet map center and marker when lat/lng change from the outside
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapRef.current) {
      // Initialize map instance
      mapRef.current = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
      });

      // Load OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Create a draggable pin marker
      markerRef.current = L.marker([lat, lng], {
        draggable: true,
      }).addTo(mapRef.current);

      // Drag event handler
      markerRef.current.on('dragend', () => {
        const position = markerRef.current.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      // Map click handler to set marker position
      mapRef.current.on('click', (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        markerRef.current.setLatLng([clickLat, clickLng]);
        onLocationChange(clickLat, clickLng);
      });
    } else {
      // Keep map in sync when external controls (e.g. search) update lat/lng
      const currentCenter = mapRef.current.getCenter();
      if (Math.abs(currentCenter.lat - lat) > 0.0001 || Math.abs(currentCenter.lng - lng) > 0.0001) {
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [leafletLoaded, lat, lng, onLocationChange]);

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-semibold uppercase tracking-wider font-sans">Loading interactive maps fallback...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-2xl relative" 
      style={{ minHeight: '400px' }}
    />
  );
}

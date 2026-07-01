import React, { useEffect, useRef, useState } from 'react';
import { LandListing } from '../types';
import { Plus, Minus, Compass, Maximize2, Minimize2 } from 'lucide-react';

interface LeafletMapProps {
  mode: 'select-location' | 'view-boundary' | 'admin-all-locations' | 'route-directions';
  lat?: number;
  lng?: number;
  zoom?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  drawingPolygon?: [number, number][];
  onDrawingPolygonChange?: (polygon: [number, number][]) => void;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  mapClickMode?: 'pin' | 'boundary'; // For 'select-location' mode
  listings?: LandListing[]; // For 'admin-all-locations' mode
  selectedListingId?: string;
  onVerifyListing?: (listingId: string, approved: boolean) => void; // Admin action
  routeStart?: [number, number]; // [lat, lng] for routing start
  routeEnd?: [number, number];   // [lat, lng] for routing end
  onRouteCalculated?: (distanceKm: number, durationMins: number) => void;
}

export default function LeafletMap({
  mode,
  lat = 18.52,
  lng = 73.85,
  zoom,
  onLocationChange,
  drawingPolygon = [],
  onDrawingPolygonChange,
  mapType = 'hybrid',
  mapClickMode = 'pin',
  listings = [],
  selectedListingId,
  onVerifyListing,
  routeStart,
  routeEnd,
  onRouteCalculated,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const vertexMarkersRef = useRef<any[]>([]);
  const adminMarkersRef = useRef<any[]>([]);
  const routePolylineRef = useRef<any>(null);
  const routeStartMarkerRef = useRef<any>(null);
  const routeEndMarkerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const hybridOverlayRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Auto-invalidate map size when fullscreen toggles to redraw map correctly
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 200);
    }
  }, [isFullScreen, leafletLoaded]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 16);
          }
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not access your location. Please check your browser's location permission settings.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    script.onerror = () => {
      setErrorState('Leaflet Map library failed to load from CDN.');
    };
    document.body.appendChild(script);
  }, []);

  // Sync / initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Default icon path fix for Leaflet in Webpack/Vite
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapRef.current) {
      const initialZoom = zoom || (mode === 'admin-all-locations' ? 5 : 14);
      mapRef.current = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: initialZoom,
        zoomControl: false,
      });

      // Map click handler
      mapRef.current.on('click', (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        if (mode === 'select-location') {
          if (mapClickMode === 'boundary') {
            if (onDrawingPolygonChange) {
              onDrawingPolygonChange([...drawingPolygon, [clickLat, clickLng]]);
            }
          } else {
            if (onLocationChange) {
              onLocationChange(clickLat, clickLng);
            }
          }
        }
      });
    }

    // Update tile layers based on mapType
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    if (hybridOverlayRef.current) {
      mapRef.current.removeLayer(hybridOverlayRef.current);
      hybridOverlayRef.current = null;
    }

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapType === 'satellite' || mapType === 'hybrid') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community';
    } else if (mapType === 'terrain') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community';
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
    }).addTo(mapRef.current);

    // If hybrid, overlay a semi-transparent OSM roads and labels layer
    if (mapType === 'hybrid') {
      hybridOverlayRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.5,
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      // Keep map reference intact
    };
  }, [leafletLoaded, mapType, mode]);

  // Sync mode: 'select-location' (marker and editable boundary polygon)
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mode !== 'select-location') return;
    const L = (window as any).L;
    if (!L) return;

    // 1. Manage center marker
    if (!markerRef.current) {
      // Create primary marker
      markerRef.current = L.marker([lat, lng], {
        draggable: true,
        title: 'Center Location',
      }).addTo(mapRef.current);

      markerRef.current.on('dragend', () => {
        const position = markerRef.current.getLatLng();
        if (onLocationChange) {
          onLocationChange(position.lat, position.lng);
        }
      });
    } else {
      markerRef.current.setLatLng([lat, lng]);
    }

    // 2. Manage land boundary polygon
    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }

    if (drawingPolygon.length > 0) {
      polygonRef.current = L.polygon(drawingPolygon, {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.35,
        weight: 3,
      }).addTo(mapRef.current);
    }

    // 3. Manage vertex drag handles
    vertexMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    vertexMarkersRef.current = [];

    if (drawingPolygon.length > 0) {
      drawingPolygon.forEach((vertex, index) => {
        // Red circle markers for each vertex that can be dragged to edit!
        const vMarker = L.circleMarker(vertex, {
          radius: 6,
          color: '#ffffff',
          fillColor: '#991b1b',
          fillOpacity: 1,
          weight: 2,
          interactive: true,
        }).addTo(mapRef.current);

        // Make interactive
        vMarker.on('mousedown', () => {
          mapRef.current.dragging.disable();
          
          const onMove = (moveEvent: any) => {
            const nextPolygon = [...drawingPolygon];
            nextPolygon[index] = [moveEvent.latlng.lat, moveEvent.latlng.lng];
            if (onDrawingPolygonChange) {
              onDrawingPolygonChange(nextPolygon);
            }
          };

          const onUp = () => {
            mapRef.current.off('mousemove', onMove);
            mapRef.current.off('mouseup', onUp);
            mapRef.current.dragging.enable();
          };

          mapRef.current.on('mousemove', onMove);
          mapRef.current.on('mouseup', onUp);
        });

        // Add delete vertex tooltip or double click handler
        vMarker.on('dblclick', (ev: any) => {
          L.DomEvent.stopPropagation(ev);
          const nextPolygon = drawingPolygon.filter((_, i) => i !== index);
          if (onDrawingPolygonChange) {
            onDrawingPolygonChange(nextPolygon);
          }
        });

        vMarker.bindTooltip(`Vertex ${index + 1}<br><span class="text-[9px] text-slate-400">Drag to move, Double-click to delete</span>`, {
          direction: 'top',
          className: 'bg-slate-900 text-white rounded px-2 py-1 text-xxs font-sans font-bold shadow-md border-0',
        });

        vertexMarkersRef.current.push(vMarker);
      });
    }

    // Keep map center in sync unless user is dragging
    const currentCenter = mapRef.current.getCenter();
    if (Math.abs(currentCenter.lat - lat) > 0.01 || Math.abs(currentCenter.lng - lng) > 0.01) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  }, [leafletLoaded, mode, lat, lng, drawingPolygon, onDrawingPolygonChange, onLocationChange, mapClickMode]);

  // Sync mode: 'view-boundary' (single land view with static boundary and marker)
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mode !== 'view-boundary') return;
    const L = (window as any).L;
    if (!L) return;

    // Reset center marker
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    markerRef.current = L.marker([lat, lng], {
      title: 'Property Location',
    }).addTo(mapRef.current);

    // Reset polygon
    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }

    if (drawingPolygon && drawingPolygon.length > 2) {
      polygonRef.current = L.polygon(drawingPolygon, {
        color: '#10b981',
        fillColor: '#34d399',
        fillOpacity: 0.3,
        weight: 3,
      }).addTo(mapRef.current);

      // Fit map bounds to the polygon
      const bounds = polygonRef.current.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [30, 30] });
    } else {
      mapRef.current.setView([lat, lng], 15);
    }
  }, [leafletLoaded, mode, lat, lng, drawingPolygon]);

  // Sync mode: 'admin-all-locations' (plots all listings as interactive markers)
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mode !== 'admin-all-locations') return;
    const L = (window as any).L;
    if (!L) return;

    // Clean old markers
    adminMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    adminMarkersRef.current = [];

    // Reset polygon in view
    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }

    let activeBounds = L.latLngBounds();

    listings.forEach((land) => {
      const l_lat = Number(land.coordinates?.lat || 18.52);
      const l_lng = Number(land.coordinates?.lng || 73.85);

      let pinColor = '#f59e0b'; // amber-500 (pending)
      if (land.status === 'approved') pinColor = '#10b981'; // emerald-500
      if (land.status === 'rejected') pinColor = '#ef4444'; // rose-500

      // Create standard circle marker or pin with dynamic styling
      const marker = L.circleMarker([l_lat, l_lng], {
        radius: 8,
        fillColor: pinColor,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(mapRef.current);

      activeBounds.extend([l_lat, l_lng]);

      // Create custom popup content with interactive actions
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-3 max-w-[280px] space-y-3 font-sans text-xs text-left select-text';
      popupDiv.innerHTML = `
        <div>
          <span class="inline-flex items-center text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded-md mb-1 bg-slate-100 text-slate-700 border border-slate-200">
            ${land.id}
          </span>
          <h5 class="font-extrabold text-slate-900 leading-snug text-xs">${land.title}</h5>
          <p class="text-[10px] text-slate-500 mt-0.5">${land.address || land.location}</p>
        </div>
        <div class="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-150 text-[10px] font-semibold text-slate-700">
          <div>
            <span class="text-slate-400 block font-mono text-[8px]">ACRES</span>
            ${land.acres} Ac
          </div>
          <div>
            <span class="text-slate-400 block font-mono text-[8px]">SURVEY NO</span>
            <span class="text-rose-700 font-extrabold">${land.surveyNumber || 'N/A'}</span>
          </div>
          <div class="col-span-2 border-t border-slate-200 pt-1">
            <span class="text-slate-400 block font-mono text-[8px]">VALUATION</span>
            <strong class="text-slate-900 font-extrabold">₹${land.price.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <span class="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">
            STATUS: <span class="font-bold uppercase ${
              land.status === 'approved' ? 'text-emerald-600' :
              land.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
            }">${land.status}</span>
          </span>
          <div class="flex gap-1" id="btn-group-${land.id}">
            <button class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md text-[9px] cursor-pointer" id="btn-approve-${land.id}">Approve</button>
            <button class="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md text-[9px] cursor-pointer" id="btn-reject-${land.id}">Reject</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 300 });

      marker.on('popupopen', () => {
        // Wire up popup actions manually to React handlers
        const appBtn = document.getElementById(`btn-approve-${land.id}`);
        const rejBtn = document.getElementById(`btn-reject-${land.id}`);

        if (appBtn) {
          appBtn.onclick = () => {
            if (onVerifyListing) onVerifyListing(land.id, true);
            marker.closePopup();
          };
        }
        if (rejBtn) {
          rejBtn.onclick = () => {
            if (onVerifyListing) onVerifyListing(land.id, false);
            marker.closePopup();
          };
        }

        // Draw boundary on the map if open
        if (polygonRef.current) {
          mapRef.current.removeLayer(polygonRef.current);
          polygonRef.current = null;
        }
        if (land.parcelPolygon && land.parcelPolygon.length > 2) {
          polygonRef.current = L.polygon(land.parcelPolygon, {
            color: '#3b82f6',
            fillColor: '#93c5fd',
            fillOpacity: 0.35,
            weight: 3,
          }).addTo(mapRef.current);
        }
      });

      marker.on('popupclose', () => {
        if (polygonRef.current) {
          mapRef.current.removeLayer(polygonRef.current);
          polygonRef.current = null;
        }
      });

      // Highlight if selected
      if (selectedListingId === land.id) {
        setTimeout(() => {
          marker.openPopup();
          mapRef.current.setView([l_lat, l_lng], 13);
        }, 100);
      }

      adminMarkersRef.current.push(marker);
    });

    if (listings.length > 0 && !selectedListingId) {
      mapRef.current.fitBounds(activeBounds, { padding: [50, 50] });
    }
  }, [leafletLoaded, mode, listings, selectedListingId, onVerifyListing]);

  // Sync mode: 'route-directions' (calculates and traces OSRM route on the map)
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mode !== 'route-directions' || !routeStart || !routeEnd) return;
    const L = (window as any).L;
    if (!L) return;

    // Clean old layers
    if (routeStartMarkerRef.current) mapRef.current.removeLayer(routeStartMarkerRef.current);
    if (routeEndMarkerRef.current) mapRef.current.removeLayer(routeEndMarkerRef.current);
    if (routePolylineRef.current) mapRef.current.removeLayer(routePolylineRef.current);

    routeStartMarkerRef.current = L.marker(routeStart, {
      title: 'My Location',
    }).addTo(mapRef.current).bindPopup('<b>My Location</b>').openPopup();

    routeEndMarkerRef.current = L.marker(routeEnd, {
      title: 'Property Location',
    }).addTo(mapRef.current).bindPopup('<b>Property Location</b>');

    // Query free OSRM driving route API
    const [startLat, startLng] = routeStart;
    const [endLat, endLng] = routeEnd;

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          
          // Draw route polyline
          routePolylineRef.current = L.polyline(coordinates, {
            color: '#4f46e5', // indigo-600
            weight: 5,
            opacity: 0.8,
          }).addTo(mapRef.current);

          // Fit route bounds
          mapRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });

          // Send back calculated stats
          const distanceKm = route.distance / 1000;
          const durationMins = route.duration / 60;
          if (onRouteCalculated) {
            onRouteCalculated(distanceKm, durationMins);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching OSRM routing data:', err);
        // Fallback straight line polyline if OSRM is blocked or offline
        routePolylineRef.current = L.polyline([routeStart, routeEnd], {
          color: '#ef4444',
          weight: 4,
          dashArray: '5, 10',
          opacity: 0.8,
        }).addTo(mapRef.current);

        mapRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });

        // Calculate approximate straight line distance (Harvesine)
        const R = 6371; // Earth radius in km
        const dLat = ((endLat - startLat) * Math.PI) / 180;
        const dLon = ((endLng - startLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((startLat * Math.PI) / 180) *
            Math.cos((endLat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        const durationMins = distanceKm * 1.5; // Guess 40km/h average

        if (onRouteCalculated) {
          onRouteCalculated(distanceKm, durationMins);
        }
      });
  }, [leafletLoaded, mode, routeStart, routeEnd]);

  if (errorState) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 p-6 text-center">
        <span className="text-2xl mb-2">⚠️</span>
        <h4 className="text-xs font-bold uppercase font-mono tracking-wider">Map Configuration Issue</h4>
        <p className="text-xxs text-slate-500 mt-1 max-w-[300px] leading-relaxed">{errorState}</p>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 text-slate-500 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-semibold uppercase tracking-wider font-sans text-indigo-700">Loading interactive openstreetmap...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullScreen ? 'fixed inset-0 z-[99999] bg-slate-900 flex flex-col p-4 md:p-6 overflow-hidden' : 'w-full h-full rounded-2xl overflow-hidden'}`}>
      
      {/* MOBILE FRIENDLY INTERACTIVE TOUCH CONTROLS OVERLAY */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
        {/* Zoom In Button */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-slate-800 hover:text-rose-600 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all pointer-events-auto"
          title="Zoom In"
          style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-slate-800 hover:text-rose-600 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all pointer-events-auto"
          title="Zoom Out"
          style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
        >
          <Minus className="h-5 w-5" />
        </button>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-rose-600 hover:text-rose-750 rounded-xl shadow-lg border border-slate-200 hover:bg-rose-50 active:bg-rose-100 transition-all pointer-events-auto"
          title="My Location"
          style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
        >
          <Compass className="h-5 w-5 animate-pulse" />
        </button>

        {/* Full Screen Button */}
        <button
          type="button"
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-slate-800 hover:text-rose-600 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all pointer-events-auto"
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Map"}
          style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
        >
          {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>

      {isFullScreen && (
        <div className="flex items-center justify-between mb-3 bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 font-sans shadow-md z-[500]">
          <span className="text-xxs font-black uppercase tracking-wider">🗺️ GIS Fullscreen</span>
          <button
            type="button"
            onClick={() => setIsFullScreen(false)}
            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* The Map itself */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-2xl relative shadow-inner overflow-hidden" 
        style={{ 
          minHeight: isFullScreen ? 'calc(100vh - 80px)' : '100%', 
          height: isFullScreen ? 'calc(100vh - 80px)' : '100%',
          maxWidth: '100%'
        }}
      />
    </div>
  );
}

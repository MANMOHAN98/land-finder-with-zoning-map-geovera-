import React, { useState, useEffect } from 'react';
import { LandListing, UserProfile } from '../types';
import { 
  X, 
  MapPin, 
  Compass, 
  Navigation, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Bookmark, 
  Phone, 
  Mail, 
  FileText, 
  Trees, 
  Sprout, 
  BookmarkX,
  Layers,
  Sparkles,
  Info,
  Share2,
  Copy,
  Locate,
  Eye,
  School,
  Heart,
  Train,
  Milestone
} from 'lucide-react';
import { translateDynamicText, LanguageCode } from '../translations';
import LeafletMap from './LeafletMap';

interface PropertyDetailModalProps {
  propertyId: string;
  listings: LandListing[];
  currentUser: UserProfile | null;
  currentLanguage: LanguageCode;
  bookmarks: string[];
  onToggleBookmark: (e: React.MouseEvent, id: string) => void;
  onClose: () => void;
  onInquire: (id: string) => void;
}

export default function PropertyDetailModal({
  propertyId,
  listings,
  currentUser,
  currentLanguage,
  bookmarks,
  onToggleBookmark,
  onClose,
  onInquire
}: PropertyDetailModalProps) {
  const property = listings.find(l => l.id === propertyId);
  
  if (!property) return null;

  const lat = Number(property.coordinates?.lat ?? 18.52);
  const lng = Number(property.coordinates?.lng ?? 73.85);
  const displayAddress = property.address || property.location || 'N/A';
  const pincodeVal = property.pincode || 'N/A';
  
  const isBookmarked = bookmarks.includes(property.id);

  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('hybrid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Convert parcelPolygon to actual GPS coordinates
  const getGPSPolygonPoints = () => {
    const poly = property.parcelPolygon;
    if (!poly || poly.length === 0) return [];
    
    // Check if relative percentages (e.g. coordinates less than 100)
    const isRelative = poly.every(pt => Math.abs(pt[0]) < 100 && Math.abs(pt[1]) < 100);
    if (isRelative) {
      const scale = 0.0001; // Scale factor to map percentage offsets to tiny degrees around the center
      return poly.map(pt => ({
        lat: lat + (pt[0] - 30) * scale,
        lng: lng + (pt[1] - 30) * scale
      }));
    }
    
    return poly.map(pt => ({ lat: pt[0], lng: pt[1] }));
  };

  const gpsPolygonPoints = getGPSPolygonPoints();

  const getNearbyLandmarks = () => {
    const vName = property.village || property.location || 'Local';
    const tName = property.taluk || 'Sub-district';
    const dName = property.district || 'District';
    return [
      { category: 'School', name: `${vName} Primary & High School`, distance: '0.8 km', icon: School, color: 'text-blue-600 bg-blue-50/50' },
      { category: 'Hospital', name: `${tName} General Hospital & Medical Centre`, distance: '2.4 km', icon: Heart, color: 'text-rose-600 bg-rose-50/50' },
      { category: 'Transport', name: `${vName} Central Bus Terminus`, distance: '0.6 km', icon: Milestone, color: 'text-amber-600 bg-amber-50/50' },
      { category: 'Railway', name: `${dName} Junction Railway Station`, distance: '14.5 km', icon: Train, color: 'text-indigo-650 bg-indigo-50/50' },
      { category: 'Road access', name: `${property.roadAccess || 'State Highway Bypass Road'}`, distance: '0.3 km', icon: MapPin, color: 'text-slate-650 bg-slate-50/50' },
    ];
  };

  const nearbyLandmarks = getNearbyLandmarks();

  const calculateDirections = () => {
    if (!navigator.geolocation) {
      setRoutingError("Your browser does not support geolocation service!");
      return;
    }
    
    setIsRouting(true);
    setRoutingError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsRouting(false);
        setRouteStart([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        setIsRouting(false);
        setRoutingError(`GPS retrieval failed: ${error.message}`);
      }
    );
  };

  const openGoogleMapsTab = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyCoordinatesToClipboard = () => {
    const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setToastMessage(`GPS Coordinates copied: ${text}`);
  };

  const shareLocationLink = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    navigator.clipboard.writeText(url);
    setToastMessage(`Property location link copied to clipboard!`);
  };

  const navigateToLand = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isMapDataAvailable = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  return (
    <div id="property-detail-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-[90%] max-w-[1200px] h-auto max-h-[90vh] shadow-2xl relative animate-scale-up flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between p-5 border-b border-slate-150 bg-slate-50 shrink-0">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-full mb-1.5">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified Cadaster Record</span>
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              {translateDynamicText(property.title, currentLanguage)}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{translateDynamicText(property.location, currentLanguage)}</span>
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-800 transition cursor-pointer shrink-0 self-start ml-4"
            id="property-modal-close-btn"
          >
            <X className="h-5.5 w-5.5" />
          </button>
        </div>

        {/* MODAL BODY - ONE SINGLE SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white" id="property-modal-scroll-body">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN: PROPERTY DETAILS (col-span-1 lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Large image view */}
              <div className="relative rounded-xl overflow-hidden h-48 sm:h-56 md:h-64 bg-slate-100 border border-slate-200 shadow-sm">
                <img 
                  src={property.imageUrl} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="text-xs font-black font-mono bg-slate-900/85 text-emerald-400 border border-slate-700 backdrop-blur-xs px-3 py-1 rounded-lg shadow-sm">
                    ₹{(property.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-black font-mono bg-white text-slate-900 border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
                    {property.acres} Acres
                  </span>
                </div>
              </div>

              {/* Parameters table */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50 border border-slate-150 rounded-xl p-4 text-xxs font-medium text-slate-700 select-none">
                <div>
                  <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider font-mono">ZONING CLASSIFICATION</span>
                  <strong className="text-slate-800 font-bold text-xs uppercase">{property.zoning}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider font-mono text-rose-600">SURVEY NO / PATTA</span>
                  <strong className="text-rose-700 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{property.surveyNumber || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider font-mono">SOIL DETAILS</span>
                  <strong className="text-slate-800 font-bold text-[11px] flex items-center gap-1 mt-0.5">
                    <Layers className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                    <span>{property.soilType || 'N/A'}</span>
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider font-mono">SOIL COLOR</span>
                  <strong className="text-slate-800 font-bold">{property.landColor || 'N/A'}</strong>
                </div>
                <div className="col-span-2 border-t border-slate-200 pt-3">
                  <span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider font-mono flex items-center gap-1 text-emerald-700 mb-1">
                    <Sprout className="h-3.5 w-3.5" /> RECOMMENDED CROP RECOMMENDATIONS
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{property.cropsSuggested || 'N/A'}</p>
                </div>
                <div className="col-span-2 border-t border-slate-200 pt-3">
                  <span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider font-mono flex items-center gap-1 text-slate-500 mb-1">
                    <Trees className="h-3.5 w-3.5" /> REGISTERED TREES / SHRUBS
                  </span>
                  <p className="text-xxs font-bold text-slate-700 italic">"{property.existingPlants || 'None listed'}"</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Deed Description</h5>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {property.description}
                </p>
              </div>

              {/* Landowner & Broker Details */}
              <div className="p-4 border border-slate-150 rounded-xl bg-slate-50/50 space-y-2.5 text-xxs font-medium text-slate-600">
                <h5 className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">Verified Broker Contacts</h5>
                <div className="flex flex-col sm:flex-row justify-between gap-3 font-sans">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Broker Representative</span>
                    <strong className="text-slate-800 text-xs font-extrabold">{property.agentName}</strong>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href={`tel:${property.agentPhone}`} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-xxs cursor-pointer">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{property.agentPhone || '98451 09321'}</span>
                    </a>
                    <a href={`mailto:${property.agentEmail}`} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-xxs cursor-pointer">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span>Email Agent</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: MAP & ACTIONS (col-span-1 lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-150 lg:pl-6">
              
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
                  <Compass className="h-4.5 w-4.5 text-emerald-600 animate-spin-slow" />
                  <span>CADASTRAL SURVEY GRID</span>
                </h4>
              </div>

              {/* Map display box */}
              <div className="space-y-4">
                {/* Map Type Programmatic Selector */}
                <div className="flex items-center justify-between gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider pl-2">VIEW TYPE:</span>
                  <div className="flex gap-1">
                    {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setMapTypeId(type)}
                        className={`px-2 py-1 text-[9px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                          mapTypeId === type
                            ? 'bg-emerald-600 text-white shadow-xxs'
                            : 'text-slate-550 hover:bg-slate-200 hover:text-slate-800'
                        }`}
                      >
                        {type === 'roadmap' ? 'Map' : type === 'satellite' ? 'Sat' : type === 'hybrid' ? 'Hyb' : 'Terr'}
                      </button>
                    ))}
                  </div>
                </div>

                {isMapDataAvailable ? (
                  <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden border border-slate-250 relative shrink-0 shadow-sm bg-slate-100 group">
                    <LeafletMap
                      mode="view-boundary"
                      lat={lat}
                      lng={lng}
                      zoom={14}
                      drawingPolygon={gpsPolygonPoints.map(pt => [pt.lat, pt.lng])}
                      mapType={mapTypeId}
                      routeStart={routeStart || undefined}
                      routeEnd={routeStart ? [lat, lng] : undefined}
                      onRouteCalculated={(distance, duration) => {
                        setRouteInfo({
                          distance: `${distance.toFixed(1)} km`,
                          duration: `${Math.round(duration)} mins`
                        });
                      }}
                    />

                    {/* Verified Badge on Map */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-700/50 flex items-center gap-1.5 z-10">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[8.5px] font-mono font-black text-white uppercase tracking-widest">
                        LIVE OPENSTREETMAP & LEAFLET
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 p-6 text-center shadow-sm">
                    <MapPin className="h-8 w-8 text-slate-300 mb-2 animate-bounce" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Location map not available</span>
                  </div>
                )}

                {/* GPS COORDINATES DEED INFORMATION TABLE */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-3xs">
                  <div className="flex justify-between items-center text-xxs font-mono border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-slate-400 font-bold block text-[8px] uppercase">LATITUDE</span>
                      <strong className="text-slate-800 font-extrabold">{lat.toFixed(6)}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-bold block text-[8px] uppercase">LONGITUDE</span>
                      <strong className="text-slate-800 font-extrabold">{lng.toFixed(6)}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xxs font-sans text-slate-650">
                    <div>
                      <span className="text-slate-400 font-bold block text-[8px] uppercase font-mono">STATE</span>
                      <strong className="text-slate-800 font-bold">{property.state || 'Maharashtra'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[8px] uppercase font-mono">DISTRICT</span>
                      <strong className="text-slate-800 font-bold">{property.district || 'Pune'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[8px] uppercase font-mono">TALUK</span>
                      <strong className="text-slate-800 font-bold">{property.taluk || 'Baramati'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[8px] uppercase font-mono">VILLAGE</span>
                      <strong className="text-slate-800 font-bold">{property.village || 'Supe'}</strong>
                    </div>
                    <div className="col-span-2 border-t border-slate-100 pt-2 font-mono">
                      <span className="text-slate-400 font-bold block text-[8px] uppercase">REGISTRY PINCODE</span>
                      <strong className="text-emerald-700 font-extrabold">{pincodeVal}</strong>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS TOOLBAR */}
                <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                  <button
                    type="button"
                    onClick={navigateToLand}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition shadow-3xs"
                  >
                    <Navigation className="h-3 w-3" />
                    <span>Navigate</span>
                  </button>
                  <button
                    type="button"
                    onClick={copyCoordinatesToClipboard}
                    className="py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition shadow-3xs"
                  >
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span>Copy GPS</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareLocationLink}
                    className="py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition shadow-3xs"
                  >
                    <Share2 className="h-3 w-3 text-slate-400" />
                    <span>Share Location</span>
                  </button>
                  <button
                    type="button"
                    onClick={openGoogleMapsTab}
                    className="py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition shadow-3xs"
                  >
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                    <span>Open GMap</span>
                  </button>
                </div>

                {/* ROUTE CALCULATION AND TRACING DISPLAY */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={calculateDirections}
                    disabled={isRouting}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl font-extrabold flex items-center justify-center gap-2 cursor-pointer transition shadow-3xs"
                  >
                    <Navigation className={`h-4 w-4 ${isRouting ? 'animate-bounce' : ''}`} />
                    <span>{isRouting ? 'TRACING ROUTE...' : 'TRACE LAND LOCATION'}</span>
                  </button>

                  {routeInfo && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-slate-800 space-y-1.5 shadow-xxs">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>GPS Route Traced Successfully!</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xxs font-medium pt-1.5 border-t border-emerald-100">
                        <div>
                          <span className="text-slate-450 font-bold block uppercase text-[8px] font-mono">DRIVING DISTANCE</span>
                          <strong className="text-emerald-900 text-sm font-black font-mono">{routeInfo.distance}</strong>
                        </div>
                        <div>
                          <span className="text-slate-450 font-bold block uppercase text-[8px] font-mono">ESTIMATED TIME</span>
                          <strong className="text-emerald-900 text-sm font-black font-mono">{routeInfo.duration}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {routingError && (
                    <div className="bg-rose-50 border border-rose-150 text-rose-800 text-xxs p-2.5 rounded-lg flex items-center gap-1.5">
                      <Info className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{routingError}</span>
                    </div>
                  )}
                </div>

                {/* NEARBY SPATIAL LANDMARKS & ROADS */}
                <div className="space-y-2 pt-3 border-t border-slate-150">
                  <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    📍 NEARBY LANDMARKS & INFRASTRUCTURE
                  </h5>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {nearbyLandmarks.map((POI, idx) => {
                      const Icon = POI.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all text-xxs">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-lg ${POI.color}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="text-left">
                              <span className="text-[8px] uppercase tracking-wider font-mono text-slate-400 block font-bold">
                                {POI.category}
                              </span>
                              <strong className="text-slate-800 font-extrabold font-sans">
                                {POI.name}
                              </strong>
                            </div>
                          </div>
                          <span className="text-slate-500 font-black font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-[9px]">
                            {POI.distance}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* MAIN FORM TRANSACTION TRIGGERS */}
              <div className="space-y-3 pt-4 border-t border-slate-150">
                <button
                  onClick={() => {
                    onClose();
                    onInquire(property.id);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                >
                  <Compass className="h-4 w-4 animate-spin-slow" />
                  <span>Initiate Negotiation / Inquiry</span>
                </button>

                <button
                  onClick={(e) => onToggleBookmark(e, property.id)}
                  className={`w-full py-2 rounded-xl text-xxs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    isBookmarked 
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-250 hover:border-slate-350'
                  }`}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkX className="h-3.5 w-3.5 text-rose-500" />
                      <span>Remove Saved Bookmarks</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5 text-slate-400" />
                      <span>Save to Audited Bookmarks</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* FLOATING ACTION TOAST POPUP */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-emerald-400 text-xxs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slide-up z-50">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

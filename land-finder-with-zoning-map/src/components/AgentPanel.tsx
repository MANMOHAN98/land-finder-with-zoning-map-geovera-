import React, { useState, useEffect, useRef } from 'react';
import { LandListing, InquiryMessage, ZoningCode, UserProfile } from '../types';
import { ZONING_RULES, formatCurrency } from '../data';
import { LanguageCode, translateDynamicText, TRANSLATIONS } from '../translations';

import {   Plus, 
  Trash2, 
  Inbox, 
  Check, 
  X, 
  DollarSign, 
  Compass, 
  FileText, 
  Tag, 
  MessageSquare,
  Sparkles,
  RefreshCcw,
  UserCheck,
  Users,
  Edit3,
  Undo,
  MapPin,
  RotateCcw,
  School,
  Heart,
  Train,
  Milestone
} from 'lucide-react';
import LeafletMap from './LeafletMap';

interface AgentPanelProps {
  currentAgent: UserProfile;
  listings: LandListing[];
  messages: InquiryMessage[];
  onAddListing: (newListing: LandListing) => void;
  onUpdateListing: (updatedListing: LandListing) => void;
  onDeleteListing: (id: string) => void;
  onUpdateMessageStatus: (messageId: string, status: 'accepted' | 'rejected' | 'countered', agentResponse?: string) => void;
  currentLanguage?: LanguageCode;
  forcedTab?: 'listings' | 'inbound' | 'create' | null;
  activeMainView?: string;
  onNavigateToCreate?: () => void;
  onNavigateToListings?: () => void;
  loginLogs?: any[];
  lastLoginTime?: string;
  lastLogoutTime?: string;
}

const LAND_PRESETS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // meadow
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // hazelnut field
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // downtown
  'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'  // corner lot
];

export default function AgentPanel({
  currentAgent,
  listings,
  messages,
  onAddListing,
  onUpdateListing,
  onDeleteListing,
  onUpdateMessageStatus,
  currentLanguage = 'EN',
  forcedTab,
  activeMainView,
  onNavigateToCreate,
  onNavigateToListings,
  loginLogs = [],
  lastLoginTime = '-',
  lastLogoutTime = '-'
}: AgentPanelProps) {
  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  const [activeTab, setActiveTabState] = useState<'listings' | 'inbound' | 'create'>('listings');
  const activeTabVal = forcedTab || (activeMainView === 'seller-add-property' ? 'create' : activeMainView === 'seller-listings' ? 'listings' : activeMainView === 'seller-leads' || activeMainView === 'seller-messages' ? 'inbound' : activeTab);

  const setActiveTab = (tab: 'listings' | 'inbound' | 'create') => {
    setActiveTabState(tab);
  };

  React.useEffect(() => {
    if (forcedTab) {
      setActiveTabState(forcedTab);
    }
  }, [forcedTab]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Clear notifications automatically
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Create state form - Indian local real estate fields
  const [title, setTitle] = useState('');
  const [areaName, setAreaName] = useState(''); // Compulsory area name
  const [locationPresel, setLocationPresel] = useState('Lonavala Slopes, Pune');
  const [customLoc, setCustomLoc] = useState('');
  const [location, setLocation] = useState('Lonavala Slopes, Pune');
  const [county, setCounty] = useState('Pune District');
  const [price, setPrice] = useState<number>(3500000); // Base price in Rupees
  const [acres, setAcres] = useState<number>(2.5); // Compulsory acres
  const [zoning, setZoning] = useState<ZoningCode>('AGRI'); // General zoning

  // Hierarchical Indian Geography States: State, District, Taluk, Village
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedTaluk, setSelectedTaluk] = useState('Haveli');
  const [selectedVillage, setSelectedVillage] = useState('Manjari');
  
  // Custom compulsory fields requested by the user:
  const [landType, setLandType] = useState('Wet Agricultural Land (Irrigated)'); // Compulsory type of land
  const [soilType, setSoilType] = useState('Alluvial Rich Clay Loam'); // Compulsory type of soil
  const [cropsSuggested, setCropsSuggested] = useState('Paddy, Sugarcane, Cotton'); // Compulsory crops suitable
  const [existingPlants, setExistingPlants] = useState('12 Coconut trees, 3 Mango trees'); // Compulsory trees list
  const [lat, setLat] = useState<number>(18.52);
  const [lng, setLng] = useState<number>(73.85);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [imageUrl, setImageUrl] = useState(''); // Photo can be optional file/input
  const [videoUrl, setVideoUrl] = useState(''); // Video can be optional file/input
  
  // Extra detailed land states requested by user
  const [landColor, setLandColor] = useState('Reddish Brown Loam');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [treesCount, setTreesCount] = useState('');
  
  const [description, setDescription] = useState('');
  const [waterSource, setWaterSource] = useState('Connected irrigation canal + Submersible Borewell');
  const [electricity, setElectricity] = useState('3-Phase agricultural feeder lines active');
  const [roadAccess, setRoadAccess] = useState('12-meter wide asphalt village road access');
  const [hasSoilTest, setHasSoilTest] = useState(true);
  const [hasSurvey, setHasSurvey] = useState(true);
  const [presetImageIdx, setPresetImageIdx] = useState(0);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [drawingPolygon, setDrawingPolygon] = useState<[number, number][]>([]);
  const [sellerMapTypeId, setSellerMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('hybrid');
  const [mapClickMode, setMapClickMode] = useState<'pin' | 'boundary'>('pin');

  const getCalculatedArea = () => {
    if (drawingPolygon.length < 3) return null;
    
    // Shoelace formula in Square Meters
    let area = 0;
    const R = 6378137; // Earth radius in meters
    const len = drawingPolygon.length;
    
    for (let i = 0; i < len; i++) {
      const p1 = drawingPolygon[i];
      const p2 = drawingPolygon[(i + 1) % len];
      
      const x1 = p1[1] * Math.PI / 180 * R * Math.cos(p1[0] * Math.PI / 180);
      const y1 = p1[0] * Math.PI / 180 * R;
      const x2 = p2[1] * Math.PI / 180 * R * Math.cos(p2[0] * Math.PI / 180);
      const y2 = p2[0] * Math.PI / 180 * R;
      
      area += (x1 * y2 - x2 * y1);
    }
    
    const sqMeters = Math.abs(area / 2);
    const acresVal = sqMeters / 4046.85642;
    const hectaresVal = sqMeters / 10000;
    const sqFeetVal = sqMeters * 10.7639104;
    const guntasVal = acresVal * 40;
    
    return {
      sqMeters,
      acres: acresVal,
      hectares: hectaresVal,
      sqFeet: sqFeetVal,
      guntas: guntasVal
    };
  };

  const calculatedArea = getCalculatedArea();

  const handleStartEdit = (lst: LandListing) => {
    setEditingId(lst.id);
    setTitle(lst.title);
    setAreaName(lst.areaName || '');
    setDescription(lst.description || '');
    setPrice(lst.price);
    setAcres(lst.acres);
    setZoning(lst.zoning);
    setSelectedState(lst.state || '');
    setSelectedDistrict(lst.district || '');
    setSelectedTaluk(lst.taluk || '');
    setSelectedVillage(lst.village || '');
    setLandType(lst.landType || '');
    setSoilType(lst.soilType || '');
    setCropsSuggested(lst.cropsSuggested || '');
    setExistingPlants(lst.existingPlants || '');
    setLandColor(lst.landColor || '');
    setSurveyNumber(lst.surveyNumber || '');
    setOwnerName(lst.ownerName || '');
    setTreesCount(lst.treesCount || '');
    setWaterSource(lst.waterSource || 'Connected irrigation canal + Submersible Borewell');
    setElectricity(lst.electricity || '3-Phase agricultural feeder lines active');
    setRoadAccess(lst.roadAccess || '12-meter wide asphalt village road access');
    setHasSoilTest(lst.hasSoilTest ?? true);
    setHasSurvey(lst.hasSurvey ?? true);
    setImageUrl(lst.imageUrl || '');
    setVideoUrl(lst.videoUrl || '');
    setLat(lst.coordinates?.lat ?? 18.52);
    setLng(lst.coordinates?.lng ?? 73.85);
    setAddress(lst.address ?? lst.location ?? '');
    setPincode(lst.pincode ?? '');
    setDrawingPolygon(lst.parcelPolygon || []);
    setActiveTab('create');
    if (onNavigateToCreate) {
      onNavigateToCreate();
    }
  };

  const agentListings = listings.filter(l => l.agentId === currentAgent.id);
  const agentMessages = messages.filter(m => m.agentId === currentAgent.id);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const finalState = selectedState;
    const finalDistrict = selectedDistrict;
    const finalTaluk = selectedTaluk;
    const finalVillage = selectedVillage;

    if (!finalState || !finalDistrict || !finalTaluk || !finalVillage) {
      setNotification({ type: 'error', message: 'All location fields are required: State, District, Taluk and Village Name!' });
      return;
    }

    const finalLocation = `${finalVillage}, ${finalTaluk}, ${finalDistrict}, ${finalState}`;
    const finalAreaName = `${finalVillage} Village`;
    const finalCounty = `${finalDistrict} District`;

    // Automatically construct a professional property title from the specifications
    const finalTitle = title.trim() || `${acres} Acres ${landType} at Survey No. ${surveyNumber}`;

    if (!finalTitle || !acres || !landType || !cropsSuggested || !surveyNumber || !ownerName) {
      setNotification({ type: 'error', message: 'All compulsory marked (*) fields are required: please provide Acres, Type of land, Soil details, Crops suitable, Survey Number, and Landowner Name!' });
      return;
    }

    // Duplicate check: survey number + village + state
    const isDuplicate = listings.some(item => {
      // If we are editing, ignore the currently edited parcel ID
      if (editingId && item.id === editingId) return false;
      return item.surveyNumber && item.surveyNumber.trim().toLowerCase() === surveyNumber.trim().toLowerCase() &&
             item.village && item.village.trim().toLowerCase() === finalVillage.trim().toLowerCase() &&
             item.state && item.state.trim().toLowerCase() === finalState.trim().toLowerCase();
    });

    if (isDuplicate) {
      setNotification({ type: 'error', message: `Duplicate registration alert: Survey Number "${surveyNumber}" is already registered in ${finalVillage} Village!` });
      return;
    }

    // Give fallback photo and video if the optional fields are left blank
    let finalImageUrl = imageUrl;
    if (!finalImageUrl) {
      // Pick a random fallback from LAND_PRESETS
      finalImageUrl = LAND_PRESETS[Math.floor(Math.random() * LAND_PRESETS.length)];
    }

    let finalVideoUrl = videoUrl;
    if (!finalVideoUrl) {
      finalVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-green-wheat-fields-41624-large.mp4';
    }

    const generateDefaultPolygon = (centerLat: number, centerLng: number, sizeAcres: number) => {
      const scale = 0.00015 + Math.min(sizeAcres * 0.00005, 0.001);
      return [
        [centerLat - scale, centerLng - scale],
        [centerLat + scale, centerLng - scale],
        [centerLat + scale, centerLng + scale],
        [centerLat - scale, centerLng + scale]
      ] as [number, number][];
    };

    if (editingId) {
      // Edit mode: find and update
      const existingListing = listings.find(l => l.id === editingId);
      if (existingListing) {
        const updatedListing: LandListing = {
          ...existingListing,
          title: finalTitle,
          location: finalLocation,
          areaName: finalAreaName,
          county: finalCounty,
          price: Number(price),
          acres: Number(acres),
          zoning,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl,
          description: description || `Prime ${landType} with fertile soil located at ${finalLocation}. Suitable crops: ${cropsSuggested}.`,
          coordinates: { lat: Number(lat), lng: Number(lng) },
          address,
          pincode,
          parcelPolygon: drawingPolygon.length > 2 ? drawingPolygon : (existingListing.parcelPolygon || generateDefaultPolygon(Number(lat), Number(lng), Number(acres))),
          landType,
          soilType,
          landColor,
          cropsSuggested,
          existingPlants: existingPlants || treesCount || 'None',
          surveyNumber,
          ownerName,
          treesCount,
          state: finalState,
          district: finalDistrict,
          taluk: finalTaluk,
          village: finalVillage,
          waterSource,
          electricity,
          roadAccess,
          hasSoilTest,
          hasSurvey,
        };
        onUpdateListing(updatedListing);
        setNotification({ type: 'success', message: `Successfully updated parcel details for "${finalTitle}"!` });
      }
    } else {
      // Create mode
      const finalPolygon = drawingPolygon.length > 2 
        ? drawingPolygon 
        : generateDefaultPolygon(Number(lat), Number(lng), Number(acres));

      const newListing: LandListing = {
        id: `L-${Math.floor(Math.random() * 900) + 100}`,
        title: finalTitle,
        location: finalLocation,
        areaName: finalAreaName,
        county: finalCounty,
        price: Number(price),
        acres: Number(acres),
        zoning,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        description: description || `Prime ${landType} with fertile soil located at ${finalLocation}. Suitable crops: ${cropsSuggested}.`,
        coordinates: { lat: Number(lat), lng: Number(lng) },
        address,
        pincode,
        parcelPolygon: finalPolygon,
        agentId: currentAgent.id,
        agentName: currentAgent.name,
        agentPhone: currentAgent.agentPhone || '98451 09321',
        agentEmail: currentAgent.email,
        landType,
        soilType,
        landColor,
        cropsSuggested,
        existingPlants: existingPlants || treesCount || 'None',
        surveyNumber,
        ownerName,
        treesCount,
        state: finalState,
        district: finalDistrict,
        taluk: finalTaluk,
        village: finalVillage,
        waterSource,
        electricity,
        roadAccess,
        hasSoilTest,
        hasSurvey,
        hub: 'INDIA',
        isUserAdded: true,
        status: 'approved'
      };

      onAddListing(newListing);
      setNotification({ type: 'success', message: `Successfully listed new Land Parcel: "${finalTitle}"` });
    }

    // Reset Form & Editing State
    setEditingId(null);
    setTitle('');
    setAreaName('');
    setDescription('');
    setPrice(3500000);
    setAcres(2.5);
    setSurveyNumber('');
    setOwnerName('');
    setTreesCount('');
    setLandColor('Reddish Brown Loam');
    setImageUrl('');
    setVideoUrl('');
    setActiveTab('listings');
    if (onNavigateToListings) {
      onNavigateToListings();
    }
  };

  const handleMapSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const results = await response.json();
      if (results && results.length > 0) {
        const first = results[0];
        const newLat = parseFloat(first.lat);
        const newLng = parseFloat(first.lon);
        setLat(newLat);
        setLng(newLng);
        setZoomLevel(17);
        
        setAddress(first.display_name);
        
        const addr = first.address || {};
        const stateName = addr.state || '';
        const districtName = addr.county || addr.district || '';
        const talukName = addr.suburb || addr.city_district || '';
        const villageName = addr.village || addr.town || addr.city || addr.suburb || '';
        const zip = addr.postcode || '';
        
        if (stateName) setSelectedState(stateName);
        if (districtName) setSelectedDistrict(districtName);
        if (talukName) setSelectedTaluk(talukName);
        if (villageName) setSelectedVillage(villageName);
        if (zip) setPincode(zip);
        
        setNotification({ type: 'success', message: `Found location: ${first.display_name}` });
      } else {
        setNotification({ type: 'error', message: 'Location not found. Please enter a valid address, village, city, or pincode.' });
      }
    } catch (err: any) {
      console.error(err);
      setNotification({ type: 'error', message: `Search error: ${err.message || err}` });
    }
  };

  const handleManualLocationSearch = async () => {
    const queryParts = [];
    if (selectedVillage) queryParts.push(selectedVillage);
    if (selectedTaluk) queryParts.push(selectedTaluk);
    if (selectedDistrict) queryParts.push(selectedDistrict);
    if (selectedState) queryParts.push(selectedState);
    if (pincode) queryParts.push(pincode);

    const manualQuery = queryParts.join(', ');
    if (!manualQuery.trim()) {
      setNotification({ type: 'error', message: 'Please enter at least State, District, Taluk, or Village name to search.' });
      return;
    }

    setSearchQuery(manualQuery);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualQuery)}&addressdetails=1&limit=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const results = await response.json();
      if (results && results.length > 0) {
        const first = results[0];
        const newLat = parseFloat(first.lat);
        const newLng = parseFloat(first.lon);
        setLat(newLat);
        setLng(newLng);
        setZoomLevel(17);
        
        setAddress(first.display_name);
        
        const addr = first.address || {};
        const stateName = addr.state || '';
        const districtName = addr.county || addr.district || '';
        const talukName = addr.suburb || addr.city_district || '';
        const villageName = addr.village || addr.town || addr.city || addr.suburb || '';
        const zip = addr.postcode || '';
        
        if (stateName) setSelectedState(stateName);
        if (districtName) setSelectedDistrict(districtName);
        if (talukName) setSelectedTaluk(talukName);
        if (villageName) setSelectedVillage(villageName);
        if (zip) setPincode(zip);
        
        setNotification({ type: 'success', message: `Found manual location: ${first.display_name}` });
      } else {
        setNotification({ type: 'error', message: 'Location not found. Please enter a valid address, village, city, or pincode.' });
      }
    } catch (err: any) {
      console.error(err);
      setNotification({ type: 'error', message: `Search error: ${err.message || err}` });
    }
  };

  const updateLocationAndGeocode = async (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        const addr = data.address || {};
        const stateName = addr.state || '';
        const districtName = addr.county || addr.district || '';
        const talukName = addr.suburb || addr.city_district || '';
        const villageName = addr.village || addr.town || addr.city || addr.suburb || '';
        const zip = addr.postcode || '';

        if (stateName) setSelectedState(stateName);
        if (districtName) setSelectedDistrict(districtName);
        if (talukName) setSelectedTaluk(talukName);
        if (villageName) setSelectedVillage(villageName);
        if (zip) setPincode(zip);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      setNotification({ type: 'error', message: 'Geolocation is not supported by your browser!' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setLat(newLat);
        setLng(newLng);
        setZoomLevel(16);
        
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&addressdetails=1`;
          const response = await fetch(url, {
            headers: {
              'Accept-Language': 'en'
            }
          });
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
            const addr = data.address || {};
            const stateName = addr.state || '';
            const districtName = addr.county || addr.district || '';
            const talukName = addr.suburb || addr.city_district || '';
            const villageName = addr.village || addr.town || addr.city || addr.suburb || '';
            const zip = addr.postcode || '';

            if (stateName) setSelectedState(stateName);
            if (districtName) setSelectedDistrict(districtName);
            if (talukName) setSelectedTaluk(talukName);
            if (villageName) setSelectedVillage(villageName);
            if (zip) setPincode(zip);
            setNotification({ type: 'success', message: 'Current GPS position loaded and reverse-geocoded!' });
          } else {
            setNotification({ type: 'success', message: `Current GPS coordinates loaded: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}` });
          }
        } catch (err) {
          console.error(err);
          setNotification({ type: 'success', message: `Current GPS coordinates loaded: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}` });
        }
      },
      (error) => {
        setNotification({ type: 'error', message: `Geolocation error: ${error.message}` });
      }
    );
  };

  const handleResponseSubmit = (msgId: string, status: 'accepted' | 'rejected' | 'countered') => {
    onUpdateMessageStatus(msgId, status, responseTexts[msgId] || '');
  };

  // ----------------------------------------------------
  // SUB-PAGE HELPER RENDERERS FOR INDEPENDENT ROUTES
  // ----------------------------------------------------

  const renderSellerDashboard = () => {
    const totalValuation = agentListings.reduce((sum, l) => sum + l.price, 0);
    const totalAcres = agentListings.reduce((sum, l) => sum + l.acres, 0);
    const totalOffers = agentMessages.filter(m => m.type === 'offer').length;
    const totalInquiries = agentMessages.filter(m => m.type === 'general').length;

    return (
      <div className="space-y-6 animate-fade-in font-sans">
        {/* Metric Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Active Holdings</span>
              <strong className="text-2xl font-black text-slate-800 font-display block mt-1">{agentListings.length} Tracts</strong>
              <span className="text-xxs text-emerald-600 font-bold block mt-0.5">✓ 100% On-grid Registered</span>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
              <Compass className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Portfolio Valuation</span>
              <strong className="text-2xl font-black text-slate-800 font-display block mt-1">
                {totalValuation >= 10000000 ? `₹${(totalValuation / 10000000).toFixed(2)} Cr` : `₹${(totalValuation / 100000).toFixed(1)} L`}
              </strong>
              <span className="text-xxs text-slate-500 font-semibold block mt-0.5">Average: ₹{(totalValuation / (agentListings.length || 1) / 100000).toFixed(0)} Lakhs/tract</span>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Total Area Registered</span>
              <strong className="text-2xl font-black text-slate-800 font-display block mt-1">{totalAcres.toFixed(2)} Acres</strong>
              <span className="text-xxs text-teal-600 font-bold block mt-0.5">{(totalAcres * 0.4046).toFixed(2)} Hectares total</span>
            </div>
            <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700">
              <MapPin className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-3xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Active Negotiations</span>
              <strong className="text-2xl font-black text-slate-800 font-display block mt-1">{totalOffers} Bids</strong>
              <span className="text-xxs text-sky-600 font-bold block mt-0.5">{totalInquiries} General inquiries</span>
            </div>
            <div className="h-10 w-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Graph (Exquisite SVG Curve) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">📊 Buyer Views & Impression Trends</h4>
              <p className="text-[10px] text-slate-550">Dynamic unique pageviews and inquiry responses for listed cadastral parcels.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded text-[9px] font-mono font-bold uppercase animate-pulse">
              ● Live Feed Active
            </span>
          </div>

          <div className="relative h-48 w-full border border-slate-100 rounded-xl bg-slate-50/40 p-3 flex flex-col justify-between">
            {/* SVG Graph rendering */}
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Curves Area */}
              <path d="M 0 120 Q 80 50 160 85 T 320 30 T 420 45 T 500 120 Z" fill="url(#chartGrad)" />
              <path d="M 0 120 Q 80 50 160 85 T 320 30 T 420 45 T 500 40" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Interaction Dots */}
              <circle cx="160" cy="85" r="4" fill="#047857" className="animate-ping" />
              <circle cx="160" cy="85" r="3" fill="#10b981" />
              <circle cx="320" cy="30" r="4" fill="#047857" className="animate-ping" />
              <circle cx="320" cy="30" r="3" fill="#10b981" />
            </svg>
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-1 uppercase">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY (Peak)</span>
              <span>JUN (Today)</span>
            </div>
          </div>
        </div>

        {/* Live Ground Verification status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">🛰️ Ground-Truth Satellite Verification Progress</h4>
          {agentListings.length === 0 ? (
            <p className="text-xxs text-slate-500 italic">No tracts registered yet to initiate GIS verification logs.</p>
          ) : (
            <div className="border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-100 text-xxs">
              {agentListings.map(lst => (
                <div key={lst.id} className="p-3 bg-slate-50/50 flex justify-between items-center gap-4">
                  <div className="space-y-0.5">
                    <strong className="text-slate-800 font-bold block">{lst.title}</strong>
                    <span className="text-slate-500 block font-mono">Survey No: {lst.surveyNumber || 'N/A'} • {lst.acres} Ac • Soil: {lst.soilType || 'Loamy Red'}</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-855 border border-emerald-250 font-bold font-mono text-[9px] px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Verified Land Coordinates
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSellerProfile = () => {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-3xs">
          <div className="h-16 w-16 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white font-display text-2xl font-black shadow-md shrink-0">
            {currentAgent.name?.charAt(0) || 'S'}
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h4 className="text-lg font-black text-slate-900 tracking-tight font-display">{currentAgent.name}</h4>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200/50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Verified Surveyor
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono font-bold">{currentAgent.email}</p>
            <p className="text-xxs text-slate-450 leading-relaxed font-medium">Verified Registration License active since 2024. Authority: National Land Cadaster System.</p>
          </div>
        </div>

        {/* Surveyor Credentials */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">📋 Official Registration Parameters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <span className="text-slate-400 block font-mono text-[9px] uppercase font-bold tracking-wider mb-1">State Certification Registry</span>
              <strong className="text-slate-850">LRS-MH-9023-B920</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <span className="text-slate-400 block font-mono text-[9px] uppercase font-bold tracking-wider mb-1">Operating Territory Hub</span>
              <strong className="text-slate-850">Maharashtra State, Pune / Lonavala Division</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl col-span-1 sm:col-span-2">
              <span className="text-slate-400 block font-mono text-[9px] uppercase font-bold tracking-wider mb-1">National Cadastral Survey Scope</span>
              <strong className="text-slate-850">Permitted for Satellite Ground-Truth Polygon Mapping, Soil Core Integrity Inspections, and Crop Capability Diagnostics</strong>
            </div>
          </div>
        </div>

        {/* Security Login History logs list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">🔒 Secure Activity & Logins Audit</h4>
          <p className="text-xxs text-slate-500">Chronological history of successful surveyor authentication logs recorded in browser session storage.</p>
          {loginLogs.length === 0 ? (
            <div className="p-3 bg-slate-55 rounded-lg border text-center text-xxs font-mono text-slate-450 italic">
              No recent logs stored. Currently online under temporary active session token.
            </div>
          ) : (
            <div className="border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-100 text-xxs font-mono">
              {loginLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="p-3 bg-slate-50/50 flex justify-between items-center flex-wrap gap-2 text-slate-600">
                  <span>ID: <strong className="text-slate-800">{log.id}</strong> • Method: {log.method}</span>
                  <span className="text-slate-500">{new Date(log.loginTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSellerSettings = () => {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">🔔 Push Notification & Bid Alert Settings</h4>
          <div className="space-y-3.5">
            <label className="flex items-start gap-3 text-xs text-slate-650 font-semibold cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="h-4 w-4 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
              <div>
                <strong className="text-slate-800 block">Instant Purchase Bids Notification</strong>
                <span className="text-xxs text-slate-500 font-medium block">Receive desktop sound notifications whenever a buyer places a cash offer on your registered land plots.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-xs text-slate-650 font-semibold cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="h-4 w-4 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
              <div>
                <strong className="text-slate-800 block">SMS Notification Backup</strong>
                <span className="text-xxs text-slate-500 font-medium block">Transmit fallback transactional SMS notifications for critical planning permission updates and land verification events.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-xs text-slate-650 font-semibold cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="h-4 w-4 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
              <div>
                <strong className="text-slate-800 block">Satellite Re-scan Reminders</strong>
                <span className="text-xxs text-slate-500 font-medium block">Remind periodically of cloud cover status before requesting official cadastral blueprint polygon re-scans.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Measurement Preferences settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">📏 Land Metric Measurement Preferences</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <span className="text-slate-450 block font-mono text-[9px] uppercase font-bold tracking-wider">Primary Area Unit</span>
              <select className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-lg p-2.5 outline-none font-medium">
                <option value="Acres">Acres (Standard National Cadaster Registry)</option>
                <option value="Hectares">Hectares (Government Agriculture Form)</option>
                <option value="Bighas">Bighas (Local Regional Measurement)</option>
                <option value="SqFt">Square Feet (Residential/Industrial Plots)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-450 block font-mono text-[9px] uppercase font-bold tracking-wider">Coordinate Projection Standard</span>
              <select className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-lg p-2.5 outline-none font-medium">
                <option value="Decimal">WGS 84 (Decimal Degrees: 18.52044)</option>
                <option value="DMS">Degrees-Minutes-Seconds (18° 31' N)</option>
                <option value="Chains">Survey Chains / Links (Historic Standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaflet/OSRM Configuration Check */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">📡 OpenStreetMap & Leaflet CAD GIS Engine</h4>
          <div className="p-4 rounded-xl border flex items-start gap-3.5 bg-emerald-50 border-emerald-200 text-emerald-900">
            <span className="text-lg shrink-0 mt-0.5">🟢</span>
            <div className="space-y-1">
              <strong className="text-xs block">Active Cadastral GIS Engine Connected</strong>
              <p className="text-xxs leading-relaxed font-semibold">
                Your browser is successfully connected to the OpenStreetMap Leaflet mapping network. Fully interactive drag-and-drop boundary sketching, real-time Guntha/Acre calculations, and live route tracing are 100% active.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMyListings = () => {
    return (
      <div className="space-y-4 animate-fade-in font-sans">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">🚜 Real Registered Land Parcels Portfolio</h4>
            <p className="text-[10px] text-slate-500">Update Soil specifications, trees, and visual coordinates or add new boundary polygon drawings.</p>
          </div>
          <button
            onClick={() => {
              setActiveTab('create');
              if (onNavigateToCreate) onNavigateToCreate();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Parcel</span>
          </button>
        </div>

        {agentListings.length === 0 ? (
          <div className="text-center py-14 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 shadow-inner">
            <Compass className="h-10 w-10 text-slate-400 mx-auto" />
            <h4 className="text-slate-800 text-sm font-bold">No Registered Tracts Found</h4>
            <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto">To list your first crops capability, Patta registration credentials, or trace visual GIS boundary maps, please open the Add Land tab.</p>
            <button
              onClick={() => {
                setActiveTab('create');
                if (onNavigateToCreate) onNavigateToCreate();
              }}
              className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs"
            >
              Add First Tract
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentListings.map(lst => (
              <div key={lst.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-3xs">
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="text-xxs font-mono text-slate-450 uppercase font-bold bg-white px-2 py-0.5 rounded border border-slate-150 shadow-xxs">REG: {lst.surveyNumber || lst.id}</span>
                    <span 
                      className="text-[9px] font-extrabold px-2 py-0.5 rounded text-white shadow-xs" 
                      style={{ backgroundColor: ZONING_RULES[lst.zoning]?.color }}
                    >
                      {lst.zoning}
                    </span>
                  </div>
                  <h5 className="text-xs font-black text-slate-800 line-clamp-1 uppercase">
                    {translateDynamicText(lst.title, currentLanguage)}
                  </h5>
                  <span className="text-[10px] text-slate-550 flex items-center gap-1 mt-1 font-semibold">
                    📍 {translateDynamicText(lst.location, currentLanguage)}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono text-slate-500 border-t border-slate-200/60 pt-3">
                    <span>Acreage: <strong className="text-slate-800 font-bold block">{lst.acres} Ac</strong></span>
                    <span>Price: <strong className="text-slate-850 font-bold block">{formatCurrency(lst.price, 'INDIA')}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4.5">
                  <button
                    id={`edit-listing-btn-${lst.id}`}
                    onClick={() => handleStartEdit(lst)}
                    className="py-1.5 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xxs font-sans"
                  >
                    <Edit3 className="h-3 w-3 text-slate-500" />
                    Edit Details
                  </button>
                  <button
                    id={`delete-listing-btn-${lst.id}`}
                    onClick={() => {
                      if (confirm(`Are you sure you want to revoke and delete your listed land parcel "${lst.title}" (Survey: ${lst.surveyNumber})?`)) {
                        onDeleteListing(lst.id);
                        setNotification({ type: 'success', message: `Successfully deleted and revoked listed land parcel "${lst.title}"!` });
                      }
                    }}
                    className="py-1.5 border border-rose-100 hover:border-rose-300 text-rose-700 hover:bg-rose-50 text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
                  >
                    <Trash2 className="h-3 w-3" />
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInboundLeads = (filterType: 'offer' | 'general') => {
    const filteredMessages = agentMessages.filter(m => m.type === filterType);

    return (
      <div className="space-y-4 animate-fade-in font-sans">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {filterType === 'offer' ? '📥 Cash Bids & Transaction Proposals' : '✉️ Zoning & General Inquiries'}
          </h4>
          <p className="text-[10px] text-slate-500">Review, counter, accept, or decline inquiries made on your active registered property listings.</p>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="text-center py-14 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 shadow-inner">
            <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
            <h4 className="text-slate-800 text-sm font-bold">Negotiation pipeline is empty</h4>
            <p className="text-xs text-slate-505 leading-normal max-w-sm mx-auto">No inquiries of this type have been registered recently. Active proposals will display here immediately.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map(msg => (
              <div key={msg.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-150 flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      msg.type === 'offer' ? 'bg-amber-100 text-amber-800 border-amber-200/60' : 'bg-sky-100 text-sky-850 border-sky-200/60'
                    }`}>
                      {msg.type === 'offer' ? 'Purchase Offer' : 'General Inquiry'}
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold font-mono">on {msg.propertyName}</span>
                  </div>
                  
                  <div className="text-[10px] text-slate-450 font-mono">
                    {msg.createdAt}
                  </div>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-550 font-medium">
                    <div>
                      Buyer Name: <strong className="text-slate-800 font-bold">{msg.buyerName}</strong>
                    </div>
                    <div>
                      Email: <strong className="text-slate-700 font-mono font-bold">{msg.buyerEmail}</strong>
                    </div>
                    {msg.type === 'offer' && (
                      <div className="col-span-2 bg-amber-50/50 border border-amber-150 rounded-lg p-3 my-2 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px]">Submitted Offer Price:</span>
                          <span className="text-base font-bold text-emerald-800 font-mono">{formatCurrency(msg.offerPrice || 0, 'INDIA')}</span>
                        </div>
                        <p className="text-slate-650 leading-normal font-sans"><span className="text-slate-450 font-bold">Requested Terms:</span> "{msg.offerTerms}"</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-155 p-3 rounded-lg leading-relaxed text-slate-705 font-sans font-medium">
                    <span className="font-bold text-slate-450 uppercase text-[9px] block mb-1">Message Detail:</span>
                    "{msg.message}"
                  </div>

                  {/* Response State */}
                  {msg.status !== 'pending' ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                        {msg.status === 'accepted' && <span className="text-emerald-700">✓ Offer Accepted</span>}
                        {msg.status === 'rejected' && <span className="text-rose-700">✗ Inquiry Declined</span>}
                        {msg.status === 'countered' && <span className="text-blue-700 font-bold">⚡ Response Sent</span>}
                      </div>
                      {msg.agentResponse && (
                        <p className="text-slate-650 italic font-medium">"Response sent: {msg.agentResponse}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                          Inquiry Response Message:
                        </label>
                        <textarea
                          placeholder="Type response terms or answers to planning/zoning questions..."
                          value={responseTexts[msg.id] || ''}
                          onChange={(e) => setResponseTexts(prev => ({ ...prev, [msg.id]: e.target.value }))}
                          className="w-full h-16 bg-white border border-slate-200 hover:border-slate-350 rounded-lg p-2.5 text-slate-800 outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.type === 'offer' ? (
                          <>
                            <button
                              onClick={() => handleResponseSubmit(msg.id, 'accepted')}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                            >
                              <Check className="h-3.5 w-3.5" /> Accept Cash Offer
                            </button>
                            <button
                              onClick={() => handleResponseSubmit(msg.id, 'countered')}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                            >
                              <Sparkles className="h-3.5 w-3.5" /> Counter / Message Back
                            </button>
                            <button
                              onClick={() => handleResponseSubmit(msg.id, 'rejected')}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg flex items-center gap-1 cursor-pointer border border-slate-200 shadow-sm transition-all"
                            >
                              <X className="h-3.5 w-3.5" /> Reject Offer
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleResponseSubmit(msg.id, 'countered')}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                            >
                              <MessageSquare className="h-3.5 w-3.5" /> Send Answer
                            </button>
                            <button
                              onClick={() => handleResponseSubmit(msg.id, 'rejected')}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg flex items-center gap-1 cursor-pointer border border-slate-200 shadow-sm transition-all"
                            >
                              Dismiss Inbound
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="agent-suite-portal" className={activeMainView ? "w-full animate-fade-in" : "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col"}>
      {/* Sub-header navigation */}
      {!activeMainView && (
        <div className="bg-slate-50 border-b border-slate-150 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Verified Seller Suite</span>
          </div>
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg text-xs font-semibold text-slate-650">
            <button
              id="agent-tab-listings"
              onClick={() => setActiveTab('listings')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeTab === 'listings' ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200' : 'hover:text-slate-855'
              }`}
            >
              My Listings ({agentListings.length})
            </button>
            <button
              id="agent-tab-inbound"
              onClick={() => setActiveTab('inbound')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inbound' ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200' : 'hover:text-slate-855'
              }`}
            >
              Offers & Inquiries
              {agentMessages.filter(m => m.status === 'pending').length > 0 && (
                <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                  {agentMessages.filter(m => m.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              id="agent-tab-create"
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'create' ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200' : 'hover:text-slate-855'
              }`}
            >
              {editingId ? (
                <>
                  <Edit3 className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                  ✏️ Edit Parcel Details
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Add New Parcel
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className={activeMainView ? "space-y-4" : "p-6 space-y-4"}>
        {/* Verification / Notification feedback banner */}
        {notification && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm animate-fade-in ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-250 text-emerald-900' 
              : 'bg-rose-50 border-rose-250 text-rose-900'
          }`}>
            <span className="text-base shrink-0 mt-0.5">
              {notification.type === 'success' ? '✓' : '⚠️'}
            </span>
            <div className="flex-1">
              <h5 className="font-bold text-xs uppercase tracking-wider font-mono">
                {notification.type === 'success' ? 'Transaction Success' : 'Input Validation Error'}
              </h5>
              <p className="text-xs mt-0.5 font-semibold font-sans">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-xs hover:opacity-75 font-bold shrink-0 font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Independent Subviews for Sidebar routes */}
        {activeMainView === 'seller-dashboard' && renderSellerDashboard()}
        {activeMainView === 'seller-profile' && renderSellerProfile()}
        {activeMainView === 'seller-settings' && renderSellerSettings()}

        {/* Listings display (unified tab or separate route) */}
        {((!activeMainView && activeTabVal === 'listings') || activeMainView === 'seller-listings') && (
          <div className="space-y-4">
            {renderMyListings()}
          </div>
        )}

        {/* Inbound leads display (offers) */}
        {activeMainView === 'seller-leads' && (
          <div className="space-y-4">
            {renderInboundLeads('offer')}
          </div>
        )}

        {/* Inbound inquiries display (general messages) */}
        {activeMainView === 'seller-messages' && (
          <div className="space-y-4">
            {renderInboundLeads('general')}
          </div>
        )}

        {/* Old unified Inbound tab displaying both together */}
        {(!activeMainView && activeTabVal === 'inbound') && (
          <div className="space-y-4">
            {renderInboundLeads('offer')}
            <div className="border-t border-slate-200 my-6 pt-6"></div>
            {renderInboundLeads('general')}
          </div>
        )}

        {/* TAB 3: REGISTER NEW PARCEL */}
        {((!activeMainView && activeTabVal === 'create') || activeMainView === 'seller-add-property') && (
          <form onSubmit={handleCreateListing} className="space-y-6 max-w-3xl">
            <div className="flex flex-col gap-1 pb-3 border-b border-rose-100 bg-rose-50/40 p-4 rounded-xl border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-rose-700 animate-pulse" />
                <h4 className="text-sm font-bold text-rose-900 uppercase tracking-wide">Register Indian Cadastral Listing (Seller Flow)</h4>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed font-sans font-medium">
                ⚠️ <strong className="font-bold">Government Mandate Notice:</strong> To register land for sale on the national grid registry, you are legally obligated to fill all compulsory details marked with an asterisk (*). This data generates physical geographic blueprints and buyer surveys.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COMPULSORY HISTORICAL GEOGRAPHY FIELDS */}
              <div className="col-span-1 md:col-span-2 space-y-3 bg-slate-50 border border-slate-150 p-4 rounded-xl">
                <label className="block text-xxs font-black text-rose-600 uppercase tracking-widest border-b border-rose-100 pb-1">
                  📍 LAND GEOGRAPHY LOCATION DETAILS (ENTER MANUALLY)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* State Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">State Name <span className="text-rose-600 font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Maharashtra"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                    />
                  </div>

                  {/* District Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">District Name <span className="text-rose-600 font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Pune"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                    />
                  </div>

                  {/* Taluk Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Taluk Name <span className="text-rose-600 font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Haveli"
                      value={selectedTaluk}
                      onChange={(e) => setSelectedTaluk(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-355 focus:border-rose-500 rounded-lg px-3 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                    />
                  </div>

                  {/* Village Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-555 uppercase mb-1">Village Name <span className="text-rose-600 font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Manjari"
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-355 focus:border-rose-500 rounded-lg px-3 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2.5 border-t border-slate-200 mt-2">
                  <button
                    type="button"
                    onClick={handleManualLocationSearch}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-3xs transition"
                  >
                    <span>🔍 Search & Auto-Locate Manual Address</span>
                  </button>
                </div>
              </div>


              {/* Repositioned OpenStreetMap section will go after Document checklists block */}

              {/* Zoning Clearance */}
              <div>
                <label className="block text-xxs font-bold text-slate-555 uppercase mb-1.5">Registry Zoning Code</label>
                <select
                  value={zoning}
                  onChange={(e) => setZoning(e.target.value as ZoningCode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805 focus:border-rose-500 outline-none cursor-pointer"
                >
                  {Object.values(ZONING_RULES).map(r => (
                    <option key={r.code} value={r.code}>
                      {r.code} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price in Rupees */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Asking Price (INR Rupees) <span className="text-rose-600 font-bold">*</span></label>
                <input
                  type="number"
                  required
                  min={10000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-805 focus:border-rose-500 outline-none transition font-mono animate-none"
                />
                <span className="text-[10px] text-rose-955 mt-1 block font-mono font-semibold">
                  Equivalent to: <strong className="text-rose-700 font-extrabold">{formatCurrency(price)}</strong>
                </span>
              </div>

              {/* Total Acres - Compulsory */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Total Land Area (Acres) <span className="text-rose-600 font-bold">*</span></label>
                <input
                  type="number"
                  required
                  step={0.01}
                  min={0.05}
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-805 focus:border-rose-500 outline-none transition font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                  Approx. <strong className="text-slate-600">{(acres * 1.6).toFixed(2)} Bighas</strong> or <strong className="text-slate-600">{(acres * 40).toFixed(0)} Gunthas</strong>
                </span>
              </div>

              {/* Type of the Land - Compulsory */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Type of the Land <span className="text-rose-600 font-bold">*</span></label>
                <select
                  value={landType}
                  onChange={(e) => {
                    const type = e.target.value;
                    setLandType(type);
                    // Dynamically map to appropriate zoning category
                    if (type.includes('Agricultural') || type.includes('Plantation')) {
                      setZoning('AGRI');
                    } else if (type.includes('Residential')) {
                      setZoning('RES');
                    } else if (type.includes('Commercial')) {
                      setZoning('COMM');
                    } else if (type.includes('Industrial')) {
                      setZoning('IND');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805 focus:border-rose-500 outline-none cursor-pointer"
                >
                  <option value="Wet Agricultural Land (Irrigated)">Wet Agricultural Land (Irrigated)</option>
                  <option value="Dry Agricultural Land (Rainfed)">Dry Agricultural Land (Rainfed)</option>
                  <option value="Horticultural Plantation (Orchard)">Horticultural Plantation (Orchard)</option>
                  <option value="Residential Converted Land (NA)">Residential Converted Land (NA / Villa plots)</option>
                  <option value="Commercial Converted Multipurpose (NA)">Commercial Converted Multipurpose (NA)</option>
                  <option value="Industrial Logistics Use Land">Industrial Logistics Use Land</option>
                </select>
              </div>

              {/* Type of the Soil - Compulsory */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Type of the Soil <span className="text-rose-600 font-bold">*</span></label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805 focus:border-rose-500 outline-none cursor-pointer"
                >
                  <option value="Red Sandy Loam Soil">Red Sandy Loam Soil (Excellent for fruits/tubers & tree crops)</option>
                  <option value="Black Cotton Regur Soil">Black Cotton Regur Soil (Retains moisture, perfect for cotton/sugarcane)</option>
                  <option value="Alluvial Rich Clay Loam">Alluvial Rich Clay Loam (Highest fertility, perfect for wheat/paddy)</option>
                  <option value="Sandy Desert Mineral Soil">Sandy Desert Mineral Soil (Suitable for millets/dates)</option>
                  <option value="Laterite Red Gravelly Soil">Laterite Red Gravelly Soil (Excellent for tea, cashew, coconut)</option>
                  <option value="Peaty Clay Organic marsh Soil">Peaty Clay Organic marsh Soil (Excellent for rice/paddy)</option>
                </select>
              </div>

              {/* Live Location Coordinates & Map of the land - Deactivated on User Request */}

               {/* Landowner Name */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Landowner Name <span className="text-rose-600 font-bold">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ramesh Kumar / Baldev Singh"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3.5 py-2 text-xs text-slate-805 outline-none transition"
                />
              </div>

              {/* Government Survey Number */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Government Survey Number / Patta <span className="text-rose-600 font-bold">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Survey 142/3-B or Patta 891"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3.5 py-2 text-xs text-slate-805 outline-none transition"
                />
              </div>

              {/* Color of the Land */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Color of the Land / Soil <span className="text-rose-600 font-bold">*</span></label>
                <select
                  value={landColor}
                  onChange={(e) => setLandColor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805 focus:border-rose-500 outline-none cursor-pointer"
                >
                  <option value="Deep Black Regur Soil">Deep Black / Regur</option>
                  <option value="Reddish Brown Loam">Red / Reddish Brown</option>
                  <option value="Golden Yellow Sandy">Golden Yellow / Desert</option>
                  <option value="Dark Grey Clayey">Dark Grey Clayey</option>
                  <option value="Light Brown Alluvial">Light Brown Alluvial</option>
                  <option value="Chalky White Calcium">Chalky White Gravelly</option>
                </select>
              </div>

              {/* Crop grown - Compulsory */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Which Type of Crop Can Be Grown? <span className="text-rose-600 font-bold">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rice (Paddy), sugarcane, groundnut, pulses"
                  value={cropsSuggested}
                  onChange={(e) => setCropsSuggested(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3.5 py-2 text-xs text-slate-805 outline-none transition"
                />
              </div>

              {/* Trees Standing - Compulsory */}
              <div>
                <label className="block text-xxs font-bold text-slate-550 uppercase mb-1.5">Any Trees and How Many? <span className="text-rose-600 font-bold">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 20 Mango trees, 15 Teak trees, none"
                  value={treesCount}
                  onChange={(e) => {
                    setTreesCount(e.target.value);
                    setExistingPlants(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3.5 py-2 text-xs text-slate-805 outline-none transition"
                />
              </div>

              {/* Photo uploading option (optional) */}
              <div className="col-span-1 md:col-span-2 space-y-2.5">
                <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-t-xl border border-dashed border-slate-300">
                  <label className="block text-xxs font-bold text-slate-700 uppercase">📸 Photo Uploading Option of Land <span className="text-slate-450 font-normal lowercase">(optional)</span></label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded">Optional Field</span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-b-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Method A: Upload Photo File from Device</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImageUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Method B: Paste Web Photo Image URL link</label>
                      <input
                        type="text"
                        placeholder="Enter direct URL (e.g., https://images.unsplash.com/...)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {imageUrl ? (
                    <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 rounded p-2 font-semibold flex items-center gap-2">
                      <span className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-0.5 text-[8px]">✓</span> 
                      <span>Successfully Assigned: {imageUrl.startsWith('data:') ? 'Uploaded Local File Image Blob' : 'Custom Image Link Loaded'}</span>
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')}
                        className="ml-auto text-rose-500 hover:text-rose-700 font-bold"
                      >
                        Clear Photo
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No image chosen. If left blank, a gorgeous premium meadow landscape is assigned automatically as a fallback.</div>
                  )}

                  {/* Quick-choice placeholders */}
                  <div className="flex bg-white border border-slate-200 p-1.5 rounded items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Or select preset:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setImageUrl(LAND_PRESETS[0])}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition ${imageUrl === LAND_PRESETS[0] ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Meadow Field
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(LAND_PRESETS[1])}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition ${imageUrl === LAND_PRESETS[1] ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Hazelnut Field
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(LAND_PRESETS[3])}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition ${imageUrl === LAND_PRESETS[3] ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Farm Corner
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video uploading option (optional) */}
              <div className="col-span-1 md:col-span-2 space-y-2.5">
                <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-t-xl border border-dashed border-slate-300">
                  <label className="block text-xxs font-bold text-slate-700 uppercase">🎥 Video Uploading Option of Land <span className="text-slate-450 font-normal lowercase">(optional)</span></label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded">Optional Field</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-b-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Method A: Upload Drone/Site Video from Device</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setVideoUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Method B: Paste Web Video URL stream</label>
                      <input
                        type="text"
                        placeholder="e.g., https://assets.mixkit.co/videos/preview/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  {videoUrl ? (
                    <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 rounded p-2 font-semibold flex items-center gap-2">
                      <span className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-0.5 text-[8px]">✓</span>
                      <span>Successfully Assigned: {videoUrl.startsWith('data:') ? 'Uploaded Local video stream' : 'Custom video web link loaded'}</span>
                      <button 
                        type="button" 
                        onClick={() => setVideoUrl('')}
                        className="ml-auto text-rose-505 hover:text-rose-700 font-bold"
                      >
                        Clear Video
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No video assigned. If left blank, a standard beautiful high-definition drone sweep stream is calibrated automatically.</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xxs font-bold text-slate-450 uppercase mb-1.5">Cadastral & Land Use Description</label>
              <textarea
                required
                rows={3}
                placeholder="Include water catchment profile, exact boundaries relative to village maps, and due diligence notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-3 text-xs text-slate-850 outline-none transition"
              />
            </div>

            {/* Infrastructure Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xxs font-bold text-slate-450 uppercase mb-1.5">Water Source Status</label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-xxs font-bold text-slate-450 uppercase mb-1.5">Electricity Availability</label>
                <input
                  type="text"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-xxs font-bold text-slate-450 uppercase mb-1.5">Physical Road Access</label>
                <input
                  type="text"
                  value={roadAccess}
                  onChange={(e) => setRoadAccess(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Documents Checkbox */}
            <div className="flex flex-wrap gap-6 pt-1 text-xs font-bold text-slate-650">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasSoilTest}
                  onChange={(e) => setHasSoilTest(e.target.checked)}
                  className="accent-rose-600 h-4 w-4"
                />
                Soil percolation & pH test certified index
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasSurvey}
                  onChange={(e) => setHasSurvey(e.target.checked)}
                  className="accent-rose-600 h-4 w-4"
                />
                Licensed cadastral survey & spatial boundary mapped
              </label>
            </div>

            {/* SECTION 2: OPENSTREETMAP & LEAFLET LOCATION PICKER SECTION */}
            <div className="space-y-4 bg-slate-50 border border-slate-150 p-4 rounded-xl w-full max-w-full overflow-hidden box-sizing-border-box">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <label className="block text-xxs font-black text-rose-600 uppercase tracking-widest">
                  🗺️ OPENSTREETMAP & LEAFLET LOCATION SELECTION
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentGPS}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xxs font-bold flex items-center gap-1 cursor-pointer shadow-3xs transition"
                >
                  <Compass className="h-3 w-3 animate-spin-slow" />
                  <span>Use Current GPS Location</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-medium">
                Search for a location or drag the pin to mark the exact position. Satellite, Normal, and Terrain views are fully supported.
              </p>

              {/* Search query box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by address, village, survey number, or pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleMapSearch();
                    }
                  }}
                  className="flex-1 bg-white border border-slate-200 hover:border-slate-350 focus:border-rose-500 rounded-lg px-3 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                />
                <button
                  type="button"
                  onClick={handleMapSearch}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-3xs"
                >
                  <span>Search</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Map view controls and drawing actions bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xxs font-bold">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400 mr-1 uppercase text-[9px] font-mono">MAP INTERACTION MODE:</span>
                    <button
                      type="button"
                      onClick={() => setMapClickMode('pin')}
                      className={`px-2.5 py-1 rounded-md uppercase tracking-wider transition ${
                        mapClickMode === 'pin'
                          ? 'bg-rose-600 text-white shadow-3xs'
                          : 'bg-white text-slate-700 border border-slate-250 hover:bg-slate-100'
                      }`}
                    >
                      📍 Place Pin
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapClickMode('boundary')}
                      className={`px-2.5 py-1 rounded-md uppercase tracking-wider transition ${
                        mapClickMode === 'boundary'
                          ? 'bg-rose-600 text-white shadow-3xs'
                          : 'bg-white text-slate-700 border border-slate-250 hover:bg-slate-100'
                      }`}
                    >
                      📐 Draw Boundary
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 font-sans flex-wrap">
                    <span className="text-slate-400 mr-1 uppercase text-[9px] font-mono">BOUNDARIES:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawingPolygon(prev => prev.slice(0, -1));
                      }}
                      disabled={drawingPolygon.length === 0}
                      className="px-2 py-1 bg-white border border-slate-250 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-md flex items-center gap-0.5"
                      title="Undo last added coordinate"
                    >
                      <Undo className="h-3 w-3 text-slate-500" />
                      <span>Undo Point</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear all boundary points?')) {
                          setDrawingPolygon([]);
                        }
                      }}
                      disabled={drawingPolygon.length === 0}
                      className="px-2 py-1 bg-white border border-slate-250 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 text-slate-700 rounded-md flex items-center gap-0.5"
                      title="Reset entire boundary"
                    >
                      <RotateCcw className="h-3 w-3 text-rose-500" />
                      <span>Clear All</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const scale = 0.00015 + Math.min(Number(acres) * 0.00005, 0.001);
                        setDrawingPolygon([
                          [lat - scale, lng - scale],
                          [lat + scale, lng - scale],
                          [lat + scale, lng + scale],
                          [lat - scale, lng + scale]
                        ]);
                      }}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/65 rounded-md flex items-center gap-0.5"
                      title="Instantly generate box based on entered acreage"
                    >
                      <Sparkles className="h-3 w-3 text-rose-500" />
                      <span>Default Box</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xxs font-bold">
                  <span className="text-slate-400 mr-1 uppercase text-[9px] font-mono">LAYERS:</span>
                  {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((mType) => (
                    <button
                      key={mType}
                      type="button"
                      onClick={() => setSellerMapTypeId(mType)}
                      className={`px-2 py-1 rounded-md uppercase tracking-wider transition ${
                        sellerMapTypeId === mType
                          ? 'bg-rose-600 text-white shadow-3xs'
                          : 'bg-white text-slate-700 border border-slate-250 hover:bg-slate-100'
                      }`}
                    >
                      {mType}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-100/60 p-2.5 rounded-xl text-[10px] text-slate-600 leading-normal flex items-start gap-1.5 border border-slate-200">
                  <span className="text-rose-600 text-xs">💡</span>
                  <div>
                    {mapClickMode === 'pin' ? (
                      <span><strong>Place Pin Mode active:</strong> Click anywhere on the map to drop your center marker pin at that location. You can also drag the pin directly!</span>
                    ) : (
                      <span><strong>Draw Boundary Mode active:</strong> Click anywhere on the map to add vertices outlining the boundaries of your land. Drag any vertex to adjust it, or double-click a vertex to delete it.</span>
                    )}
                  </div>
                </div>

                {/* The Map itself */}
                <div className="w-full h-[380px] md:h-[500px] rounded-xl overflow-hidden border border-slate-200 relative shadow-inner box-sizing-border-box max-w-full">
                  <LeafletMap
                    mode="select-location"
                    lat={lat}
                    lng={lng}
                    zoom={zoomLevel}
                    onLocationChange={updateLocationAndGeocode}
                    drawingPolygon={drawingPolygon}
                    onDrawingPolygonChange={setDrawingPolygon}
                    mapType={sellerMapTypeId}
                    mapClickMode={mapClickMode}
                  />
                  <div className="absolute top-3 left-3 bg-indigo-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-indigo-700 text-white text-[9px] font-mono tracking-widest font-black pointer-events-none uppercase z-10 animate-pulse">
                    🗺️ OpenStreetMap Active
                  </div>
                </div>

                {/* REAL-TIME AREA CALCULATIONS PANEL */}
                {calculatedArea ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-3 shadow-3xs animate-fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xxs font-black text-emerald-800 uppercase tracking-wider font-mono">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>📐 AUTOMATED CAD GEOSPATIAL AREA</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAcres(parseFloat(calculatedArea.acres.toFixed(3)));
                          setNotification({ type: 'success', message: `Synced calculated area (${calculatedArea.acres.toFixed(3)} Acres) to Form input!` });
                        }}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-3xs"
                      >
                        <Check className="h-3 w-3" />
                        <span>Sync to Form Acres Input</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center font-sans">
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase font-mono">ACRES</span>
                        <strong className="text-emerald-800 text-xs font-black font-mono">{calculatedArea.acres.toFixed(3)} Ac</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase font-mono">HECTARES</span>
                        <strong className="text-emerald-800 text-xs font-black font-mono">{calculatedArea.hectares.toFixed(3)} Ha</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase font-mono">GUNTAS</span>
                        <strong className="text-emerald-800 text-xs font-black font-mono">{calculatedArea.guntas.toFixed(2)} Gt</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase font-mono">SQUARE FEET</span>
                        <strong className="text-emerald-800 text-xs font-black font-mono">{Math.round(calculatedArea.sqFeet).toLocaleString()} Sq Ft</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-emerald-100">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase font-mono">SQUARE METERS</span>
                        <strong className="text-emerald-800 text-xs font-black font-mono">{Math.round(calculatedArea.sqMeters).toLocaleString()} m²</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100 border border-slate-200 text-slate-500 rounded-xl p-3 text-center text-xxs font-medium leading-normal">
                    📍 Outline at least 3 points on the satellite map to unlock automatic multi-unit Area Calculations (Acres, Hectares, Guntas, Sq Ft, Sq m).
                  </div>
                )}

                {/* Coordinates Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 border border-slate-200 rounded-lg text-xxs font-mono text-slate-600">
                  <div>
                    <span className="text-slate-400 font-bold block">LATITUDE</span>
                    <strong className="text-slate-800 font-bold">{lat.toFixed(6)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">LONGITUDE</span>
                    <strong className="text-slate-800 font-bold">{lng.toFixed(6)}</strong>
                  </div>
                  <div className="sm:col-span-2 border-t border-slate-100 pt-2 font-sans">
                    <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider font-mono mb-0.5">Selected Complete Address</span>
                    <input
                      type="text"
                      required
                      placeholder="Drag pin or search to fill complete address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-md px-2.5 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                    />
                  </div>
                  <div className="sm:col-span-2 font-sans">
                    <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider font-mono mb-0.5">Pincode / Zip</span>
                    <input
                      type="text"
                      required
                      placeholder="Zip / Postal code..."
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-32 bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-md px-2.5 py-1.5 text-xs text-slate-805 outline-none transition font-sans"
                    />
                  </div>
                </div>

                {/* Manual Coordinates List & Manual Vertices Table */}
                <div className="text-left pt-3 border-t border-slate-200">
                  <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-2 font-mono">
                    🗺️ Boundary Vertices Coordinates Table
                  </label>
                  
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-3xs">
                    {drawingPolygon.length > 0 ? (
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {drawingPolygon.map((pt, i) => (
                          <div key={i} className="flex flex-wrap items-center gap-1.5 text-xxs border-b border-slate-100 pb-1 flex-wrap">
                            <span className="font-mono text-slate-400 w-12 font-bold uppercase">Vertex {i+1}:</span>
                            <input
                              type="number"
                              step="any"
                              value={pt[0]}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setDrawingPolygon(prev => {
                                  const next = [...prev];
                                  next[i] = [val, pt[1]];
                                  return next;
                                });
                              }}
                              placeholder="Lat"
                              className="w-24 bg-slate-50 border border-slate-200 rounded-md p-1 font-mono text-slate-800 outline-none"
                            />
                            <input
                              type="number"
                              step="any"
                              value={pt[1]}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setDrawingPolygon(prev => {
                                  const next = [...prev];
                                  next[i] = [pt[0], val];
                                  return next;
                                });
                              }}
                              placeholder="Lng"
                              className="w-24 bg-slate-50 border border-slate-200 rounded-md p-1 font-mono text-slate-800 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setDrawingPolygon(prev => prev.filter((_, idx) => idx !== i));
                              }}
                              className="p-1 hover:bg-rose-50 rounded text-rose-600 transition"
                              title="Delete vertex"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 py-1.5 text-center font-medium">
                        No boundary vertices added yet. Move map to 'Draw Boundary' mode or use 'Default Box' to generate.
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xxs">
                      <button
                        type="button"
                        onClick={() => {
                          const offset = drawingPolygon.length * 0.0001;
                          setDrawingPolygon(prev => [...prev, [lat + offset, lng + offset]]);
                        }}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-md font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Vertex Point</span>
                      </button>
                      {drawingPolygon.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setDrawingPolygon([])}
                          className="text-rose-600 hover:underline font-bold"
                        >
                          Clear All Points
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="submit-new-listing"
                type="submit"
                className="px-6 py-2.5 bg-rose-650 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-rose-900/10 w-full md:w-auto uppercase tracking-wider font-mono"
              >
                {editingId ? (
                  <>
                    <Edit3 className="h-4 w-4" /> Update Listed Land Details
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Register Land on India Cadaster Grid
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    // Reset Form
                    setTitle('');
                    setAreaName('');
                    setDescription('');
                    setPrice(3500000);
                    setAcres(2.5);
                    setSurveyNumber('');
                    setOwnerName('');
                    setTreesCount('');
                    setLandColor('Reddish Brown Loam');
                    setImageUrl('');
                    setVideoUrl('');
                    setActiveTab('listings');
                    if (onNavigateToListings) {
                      onNavigateToListings();
                    }
                    setNotification({ type: 'success', message: 'Parcel edit discarded.' });
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer font-sans"
                >
                  Discard Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

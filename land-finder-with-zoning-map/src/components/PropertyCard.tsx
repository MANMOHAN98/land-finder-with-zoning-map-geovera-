import React from 'react';
import { LandListing } from '../types';
import { ZONING_RULES, formatCurrency, formatArea } from '../data';
import { LanguageCode, TRANSLATIONS, translateDynamicText } from '../translations';
import { 
  DollarSign, 
  TrendingUp, 
  Check, 
  Compass, 
  Plug, 
  Droplet, 
  Bookmark,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';

interface PropertyCardProps {
  key?: string;
  listing: LandListing;
  isSelected: boolean;
  isHovered: boolean;
  isBookmarked: boolean;
  currentLanguage?: LanguageCode;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onContactAgent: () => void;
}

export default function PropertyCard({
  listing,
  isSelected,
  isHovered,
  isBookmarked,
  currentLanguage = 'EN',
  onSelect,
  onHover,
  onToggleBookmark,
  onContactAgent
}: PropertyCardProps) {
  const zoningRules = ZONING_RULES[listing.zoning];
  const pricePerAcre = Math.round(listing.price / listing.acres);

  const totalSqFt = listing.acres * 43560;
  const estimatedLengthFeet = Math.round(Math.sqrt(totalSqFt * 1.5));
  const estimatedWidthFeet = Math.round(totalSqFt / estimatedLengthFeet);

  const totalSqM = totalSqFt / 10.7639;
  const estimatedLengthMeters = Math.round(Math.sqrt(totalSqM * 1.5));
  const estimatedWidthMeters = Math.round(totalSqM / estimatedLengthMeters);

  const guntas = totalSqFt / 1089;
  const hectares = totalSqM / 10000;

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  const getLabel = (key: string): string => {
    const labels: Record<string, Record<LanguageCode, string>> = {
      soil: {
        EN: 'Soil', HI: 'मिट्टी', BN: 'মাটি', TE: 'నేల', MR: 'माती', TA: 'மண்', GU: 'માટી', KN: 'ಮಣ್ಣು', PA: 'ਮਿੱਟੀ', ML: 'മണ്ണ്'
      },
      metrics: {
        EN: 'Metrics', HI: 'माप', BN: 'পরিমাপ', TE: 'కొలతలు', MR: 'मापन', TA: 'அளவீடுகள்', GU: 'માપ', KN: 'అಳತೆಗಳು', PA: 'ਮਾਪ', ML: 'അളവുകൾ'
      },
      soil_passed: {
        EN: 'Soil Test Passed', HI: 'मृदा परीक्षण सफल', BN: 'মাटी পরীক্ষা সফল', TE: 'నేల పరీక్ష విజయవంతమైంది', MR: 'माती चाचणी उत्तीर्ण', TA: 'மண் பரிசோதனை தேர்ச்சி', GU: 'જમીન પરીક્ષણ સફળ', KN: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ತೇರ್ಗಡೆ', PA: 'ਮਿੱਟੀ ਟੈਸਟ ಪਾਸ', ML: 'മണ്ണ് പരിശോധന വിജയിച്ചു'
      },
      survey_verified: {
        EN: 'Survey Map Drafted', HI: 'सर्वेक्षण मानचित्र तैयार', BN: 'জরিপ মানচিত্র প্রস্তুত', TE: 'సర్వే మ్యాప్ సిద్ధంగా ఉంది', MR: 'नकाशा तयार', TA: 'வரைபடம் தயாரிக்கப்பட்டது', GU: 'નકશો બનેલો છે', KN: 'ನಕ್ಷೆ ಸಿದ್ಧವಿದೆ', PA: 'ਨਕਸ਼ਾ ਤਿਆਰ', ML: 'സർവേ മാപ്പ് ലഭ്യമാണ്'
      },
      category: {
        EN: 'Category', HI: 'श्रेणी', BN: 'শ্রেণী', TE: 'వర్గం', MR: 'श्रेणी', TA: 'வகை', GU: 'શ્રેણી', KN: 'ವರ್ಗ', PA: 'ਸ਼੍ਰੇਣੀ', ML: 'വിഭാഗം'
      },
      premium: {
        EN: 'PREMIUM TRACT', HI: 'प्रीमियम प्लॉट', BN: 'প্রিমিয়াম প্লট', TE: 'ప్రీమియం ప్లాట్', MR: 'प्रीमियम प्लॉट', TA: 'பிரீமியம் நிலம்', GU: 'પ્રીમિયમ પ્લોટ', KN: 'ಪ್ರೀಮಿಯಂ ಪ್ಲಾಟ್', PA: 'ਪ੍ਰੀਮੀਅਮ ਪਲਾਟ', ML: 'പ്രീമിയം പ്ലോട്ട്'
      },
      reg_id: {
        EN: 'REG ID', HI: 'आईडी', BN: 'আইডি', TE: 'ఐడి', MR: 'आयडी', TA: 'ஐடி', GU: 'આઈડી', KN: 'ಐಡಿ', PA: 'ਆਈਡੀ', ML: 'ഐഡി'
      },
      access: {
        EN: 'Access', HI: 'पहुंच', BN: 'সংযোগ', TE: 'రవాణా', MR: 'प्रवेश रस्ता', TA: 'வழி', GU: 'રસ્તો', KN: 'ಪ್ರವೇಶ', PA: 'ਪਹੁੰਚ', ML: 'വഴി'
      },
      rate: {
        EN: 'Unit Value Rate', HI: 'मूल्यांकन दर', BN: 'मूल्यांकन दर', TE: 'విలువ రేటు', MR: 'मूल्यांकन दर', TA: 'மதிப்பு வீதம்', GU: 'મૂલ્યાંકન દર', KN: 'ಮೌಲ್ಯ ದರ', PA: 'ਦਰ', ML: 'മൂല്യം'
      },
      inquire: {
        EN: 'Inquire', HI: 'पूछताछ', BN: 'অনুসন্ধান', TE: 'విచారణ', MR: 'चौकशी', TA: 'விசாரிக்க', GU: 'પૂછપરછ', KN: 'ವಿಚಾರಿಸು', PA: 'ਪੁੱਛਗਿੱਛ', ML: 'അന്വേഷിക്കുക'
      }
    };
    return labels[key]?.[currentLanguage] || labels[key]?.[ 'EN' ] || key;
  };

  return (
    <div
      id={`property-card-${listing.id}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onSelect}
      className={`relative border rounded-2xl overflow-hidden transition-all duration-300 transform flex flex-col h-full bg-white group cursor-pointer ${
        isSelected
          ? 'border-emerald-600 ring-4 ring-emerald-500/8 shadow-lg shadow-emerald-700/5 translate-y-[-4px]'
          : isHovered
          ? 'border-slate-300 bg-slate-50/40 translate-y-[-2px] shadow-md shadow-slate-200/50'
          : 'border-slate-200/90 shadow-xs'
      }`}
    >
      {/* Selection Left Pillar Decor */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 z-10 rounded-l-2xl animate-pulse" />
      )}

      {/* Property Image Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
        />

        {/* Ambient Overlay gradient on the picture */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-900/10 to-transparent opacity-80 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white shadow-md flex items-center gap-1.5 uppercase tracking-wide font-mono backdrop-blur-xs border border-white/20 animate-fade-in"
            style={{ backgroundColor: zoningRules?.color || '#cbd5e1' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            {listing.zoning} {getLabel('category')}
          </span>
          {listing.featured && (
            <span className="bg-amber-500/95 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-md border border-amber-400/30 animate-fade-in">
              <Sparkles className="h-2.5 w-2.5 text-white animate-pulse fill-amber-300" />
              {getLabel('premium')}
            </span>
          )}
        </div>

        {/* Favorite Bookmark */}
        <button
          id={`bookmark-btn-${listing.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(e);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full border transition-all duration-200 cursor-pointer shadow-md ${
            isBookmarked
              ? 'bg-emerald-600 border-emerald-500 text-white scale-110'
              : 'bg-white/90 hover:bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
          }`}
          title="Save Listing"
        >
          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center shrink-0 shadow-md">
          <span className="text-sm font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(listing.price, listing.hub)}
          </span>
        </div>
      </div>

      {/* Property Information Body */}
      <div className="p-4.5 flex-1 flex flex-col justify-between font-sans">
        <div>
          {/* Header row: ID & acres */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-450 mb-2 gap-2">
            <span className="font-semibold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
              {getLabel('reg_id')}: {listing.id}
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-lg border border-emerald-100 whitespace-nowrap">
              {formatArea(listing.acres, listing.hub)}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-15px font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors font-display tracking-tight leading-snug">
            {translateDynamicText(listing.title, currentLanguage)}
          </h4>

          {/* Area & Location */}
          <div className="flex flex-col gap-2 mt-2 text-xs">
            {/* Unified Location Banner with Specific Regional Breakdown */}
            <div className="flex flex-wrap gap-1.5">
              <div className="flex items-center gap-1 text-slate-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded text-[11px] font-semibold">
                <span className="text-teal-600">⛰️ Area Name:</span>
                <span>{translateDynamicText(listing.areaName || 'N/A', currentLanguage)}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded text-[11px] font-semibold">
                <span className="text-indigo-600">🗺️ State:</span>
                <span>{translateDynamicText(listing.state || 'N/A', currentLanguage)}</span>
              </div>
            </div>

            {/* Geographic Hierarchy Grid */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-slate-50 border border-slate-150 p-2 rounded-lg text-[10px] font-medium text-slate-600 select-none">
              <div className="truncate"><span className="text-slate-400 font-bold">Village:</span> <span className="font-extrabold text-slate-800">{translateDynamicText(listing.village || listing.areaName?.replace(' Village', '') || 'N/A', currentLanguage)}</span></div>
              <div className="truncate"><span className="text-slate-400 font-bold">Taluk:</span> <span className="font-extrabold text-slate-800">{translateDynamicText(listing.taluk || 'N/A', currentLanguage)}</span></div>
              <div className="truncate"><span className="text-slate-400 font-bold">District:</span> <span className="font-extrabold text-slate-800">{translateDynamicText(listing.district || 'N/A', currentLanguage)}</span></div>
              <div className="truncate"><span className="text-slate-400 font-bold">State:</span> <span className="font-extrabold text-slate-800">{translateDynamicText(listing.state || 'N/A', currentLanguage)}</span></div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
              <span className="text-emerald-600">️📍 Location:</span>
              <span className="truncate font-medium text-11px" title={translateDynamicText(listing.location, currentLanguage)}>
                {translateDynamicText(listing.location, currentLanguage)}
              </span>
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-13px text-slate-600 leading-relaxed mt-2.5 line-clamp-2 font-medium">
            {translateDynamicText(listing.description, currentLanguage)}
          </p>

          {/* Detailed Soil & Crop Parameters (COMPULSORY Indian details) */}
          <div className="mt-3.5 space-y-1.5 bg-slate-50/70 border border-slate-150 p-2.5 rounded-xl text-[11px] text-slate-750 font-medium select-none">
            <div className="grid grid-cols-2 gap-2">
              <span className="truncate" title={listing.ownerName || 'N/A'}>👤 <strong className="text-slate-805 font-bold">Owner:</strong> {listing.ownerName || 'N/A'}</span>
              <span className="truncate font-mono text-[10px]" title={listing.surveyNumber || 'N/A'}>📋 <strong className="text-slate-805 font-bold font-sans">Survey:</strong> <span className="bg-rose-100 px-1 rounded text-rose-900 font-bold">{listing.surveyNumber || 'N/A'}</span></span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="truncate" title={listing.landColor || 'N/A'}>🎨 <strong className="text-slate-850 font-bold">Color:</strong> {listing.landColor || 'N/A'}</span>
              <span className="truncate" title={listing.soilType || 'N/A'}>🪨 <strong className="text-slate-850 font-bold">Soil:</strong> {listing.soilType || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="truncate" title={listing.cropsSuggested || 'N/A'}>🌾 <strong className="text-slate-800 font-bold">Crops:</strong> {listing.cropsSuggested || 'N/A'}</span>
              <span className="truncate" title={listing.treesCount || listing.existingPlants || 'N/A'}>🌳 <strong className="text-slate-800 font-bold">Trees:</strong> {listing.treesCount || listing.existingPlants || 'N/A'}</span>
            </div>
            {listing.videoUrl && (
              <div className="pt-1.5 mt-1 border-t border-slate-200/50 flex items-center justify-between">
                <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Drone Feed Streamable
                </span>
                <span className="text-[9px] bg-white border px-1.5 py-0.5 rounded text-indigo-600 font-mono tracking-tight font-extrabold hover:bg-slate-50">
                  ▶ Drone Video Tour
                </span>
              </div>
            )}
          </div>

          {/* Compulsory Land Measurement Information */}
          <div className="mt-3 bg-emerald-50/25 border border-emerald-100/60 rounded-xl p-3 text-xxs font-semibold space-y-2 text-left">
            <span className="text-emerald-800 font-extrabold uppercase font-mono tracking-wider block text-[9.5px]">📐 Land Measurement Information</span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-650">
              <div><span className="text-slate-400 font-bold">Land Area:</span> <span className="font-extrabold text-slate-800">{listing.acres.toFixed(2)} Acres</span></div>
              <div><span className="text-slate-400 font-bold">Dimensions:</span> <span className="font-extrabold text-slate-800">{estimatedLengthFeet} ft × {estimatedWidthFeet} ft</span></div>
              <div><span className="text-slate-400 font-bold">Length ({estimatedLengthMeters}m):</span> <span className="font-extrabold text-slate-800">{estimatedLengthFeet} Feet</span></div>
              <div><span className="text-slate-400 font-bold">Width ({estimatedWidthMeters}m):</span> <span className="font-extrabold text-slate-800">{estimatedWidthFeet} Feet</span></div>
              <div><span className="text-slate-400 font-bold">Total Sq. Feet:</span> <span className="font-extrabold text-slate-800">{Math.round(totalSqFt).toLocaleString()}</span></div>
              <div><span className="text-slate-400 font-bold">Total Sq. Meters:</span> <span className="font-extrabold text-slate-800">{Math.round(totalSqM).toLocaleString()}</span></div>
              <div><span className="text-slate-400 font-bold">Guntas:</span> <span className="font-extrabold text-slate-800">{guntas.toFixed(2)} Gt</span></div>
              <div><span className="text-slate-400 font-bold">Hectares:</span> <span className="font-extrabold text-slate-800">{hectares.toFixed(3)} Ha</span></div>
            </div>
          </div>

          {/* Land Metrics & infrastructure highlights */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-2 truncate">
              <Droplet className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="truncate text-slate-700 text-11px" title={translateDynamicText(listing.waterSource, currentLanguage)}>
                {translateDynamicText(listing.waterSource, currentLanguage)}
              </span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Plug className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="truncate text-slate-700 text-11px" title={translateDynamicText(listing.electricity, currentLanguage)}>
                {translateDynamicText(listing.electricity, currentLanguage)}
              </span>
            </div>
            <div className="flex items-center gap-2 truncate col-span-2 bg-slate-50/80 border border-slate-100 px-2 py-1 rounded-lg">
              <Compass className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span className="truncate text-slate-650 text-11px">{getLabel('access')}: <strong className="text-slate-800">{translateDynamicText(listing.roadAccess, currentLanguage)}</strong></span>
            </div>
          </div>
        </div>

        {/* Dual Actions Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
          <div className="text-left font-mono">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{getLabel('rate')}</span>
            <span className="text-xs font-mono font-extrabold text-emerald-700">
              {formatCurrency(pricePerAcre, listing.hub)}/{t('per_acre')}
            </span>
          </div>

          <div className="flex items-center gap-x-2">
            {/* Quick badges indicating due diligence */}
            <div className="flex items-center gap-1 animate-fade-in font-sans">
              {listing.hasSoilTest && (
                <span className="p-1 px-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-bold flex items-center gap-0.5" title={getLabel('soil_passed')}>
                  <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                  {getLabel('soil')}
                </span>
              )}
              {listing.hasSurvey && (
                <span className="p-1 px-1.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg text-[10px] font-bold flex items-center gap-0.5" title={getLabel('survey_verified')}>
                  <Compass className="h-3 w-3 text-sky-500" />
                  {getLabel('metrics')}
                </span>
              )}
            </div>

            <button
              id={`contact-agent-btn-${listing.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onContactAgent();
              }}
              className="text-xs font-bold px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 cursor-pointer transition-all shrink-0 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-700/20 font-sans"
            >
              {getLabel('inquire')}
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

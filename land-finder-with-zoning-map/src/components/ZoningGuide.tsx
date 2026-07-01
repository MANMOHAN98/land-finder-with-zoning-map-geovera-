import { useState } from 'react';
import { ZONING_RULES } from '../data';
import { ZoningCode } from '../types';
import { LanguageCode, TRANSLATIONS, translateDynamicText } from '../translations';
import { 
  Building2, 
  HelpCircle, 
  FileText, 
  Droplet, 
  CheckSquare, 
  Sparkles,
  Search,
  Hammer,
  AlertTriangle
} from 'lucide-react';

interface ZoningGuideProps {
  currentLanguage?: LanguageCode;
}

export default function ZoningGuide({ currentLanguage = 'EN' }: ZoningGuideProps) {
  const [selectedZone, setSelectedZone] = useState<ZoningCode>('AGRI');
  const [diligenceChecked, setDiligenceChecked] = useState<Record<string, boolean>>({
    'check-zoning': true,
    'soil-perc': false,
    'boundary-survey': false,
    'water-source': false,
    'grid-power': false,
    'flood-plain': false
  });

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  const activeZone = ZONING_RULES[selectedZone];

  const dueDiligenceItems = [
    {
      id: 'check-zoning',
      title: '1. Verify Project Zoning & Technical Overlay Restrictions',
      description: 'Review setbacks, dependency thresholds, and licensing rules (e.g., library scopes, package compatibility boundaries).'
    },
    {
      id: 'soil-perc',
      title: '2. Perform Virtual Sandbox Testing',
      description: 'Crucial for new execution runtimes (like PYTHON). Determines how fast processing occurs and if standard local scripts or microservice APIs are required.'
    },
    {
      id: 'boundary-survey',
      title: '3. Order Certified Boundary Survey & Pins',
      description: 'Find real steel survey pins in the ground. Avoid neighboring fence encroachments and confirm deeded ingress/egress easement pathways.'
    },
    {
      id: 'water-source',
      title: '4. Assess Deeded Water Infrastructure Rights',
      description: 'Establish if municipal water connection is at the road front or if a private well must be bored. If boring, check regional aquifer depths.'
    },
    {
      id: 'grid-power',
      title: '5. Pre-quote Utility Drop & Hookup Costs',
      description: 'Verify distance from the nearest power overhead pole. Extension charges can exceed $10,000 per 100ft of utility poles!'
    },
    {
      id: 'flood-plain',
      title: '6. Check Wetlands or FEMA Flood maps',
      description: 'Analyze soil maps for damp clay or active wetlands. Protected wetlands severely limit or forbid build areas.'
    }
  ];

  const toggleDiligence = (id: string) => {
    setDiligenceChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(diligenceChecked).filter(Boolean).length;

  return (
    <div id="zoning-edu-container" className="grid grid-cols-1 lg:grid-cols-12 gap-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden font-sans">
      
      {/* 1. Zoning Information Desk (LEFT) */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-emerald-700" />
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 font-mono">
              {t('zoning_desk')}
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            {t('zoning_description')}
          </p>

          {/* Code Selection Pills */}
          <div className="flex flex-wrap gap-2 pt-1 font-mono">
            {Object.keys(ZONING_RULES).map((code) => {
              const rule = ZONING_RULES[code as ZoningCode];
              const isSelected = selectedZone === code;
              return (
                <button
                  key={code}
                  id={`edu-pills-zoning-${code}`}
                  onClick={() => setSelectedZone(code as ZoningCode)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md border-slate-905 scale-95 font-black'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-905 border-slate-205 hover:border-slate-350'
                  }`}
                  style={{ borderLeftColor: rule.color, borderLeftWidth: '3px' }}
                >
                  {code} ({translateDynamicText(rule.category.split('-')[0], currentLanguage)})
                </button>
              );
            })}
          </div>

          {/* Active zoning rules details panel */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 mt-3">
            <div className="flex items-center justify-between font-sans">
              <h5 className="text-xs font-extrabold text-slate-805 uppercase font-mono tracking-wider">
                {activeZone.code} {t('category_standards')}
              </h5>
              <span 
                className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs"
                style={{ backgroundColor: `${activeZone.color}20`, color: activeZone.color, border: `1px solid ${activeZone.color}35` }}
              >
                {translateDynamicText(activeZone.name, currentLanguage)}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-300 pl-3.5">
              "{translateDynamicText(activeZone.description, currentLanguage)}"
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-2 text-xs">
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">{t('setbacks_required')}</span>
                <span className="text-slate-800 font-black font-mono">{translateDynamicText(activeZone.setback, currentLanguage)}</span>
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-0.5 font-sans">{t('max_height_reach')}</span>
                <span className="text-slate-800 font-black font-mono">{translateDynamicText(activeZone.maxHeight, currentLanguage)}</span>
              </div>
              <div className="col-span-2 bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs">
                <span className="block text-slate-450 font-bold uppercase text-[9px] tracking-wider mb-2 font-sans">{t('permitted_uses')}</span>
                <div className="flex flex-wrap gap-2">
                  {activeZone.allowedUses.map((use, i) => (
                    <span key={i} className="text-[11px] font-mono bg-emerald-50/60 border border-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-lg font-semibold">
                      {translateDynamicText(use, currentLanguage)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2.5 text-xxs text-amber-900 bg-amber-50 rounded-xl p-3 border border-amber-100 max-w-lg leading-relaxed font-sans animate-fade-in">
          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
          <span>{t('notice')}</span>
        </div>
      </div>

      {/* 2. Due Diligence Checklist (RIGHT) */}
      <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4 text-emerald-700" />
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-mono">
              {t('due_diligence')}
            </h5>
          </div>
          <span className="text-[10px] font-mono bg-emerald-600 text-white px-2 py-0.5 rounded-lg font-bold shadow-xs">
            {completedCount} / 6 {t('verified_status')}
          </span>
         </div>

        <p className="text-xxs text-slate-550 leading-relaxed font-medium">
          {t('diligence_subtitle')}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/30">
          <div 
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(completedCount / 6) * 100}%` }}
          />
        </div>

        {/* List items */}
        <div className="space-y-3 pt-1">
          {dueDiligenceItems.map((item) => {
            const checked = diligenceChecked[item.id] || false;
            return (
              <div 
                key={item.id} 
                className={`p-2.5 rounded-lg border transition-all ${
                  checked 
                    ? 'border-emerald-200/60 bg-emerald-50/40' 
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                }`}
              >
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDiligence(item.id)}
                    className="accent-emerald-620 h-4 w-4 rounded mt-0.5 cursor-pointer shrink-0"
                  />
                  <div>
                    <h6 className={`text-[11px] font-bold ${checked ? 'text-slate-450 line-through' : 'text-slate-755'}`}>
                      {translateDynamicText(item.title, currentLanguage)}
                    </h6>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                      {translateDynamicText(item.description, currentLanguage)}
                    </p>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

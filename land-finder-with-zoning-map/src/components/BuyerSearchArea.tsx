import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin,
  Search,
  Bookmark,
  Compass,
  Sparkles,
  Layers,
  FolderHeart,
  Tags,
  Sliders,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { LandListing, ZoningCode } from '../types';
import PropertyCard from './PropertyCard';
import { formatCurrency, formatArea } from '../data';
import { LanguageCode, TRANSLATIONS, translateDynamicText } from '../translations';

interface BuyerSearchAreaProps {
  listings: LandListing[];
  bookmarks: string[];
  activeHub: string;
  filteredListings: LandListing[];
  paginatedListings: LandListing[];
  searchError: string | null;
  isSearching: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  selectedId: string | null;
  hoveredId: string | null;
  currentLanguage: LanguageCode;
  buyerLandType: string;
  setBuyerLandType: (v: string) => void;
  selectedZoning: ZoningCode | 'ALL';
  setSelectedZoning: (v: ZoningCode | 'ALL') => void;
  buyerAreaQuery: string;
  setBuyerAreaQuery: (v: string) => void;
  buyerSelectedState: string;
  setBuyerSelectedState: (v: string) => void;
  buyerSelectedDistrict: string;
  setBuyerSelectedDistrict: (v: string) => void;
  buyerSelectedTaluk: string;
  setBuyerSelectedTaluk: (v: string) => void;
  buyerSelectedVillage: string;
  setBuyerSelectedVillage: (v: string) => void;
  minPrice: number;
  setMinPrice: (v: number) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minAcres: number;
  setMinAcres: (v: number) => void;
  maxAcres: number;
  setMaxAcres: (v: number) => void;
  resetFilters: () => void;
  handleSelectListing: (id: string) => void;
  setHoveredId: (id: string | null) => void;
  toggleBookmark: (e: React.MouseEvent, id: string) => void;
  handleContactAgentClick: (id: string) => void;
}

export default function BuyerSearchArea({
  listings,
  bookmarks,
  activeHub,
  filteredListings,
  paginatedListings,
  searchError,
  isSearching,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedId,
  hoveredId,
  currentLanguage,
  buyerLandType,
  setBuyerLandType,
  selectedZoning,
  setSelectedZoning,
  buyerAreaQuery,
  setBuyerAreaQuery,
  buyerSelectedState,
  setBuyerSelectedState,
  buyerSelectedDistrict,
  setBuyerSelectedDistrict,
  buyerSelectedTaluk,
  setBuyerSelectedTaluk,
  buyerSelectedVillage,
  setBuyerSelectedVillage,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minAcres,
  setMinAcres,
  maxAcres,
  setMaxAcres,
  resetFilters,
  handleSelectListing,
  setHoveredId,
  toggleBookmark,
  handleContactAgentClick
}: BuyerSearchAreaProps) {

  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(true);

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  const isSearchEmpty = !buyerAreaQuery && 
                        buyerSelectedState === 'ALL' && 
                        buyerSelectedDistrict === 'ALL' && 
                        buyerSelectedTaluk === 'ALL' && 
                        buyerSelectedVillage === 'ALL' && 
                        buyerLandType === 'ALL' && 
                        selectedZoning === 'ALL';

  return (
    <div id="buyer-dashboard-scaffold" className="space-y-8 animate-fade-in font-sans">
      
      {/* ==========================================
          TOP SECTION: SEARCH BAR & FILTER CONTROLS
          ========================================== */}
      <section id="buyer-search-controls" className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* Search header description */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-600 animate-spin-slow" />
              <span>National Land Cadaster Query Desk</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Filter official survey maps, verify ownership ledgers, and query zoning statuses in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition flex items-center gap-2 cursor-pointer shadow-3xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
              <span>{showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}</span>
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl bg-white hover:bg-slate-50/50 transition flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Queries</span>
            </button>
          </div>
        </div>

        {/* COMPACT & HIGHLY VISIBLE PROMINENT SEARCH BAR */}
        <div id="central-search-bar" className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition" />
          </div>
          <input
            type="text"
            placeholder="Search verified lands using Title, Location, Survey Number, Owner Name, Land Type Category..."
            value={buyerAreaQuery}
            onChange={(e) => setBuyerAreaQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200/80 hover:border-slate-300 focus:border-emerald-600 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium outline-none transition shadow-2xs"
          />
          {buyerAreaQuery && (
            <button
              onClick={() => setBuyerAreaQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 font-extrabold text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* EXPANDABLE FILTER GRID (No side overlaps possible) */}
        {showAdvancedFilters && (
          <div id="advanced-filter-controls-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 animate-fade-in">
            
            {/* COLUMN 1: SPECIFIC GEOGRAPHIC BREAKDOWN (State, District, Taluk, Village) */}
            <div className="bg-slate-50/60 border border-slate-200/75 rounded-2xl p-4.5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-[10px] font-black text-emerald-850 uppercase tracking-wider font-mono flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-600" /> Regional Boundaries
                </span>
                {(buyerSelectedState !== 'ALL' || buyerSelectedDistrict !== 'ALL' || buyerSelectedTaluk !== 'ALL' || buyerSelectedVillage !== 'ALL') && (
                  <button
                    onClick={() => {
                      setBuyerSelectedState('ALL');
                      setBuyerSelectedDistrict('ALL');
                      setBuyerSelectedTaluk('ALL');
                      setBuyerSelectedVillage('ALL');
                    }}
                    className="text-[9px] text-rose-600 hover:text-rose-800 underline font-bold"
                  >
                    Reset Geo
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g., Maharashtra"
                    value={buyerSelectedState === 'ALL' ? '' : buyerSelectedState}
                    onChange={(e) => setBuyerSelectedState(e.target.value.trim() ? e.target.value : 'ALL')}
                    className="w-full bg-white border border-slate-200/85 hover:border-slate-300 focus:border-emerald-600 text-xs py-1.5 px-3 rounded-lg text-slate-800 outline-none transition font-medium"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g., Pune"
                    value={buyerSelectedDistrict === 'ALL' ? '' : buyerSelectedDistrict}
                    onChange={(e) => setBuyerSelectedDistrict(e.target.value.trim() ? e.target.value : 'ALL')}
                    className="w-full bg-white border border-slate-200/85 hover:border-slate-300 focus:border-emerald-600 text-xs py-1.5 px-3 rounded-lg text-slate-800 outline-none transition font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1 font-sans">Taluk</label>
                    <input
                      type="text"
                      placeholder="Taluk"
                      value={buyerSelectedTaluk === 'ALL' ? '' : buyerSelectedTaluk}
                      onChange={(e) => setBuyerSelectedTaluk(e.target.value.trim() ? e.target.value : 'ALL')}
                      className="w-full bg-white border border-slate-200/85 hover:border-slate-300 focus:border-emerald-600 text-xs py-1.5 px-2 rounded-lg text-slate-800 outline-none transition font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1 font-sans">Village</label>
                    <input
                      type="text"
                      placeholder="Village"
                      value={buyerSelectedVillage === 'ALL' ? '' : buyerSelectedVillage}
                      onChange={(e) => setBuyerSelectedVillage(e.target.value.trim() ? e.target.value : 'ALL')}
                      className="w-full bg-white border border-slate-200/85 hover:border-slate-300 focus:border-emerald-600 text-xs py-1.5 px-2 rounded-lg text-slate-800 outline-none transition font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: CLASSIFICATION & ZONING (Dropdown choices) */}
            <div className="bg-slate-50/60 border border-slate-200/75 rounded-2xl p-4.5 space-y-4">
              <span className="text-[10px] font-black text-teal-850 uppercase tracking-wider block border-b border-slate-200/80 pb-2 font-mono flex items-center gap-1">
                <Tags className="h-3 w-3 text-teal-600" /> Land Use & Zoning
              </span>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Land Category
                  </label>
                  <select
                    value={buyerLandType}
                    onChange={(e) => setBuyerLandType(e.target.value)}
                    className="w-full bg-white border border-slate-200/85 hover:border-slate-300 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-800 outline-none cursor-pointer font-semibold shadow-xxs transition"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Wet Agricultural">Wet Agricultural (Irrigated)</option>
                    <option value="Dry Agricultural">Dry Agricultural (Rainfed)</option>
                    <option value="Plantation">Horticultural Plantation</option>
                    <option value="Residential">Residential Non-Agri (NA)</option>
                    <option value="Commercial">Commercial Non-Agri (NA)</option>
                    <option value="Industrial">Industrial Logistics Use</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Zoning Clearance Code
                  </label>
                  <select
                    value={selectedZoning}
                    onChange={(e) => setSelectedZoning(e.target.value as ZoningCode | 'ALL')}
                    className="w-full bg-white border border-slate-200/85 hover:border-slate-300 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-800 outline-none cursor-pointer font-semibold shadow-xxs transition"
                  >
                    <option value="ALL">All Zoning Codes</option>
                    <option value="AGRI">AGRI - Agricultural Clearances</option>
                    <option value="RES">RES - Residential Use</option>
                    <option value="COMM">COMM - Commercial Use</option>
                    <option value="IND">IND - Industrial Use</option>
                  </select>
                </div>
              </div>
            </div>

            {/* COLUMN 3: VALUATION RANGE CONTROLS (Price) */}
            <div className="bg-slate-50/60 border border-slate-200/75 rounded-2xl p-4.5 space-y-4">
              <span className="text-[10px] font-black text-rose-850 uppercase tracking-wider block border-b border-slate-200/80 pb-2 font-mono flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-rose-600" /> Valuation Price Range
              </span>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">
                    Min Budget
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100000000}
                    step={100000}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 mt-1">
                    <span>₹0</span>
                    <strong className="text-emerald-700">{formatCurrency(minPrice)}</strong>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">
                    Max Budget
                  </label>
                  <input
                    type="range"
                    min={500000}
                    max={500000000}
                    step={1000000}
                    value={maxPrice > 500000000 ? 500000000 : maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 mt-1">
                    <span>₹50 L</span>
                    <strong className="text-emerald-700">{formatCurrency(maxPrice)}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200">
                  <div>
                    <label className="text-[8px] text-slate-450 uppercase font-black block mb-0.5">Min (INR)</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-800 font-semibold font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-455 uppercase font-black block mb-0.5">Max (INR)</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-800 font-semibold font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 4: AREA TRACT SIZE CONTROLS (Acres) */}
            <div className="bg-slate-50/60 border border-slate-200/75 rounded-2xl p-4.5 space-y-4">
              <span className="text-[10px] font-black text-indigo-855 uppercase tracking-wider block border-b border-slate-200/80 pb-2 font-mono flex items-center gap-1">
                <Maximize2 className="h-3 w-3 text-indigo-600" /> Land Plot Size
              </span>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">
                    Min Size (Acres)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={minAcres}
                    onChange={(e) => setMinAcres(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 mt-1">
                    <span>0 Ac</span>
                    <strong className="text-emerald-700">{minAcres} Ac</strong>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide block">
                    Max Size (Acres)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={1000}
                    step={5}
                    value={maxAcres > 1000 ? 1000 : maxAcres}
                    onChange={(e) => setMaxAcres(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none mt-2"
                  />
                  <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 mt-1">
                    <span>1 Ac</span>
                    <strong className="text-emerald-700">{maxAcres} Ac</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200">
                  <div>
                    <label className="text-[8px] text-slate-455 uppercase font-black block mb-0.5">Min Acres</label>
                    <input
                      type="number"
                      step="0.01"
                      value={minAcres}
                      onChange={(e) => setMinAcres(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-800 font-semibold font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-455 uppercase font-black block mb-0.5">Max Acres</label>
                    <input
                      type="number"
                      step="0.01"
                      value={maxAcres}
                      onChange={(e) => setMaxAcres(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-800 font-semibold font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* ==========================================
          MIDDLE SECTION: SAVED BOOKMARKS AND RESULTS
          ========================================== */}
      
      {/* Horizontal, neat Saved Bookmarks bar if there are bookmarks */}
      {bookmarks.length > 0 && (
        <section id="buyer-saved-bookmarks-carousel" className="bg-slate-50 border border-slate-200/95 rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
            <FolderHeart className="h-4 w-4 text-rose-500 fill-rose-50" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
              Saved Bookmarked Tracts ({bookmarks.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2 animate-fade-in">
            {bookmarks.map(id => {
              const item = listings.find(l => l.id === id);
              if (!item) return null;
              return (
                <button
                  key={`saved-${id}`}
                  onClick={() => handleSelectListing(id)}
                  className={`px-3 py-2 bg-white hover:bg-slate-100 border rounded-xl text-xs font-bold transition flex items-center gap-3 shadow-3xs cursor-pointer ${
                    selectedId === id ? 'border-emerald-600 ring-2 ring-emerald-500/10' : 'border-slate-205'
                  }`}
                >
                  <span className="truncate max-w-[150px] text-slate-855">{item.title}</span>
                  <span className="text-[9px] bg-emerald-50 border text-emerald-800 px-1.5 py-0.5 rounded-lg font-mono">
                    {formatArea(item.acres, item.hub)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* PRIMARY CONTAINER OF CLASSED RESULTS */}
      <section id="listings-grid-view" className="space-y-6">
        
        {/* Header section with catalog name and search error/status indicators */}
        <div className="flex items-center justify-between border-b pb-3.5 border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-wider font-mono text-slate-800 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-600" />
            <span>Land Catalog and Records</span>
          </h3>
          <span className="bg-emerald-50 text-emerald-900 border border-emerald-100 px-3 py-1 rounded-xl text-[10px] font-black font-mono">
            {filteredListings.length} Land parcels listed in current hub
          </span>
        </div>

        {/* Status Views */}
        {searchError ? (
          <div className="text-center py-16 bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-rose-900 text-sm font-black">Database Filter Conflict</h4>
            <p className="text-xs text-rose-700 font-medium max-w-md mx-auto leading-relaxed">{searchError}</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm hover:shadow-md"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : isSearching ? (
          <div className="text-center py-24 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto" />
            <p className="text-xs text-slate-500 font-black uppercase tracking-widest font-mono">Querying land ledger database...</p>
          </div>
        ) : isSearchEmpty ? (
          <div className="text-center py-24 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 space-y-4 max-w-3xl mx-auto">
            <Search className="h-12 w-12 text-slate-300 mx-auto animate-pulse" />
            <h4 className="text-slate-800 text-sm font-black uppercase tracking-wide">Enter a search query to search the land registry</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
              To secure buyer privacy, no land results are loaded automatically. Use the search bar or location filters above to perform a secure search query.
            </p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 border border-dashed border-slate-250 rounded-2xl p-8 space-y-4 max-w-3xl mx-auto">
            <SlidersHorizontal className="h-12 w-12 text-slate-300 mx-auto animate-pulse" />
            <h4 className="text-slate-800 text-sm font-black uppercase tracking-wide">No matching land records found.</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
              We couldn't locate any land registries matching your search query. Try typing another location, survey number, or state. You can also register new land parcels in the <strong className="text-slate-700">"Register & Sell Land"</strong> portal, and they will instantaneously become indexable here.
            </p>
            <button 
              onClick={resetFilters}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Responsive Multi-column spacing constraints - beautifully styled with large gaps */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedListings.map((item) => (
              <PropertyCard
                key={item.id}
                listing={item}
                isSelected={selectedId === item.id}
                isHovered={hoveredId === item.id}
                isBookmarked={bookmarks.includes(item.id)}
                currentLanguage={currentLanguage}
                onSelect={() => handleSelectListing(item.id)}
                onHover={(isHover) => setHoveredId(isHover ? item.id : null)}
                onToggleBookmark={(e) => toggleBookmark(e, item.id)}
                onContactAgent={() => handleContactAgentClick(item.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          BOTTOM SECTION: PAGINATION CONTROLS
          ========================================== */}
      {totalPages > 1 && !searchError && !isSearching && filteredListings.length > 0 && (
        <section id="buyer-search-pagination" className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-3xs">
          <div className="flex items-center justify-between font-mono text-xs select-none">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                document.getElementById('listings-grid-view')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl border text-slate-700 bg-white font-extrabold transition shadow-3xs ${
                currentPage === 1 ? 'opacity-35 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
              }`}
            >
              ← Previous Page
            </button>
            
            <span className="text-slate-600 font-extrabold bg-slate-50 px-4 py-1.5 rounded-xl border text-[11px] shadow-3xs">
              Page <strong className="text-slate-950 font-black">{currentPage}</strong> of <strong className="text-slate-950 font-black">{totalPages}</strong>
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                document.getElementById('listings-grid-view')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-xl border text-slate-700 bg-white font-extrabold transition shadow-3xs ${
                currentPage === totalPages ? 'opacity-35 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
              }`}
            >
              Next Page →
            </button>
          </div>
        </section>
      )}

    </div>
  );
}

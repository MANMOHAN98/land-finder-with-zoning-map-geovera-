import React, { useState } from 'react';
import { UserProfile, LandListing, InquiryMessage } from '../types';
import { 
  Compass, 
  FolderHeart, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Layers,
  ArrowRight,
  Database,
  Search,
  BookOpen
} from 'lucide-react';

interface BuyerDashboardPageProps {
  currentUser: UserProfile;
  listings: LandListing[];
  bookmarks: string[];
  messages: InquiryMessage[];
  setActiveMainView: (view: any) => void;
  setBuyerAreaQuery: (query: string) => void;
}

export default function BuyerDashboardPage({
  currentUser,
  listings,
  bookmarks,
  messages,
  setActiveMainView,
  setBuyerAreaQuery
}: BuyerDashboardPageProps) {
  const [localQuery, setLocalQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBuyerAreaQuery(localQuery);
    setActiveMainView('buyer-search');
  };

  const mySavedCount = bookmarks.length;
  const myOffersCount = messages.filter(m => m.buyerId === currentUser.id).length;

  return (
    <div id="buyer-dashboard-home" className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* 1. HERO GREETING BLOCK */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-800/40 rounded-full">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            Verified Buyer Account
          </div>
          
          <h2 className="text-xl md:text-3xl font-black font-display tracking-tight leading-none text-slate-100">
            Welcome back, <span className="text-emerald-400">{currentUser.name}</span>!
          </h2>
          
          <p className="text-slate-300 text-xs md:text-sm font-medium max-w-xl">
            You are logged into the State land registry and zoning compliance board. Review and trace verified land blocks, check survey maps, and manage secure brokerage tenders.
          </p>
        </div>
      </div>

      {/* 2. CENTRAL PROMINENT SEARCH PROMPT - AS REQUESTED */}
      <div className="bg-white border-2 border-emerald-100/80 hover:border-emerald-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-all duration-300">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-xs">
            ✨
          </div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
            Central Land Registry Search
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Search for land using location, survey number, land type, or area.
          </p>
        </div>

        <form onSubmit={handleQuickSearch} className="relative group max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition" />
            </div>
            <input
              type="text"
              placeholder="Enter survey number, location state/village, land type or owner name..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-350 focus:border-emerald-600 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 font-semibold outline-none transition"
              id="dashboard-quick-search-input"
            />
          </div>
          <button 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <span>Search Registry</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 font-mono">
          No listings preloaded initially. Type a query above to initiate a direct database audit request.
        </p>
      </div>

      {/* 3. METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div 
          onClick={() => setActiveMainView('buyer-search')}
          className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-emerald-600 transition-all cursor-pointer group hover:shadow-2xs"
          id="metric-card-search"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-sky-50 text-sky-650 rounded-xl group-hover:bg-sky-100 transition-colors">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-505 font-mono font-bold uppercase">Explore</span>
          </div>
          <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider font-mono mt-4">Tract Explorer</h4>
          <p className="text-xxs text-slate-450 mt-1 leading-normal font-sans">Audit and filter the live cadastral index for any village, patta, or zoning code.</p>
          <div className="flex items-center gap-1.5 text-sky-650 hover:text-sky-700 text-xxs font-bold mt-4">
            Open Registry Search <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        <div 
          onClick={() => setActiveMainView('buyer-saved')}
          className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-emerald-600 transition-all cursor-pointer group hover:shadow-2xs"
          id="metric-card-saved"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors">
              <FolderHeart className="h-5 w-5" />
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 px-2 py-0.5 rounded-lg font-mono font-bold">
              {mySavedCount} Saved
            </span>
          </div>
          <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider font-mono mt-4">Bookmarks Closet</h4>
          <p className="text-xxs text-slate-450 mt-1 leading-normal font-sans">Fast-track to your target records. Keep tabs on title verification and zoning updates.</p>
          <div className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-xxs font-bold mt-4">
            View Bookmarks <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        <div 
          onClick={() => setActiveMainView('buyer-messages')}
          className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-emerald-600 transition-all cursor-pointer group hover:shadow-2xs"
          id="metric-card-messages"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-lg font-mono font-bold">
              {myOffersCount} Offers
            </span>
          </div>
          <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider font-mono mt-4">Inquiries & Tenders</h4>
          <p className="text-xxs text-slate-450 mt-1 leading-normal font-sans">Track communication logs, active crop-tenders, price counter-offers, and legal drafts.</p>
          <div className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xxs font-bold mt-4">
            View Sent Offers <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* 4. PLATFORM INTEGRITY BANNER */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="p-2.5 bg-white border rounded-xl text-emerald-600 shadow-3xs">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Secure Cryptographic Auditing</h5>
            <p className="text-[11px] text-slate-500 leading-normal max-w-md font-sans">
              All cadastral land registries undergo multi-signature planning authority ledger verification. SHA-256 blocks guarantee records cannot be altered.
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-400 bg-white border px-3 py-1 rounded-lg shadow-3xs self-stretch sm:self-auto flex items-center justify-center">
          CAD-LEDGER-V4_STABLE
        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Users, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  Lock, 
  Mail, 
  Check, 
  Building, 
  HelpCircle,
  BarChart3,
  Search,
  Monitor,
  MousePointerClick,
  FileText,
  UserCheck,
  Send,
  Sparkle,
  MapPin
} from 'lucide-react';

interface LandingPageProps {
  activeSubView?: 'landing' | 'about' | 'features' | 'contact';
  onNavigateToView: (view: string) => void;
  onSelectRolePreference?: (role: 'buyer' | 'seller') => void;
  onSetAuthMode?: (mode: 'login' | 'register') => void;
}

export default function LandingPage({
  activeSubView = 'landing',
  onNavigateToView,
  onSelectRolePreference,
  onSetAuthMode
}: LandingPageProps) {
  // Simple success state for the contact form
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  // Interactive Land Measurement Calculator state
  const [calcLength, setCalcLength] = useState<number>(330);
  const [calcWidth, setCalcWidth] = useState<number>(132);
  const [calcUnit, setCalcUnit] = useState<'feet' | 'meters'>('feet');

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSubView]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const handleGetStarted = (role?: 'buyer' | 'seller') => {
    if (role) {
      if (onSelectRolePreference) onSelectRolePreference(role);
    }
    if (onSetAuthMode) onSetAuthMode('register');
    onNavigateToView('register');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const isFeet = calcUnit === 'feet';
  const sqft = isFeet ? (calcLength * calcWidth) : (calcLength * calcWidth * 10.7639);
  const sqm = isFeet ? (calcLength * calcWidth / 10.7639) : (calcLength * calcWidth);
  const acres = sqft / 43560;
  const guntas = sqft / 1089;
  const hectares = sqm / 10000;

  // 15 requested feature cards
  const platformFeatures = [
    {
      title: "Verified Land Listings",
      desc: "Explore pre-audited land deeds that match governmental RERA registries, bypassing title disputes.",
      icon: ShieldCheck,
      color: "bg-emerald-50 border-emerald-150 text-emerald-700 hover:border-emerald-500/40"
    },
    {
      title: "Secure Buyer & Seller Accounts",
      desc: "Role-specific verified workspaces allowing direct transparent stakeholder collaboration.",
      icon: Users,
      color: "bg-indigo-50 border-indigo-150 text-indigo-700 hover:border-indigo-500/40"
    },
    {
      title: "Advanced Land Search",
      desc: "Filter available parcels by soil health, water depth, taluk districts, and polygon sizes instantly.",
      icon: Search,
      color: "bg-teal-50 border-teal-150 text-teal-700 hover:border-teal-500/40"
    },
    {
      title: "Land Measurement Calculator",
      desc: "Convert property dimensions instantly between standard Indian surveyor units like Acres, Guntas, and Hectares.",
      icon: Compass,
      color: "bg-amber-50 border-amber-150 text-amber-700 hover:border-amber-500/40"
    },
    {
      title: "Saved Properties",
      desc: "Bookmark and monitor premium tracts inside secure cabins to quickly trace pricing movements.",
      icon: Layers,
      color: "bg-rose-50 border-rose-150 text-rose-750 hover:border-rose-500/40"
    },
    {
      title: "Buyer Dashboard",
      desc: "Review crop suitability insights, check official survey logs, and manage private broker tenders.",
      icon: Monitor,
      color: "bg-teal-50 border-teal-150 text-teal-700 hover:border-teal-500/40"
    },
    {
      title: "Seller Dashboard",
      desc: "Promote pre-vetted tracts, review buyer unique search impressions, and track interest graphs.",
      icon: BarChart3,
      color: "bg-purple-50 border-purple-150 text-purple-700 hover:border-purple-500/40"
    },
    {
      title: "Property Management",
      desc: "Complete suite to draft listings, update crop suitability indices, and upload physical land map PDFs.",
      icon: Building,
      color: "bg-orange-50 border-orange-150 text-orange-700 hover:border-orange-500/40"
    },
    {
      title: "Lead Management",
      desc: "Receive encrypted direct inquiries and dispatch communication tickets without middleman logs.",
      icon: Mail,
      color: "bg-sky-50 border-sky-150 text-sky-700 hover:border-sky-500/40"
    },
    {
      title: "Role-Based Access",
      desc: "Protected portals specialized purely for land seekers, property sellers, and certified surveyors.",
      icon: UserCheck,
      color: "bg-emerald-50 border-emerald-150 text-emerald-700 hover:border-emerald-500/40"
    },
    {
      title: "Secure Authentication",
      desc: "Industrial-grade credentials encryption guarding registration deeds and workspace sessions.",
      icon: Lock,
      color: "bg-indigo-50 border-indigo-150 text-indigo-700 hover:border-indigo-500/40"
    },
    {
      title: "Cross-Device Login",
      desc: "Access your dashboard assets flawlessly in the office on desktop or outdoors on tablets and smartphones.",
      icon: Monitor,
      color: "bg-violet-50 border-violet-150 text-violet-750 hover:border-violet-500/40"
    },
    {
      title: "Responsive Design",
      desc: "Pristinely balanced responsive design layout fitting widescreen desktop formats down to mobile screens.",
      icon: CheckCircle,
      color: "bg-pink-50 border-pink-150 text-pink-700 hover:border-pink-500/40"
    },
    {
      title: "Professional Analytics",
      desc: "Review regional benchmark pricing indices, active wetland hazard warnings, and nearby municipal guidelines.",
      icon: TrendingUp,
      color: "bg-blue-50 border-blue-150 text-blue-700 hover:border-blue-500/40"
    },
    {
      title: "User Activity Tracking",
      desc: "Audit trailing files, track listing histories, and secure transaction logs within an unalterable system registry.",
      icon: Clock,
      color: "bg-slate-50 border-slate-150 text-slate-700 hover:border-slate-550"
    }
  ];

  return (
    <div className="font-sans bg-slate-50 text-slate-800 scroll-smooth selection:bg-emerald-600 selection:text-white">
      
      {activeSubView === 'landing' && (
        <div className="pb-16">
          {/* ==========================================
              SECTION 1 - HERO SECTION WITH METRIC TOOL
              ========================================== */}
          <section id="hero-section" className="relative text-slate-900 bg-gradient-to-b from-[#f0fdf4] to-slate-50 overflow-hidden py-16 lg:py-28 border-b border-emerald-100/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.07),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-15 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text branding */}
          <div className="lg:col-span-7 space-y-8 text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-[10.5px] font-bold tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              🇮🇳 National Spatial Cadaster Initiative
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight text-slate-950">
                GEOVERA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                  Locate. Verify. Own.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-650 max-w-xl font-medium leading-relaxed">
                GEOVERA is a secure land discovery and property marketplace that connects land buyers and sellers through verified listings and smart mapping. Discover premium, pre-vetted tracts, calculate dimensions instantly, and verify titles securely with India's trusted cadaster platform.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md">
              <button 
                onClick={() => handleGetStarted()}
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-150 shadow-md hover:shadow-emerald-500/10 cursor-pointer text-center"
              >
                Get Started
              </button>
              <button 
                onClick={() => {
                  onNavigateToView('about');
                }}
                className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer text-center shadow-xxs"
              >
                Learn More
              </button>
            </div>

            {/* Built-in Platform trust indicators */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-205 max-w-lg text-left">
              <div>
                <span className="block text-xl font-black font-mono text-slate-950 leading-none">100%</span>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1.5 block">Verified Titles</span>
              </div>
              <div>
                <span className="block text-xl font-black font-mono text-slate-950 leading-none">15k+</span>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1.5 block">Acres Mapped</span>
              </div>
              <div>
                <span className="block text-xl font-black font-mono text-slate-950 leading-none">Zero</span>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1.5 block">Middleman Fees</span>
              </div>
            </div>
          </div>

          {/* Right Side: Land Measurement Calculator */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4 animate-fade-in flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Compass className="h-4.5 w-4.5 text-emerald-600 animate-spin-slow" />
                  <span className="text-[10px] font-black uppercase tracking-wider font-mono text-slate-800">
                    Measurement Calculator
                  </span>
                </div>
                <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9px] font-bold">
                  <button
                    onClick={() => setCalcUnit('feet')}
                    type="button"
                    className={`px-2 py-0.5 rounded ${calcUnit === 'feet' ? 'bg-white text-emerald-950 shadow-xxs font-extrabold' : 'text-slate-500 hover:text-slate-950'}`}
                  >
                    Feet
                  </button>
                  <button
                    onClick={() => setCalcUnit('meters')}
                    type="button"
                    className={`px-2 py-0.5 rounded ${calcUnit === 'meters' ? 'bg-white text-emerald-950 shadow-xxs font-extrabold' : 'text-slate-500 hover:text-slate-950'}`}
                  >
                    Meters
                  </button>
                </div>
              </div>

              {/* Slider Inputs */}
              <div className="space-y-4 pt-3">
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-xxs font-bold text-slate-500">
                    <span>LENGTH ({isFeet ? 'FT' : 'M'})</span>
                    <input
                      type="number"
                      value={calcLength}
                      onChange={(e) => setCalcLength(Math.max(0, Number(e.target.value)))}
                      className="w-16 text-right font-mono bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-850 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={calcLength}
                    onChange={(e) => setCalcLength(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-150 rounded-lg appearance-none"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-xxs font-bold text-slate-500">
                    <span>WIDTH ({isFeet ? 'FT' : 'M'})</span>
                    <input
                      type="number"
                      value={calcWidth}
                      onChange={(e) => setCalcWidth(Math.max(0, Number(e.target.value)))}
                      className="w-16 text-right font-mono bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-850 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-150 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculator Calculations Panel */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                <span className="text-[9px] font-bold text-slate-450 block uppercase tracking-wider font-mono">
                  Calculated Layout Area
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                  {calcLength} {isFeet ? 'ft' : 'm'} × {calcWidth} {isFeet ? 'ft' : 'm'} = {Math.round(calcLength * calcWidth).toLocaleString()}{' '}
                  {isFeet ? 'sq.ft' : 'sq.m'}
                </span>
              </div>

              {/* Grid with automated Indian land divisions */}
              <div className="grid grid-cols-2 gap-2 text-xxs font-semibold">
                <div className="bg-emerald-50/40 border border-emerald-100 p-2 rounded-xl text-center">
                  <span className="text-[8px] text-emerald-800 block uppercase font-mono tracking-wider">Acres</span>
                  <span className="text-xs font-bold text-emerald-900 font-mono">{acres.toFixed(3)} Ac</span>
                </div>
                <div className="bg-teal-50/45 border border-teal-100 p-2 rounded-xl text-center">
                  <span className="text-[8px] text-teal-805 block uppercase font-mono tracking-wider">Hectares</span>
                  <span className="text-xs font-bold text-teal-900 font-mono">{hectares.toFixed(3)} Ha</span>
                </div>
                <div className="bg-amber-50/45 border border-amber-100 p-2 rounded-xl text-center">
                  <span className="text-[8px] text-amber-800 block uppercase font-mono tracking-wider font-sans">Guntas</span>
                  <span className="text-xs font-bold text-amber-900 font-mono">{guntas.toFixed(2)} Gt</span>
                </div>
                <div className="bg-indigo-50/45 border border-indigo-100 p-2 rounded-xl text-center">
                  <span className="text-[8px] text-indigo-800 block uppercase font-mono tracking-wider">
                    {isFeet ? 'Square Meters' : 'Square Feet'}
                  </span>
                  <span className="text-xs font-bold text-indigo-900 font-mono">
                    {isFeet ? Math.round(sqm).toLocaleString() : Math.round(sqft).toLocaleString()}{' '}
                    {isFeet ? 'sq.m' : 'sq.ft'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-[8px] text-slate-400 font-bold text-center font-mono uppercase tracking-widest pt-1">
              ✓ Complies with Standard Indian Survey Conventions
            </div>
          </div>

        </div>
      </section>
        </div>
      )}

      {activeSubView === 'features' && (
        <div className="space-y-24 py-16">
          {/* ==========================================
              SECTION 2 - FEATURE SECTION (AT THE TOP)
              ========================================== */}
          <section id="features-section" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-150 rounded-md">
            <Sparkle className="h-3.5 w-3.5 text-indigo-700 animate-pulse fill-indigo-700" />
            <span className="text-[9.5px] font-black uppercase tracking-wider text-indigo-800 font-mono">
              All-In-One Enterprise Toolkit
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-display">
            Professional Web Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
            Everything you need to successfully execute verified acquisitions, manage private lists, and safely trade estates.
          </p>
        </div>

        {/* 15 Feature Cards arranged in a beautiful Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xxs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-emerald-500/20 text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors ${feat.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      {feat.title}
                    </h3>
                    <p className="text-xxs sm:text-xs text-slate-500 font-semibold leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
                
                {/* Visual arrow design accent */}
                <div className="pt-4 flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <span>Learn More</span>
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ==========================================
          SECTION 3 - HOW IT WORKS (STRICT SEQUENCE)
          ========================================== */}
      <section id="how-it-works-section" className="bg-white border-t border-b border-slate-200/50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-14">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-850 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md font-mono">
              Automated Operations Loop
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight font-display">
              How the Platform Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
              An organized 5-step transaction sequence verified by the regulatory cadaster board.
            </p>
          </div>

          {/* Sequential 5 steps layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            <div className="absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-slate-100 hidden md:block" />
            
            {/* Step 1 */}
            <div className="space-y-3 text-center md:text-left relative z-10">
              <div className="h-14 w-14 rounded-full bg-slate-950 text-white font-extrabold text-xs flex items-center justify-center mx-auto md:mx-0 border-4 border-slate-50 shadow-sm font-mono">
                01
              </div>
              <h4 className="text-xs font-black tracking-wide uppercase text-slate-900">
                1. Register
              </h4>
              <p className="text-xxs sm:text-xs text-slate-500 font-semibold leading-relaxed">
                Create a secure citizen account with encrypted credentials and verified email metrics.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 text-center md:text-left relative z-10">
              <div className="h-14 w-14 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mx-auto md:mx-0 border-4 border-slate-50 shadow-sm font-mono">
                02
              </div>
              <h4 className="text-xs font-black tracking-wide uppercase text-slate-900">
                2. Choose Role
              </h4>
              <p className="text-xxs sm:text-xs text-slate-500 font-semibold leading-relaxed">
                Configure your landing preference as a Land Buyer, private Seller, or licensed land Broker.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 text-center md:text-left relative z-10">
              <div className="h-14 w-14 rounded-full bg-slate-950 text-white font-extrabold text-xs flex items-center justify-center mx-auto md:mx-0 border-4 border-slate-50 shadow-sm font-mono">
                03
              </div>
              <h4 className="text-xs font-black tracking-wide uppercase text-slate-900">
                3. Secure Login
              </h4>
              <p className="text-xxs sm:text-xs text-slate-500 font-semibold leading-relaxed">
                Access your custom workspace verified through secure multi-layered protocols.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 text-center md:text-left relative z-10">
              <div className="h-14 w-14 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mx-auto md:mx-0 border-4 border-slate-50 shadow-sm font-mono">
                04
              </div>
              <h4 className="text-xs font-black tracking-wide uppercase text-slate-900">
                4. View Dashboard
              </h4>
              <p className="text-xxs sm:text-xs text-slate-500 font-semibold leading-relaxed">
                Analyze micro-geographies, upload Patta maps, track unique clicks, and review direct leads.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-3 text-center md:text-left relative z-10">
              <div className="h-14 w-14 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center mx-auto md:mx-0 border-4 border-slate-50 shadow-sm font-mono">
                05
              </div>
              <h4 className="text-xs font-black tracking-wide uppercase text-slate-900">
                5. Buy or Sell
              </h4>
              <p className="text-xxs sm:text-xs text-slate-500 font-semibold leading-relaxed">
                Connect directly, negotiate terms cleanly, and dispatch transaction tenders securely.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4 - BENEFITS SECTION
          ========================================== */}
      <section id="benefits-section" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md font-mono">
            Value Disclosures
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight font-display">
            Platform Benefits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
            Clear structural benefits customized uniquely based on your registered workflow status.
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
          
          {/* Buyers benefits card */}
          <div className="bg-white border hover:border-emerald-500/30 rounded-3xl p-8 space-y-6 shadow-xxs font-sans text-left transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xxs">
              🏆
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black text-slate-900 font-display">
                Benefits for Buyers
              </h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Securely locate land investments with precheck RERA deeds, active municipal classification scoring, and direct title claims comparisons.
              </p>
            </div>
            <ul className="space-y-3.5 pt-4 border-t border-slate-100 text-xxs font-bold text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={3} />
                <span>Verified cadastral and revenue maps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={3} />
                <span>Detailed soil analysis data indices</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={3} />
                <span>Zero commission overhead on listings</span>
              </li>
            </ul>
          </div>

          {/* Sellers benefits card */}
          <div className="bg-white border hover:border-amber-500/30 rounded-3xl p-8 space-y-6 shadow-xxs font-sans text-left transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg shadow-xxs">
              📈
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black text-slate-900 font-display">
                Benefits for Sellers
              </h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Connect efficiently with pre-authenticated crop and estate buyers. List Patta tracts easily and optimize search indices values with ease.
              </p>
            </div>
            <ul className="space-y-3.5 pt-4 border-t border-slate-100 text-xxs font-bold text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-600 shrink-0" strokeWidth={3} />
                <span>List boundaries easily in minutes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-600 shrink-0" strokeWidth={3} />
                <span>Direct exposure to registered buyers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-600 shrink-0" strokeWidth={3} />
                <span>Track spatial listing performance graphs</span>
              </li>
            </ul>
          </div>

        </div>
      </section>
        </div>
      )}

      {activeSubView === 'about' && (
        <div className="space-y-24 py-16">
          {/* ==========================================
              SECTION 5 - ABOUT SECTION
              ========================================== */}
          <section id="about-section" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden text-left">
          <div className="absolute right-0 top-0 p-8 opacity-5 text-slate-400 pointer-events-none">
            <Compass className="h-44 w-44" />
          </div>
          
          <div className="max-w-4xl space-y-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#047857] bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md">
              About GEOVERA
            </span>
            
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display leading-tight">
                Empowering Indian Land Demarcation & Legal Verification
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                An advanced spatial discovery tool designed to bypass intermediary broker cuts, providing citizens with accurate municipal data.
              </p>
            </div>

            {/* Structured Company Info, Purpose, Mission, Vision explanations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 text-left">
              
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-emerald-700 uppercase font-mono tracking-wider">Company Information</span>
                <h5 className="text-xs font-black text-slate-950 uppercase">Corporate Details</h5>
                <div className="text-xxs sm:text-xs text-slate-500 leading-relaxed font-semibold space-y-1">
                  <p><strong>GEOVERA Pvt Ltd</strong></p>
                  <p>Registered Land Marketplace with verified spatial analytics.</p>
                  <p className="text-[10px]">HQ: VSSP Arcade, Sira, Tumkur, Karnataka, India</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-emerald-700 uppercase font-mono tracking-wider">Platform Purpose</span>
                <h5 className="text-xs font-black text-slate-950 uppercase">Unified Ecosystem</h5>
                <p className="text-xxs sm:text-xs text-slate-500 leading-relaxed font-semibold">
                  A high-tech digital directory mapping registered lands and zoning parameters directly with Indian sub-registrar ledgers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-emerald-700 uppercase font-mono tracking-wider">Mission</span>
                <h5 className="text-xs font-black text-slate-950 uppercase">Bypasses Middlemen</h5>
                <p className="text-xxs sm:text-xs text-slate-500 leading-relaxed font-semibold">
                  Grants instant verification tools, detailed soil compositions, crop capacity advice, and direct secured lines to sellers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-emerald-700 uppercase font-mono tracking-wider">Vision</span>
                <h5 className="text-xs font-black text-slate-950 uppercase">Absolute Integrity</h5>
                <p className="text-xxs sm:text-xs text-slate-500 leading-relaxed font-semibold">
                  We integrate complete spatial tracking datasets with zero hidden fee matrices, safeguarding citizen interests completely.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-105">
              <div className="flex gap-2.5 text-xs font-semibold text-slate-705">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                <span>100% free of middleman commissions or broker fee traps.</span>
              </div>
              <div className="flex gap-2.5 text-xs font-semibold text-slate-705">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                <span>Official boundary checking aligned with sub-registrar databases.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 6 - TESTIMONIALS
          ========================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#059669] bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md">
            Citizen Consensus
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight font-display">
            User Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
            Hear from developers, agriculturalists, and sellers who rely on our portal parameters daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xxs relative space-y-4 hover:border-emerald-500/25 transition duration-300">
            <span className="text-4xl text-emerald-300 font-serif absolute top-2 left-4 select-none opacity-40">“</span>
            <p className="text-xxs sm:text-xs text-slate-650 italic pt-3 leading-relaxed font-semibold">
              "Working with real satellite boundaries overlayed onto official survey boundaries saved our planning division weeks of research."
            </p>
            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center font-mono">
                AM
              </div>
              <div>
                <span className="block text-xs font-black text-slate-900">Arjun Mehta</span>
                <span className="block text-[8px] text-slate-450 uppercase font-black tracking-wider">Acquisitions Planner, Pune</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xxs relative space-y-4 hover:border-emerald-500/25 transition duration-300">
            <span className="text-4xl text-indigo-300 font-serif absolute top-2 left-4 select-none opacity-40">“</span>
            <p className="text-xxs sm:text-xs text-slate-650 italic pt-3 leading-relaxed font-semibold">
              "I registered our family agricultural plots easily. Bypassed intermediate brokerage cuts beautifully and connected with legal cash buyers."
            </p>
            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-emerald-650 text-white font-extrabold text-[10px] flex items-center justify-center font-mono">
                RP
              </div>
              <div>
                <span className="block text-xs font-black text-slate-900">Radha Patil</span>
                <span className="block text-[8px] text-slate-450 uppercase font-black tracking-wider">Independent Landowner, Tumkur</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xxs relative space-y-4 hover:border-emerald-500/25 transition duration-300">
            <span className="text-4xl text-teal-300 font-serif absolute top-2 left-4 select-none opacity-40">“</span>
            <p className="text-xxs sm:text-xs text-slate-650 italic pt-3 leading-relaxed font-semibold">
              "The dynamic soil reports and legal setback compliance checks gave our investment board ultimate peace of mind. Exceptional tool!"
            </p>
            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center font-mono">
                DK
              </div>
              <div>
                <span className="block text-xs font-black text-slate-900">Divya Kulkarni</span>
                <span className="block text-[8px] text-slate-450 uppercase font-black tracking-wider">Agri-Syndicate Director</span>
              </div>
            </div>
          </div>

        </div>
      </section>
        </div>
      )}

      {activeSubView === 'contact' && (
        <div className="space-y-24 py-16">
          {/* ==========================================
              SECTION 7 - CONTACT SECTION
              ========================================== */}
          <section id="contact-section" className="max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-10 pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
            
            {/* Left side address info */}
            <div className="md:col-span-5 space-y-6 text-left">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981] bg-emerald-950 border border-emerald-800 px-2.1 py-0.5 rounded font-mono">
                  Get In Touch
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-100">
                  Contact Us
                </h3>
                <p className="text-xxs sm:text-xs text-slate-400 font-semibold leading-relaxed">
                  Have questions about buying or selling land? Our team of geographers is here to help.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center text-xs">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500 font-mono">Support Email</span>
                    <a href="mailto:support@landfinder.in" className="text-xs font-black text-slate-100 hover:text-emerald-400 font-mono">
                      support@landfinder.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center text-xs">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500 font-mono">Office Address</span>
                    <p className="text-xxs font-black text-slate-200 block whitespace-pre-line leading-relaxed font-sans mt-0.5">
                      VSSP Arcade
                      Sira, Tumkur
                      Karnataka, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side support form */}
            <div className="md:col-span-7 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              
              {contactSuccess ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-12 animate-fade-in text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-405 flex items-center justify-center text-lg animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-xs font-black uppercase text-slate-100">Message Sent Successfully</h4>
                  <p className="text-[10px] text-slate-400 font-medium max-w-xs">
                    Your message has been dispatched. Our team will get back to you within 24 working hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="e.g. Ketan Varma" 
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs outline-none focus:border-emerald-600 text-white placeholder:text-slate-600 transition" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="e.g. ketan@varma.com" 
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs outline-none focus:border-emerald-600 text-white placeholder:text-slate-600 transition" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="e.g. Land registry query" 
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs outline-none focus:border-emerald-600 text-white placeholder:text-slate-600 transition" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Message</label>
                    <textarea 
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Specify your inquiry details here cleanly..." 
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs outline-none focus:border-emerald-600 text-white placeholder:text-slate-600 resize-none transition" 
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xxs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="h-3 w-3" /> Send Message
                  </button>
                </form>
              )}

            </div>

          </div>
        </div>
      </section>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { GeoveraLogo } from './GeoveraLogo';

interface PublicFooterProps {
  onNavigateToView: (view: any) => void;
}

export default function PublicFooter({ onNavigateToView }: PublicFooterProps) {
  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          
          {/* Column 1: Company Information */}
          <div className="md:col-span-5 space-y-3.5 text-left">
            <h4 className="font-extrabold text-white uppercase font-mono tracking-widest text-[9px]">Company Information</h4>
            <div className="flex items-center gap-2">
              <GeoveraLogo height={32} width={32} showText={false} />
              <span className="font-extrabold text-white uppercase tracking-widest text-[12px] font-display">GEOVERA</span>
            </div>
            <p className="leading-relaxed font-semibold text-slate-400">
              Helping buyers and sellers connect through a secure and intelligent land marketplace.
            </p>
            <div className="space-y-1 pt-1">
              <span className="block text-[9px] font-bold text-white uppercase font-mono">Address:</span>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed whitespace-pre-line">
                VSSP Arcade,
                Sira,
                Tumkur,
                Karnataka,
                India
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-4 space-y-3 text-left">
            <h4 className="font-extrabold text-white uppercase font-mono tracking-widest text-[9px]">Quick Links</h4>
            <ul className="space-y-2.5 font-bold text-slate-400">
              <li>
                <button 
                  onClick={() => onNavigateToView('landing')} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToView('about')} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToView('features')} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToView('contact')} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToView('login')} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToView('register')} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer"
                >
                  Register
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Verification & Socials */}
          <div className="md:col-span-3 space-y-3.5 text-left">
            <h4 className="font-extrabold text-white uppercase font-mono tracking-widest text-[9px]">Legal Compliance</h4>
            <ul className="space-y-2.5 font-bold text-slate-450">
              <li>
                <button 
                  onClick={() => alert("Privacy Policy: All data logs processed conform with Section 43A of local Information Technology laws.")} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer text-slate-400"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert("Terms & Conditions: Registration validates compliance with sub-registrar deed guidelines.")} 
                  className="hover:text-emerald-400 bg-transparent text-left outline-none border-none cursor-pointer text-slate-400"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
            
            <div className="flex items-center gap-3 pt-1 text-slate-400">
              <span className="text-[9px] uppercase tracking-widest font-black font-mono">Socials:</span>
              <span className="hover:text-emerald-400 transition cursor-pointer font-bold">Twitter</span>
              <span className="text-slate-650">|</span>
              <span className="hover:text-emerald-400 transition cursor-pointer font-bold">LinkedIn</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-slate-500 text-center gap-4">
          <span>© 2026 GEOVERA. India's Smart Discovery Platform. All Sovereign Rights Reserved.</span>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>TLS 1.3 ENCRYPTED CONNECTION</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

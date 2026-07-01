import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Clock, 
  History, 
  Lock, 
  BadgeCheck, 
  Hash, 
  FileCheck,
  Calendar
} from 'lucide-react';
import { UserProfile, LoginLog, formatToIST } from '../types';

interface ProfilePageProps {
  currentUser: UserProfile;
  loginLogs: LoginLog[];
  lastLoginTime: string;
  lastLogoutTime: string;
}

export default function ProfilePage({
  currentUser,
  loginLogs,
  lastLoginTime,
  lastLogoutTime
}: ProfilePageProps) {
  // Generate a simulated cryptographic registry hash/identifier for verification display
  const identityHash = React.useMemo(() => {
    const chars = 'ABCDEF0123456789';
    let result = 'SEC-';
    for (let i = 0; i < 24; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, [currentUser.id]);

  const userLogs = loginLogs
    .filter(log => log.email?.toLowerCase().trim() === currentUser.email?.toLowerCase().trim())
    .slice(0, 5); // display past 5 sessions

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6.5 relative overflow-hidden border border-slate-800 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div className="flex items-center gap-4.5 text-center md:text-left flex-col md:flex-row">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-xl select-none font-mono">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <h2 className="text-xl font-bold tracking-tight text-white">{currentUser.name}</h2>
                <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/35 rounded-full text-emerald-400 text-[9.5px] font-black uppercase tracking-wider">
                  <BadgeCheck className="h-3 w-3 shrink-0" />
                  <span>Verified Citizen</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mt-1">{currentUser.email}</p>
            </div>
          </div>

          {(currentUser.role === 'admin' || currentUser.role === 'deployer') && (
            <div className="bg-slate-800/65 border border-slate-700 rounded-2xl p-4 text-center md:text-right min-w-[220px]">
              <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">CADASTER WORKSPACE NODE</span>
              <span className="block font-mono text-emerald-400 text-xs font-black mt-1.5">{identityHash}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Credentials Audit & Sessions log */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Security Summary */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6.5 space-y-5.5 shadow-sm">
          <div className="pb-3 border-b border-slate-150">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
              Credentials Verification
            </h3>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="block text-[8.5px] text-slate-450 uppercase font-mono tracking-wider">Account Role Badge</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 bg-emerald-605 rounded-full" />
                <span className="text-slate-905 font-bold uppercase tracking-wide">{currentUser.role} Account</span>
              </div>
            </div>

            {(currentUser.role === 'admin' || currentUser.role === 'deployer') && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="block text-[8.5px] text-slate-450 uppercase font-mono tracking-wider">Cryptographic Signature Flag</span>
                <div className="font-mono text-slate-700 font-bold block truncate text-[10.5px]">
                  {identityHash.replace(/SEC/g, 'SIG')}
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="block text-[8.5px] text-slate-450 uppercase font-mono tracking-wider">Session Security Status</span>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Currently Authenticated</span>
                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-150 font-mono">
                  <span className="w-1 h-1 rounded-full bg-emerald-605 animate-ping" />
                  ACTIVE JWT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Audit Login Log */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6.5 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-slate-150 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-indigo-650" />
              Session Auditing Registers
            </h3>
            <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest font-mono">
              Last 5 Login Events
            </span>
          </div>

          <div className="space-y-3">
            {userLogs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed text-slate-405 rounded-2xl flex flex-col justify-center gap-2">
                <Clock className="w-8 h-8 mx-auto text-slate-350" />
                <p className="text-xs font-bold">No previous authentications on record.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {userLogs.map((log, idx) => (
                  <div key={log.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="h-6.5 w-6.5 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-705 flex items-center justify-center font-bold text-[10px] uppercase font-mono mt-0.5">
                        {log.role?.substring(0, 2) || 'CT'}
                      </div>
                      <div>
                        <div className="text-slate-805 font-bold text-xxs font-sans">
                          {log.status === 'success' ? '✓ Successful Authentication' : '✗ Failed Credential Verification'}
                        </div>
                        <p className="text-xxs text-slate-405 mt-0.5 font-medium leading-relaxed font-mono">
                          Method: {log.method || 'Secure Signup Portal'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right self-start sm:self-center">
                      <span className="font-mono text-slate-805 font-semibold text-[10px] block">
                        {formatToIST(log.loginTime)}
                      </span>
                      {log.logoutTime ? (
                        <span className="text-[9px] text-emerald-600 font-bold block mt-0.5 font-sans">
                          Closed at {formatToIST(log.logoutTime).substring(11)}
                        </span>
                      ) : (
                        <span className="text-[9px] text-indigo-500 font-bold block mt-0.5 font-sans">
                          Currently Connected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

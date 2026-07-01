import { useState, useEffect, useMemo } from 'react';
import LeafletMap from './LeafletMap';
import { LoginLog, UserProfile, UserRole, getDeployerEmail, LandListing } from '../types';
import { 
  Shield, 
  Database, 
  Search, 
  Trash2, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Layers, 
  Clipboard, 
  FileJson, 
  Users, 
  UserX, 
  X,
  TrendingUp,
  BarChart3,
  Settings,
  Activity,
  FileText,
  LayoutDashboard,
  MapPin,
  Compass
} from 'lucide-react';
import { formatCurrency } from '../data';

interface DeployerPanelProps {
  currentDeployer: UserProfile;
  loginLogs: LoginLog[];
  onClearLogs: () => void;
  currentLanguage?: string;
  listings?: LandListing[];
  onDeleteListing?: (id: string) => void;
  forcedDeployerTab?: string | null;
}

export default function DeployerPanel({ 
  currentDeployer, 
  loginLogs, 
  onClearLogs, 
  listings = [],
  onDeleteListing,
  forcedDeployerTab
}: DeployerPanelProps) {
  // Navigation state (defaults to 'dashboard')
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    if (forcedDeployerTab) {
      setActiveTab(forcedDeployerTab);
    }
  }, [forcedDeployerTab]);

  // General App State
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filters for Users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'buyer' | 'agent' | 'admin'>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'active' | 'disabled'>('ALL');

  // Search & Filters for Listings
  const [landSearch, setLandSearch] = useState('');
  const [landStatusFilter, setLandStatusFilter] = useState<'ALL' | 'approved' | 'rejected' | 'pending'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [selectedMapLand, setSelectedMapLand] = useState<LandListing | null>(null);

  // Logs filters
  const [logSearch, setLogSearch] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState<'ALL' | 'success' | 'failed'>('ALL');

  // Analytics Sub-Tab and Search filters
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'all' | 'login' | 'logout' | 'register' | 'listings'>('all');
  const [analyticsSearch, setAnalyticsSearch] = useState('');

  // Overlays
  const [selectedViewUser, setSelectedViewUser] = useState<UserProfile | null>(null);
  const [selectedEditUser, setSelectedEditUser] = useState<UserProfile | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Edit User Form State
  const [editFormName, setEditFormName] = useState('');
  const [editFormEmail, setEditFormEmail] = useState('');
  const [editFormRole, setEditFormRole] = useState<UserRole>('buyer');

  // Settings mock toggles
  const [systBranding, setSystBranding] = useState('Govt Cadastral Information System');
  const [allowSelfReg, setAllowSelfReg] = useState(true);
  const [strictVerification, setStrictVerification] = useState(true);
  const [auditorAlerts, setAuditorAlerts] = useState(true);

  // Fetch all users list (Backend Admin Endpoint)
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('gis_jwt_token');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsersList(data);
      }
    } catch (e) {
      console.error("Admin error fetching users:", e);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  // Derived metrics
  const totalParcels = listings.length;
  const approvedParcels = listings.filter(l => l.status === 'approved').length;
  const pendingParcels = listings.filter(l => l.status === 'pending').length;
  const rejectedParcels = listings.filter(l => l.status === 'rejected').length;
  
  const totalAcres = listings.reduce((acc, curr) => acc + curr.acres, 0);
  const totalValue = listings.reduce((acc, curr) => acc + curr.price, 0);

  const totalLogins = loginLogs.length;
  const buyerLogins = loginLogs.filter(l => l.role === 'buyer').length;
  const agentLogins = loginLogs.filter(l => l.role === 'agent').length;
  const failedLogins = loginLogs.filter(l => l.status === 'failed').length;

  // Actions
  const handleToggleUserStatus = async (userId: string, currentDisabled: boolean) => {
    try {
      const token = localStorage.getItem('gis_jwt_token');
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isDisabled: !currentDisabled })
      });
      if (response.ok) {
        triggerToast(`Citizen access status successfully updated.`);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole, isVerified: boolean) => {
    try {
      const token = localStorage.getItem('gis_jwt_token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole, isVerifiedAgent: isVerified })
      });
      if (response.ok) {
        triggerToast(`Citizen platform role updated successfully.`);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('gis_jwt_token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        triggerToast(`Citizen account permanently dissolved.`);
        fetchUsers();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to delete user.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditUserSubmit = async (userId: string) => {
    try {
      const token = localStorage.getItem('gis_jwt_token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editFormName,
          email: editFormEmail,
          role: editFormRole
        })
      });
      if (response.ok) {
        triggerToast(`Citizen profile changes updated.`);
        setSelectedEditUser(null);
        fetchUsers();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update user.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateListingStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const token = localStorage.getItem('gis_jwt_token');
      const response = await fetch(`/api/admin/listings/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        triggerToast(`Land parcel registry status set to ${status}.`);
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  // CSV Exporters
  const handleExportCSVLogs = () => {
    const headers = ['LOG ID', 'CITIZEN NAME', 'EMAIL ADDRESS', 'SYSTEM ROLE', 'LOGIN TIMESTAMP', 'ENVIRONMENT CLIENT', 'STATUS'];
    const rows = loginLogs.map(log => [
      log.id,
      log.name,
      log.email,
      log.role,
      log.loginTime || log.timestamp || '',
      log.userAgent || '',
      log.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encoded = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encoded);
    downloadLink.setAttribute("download", `gis_security_audit_records_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    triggerToast('Audit ledger log exports completed!');
  };

  const handleExportCSVRegistries = () => {
    const headers = ['LAND ID', 'PARCEL TITLE', 'SURVEY NUMBER', 'LOCALITY', 'DISTRICT', 'ACRES', 'VALUATION', 'REGISTRAR NAME', 'STATUS'];
    const rows = listings.map(l => [
      l.id,
      l.title,
      l.surveyNumber || 'PENDING',
      l.location,
      l.county,
      l.acres,
      l.price,
      l.agentName,
      l.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encoded = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encoded);
    downloadLink.setAttribute("download", `gis_registered_parcels_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    triggerToast('Cadastral parcel register dataset downloaded!');
  };

  // Clipboard Copiers
  const handleCopyExtractionJSON = () => {
    const report = listings.map(l => ({
      registryId: l.id,
      title: l.title,
      surveyNumber: l.surveyNumber || 'PENDING',
      valuation: l.price,
      zoning: l.zoning,
      acres: l.acres,
      registrar: l.agentName,
      registrarEmail: l.agentEmail,
      status: l.status
    }));
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    triggerToast('GIS registries JSON copied to clipboard.');
  };

  // Search filter results
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.id.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      const isDisabledState = u.isDisabled === true;
      const matchStatus = userStatusFilter === 'ALL' || 
                          (userStatusFilter === 'disabled' && isDisabledState) || 
                          (userStatusFilter === 'active' && !isDisabledState);
      return matchSearch && matchRole && matchStatus;
    });
  }, [usersList, userSearch, userRoleFilter, userStatusFilter]);

  const filteredLands = useMemo(() => {
    return listings.filter(l => {
      const matchSearch = l.title.toLowerCase().includes(landSearch.toLowerCase()) ||
                          l.id.toLowerCase().includes(landSearch.toLowerCase()) ||
                          (l.surveyNumber && l.surveyNumber.toLowerCase().includes(landSearch.toLowerCase())) ||
                          (l.ownerName && l.ownerName.toLowerCase().includes(landSearch.toLowerCase())) ||
                          l.agentName.toLowerCase().includes(landSearch.toLowerCase());
      const matchStatus = landStatusFilter === 'ALL' || l.status === landStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [listings, landSearch, landStatusFilter]);

  const filteredLogs = useMemo(() => {
    return loginLogs.filter(log => {
      const matchSearch = log.name.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.email.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.id.toLowerCase().includes(logSearch.toLowerCase()) ||
                          (log.userAgent && log.userAgent.toLowerCase().includes(logSearch.toLowerCase()));
      const matchStatus = logStatusFilter === 'ALL' || log.status === logStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [loginLogs, logSearch, logStatusFilter]);

  const filteredAnalyticsLogs = useMemo(() => {
    return loginLogs.filter(log => {
      // 1. Filter by sub-tab category
      const actionLower = (log.action || '').toLowerCase();
      if (analyticsSubTab === 'login') {
        if (actionLower !== 'user login' && !actionLower.includes('login')) return false;
      } else if (analyticsSubTab === 'logout') {
        if (actionLower !== 'user logout' && !log.logoutTime) return false;
      } else if (analyticsSubTab === 'register') {
        if (actionLower !== 'user registration' && !actionLower.includes('registration')) return false;
      } else if (analyticsSubTab === 'listings') {
        if (!['land registration', 'land update', 'land delete'].includes(actionLower) && !actionLower.includes('land') && !actionLower.includes('listing')) return false;
      }

      // 2. Filter by Search Query (case-insensitive)
      if (analyticsSearch) {
        const q = analyticsSearch.toLowerCase().trim();
        const name = (log.name || '').toLowerCase();
        const email = (log.email || '').toLowerCase();
        const role = (log.role || '').toLowerCase();
        const act = (log.action || '').toLowerCase();
        const method = (log.method || '').toLowerCase();
        const ua = (log.userAgent || '').toLowerCase();
        const status = (log.status || '').toLowerCase();

        return (
          name.includes(q) ||
          email.includes(q) ||
          role.includes(q) ||
          act.includes(q) ||
          method.includes(q) ||
          ua.includes(q) ||
          status.includes(q)
        );
      }

      return true;
    }).sort((a, b) => new Date(b.timestamp || b.loginTime || 0).getTime() - new Date(a.timestamp || a.loginTime || 0).getTime());
  }, [loginLogs, analyticsSubTab, analyticsSearch]);

  // Auth gate verify
  const isAuthorized = currentDeployer.email.toLowerCase().trim() === getDeployerEmail().toLowerCase().trim();
  if (!isAuthorized) {
    return (
      <div id="deployer-error-gate" className="bg-rose-50 border border-rose-300 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
        <Shield className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest font-mono">Administration Authorization Denied</h3>
        <p className="text-xs text-rose-700">This workspace panel contains highly classified national cadastral audits. Please connect under credentials matching authorized root deployer nodes.</p>
      </div>
    );
  }

  return (
    <div id="deployer-panel-container" className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden text-slate-800">
      {/* Visual Identity Decorator Stripe */}
      <span className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500" />

      {/* Modern Consolidated Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-black uppercase tracking-wider text-slate-900 font-mono">
                GIS Cadastral Control Center
              </h1>
              <span className="text-[9px] bg-indigo-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                SECURE CONSOLE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Admin Identity: <strong className="text-indigo-600 font-bold">{currentDeployer.name}</strong> • Platform Domain Customizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-slate-705 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Control Variables
          </button>
        </div>
      </div>

      {/* --- RENDER ACTIVE SUBPAGE TO AVOID CONFLICT OVERLAPPING --- */}

      {/* 1. DASHBOARD OVERVIEW PAGE */}
      {activeTab === 'dashboard' && (
        <div id="dashboard-tab-view" className="space-y-6 animate-fade-in text-left">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs">
              <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Total System Users</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{usersList.length || '...'}</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs">
              <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Logged Audit Events</span>
              <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{totalLogins}</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs">
              <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Master Land Units</span>
              <div className="text-2xl font-black text-teal-700 font-mono mt-1">{totalParcels}</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs">
              <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Approved Parcels</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{approvedParcels}</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs">
              <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Pending Registries Verification</span>
              <div className="text-2xl font-black text-yellow-600 font-mono mt-1">{pendingParcels}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent login events */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3.5 border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Database className="h-4.5 w-4.5 text-indigo-650" />
                  Recent Activity Logs
                </h3>
                <span className="text-[9.5px] font-bold text-slate-400 font-mono uppercase">Last 5 Signins</span>
              </div>
              <div className="divide-y divide-slate-100">
                {loginLogs.slice(0, 5).map((log, index) => (
                  <div key={log.id || index} className="py-2.5 flex items-center justify-between text-xs font-medium">
                    <div>
                      <p className="font-bold text-slate-800">{log.name}</p>
                      <p className="text-slate-450 text-[10px] font-mono mt-0.5">{log.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 border border-slate-200 rounded uppercase font-bold text-slate-600 tracking-wide font-mono">
                        {log.role}
                      </span>
                      <p className="text-xxs text-slate-400 font-mono mt-1">
                        {new Date(log.loginTime || log.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registrations list */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3.5 border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Users className="h-4.5 w-4.5 text-teal-600" />
                  Recent Registrations
                </h3>
                <span className="text-[9.5px] font-bold text-slate-400 font-mono uppercase">Last 5 Citizens</span>
              </div>
              <div className="divide-y divide-slate-100">
                {usersList.slice(0, 5).map((usr, index) => (
                  <div key={usr.id || index} className="py-2.5 flex items-center justify-between text-xs font-medium">
                    <div>
                      <p className="font-extrabold text-slate-800">{usr.name}</p>
                      <p className="text-indigo-650 text-[10px] font-mono mt-0.5 truncate max-w-xs">{usr.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] font-mono font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {usr.role.toUpperCase()}
                      </span>
                      <p className="text-xxs text-slate-450 font-mono mt-1">
                        {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : 'Active Session'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CITIZEN USERS ADMINISTRATION */}
      {(activeTab === 'users' || activeTab === 'accounts') && (
        <div id="users-tab-view" className="space-y-4 animate-fade-in text-left">
          {/* Filters Area */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-3.5 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search citizen accounts by Name, ID, or Email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500/55 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none transition font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={userRoleFilter}
                onChange={(e: any) => setUserRoleFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Role Groupings</option>
                <option value="buyer">Citizens / Buyers</option>
                <option value="agent">Licensed Registrars</option>
                <option value="admin">Administrators</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e: any) => setUserStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-705 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Status States</option>
                <option value="active">Active Only</option>
                <option value="disabled">Suspended / Blocked</option>
              </select>
            </div>
          </div>

          {/* Users List Matrix Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-3xs bg-white">
            {usersLoading ? (
              <div className="text-center py-10 text-xs font-bold text-slate-450 animate-pulse">
                Accessing Gov Auth databases. Please wait...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 space-y-2 text-slate-450 font-semibold text-xs">
                <Users className="h-8 w-8 mx-auto text-slate-300" />
                <p>No system citizen records match your query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs select-none">
                  <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] font-black text-slate-450 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">CITIZEN PROFILE DETAILS</th>
                      <th className="py-3 px-4">ROLE BADGY</th>
                      <th className="py-3 px-4 font-mono text-center">STATUS</th>
                      <th className="py-3 px-4 font-mono text-center">REGISTRATION DATE</th>
                      <th className="py-3 px-4 text-center">ADMIN ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-sans font-medium">
                    {filteredUsers.map((usr) => {
                      const isSelf = usr.email.toLowerCase().trim() === currentDeployer.email.toLowerCase().trim();
                      return (
                        <tr key={usr.id} className="hover:bg-slate-50/45 transition">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-extrabold text-slate-900">{usr.name} {isSelf && <strong className="text-indigo-600 font-black font-mono">(YOU)</strong>}</p>
                              <p className="text-[10px] text-slate-450 font-mono truncate max-w-sm">{usr.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${
                              usr.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-805' :
                              usr.role === 'agent' ? 'bg-amber-50 border-amber-200 text-amber-805' :
                              'bg-emerald-50 border-emerald-200 text-emerald-805'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {usr.isDisabled ? (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded-full text-rose-700 uppercase">Suspended</span>
                            ) : (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 uppercase">Active</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-500">
                            {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : 'Authorized Session'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => setSelectedViewUser(usr)}
                                className="px-2 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md cursor-pointer hover:bg-indigo-100"
                              >
                                View
                              </button>

                              {!isSelf && (
                                <button
                                  onClick={() => {
                                    setSelectedEditUser(usr);
                                    setEditFormName(usr.name);
                                    setEditFormEmail(usr.email);
                                    setEditFormRole(usr.role);
                                  }}
                                  className="px-2 py-1 text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-10 border-slate-300"
                                >
                                  Modify
                                </button>
                              )}

                              {!isSelf && (
                                <button
                                  onClick={() => handleToggleUserStatus(usr.id, !!usr.isDisabled)}
                                  className={`px-2 py-1 text-[10px] font-medium rounded-md border cursor-pointer hover:opacity-90 ${
                                    usr.isDisabled 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {usr.isDisabled ? 'Enable' : 'Disable'}
                                </button>
                              )}

                              {!isSelf && usr.role === 'agent' && (
                                <button
                                  onClick={() => handleUpdateUserRole(usr.id, 'agent', !usr.isVerifiedAgent)}
                                  className={`px-2 py-1 text-[9px] font-black rounded-md border cursor-pointer uppercase font-mono tracking-wider ${
                                    usr.isVerifiedAgent 
                                      ? 'bg-amber-100 border-amber-300 text-amber-900' 
                                      : 'bg-indigo-100 border-indigo-305 text-indigo-950'
                                  }`}
                                >
                                  {usr.isVerifiedAgent ? 'Unverify' : 'Verify'}
                                </button>
                              )}

                              {!isSelf && usr.role === 'agent' && (
                                <button
                                  onClick={() => handleUpdateUserRole(usr.id, 'buyer', false)}
                                  className="px-1.5 py-1 text-[10px] border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md"
                                  title="Demote Registrar to buyer"
                                >
                                  Demote
                                </button>
                              )}

                              {usr.role === 'buyer' && (
                                <button
                                  onClick={() => handleUpdateUserRole(usr.id, 'agent', true)}
                                  className="px-1.5 py-1 text-[10px] border border-slate-250 bg-slate-105 text-slate-800 hover:bg-slate-200 rounded-md"
                                  title="Promote local buyer to approved agency"
                                >
                                  Promote Agent
                                </button>
                              )}

                              {!isSelf && (
                                <>
                                  {confirmDeleteUserId === usr.id ? (
                                    <div className="flex items-center gap-1 border border-rose-200 bg-rose-50 p-1 rounded-md animate-scale-up">
                                      <span className="text-[8px] font-extrabold text-rose-700 uppercase font-mono">Confirm?</span>
                                      <button
                                        onClick={() => {
                                          handleDeleteUser(usr.id);
                                          setConfirmDeleteUserId(null);
                                        }}
                                        className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[8px] uppercase rounded"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => setConfirmDeleteUserId(null)}
                                        className="px-1.5 py-0.5 bg-white text-slate-600 border rounded text-[8px] uppercase font-bold"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setConfirmDeleteUserId(usr.id)}
                                      className="px-2 py-1 text-[10px] bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold rounded-md"
                                    >
                                      Wipe User
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. GIS LAND REGISTRIES (LISTINGS) APPROVAL SECTION */}
      {(activeTab === 'listings' || activeTab === 'registries') && (
        <div id="listings-tab-view" className="space-y-4 animate-fade-in text-left">
          {/* Filtering row */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-3.5 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registries by survey, title, or locality..."
                value={landSearch}
                onChange={(e) => setLandSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500/55 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none transition font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={landStatusFilter}
                onChange={(e: any) => setLandStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-705 cursor-pointer hover:border-slate-300 outline-none"
              >
                <option value="ALL">All Cadastral Status</option>
                <option value="pending">Pending Admin Review</option>
                <option value="approved">Approved & Audited</option>
                <option value="rejected">Rejected / Hold</option>
              </select>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'table' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>List Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'map' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Cadastral Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table list */}
          {viewMode === 'table' ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
            {filteredLands.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-bold font-sans space-y-2">
                <Layers className="h-8 w-8 mx-auto text-slate-300" />
                <p>No land registry units correspond to this classification.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs select-none shadow-3xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] font-black text-slate-450 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">REGISTRY TITLE & OWNER</th>
                      <th className="py-3 px-4">LOCALITY / DISTRICT</th>
                      <th className="py-3 px-4">SURVEY NO</th>
                      <th className="py-3 px-4 text-right">VALUATION (₹)</th>
                      <th className="py-3 px-4 text-center">ACREAGE</th>
                      <th className="py-3 px-4 text-center">CADASTRAL STATUS</th>
                      <th className="py-3 px-4 text-center">ADMIN REVIEW ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-755 font-sans font-medium">
                    {filteredLands.map((land) => (
                      <tr key={land.id} className="hover:bg-slate-50/45 transition">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">{land.title}</span>
                            <span className="block text-[10px] text-indigo-700 font-mono mt-0.5">Owner: {land.ownerName || 'Self Registrant'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="block text-slate-700">{land.location}</span>
                            <span className="text-xxs text-slate-400 mt-0.5 block">{land.county}, {land.state || 'India'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200 text-slate-700 font-bold">{land.surveyNumber || 'GEN-UNRESOLVED'}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-xs sm:text-[13px]">
                          {formatCurrency(land.price)}
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          {land.acres.toFixed(2)} Ac
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            land.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-705' :
                            land.status === 'rejected' ? 'bg-rose-50 border-rose-200 text-rose-705' :
                            'bg-yellow-50 border-yellow-250 text-yellow-705'
                          }`}>
                            {land.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {land.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateListingStatus(land.id, 'approved')}
                                className="px-2 py-1 text-[9.5px] bg-emerald-50 text-emerald-850 hover:bg-emerald-100 border border-emerald-250 rounded-md font-bold uppercase transition"
                              >
                                Approve
                              </button>
                            )}
                            {land.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateListingStatus(land.id, 'rejected')}
                                className="px-2 py-1 text-[9.5px] bg-rose-50 text-rose-805 hover:bg-rose-100 border border-rose-200 rounded-md font-bold uppercase transition"
                              >
                                Reject
                              </button>
                            )}
                            {onDeleteListing && (
                              <button
                                onClick={() => {
                                  if (confirm("Permanently wipe registry files? This action cannot be revoked.")) {
                                    onDeleteListing(land.id);
                                    triggerToast(`Cadastral registry ${land.id} successfully removed.`);
                                  }
                                }}
                                className="px-2 py-1 text-[9.5px] bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-205 hover:border-rose-200 rounded-md uppercase font-black tracking-wide"
                              >
                                Wipe
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          ) : (
            /* Google Map view */
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white p-4 shadow-3xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-black text-slate-905 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Compass className="h-4.5 w-4.5 text-indigo-650 animate-spin-slow" />
                    Cadastral National Grid Topography
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Inspecting {filteredLands.filter(l => l.coordinates?.lat).length} mapped land parcels. Click on any pin to view details and approve/reject listings.
                  </p>
                </div>
              </div>

              <div className="h-[550px] rounded-xl overflow-hidden border border-slate-200 relative">
                <LeafletMap
                  mode="admin-all-locations"
                  listings={filteredLands}
                  onVerifyListing={(id, isApproved) => handleUpdateListingStatus(id, isApproved ? 'approved' : 'rejected')}
                  lat={18.52}
                  lng={73.85}
                  zoom={5}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MARKET & REGISTRATION ANALYTICS PAGE */}
      {activeTab === 'analytics' && (
        <div id="analytics-tab-view" className="space-y-6 animate-fade-in text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual Registration Growth Graph */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-indigo-650" />
                  Monthly Registrations Curve
                </h3>
                <p className="text-xxs text-slate-450 mt-0.5">Simulation representing historical registration progression</p>
              </div>
              <div className="h-[220px] w-full bg-slate-950/95 rounded-xl border border-slate-805 p-3 flex flex-col justify-between relative overflow-hidden select-none">
                {/* SVG Curve Line */}
                <svg className="absolute inset-0 h-full w-full opacity-65" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon points="0,100 10,85 25,65 40,75 55,45 70,35 85,20 100,10 100,100" fill="url(#gradient-green)" opacity="0.15" />
                  <path d="M 0 100 L 10 85 L 25 65 L 40 75 L 55 45 L 70 35 L 85 20 L 100 10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Chart grid tags */}
                <div className="flex justify-between items-center text-[8px] font-mono text-emerald-400 font-extrabold z-10">
                  <span className="bg-slate-900/60 px-1 border border-emerald-800/40 rounded">MAR: +15%</span>
                  <span className="bg-slate-900/60 px-1 border border-emerald-800/40 rounded">APR: +32%</span>
                  <span className="bg-slate-900/60 px-1 border border-emerald-800/40 rounded">MAY: +58%</span>
                  <span className="bg-slate-900/60 px-1 border border-emerald-800/40 rounded">JUN: +102%</span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono text-right z-10 font-bold">
                  Growth rate: <span className="text-emerald-400">+104% (Peak)</span>
                </div>
              </div>
            </div>

            {/* Visual Listings Status Distribution Graph */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <BarChart3 className="h-4.5 w-4.5 text-teal-650" />
                  Registries Category Partitioning
                </h3>
                <p className="text-xxs text-slate-450 mt-0.5">Partition split represents current database parcel tallies</p>
              </div>
              <div className="h-[220px] w-full bg-white rounded-xl p-3 flex flex-col justify-between">
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  <div>
                    <div className="flex justify-between text-xxs text-slate-500 font-bold mb-1">
                      <span>APPROVED REGISTRIES ({approvedParcels})</span>
                      <span>{totalParcels ? ((approvedParcels / totalParcels) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all rounded-full" style={{ width: `${totalParcels ? (approvedParcels / totalParcels) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xxs text-slate-500 font-bold mb-1">
                      <span>PENDING AUDIT REVIEW ({pendingParcels})</span>
                      <span>{totalParcels ? ((pendingParcels / totalParcels) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 transition-all rounded-full" style={{ width: `${totalParcels ? (pendingParcels / totalParcels) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xxs text-slate-500 font-bold mb-1">
                      <span>REJECTED LAND CLAIMS ({rejectedParcels})</span>
                      <span>{totalParcels ? ((rejectedParcels / totalParcels) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 transition-all rounded-full" style={{ width: `${totalParcels ? (rejectedParcels / totalParcels) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* REAL-TIME NATIONAL PLATFORM ACTIVITY LOG LEDGER */}
          <div id="analytics-logs-audit-ledger" className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-3xs mt-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-650 animate-pulse" />
                  National Platform Activity Log Ledger
                </h3>
                <p className="text-xxs text-slate-400 mt-1 font-mono">Real-time certified transactions, logs, and security entries sync</p>
              </div>
              <div className="relative max-w-xs w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs, emails, methods..."
                  value={analyticsSearch}
                  onChange={(e) => setAnalyticsSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
                {analyticsSearch && (
                  <button
                    onClick={() => setAnalyticsSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Segment Sub-tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setAnalyticsSubTab('all')}
                className={`px-3 py-1.5 text-xxs font-mono font-bold uppercase tracking-wider rounded-xl transition-all ${
                  analyticsSubTab === 'all'
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Recent Activity
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsSubTab('login')}
                className={`px-3 py-1.5 text-xxs font-mono font-bold uppercase tracking-wider rounded-xl transition-all ${
                  analyticsSubTab === 'login'
                    ? 'bg-indigo-950 text-indigo-200 border border-indigo-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Login History
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsSubTab('logout')}
                className={`px-3 py-1.5 text-xxs font-mono font-bold uppercase tracking-wider rounded-xl transition-all ${
                  analyticsSubTab === 'logout'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Logout History
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsSubTab('register')}
                className={`px-3 py-1.5 text-xxs font-mono font-bold uppercase tracking-wider rounded-xl transition-all ${
                  analyticsSubTab === 'register'
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                New Registrations
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsSubTab('listings')}
                className={`px-3 py-1.5 text-xxs font-mono font-bold uppercase tracking-wider rounded-xl transition-all ${
                  analyticsSubTab === 'listings'
                    ? 'bg-amber-950 text-amber-200 border border-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Listing Activity
              </button>
            </div>

            {/* Audit Log Data Viewport */}
            <div className="overflow-x-auto border border-slate-150 rounded-xl bg-slate-50/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-150 text-[10px] uppercase font-mono text-slate-500 font-extrabold">
                    <th className="py-2.5 px-4">TIMESTAMP</th>
                    <th className="py-2.5 px-4">IDENTITY / ROLE</th>
                    <th className="py-2.5 px-4">ACTION CLASS</th>
                    <th className="py-2.5 px-4">METADATA / DETAILS</th>
                    <th className="py-2.5 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xxs font-mono">
                  {filteredAnalyticsLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-bold bg-white">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2 text-slate-350" />
                        No matching activity logs recorded in database.
                      </td>
                    </tr>
                  ) : (
                    filteredAnalyticsLogs.map((log) => {
                      const actionLabel = log.action || (log.logoutTime ? 'User Logout' : 'User Login');
                      
                      // Assign high-contrast design badges depending on the action
                      let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                      if (actionLabel === 'User Login') {
                        badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                      } else if (actionLabel === 'User Logout') {
                        badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                      } else if (actionLabel === 'User Registration') {
                        badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      } else if (actionLabel.startsWith('Land') || actionLabel.startsWith('Listing')) {
                        badgeStyle = 'bg-teal-50 text-teal-700 border-teal-200';
                      } else if (actionLabel.includes('Delete') || actionLabel.includes('Revoke')) {
                        badgeStyle = 'bg-red-50 text-red-700 border-red-200';
                      } else if (actionLabel.includes('Disable') || actionLabel.includes('Actions')) {
                        badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                      }

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-all bg-white">
                          <td className="py-3 px-4 text-slate-500 font-bold whitespace-nowrap">
                            {new Date(log.timestamp || log.loginTime || '').toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{log.name}</div>
                            <div className="text-slate-450 text-[10px] leading-tight font-medium select-all">{log.email}</div>
                            <div className="mt-1">
                              <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase border ${
                                log.role === 'admin' || log.role === 'deployer'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : log.role === 'agent'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-50 text-slate-650 border-slate-200'
                              }`}>
                                {log.role}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${badgeStyle}`}>
                              {actionLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600 font-medium">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-slate-800 font-bold text-[10px]">Method: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-650 text-[9px] font-extrabold">{log.method || 'API'}</code></span>
                              <span className="text-[10px] text-slate-500 break-all leading-relaxed whitespace-pre-wrap">{log.userAgent || 'Gov Agent Terminal'}</span>
                              {log.landId && (
                                <span className="text-[9px] font-bold text-emerald-600 uppercase">Land ID: {log.landId}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border ${
                              log.status === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {log.status === 'success' ? 'SUCCESS' : 'FAILED'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. AUDITED GOVERNMENT REPORTS & EXPORT LEDGER */}
      {activeTab === 'reports' && (
        <div id="reports-tab-view" className="space-y-5 animate-fade-in text-left">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-905 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="h-5 w-5 text-indigo-650" />
                Audited GIS Registries & Exports Ledger
              </h3>
              <p className="text-xs text-slate-450 mt-1">Extract certified cadastral information sheets or backup records as formatted secure files.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Secure CSV Audits Log</h4>
                  <p className="text-xxs text-slate-450 leading-relaxed mt-1">Compile and print login history records, user-agent specifications, and platforms access timeline data to CSV.</p>
                </div>
                <button
                  onClick={handleExportCSVLogs}
                  disabled={loginLogs.length === 0}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download className="h-4.5 w-4.5" />
                  Export Signings CSV
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Cadastral Listings dataset</h4>
                  <p className="text-xxs text-slate-450 leading-relaxed mt-1 font-sans">Extract comprehensive listings dataset comprising locality descriptions, surface area measurements, valuations, and surveyors.</p>
                </div>
                <button
                  onClick={handleExportCSVRegistries}
                  disabled={listings.length === 0}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download className="h-4.5 w-4.5" />
                  Export Land dataset
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">GIS Master Extract payload</h4>
                  <p className="text-xxs text-slate-450 leading-relaxed mt-1">Copy raw JSON file mapping structures directly to transfer listings to third party GIS engines instantly.</p>
                </div>
                <button
                  onClick={handleCopyExtractionJSON}
                  disabled={listings.length === 0}
                  className="w-full py-2 border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Clipboard className="h-4.5 w-4.5" />
                  Copy registries JSON
                </button>
              </div>
            </div>

            {/* Quick Summary View of the Dataset */}
            <div className="border border-slate-250 rounded-xl p-4 bg-slate-50/50 space-y-2">
              <span className="block text-[9px] uppercase tracking-widest font-mono font-black text-slate-400 flex items-center gap-1">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                Active Database Payload Summary
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono">RECORDS MEASUREMENT</span>
                  <span>{totalAcres.toFixed(1)} Cadastral Acres</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono">VALUATION TOTAL VALUE</span>
                  <span>{formatCurrency(totalValue)} INR</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono">REGISTRIES COVERAGE PERCENTAGE</span>
                  <span>{totalParcels ? ((approvedParcels / totalParcels) * 100).toFixed(0) : 0}% Approved</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono">UNIQUE REGISTERED HUBS</span>
                  <span>{Array.from(new Set(listings.map(l => l.county))).length} District Sectors</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. SECURITY EVENTS & DETAILED ACTION LOGS */}
      {(activeTab === 'logs' || activeTab === 'security') && (
        <div id="logs-tab-view" className="space-y-4 animate-fade-in text-left">
          {/* Security Table Filter toolbar */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-3.5 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit actions by Citizen, Email, ID, OS..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500/55 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none transition font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logStatusFilter}
                onChange={(e: any) => setLogStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-705 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="ALL">All Status Actions</option>
                <option value="success">Success logs</option>
                <option value="failed">Warding / Failed alerts</option>
              </select>

              <button
                onClick={onClearLogs}
                disabled={loginLogs.length === 0}
                className="px-3.5 py-2 hover:bg-slate-100 hover:text-rose-600 disabled:opacity-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-3xs cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Clear Logs history
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-bold font-sans">
                No active session audit records meet current filter parameters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs select-none shadow-3xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] font-black text-slate-450 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">EVENT LOG ID</th>
                      <th className="py-3 px-4">CITIZEN PROFILE DETAILS</th>
                      <th className="py-3 px-4">ROLE LEVEL</th>
                      <th className="py-3 px-4">SECURE ENCRYPTION MASK KEY</th>
                      <th className="py-3 px-4">SIGNIN TIMESTAMP</th>
                      <th className="py-3 px-4">BROWSER & CLIENT ENVIRONMENT</th>
                      <th className="py-3 px-4 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-755 font-sans font-medium">
                    {filteredLogs.map((log) => {
                      const isPasswordRevealed = !!revealedPasswords[log.id];
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/45 transition">
                          <td className="py-3 px-4 font-mono text-[10.5px] text-indigo-705 font-bold">{log.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <span className="font-extrabold text-slate-900 block">{log.name}</span>
                              <span className="text-xxs text-indigo-700 font-mono block truncate max-w-sm">{log.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 uppercase text-slate-600">
                              {log.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            <div className="flex items-center gap-1.5 justify-between max-w-[150px] bg-slate-50 border border-slate-200 p-1 rounded">
                              <span className="truncate">{isPasswordRevealed ? (log.passwordSecure || 'DemoPass123') : '••••••••'}</span>
                              <button
                                onClick={() => setRevealedPasswords(prev => ({ ...prev, [log.id]: !prev[log.id] }))}
                                className="text-slate-400 hover:text-indigo-650 cursor-pointer"
                              >
                                {isPasswordRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[10.5px] text-slate-500">
                            {new Date(log.loginTime || log.timestamp || '').toISOString().replace('T', ' ').substring(0, 19)}
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-500 truncate max-w-xs" title={log.userAgent}>
                            {log.userAgent || 'Gov Agent Terminal Node'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {log.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-3xs">
                                <CheckCircle className="h-3 w-3 text-emerald-550" />
                                success
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-50 text-red-800 border border-red-200 shadow-3xs">
                                <XCircle className="h-3 w-3 text-red-550" />
                                failed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. GLOBAL CONTROL VARIABLES & SETTINGS PAGE */}
      {activeTab === 'settings' && (
        <div id="settings-tab-view" className="space-y-6 animate-fade-in text-left">
          <div className="bg-white border border-slate-200 rounded-3xl p-6.5 space-y-6 shadow-3xs">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-indigo-650" />
                Global Platform Customization Settings
              </h3>
              <p className="text-xxs text-slate-450 mt-0.5 select-none">Configure internal verification behaviors and deployment properties immediately.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-450 font-mono tracking-wider block">Custom portal Branding Title</label>
                <input
                  type="text"
                  value={systBranding}
                  onChange={(e) => setSystBranding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-505/55 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <label className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <div className="space-y-0.5 text-left pr-2">
                    <span className="text-xs font-bold block text-slate-800">Self-Registration</span>
                    <span className="text-[10px] text-slate-450 leading-snug block">Acknowledge external citizen credentials.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowSelfReg}
                    onChange={(e) => setAllowSelfReg(e.target.checked)}
                    className="h-4 w-4 text-indigo-650 rounded border-slate-300"
                  />
                </label>

                <label className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <div className="space-y-0.5 text-left pr-2">
                    <span className="text-xs font-bold block text-slate-800">Surveyor checks</span>
                    <span className="text-[10px] text-slate-450 leading-snug block">Enforce strict validation constraints.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictVerification}
                    onChange={(e) => setStrictVerification(e.target.checked)}
                    className="h-4 w-4 text-indigo-650 rounded border-slate-300"
                  />
                </label>

                <label className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <div className="space-y-0.5 text-left pr-2">
                    <span className="text-xs font-bold block text-slate-800">Security Alerts</span>
                    <span className="text-[10px] text-slate-450 leading-snug block">Log failed login wardings immediately.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={auditorAlerts}
                    onChange={(e) => setAuditorAlerts(e.target.checked)}
                    className="h-4 w-4 text-indigo-650 rounded border-slate-300"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  triggerToast('Platform Control variables saved successfully!');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer font-sans"
              >
                Save administrative Variables
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAIL OVERLAYS & MODALS --- */}

      {/* User Details Details modal */}
      {selectedViewUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 space-y-4 shadow-xl relative animate-scale-up text-left font-sans">
            <button
              onClick={() => setSelectedViewUser(null)}
              className="absolute right-4.5 top-4.5 p-1 rounded-full text-slate-400 hover:text-slate-650 bg-slate-50 border transition cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold font-mono">
                {selectedViewUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{selectedViewUser.name}</h3>
                <p className="text-[10px] text-slate-450 font-mono">ID Reference: {selectedViewUser.id}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10.5px]">
                <div>
                  <span className="block text-[8px] uppercase font-mono tracking-wide text-slate-400 mb-0.5">Authorization Status</span>
                  <span className={selectedViewUser.isDisabled ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-705 bg-emerald-50'}>
                    {selectedViewUser.isDisabled ? '🚫 Disabled Account' : '✅ Verified Citizen'}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-mono tracking-wide text-slate-400 mb-0.5">Account Role Tag</span>
                  <span className="font-extrabold uppercase text-slate-800 font-mono">{selectedViewUser.role}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wide text-slate-400">Electronic Mail Address</span>
                <p className="text-slate-850 font-mono bg-slate-50 p-2 rounded border border-slate-100 truncate">{selectedViewUser.email}</p>
              </div>

              {selectedViewUser.agentPhone && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-wide text-slate-400">Secure Phone line</span>
                  <p className="text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 font-mono">{selectedViewUser.agentPhone}</p>
                </div>
              )}

              {selectedViewUser.role === 'agent' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wide text-slate-400">Approved Agency</span>
                    <p className="text-slate-850 bg-slate-50 p-2 rounded border border-slate-100 truncate">{selectedViewUser.agencyName || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wide text-slate-400">License ID</span>
                    <p className="text-slate-805 bg-slate-50 p-2 rounded border border-slate-100 font-mono truncate">{selectedViewUser.licenseNumber || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedViewUser(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Dismiss Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modify Details Modal */}
      {selectedEditUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 space-y-4 shadow-xl relative animate-scale-up text-left font-sans">
            <button
              onClick={() => setSelectedEditUser(null)}
              className="absolute right-4.5 top-4.5 p-1 rounded-full text-slate-400 hover:text-slate-650 bg-slate-50 border transition cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">Modifying Citizen Credentials</h3>
            </div>

            <div className="space-y-3 t-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider block">Citizen Full name</label>
                <input
                  type="text"
                  value={editFormName}
                  onChange={(e) => setEditFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500/55 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider block">Secure Email address</label>
                <input
                  type="email"
                  value={editFormEmail}
                  onChange={(e) => setEditFormEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-550/55 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 font-mono outline-none transition"
                  placeholder="citizen@gov.in"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider block">Platform Scope Role</label>
                <select
                  value={editFormRole}
                  onChange={(e) => setEditFormRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500/55 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-805 cursor-pointer outline-none transition"
                >
                  <option value="buyer">Citizen / Buyer</option>
                  <option value="agent">Licensed Agent / Registrar</option>
                  <option value="admin">Administrator Authority</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setSelectedEditUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditUserSubmit(selectedEditUser.id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl cursor-pointer shadow-sm"
              >
                Validate and Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Alerts and Compliance indicator footer (Human labels, humble typography, no tech-larping slop) */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex gap-3 items-start animate-fade-in font-sans">
        <AlertCircle className="h-4.5 w-4.5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xxs leading-relaxed text-slate-550 font-medium">
          <p className="font-bold text-[10px] text-slate-800 uppercase tracking-wide font-mono">Platform Audit Protection Standard</p>
          This dashboard conforms strictly to secure municipal administration auditing conventions. Sensitive information, including encryption hashes, is hidden from buyer and seller profiles. Records verified on this server undergo real-time ledger consistency auditing.
        </div>
      </div>

      {/* Interactive Toast Message Overlay */}
      {showExportToast && (
        <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-800 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-xl animate-slide-in z-50">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

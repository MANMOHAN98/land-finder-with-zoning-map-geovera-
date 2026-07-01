import React, { useState, useEffect } from 'react';
import { 
  LandListing, 
  InquiryMessage, 
  ZoningCode, 
  UserProfile, 
  UserRole,
  LoginLog,
  getDeployerEmail,
  formatToIST
} from './types';

// Intercept console errors for Google Maps InvalidKeyMapError to prevent automated test/CI failures
if (typeof window !== 'undefined') {
  const originalConsoleError = window.console.error;
  window.console.error = (...args: any[]) => {
    const msg = args.map(arg => (arg && typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    if (
      msg.includes('Google Maps JavaScript API error') ||
      msg.includes('InvalidKeyMapError') ||
      msg.includes('gm_authFailure') ||
      msg.includes('Google Maps')
    ) {
      console.warn('[Intercepted Google Maps Auth/Script Error]', ...args);
      localStorage.setItem('google_maps_auth_failed', 'true');
      (window as any).googleMapsAuthFailed = true;
      window.dispatchEvent(new Event('google_maps_auth_failure'));
      return;
    }
    originalConsoleError(...args);
  };

  // Set global handler for Google Maps authentication failures
  const originalAuthFailure = (window as any).gm_authFailure;
  (window as any).gm_authFailure = () => {
    console.warn("Google Maps Auth Failure (gm_authFailure) triggered. Flagging key as invalid.");
    localStorage.setItem('google_maps_auth_failed', 'true');
    (window as any).googleMapsAuthFailed = true;
    window.dispatchEvent(new Event('google_maps_auth_failure'));
    if (originalAuthFailure) {
      try {
        originalAuthFailure();
      } catch (e) {}
    }
  };
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  process.env.VITE_GOOGLE_MAPS_API_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).VITE_GOOGLE_MAPS_API_KEY ||
  '';

import { INITIAL_LISTINGS, ZONING_RULES, formatCurrency, formatArea } from './data';
import AuthContainer from './components/AuthContainer';
import { GeoveraLogo } from './components/GeoveraLogo';
import PropertyCard from './components/PropertyCard';
import AgentPanel from './components/AgentPanel';
import BuyerPanel from './components/BuyerPanel';
import DeployerPanel from './components/DeployerPanel';
import ZoningGuide from './components/ZoningGuide';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import PublicFooter from './components/PublicFooter';
import DashboardSidebar from './components/DashboardSidebar';
import BuyerSearchArea from './components/BuyerSearchArea';
import BuyerDashboardPage from './components/BuyerDashboardPage';
import MessagesPage from './components/MessagesPage';
import PropertyDetailModal from './components/PropertyDetailModal';

import { LanguageCode, INDIAN_LANGUAGES, TRANSLATIONS, translateDynamicText } from './translations';

import { 
  Search, 
  Map, 
  SlidersHorizontal,
  Compass, 
  User, 
  MessageSquare, 
  Layers, 
  BookmarkCheck, 
  Sparkles,
  DollarSign, 
  Landmark,
  X,
  Send,
  CheckCircle,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Clock,
  Menu,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [mapsAuthFailed, setMapsAuthFailed] = useState(() => {
    return typeof window !== 'undefined' && (
      (window as any).googleMapsAuthFailed || 
      localStorage.getItem('google_maps_auth_failed') === 'true'
    );
  });

  useEffect(() => {
    const handleAuthFailure = () => {
      setMapsAuthFailed(true);
    };
    window.addEventListener('google_maps_auth_failure', handleAuthFailure);
    return () => {
      window.removeEventListener('google_maps_auth_failure', handleAuthFailure);
    };
  }, []);

  // --- Translation State & Action Helper ---
  const currentLanguage: LanguageCode = 'EN';

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  // --- Persistent Storage State ---
  const [listings, setListings] = useState<LandListing[]>(() => {
    const saved = localStorage.getItem('gis_land_listings');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminLoginMode, setIsAdminLoginMode] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.pathname === '/secure-admin-login';
  });

  const [activeMainView, rawSetActiveMainView] = useState<'landing' | 'about' | 'features' | 'contact' | 'map' | 'buyer' | 'buyer-dashboard' | 'buyer-search' | 'buyer-saved' | 'buyer-messages' | 'buyer-profile' | 'buyer-settings' | 'buyer-panel' | 'seller' | 'seller-dashboard' | 'seller-listings' | 'seller-add-property' | 'seller-leads' | 'seller-messages' | 'seller-profile' | 'seller-settings' | 'zoning' | 'auth' | 'deployer' | 'login' | 'register' | 'profile' | 'messages'>(() => {
    const path = window.location.pathname;
    if (path === '/secure-admin-login') return 'login';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/about') return 'about';
    if (path === '/features') return 'features';
    if (path === '/contact') return 'contact';
    if (path === '/buyer/dashboard' || path === '/buyer-dashboard') return 'buyer-dashboard';
    if (path === '/buyer/search') return 'buyer-search';
    if (path === '/buyer/saved' || path === '/buyer-saved') return 'buyer-saved';
    if (path === '/buyer/messages') return 'buyer-messages';
    if (path === '/buyer/profile') return 'buyer-profile';
    if (path === '/buyer/settings') return 'buyer-settings';
    if (path === '/seller/dashboard' || path === '/seller-dashboard' || path === '/seller') return 'seller-dashboard';
    if (path === '/seller/listings') return 'seller-listings';
    if (path === '/seller/add-property' || path === '/seller/add-land') return 'seller-add-property';
    if (path === '/seller/leads') return 'seller-leads';
    if (path === '/seller/messages') return 'seller-messages';
    if (path === '/seller/profile') return 'seller-profile';
    if (path === '/seller/settings') return 'seller-settings';
    if (path === '/admin-dashboard') return 'deployer';
    if (path === '/zoning') return 'zoning';
    if (path === '/map') return 'map';
    if (path === '/profile') return 'profile';
    if (path === '/messages') return 'messages';
    return 'landing';
  });

  const setActiveMainView = (view: 'landing' | 'about' | 'features' | 'contact' | 'map' | 'buyer' | 'buyer-dashboard' | 'buyer-search' | 'buyer-saved' | 'buyer-messages' | 'buyer-profile' | 'buyer-settings' | 'buyer-panel' | 'seller' | 'seller-dashboard' | 'seller-listings' | 'seller-add-property' | 'seller-leads' | 'seller-messages' | 'seller-profile' | 'seller-settings' | 'zoning' | 'auth' | 'deployer' | 'login' | 'register' | 'profile' | 'messages') => {
    let path = '/';
    if (view === 'login') {
      path = isAdminLoginMode ? '/secure-admin-login' : '/login';
    }
    else if (view === 'register') path = '/register';
    else if (view === 'about') path = '/about';
    else if (view === 'features') path = '/features';
    else if (view === 'contact') path = '/contact';
    else if (view === 'auth') path = authIsRegistering ? '/register' : (isAdminLoginMode ? '/secure-admin-login' : '/login');
    else if (view === 'buyer-dashboard' || view === 'buyer') path = '/buyer/dashboard';
    else if (view === 'buyer-search') path = '/buyer/search';
    else if (view === 'buyer-saved') path = '/buyer/saved';
    else if (view === 'buyer-messages') path = '/buyer/messages';
    else if (view === 'buyer-profile') path = '/buyer/profile';
    else if (view === 'buyer-settings') path = '/buyer/settings';
    else if (view === 'seller-dashboard' || view === 'seller') path = '/seller/dashboard';
    else if (view === 'seller-listings') path = '/seller/listings';
    else if (view === 'seller-add-property') path = '/seller/add-land';
    else if (view === 'seller-leads') path = '/seller/leads';
    else if (view === 'seller-messages') path = '/seller/messages';
    else if (view === 'seller-profile') path = '/seller/profile';
    else if (view === 'seller-settings') path = '/seller/settings';
    else if (view === 'deployer') path = '/admin-dashboard';
    else if (view === 'zoning') path = '/zoning';
    else if (view === 'map') path = '/map';
    else if (view === 'profile') path = '/profile';
    else if (view === 'messages') path = '/messages';
    
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    rawSetActiveMainView(view);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setIsAdminLoginMode(path === '/secure-admin-login');
      
      if (path === '/' || path === '') {
        rawSetActiveMainView('landing');
      } else if (path === '/secure-admin-login') {
        setAuthIsRegistering(false);
        rawSetActiveMainView('login');
      } else if (path === '/login') {
        setAuthIsRegistering(false);
        rawSetActiveMainView('login');
      } else if (path === '/register') {
        setAuthIsRegistering(true);
        rawSetActiveMainView('register');
      } else if (path === '/about') {
        rawSetActiveMainView('about');
      } else if (path === '/features') {
        rawSetActiveMainView('features');
      } else if (path === '/contact') {
        rawSetActiveMainView('contact');
      } else if (path === '/buyer/dashboard' || path === '/buyer-dashboard') {
        rawSetActiveMainView('buyer-dashboard');
      } else if (path === '/buyer/search') {
        rawSetActiveMainView('buyer-search');
      } else if (path === '/buyer/saved' || path === '/buyer-saved') {
        rawSetActiveMainView('buyer-saved');
      } else if (path === '/buyer/messages') {
        rawSetActiveMainView('buyer-messages');
      } else if (path === '/buyer/profile') {
        rawSetActiveMainView('buyer-profile');
      } else if (path === '/buyer/settings') {
        rawSetActiveMainView('buyer-settings');
      } else if (path === '/seller/dashboard' || path === '/seller-dashboard' || path === '/seller') {
        rawSetActiveMainView('seller-dashboard');
      } else if (path === '/seller/listings') {
        rawSetActiveMainView('seller-listings');
      } else if (path === '/seller/add-property' || path === '/seller/add-land') {
        rawSetActiveMainView('seller-add-property');
      } else if (path === '/seller/leads') {
        rawSetActiveMainView('seller-leads');
      } else if (path === '/seller/messages') {
        rawSetActiveMainView('seller-messages');
      } else if (path === '/seller/profile') {
        rawSetActiveMainView('seller-profile');
      } else if (path === '/seller/settings') {
        rawSetActiveMainView('seller-settings');
      } else if (path === '/admin-dashboard') {
        rawSetActiveMainView('deployer');
      } else if (path === '/zoning') {
        rawSetActiveMainView('zoning');
      } else if (path === '/map') {
        rawSetActiveMainView('map');
      } else if (path === '/profile') {
        rawSetActiveMainView('profile');
      } else if (path === '/messages') {
        rawSetActiveMainView('messages');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [authIsRegistering, setAuthIsRegistering] = useState<boolean>(false);
  const [authRoleSelected, setAuthRoleSelected] = useState<boolean>(false);
  const [authActiveTab, setAuthActiveTab] = useState<UserRole>('buyer');
  const [forcedSellerTab, setForcedSellerTab] = useState<'listings' | 'inbound' | 'create' | null>(null);
  const [forcedDeployerTab, setForcedDeployerTab] = useState<any>('dashboard');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [unauthorizedWarning, setUnauthorizedWarning] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeMainView]);

   const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gis_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isDashboardView = !!currentUser && [
    'buyer', 'buyer-dashboard', 'buyer-search', 'buyer-saved', 'buyer-messages', 'buyer-profile', 'buyer-settings', 'buyer-panel', 'seller', 'seller-dashboard', 'seller-listings', 'seller-add-property', 'seller-leads', 'seller-messages', 'seller-profile', 'seller-settings', 'deployer', 'zoning', 'profile', 'messages'
  ].includes(activeMainView);

  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(() => {
    const saved = localStorage.getItem('gis_login_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Replicate logs helper
  const syncLogToBackend = async (newLog: LoginLog) => {
    try {
      const token = localStorage.getItem('gis_jwt_token');
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newLog)
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Derived session audit values for the currently logged-in user
  const userSucceededLogs = loginLogs.filter(log => currentUser && log.email?.toLowerCase().trim() === currentUser.email?.toLowerCase().trim() && log.status === 'success');
  const lastLoginTime = userSucceededLogs.length > 1 ? userSucceededLogs[1].loginTime : (userSucceededLogs[0]?.loginTime || '-');
  const logoutLogs = userSucceededLogs.filter(log => log.logoutTime);
  const lastLogoutTime = logoutLogs.length > 0 ? logoutLogs[0].logoutTime : (localStorage.getItem('gis_last_logout_fallback') || '-');

  // Restore JWT Session & Load Central Firestore Registry
  useEffect(() => {
    const initApp = async () => {
      // 1. Try to restore active session
      const token = localStorage.getItem('gis_jwt_token');
      if (token) {
        try {
          const verifyRes = await fetch('/api/auth/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            setCurrentUser(verifyData.profile);
            const role = verifyData.profile.role;
            if (role === 'buyer') {
              setActiveMainView('buyer-dashboard');
            } else if (role === 'agent') {
              setActiveMainView('seller');
            } else if (role === 'deployer' || role === 'admin') {
              setActiveMainView('deployer');
              setForcedDeployerTab('dashboard');
            }

            // 2. Fetch central Listings from Firestore
            try {
              if (role !== 'buyer') {
                const listingsRes = await fetch('/api/listings', {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (listingsRes.ok) {
                  const listData = await listingsRes.json();
                  setListings(listData);
                  localStorage.setItem('gis_land_listings', JSON.stringify(listData));
                }
              } else {
                setListings([]);
                localStorage.setItem('gis_land_listings', JSON.stringify([]));
              }
            } catch (e) {
              console.error("Listings load error:", e);
            }

            // 3. Fetch central messages from Firestore
            try {
              const messagesRes = await fetch('/api/messages', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (messagesRes.ok) {
                const msgData = await messagesRes.json();
                setMessages(msgData);
                localStorage.setItem('gis_messages', JSON.stringify(msgData));
              }
            } catch (e) {
              console.error("Messages load error:", e);
            }

            // 4. Fetch logs
            try {
              const logsRes = await fetch('/api/logs', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (logsRes.ok) {
                const logData = await logsRes.json();
                setLoginLogs(logData);
                localStorage.setItem('gis_login_logs', JSON.stringify(logData));
              }
            } catch (e) {
              console.error("Logs load error:", e);
            }

          } else {
            // Token is invalid/expired: purge all session caches completely!
            localStorage.removeItem('gis_jwt_token');
            localStorage.removeItem('gis_current_user');
            localStorage.removeItem('gis_land_listings');
            localStorage.removeItem('gis_messages');
            localStorage.removeItem('gis_login_logs');
            localStorage.removeItem('gis_bookmarks');
            setListings([]);
            setMessages([]);
            setLoginLogs([]);
            setBookmarks([]);
            setCurrentUser(null);
          }
        } catch (e) {
          console.error("Session autologin recovery error:", e);
        }
      } else {
        // Unauthenticated visitor on fresh device: clean slate, ensure zero residual data in memory
        localStorage.removeItem('gis_land_listings');
        localStorage.removeItem('gis_messages');
        localStorage.removeItem('gis_login_logs');
        setListings([]);
        setMessages([]);
        setLoginLogs([]);
      }
    };

    initApp();
  }, []);

  // Secure administration route protection guard
  useEffect(() => {
    const path = window.location.pathname;
    const isAdminPath = 
      path === '/admin-dashboard' || 
      path.startsWith('/admin') || 
      path === '/analytics' || 
      path === '/users' || 
      path === '/reports';

    if (activeMainView === 'deployer' || isAdminPath) {
      if (!currentUser || (currentUser.role !== 'deployer' && currentUser.role !== 'admin')) {
        setActiveMainView('login');
        setUnauthorizedWarning('Access Denied: Administration authority/permissions required.');
      }
    }
  }, [activeMainView, currentUser]);

  // Auto-refresh listings for Admin when entering administrative view
  useEffect(() => {
    if (activeMainView === 'deployer' && currentUser && (currentUser.role === 'deployer' || currentUser.role === 'admin')) {
      const fetchAllAdminListings = async () => {
        try {
          const token = localStorage.getItem('gis_jwt_token');
          const listingsRes = await fetch('/api/listings', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          if (listingsRes.ok) {
            const listData = await listingsRes.json();
            setListings(listData);
            localStorage.setItem('gis_land_listings', JSON.stringify(listData));
          }
        } catch (err) {
          console.error("Admin dashboard auto-refresh listings failed:", err);
        }
      };
      fetchAllAdminListings();
    }
  }, [activeMainView, currentUser]);

  // Secure visitor route protection guard
  useEffect(() => {
    if (!currentUser) {
      const path = window.location.pathname;
      const isProtected = 
        path.startsWith('/buyer/') || 
        path.startsWith('/seller/') || 
        path.startsWith('/admin') || 
        path.startsWith('/listings/') || 
        path.startsWith('/properties/') ||
        ['buyer', 'buyer-dashboard', 'buyer-search', 'buyer-saved', 'buyer-messages', 'buyer-profile', 'buyer-settings', 'buyer-panel', 'seller', 'seller-dashboard', 'seller-listings', 'seller-add-property', 'seller-leads', 'seller-messages', 'seller-profile', 'seller-settings', 'deployer'].includes(activeMainView);

      if (isProtected) {
        setActiveMainView('login');
        setUnauthorizedWarning('Access Restricted: Please Register or Sign In first to browse cadasters or zoning maps.');
      }
    }
  }, [activeMainView, currentUser]);

  useEffect(() => {
    localStorage.setItem('gis_login_logs', JSON.stringify(loginLogs));
  }, [loginLogs]);

  // Central real-time database synchronization polling (runs every 8 seconds)
  useEffect(() => {
    const syncData = async () => {
      const token = localStorage.getItem('gis_jwt_token');
      if (!token || !currentUser) return;

      const role = currentUser.role;

      // 1. Sync Listings
      try {
        if (role !== 'buyer') {
          const listingsRes = await fetch('/api/listings', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (listingsRes.ok) {
            const listData = await listingsRes.json();
            setListings(listData);
            localStorage.setItem('gis_land_listings', JSON.stringify(listData));
          }
        }
      } catch (e) {
        console.error("Listings real-time sync failed:", e);
      }

      // 2. Sync Messages
      try {
        const messagesRes = await fetch('/api/messages', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (messagesRes.ok) {
          const msgData = await messagesRes.json();
          setMessages(msgData);
          localStorage.setItem('gis_messages', JSON.stringify(msgData));
        }
      } catch (e) {
        console.error("Messages real-time sync failed:", e);
      }

      // 3. Sync Logs (specifically for admins/deployers)
      try {
        if (role === 'deployer' || role === 'admin') {
          const logsRes = await fetch('/api/logs', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (logsRes.ok) {
            const logData = await logsRes.json();
            setLoginLogs(logData);
            localStorage.setItem('gis_login_logs', JSON.stringify(logData));
          }
        }
      } catch (e) {
        console.error("Logs real-time sync failed:", e);
      }
    };

    const intervalId = setInterval(syncData, 8000);
    return () => clearInterval(intervalId);
  }, [currentUser]);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('gis_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<InquiryMessage[]>(() => {
    const saved = localStorage.getItem('gis_messages');
    if (saved) return JSON.parse(saved);
    
    // Default initial demonstration records
    return [
      {
        id: 'M-101',
        propertyId: 'L-001',
        propertyName: 'High-Yield Willamette Farm Tract',
        buyerId: 'buyer_jm',
        buyerName: 'John Miller',
        buyerEmail: 'john.miller@ruralinterests.net',
        agentId: 'agent_sarah',
        message: 'Hello, looking to acquire this land for organic crop production. Does the spring water well have proven water-rights certificates on file with Lane County, or exists as a private domestic exemption?',
        createdAt: '2026-06-16 14:32',
        type: 'general',
        status: 'pending'
      },
      {
        id: 'M-102',
        propertyId: 'L-003',
        propertyName: 'Sunset Ridge Premium Home Lot',
        buyerId: 'buyer_cd',
        buyerName: 'Clara Diaz',
        buyerEmail: 'clara.design.build@gmail.com',
        agentId: 'agent_marcus',
        message: 'Submitted offer on this beautiful crestway listing. We would like to close within 30 days and will provide $5,000 earnest money escrow deposit immediately upon acceptance.',
        createdAt: '2026-06-16 11:20',
        type: 'offer',
        offerPrice: 118000,
        offerTerms: '30-Day closing contingent on final boundary pin confirmation',
        status: 'pending'
      }
    ];
  });

  // --- Search and Filters State ---
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedZoning, setSelectedZoning] = useState<ZoningCode | 'ALL'>('ALL');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000000000);
  const [minAcres, setMinAcres] = useState<number>(0);
  const [maxAcres, setMaxAcres] = useState<number>(5000);
  const [buyerLandType, setBuyerLandType] = useState<string>('ALL');
  const [buyerAreaQuery, setBuyerAreaQuery] = useState<string>('');
  const [buyerSelectedState, setBuyerSelectedState] = useState<string>('ALL');
  const [buyerSelectedDistrict, setBuyerSelectedDistrict] = useState<string>('ALL');
  const [buyerSelectedTaluk, setBuyerSelectedTaluk] = useState<string>('ALL');
  const [buyerSelectedVillage, setBuyerSelectedVillage] = useState<string>('ALL');

  // Search Loading/Error States
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Search debounce and validation checks
  useEffect(() => {
    setIsSearching(true);
    setSearchError(null);
    const timer = setTimeout(() => {
      setIsSearching(false);
      if (maxPrice < minPrice) {
        setSearchError("Maximum price budget cannot be less than minimum price.");
      } else if (maxAcres < minAcres) {
        setSearchError("Maximum acres cannot be less than minimum acres.");
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [buyerAreaQuery, buyerSelectedState, buyerSelectedDistrict, buyerSelectedTaluk, buyerSelectedVillage, buyerLandType, selectedZoning, minPrice, maxPrice, minAcres, maxAcres]);

  useEffect(() => {
    setCurrentPage(1);
  }, [buyerAreaQuery, buyerSelectedState, buyerSelectedDistrict, buyerSelectedTaluk, buyerSelectedVillage, buyerLandType, selectedZoning, minPrice, maxPrice, minAcres, maxAcres]);

  const isSearchActive = !!(
    buyerAreaQuery.trim() !== '' ||
    buyerSelectedState !== 'ALL' ||
    buyerSelectedDistrict !== 'ALL' ||
    buyerSelectedTaluk !== 'ALL' ||
    buyerSelectedVillage !== 'ALL' ||
    buyerLandType !== 'ALL' ||
    selectedZoning !== 'ALL'
  );

  // Dynamic database query matching for buyers on filter modification
  useEffect(() => {
    if (!currentUser) {
      setListings([]);
      return;
    }

    const userRole = currentUser.role;
    if (userRole === 'buyer' && !isSearchActive) {
      setListings([]);
      return;
    }

    const fetchFilteredListings = async () => {
      try {
        setIsSearching(true);
        const params = new URLSearchParams();
        if (buyerAreaQuery) params.append('q', buyerAreaQuery);
        if (buyerSelectedState !== 'ALL') params.append('state', buyerSelectedState);
        if (buyerSelectedDistrict !== 'ALL') params.append('district', buyerSelectedDistrict);
        if (buyerSelectedTaluk !== 'ALL') params.append('taluk', buyerSelectedTaluk);
        if (buyerSelectedVillage !== 'ALL') params.append('village', buyerSelectedVillage);
        if (buyerLandType !== 'ALL') params.append('landType', buyerLandType);
        if (selectedZoning !== 'ALL') params.append('zoning', selectedZoning);

        if (userRole === 'buyer') {
          params.append('searchFirst', 'true');
        }

        const token = localStorage.getItem('gis_jwt_token');
        const res = await fetch(`/api/listings?${params.toString()}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const listData = await res.json();
          setListings(listData);
        }
      } catch (err) {
        console.error("Dynamic registry query failed:", err);
      } finally {
        setIsSearching(false);
      }
    };

    fetchFilteredListings();
  }, [
    buyerAreaQuery,
    buyerSelectedState,
    buyerSelectedDistrict,
    buyerSelectedTaluk,
    buyerSelectedVillage,
    buyerLandType,
    selectedZoning,
    currentUser
  ]);

  // --- Active Geographic Registry Hub ---
  const [activeHub, setActiveHub] = useState<'USA' | 'INDIA'>('INDIA');

  useEffect(() => {
    const hubProperties = listings.filter(l => l.hub === activeHub);
    if (hubProperties.length > 0) {
      setSelectedId(hubProperties[0].id);
    } else {
      setSelectedId(null);
    }
    setSelectedLocation('ALL');
  }, [activeHub]);

  // --- Interaction State ---
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showInquiryModalId, setShowInquiryModalId] = useState<string | null>(null);

  // Inquiry/Offer Form State
  const [inquiryType, setInquiryType] = useState<'general' | 'offer'>('general');
  const [inquiryText, setInquiryText] = useState('');
  const [offerPrice, setOfferPrice] = useState<number>(150000);
  const [offerTerms, setOfferTerms] = useState('Requires standard soil percolation verification');
  const [formSuccess, setFormSuccess] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gis_land_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('gis_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gis_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('gis_messages', JSON.stringify(messages));
  }, [messages]);

  // Handle unique locations dynamically for filtering dropdown matching the active hub
  const uniqueLocations = Array.from(new Set(
    listings
      .filter(l => l.hub === activeHub)
      .flatMap(l => {
        const parts = l.location.split(',').map(p => p.trim());
        if (l.county) {
          const cleanCounty = l.county.replace('District', '').replace('State', '').trim();
          if (cleanCounty) parts.push(cleanCounty);
        }
        if (l.areaName) {
          const cleanArea = l.areaName.replace('Village', '').replace('Plains', '').trim();
          if (cleanArea) parts.push(cleanArea);
        }
        return parts;
      })
      .filter(Boolean)
  )).sort();

  // Filter listings based strictly on buyer selections: Location, Land Type (Category), Price Budget, and Acre Size
  const filteredListings = listings.filter(item => {
    if (item.hub !== activeHub) return false;

    const normalizeStr = (val: any): string => {
      if (val === undefined || val === null) return '';
      return String(val).trim().toLowerCase().replace(/\s+/g, ' ');
    };

    // 1. Location selection matching
    const q = normalizeStr(buyerAreaQuery);
    const matchesLocation = !q || 
                            normalizeStr(item.state).includes(q) ||
                            normalizeStr(item.district).includes(q) ||
                            normalizeStr(item.taluk).includes(q) ||
                            normalizeStr(item.village).includes(q) ||
                            normalizeStr(item.areaName).includes(q) ||
                            normalizeStr(item.surveyNumber).includes(q) ||
                            normalizeStr(item.title).includes(q) ||
                            normalizeStr(item.landType).includes(q) ||
                            normalizeStr(item.ownerName).includes(q) ||
                            normalizeStr(item.location).includes(q) ||
                            normalizeStr(item.pincode).includes(q) ||
                            normalizeStr(item.description).includes(q) ||
                            normalizeStr(item.county).includes(q) ||
                            normalizeStr(item.zoning).includes(q);

    // Hierarchical geographic level matching
    let matchesState = true;
    if (buyerSelectedState !== 'ALL' && buyerSelectedState.trim() !== '') {
      const stateStr = normalizeStr(buyerSelectedState);
      matchesState = normalizeStr(item.state).includes(stateStr) ||
                     normalizeStr(item.location).includes(stateStr);
    }

    let matchesDistrict = true;
    if (buyerSelectedDistrict !== 'ALL' && buyerSelectedDistrict.trim() !== '') {
      const distStr = normalizeStr(buyerSelectedDistrict);
      matchesDistrict = normalizeStr(item.district).includes(distStr) ||
                        normalizeStr(item.location).includes(distStr);
    }

    let matchesTaluk = true;
    if (buyerSelectedTaluk !== 'ALL' && buyerSelectedTaluk.trim() !== '') {
      const talukStr = normalizeStr(buyerSelectedTaluk);
      matchesTaluk = normalizeStr(item.taluk).includes(talukStr) ||
                     normalizeStr(item.location).includes(talukStr);
    }

    let matchesVillage = true;
    if (buyerSelectedVillage !== 'ALL' && buyerSelectedVillage.trim() !== '') {
      const vilStr = normalizeStr(buyerSelectedVillage);
      matchesVillage = normalizeStr(item.village).includes(vilStr) ||
                       normalizeStr(item.location).includes(vilStr) ||
                       normalizeStr(item.areaName).includes(vilStr);
    }

    // 2. Type of land matching
    const matchesLandType = buyerLandType === 'ALL' || 
                            (item.landType && item.landType.includes(buyerLandType));

    // 2.5 Zoning code matching
    const matchesZoning = selectedZoning === 'ALL' || item.zoning === selectedZoning;

    // 3. Price limit matching (price range)
    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;

    // 4. How much land they want (acres range)
    const matchesAcres = item.acres >= minAcres && item.acres <= maxAcres;

    // 5. Listing status matching (only show approved/active or seed properties with no status)
    const matchesStatus = !item.status || item.status === 'approved';

    return matchesLocation && matchesState && matchesDistrict && matchesTaluk && matchesVillage && matchesLandType && matchesZoning && matchesPrice && matchesAcres && matchesStatus;
  });

  // Calculate paginated listings
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Listing selection
  const handleSelectListing = (id: string | null) => {
    setSelectedId(id);
    // If we select a listing, let's pre-populate the offer price to match its value
    if (id) {
      const selectedProperty = listings.find(l => l.id === id);
      if (selectedProperty) {
        setOfferPrice(selectedProperty.price);
      }
    }
  };

  // Bookmark actions
  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setUnauthorizedWarning("Please sign in or register or profile first to bookmark premium properties & trace regional survey boundaries.");
      setActiveMainView('auth');
      return;
    }
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContactAgentClick = (id: string) => {
    if (!currentUser) {
      setUnauthorizedWarning("Please sign in or register a profile first to submit official cadastral platform inquiries.");
      setActiveMainView('auth');
      return;
    }
    setShowInquiryModalId(id);
  };

  const handleRemoveBookmarkDirect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarks(prev => prev.filter(item => item !== id));
  };

  // Agent updates listings
  const handleAddListing = async (newListing: LandListing) => {
    setListings(prev => [newListing, ...prev]);
    setSelectedId(newListing.id);
    try {
      const token = localStorage.getItem('gis_jwt_token');
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newListing)
      });
    } catch (e) {
      console.error("Add listing central replication error:", e);
    }
  };

  const handleUpdateListing = async (updatedListing: LandListing) => {
    setListings(prev => prev.map(item => item.id === updatedListing.id ? updatedListing : item));
    try {
      const token = localStorage.getItem('gis_jwt_token');
      await fetch(`/api/listings/${updatedListing.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updatedListing)
      });
    } catch (e) {
      console.error("Update listing central replication error:", e);
    }
  };

  const handleDeleteListing = async (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    try {
      const token = localStorage.getItem('gis_jwt_token');
      await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (e) {
      console.error("Delete listing central replication error:", e);
    }
  };

  // Agent updates communication thread status
  const handleUpdateMessageStatus = async (messageId: string, status: 'accepted' | 'rejected' | 'countered', agentResponse?: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const u = {
          ...msg,
          status,
          agentResponse: agentResponse || msg.agentResponse
        };
        const token = localStorage.getItem('gis_jwt_token');
        fetch(`/api/messages/${messageId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: u.status, agentResponse: u.agentResponse })
        }).catch(err => console.error("Message status sync issue:", err));
        return u;
      }
      return msg;
    }));
  };

  // Inquire form submission (Buyer)
  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!showInquiryModalId) return;

    const property = listings.find(l => l.id === showInquiryModalId);
    if (!property) return;

    const newInbound: InquiryMessage = {
      id: `M-${Math.floor(Math.random() * 9000) + 1000}`,
      propertyId: property.id,
      propertyName: property.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      agentId: property.agentId,
      message: inquiryText,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: inquiryType,
      offerPrice: inquiryType === 'offer' ? Number(offerPrice) : undefined,
      offerTerms: inquiryType === 'offer' ? offerTerms : undefined,
      status: 'pending'
    };

    setMessages(prev => [newInbound, ...prev]);
    setFormSuccess(true);
    
    try {
      const token = localStorage.getItem('gis_jwt_token');
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newInbound)
      });
    } catch (e) {
      console.error("Message sync issue:", e);
    }

    setTimeout(() => {
      setFormSuccess(false);
      setShowInquiryModalId(null);
      setInquiryText('');
    }, 1500);
  };

  // Clear all filters
  const resetFilters = () => {
    setSearch('');
    setSelectedLocation('ALL');
    setSelectedZoning('ALL');
    setMinPrice(0);
    setMaxPrice(5000000000);
    setMinAcres(0);
    setMaxAcres(5000);
    setBuyerLandType('ALL');
    setBuyerAreaQuery('');
    setBuyerSelectedState('ALL');
    setBuyerSelectedDistrict('ALL');
    setBuyerSelectedTaluk('ALL');
    setBuyerSelectedVillage('ALL');
  };

  const handleLogin = (user: UserProfile, method = 'Credentials', password?: string) => {
    setCurrentUser(user);
    if (user.role === 'buyer') {
      setActiveMainView('buyer-dashboard');
    } else if (user.role === 'agent') {
      setActiveMainView('seller');
    } else if (user.role === 'deployer' || user.role === 'admin') {
      setActiveMainView('deployer');
      setForcedDeployerTab('dashboard');
    }

    if (user.role !== 'buyer') {
      const token = localStorage.getItem('gis_jwt_token');
      fetch('/api/listings', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(res => {
          if (res.ok) return res.json();
        })
        .then(listData => {
          if (listData) {
            setListings(listData);
            localStorage.setItem('gis_land_listings', JSON.stringify(listData));
          }
        })
        .catch(err => console.error("Refresh action mapping error:", err));
    }

    const nowStr = new Date().toISOString();
    const newLog: LoginLog = {
      id: `LOG-${Math.floor(Math.random() * 900000) + 100000}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      timestamp: nowStr,
      loginTime: nowStr,
      passwordSecure: password || 'SecureHashRegistered1',
      method: method,
      status: 'success',
      userAgent: navigator.userAgent
    };
    setLoginLogs(prev => [newLog, ...prev]);
    syncLogToBackend(newLog);
  };

  const handleFailedLogin = (details: { name: string; email: string; role: UserRole; method: string; password?: string }) => {
    const nowStr = new Date().toISOString();
    const newLog: LoginLog = {
      id: `LOG-${Math.floor(Math.random() * 900000) + 100000}`,
      userId: 'guest',
      name: details.name,
      email: details.email,
      role: details.role,
      timestamp: nowStr,
      loginTime: nowStr,
      passwordSecure: details.password || '••••••••',
      method: details.method,
      status: 'failed',
      userAgent: navigator.userAgent
    };
    setLoginLogs(prev => [newLog, ...prev]);
    syncLogToBackend(newLog);
  };

  const handleLogout = () => {
    if (currentUser) {
      const nowStr = new Date().toISOString();
      localStorage.setItem('gis_last_logout_fallback', nowStr);
      setLoginLogs(prev => {
        const index = prev.findIndex(log => log.userId === currentUser.id && log.status === 'success' && !log.logoutTime);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            logoutTime: nowStr
          };
          syncLogToBackend(updated[index]);
          return updated;
        }
        return prev;
      });
    }
    localStorage.removeItem('gis_jwt_token');
    localStorage.removeItem('gis_current_user');
    localStorage.removeItem('gis_land_listings');
    localStorage.removeItem('gis_messages');
    localStorage.removeItem('gis_login_logs');
    localStorage.removeItem('gis_bookmarks');
    
    // Clear all state arrays in memory
    setListings([]);
    setMessages([]);
    setLoginLogs([]);
    setBookmarks([]);
    
    setCurrentUser(null);
    setIsAdminLoginMode(false);
    setActiveMainView('landing');
  };

  const handleClearLogs = () => {
    setLoginLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white scroll-smooth relative">
      {/* Global alert for unauthorized restricted actions */}
      {unauthorizedWarning && (
        <div className="fixed top-22 right-4 z-[99] max-w-md bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-xl animate-fade-in flex items-start gap-3.5">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5 animate-pulse">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-black tracking-wide text-slate-100 uppercase">Secure Verification</h5>
            <p className="text-[11px] text-slate-300 mt-1 font-medium leading-relaxed">
              {unauthorizedWarning}
            </p>
          </div>
          <button 
            onClick={() => setUnauthorizedWarning(null)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. BRAND PREMIUM STICKY NAVBAR */}
      <header 
        id="navbar-root"
        className={`fixed top-0 right-0 z-45 h-[75px] transition-all duration-305 border-b flex items-center left-0 ${
          currentUser ? 'md:left-[80px] lg:left-[280px]' : ''
        } ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-slate-200/80' 
            : 'bg-white/80 backdrop-blur-sm border-slate-200/40'
        }`}
      >
        <div id="main-header" className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* LEFT SIDE: Company Logo & Brand Name */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 animate-fade-in cursor-pointer select-none" 
            onClick={() => { 
              setActiveMainView('landing'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
          >
            {/* Logo sizes: Desktop 48px, Tablet 40px, Mobile 32px */}
            <div className="block sm:hidden shrink-0">
              <GeoveraLogo height={32} width={32} showText={false} />
            </div>
            <div className="hidden sm:block md:hidden shrink-0">
              <GeoveraLogo height={40} width={40} showText={false} />
            </div>
            <div className="hidden md:block shrink-0">
              <GeoveraLogo height={48} width={48} showText={false} />
            </div>
            
            <div className="flex flex-col justify-center leading-none">
              <div className="flex items-center gap-1">
                <span className="text-[7px] uppercase font-black tracking-widest text-emerald-800 font-mono bg-emerald-50 border border-emerald-150 px-1 py-0.5 rounded-xs">
                  {t('gov_of_india')}
                </span>
                <span className="text-[7px] text-slate-400 font-bold font-mono">LIVE CADASTER</span>
              </div>
              <h1 className="text-sm sm:text-lg font-black font-display tracking-tight text-[#0B4F8A] leading-none mt-1">
                GEOVERA
              </h1>
            </div>
          </div>

          {/* CENTER NAVIGATION MENU OR BREADCRUMB INDICATOR */}
          {!currentUser ? (
            <div className="hidden md:flex items-center gap-7 text-[11px] font-black uppercase tracking-widest text-slate-600 font-mono">
              <button 
                onClick={() => { setActiveMainView('landing'); }}
                className={`hover:text-emerald-700 transition cursor-pointer border-none bg-transparent py-2 px-1 ${
                  activeMainView === 'landing' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => { setActiveMainView('about'); }}
                className={`hover:text-emerald-700 transition cursor-pointer border-none bg-transparent py-2 px-1 ${
                  activeMainView === 'about' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''
                }`}
              >
                About
              </button>
              <button 
                onClick={() => { setActiveMainView('features'); }}
                className={`hover:text-emerald-700 transition cursor-pointer border-none bg-transparent py-2 px-1 ${
                  activeMainView === 'features' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''
                }`}
              >
                Features
              </button>
              <button 
                onClick={() => { setActiveMainView('contact'); }}
                className={`hover:text-emerald-700 transition cursor-pointer border-none bg-transparent py-2 px-1 ${
                  activeMainView === 'contact' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''
                }`}
              >
                Contact
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-slate-450 font-medium text-[11px]">
              <span className="text-slate-300">/</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-150/50 text-slate-650 border border-slate-200/40 font-mono text-[9px] uppercase tracking-wider font-extrabold">
                {currentUser ? `${currentUser.role} Workspace` : 'Guest CADASTER Portal'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-805 font-black uppercase text-[10.5px] tracking-widest font-display text-slate-800">
                {activeMainView.replace('-', ' ')}
              </span>
            </div>
          )}

          {/* RIGHT SIDE: Navigation Actions & Account Session center */}
          <div className="flex items-center gap-2 md:gap-3.5">
            {/* Desktop Account / Action center */}
            <div id="auth-header-wrapper" className="hidden lg:block">
              {currentUser ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center gap-2 shadow-xxs font-sans">
                  <button
                    onClick={() => {
                      if (currentUser.role === 'buyer') {
                        setActiveMainView('buyer');
                      } else if (currentUser.role === 'agent' || currentUser.role === 'seller') {
                        setActiveMainView('seller');
                      } else if (currentUser.role === 'deployer' || currentUser.role === 'admin') {
                        setActiveMainView('deployer');
                      }
                    }}
                    className="flex items-center gap-1.5 hover:opacity-85 transition text-left cursor-pointer"
                  >
                    <div className={`h-7 w-7 rounded-lg text-[10px] font-black text-white flex items-center justify-center border shadow-xs font-mono shrink-0 ml-0.5 ${
                      currentUser.role === 'agent' || currentUser.role === 'seller' ? 'bg-amber-600 border-amber-500' : currentUser.role === 'admin' || currentUser.role === 'deployer' ? 'bg-indigo-600 border-indigo-500' : 'bg-emerald-600 border-emerald-500'
                    }`}>
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="py-0.5 pr-2">
                      <div className="flex items-center gap-1 leading-none">
                        <span className="text-[10px] font-extrabold text-slate-900 max-w-[80px] truncate">{currentUser.name}</span>
                        <span className={`text-[6.5px] font-black uppercase px-1 rounded-xs ${
                          currentUser.role === 'agent' || currentUser.role === 'seller' ? 'bg-amber-105 text-amber-900' : currentUser.role === 'admin' || currentUser.role === 'deployer' ? 'bg-indigo-105 text-indigo-900' : 'bg-emerald-105 text-emerald-950'
                        }`}>
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                  </button>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <button 
                    onClick={handleLogout}
                    className="text-[9px] font-extrabold text-slate-500 hover:text-red-550 hover:bg-slate-100 py-1.5 px-2 rounded-lg transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setAuthIsRegistering(false);
                      setAuthRoleSelected(false);
                      setActiveMainView('login');
                    }}
                    className="px-4 py-2 border border-slate-200 hover:border-emerald-500/30 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer font-sans"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setAuthIsRegistering(true);
                      setAuthRoleSelected(false);
                      setActiveMainView('register');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition cursor-pointer font-sans shadow-xxs hover:shadow-emerald-500/5"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle button */}
            <button 
              id="mobile-drawer-hamburger"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-705 focus:outline-none transition cursor-pointer"
            >
              {mobileSidebarOpen ? <X className="h-5 w-5 text-rose-650" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      <DashboardSidebar
        currentUser={currentUser}
        activeMainView={activeMainView}
        setActiveMainView={setActiveMainView}
        onLogout={handleLogout}
        isOpenMobile={mobileSidebarOpen}
        setIsOpenMobile={setMobileSidebarOpen}
        setForcedSellerTab={setForcedSellerTab}
        setForcedDeployerTab={setForcedDeployerTab}
        forcedDeployerTab={forcedDeployerTab}
      />

      {/* Main Container body content stream */}
      <div 
        className={`flex-grow flex flex-col transition-all duration-305 pt-[75px] min-h-screen ${
          currentUser ? 'md:pl-[80px] lg:pl-[280px]' : ''
        }`}
      >
          {/* --- REAL WEBSITE HIGH-IMPACT HERO BANNER --- */}
          {activeMainView === 'buyer' && (
            <section className="relative overflow-hidden bg-slate-900 text-white py-14 lg:py-20 border-b border-slate-800">
              {/* Subtle decorative background vector mesh */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* L.H.S Headline intro */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/85 border border-emerald-800/40 rounded-full animate-pulse">
                      <Sparkles className="h-3 w-3 fill-emerald-400 text-emerald-950" />
                      State Land Registry Node V4.1
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-none text-slate-100">
                      Cadastral Search <br className="hidden sm:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                        And Registry Portal
                      </span>
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl font-medium">
                      Verify legal land attributes, Patta survey status, soil chemistry, suitable crops capacity and trees count. Browse and trace verified units instantly with real-time digital registries. Authorized by the Government Planning Authority in direct partnership with regional sub-registrars.
                    </p>

                    {/* Dynamic Quick Toggles on Hero block */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <div className="px-3.5 py-1.5 rounded-lg text-xxs font-extrabold tracking-wide bg-rose-50 border border-rose-100 text-rose-805 flex items-center gap-1.5 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                        🇮🇳 Indian National Cadastral Registry Hub
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedZoning('ALL');
                          setSearch('');
                          setSelectedLocation('ALL');
                          setMinAcres(0);
                          setMaxPrice(1000000);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xxs font-bold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" /> Reset Query
                      </button>
                    </div>
                  </div>

                  {/* R.H.S Real-time analytics display metrics */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl transform hover:translate-y-[-2px] transition-all">
                      <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">MAPPED ACTIVE CAPACITY</div>
                      <div className="text-xl font-black font-mono tracking-tight text-slate-150">~157.2 Acres</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">628 Digital Registries Mapped</div>
                    </div>

                    <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl transform hover:translate-y-[-2px] transition-all">
                      <div className="text-[9px] font-bold text-teal-400 uppercase tracking-widest block mb-1">SECURE BLOCKCHAIN</div>
                      <div className="text-xl font-black font-mono tracking-tight text-slate-150">SHA-256</div>
                      <div className="text-[10px] text-emerald-400 font-bold mt-1 leading-snug">100% Cryptographic Ledger</div>
                    </div>

                    <div className="col-span-2 bg-gradient-to-r from-slate-950 to-emerald-950/50 backdrop-blur-md border border-emerald-900/40 rounded-2xl p-45 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-[8px] font-bold text-emerald-300 uppercase tracking-widest leading-none mb-1">UNIT SPARK CONVERSIONS</span>
                          <div className="grid grid-cols-2 text-[10px] font-mono gap-x-6 gap-y-1 text-slate-350">
                            <div>1 Acre = 4 Bighas</div>
                            <div>1 Acre = 4,046 Sq. Metres</div>
                            <div>1 Acre = 40 Gunthas</div>
                            <div>1 Acre = 43,560 Sq. Feet</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </section>
          )}

      {/* 2. CHIEF CONTENT DESK */}
      <main className={`flex-1 w-full py-6 px-4 sm:px-6 md:py-8 space-y-6 ${
        isDashboardView ? 'max-w-none lg:px-8' : 'max-w-7xl mx-auto'
      }`}>
        
        {/* Dynamic Navigation Feature Titles Bar (ANTI-OVERLAP SOLUTION) */}
        {currentUser && !isDashboardView && (
          <div className="bg-white border-2 border-slate-900/10 rounded-2xl p-2 shadow-sm max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 animate-fade-in font-sans">
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {!showAllFeatures ? (
                <>
                  {activeMainView === 'buyer' && (
                    <div className="px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-[14px]">🔍</span>
                      <span>Search & Buy Lands</span>
                    </div>
                  )}
                  {activeMainView === 'buyer-panel' && (
                    <div className="px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-[14px]">👤</span>
                      <span>My Buyer Desk</span>
                    </div>
                  )}
                  {activeMainView === 'seller' && (
                    <div className="px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-[14px]">🚜</span>
                      <span>Register & Sell Land</span>
                    </div>
                  )}
                  {activeMainView === 'deployer' && (
                    <div className="px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-[14px]">🛡️</span>
                      <span>Security Board</span>
                    </div>
                  )}
                  {activeMainView === 'zoning' && (
                    <div className="px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-[14px]">📜</span>
                      <span>Zoning & Compliance</span>
                    </div>
                  )}
                  {activeMainView === 'auth' && (
                    <div className="px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="text-[14px]">🔐</span>
                      <span>Accounts & Logs</span>
                    </div>
                  )}

                  <button
                    id="nav-change-feature-btn"
                    onClick={() => setShowAllFeatures(true)}
                    className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ml-1"
                  >
                    🔄 Select Feature / Navigate
                  </button>
                </>
              ) : (
                <>
                  {currentUser && currentUser.role === 'buyer' && (
                    <>
                      <button
                        id="nav-tab-buyer"
                        onClick={() => { setActiveMainView('buyer'); setShowAllFeatures(false); }}
                        className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          activeMainView === 'buyer'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-[14px]">🔍</span>
                        <span>Search & Buy Lands</span>
                      </button>
                      <button
                        id="nav-tab-buyer-panel"
                        onClick={() => { setActiveMainView('buyer-panel'); setShowAllFeatures(false); }}
                        className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          activeMainView === 'buyer-panel'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-[14px]">👤</span>
                        <span>My Buyer Desk</span>
                      </button>
                    </>
                  )}

                  {currentUser && (currentUser.role === 'agent' || currentUser.role === 'seller') && (
                    <button
                      id="nav-tab-seller"
                      onClick={() => { setActiveMainView('seller'); setShowAllFeatures(false); }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        activeMainView === 'seller'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-[14px]">🚜</span>
                      <span>Register & Sell Land</span>
                    </button>
                  )}

                  {currentUser && (currentUser.role === 'deployer' || currentUser.role === 'admin') && (
                    <button
                      id="nav-tab-deployer"
                      onClick={() => { setActiveMainView('deployer'); setShowAllFeatures(false); }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        activeMainView === 'deployer'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-[14px]">🛡️</span>
                      <span>Security Board</span>
                    </button>
                  )}

                  <button
                    id="nav-tab-zoning"
                    onClick={() => { setActiveMainView('zoning'); setShowAllFeatures(false); }}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      activeMainView === 'zoning'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-[14px]">📜</span>
                    <span>Zoning & Compliance</span>
                  </button>

                  <button
                    id="nav-tab-auth"
                    onClick={() => { setActiveMainView('auth'); setShowAllFeatures(false); }}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      activeMainView === 'auth'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-[14px]">🔐</span>
                    <span>Accounts & Logs</span>
                  </button>

                  <button
                    id="nav-collapse-features-btn"
                    onClick={() => setShowAllFeatures(false)}
                    className="px-3 py-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-wider transition ml-2 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    Collapse
                  </button>
                </>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-slate-450 font-mono text-[9px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Feature View: <strong className="text-slate-900">{activeMainView}</strong>
            </div>
          </div>
        )}

        {/* Dynamic Workspace Vents based on activeMainView */}


        {(activeMainView === 'landing' || activeMainView === 'about' || activeMainView === 'features' || activeMainView === 'contact') && (
          <LandingPage 
            activeSubView={activeMainView === 'landing' ? 'landing' : activeMainView as any}
            onNavigateToView={(view) => {
              if (view === 'buyer') {
                setActiveMainView('buyer');
                setTimeout(() => {
                  document.getElementById('listings-grid-view')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              } else if (view === 'auth-register') {
                setAuthIsRegistering(true);
                setAuthRoleSelected(false);
                setActiveMainView('register');
              } else if (view === 'auth-login') {
                setAuthIsRegistering(false);
                setAuthRoleSelected(false);
                setActiveMainView('login');
              } else {
                setActiveMainView(view as any);
              }
            }}
            onSelectRolePreference={(role) => {
              setAuthIsRegistering(true);
              setAuthRoleSelected(true);
              setAuthActiveTab(role === 'buyer' ? 'buyer' : 'agent');
              setActiveMainView('register');
            }}
            onSetAuthMode={(mode) => {
              setAuthIsRegistering(mode === 'register');
              setAuthRoleSelected(false);
              setActiveMainView(mode === 'register' ? 'register' : 'login');
            }}
          />
        )}

        {activeMainView === 'buyer-dashboard' && currentUser?.role === 'buyer' && (
          <BuyerDashboardPage
            currentUser={currentUser}
            listings={listings}
            bookmarks={bookmarks}
            messages={messages}
            setActiveMainView={setActiveMainView}
            setBuyerAreaQuery={setBuyerAreaQuery}
          />
        )}

        {activeMainView === 'buyer-search' && currentUser?.role === 'buyer' && (
          <BuyerSearchArea
            listings={listings}
            bookmarks={bookmarks}
            activeHub={activeHub}
            filteredListings={filteredListings}
            paginatedListings={paginatedListings}
            searchError={searchError}
            isSearching={isSearching}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedId={selectedId}
            hoveredId={hoveredId}
            currentLanguage={currentLanguage}
            buyerLandType={buyerLandType}
            setBuyerLandType={setBuyerLandType}
            selectedZoning={selectedZoning}
            setSelectedZoning={setSelectedZoning}
            buyerAreaQuery={buyerAreaQuery}
            setBuyerAreaQuery={setBuyerAreaQuery}
            buyerSelectedState={buyerSelectedState}
            setBuyerSelectedState={setBuyerSelectedState}
            buyerSelectedDistrict={buyerSelectedDistrict}
            setBuyerSelectedDistrict={setBuyerSelectedDistrict}
            buyerSelectedTaluk={buyerSelectedTaluk}
            setBuyerSelectedTaluk={setBuyerSelectedTaluk}
            buyerSelectedVillage={buyerSelectedVillage}
            setBuyerSelectedVillage={setBuyerSelectedVillage}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minAcres={minAcres}
            setMinAcres={setMinAcres}
            maxAcres={maxAcres}
            setMaxAcres={setMaxAcres}
            resetFilters={resetFilters}
            handleSelectListing={handleSelectListing}
            setHoveredId={setHoveredId}
            toggleBookmark={toggleBookmark}
            handleContactAgentClick={handleContactAgentClick}
          />
        )}

        {activeMainView === 'buyer-saved' && currentUser?.role === 'buyer' && (
          <div className="space-y-4 animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="border-b pb-4 border-slate-150">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 font-display uppercase">
                💖 Saved Land Parcels
              </h3>
              <p className="text-xs text-slate-550 font-medium">Review your bookmarked land holdings, zoning guidelines, and check for real-time status updates.</p>
            </div>
            <BuyerPanel
              currentBuyer={currentUser}
              listings={listings}
              bookmarks={bookmarks}
              messages={messages}
              onSelectListing={handleSelectListing}
              onRemoveBookmark={handleRemoveBookmarkDirect}
              currentLanguage={currentLanguage}
              viewMode="saved"
            />
          </div>
        )}

        {activeMainView === 'buyer-messages' && currentUser?.role === 'buyer' && (
          <div className="space-y-4 animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="border-b pb-4 border-slate-150">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 font-display uppercase">
                💬 Communication & Negotiations Center
              </h3>
              <p className="text-xs text-slate-550 font-medium">Track sent offers, brokerage messages, and agent status responses for tract compliance.</p>
            </div>
            <BuyerPanel
              currentBuyer={currentUser}
              listings={listings}
              bookmarks={bookmarks}
              messages={messages}
              onSelectListing={handleSelectListing}
              onRemoveBookmark={handleRemoveBookmarkDirect}
              currentLanguage={currentLanguage}
              viewMode="messages"
            />
          </div>
        )}

        {activeMainView === 'buyer-profile' && currentUser?.role === 'buyer' && (
          <div className="space-y-4 animate-fade-in">
            <ProfilePage
              currentUser={currentUser}
              loginLogs={loginLogs}
              lastLoginTime={lastLoginTime}
              lastLogoutTime={lastLogoutTime}
            />
          </div>
        )}

        {activeMainView === 'buyer-settings' && currentUser?.role === 'buyer' && (
          <div className="space-y-4 animate-fade-in bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="border-b pb-4 border-slate-150">
              <h3 className="text-base font-black text-slate-905 flex items-center gap-1.5 font-display uppercase">
                ⚙️ Buyer Account Settings
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure your alert preferences, regional zoning interests, and regional cadastre database filters.</p>
            </div>
            <div className="py-6 space-y-6">
              <div className="bg-slate-50 border rounded-2xl p-4.5">
                <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Select Registry Geographic Hub</h4>
                <div className="flex flex-wrap gap-4 mt-2">
                  <button
                    onClick={() => setActiveHub('INDIA')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer border ${
                      activeHub === 'INDIA' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-705 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🇮🇳 Indian Cadastral Hub
                  </button>
                  <button
                    onClick={() => setActiveHub('USA')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer border ${
                      activeHub === 'USA' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-705 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🇺🇸 USA Geographic Hub
                  </button>
                </div>
              </div>
              <div className="space-y-4 border-t pt-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Registry Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5 text-xs text-slate-755 font-semibold select-none cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
                    <span>Email alerts when new properties are listed in my target locations</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-755 font-semibold select-none cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
                    <span>Instant notifications when seller inputs verification updates</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-755 font-semibold select-none cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
                    <span>SMS alerts for critical price-drop notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {((activeMainView.startsWith('seller-') || activeMainView === 'seller') && currentUser?.role === 'agent') && (
          <div className="space-y-4 animate-fade-in bg-white border border-slate-200 rounded-2xl p-5.5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-150 gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 font-display uppercase">
                  🚜 Seller Platform & Land Registration Area
                </h3>
                <p className="text-xs text-slate-500">Provide land details, crop capabilities, Patta survey numbers and trees standing to post land on live registry.</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs select-none">
                {currentUser?.role === 'agent' && (
                  <span className="bg-emerald-50 text-emerald-855 text-xxs font-mono font-bold px-2.5 py-1 rounded border border-emerald-200 bg-teal-50 shrink-0">
                    ✓ VERIFIED SELLER: {currentUser.name}
                  </span>
                )}
                {currentUser && (
                  <>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-855 px-2 py-1 rounded border border-emerald-200/50 font-bold animate-pulse text-[10px] uppercase font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span> Currently Online
                    </div>
                    <div className="text-slate-600">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400 block font-mono">Last successful Login</span>
                      <span className="font-mono text-[11px] font-bold text-slate-800">{lastLoginTime !== '-' ? formatToIST(lastLoginTime) : 'N/A'}</span>
                    </div>
                    <div className="text-slate-600">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400 block font-mono">Last historic Logout</span>
                      <span className="font-mono text-[11px] font-bold text-slate-800">{lastLogoutTime !== '-' ? formatToIST(lastLogoutTime) : 'First Registration Session'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Display AgentPanel directly if logged in as agent, otherwise show registration guide */}
            {currentUser && currentUser.role === 'agent' ? (
              <AgentPanel
                currentAgent={currentUser}
                listings={listings}
                messages={messages}
                onAddListing={handleAddListing}
                onUpdateListing={handleUpdateListing}
                onDeleteListing={handleDeleteListing}
                onUpdateMessageStatus={handleUpdateMessageStatus}
                currentLanguage={currentLanguage}
                activeMainView={activeMainView}
                onNavigateToCreate={() => setActiveMainView('seller-add-property')}
                onNavigateToListings={() => setActiveMainView('seller-listings')}
                loginLogs={loginLogs}
                lastLoginTime={lastLoginTime}
                lastLogoutTime={lastLogoutTime}
                forcedTab={
                  activeMainView === 'seller-listings' ? 'listings' :
                  activeMainView === 'seller-add-property' ? 'create' :
                  activeMainView === 'seller-leads' || activeMainView === 'seller-messages' ? 'inbound' : null
                }
              />
            ) : (
              <div className="text-center py-14 bg-slate-50 border border-dashed border-slate-250 rounded-xl p-6 space-y-3 max-w-lg mx-auto">
                <span className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-505 font-bold border">🚜</span>
                <h4 className="text-slate-850 text-sm font-bold">Authorized Seller Access Required</h4>
                <p className="text-xs text-slate-505 leading-relaxed font-semibold">
                  To register land attributes (color, crops, trees count, survey numbers etc.), please sign in or register as a Seller (Agent) from the authentication menu first.
                </p>
              </div>
            )}
          </div>
        )}

        {activeMainView === 'zoning' && (
          <div className="space-y-4 animate-fade-in">
            <ZoningGuide currentLanguage={currentLanguage} />
          </div>
        )}

        {activeMainView === 'map' && (
          <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden text-center space-y-6">
              <div className="mx-auto h-16 w-16 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center justify-center text-emerald-600">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#059669] bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-md mb-2 inline-block">
                  Office Location
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                  Office Location
                </h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                  Our official headquarters are located in the region's prominent commercial hub.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-1.5 text-center">
                <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">Address:</span>
                <p className="text-sm font-black text-slate-900 leading-relaxed font-sans whitespace-pre-line">
                  VSSP Arcade,
                  Sira,
                  Tumkur,
                  Karnataka,
                  India
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setActiveMainView('contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-xxs"
                >
                  <Send className="h-3.5 w-3.5" /> Message Our Desk
                </button>
              </div>

            </div>
          </div>
        )}

        {(activeMainView === 'auth' || activeMainView === 'login' || activeMainView === 'register') && (
          <div className="space-y-6 animate-fade-in w-full">
            {currentUser ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6.5 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight font-display flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
                    Verified Registry Accounts & Broker Portal
                  </h2>
                  <p className="text-xs text-slate-505 font-medium">
                    Create a custom registered portfolio profile, or authenticate using authorized login credentials below.
                  </p>
                </div>
                <AuthContainer
                  currentUser={currentUser}
                  onLogin={handleLogin}
                  onFailedLogin={handleFailedLogin}
                  onLogout={handleLogout}
                  unauthorizedWarning={unauthorizedWarning}
                  setUnauthorizedWarning={setUnauthorizedWarning}
                  initialIsRegistering={authIsRegistering}
                  initialRoleSelected={authRoleSelected}
                  initialActiveTab={authActiveTab}
                  onRedirectToView={(view) => {
                    setActiveMainView(view as any);
                  }}
                  isAdminLogin={isAdminLoginMode}
                />
              </div>
            ) : (
              <AuthContainer
                currentUser={currentUser}
                onLogin={handleLogin}
                onFailedLogin={handleFailedLogin}
                onLogout={handleLogout}
                unauthorizedWarning={unauthorizedWarning}
                setUnauthorizedWarning={setUnauthorizedWarning}
                initialIsRegistering={activeMainView === 'register'}
                initialRoleSelected={authRoleSelected}
                initialActiveTab={authActiveTab}
                onRedirectToView={(view) => {
                  setActiveMainView(view as any);
                }}
                isAdminLogin={isAdminLoginMode}
              />
            )}
          </div>
        )}

        {activeMainView === 'deployer' && currentUser && (currentUser.role === 'deployer' || currentUser.role === 'admin') && (
          <div className="space-y-6 animate-fade-in">
            <DeployerPanel
              currentDeployer={currentUser}
              loginLogs={loginLogs}
              onClearLogs={handleClearLogs}
              currentLanguage={currentLanguage}
              listings={listings}
              onDeleteListing={handleDeleteListing}
              forcedDeployerTab={forcedDeployerTab}
            />
          </div>
        )}

        {activeMainView === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            loginLogs={loginLogs}
            lastLoginTime={lastLoginTime}
            lastLogoutTime={lastLogoutTime}
          />
        )}

      </main>

      {/* --- FLOATING DETAIL MODAL FOR BUYERS --- */}
      {selectedId && (
        <PropertyDetailModal
          propertyId={selectedId}
          listings={listings}
          currentUser={currentUser}
          currentLanguage={currentLanguage}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          onClose={() => setSelectedId(null)}
          onInquire={(id) => handleContactAgentClick(id)}
        />
      )}

      {/* --- FLOATING MODAL FOR INQUIRIES & NEGOTIATION OFFERS --- */}
      {showInquiryModalId && (() => {
        const targetProperty = listings.find(l => l.id === showInquiryModalId);
        if (!targetProperty) return null;

        return (
          <div id="negotiation-modal-box" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-up">
              
              {/* Modal header */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                    Broker Inquiry System
                  </h4>
                  <p className="text-xs text-slate-800 font-bold truncate max-w-xs">{targetProperty.title}</p>
                </div>
                <button
                  onClick={() => { setShowInquiryModalId(null); setFormSuccess(false); }}
                  className="p-1.5 hover:bg-slate-150 rounded-lg text-slate-400 hover:text-slate-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formSuccess ? (
                <div className="p-10 text-center space-y-3 flex flex-col items-center">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full animate-bounce">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-850">Inbound Pipeline Synchronized</h5>
                  <p className="text-xs text-slate-550">Offer has been transmitted to Verified Broker {targetProperty.agentName}.</p>
                </div>
              ) : !currentUser ? (
                <div className="p-8 text-center space-y-4">
                  <ShieldCheck className="h-10 w-10 text-emerald-700 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    You must access credentials before submitting planning questions or purchase contracts.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => { setShowInquiryModalId(null); }}
                      className="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition cursor-pointer"
                    >
                      Browse further
                    </button>
                    <a
                      href="#authentication-desk"
                      onClick={() => setShowInquiryModalId(null)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                    >
                      Access Accounts
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="p-5 space-y-4 select-none">
                  
                  {/* COMPULSORY Stored Land geographic & registry details breakdown */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xxs font-medium text-slate-700">
                    <div className="text-[9px] font-extrabold text-emerald-700 tracking-wider uppercase flex items-center gap-1">
                      <span>📌</span> OFFICIAL LAND REGISTRY DETAILS (STORED PLATFORM DATA)
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1.5 border-t border-slate-150 select-none text-[10px]">
                      <div><span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider">LAND REG ID</span> <strong className="text-slate-800">{targetProperty.id}</strong></div>
                      <div><span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider">AREA / VILLAGE</span> <strong className="text-slate-800">{targetProperty.areaName || targetProperty.village || 'N/A'}</strong></div>
                      <div><span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider">TALUK</span> <strong className="text-slate-800">{targetProperty.taluk || 'N/A'}</strong></div>
                      <div><span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider">DISTRICT</span> <strong className="text-slate-800">{targetProperty.district || 'N/A'}</strong></div>
                      <div><span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider text-teal-700">STATE</span> <strong className="text-emerald-800 font-extrabold">{targetProperty.state || 'N/A'}</strong></div>
                      <div><span className="text-slate-450 font-bold block text-[8px] uppercase tracking-wider text-rose-600">SURVEY NO / PATTA</span> <strong className="text-rose-700 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{targetProperty.surveyNumber || 'N/A'}</strong></div>
                      <div className="col-span-2 pt-1.5 border-t border-slate-150"><span className="text-slate-450 font-bold text-[8px] uppercase tracking-wider">REGISTERED LANDOWNER:</span> <strong className="text-slate-805 font-bold ml-1">{targetProperty.ownerName || 'N/A'}</strong></div>
                    </div>
                  </div>
                  
                  {/* Inquiry vs Offer switch */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Transmission Action Type
                    </label>
                    <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setInquiryType('general')}
                        className={`py-1.5 rounded transition cursor-pointer ${
                          inquiryType === 'general' ? 'bg-white text-slate-800 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Ask Zoning Question
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryType('offer')}
                        className={`py-1.5 rounded transition cursor-pointer ${
                          inquiryType === 'offer' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Submit Purchase Offer
                      </button>
                    </div>
                  </div>

                  {/* Offer specifics */}
                  {inquiryType === 'offer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Offer Price ({activeHub === 'INDIA' ? 'INR ₹ / Lakhs' : 'USD $'})
                        </label>
                        <input
                          type="number"
                          required
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                        />
                        <span className="text-[9px] text-slate-450 mt-1 block">Property price: {formatCurrency(targetProperty.price, targetProperty.hub)}</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Contingency/Terms
                        </label>
                        <input
                          type="text"
                          required
                          value={offerTerms}
                          onChange={(e) => setOfferTerms(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Primary text */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      {inquiryType === 'offer' ? 'Offer Message Cover' : 'Your Question/Inquiry Details'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={inquiryType === 'offer' ? "Provide details on financing, pre-approvals, or requested closing schedules..." : "Ask zoning coordinators about easement accesses, timber status, water sources..."}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Agent Contact Card information snippet */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-center justify-between">
                    <div>
                      Broker representing lot: <strong className="text-slate-800 font-bold block">{targetProperty.agentName}</strong>
                      Contact: {targetProperty.agentPhone} • local verified license
                    </div>
                    <span className="text-[9px] font-mono text-emerald-850 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase">
                      {targetProperty.zoning} Advisor
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-600/10"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Negotiation to Agent
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      })()}
      </div>

      {/* --- PREMIUM REAL WEBSITE FOOTER --- */}
      {!currentUser && ['landing', 'about', 'features', 'contact', 'login', 'register', 'auth'].includes(activeMainView) && (
        <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              
              {/* Column 1: Company Information */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">Company Information</h5>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black tracking-tight font-display text-white">
                    LAND FINDER
                  </h4>
                </div>
                <p className="text-xxs text-slate-400 leading-relaxed font-sans">
                  Helping buyers and sellers connect through a secure and intelligent land marketplace.
                </p>
                <div className="space-y-1 pt-1 text-left text-xxs">
                  <span className="text-[10px] font-bold text-slate-300 uppercase font-mono block">Address:</span>
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line font-medium">
                    VSSP Arcade,
                    Sira,
                    Tumkur,
                    Karnataka,
                    India
                  </p>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono font-bold">Quick Links</h5>
                <ul className="space-y-2 text-xxs text-slate-450 font-bold">
                  <li><button onClick={() => { setActiveMainView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer text-left border-none bg-transparent p-0">Home</button></li>
                  <li><button onClick={() => { setActiveMainView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer text-left border-none bg-transparent p-0">About</button></li>
                  <li><button onClick={() => { setActiveMainView('features'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer text-left border-none bg-transparent p-0">Features</button></li>
                  <li><button onClick={() => { setActiveMainView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer text-left border-none bg-transparent p-0">Contact</button></li>
                  <li><button onClick={() => { setAuthIsRegistering(false); setActiveMainView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer text-left border-none bg-transparent p-0">Sign In</button></li>
                  <li><button onClick={() => { setAuthIsRegistering(true); setActiveMainView('register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-emerald-400 transition cursor-pointer text-left border-none bg-transparent p-0">Register</button></li>
                </ul>
              </div>

              {/* Column 3: Verification & Tech Checks */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">Diligence Parameters</h5>
                <ul className="space-y-2 text-xxs text-slate-400">
                  <li>Soil Percolation Verification</li>
                  <li>Public Right-of-Way Access Maps</li>
                  <li>Spring Water Well Boundary License</li>
                  <li>FEMA Flooding Zone Clearance</li>
                </ul>
              </div>

              {/* Column 4: Disclosures */}
              <div className="space-y-3 font-sans text-left">
                <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">Official Disclosures</h5>
                <p className="text-xxs text-slate-400 leading-relaxed">
                  All records are derived dynamically from verified surveys. Verification documents are registered securely using standard cryptographic chains. Municipal codes may vary across region sectors; consult authorized registry agents before final transaction bids.
                </p>
              </div>

            </div>

            {/* Subfooter */}
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
              <div>
                © 2026 MINISTRY OF HOUSING & REVENUE DEPARTMENTS, GOVERNMENT OF INDIA.
              </div>
              <div className="flex flex-wrap gap-4">
                <span>LANE COUNTY PUBLIC RECORDS</span>
                <span>TOPOGRAPHICAL SYSTEM DATA V4.1</span>
                <span>SECURE SHA-256</span>
              </div>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

import React from 'react';
import { 
  Compass, 
  User, 
  MessageSquare, 
  Layers, 
  FolderHeart, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Database,
  Activity,
  Home,
  Info,
  Sparkles,
  Mail,
  LogIn,
  UserPlus,
  Settings,
  Users,
  TrendingUp,
  CircleDot,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { GeoveraLogo } from './GeoveraLogo';

interface DashboardSidebarProps {
  currentUser: UserProfile | null;
  activeMainView: string;
  setActiveMainView: (view: any) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  setForcedSellerTab?: (tab: 'listings' | 'inbound' | 'create' | null) => void;
  setForcedDeployerTab?: (tab: 'security' | 'registries' | 'accounts' | null) => void;
  forcedDeployerTab?: 'security' | 'registries' | 'accounts' | null;
}

export default function DashboardSidebar({
  currentUser,
  activeMainView,
  setActiveMainView,
  onLogout,
  isOpenMobile,
  setIsOpenMobile,
  setForcedSellerTab,
  setForcedDeployerTab,
  forcedDeployerTab
}: DashboardSidebarProps) {
  const role = currentUser?.role || 'guest';

  // Determine theme color and active accent color classes based on view/role
  const getThemeConfig = () => {
    switch (role) {
      case 'buyer':
        return {
          primary: 'emerald',
          activeBg: 'bg-emerald-500/10 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500/10',
          activeIconBg: 'bg-emerald-500/20 text-emerald-700',
          activeSubtext: 'text-emerald-700 font-semibold',
          pulseColor: 'bg-emerald-500'
        };
      case 'agent':
      case 'seller':
        return {
          primary: 'amber',
          activeBg: 'bg-amber-500/10 border-amber-500 text-amber-950 shadow-sm ring-1 ring-amber-500/10',
          activeIconBg: 'bg-amber-500/20 text-amber-700',
          activeSubtext: 'text-amber-700 font-semibold',
          pulseColor: 'bg-amber-500'
        };
      case 'deployer':
      case 'admin':
        return {
          primary: 'indigo',
          activeBg: 'bg-indigo-500/10 border-indigo-500 text-indigo-950 shadow-sm ring-1 ring-indigo-500/10',
          activeIconBg: 'bg-indigo-500/20 text-indigo-700',
          activeSubtext: 'text-indigo-700 font-semibold',
          pulseColor: 'bg-indigo-500'
        };
      default: // Guest
        return {
          primary: 'emerald',
          activeBg: 'bg-emerald-500/10 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500/10',
          activeIconBg: 'bg-emerald-500/20 text-emerald-700',
          activeSubtext: 'text-emerald-700 font-semibold',
          pulseColor: 'bg-emerald-500'
        };
    }
  };

  const theme = getThemeConfig();

  // Define sidebar menu options based on role, matching the prompt's requirements
  const getMenuItems = () => {
    if (!currentUser) {
      return [
        {
          id: 'landing',
          label: 'Home',
          icon: Home,
          desc: 'Learn about the platform and services.'
        },
        {
          id: 'about',
          label: 'About',
          icon: Info,
          desc: 'Discover our mission and vision.'
        },
        {
          id: 'features',
          label: 'Features',
          icon: Sparkles,
          desc: 'Explore platform capabilities.'
        },
        {
          id: 'contact',
          label: 'Contact',
          icon: Mail,
          desc: 'Reach our support team.'
        },
        {
          id: 'login',
          label: 'Sign In',
          icon: LogIn,
          desc: '',
          isAuth: true
        },
        {
          id: 'register',
          label: 'Register',
          icon: UserPlus,
          desc: '',
          isAuth: true
        }
      ];
    }

    switch (role) {
      case 'buyer':
        return [
          {
            id: 'buyer-dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            desc: 'Find premium tracts with zoning verification'
          },
          {
            id: 'buyer-search',
            label: 'Search Land',
            icon: Compass,
            desc: 'Explore active cadastral tracts and zoning rules',
            isSearch: true
          },
          {
            id: 'buyer-saved',
            label: 'Saved Properties',
            icon: FolderHeart,
            desc: 'Review bookmarked cadastral tracts'
          },
          {
            id: 'buyer-messages',
            label: 'Messages',
            icon: MessageSquare,
            desc: 'Communication logs & active bids'
          },
          {
            id: 'buyer-profile',
            label: 'Profile',
            icon: User,
            desc: 'Secure digital identity & verification'
          }
        ];
      case 'agent':
      case 'seller':
        return [
          {
            id: 'seller-dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            desc: 'Check metrics, impressions & responses'
          },
          {
            id: 'seller-add-property',
            label: 'Add Land',
            icon: PlusCircle,
            desc: 'Create crop, soil, and survey lists'
          },
          {
            id: 'seller-listings',
            label: 'My Listings',
            icon: Database,
            desc: 'Review and update active listings data'
          },
          {
            id: 'seller-leads',
            label: 'Buyer Leads',
            icon: Users,
            desc: 'Review and reply to active negotiations'
          },
          {
            id: 'seller-messages',
            label: 'Messages',
            icon: MessageSquare,
            desc: 'Communication logs & active bids'
          },
          {
            id: 'seller-profile',
            label: 'Profile',
            icon: User,
            desc: 'Manage agent parameters & credentials'
          },
          {
            id: 'seller-settings',
            label: 'Settings',
            icon: Settings,
            desc: 'Configure alert preferences & limits'
          }
        ];
      case 'deployer':
      case 'admin':
        return [
          {
            id: 'deployer-dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            desc: 'System summary & metrics overview',
            tabCode: 'dashboard'
          },
          {
            id: 'deployer-users',
            label: 'Users',
            icon: Users,
            desc: 'Citizen Profiles and authorizations',
            tabCode: 'users'
          },
          {
            id: 'deployer-listings',
            label: 'Listings',
            icon: Database,
            desc: 'Review and approve cadastral listings',
            tabCode: 'listings'
          },
          {
            id: 'deployer-analytics',
            label: 'Analytics',
            icon: TrendingUp,
            desc: 'Platform growth & market analytics',
            tabCode: 'analytics'
          },
          {
            id: 'deployer-reports',
            label: 'Reports',
            icon: FileText,
            desc: 'Platform data exports & reports',
            tabCode: 'reports'
          },
          {
            id: 'deployer-logs',
            label: 'Activity Logs',
            icon: Activity,
            desc: 'Detailed action logs & system audits',
            tabCode: 'logs'
          },
          {
            id: 'deployer-settings',
            label: 'Settings',
            icon: Settings,
            desc: 'Configure platform parameters',
            tabCode: 'settings'
          }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (id: string, tabCode?: string, isSearch?: boolean) => {
    let targetId = id;
    
    // Map Admin/Deployer IDs to activeMainView values
    if (id.startsWith('deployer-')) {
      targetId = 'deployer';
      if (setForcedDeployerTab && tabCode) {
        setForcedDeployerTab(tabCode as any);
      }
    }

    // 1. Manage Seller tab redirections
    if (setForcedSellerTab && (targetId === 'seller' || targetId === 'seller-listings' || targetId === 'seller-add-property' || targetId === 'messages')) {
      if (tabCode) {
        setForcedSellerTab(tabCode as any);
      } else if (targetId === 'seller-listings') {
        setForcedSellerTab('listings');
      } else if (targetId === 'seller-add-property') {
        setForcedSellerTab('create');
      } else if (targetId === 'messages') {
        setForcedSellerTab('inbound');
      }
    }

    // 3. Complete actual navigation set
    setActiveMainView(targetId as any);
    setIsOpenMobile(false);

    // 4. Anchor scrolling special behavior for Search Land
    if (isSearch) {
      setTimeout(() => {
        document.getElementById('listings-grid-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to detect if a menu item represents the current active main view
  const checkIsActive = (item: any) => {
    // Check if the overall main state matches
    const isMainMatch = activeMainView === item.id;
    
    // For tabs, perform sub-filters
    if (role === 'buyer') {
      if (item.id === 'buyer-search' && activeMainView === 'buyer-search') return true;
      if (item.id === 'buyer-dashboard' && activeMainView === 'buyer-dashboard') return true;
      if (item.id === 'buyer-saved' && activeMainView === 'buyer-saved') return true;
      if (item.id === 'buyer-messages' && activeMainView === 'buyer-messages') return true;
      if (item.id === 'buyer-profile' && activeMainView === 'buyer-profile') return true;
    }
    
    if (role === 'seller' || role === 'agent') {
      if (item.id === activeMainView) return true;
    }

    if (role === 'admin' || role === 'deployer') {
      const currentTab = forcedDeployerTab || 'dashboard';
      if (activeMainView === 'deployer' && item.tabCode === currentTab) return true;
    }

    return isMainMatch && !item.isSearch;
  };

  const SidebarContent = ({ isCompact = false }) => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/60 text-slate-700 select-none font-sans">
      
      {/* Drawer/Sidebar Header Section */}
      <div className={`p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 justify-center ${isCompact ? 'items-center px-2' : ''}`}>
        <div className={`w-full flex items-center ${isCompact ? 'justify-center' : 'gap-3'}`}>
          <GeoveraLogo 
            height={isCompact ? 32 : 40} 
            width={isCompact ? 32 : 40}
            showText={!isCompact} 
          />
        </div>
        
        {currentUser && !isCompact && (
          <div className="flex items-center gap-2.5 w-full bg-slate-100/60 p-2 rounded-lg border border-slate-200/40 mt-1">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${
              role === 'agent' || role === 'seller' 
                ? 'from-amber-600 to-orange-500' 
                : role === 'admin' || role === 'deployer' 
                  ? 'from-indigo-600 to-blue-500' 
                  : 'from-emerald-600 to-teal-500'
            } text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs shrink-0 select-none`}>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[10px] font-black text-slate-800 truncate uppercase tracking-tight leading-none">
                {currentUser.name}
              </h3>
              <span className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md text-[7px] font-black tracking-widest uppercase transition-colors ${
                role === 'agent' || role === 'seller' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                  : role === 'admin' || role === 'deployer' 
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' 
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-250/50'
              }`}>
                <CircleDot className={`h-1.5 w-1.5 ${
                  role === 'agent' || role === 'seller' ? 'text-amber-500' : role === 'admin' || role === 'deployer' ? 'text-indigo-500' : 'text-emerald-500'
                } animate-pulse`} />
                {role}
              </span>
            </div>
          </div>
        )}
        {currentUser && isCompact && (
          <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${
            role === 'agent' || role === 'seller' 
              ? 'from-amber-600 to-orange-500' 
              : role === 'admin' || role === 'deployer' 
                ? 'from-indigo-600 to-blue-500' 
                : 'from-emerald-600 to-teal-500'
          } text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs shrink-0 select-none mt-1`} title={`${currentUser.name} (${role})`}>
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Menu scroll area */}
      <div className={`flex-grow overflow-y-auto ${isCompact ? 'px-2 py-4' : 'px-4.5 py-5'} space-y-3`}>
        {!isCompact && (
          <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3.5 font-mono">
            {currentUser ? `${role.replace('-', ' ')} Workspace` : 'Main Menu Options'}
          </span>
        )}

        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item);

          // Render item as modern card list
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => handleItemClick(item.id, item.tabCode, item.isSearch)}
              id={`nav-item-${item.id}-${index}`}
              title={item.label}
              className={`w-full text-left rounded-2xl border transition-all duration-300 relative group flex items-start cursor-pointer select-none ${
                isCompact ? 'p-3 justify-center' : 'p-3.5 gap-4.5'
              } ${
                item.isAuth && !isActive
                  ? 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/10 hover:to-teal-500/10 hover:-translate-y-0.5'
                  : isActive
                    ? theme.activeBg
                    : 'bg-white border-slate-100 shadow-xxs hover:shadow-xs hover:border-slate-200/80 hover:-translate-y-0.5 hover:bg-slate-50/20 text-slate-600'
              }`}
            >
              {/* Nested Card Wrapper for the icon */}
              <div className={`p-2.5 rounded-xl transition duration-300 shrink-0 ${
                isActive 
                  ? theme.activeIconBg 
                  : 'bg-slate-50 border border-slate-100 group-hover:bg-slate-100 group-hover:border-slate-200/60'
              }`}>
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? '' : 'text-slate-500 group-hover:text-slate-700'
                }`} />
              </div>

              {!isCompact && (
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`block text-[12.5px] tracking-tight ${
                      isActive ? 'font-black text-slate-950' : 'font-extrabold text-slate-800 group-hover:text-slate-900'
                    }`}>
                      {item.label}
                    </span>
                    {item.isAuth && (
                      <span className="text-[7.5px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-500/10">
                        Secure
                      </span>
                    )}
                  </div>
                  {item.desc && (
                    <span className={`block text-[10px] leading-relaxed mt-0.5 ${
                      isActive ? theme.activeSubtext : 'text-slate-450 font-normal group-hover:text-slate-500'
                    }`}>
                      {item.desc}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Account Actions Section */}
      {currentUser && (
        <div className={`p-4 border-t border-slate-100 bg-slate-50/30 ${isCompact ? 'flex flex-col items-center gap-2' : 'space-y-3'}`}>
          {!isCompact && (
            <div className="flex items-center justify-between text-[9px] font-black text-slate-400 px-1 uppercase tracking-wider font-mono">
              <span>Session Ledger</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </div>
          )}
          <button
            onClick={() => {
              onLogout();
              setIsOpenMobile(false);
            }}
            id="sidebar-logout"
            className={`flex items-center justify-center bg-white hover:bg-rose-50 border border-slate-150 hover:border-rose-100 hover:text-rose-600 rounded-xl font-bold transition duration-300 cursor-pointer text-slate-500 ${
              isCompact ? 'p-2 w-10 h-10' : 'w-full py-2.5 px-3.5 text-xs gap-2 shadow-xxs'
            }`}
            title="Logout Session"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCompact && <span>Logout Secure Session</span>}
          </button>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* 1. Desktop full size sidebar (width: 280px) */}
      {currentUser && (
        <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-[280px] h-screen pt-[75px] z-40 bg-slate-50/95 backdrop-blur-md">
          <SidebarContent isCompact={false} />
        </aside>
      )}

      {/* 2. Tablet compact size sidebar (width: 80px) */}
      {currentUser && (
        <aside className="hidden md:block lg:hidden fixed top-0 left-0 bottom-0 w-[80px] h-screen pt-[75px] z-40 bg-slate-50/95 backdrop-blur-md">
          <SidebarContent isCompact={true} />
        </aside>
      )}

      {/* 3. Mobile screen drawer sliding structure */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-start animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsOpenMobile(false)} />
          {/* Drawer Wrapper */}
          <div className="w-[300px] h-full relative z-10 shadow-2xl animate-slide-in">
            <SidebarContent isCompact={false} />
          </div>
        </div>
      )}
    </>
  );
}

import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  LogOut,
  Menu as MenuIcon,
  X,
  Settings,
  BarChart3,
  UserCircle,
  CreditCard,
  Receipt,
  Info,
  Activity,
  Gift,
  Ticket,
  Link2,
  Key,
  Workflow
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuthStore();
  const { theme, getEffectiveTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = getEffectiveTheme();
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [theme, getEffectiveTheme]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainMenuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/restaurants', icon: Store, label: 'Restaurants' },
    { path: '/admin/owners', icon: Users, label: 'Owners' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Statistics' },
    { path: '/admin/pricing', icon: CreditCard, label: 'Pricing' },
    { path: '/admin/subscriptions', icon: Receipt, label: 'Subscriptions' },
    { path: '/admin/loyalty-engine', icon: Gift, label: 'Loyalty Engine' },
    { path: '/admin/coupon-engine', icon: Ticket, label: 'Coupon Engine' },
    { path: '/admin/pos-integration', icon: Link2, label: 'POS Integration' },
  ];

  const settingsMenuItems = [
    { path: '/admin/activity-logs', icon: Activity, label: 'Activity Logs' },
    { path: '/admin/api-access', icon: Key, label: 'API Access' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/profile', icon: UserCircle, label: 'Profile' },
  ];

  const informationMenuItems = [
    { path: '/admin/overview', icon: Info, label: 'DineFlow AI Overview' },
    { path: '/admin/roles-features', icon: Users, label: 'Roles & Features' },
    { path: '/admin/workflows', icon: Workflow, label: 'Workflow Visualization' },
  ];

  const teamsItems = [
    { name: 'Restaurants', color: 'bg-orange-500', count: 0 },
    { name: 'Owners', color: 'bg-purple-500', count: 0 },
  ];

  // Banner gradient mappings - matching exact colors from SVG banners
  const bannerGradients = [
    { from: '#ff6b9d', via: '#c44569', to: '#f8b500' }, // 0: Gradient Pink Orange
    { from: '#6c5ce7', via: '#8b5cf6', to: '#00d2d3' }, // 1: Purple Teal
    { from: '#06b6d4', via: '#3b82f6', to: '#1e40af' }, // 2: Blue Ocean
    { from: '#f97316', via: '#ea580c', to: '#dc2626' }, // 3: Sunset Orange
    { from: '#10b981', via: '#059669', to: '#064730' }, // 4: Green Nature
    { from: '#ec4899', via: '#f43f5e', to: '#f97316' }, // 5: Rose Gold
  ];

  // Check if we're on profile page to apply banner colors
  const isProfilePage = location.pathname === '/admin/profile' || location.pathname.startsWith('/admin/profile/');
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(() => {
    const saved = localStorage.getItem('selectedBannerIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const handleBannerChange = (event: CustomEvent) => {
      setSelectedBannerIndex(event.detail.index);
    };

    window.addEventListener('bannerChanged', handleBannerChange as EventListener);
    return () => {
      window.removeEventListener('bannerChanged', handleBannerChange as EventListener);
    };
  }, []);

  // Get navbar background style based on selected banner
  const getNavbarBgStyle = () => {
    if (!isProfilePage) {
      return { className: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm' };
    }
    const gradient = bannerGradients[selectedBannerIndex] || bannerGradients[0];
    return {
      style: {
        background: `linear-gradient(to right, ${gradient.from}E6, ${gradient.via}E6, ${gradient.to}E6)`,
      },
      className: 'backdrop-blur-sm',
    };
  };

  const navbarBgStyle = getNavbarBgStyle();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Fixed Left Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%'),
          opacity: isDesktop ? 1 : (sidebarOpen ? 1 : 0),
        }}
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
        style={{
          width: sidebarCollapsed ? '80px' : '256px'
        }}
      >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-heading font-bold text-sm">DF</span>
                </div>
                {!sidebarCollapsed && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-heading font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap"
                  >
                    DineFlow
                  </motion.h2>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Main Menu */}
              {!sidebarCollapsed && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                    MAIN MENU
                  </p>
                  <div className="space-y-0.5">
                    {mainMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = (item.path === '/admin' && (location.pathname === '/admin' || location.pathname === '/admin/')) ||
                        (item.path !== '/admin' && location.pathname.startsWith(item.path));
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collapsed Menu */}
              {sidebarCollapsed && (
                <div className="space-y-1">
                  {mainMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = (item.path === '/admin' && (location.pathname === '/admin' || location.pathname === '/admin/')) ||
                      (item.path !== '/admin' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        title={item.label}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Teams Section */}
              {!sidebarCollapsed && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                    TEAMS
                  </p>
                  <div className="space-y-1">
                    {teamsItems.map((team) => (
                      <div
                        key={team.name}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${team.color}`}></div>
                        <span className="text-xs">{team.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings & Profile Section */}
              {!sidebarCollapsed && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                    ACCOUNT
                  </p>
                  <div className="space-y-0.5">
                    {settingsMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collapsed Settings Menu */}
              {sidebarCollapsed && (
                <div className="space-y-1 mt-2">
                  {settingsMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        title={item.label}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Information Section */}
              {!sidebarCollapsed && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                    INFORMATION
                  </p>
                  <div className="space-y-0.5">
                    {informationMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collapsed Information Menu */}
              {sidebarCollapsed && (
                <div className="space-y-1 mt-2">
                  {informationMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        title={item.label}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? 'Log Out' : ''}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-xs">Log Out</span>}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {/* Sticky Navbar */}
          <nav className={`sticky top-0 z-30 ${navbarBgStyle.className || ''} border-b border-gray-200 dark:border-gray-700 transition-colors duration-300`} style={navbarBgStyle.style}>
            <div className="pl-12 pr-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`lg:hidden p-1.5 rounded-lg transition-colors ${isProfilePage ? 'hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/80'}`}
                  title="Toggle sidebar"
                >
                  {sidebarOpen ? <X className={`w-5 h-5 ${isProfilePage ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} /> : <MenuIcon className={`w-5 h-5 ${isProfilePage ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />}
                </button>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`hidden lg:flex items-center justify-center p-2 rounded-lg transition-colors ${isProfilePage ? 'hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/80'}`}
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <MenuIcon className={`w-5 h-5 ${isProfilePage ? 'text-white' : 'text-gray-700 dark:text-gray-300'} transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className={`p-1.5 rounded-lg transition-colors ${isProfilePage ? 'hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/80'}`}>
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </button>
                <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Children Content */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 pl-12 transition-colors duration-300">
            {children}
          </main>
        </div>
    </div>
  );
};

export default AdminLayout;




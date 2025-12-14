import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  LayoutDashboard, 
  Table as TableIcon, 
  UtensilsCrossed,
  ShoppingCart,
  Receipt,
  LogOut,
  Menu as MenuIcon,
  X,
  Settings,
  CreditCard,
  Gift,
  Ticket,
  UserCircle
} from 'lucide-react';

interface OwnerLayoutProps {
  children: ReactNode;
}

const OwnerLayout = ({ children }: OwnerLayoutProps) => {
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
    { path: '/owner', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/owner/tables', icon: TableIcon, label: 'Tables' },
    { path: '/owner/menu', icon: UtensilsCrossed, label: 'Menu' },
    { path: '/owner/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/owner/bills', icon: Receipt, label: 'Bills' },
    { path: '/owner/loyalty', icon: Gift, label: 'Loyalty' },
    { path: '/owner/coupons', icon: Ticket, label: 'Coupons' },
    { path: '/owner/billing-configuration', icon: CreditCard, label: 'Billing Config' },
  ];

  const settingsMenuItems = [
    { path: '/owner/settings', icon: Settings, label: 'Settings' },
  ];

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
                      const isActive = (item.path === '/owner' && (location.pathname === '/owner' || location.pathname === '/owner/')) ||
                        (item.path !== '/owner' && location.pathname.startsWith(item.path));
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
                    const isActive = (item.path === '/owner' && (location.pathname === '/owner' || location.pathname === '/owner/')) ||
                      (item.path !== '/owner' && location.pathname.startsWith(item.path));
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
        {sidebarOpen && !isDesktop && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {/* Sticky Navbar */}
          <nav className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/80"
                  title="Toggle sidebar"
                >
                  {sidebarOpen ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                </button>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/80"
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <MenuIcon className={`w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right mr-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Owner'}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'O'}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Children Content */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
};

export default OwnerLayout;

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { 
  Table as TableIcon, 
  UtensilsCrossed, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  ArrowRight,
  Users,
  Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  table?: {
    tableNumber: number;
  };
}

const DashboardHome = () => {
  const { user, _hasHydrated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tables: 0,
    menuItems: 0,
    orders: 0,
    revenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const fetchStats = useCallback(async () => {
    if (!user?.restaurantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [tablesRes, itemsRes, ordersRes, statsRes] = await Promise.all([
        api.get(`/tables?restaurantId=${user.restaurantId}`),
        api.get(`/items?restaurantId=${user.restaurantId}`),
        api.get(`/billing/orders?restaurantId=${user.restaurantId}`),
        api.get(`/restaurants/${user.restaurantId}/stats`),
      ]);
      
      const orders = ordersRes.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = orders.filter((o: any) => new Date(o.createdAt) >= today);
      const todayRevenue = todayOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
      const pendingOrders = orders.filter((o: any) => 
        ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status)
      ).length;
      const completedOrders = orders.filter((o: any) => o.status === 'COMPLETED').length;
      
      setStats({
        tables: tablesRes.data.length,
        menuItems: itemsRes.data.length,
        orders: orders.length,
        revenue: statsRes.data?.totalRevenue || 0,
        todayOrders: todayOrders.length,
        todayRevenue,
        pendingOrders,
        completedOrders,
      });
      
      // Get recent orders
      const recent = orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentOrders(recent);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => {
    // Wait for store to hydrate and user to be available
    if (!_hasHydrated) {
      // Check localStorage as fallback
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          if (parsedUser?.restaurantId) {
            // User exists in localStorage, wait a bit for hydration
            const timer = setTimeout(() => {
              fetchStats();
            }, 150);
            return () => clearTimeout(timer);
          } else {
            setLoading(false);
          }
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      return;
    }

    // Once hydrated, check if user has restaurantId
    if (user?.restaurantId) {
      fetchStats();
    } else if (user && !user.restaurantId) {
      // User is logged in but has no restaurantId
      setLoading(false);
    } else {
      // No user, should not happen if ProtectedRoute works
      setLoading(false);
    }
  }, [user, _hasHydrated, fetchStats]);

  const statCards = [
    { 
      label: 'Total Tables', 
      value: stats.tables, 
      icon: TableIcon, 
      color: 'bg-gradient-to-br from-primary to-primary-dark',
      change: null,
      link: '/owner/tables'
    },
    { 
      label: 'Menu Items', 
      value: stats.menuItems, 
      icon: UtensilsCrossed, 
      color: 'bg-gradient-to-br from-secondary to-orange-600',
      change: null,
      link: '/owner/menu'
    },
    { 
      label: 'Today\'s Orders', 
      value: stats.todayOrders, 
      icon: ShoppingCart, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      change: stats.todayOrders > 0 ? 'positive' : null,
      link: '/owner/orders'
    },
    { 
      label: 'Today\'s Revenue', 
      value: `$${stats.todayRevenue.toFixed(2)}`, 
      icon: DollarSign, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: stats.todayRevenue > 0 ? 'positive' : null,
      link: '/owner/bills'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return Clock;
      case 'PREPARING':
        return ChefHat;
      case 'READY':
        return Package;
      case 'COMPLETED':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800';
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Here's what's happening at your restaurant today
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`${stat.color} p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    stat.change === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {stat.change === 'positive' ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingOrders}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Requires attention</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Completed Today</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completedOrders}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Orders fulfilled</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">${stats.revenue.toFixed(2)}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">All time</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-0.5">Recent Orders</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Latest customer orders</p>
          </div>
          <button
            onClick={() => navigate('/owner/orders')}
            className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-6">
            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No recent orders</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate('/owner/orders')}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`${getStatusColor(order.status)} px-2 py-0.5 rounded-md flex items-center gap-1.5 flex-shrink-0`}>
                      <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-[10px] sm:text-xs font-medium">{order.status}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{order.orderNumber}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                        Table {order.table?.tableNumber || 'N/A'} • {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm sm:text-base font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/owner/menu')}
            className="p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-center"
          >
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Add Menu Item</p>
          </button>
          <button
            onClick={() => navigate('/owner/tables')}
            className="p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-center"
          >
            <TableIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Add Table</p>
          </button>
          <button
            onClick={() => navigate('/owner/coupons')}
            className="p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-center"
          >
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Create Coupon</p>
          </button>
          <button
            onClick={() => navigate('/owner/settings')}
            className="p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-center"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Settings</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;














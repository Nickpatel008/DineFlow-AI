import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Users, 
  TrendingUp, 
  Activity, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  Bell,
  Search,
  MoreVertical,
  PieChart,
  BarChart3,
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

const DashboardHome = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    restaurants: 0,
    owners: 0,
    totalRevenue: 0,
    activeOrders: 0,
    savings: 5839,
    savingsChange: -11,
    incomeGrowth: 8,
  });

  const [viewMode, setViewMode] = useState<'full' | 'summary'>('full');
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [restaurantsRes, ownersRes, adminStatsRes, ordersRes, billsRes] = await Promise.all([
          api.get('/restaurants'),
          api.get('/owners'),
          api.get('/admin/stats').catch(() => ({ data: null })),
          api.get('/billing/orders').catch(() => ({ data: [] })),
          api.get('/billing/bills').catch(() => ({ data: [] })),
        ]);

        const adminStats = adminStatsRes.data || {};
        const orders = ordersRes.data || [];
        const bills = billsRes.data || [];

        // Calculate real revenue from bills
        const totalRevenue = bills.reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);
        
        // Calculate active orders
        const activeOrders = orders.filter((order: any) => 
          order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'PREPARING'
        ).length;

        // Get restaurant names for bills
        const restaurantMap = new Map(restaurantsRes.data.map((r: any) => [r.id, r.name]));

        // Calculate recent payments from bills (last 5)
        const recentBills = bills
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((bill: any, index: number) => {
            const restaurantName = restaurantMap.get(bill.restaurantId) || `Restaurant ${index + 1}`;
            return {
              id: bill.id,
              name: restaurantName,
              avatar: restaurantName.substring(0, 2).toUpperCase(),
              date: new Date(bill.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              amount: `$${bill.total.toFixed(2)}`,
              status: bill.paidAt ? 'Done' : 'Pending',
              statusColor: bill.paidAt ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
            };
          });

        // Calculate transactions from recent bills
        const transactions = recentBills.map((bill: any, index: number) => ({
          id: bill.id,
          receiver: bill.name,
          avatar: bill.avatar,
          type: bill.status === 'Done' ? 'Payment' : 'Invoice',
          status: bill.status,
          statusColor: bill.statusColor,
          date: bill.date,
          amount: bill.amount
        }));

        // Calculate income growth from admin stats
        const incomeGrowth = adminStats.revenueGrowth || 0;

        setStats({
          restaurants: restaurantsRes.data.length,
          owners: ownersRes.data.length,
          totalRevenue: totalRevenue,
          activeOrders: activeOrders,
          savings: Math.round(totalRevenue * 0.15), // Mock savings calculation
          savingsChange: -11, // Mock value
          incomeGrowth: Math.round(incomeGrowth),
        });

        setRecentPayments(recentBills);
        setTransactions(transactions);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);


  // Calculate income data from stats
  const incomeData = [
    { label: `${Math.round(stats.totalRevenue * 0.15 / 1000)}k`, value: 15, color: 'bg-teal-400' },
    { label: `${Math.round(stats.totalRevenue * 0.21 / 1000)}k`, value: 21, color: 'bg-purple-400' },
    { label: `${Math.round(stats.totalRevenue * 0.32 / 1000)}k`, value: 32, color: 'bg-orange-400' },
  ];

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'full'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Full Statistics
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'summary'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Results Summary
            </button>
          </div>
        </div>
      </div>

      {/* Top Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Team Payments Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Team Payments</h3>
            <Bell className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-center gap-1.5 mb-3">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-600 dark:text-gray-400">Recent Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center"
                >
                  <span className="text-white text-[10px] font-semibold">{String.fromCharCode(64 + i)}</span>
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1.5">{stats.restaurants}+</span>
          </div>
        </motion.div>

        {/* Savings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Savings</span>
            </div>
            <button className="w-6 h-6 bg-black dark:bg-gray-700 rounded-full flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-white dark:text-gray-300" />
            </button>
          </div>
          <div className="h-12 mb-3 flex items-end gap-0.5">
            {[20, 35, 28, 45, 32, 50, 40].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-teal-400 dark:bg-teal-500 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">${stats.savings.toLocaleString()}</p>
            <p className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-0.5">
              <ArrowDown className="w-2.5 h-2.5" />
              {Math.abs(stats.savingsChange)}% last week
            </p>
          </div>
        </motion.div>

        {/* Income Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Income statistics</h3>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">+{stats.incomeGrowth}%</span>
          </div>
          <div className="h-28 flex items-end justify-between gap-2 mb-3">
            {incomeData.map((item, index) => {
              // Calculate bar height as percentage of container (max 100%)
              const barHeight = Math.min((item.value / 32) * 100, 100);
              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full">
                  <div className="relative w-full h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                      className={`w-full ${item.color} dark:opacity-80 rounded-t min-h-[4px]`}
                      style={{ minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1.5 font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700">
            <span>$0</span>
            <span>${Math.round(stats.totalRevenue / 2 / 1000)}k</span>
            <span>${Math.round(stats.totalRevenue / 1000)}k</span>
          </div>
        </motion.div>

        {/* Plan Promotion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 border-2 border-dashed border-teal-400 relative overflow-hidden"
        >
          <Sparkles className="absolute top-3 right-3 w-5 h-5 text-white/50" />
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white mb-1">$95.9 Per Month</p>
            <p className="text-white/90 text-xs mb-4">Choose Best Plan For You!</p>
            <div className="flex gap-1.5">
              <button className="flex-1 bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors">
                Details
              </button>
              <button className="flex-1 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-900 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Payments</h2>
        <div className="space-y-3">
          {recentPayments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent payments</p>
          ) : (
            recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{payment.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{payment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{payment.amount}</p>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${payment.statusColor}`}>
                  {payment.status}
                </span>
                <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </motion.div>


      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Transactions</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  <input type="checkbox" className="rounded w-3 h-3" />
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Receiver</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-3">
                    <input type="checkbox" className="rounded w-3 h-3" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{transaction.avatar}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.receiver}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-600 dark:text-gray-400">{transaction.type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${transaction.statusColor}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-600 dark:text-gray-400">{transaction.date}</td>
                  <td className="py-3 px-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{transaction.amount}</td>
                  <td className="py-3 px-3">
                    <button className="text-primary hover:text-primary-dark font-medium text-xs">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;

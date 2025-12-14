import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Calendar, CheckCircle2, XCircle, Clock, AlertCircle,
  Search, ChevronDown, Eye, MoreVertical, Store, DollarSign
} from 'lucide-react';
import api from '../../utils/api';
import { generateDummySubscriptions } from '../../utils/dummyData';

interface Subscription {
  id: string;
  restaurantId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  createdAt: string;
  restaurant?: {
    id: string;
    name: string;
  };
  plan?: {
    id: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
  };
}

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, [searchQuery, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions');
      let data = response.data || [];
      
      // Get restaurant IDs for dummy data
      const restaurantIds = Array.from({ length: 25 }, (_, i) => `rest-${i + 1}`);
      
      // Add dummy data if we don't have enough records (target: 20 subscriptions)
      if (data.length < 20) {
        const dummyData = generateDummySubscriptions(20, restaurantIds);
        // Merge API data with dummy data, avoiding duplicates
        const existingIds = new Set(data.map((s: Subscription) => s.id));
        const newDummyData = dummyData.filter(s => !existingIds.has(s.id));
        data = [...data, ...newDummyData];
      }

      // Apply search filter after adding dummy data
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        data = data.filter((sub: Subscription) => 
          sub.restaurant?.name.toLowerCase().includes(query) ||
          sub.plan?.name.toLowerCase().includes(query) ||
          sub.id.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        data = data.filter((sub: Subscription) => sub.status === statusFilter);
      }

      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      // On error, use dummy data
      const restaurantIds = Array.from({ length: 25 }, (_, i) => `rest-${i + 1}`);
      const dummyData = generateDummySubscriptions(20, restaurantIds);
      setSubscriptions(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        label: 'Active',
        icon: CheckCircle2,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
        iconColor: 'text-red-600 dark:text-red-400',
      },
      expired: {
        label: 'Expired',
        icon: AlertCircle,
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        textColor: 'text-orange-700 dark:text-orange-400',
        iconColor: 'text-orange-600 dark:text-orange-400',
      },
      pending: {
        label: 'Pending',
        icon: Clock,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetails(true);
  };

  const getPrice = (subscription: Subscription) => {
    if (!subscription.plan) return 0;
    return subscription.billingCycle === 'monthly' 
      ? subscription.plan.monthlyPrice 
      : subscription.plan.yearlyPrice;
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Subscriptions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage restaurant subscriptions</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by restaurant name, plan, or subscription ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Restaurant</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Plan</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Billing Cycle</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Next Billing</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">No subscriptions found</p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription, index) => {
                  const statusConfig = getStatusConfig(subscription.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Store className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {subscription.restaurant?.name || 'Unknown Restaurant'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{subscription.restaurantId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {subscription.plan?.name || 'Unknown Plan'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {subscription.billingCycle}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            ${getPrice(subscription).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(subscription.nextBillingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(subscription)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Details Modal */}
      <AnimatePresence>
        {showDetails && selectedSubscription && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDetails(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Subscription Details</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">View complete subscription information</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Restaurant Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Restaurant</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedSubscription.restaurant?.name || 'Unknown Restaurant'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {selectedSubscription.restaurantId}</p>
                </div>

                {/* Plan Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Plan Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Plan Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {selectedSubscription.plan?.name || 'Unknown Plan'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Billing Cycle</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {selectedSubscription.billingCycle}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Monthly Price</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${selectedSubscription.plan?.monthlyPrice.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Yearly Price</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${selectedSubscription.plan?.yearlyPrice.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status & Dates */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Status & Dates</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                      {(() => {
                        const statusConfig = getStatusConfig(selectedSubscription.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                            {statusConfig.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Amount</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${getPrice(selectedSubscription).toFixed(2)}/{selectedSubscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(selectedSubscription.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(selectedSubscription.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Next Billing Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(selectedSubscription.nextBillingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Created At</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(selectedSubscription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionsPage;


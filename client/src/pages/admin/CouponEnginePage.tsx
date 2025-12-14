import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Search,
  Store,
  Calendar,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface Coupon {
  id: string;
  code: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_item';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  status: 'active' | 'expired' | 'inactive' | 'paused';
  applicableTo: 'all' | 'new_customers' | 'existing_customers';
  createdAt: string;
}

const CouponEnginePage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Generate dummy coupons
  const generateDummyCoupons = (): Coupon[] => {
    const restaurants = [
      'Italian Bistro', 'Sushi House', 'The Golden Spoon', 'Bella Vista', 'Ocean Breeze',
      'Mountain Peak', 'Sunset Grill', 'Royal Palace', 'Garden Terrace', 'Coastal Kitchen',
    ];

    const codes = [
      'WELCOME10', 'SAVE20', 'FIRST50', 'SUMMER25', 'FALL15', 'WINTER30', 'SPRING20',
      'NEWUSER', 'LOYALTY15', 'VIP25', 'FLASH30', 'DEAL40', 'SPECIAL20', 'BONUS10', 'MEGA50',
    ];

    const types: ('percentage' | 'fixed' | 'free_item')[] = ['percentage', 'fixed', 'free_item'];
    const statuses: ('active' | 'expired' | 'inactive' | 'paused')[] = ['active', 'expired', 'inactive', 'paused'];
    const applicableTo: ('all' | 'new_customers' | 'existing_customers')[] = ['all', 'new_customers', 'existing_customers'];

    const coupons: Coupon[] = [];

    for (let i = 0; i < 20; i++) {
      const type = types[i % types.length];
      const restaurantId = `rest-${(i % restaurants.length) + 1}`;
      const restaurantName = restaurants[i % restaurants.length];
      const now = new Date();
      const validFrom = new Date(now.getTime() - (i % 30) * 24 * 60 * 60 * 1000);
      const validUntil = new Date(validFrom.getTime() + (30 + (i % 60)) * 24 * 60 * 60 * 1000);
      const isExpired = validUntil < now;

      coupons.push({
        id: `coupon-${i + 1}`,
        code: codes[i % codes.length] + (i >= codes.length ? i : ''),
        restaurantId,
        restaurantName,
        name: `${type === 'percentage' ? `${10 + (i % 40)}% Off` : type === 'fixed' ? `$${5 + (i % 20)} Off` : 'Free Item'}`,
        description: `Special ${type === 'percentage' ? 'percentage' : type === 'fixed' ? 'fixed amount' : 'free item'} discount`,
        type,
        value: type === 'percentage' ? 10 + (i % 40) : type === 'fixed' ? 5 + (i % 20) : 0,
        minOrderAmount: 20 + (i % 30),
        maxDiscount: type === 'percentage' ? 50 + (i % 50) : undefined,
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
        usageLimit: 100 + (i % 500),
        usedCount: Math.floor((100 + (i % 500)) * (0.1 + (i % 0.8))),
        status: isExpired ? 'expired' : (statuses[i % statuses.length] === 'expired' ? 'active' : statuses[i % statuses.length]),
        applicableTo: applicableTo[i % applicableTo.length],
        createdAt: validFrom.toISOString(),
      });
    }

    return coupons;
  };

  useEffect(() => {
    const loadCoupons = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyCoupons = generateDummyCoupons();
      setCoupons(dummyCoupons);
      setLoading(false);
    };
    loadCoupons();
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    const matchesType = typeFilter === 'all' || coupon.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCoupons(prev => prev.filter(c => c.id !== id));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard!');
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        label: 'Active',
        icon: CheckCircle2,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
      },
      expired: {
        label: 'Expired',
        icon: XCircle,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
      },
      inactive: {
        label: 'Inactive',
        icon: XCircle,
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        textColor: 'text-gray-700 dark:text-gray-400',
      },
      paused: {
        label: 'Paused',
        icon: Clock,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-400',
      },
    };
    return configs[status as keyof typeof configs] || configs.inactive;
  };

  const getTypeIcon = (type: string) => {
    return type === 'percentage' ? Percent : type === 'fixed' ? DollarSign : Ticket;
  };

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Coupon Engine</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage discount coupons and promotional codes</p>
        </div>
        <button
          onClick={() => toast.info('Create coupon feature coming soon')}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Coupons</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{coupons.length}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Coupons</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {coupons.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Uses</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {coupons.reduce((sum, c) => sum + c.usedCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Usage Rate</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {coupons.length > 0
                  ? Math.round(
                      (coupons.reduce((sum, c) => sum + (c.usedCount / (c.usageLimit || 1)), 0) / coupons.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons by code, name, or restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
          <option value="paused">Paused</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="free_item">Free Item</option>
        </select>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Coupon Code</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Restaurant</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Value</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Usage</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Valid Until</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">No coupons found</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon, index) => {
                  const statusConfig = getStatusConfig(coupon.status);
                  const StatusIcon = statusConfig.icon;
                  const TypeIcon = getTypeIcon(coupon.type);
                  const usagePercentage = coupon.usageLimit ? (coupon.usedCount / coupon.usageLimit) * 100 : 0;

                  return (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary font-mono text-xs rounded">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Copy code"
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{coupon.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{coupon.description}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{coupon.restaurantName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{coupon.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {coupon.type === 'percentage'
                            ? `${coupon.value}%`
                            : coupon.type === 'fixed'
                            ? `$${coupon.value}`
                            : 'Free Item'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                usagePercentage >= 80 ? 'bg-red-500' : usagePercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {coupon.usedCount}/{coupon.usageLimit || '∞'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(coupon.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponEnginePage;


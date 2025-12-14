import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  Search,
  Store,
  Users,
  TrendingUp,
  Award,
  Coins,
  Star,
  X,
  Save,
  Settings,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface LoyaltyProgram {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  type: 'points' | 'stamps' | 'tier';
  rules: {
    pointsPerDollar?: number;
    pointsPerOrder?: number;
    stampsRequired?: number;
    tierLevels?: { name: string; minPoints: number; benefits: string[] }[];
  };
  rewards: {
    id: string;
    name: string;
    pointsRequired: number;
    discount?: number;
    freeItem?: string;
    description: string;
  }[];
  status: 'active' | 'inactive' | 'paused';
  totalMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  createdAt: string;
}

const LoyaltyEnginePage = () => {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<LoyaltyProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Generate dummy loyalty programs
  const generateDummyPrograms = (): LoyaltyProgram[] => {
    const restaurants = [
      'Italian Bistro', 'Sushi House', 'The Golden Spoon', 'Bella Vista', 'Ocean Breeze',
      'Mountain Peak', 'Sunset Grill', 'Royal Palace', 'Garden Terrace', 'Coastal Kitchen',
    ];

    const programTypes: ('points' | 'stamps' | 'tier')[] = ['points', 'stamps', 'tier'];
    const statuses: ('active' | 'inactive' | 'paused')[] = ['active', 'inactive', 'paused'];

    const programs: LoyaltyProgram[] = [];

    for (let i = 0; i < 15; i++) {
      const type = programTypes[i % programTypes.length];
      const restaurantId = `rest-${(i % restaurants.length) + 1}`;
      const restaurantName = restaurants[i % restaurants.length];

      const rewards = [
        {
          id: `reward-${i}-1`,
          name: '$5 Off',
          pointsRequired: 100,
          discount: 5,
          description: 'Get $5 off your next order',
        },
        {
          id: `reward-${i}-2`,
          name: 'Free Appetizer',
          pointsRequired: 200,
          freeItem: 'Appetizer',
          description: 'Free appetizer with your order',
        },
        {
          id: `reward-${i}-3`,
          name: '20% Off',
          pointsRequired: 300,
          discount: 20,
          description: 'Get 20% off your entire order',
        },
      ];

      programs.push({
        id: `loyalty-${i + 1}`,
        restaurantId,
        restaurantName,
        name: `${restaurantName} Rewards`,
        description: `Earn points and redeem rewards at ${restaurantName}`,
        type,
        rules: type === 'points'
          ? {
              pointsPerDollar: 1 + (i % 3),
              pointsPerOrder: 10 + (i % 5) * 5,
            }
          : type === 'stamps'
          ? {
              stampsRequired: 10 + (i % 5),
            }
          : {
              tierLevels: [
                { name: 'Bronze', minPoints: 0, benefits: ['5% discount'] },
                { name: 'Silver', minPoints: 500, benefits: ['10% discount', 'Free delivery'] },
                { name: 'Gold', minPoints: 1000, benefits: ['15% discount', 'Free delivery', 'Priority support'] },
              ],
            },
        rewards,
        status: statuses[i % statuses.length],
        totalMembers: 50 + (i % 500),
        totalPointsIssued: 10000 + (i % 50000),
        totalPointsRedeemed: 5000 + (i % 25000),
        createdAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return programs;
  };

  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyPrograms = generateDummyPrograms();
      setPrograms(dummyPrograms);
      setLoading(false);
    };
    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter(program => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loyalty program?')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPrograms(prev => prev.filter(p => p.id !== id));
      toast.success('Loyalty program deleted successfully');
    } catch (error) {
      toast.error('Failed to delete loyalty program');
    }
  };

  const handleStatusToggle = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setPrograms(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
            : p
        )
      );
      toast.success('Loyalty program status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        label: 'Active',
        icon: CheckCircle2,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
      },
      inactive: {
        label: 'Inactive',
        icon: XCircle,
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        textColor: 'text-gray-700 dark:text-gray-400',
      },
      paused: {
        label: 'Paused',
        icon: XCircle,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-400',
      },
    };
    return configs[status as keyof typeof configs] || configs.inactive;
  };

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading loyalty programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Loyalty Engine</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage customer loyalty programs and rewards</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Program
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
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Programs</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{programs.length}</p>
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
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {programs.reduce((sum, p) => sum + p.totalMembers, 0).toLocaleString()}
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
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Points Issued</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {programs.reduce((sum, p) => sum + p.totalPointsIssued, 0).toLocaleString()}
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
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Points Redeemed</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {programs.reduce((sum, p) => sum + p.totalPointsRedeemed, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search loyalty programs..."
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
          <option value="inactive">Inactive</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((program, index) => {
          const statusConfig = getStatusConfig(program.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{program.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Store className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{program.restaurantName}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{program.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {program.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Program Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Members</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{program.totalMembers}</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Rewards</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{program.rewards.length}</p>
                </div>
              </div>

              {/* Rewards Preview */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Available Rewards:</p>
                <div className="space-y-1.5">
                  {program.rewards.slice(0, 2).map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{reward.name}</p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">{reward.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {reward.pointsRequired}
                        </span>
                      </div>
                    </div>
                  ))}
                  {program.rewards.length > 2 && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                      +{program.rewards.length - 2} more rewards
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleStatusToggle(program.id)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    program.status === 'active'
                      ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {program.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => {
                    setEditingProgram(program);
                    setShowEditModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No loyalty programs found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create First Program
          </button>
        </div>
      )}
    </div>
  );
};

export default LoyaltyEnginePage;


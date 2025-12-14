import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  Award,
  Coins,
  X,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import { toast } from '../../utils/toast';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface LoyaltyProgram {
  id: string;
  restaurantId: string;
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
  const { user } = useAuthStore();
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<LoyaltyProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'points' as 'points' | 'stamps' | 'tier',
    pointsPerDollar: '',
    pointsPerOrder: '',
  });

  useEffect(() => {
    if (user?.restaurantId) {
      fetchPrograms();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      const response = await api.get(`/loyalty-programs?restaurantId=${user?.restaurantId}`);
      setPrograms(response.data.filter((p: LoyaltyProgram) => p.restaurantId === user?.restaurantId));
    } catch (error) {
      console.error('Failed to fetch loyalty programs:', error);
      toast.error('Failed to load loyalty programs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (program?: LoyaltyProgram) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name,
        description: program.description,
        type: program.type,
        pointsPerDollar: program.rules.pointsPerDollar?.toString() || '',
        pointsPerOrder: program.rules.pointsPerOrder?.toString() || '',
      });
    } else {
      setEditingProgram(null);
      setFormData({
        name: '',
        description: '',
        type: 'points',
        pointsPerDollar: '',
        pointsPerOrder: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      type: 'points',
      pointsPerDollar: '',
      pointsPerOrder: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.restaurantId) return;

    try {
      const loadingToast = toast.loading(editingProgram ? 'Updating program...' : 'Creating program...');
      
      const programData = {
        restaurantId: user.restaurantId,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        rules: {
          pointsPerDollar: formData.pointsPerDollar ? parseFloat(formData.pointsPerDollar) : undefined,
          pointsPerOrder: formData.pointsPerOrder ? parseFloat(formData.pointsPerOrder) : undefined,
        },
        rewards: [],
        status: 'active',
      };

      if (editingProgram) {
        await api.put(`/loyalty-programs/${editingProgram.id}`, programData);
        toast.dismiss(loadingToast);
        toast.success('Loyalty program updated successfully!');
      } else {
        await api.post('/loyalty-programs', programData);
        toast.dismiss(loadingToast);
        toast.success('Loyalty program created successfully!');
      }

      handleCloseModal();
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save loyalty program');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const loadingToast = toast.loading('Deleting program...');
      await api.delete(`/loyalty-programs/${id}`);
      toast.dismiss(loadingToast);
      toast.success('Loyalty program deleted successfully!');
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete loyalty program');
    }
  };

  const toggleStatus = async (program: LoyaltyProgram) => {
    try {
      const newStatus = program.status === 'active' ? 'inactive' : 'active';
      await api.put(`/loyalty-programs/${program.id}`, { status: newStatus });
      toast.success(`Program ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to update program status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading loyalty programs...</p>
        </div>
      </div>
    );
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Loyalty Programs
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage customer loyalty and rewards</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm text-center py-8">
          <Gift className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? 'No programs match your search' 
              : 'No loyalty programs yet'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              Create First Program
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredPrograms.map((program, index) => {
            const StatusIcon = program.status === 'active' ? CheckCircle2 : XCircle;
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">{program.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{program.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    program.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <StatusIcon className="w-3 h-3" />
                    {program.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{program.description}</p>

                <div className="space-y-1.5 mb-3">
                  {program.type === 'points' && (
                    <>
                      {program.rules.pointsPerDollar && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Points per $:</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{program.rules.pointsPerDollar}</span>
                        </div>
                      )}
                      {program.rules.pointsPerOrder && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Points per order:</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{program.rules.pointsPerOrder}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Members:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{program.totalMembers}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rewards:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{program.rewards.length}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleStatus(program)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      program.status === 'active'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
                    }`}
                  >
                    {program.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleOpenModal(program)}
                    className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id, program.name)}
                    className="px-2 py-1.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {editingProgram ? 'Edit Loyalty Program' : 'Create Loyalty Program'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Rewards Club"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Describe your loyalty program..."
                  />
                </div>

                <div>
                  <Label htmlFor="type">Program Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="points">Points Based</option>
                    <option value="stamps">Stamps Based</option>
                    <option value="tier">Tier Based</option>
                  </select>
                </div>

                {formData.type === 'points' && (
                  <>
                    <div>
                      <Label htmlFor="pointsPerDollar">Points per Dollar</Label>
                      <Input
                        id="pointsPerDollar"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.pointsPerDollar}
                        onChange={(e) => setFormData({ ...formData, pointsPerDollar: e.target.value })}
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pointsPerOrder">Points per Order</Label>
                      <Input
                        id="pointsPerOrder"
                        type="number"
                        min="0"
                        value={formData.pointsPerOrder}
                        onChange={(e) => setFormData({ ...formData, pointsPerOrder: e.target.value })}
                        placeholder="e.g., 10"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoyaltyEnginePage;


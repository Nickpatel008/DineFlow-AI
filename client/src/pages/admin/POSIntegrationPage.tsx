import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Search,
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  Link2,
  AlertCircle,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface POSIntegration {
  id: string;
  restaurantId: string;
  restaurantName: string;
  provider: 'square' | 'toast' | 'clover' | 'revel' | 'custom';
  providerName: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  syncFrequency: 'realtime' | '5min' | '15min' | '30min' | '1hour';
  syncDirection: 'bidirectional' | 'pos_to_dineflow' | 'dineflow_to_pos';
  menuSyncEnabled: boolean;
  orderSyncEnabled: boolean;
  paymentSyncEnabled: boolean;
  inventorySyncEnabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  errorMessage?: string;
  createdAt: string;
}

const POSIntegrationPage = () => {
  const [integrations, setIntegrations] = useState<POSIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Generate dummy POS integrations
  const generateDummyIntegrations = (): POSIntegration[] => {
    const restaurants = [
      'Italian Bistro', 'Sushi House', 'The Golden Spoon', 'Bella Vista', 'Ocean Breeze',
      'Mountain Peak', 'Sunset Grill', 'Royal Palace', 'Garden Terrace', 'Coastal Kitchen',
    ];

    const providers: ('square' | 'toast' | 'clover' | 'revel' | 'custom')[] = [
      'square',
      'toast',
      'clover',
      'revel',
      'custom',
    ];

    const providerNames = {
      square: 'Square',
      toast: 'Toast',
      clover: 'Clover',
      revel: 'Revel Systems',
      custom: 'Custom POS',
    };

    const statuses: ('connected' | 'disconnected' | 'syncing' | 'error')[] = [
      'connected',
      'disconnected',
      'syncing',
      'error',
    ];

    const syncFrequencies: ('realtime' | '5min' | '15min' | '30min' | '1hour')[] = [
      'realtime',
      '5min',
      '15min',
      '30min',
      '1hour',
    ];

    const integrations: POSIntegration[] = [];

    for (let i = 0; i < 12; i++) {
      const provider = providers[i % providers.length];
      const restaurantId = `rest-${(i % restaurants.length) + 1}`;
      const restaurantName = restaurants[i % restaurants.length];
      const status = statuses[i % statuses.length];
      const now = new Date();
      const lastSync = new Date(now.getTime() - (i % 60) * 60 * 1000);

      integrations.push({
        id: `pos-${i + 1}`,
        restaurantId,
        restaurantName,
        provider,
        providerName: providerNames[provider],
        status,
        lastSync: lastSync.toISOString(),
        syncFrequency: syncFrequencies[i % syncFrequencies.length],
        syncDirection: i % 3 === 0 ? 'bidirectional' : i % 3 === 1 ? 'pos_to_dineflow' : 'dineflow_to_pos',
        menuSyncEnabled: i % 2 === 0,
        orderSyncEnabled: true,
        paymentSyncEnabled: i % 3 !== 0,
        inventorySyncEnabled: i % 4 === 0,
        apiKey: status === 'connected' ? `sk_${Math.random().toString(36).substring(7)}` : undefined,
        endpoint: provider === 'custom' ? `https://pos-${i + 1}.example.com/api` : undefined,
        errorMessage: status === 'error' ? 'Connection timeout. Please check API credentials.' : undefined,
        createdAt: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return integrations;
  };

  useEffect(() => {
    const loadIntegrations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyIntegrations = generateDummyIntegrations();
      setIntegrations(dummyIntegrations);
      setLoading(false);
    };
    loadIntegrations();
  }, []);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch =
      integration.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConnect = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIntegrations(prev =>
        prev.map(i => (i.id === id ? { ...i, status: 'connected' as const, errorMessage: undefined } : i))
      );
      toast.success('POS integration connected successfully');
    } catch (error) {
      toast.error('Failed to connect POS integration');
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this POS integration?')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIntegrations(prev =>
        prev.map(i => (i.id === id ? { ...i, status: 'disconnected' as const } : i))
      );
      toast.success('POS integration disconnected');
    } catch (error) {
      toast.error('Failed to disconnect POS integration');
    }
  };

  const handleSync = async (id: string) => {
    try {
      const integration = integrations.find(i => i.id === id);
      if (!integration) return;

      setIntegrations(prev =>
        prev.map(i => (i.id === id ? { ...i, status: 'syncing' as const } : i))
      );

      await new Promise(resolve => setTimeout(resolve, 2000));

      setIntegrations(prev =>
        prev.map(i =>
          i.id === id
            ? {
                ...i,
                status: 'connected' as const,
                lastSync: new Date().toISOString(),
              }
            : i
        )
      );
      toast.success('Sync completed successfully');
    } catch (error) {
      setIntegrations(prev =>
        prev.map(i =>
          i.id === id
            ? {
                ...i,
                status: 'error' as const,
                errorMessage: 'Sync failed. Please try again.',
              }
            : i
        )
      );
      toast.error('Sync failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this POS integration?')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIntegrations(prev => prev.filter(i => i.id !== id));
      toast.success('POS integration deleted successfully');
    } catch (error) {
      toast.error('Failed to delete POS integration');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      connected: {
        label: 'Connected',
        icon: CheckCircle2,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      disconnected: {
        label: 'Disconnected',
        icon: XCircle,
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        textColor: 'text-gray-700 dark:text-gray-400',
        iconColor: 'text-gray-600 dark:text-gray-400',
      },
      syncing: {
        label: 'Syncing',
        icon: RefreshCw,
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      error: {
        label: 'Error',
        icon: AlertCircle,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
        iconColor: 'text-red-600 dark:text-red-400',
      },
    };
    return configs[status as keyof typeof configs] || configs.disconnected;
  };

  const getProviderIcon = (provider: string) => {
    return CreditCard;
  };

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading POS integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">POS Integration</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage Point of Sale system integrations</p>
        </div>
        <button
          onClick={() => toast.info('Add POS integration feature coming soon')}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Integration
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
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Connected</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {integrations.filter(i => i.status === 'connected').length}
              </p>
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
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Disconnected</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {integrations.filter(i => i.status === 'disconnected').length}
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
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Syncing</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {integrations.filter(i => i.status === 'syncing').length}
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
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Errors</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {integrations.filter(i => i.status === 'error').length}
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
            placeholder="Search POS integrations..."
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
          <option value="connected">Connected</option>
          <option value="disconnected">Disconnected</option>
          <option value="syncing">Syncing</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration, index) => {
          const statusConfig = getStatusConfig(integration.status);
          const StatusIcon = statusConfig.icon;
          const ProviderIcon = getProviderIcon(integration.provider);

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <ProviderIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {integration.providerName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Store className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {integration.restaurantName}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                  <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
                  {statusConfig.label}
                </span>
              </div>

              {integration.errorMessage && (
                <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-400">{integration.errorMessage}</p>
                </div>
              )}

              {/* Sync Settings */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Sync Frequency</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {integration.syncFrequency === 'realtime' ? 'Real-time' : integration.syncFrequency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Direction</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {integration.syncDirection.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Last Sync</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(integration.lastSync).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Sync Features */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`p-2 rounded-lg text-xs ${integration.menuSyncEnabled ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-500'}`}>
                  Menu Sync {integration.menuSyncEnabled ? '✓' : '✗'}
                </div>
                <div className={`p-2 rounded-lg text-xs ${integration.orderSyncEnabled ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-500'}`}>
                  Order Sync {integration.orderSyncEnabled ? '✓' : '✗'}
                </div>
                <div className={`p-2 rounded-lg text-xs ${integration.paymentSyncEnabled ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-500'}`}>
                  Payment Sync {integration.paymentSyncEnabled ? '✓' : '✗'}
                </div>
                <div className={`p-2 rounded-lg text-xs ${integration.inventorySyncEnabled ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-500'}`}>
                  Inventory Sync {integration.inventorySyncEnabled ? '✓' : '✗'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                {integration.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => handleSync(integration.id)}
                      disabled={integration.status === 'syncing'}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                      Sync Now
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
                <button
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(integration.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No POS integrations found</p>
          <button
            onClick={() => toast.info('Add POS integration feature coming soon')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add First Integration
          </button>
        </div>
      )}
    </div>
  );
};

export default POSIntegrationPage;


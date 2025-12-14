import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Edit,
  Trash2,
  Search,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Shield,
  Globe,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface APIKey {
  id: string;
  name: string;
  description: string;
  key: string;
  keyPrefix: string;
  permissions: {
    restaurants: boolean;
    orders: boolean;
    menu: boolean;
    analytics: boolean;
    billing: boolean;
  };
  rateLimit: {
    requests: number;
    period: 'minute' | 'hour' | 'day';
  };
  status: 'active' | 'revoked' | 'expired';
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
  expiresAt?: string;
  ipWhitelist?: string[];
}

const APIAccessPage = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKey, setNewKey] = useState<string>('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Generate dummy API keys
  const generateDummyKeys = (): APIKey[] => {
    const keyNames = [
      'Production API Key',
      'Development Key',
      'Mobile App Key',
      'Webhook Key',
      'Analytics Key',
      'Third-party Integration',
      'Backup Key',
      'Testing Key',
    ];

    const keys: APIKey[] = [];

    for (let i = 0; i < 10; i++) {
      const keyPrefix = `df_live_${Math.random().toString(36).substring(2, 10)}`;
      const fullKey = `${keyPrefix}_${Math.random().toString(36).substring(2, 32)}`;
      const now = new Date();
      const createdAt = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000);
      const expiresAt = i % 3 === 0 ? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() : undefined;
      const isExpired = expiresAt ? new Date(expiresAt) < now : false;
      const lastUsed = i % 4 === 0 ? undefined : new Date(now.getTime() - (i % 24) * 60 * 60 * 1000).toISOString();

      keys.push({
        id: `key-${i + 1}`,
        name: keyNames[i % keyNames.length] + (i >= keyNames.length ? ` ${Math.floor(i / keyNames.length) + 1}` : ''),
        description: `API key for ${keyNames[i % keyNames.length].toLowerCase()}`,
        key: fullKey,
        keyPrefix,
        permissions: {
          restaurants: i % 2 === 0,
          orders: true,
          menu: i % 3 !== 0,
          analytics: i % 2 === 0,
          billing: i % 4 === 0,
        },
        rateLimit: {
          requests: [100, 500, 1000, 5000][i % 4],
          period: (['minute', 'hour', 'day'] as const)[i % 3],
        },
        status: isExpired ? 'expired' : i % 5 === 0 ? 'revoked' : 'active',
        lastUsed,
        usageCount: 1000 + (i % 10000),
        createdAt: createdAt.toISOString(),
        expiresAt,
        ipWhitelist: i % 3 === 0 ? [`192.168.1.${100 + i}`, `10.0.0.${i}`] : undefined,
      });
    }

    return keys;
  };

  useEffect(() => {
    const loadKeys = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyKeys = generateDummyKeys();
      setApiKeys(dummyKeys);
      setLoading(false);
    };
    loadKeys();
  }, []);

  const filteredKeys = apiKeys.filter(key => {
    const matchesSearch =
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.keyPrefix.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateKey = async () => {
    const newKeyData: APIKey = {
      id: `key-${apiKeys.length + 1}`,
      name: 'New API Key',
      description: 'API key created via admin panel',
      key: `df_live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 32)}`,
      keyPrefix: `df_live_${Math.random().toString(36).substring(2, 10)}`,
      permissions: {
        restaurants: true,
        orders: true,
        menu: true,
        analytics: false,
        billing: false,
      },
      rateLimit: {
        requests: 1000,
        period: 'hour',
      },
      status: 'active',
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setApiKeys(prev => [newKeyData, ...prev]);
      setNewKey(newKeyData.key);
      setShowKeyModal(true);
      setShowCreateModal(false);
      toast.success('API key created successfully');
    } catch (error) {
      toast.error('Failed to create API key');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setApiKeys(prev => prev.map(k => (k.id === id ? { ...k, status: 'revoked' as const } : k)));
      toast.success('API key revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke API key');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setApiKeys(prev => prev.filter(k => k.id !== id));
      toast.success('API key deleted successfully');
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const handleRegenerate = async (id: string) => {
    if (!confirm('Are you sure you want to regenerate this API key? The old key will be revoked.')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newKeyPrefix = `df_live_${Math.random().toString(36).substring(2, 10)}`;
      const newFullKey = `${newKeyPrefix}_${Math.random().toString(36).substring(2, 32)}`;
      setApiKeys(prev =>
        prev.map(k =>
          k.id === id
            ? {
                ...k,
                key: newFullKey,
                keyPrefix: newKeyPrefix,
                lastUsed: undefined,
                usageCount: 0,
              }
            : k
        )
      );
      toast.success('API key regenerated successfully');
    } catch (error) {
      toast.error('Failed to regenerate API key');
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
      revoked: {
        label: 'Revoked',
        icon: XCircle,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
      },
      expired: {
        label: 'Expired',
        icon: Clock,
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        textColor: 'text-orange-700 dark:text-orange-400',
      },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">API Access Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage API keys and access permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create API Key
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
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Keys</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{apiKeys.length}</p>
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Keys</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {apiKeys.filter(k => k.status === 'active').length}
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
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {apiKeys.reduce((sum, k) => sum + k.usageCount, 0).toLocaleString()}
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
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Revoked/Expired</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {apiKeys.filter(k => k.status === 'revoked' || k.status === 'expired').length}
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
            placeholder="Search API keys..."
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
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* API Keys Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">API Key</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Permissions</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate Limit</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Usage</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Last Used</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">No API keys found</p>
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key, index) => {
                  const statusConfig = getStatusConfig(key.status);
                  const StatusIcon = statusConfig.icon;
                  const isVisible = visibleKeys.has(key.id);
                  const displayKey = isVisible ? key.key : `${key.keyPrefix}...${key.key.slice(-8)}`;

                  return (
                    <motion.tr
                      key={key.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{key.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{key.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-xs rounded">
                            {displayKey}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title={isVisible ? 'Hide key' : 'Show key'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5 text-gray-400" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
                          </button>
                          <button
                            onClick={() => handleCopyKey(key.key)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Copy key"
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(key.permissions)
                            .filter(([_, enabled]) => enabled)
                            .map(([perm]) => (
                              <span
                                key={perm}
                                className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-[10px] font-medium capitalize"
                              >
                                {perm}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {key.rateLimit.requests}/{key.rateLimit.period}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                          {key.usageCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {key.lastUsed ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(key.lastUsed).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {key.status === 'active' && (
                            <button
                              onClick={() => handleRegenerate(key.id)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Regenerate"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          {key.status === 'active' && (
                            <button
                              onClick={() => handleRevoke(key.id)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Revoke"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(key.id)}
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

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create API Key</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create a new API key to access DineFlow AI APIs. Make sure to copy and store it securely.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Create Key
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Show New Key Modal */}
      <AnimatePresence>
        {showKeyModal && newKey && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => {
                setShowKeyModal(false);
                setNewKey('');
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">API Key Created</h2>
                </div>
                <button
                  onClick={() => {
                    setShowKeyModal(false);
                    setNewKey('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">Important</p>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Make sure to copy this API key now. You won't be able to see it again!
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-xs rounded border border-gray-200 dark:border-gray-600">
                    {newKey}
                  </code>
                  <button
                    onClick={() => handleCopyKey(newKey)}
                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  setNewKey('');
                }}
                className="w-full px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                I've Copied the Key
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default APIAccessPage;


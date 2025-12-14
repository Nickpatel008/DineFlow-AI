import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Store,
  Settings,
  Trash2,
  Edit,
  Plus,
  CreditCard,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface ActivityLog {
  id: string;
  action: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'owner';
  };
  targetType: 'restaurant' | 'owner' | 'subscription' | 'plan' | 'system';
  targetId: string;
  targetName: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  // Generate dummy activity logs
  const generateDummyLogs = (): ActivityLog[] => {
    const actions = [
      { action: 'Created restaurant', type: 'restaurant', status: 'success' as const },
      { action: 'Updated restaurant', type: 'restaurant', status: 'success' as const },
      { action: 'Deleted restaurant', type: 'restaurant', status: 'success' as const },
      { action: 'Changed restaurant status', type: 'restaurant', status: 'success' as const },
      { action: 'Created owner', type: 'owner', status: 'success' as const },
      { action: 'Updated owner', type: 'owner', status: 'success' as const },
      { action: 'Deleted owner', type: 'owner', status: 'warning' as const },
      { action: 'Created subscription plan', type: 'plan', status: 'success' as const },
      { action: 'Updated subscription plan', type: 'plan', status: 'success' as const },
      { action: 'Cancelled subscription', type: 'subscription', status: 'warning' as const },
      { action: 'Failed payment processing', type: 'subscription', status: 'failed' as const },
      { action: 'Updated system settings', type: 'system', status: 'success' as const },
      { action: 'Exported data', type: 'system', status: 'success' as const },
      { action: 'Bulk operation executed', type: 'restaurant', status: 'success' as const },
    ];

    const users = [
      { id: 'admin-1', name: 'Admin User', email: 'admin@gmail.com', role: 'admin' as const },
      { id: 'admin-2', name: 'Super Admin', email: 'superadmin@dineflow.ai', role: 'admin' as const },
    ];

    const restaurants = [
      'Italian Bistro', 'Sushi House', 'The Golden Spoon', 'Bella Vista', 'Ocean Breeze',
      'Mountain Peak', 'Sunset Grill', 'Royal Palace', 'Garden Terrace', 'Coastal Kitchen',
    ];

    const logs: ActivityLog[] = [];
    const now = new Date();

    for (let i = 0; i < 100; i++) {
      const actionData = actions[i % actions.length];
      const user = users[i % users.length];
      const daysAgo = Math.floor(i / 10);
      const hoursAgo = i % 24;
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);

      logs.push({
        id: `log-${i + 1}`,
        action: actionData.action,
        user,
        targetType: actionData.type as any,
        targetId: `target-${i + 1}`,
        targetName: actionData.type === 'restaurant' 
          ? restaurants[i % restaurants.length]
          : actionData.type === 'owner'
          ? `Owner ${i + 1}`
          : actionData.type === 'plan'
          ? `Plan ${i + 1}`
          : 'System',
        details: `${actionData.action} - ${actionData.type === 'restaurant' ? restaurants[i % restaurants.length] : `Target ${i + 1}`}`,
        ipAddress: `192.168.1.${100 + (i % 155)}`,
        userAgent: i % 3 === 0 
          ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          : i % 3 === 1
          ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
          : 'Mozilla/5.0 (X11; Linux x86_64)',
        timestamp: timestamp.toISOString(),
        status: actionData.status,
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyLogs = generateDummyLogs();
      setLogs(dummyLogs);
      setLoading(false);
    };
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || log.targetType === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    const logDate = new Date(log.timestamp);
    const now = new Date();
    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = logDate.toDateString() === now.toDateString();
    } else if (dateRange === '7days') {
      matchesDate = logDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      matchesDate = logDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      success: {
        icon: CheckCircle2,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      failed: {
        icon: XCircle,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
        iconColor: 'text-red-600 dark:text-red-400',
      },
      warning: {
        icon: AlertCircle,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
      },
    };
    return configs[status as keyof typeof configs] || configs.success;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      restaurant: Store,
      owner: Users,
      subscription: CreditCard,
      plan: Settings,
      system: Settings,
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Target Type', 'Target Name', 'Status', 'IP Address'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.user.name,
        log.targetType,
        log.targetName,
        log.status,
        log.ipAddress,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredLogs.length} log(s) to CSV`);
  };

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Activity Logs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track all system activities and user actions</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs by action, user, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Types</option>
            <option value="restaurant">Restaurant</option>
            <option value="owner">Owner</option>
            <option value="subscription">Subscription</option>
            <option value="plan">Plan</option>
            <option value="system">System</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="warning">Warning</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Timestamp</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Action</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">User</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Target</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">IP Address</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">No activity logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const statusConfig = getStatusConfig(log.status);
                  const StatusIcon = statusConfig.icon;
                  const TypeIcon = getTypeIcon(log.targetType);
                  
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.action}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-[10px] font-semibold">
                              {log.user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{log.user.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{log.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{log.targetName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">{log.ipAddress}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={log.details}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Successful Actions</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {filteredLogs.filter(l => l.status === 'success').length}
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
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Failed Actions</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {filteredLogs.filter(l => l.status === 'failed').length}
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
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Warnings</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {filteredLogs.filter(l => l.status === 'warning').length}
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
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Logs</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{filteredLogs.length}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;


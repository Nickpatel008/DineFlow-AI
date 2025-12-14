import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  X, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Package,
  XCircle,
  Calendar,
  DollarSign,
  Table as TableIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  subtotal: number;
  menuItem?: {
    name: string;
  };
}

interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  table?: {
    tableNumber: number;
  };
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  PREPARING: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: ChefHat },
  READY: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: Package },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const statusFlow: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

const OrdersPage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.restaurantId) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/billing/orders?restaurantId=${user?.restaurantId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const loadingToast = toast.loading('Updating order status...');
      await api.put(`/billing/orders/${orderId}`, { status: newStatus });
      toast.dismiss(loadingToast);
      toast.success(`Order ${newStatus.toLowerCase()} successfully!`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const viewOrderDetails = async (order: Order) => {
    try {
      const response = await api.get(`/billing/orders/${order.id}`);
      setSelectedOrder(response.data);
      setShowDetails(true);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.label || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.menuItem?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(order.createdAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const ordersByStatus = filteredOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
          Orders
        </h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = ordersByStatus[status] || 0;
          const Icon = config.icon;
          return (
            <div key={status} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{config.label}</p>
                  <p className="text-2xl font-bold text-secondary">{count}</p>
                </div>
                <div className={`${config.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-4 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
              ? 'No orders match your filters'
              : 'No orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon;
            const nextStatuses = statusFlow[order.status] || [];
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-bold text-secondary">{order.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <TableIcon className="w-4 h-4" />
                        <span>Table {order.table?.tableNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="text-gray-600">
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                        >
                          {item.quantity}x {item.menuItem?.name || 'Item'}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {nextStatuses.length > 0 && (
                      <div className="flex gap-2">
                        {nextStatuses.map((nextStatus) => {
                          const NextStatusIcon = statusConfig[nextStatus as keyof typeof statusConfig].icon;
                          return (
                            <button
                              key={nextStatus}
                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                              className={`px-4 py-2 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                                nextStatus === 'CANCELLED'
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : 'bg-primary hover:bg-primary-dark'
                              }`}
                            >
                              <NextStatusIcon className="w-4 h-4" />
                              {getStatusLabel(nextStatus)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-secondary">
                  Order Details - {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedOrder(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Table</p>
                    <p className="font-semibold">Table {selectedOrder.table?.tableNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created</p>
                    <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-semibold text-primary text-lg">${selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-bold text-secondary mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-secondary">
                            {item.menuItem?.name || 'Unknown Item'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-primary">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Actions */}
                {statusFlow[selectedOrder.status] && statusFlow[selectedOrder.status].length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-secondary mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {statusFlow[selectedOrder.status].map((nextStatus) => {
                        const NextStatusIcon = statusConfig[nextStatus as keyof typeof statusConfig].icon;
                        return (
                          <button
                            key={nextStatus}
                            onClick={() => {
                              updateOrderStatus(selectedOrder.id, nextStatus);
                              if (nextStatus === 'COMPLETED' || nextStatus === 'CANCELLED') {
                                setShowDetails(false);
                                setSelectedOrder(null);
                              }
                            }}
                            className={`px-4 py-2 rounded-xl font-medium text-white transition-colors flex items-center gap-2 ${
                              nextStatus === 'CANCELLED'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-primary hover:bg-primary-dark'
                            }`}
                          >
                            <NextStatusIcon className="w-4 h-4" />
                            {getStatusLabel(nextStatus)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;

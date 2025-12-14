import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Package,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  table: {
    tableNumber: number;
  };
  restaurant: {
    name: string;
  };
}

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock, color: 'text-yellow-600' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-600' },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat, color: 'text-orange-600' },
  { key: 'READY', label: 'Ready', icon: Package, color: 'text-green-600' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: 'text-gray-600' },
];

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if (autoRefresh && orderId && order?.status !== 'COMPLETED' && order?.status !== 'CANCELLED') {
      const interval = setInterval(() => {
        fetchOrder();
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, orderId, order?.status]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/billing/orders/public/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Order not found</p>
          <button onClick={() => navigate('/scan')} className="btn-primary">
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
            Order Tracking
          </h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-primary border-primary text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-12 mt-2 ${
                        isCompleted ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-semibold ${isCompleted ? 'text-secondary' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {isCurrent && order.status === step.key && (
                      <p className="text-sm text-gray-600 mt-1">
                        Current status • Updated at {formatDate(order.updatedAt)}
                      </p>
                    )}
                    {isCompleted && !isCurrent && (
                      <p className="text-xs text-gray-500 mt-1">Completed</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-6"
        >
          <h2 className="text-xl font-heading font-bold text-secondary mb-4">Order Details</h2>
          
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-secondary">{item.menuItem.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold text-primary">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-secondary">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Restaurant Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-xl font-heading font-bold text-secondary mb-4">Restaurant Info</h2>
          <div className="space-y-2">
            <p className="font-medium">{order.restaurant.name}</p>
            <p className="text-sm text-gray-600">Table {order.table.tableNumber}</p>
            <p className="text-sm text-gray-600">
              Order placed at {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Auto-refresh toggle */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setAutoRefresh(!autoRefresh);
              if (!autoRefresh) fetchOrder();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refreshing' : 'Manual refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;


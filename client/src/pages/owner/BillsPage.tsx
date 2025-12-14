import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  Download, 
  Mail, 
  Search, 
  Calendar,
  DollarSign,
  Eye,
  X,
  CheckCircle2,
  Clock,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

interface Bill {
  id: string;
  restaurantId: string;
  orderId: string;
  billNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  order?: {
    orderNumber: string;
    table?: {
      tableNumber: number;
    };
  };
}

const BillsPage = () => {
  const { user } = useAuthStore();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.restaurantId) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      const response = await api.get(`/billing/bills?restaurantId=${user?.restaurantId}`);
      setBills(response.data);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (billId: string, billNumber: string) => {
    try {
      const loadingToast = toast.loading('Generating PDF...');
      const response = await api.get(`/billing/bills/${billId}/pdf`, {
        responseType: 'blob',
      });
      toast.dismiss(loadingToast);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${billNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download PDF');
    }
  };

  const viewBillDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setShowDetails(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.order?.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(bill.createdAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(bill.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'month' && new Date(bill.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesDate;
  });

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
  const paidBills = bills.filter(bill => bill.paidAt).length;
  const pendingBills = bills.filter(bill => !bill.paidAt).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
          Bills & Invoices
        </h1>
        <p className="text-gray-600">View and manage customer invoices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paid Bills</p>
              <p className="text-2xl font-bold text-secondary">{paidBills}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Bills</p>
              <p className="text-2xl font-bold text-secondary">{pendingBills}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by bill number or order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <div className="card text-center py-12">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery || dateFilter !== 'all'
              ? 'No bills match your filters'
              : 'No bills yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBills.map((bill, index) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-bold text-secondary">{bill.billNumber}</h3>
                    {bill.paidAt ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-gray-600">
                      <p className="text-xs mb-1">Order</p>
                      <p className="font-semibold">{bill.order?.orderNumber || 'N/A'}</p>
                    </div>
                    <div className="text-gray-600">
                      <p className="text-xs mb-1">Table</p>
                      <p className="font-semibold">Table {bill.order?.table?.tableNumber || 'N/A'}</p>
                    </div>
                    <div className="text-gray-600">
                      <p className="text-xs mb-1">Date</p>
                      <p className="font-semibold">{formatDate(bill.createdAt)}</p>
                    </div>
                    <div className="text-gray-600">
                      <p className="text-xs mb-1">Payment Method</p>
                      <p className="font-semibold flex items-center gap-1">
                        {bill.paymentMethod ? (
                          <>
                            <CreditCard className="w-3 h-3" />
                            {bill.paymentMethod}
                          </>
                        ) : (
                          'N/A'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span>Subtotal: ${bill.subtotal.toFixed(2)}</span>
                        {bill.tax > 0 && <span className="ml-4">Tax: ${bill.tax.toFixed(2)}</span>}
                        {bill.discount > 0 && <span className="ml-4 text-red-600">Discount: -${bill.discount.toFixed(2)}</span>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-primary">${bill.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => viewBillDetails(bill)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => downloadPDF(bill.id, bill.billNumber)}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bill Details Modal */}
      <AnimatePresence>
        {showDetails && selectedBill && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-secondary">
                  Bill Details - {selectedBill.billNumber}
                </h2>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedBill(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Bill Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bill Number</p>
                    <p className="font-semibold">{selectedBill.billNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="font-semibold">{selectedBill.order?.orderNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Table</p>
                    <p className="font-semibold">Table {selectedBill.order?.table?.tableNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold">{formatDate(selectedBill.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    {selectedBill.paidAt ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold">{selectedBill.paymentMethod || 'N/A'}</p>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-bold text-secondary mb-4">Bill Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${selectedBill.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedBill.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">${selectedBill.tax.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedBill.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Discount</span>
                        <span className="font-semibold">-${selectedBill.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold text-secondary">Total</span>
                      <span className="font-bold text-primary text-xl">${selectedBill.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => downloadPDF(selectedBill.id, selectedBill.billNumber)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedBill(null);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillsPage;

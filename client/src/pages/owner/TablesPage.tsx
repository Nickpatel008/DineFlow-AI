import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  QrCode, 
  Table as TableIcon, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Minus
} from 'lucide-react';

// Chair SVG Icon Component - Simple top-down view
const ChairIcon = ({ className = "w-6 h-6", color = "#ea580c" }: { className?: string; color?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    {/* Chair backrest - rectangular */}
    <rect x="7" y="3" width="10" height="12" rx="1" fill={color} />
    {/* Chair legs - two short stubs */}
    <rect x="8" y="15" width="3" height="2" rx="0.5" fill={color} />
    <rect x="13" y="15" width="3" height="2" rx="0.5" fill={color} />
  </svg>
);
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import { toast } from '../../utils/toast';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  qrCode?: string;
  restaurantId: string;
}

const statusConfig = {
  AVAILABLE: { label: 'Available', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  OCCUPIED: { label: 'Occupied', color: 'bg-red-100 text-red-800', icon: XCircle },
  RESERVED: { label: 'Reserved', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
};

const TablesPage = () => {
  const { user } = useAuthStore();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    status: 'AVAILABLE' as 'AVAILABLE' | 'OCCUPIED' | 'RESERVED',
  });
  const [chairs, setChairs] = useState<number[]>([]);

  useEffect(() => {
    if (user?.restaurantId) {
      fetchTables();
    }
  }, [user]);

  const fetchTables = async () => {
    try {
      const response = await api.get(`/tables?restaurantId=${user?.restaurantId}`);
      setTables(response.data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (table?: Table) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber.toString(),
        capacity: table.capacity.toString(),
        status: table.status,
      });
      setChairs(Array.from({ length: table.capacity }, (_, i) => i));
    } else {
      setEditingTable(null);
      setFormData({
        tableNumber: '',
        capacity: '',
        status: 'AVAILABLE',
      });
      setChairs([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      capacity: '',
      status: 'AVAILABLE',
    });
    setChairs([]);
  };

  const addChair = () => {
    if (chairs.length < 20) {
      setChairs([...chairs, chairs.length]);
      setFormData({ ...formData, capacity: (chairs.length + 1).toString() });
    }
  };

  const removeChair = () => {
    if (chairs.length > 0) {
      const newChairs = chairs.slice(0, -1);
      setChairs(newChairs);
      setFormData({ ...formData, capacity: newChairs.length.toString() });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.restaurantId) return;

    try {
      const loadingToast = toast.loading(editingTable ? 'Updating table...' : 'Creating table...');
      
      const tableData = {
        restaurantId: user.restaurantId,
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        status: formData.status,
      };

      if (editingTable) {
        await api.put(`/tables/${editingTable.id}`, tableData);
        toast.dismiss(loadingToast);
        toast.success('Table updated successfully!');
      } else {
        await api.post('/tables', tableData);
        toast.dismiss(loadingToast);
        toast.success('Table created successfully!');
      }

      handleCloseModal();
      fetchTables();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save table');
    }
  };

  const handleDelete = async (tableId: string, tableNumber: number) => {
    if (!confirm(`Are you sure you want to delete Table ${tableNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const loadingToast = toast.loading('Deleting table...');
      await api.delete(`/tables/${tableId}`);
      toast.dismiss(loadingToast);
      toast.success('Table deleted successfully!');
      fetchTables();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete table');
    }
  };

  const generateQR = async (table: Table) => {
    try {
      const loadingToast = toast.loading('Generating QR code...');
      const response = await api.post(`/tables/${table.id}/qr`);
      toast.dismiss(loadingToast);
      toast.success('QR code generated successfully!');
      setSelectedTable(response.data);
      setShowQRModal(true);
      fetchTables();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate QR code');
    }
  };

  const updateTableStatus = async (table: Table, newStatus: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED') => {
    try {
      await api.put(`/tables/${table.id}`, { status: newStatus });
      toast.success(`Table status updated to ${statusConfig[newStatus].label.toLowerCase()}!`);
      fetchTables();
    } catch (error: any) {
      toast.error('Failed to update table status');
    }
  };

  const downloadQR = (qrCode: string, tableNumber: number) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading tables...</p>
        </div>
      </div>
    );
  }

  const sortedTables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Tables
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage restaurant tables and QR codes</p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shadow-lg shadow-primary/30"
        >
          <Plus className="w-4 h-4" />
          Add Table
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = tables.filter(t => t.status === status).length;
          const Icon = config.icon;
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{config.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                </div>
                <div className={`${config.color} dark:opacity-80 p-2 sm:p-3 rounded-lg`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tables Grid */}
      {sortedTables.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm text-center py-8">
          <TableIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No tables yet</p>
          <motion.button
            onClick={() => handleOpenModal()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm"
          >
            Add First Table
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedTables.map((table, index) => {
            const StatusIcon = statusConfig[table.status].icon;
            return (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TableIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">Table {table.tableNumber}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Capacity: {table.capacity} guests</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[table.status].color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[table.status].label}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Status Quick Actions */}
                  <div className="flex gap-2">
                    {Object.entries(statusConfig).map(([status, config]) => {
                      if (table.status === status) return null;
                      return (
                        <button
                          key={status}
                          onClick={() => updateTableStatus(table, status as any)}
                          className={`flex-1 px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                            status === 'AVAILABLE'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : status === 'OCCUPIED'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          }`}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    {table.qrCode ? (
                      <button
                        onClick={() => {
                          setSelectedTable(table);
                          setShowQRModal(true);
                        }}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <QrCode className="w-4 h-4" />
                        View QR
                      </button>
                    ) : (
                      <button
                        onClick={() => generateQR(table)}
                        className="flex-1 px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <QrCode className="w-4 h-4" />
                        Generate QR
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(table)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Edit Table"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(table.id, table.tableNumber)}
                      className="px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Table"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-5 py-3 flex items-center justify-between backdrop-blur-sm z-10 flex-shrink-0">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  {editingTable ? 'Edit Table' : 'Add Table'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Left Side - Table Visualization */}
                <div className="lg:w-1/2 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-y-auto">
                  <div className="w-full max-w-sm">
                    {/* Visual Table with Chairs */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 mb-3 border-2 border-dashed border-gray-300 dark:border-gray-600">
                      {/* Table Visualization */}
                      <div className="relative mb-3" style={{ minHeight: '240px', maxHeight: '300px', width: '100%' }}>
                        {/* Centered container for table and chairs */}
                        <div 
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* Table - positioned in absolute center */}
                          <motion.div
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center z-10 relative"
                            style={{ 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          >
                            <TableIcon className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                          </motion.div>
                          
                          {/* Chairs around table - perfectly centered circle */}
                          <AnimatePresence>
                            {chairs.map((chair, index) => {
                              const angle = (index * 360) / Math.max(chairs.length, 1);
                              // Fixed radius - all chairs at same distance from table center
                              const radius = 85;
                              const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                              const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                              
                              return (
                                <motion.div
                                  key={chair}
                                  initial={{ 
                                    opacity: 0, 
                                    scale: 0,
                                    x: 0,
                                    y: 0,
                                    rotate: -180
                                  }}
                                  animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    x: x,
                                    y: y,
                                    rotate: 0
                                  }}
                                  exit={{ 
                                    opacity: 0, 
                                    scale: 0,
                                    x: 0,
                                    y: 0,
                                    rotate: 180,
                                    transition: {
                                      duration: 0.25,
                                      ease: "easeInOut"
                                    }
                                  }}
                                  transition={{ 
                                    type: "spring",
                                    damping: 18,
                                    stiffness: 250,
                                    mass: 0.7,
                                    delay: index * 0.06
                                  }}
                                  whileHover={{ 
                                    scale: 1.15,
                                    transition: { duration: 0.2 }
                                  }}
                                  className="absolute"
                                  style={{ 
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                >
                                  <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
                                  >
                                    <ChairIcon 
                                      className="w-full h-full" 
                                      color="#ea580c"
                                    />
                                  </motion.div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      {/* Capacity Display */}
                      <div className="text-center">
                        <motion.div
                          key={chairs.length}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-200 dark:border-orange-800"
                        >
                          <ChairIcon className="w-3.5 h-3.5" color="#ea580c" />
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{chairs.length}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">guests</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Chair Controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        onClick={removeChair}
                        disabled={chairs.length === 0}
                        whileHover={{ scale: chairs.length > 0 ? 1.05 : 1 }}
                        whileTap={{ scale: chairs.length > 0 ? 0.95 : 1 }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        Remove Chair
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={addChair}
                        disabled={chairs.length >= 20}
                        whileHover={{ scale: chairs.length < 20 ? 1.05 : 1 }}
                        whileTap={{ scale: chairs.length < 20 ? 0.95 : 1 }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-100 dark:hover:bg-green-900/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Chair
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-1/2 p-4 sm:p-5 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="tableNumber" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Table Number *
                      </Label>
                      <Input
                        id="tableNumber"
                        type="number"
                        min="1"
                        value={formData.tableNumber}
                        onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                        required
                        placeholder="e.g., 1"
                        className="mt-1.5 h-9 text-sm"
                      />
                    </div>

                    {/* Capacity Input */}
                    <div>
                      <Label htmlFor="capacity" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Capacity (guests) *
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.capacity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val >= 0 && val <= 20) {
                            setFormData({ ...formData, capacity: e.target.value });
                            setChairs(Array.from({ length: val }, (_, i) => i));
                          }
                        }}
                        required
                        className="mt-1.5 h-9 text-sm"
                        placeholder="Enter number of guests (1-20)"
                      />
                      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                        Use the controls on the left to visually adjust capacity
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Status *
                      </Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mt-1.5"
                      >
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <option key={status} value={status}>{config.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <motion.button
                        type="button"
                        onClick={handleCloseModal}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-primary/20"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingTable ? 'Update Table' : 'Create Table'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && selectedTable && selectedTable.qrCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => {
              setShowQRModal(false);
              setSelectedTable(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  QR Code - Table {selectedTable.tableNumber}
                </h2>
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setSelectedTable(null);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="text-center space-y-3 sm:space-y-4">
                <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 inline-block">
                  <img
                    src={selectedTable.qrCode}
                    alt={`QR Code for Table ${selectedTable.tableNumber}`}
                    className="w-48 h-48 sm:w-64 sm:h-64"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Customers can scan this QR code to view the menu and place orders
                </p>
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => downloadQR(selectedTable.qrCode!, selectedTable.tableNumber)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setShowQRModal(false);
                      setSelectedTable(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TablesPage;

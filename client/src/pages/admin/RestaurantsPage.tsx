import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Store, Edit, Trash2, Grid3x3, List, MapPin, Phone, Mail, Calendar, X, FileText,
  CheckCircle2, XCircle, Clock, AlertCircle, Ban, Activity, Search, ChevronDown, Eye,
  Image as ImageIcon, Upload, Star, Users, UtensilsCrossed, Trash2 as TrashIcon,
  ChevronLeft, ChevronRight, Globe, Facebook, Instagram, Twitter, DollarSign
} from 'lucide-react';
import api from '../../utils/api';
import { generateDummyRestaurants } from '../../utils/dummyData';
import { toast } from '../../utils/toast';

type RestaurantStatus = 'active' | 'blocked' | 'pending' | 'inactive' | 'suspended';

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  status?: RestaurantStatus;
  createdAt: string;
  owner?: {
    email: string;
  };
}

type ViewMode = 'grid' | 'list';

interface RestaurantFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
}

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [viewingRestaurant, setViewingRestaurant] = useState<Restaurant | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [deletingRestaurant, setDeletingRestaurant] = useState<Restaurant | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<RestaurantFormData>>({});
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const handleImageUpload = async (restaurantId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    try {
      // Simulate image upload - in real app, upload to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${files.length} image(s) uploaded successfully!`);
      // In real app, update restaurant images via API
    } catch (error: any) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };
  
  const handleImageDelete = (restaurantId: string, imageIndex: number) => {
    // In real app, delete image via API
    toast.success('Image removed successfully!');
  };
  
  const handleImageError = (restaurantId: string) => {
    setImageErrors(prev => new Set(prev).add(restaurantId));
  };

  const handleViewDetails = (restaurant: Restaurant) => {
    setViewingRestaurant(restaurant);
    setCurrentImageIndex(0);
    setShowDetails(true);
  };
  
  const nextImage = () => {
    if (viewingRestaurant && (viewingRestaurant as any).images) {
      setCurrentImageIndex((prev) => 
        prev === (viewingRestaurant as any).images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (viewingRestaurant && (viewingRestaurant as any).images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? (viewingRestaurant as any).images.length - 1 : prev - 1
      );
    }
  };

  // Status badge configuration
  const getStatusConfig = (status?: RestaurantStatus) => {
    const statusConfigs = {
      active: {
        label: 'Active',
        icon: CheckCircle2,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
        iconColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-700',
      },
      blocked: {
        label: 'Blocked',
        icon: Ban,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-400',
        iconColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-700',
      },
      pending: {
        label: 'Pending',
        icon: Clock,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
      },
      inactive: {
        label: 'Inactive',
        icon: XCircle,
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        textColor: 'text-gray-700 dark:text-gray-400',
        iconColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-200 dark:border-gray-600',
      },
      suspended: {
        label: 'Suspended',
        icon: AlertCircle,
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        textColor: 'text-orange-700 dark:text-orange-400',
        iconColor: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-200 dark:border-orange-700',
      },
    };

    return statusConfigs[status || 'active'];
  };

  // Mock status assignment (in real app, this would come from API)
  const getRestaurantStatus = (restaurant: Restaurant): RestaurantStatus => {
    // For demo purposes, assign status based on index or use existing status
    if (restaurant.status) return restaurant.status;
    const statuses: RestaurantStatus[] = ['active', 'active', 'pending', 'blocked', 'inactive'];
    return statuses[restaurants.indexOf(restaurant) % statuses.length] || 'active';
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, statusFilter]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const url = `/restaurants${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      let data = response.data || [];
      
      // Add dummy data if we don't have enough records (target: 25 restaurants)
      if (data.length < 25) {
        const dummyData = generateDummyRestaurants(25);
        // Merge API data with dummy data, avoiding duplicates
        const existingIds = new Set(data.map((r: Restaurant) => r.id));
        const newDummyData = dummyData.filter(r => !existingIds.has(r.id));
        data = [...data, ...newDummyData];
      }
      
      // Apply filters after adding dummy data
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        data = data.filter((r: Restaurant) => 
          r.name.toLowerCase().includes(query) ||
          r.address?.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter !== 'all') {
        data = data.filter((r: Restaurant) => getRestaurantStatus(r) === statusFilter);
      }
      
      setRestaurants(data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      // On error, use dummy data
      const dummyData = generateDummyRestaurants(25);
      setRestaurants(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RestaurantFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RestaurantFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      await api.post('/restaurants', payload);
      await fetchRestaurants();
      toast.success('Restaurant created successfully!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
      });
      setErrors({});
    } catch (error: any) {
      console.error('Failed to create restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingRestaurant(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
      });
      setErrors({});
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      description: (restaurant as any).description || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingRestaurant) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      await api.put(`/restaurants/${editingRestaurant.id}`, payload);
      await fetchRestaurants();
      toast.success('Restaurant updated successfully!');
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to update restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to update restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setDeletingRestaurant(restaurant);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRestaurant) return;

    setSubmitting(true);
    try {
      await api.delete(`/restaurants/${deletingRestaurant.id}`);
      await fetchRestaurants();
      toast.success('Restaurant deleted successfully!');
      setShowDeleteConfirm(false);
      setDeletingRestaurant(null);
    } catch (error: any) {
      console.error('Failed to delete restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to delete restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (restaurantId: string, newStatus: RestaurantStatus) => {
    try {
      await api.patch(`/restaurants/${restaurantId}/status`, { status: newStatus });
      await fetchRestaurants();
      toast.success(`Restaurant status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Bulk Operations
  const handleSelectAll = () => {
    if (selectedRestaurants.size === restaurants.length) {
      setSelectedRestaurants(new Set());
    } else {
      setSelectedRestaurants(new Set(restaurants.map(r => r.id)));
    }
  };

  const handleSelectRestaurant = (id: string) => {
    const newSelected = new Set(selectedRestaurants);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRestaurants(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedRestaurants.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedRestaurants.size} restaurant(s)?`)) {
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API calls with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRestaurants(prev => prev.filter(r => !selectedRestaurants.has(r.id)));
      toast.success(`${selectedRestaurants.size} restaurant(s) deleted successfully`);
      setSelectedRestaurants(new Set());
      setShowBulkActions(false);
    } catch (error: any) {
      toast.error('Failed to delete restaurants');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkStatusChange = async (newStatus: RestaurantStatus) => {
    if (selectedRestaurants.size === 0) return;

    setSubmitting(true);
    try {
      // Simulate API calls with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRestaurants(prev => prev.map(r => 
        selectedRestaurants.has(r.id) ? { ...r, status: newStatus } : r
      ));
      toast.success(`${selectedRestaurants.size} restaurant(s) status updated to ${newStatus}`);
      setSelectedRestaurants(new Set());
      setShowBulkActions(false);
    } catch (error: any) {
      toast.error('Failed to update restaurant statuses');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkExport = () => {
    if (selectedRestaurants.size === 0) return;

    const selectedData = restaurants.filter(r => selectedRestaurants.has(r.id));
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Address', 'Status', 'Created At'],
      ...selectedData.map(r => [
        r.name,
        r.email || '',
        r.phone || '',
        r.address || '',
        r.status || 'active',
        new Date(r.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurants_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${selectedRestaurants.size} restaurant(s) to CSV`);
  };

  useEffect(() => {
    setShowBulkActions(selectedRestaurants.size > 0);
  }, [selectedRestaurants]);

  if (loading && restaurants.length === 0) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Restaurants</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage all restaurants</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title="Grid View"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          {/* Add Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Restaurant
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {selectedRestaurants.size} restaurant(s) selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusChange(e.target.value as RestaurantStatus);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                disabled={submitting}
              >
                <option value="">Change Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={handleBulkExport}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={submitting}
                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button
                onClick={() => {
                  setSelectedRestaurants(new Set());
                  setShowBulkActions(false);
                }}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants by name, email, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-shadow ${
                selectedRestaurants.has(restaurant.id)
                  ? 'border-primary shadow-md ring-2 ring-primary/20'
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRestaurants.has(restaurant.id)}
                    onChange={() => handleSelectRestaurant(restaurant.id)}
                    className="rounded w-4 h-4"
                  />
                </div>
                <div className="flex items-center gap-3 flex-1">
                  {restaurant.logo && !imageErrors.has(restaurant.id) ? (
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={() => handleImageError(restaurant.id)}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{restaurant.name}</h3>
                    {restaurant.owner && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{restaurant.owner.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                {(() => {
                  const status = getRestaurantStatus(restaurant);
                  const config = getStatusConfig(status);
                  const Icon = config.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                      {config.label}
                    </span>
                  );
                })()}
              </div>

              <div className="space-y-2 mb-4">
                {restaurant.address && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{restaurant.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => handleViewDetails(restaurant)}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleEdit(restaurant)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(restaurant)}
                  className="px-3 py-1.5 text-xs font-medium border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    <input
                      type="checkbox"
                      checked={selectedRestaurants.size === restaurants.length && restaurants.length > 0}
                      onChange={handleSelectAll}
                      className="rounded w-4 h-4"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Restaurant</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Address</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Created</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant, index) => (
                  <motion.tr
                    key={restaurant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRestaurants.has(restaurant.id)}
                        onChange={() => handleSelectRestaurant(restaurant.id)}
                        className="rounded w-4 h-4"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {restaurant.logo && !imageErrors.has(restaurant.id) ? (
                          <img
                            src={restaurant.logo}
                            alt={restaurant.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={() => handleImageError(restaurant.id)}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center flex-shrink-0">
                            <Store className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{restaurant.name}</p>
                          {restaurant.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{restaurant.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {(() => {
                        const status = getRestaurantStatus(restaurant);
                        const config = getStatusConfig(status);
                        const Icon = config.icon;
                        return (
                          <div className="relative group">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                              <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                              {config.label}
                            </span>
                            <select
                              value={status}
                              onChange={(e) => handleStatusChange(restaurant.id, e.target.value as RestaurantStatus)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="blocked">Blocked</option>
                              <option value="suspended">Suspended</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{restaurant.owner?.email || '—'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                          {restaurant.address || '—'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {restaurant.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">{restaurant.phone}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(restaurant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDetails(restaurant)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(restaurant)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(restaurant)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {restaurants.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center py-12">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all' ? 'No restaurants match your filters' : 'No restaurants yet'}
          </p>
          {(!searchQuery && statusFilter === 'all') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create First Restaurant
            </button>
          )}
        </div>
      )}

      {/* Create Restaurant Side Drawer */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleCloseModal}
            />
            
            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Restaurant</h2>
                  <p className="text-xs text-gray-600 mt-1">Fill in the basic details to create a new restaurant</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Form - Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <form id="restaurant-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Restaurant Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Restaurant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                      }`}
                      placeholder="Enter restaurant name"
                      disabled={submitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter restaurant address"
                      disabled={submitting}
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="+1 (555) 123-4567"
                        disabled={submitting}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="restaurant@example.com"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <FileText className="w-3.5 h-3.5 inline mr-1" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="Enter restaurant description (optional)"
                      disabled={submitting}
                    />
                  </div>
                </form>
              </div>

              {/* Footer - Sticky Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="restaurant-form"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Restaurant
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Edit Restaurant Modal */}
        {showEditModal && editingRestaurant && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleCloseModal}
            />
            
            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Restaurant</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Update restaurant details</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Form - Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <form id="edit-restaurant-form" onSubmit={handleUpdate} className="p-6 space-y-4">
                  {/* Restaurant Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Restaurant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                      }`}
                      placeholder="Enter restaurant name"
                      disabled={submitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter restaurant address"
                      disabled={submitting}
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="+1 (555) 123-4567"
                        disabled={submitting}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="restaurant@example.com"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Restaurant Images Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                      Restaurant Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Multiple images supported (PNG, JPG, GIF)
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(editingRestaurant.id, e.target.files)}
                          disabled={uploadingImages || submitting}
                        />
                      </label>
                      {uploadingImages && (
                        <div className="mt-2 text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full inline-block"
                          />
                          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Uploading...</span>
                        </div>
                      )}
                      {(editingRestaurant as any).images && (editingRestaurant as any).images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {(editingRestaurant as any).images.slice(0, 6).map((image: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image}
                                alt={`Restaurant ${idx + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                                onError={() => handleImageError(editingRestaurant.id)}
                              />
                              <button
                                type="button"
                                onClick={() => handleImageDelete(editingRestaurant.id, idx)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={submitting}
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {(editingRestaurant as any).images.length > 6 && (
                            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                              +{(editingRestaurant as any).images.length - 6} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      <FileText className="w-3.5 h-3.5 inline mr-1" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="Enter restaurant description (optional)"
                      disabled={submitting}
                    />
                  </div>
                </form>
              </div>

              {/* Footer - Sticky Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-restaurant-form"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Update Restaurant
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Restaurant Details Modal */}
        <AnimatePresence>
          {showDetails && viewingRestaurant && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[55]"
                onClick={() => setShowDetails(false)}
              />
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Restaurant Details</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">View complete restaurant information</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Restaurant Logo & Name */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {viewingRestaurant.logo && !imageErrors.has(viewingRestaurant.id) ? (
                        <img
                          src={viewingRestaurant.logo}
                          alt={viewingRestaurant.name}
                          className="w-20 h-20 rounded-lg object-cover"
                          onError={() => handleImageError(viewingRestaurant.id)}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center flex-shrink-0">
                          <Store className="w-10 h-10 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{viewingRestaurant.name}</h3>
                        {(() => {
                          const status = getRestaurantStatus(viewingRestaurant);
                          const config = getStatusConfig(status);
                          const StatusIcon = config.icon;
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mt-2 ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                              <StatusIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Images Carousel */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Restaurant Images</h3>
                        {(viewingRestaurant as any).images && (viewingRestaurant as any).images.length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({currentImageIndex + 1} / {(viewingRestaurant as any).images.length})
                          </span>
                        )}
                      </div>
                      <label className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(viewingRestaurant.id, e.target.files)}
                          disabled={uploadingImages}
                        />
                      </label>
                    </div>
                    {(viewingRestaurant as any).images && (viewingRestaurant as any).images.length > 0 ? (
                      <div className="relative">
                        <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={currentImageIndex}
                              src={(viewingRestaurant as any).images[currentImageIndex]}
                              alt={`${viewingRestaurant.name} ${currentImageIndex + 1}`}
                              initial={{ opacity: 0, x: 100 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 0.3 }}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(viewingRestaurant.id)}
                            />
                          </AnimatePresence>
                          
                          {/* Navigation Buttons */}
                          {(viewingRestaurant as any).images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all backdrop-blur-sm"
                                aria-label="Previous image"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all backdrop-blur-sm"
                                aria-label="Next image"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleImageDelete(viewingRestaurant.id, currentImageIndex)}
                            className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all backdrop-blur-sm"
                            title="Remove image"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Thumbnail Navigation */}
                        {(viewingRestaurant as any).images.length > 1 && (
                          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                            {(viewingRestaurant as any).images.map((image: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  idx === currentImageIndex
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-gray-200 dark:border-gray-600 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(viewingRestaurant.id)}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No images uploaded yet</p>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingRestaurant.address && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Address</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{viewingRestaurant.address}</p>
                          </div>
                        </div>
                      )}
                      {viewingRestaurant.phone && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{viewingRestaurant.phone}</p>
                          </div>
                        </div>
                      )}
                      {viewingRestaurant.email && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{viewingRestaurant.email}</p>
                          </div>
                        </div>
                      )}
                      {viewingRestaurant.owner && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Owner</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{viewingRestaurant.owner.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {(viewingRestaurant as any).description && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Description</h3>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{(viewingRestaurant as any).description}</p>
                    </div>
                  )}

                  {/* Restaurant Details */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <UtensilsCrossed className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Restaurant Details</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(viewingRestaurant as any).cuisineType && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cuisine Type</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{(viewingRestaurant as any).cuisineType}</p>
                        </div>
                      )}
                      {(viewingRestaurant as any).capacity && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Capacity</p>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{(viewingRestaurant as any).capacity} seats</p>
                          </div>
                        </div>
                      )}
                      {(viewingRestaurant as any).rating && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {(viewingRestaurant as any).rating} 
                              {(viewingRestaurant as any).totalReviews && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                  ({(viewingRestaurant as any).totalReviews} reviews)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operating Hours */}
                  {(viewingRestaurant as any).operatingHours && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Operating Hours</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries((viewingRestaurant as any).operatingHours).map(([day, hours]: [string, any]) => (
                          <div key={day} className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{day}:</span>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {hours.open} - {hours.close}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {(viewingRestaurant as any).amenities && (viewingRestaurant as any).amenities.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Amenities</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(viewingRestaurant as any).amenities.map((amenity: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Website & Social Media */}
                  {((viewingRestaurant as any).website || (viewingRestaurant as any).socialMedia) && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Website & Social Media</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(viewingRestaurant as any).website && (
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Website</p>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                              <a
                                href={(viewingRestaurant as any).website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                {(viewingRestaurant as any).website}
                              </a>
                            </div>
                          </div>
                        )}
                        {(viewingRestaurant as any).socialMedia && (
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Social Media</p>
                            {(viewingRestaurant as any).socialMedia.facebook && (
                              <div className="flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <a
                                  href={`https://${(viewingRestaurant as any).socialMedia.facebook}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-gray-700 dark:text-gray-300 hover:text-primary"
                                >
                                  {(viewingRestaurant as any).socialMedia.facebook}
                                </a>
                              </div>
                            )}
                            {(viewingRestaurant as any).socialMedia.instagram && (
                              <div className="flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600 flex-shrink-0" />
                                <a
                                  href={`https://instagram.com/${(viewingRestaurant as any).socialMedia.instagram.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-gray-700 dark:text-gray-300 hover:text-primary"
                                >
                                  {(viewingRestaurant as any).socialMedia.instagram}
                                </a>
                              </div>
                            )}
                            {(viewingRestaurant as any).socialMedia.twitter && (
                              <div className="flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <a
                                  href={`https://twitter.com/${(viewingRestaurant as any).socialMedia.twitter.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-gray-700 dark:text-gray-300 hover:text-primary"
                                >
                                  {(viewingRestaurant as any).socialMedia.twitter}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  {(viewingRestaurant as any).priceRange && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Price Range</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {(viewingRestaurant as any).priceRange}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(() => {
                            const range = (viewingRestaurant as any).priceRange;
                            if (range === '$') return 'Budget-friendly';
                            if (range === '$$') return 'Moderate';
                            if (range === '$$$') return 'Upscale';
                            if (range === '$$$$') return 'Fine Dining';
                            return '';
                          })()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Additional Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Restaurant ID</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">{viewingRestaurant.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Created At</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {new Date(viewingRestaurant.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {new Date((viewingRestaurant as any).updatedAt || viewingRestaurant.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setViewingRestaurant(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleEdit(viewingRestaurant);
                    }}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Restaurant
                  </button>
                </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && deletingRestaurant && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[55]"
                onClick={() => !submitting && setShowDeleteConfirm(false)}
              />
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Restaurant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete <strong>{deletingRestaurant.name}</strong>? This will permanently remove the restaurant and all associated data.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletingRestaurant(null);
                    }}
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default RestaurantsPage;




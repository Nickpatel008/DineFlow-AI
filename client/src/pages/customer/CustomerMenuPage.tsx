import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Loader2, 
  Search, 
  Filter, 
  X, 
  Eye,
  ChevronDown,
  ChevronUp,
  Ticket,
  Gift,
  Check
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  aiDescription?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get('table');
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [showFilters, setShowFilters] = useState(false);
  
  // Coupon and loyalty
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
      fetchMenu();
    }
  }, [restaurantId]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${restaurantId}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, [restaurantId]);

  // Save cart to localStorage
  useEffect(() => {
    if (cart.length > 0 && restaurantId) {
      localStorage.setItem(`cart-${restaurantId}`, JSON.stringify(cart));
    } else if (cart.length === 0 && restaurantId) {
      localStorage.removeItem(`cart-${restaurantId}`);
    }
  }, [cart, restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/public/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await api.get(`/items/public/${restaurantId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) {
      toast.error('This item is currently unavailable');
      return;
    }
    
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const updated = existing
        ? prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }];
      toast.success(`${item.name} added to cart!`);
      return updated;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item && item.quantity > 1) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate discount from coupon
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      const discount = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    } else if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  };
  
  const discount = calculateDiscount();
  const total = subtotal - discount;

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category))).sort();
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aiDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [items, searchQuery, selectedCategory, sortBy]);

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    filteredAndSortedItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredAndSortedItems]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await api.post('/coupons/validate', { 
        code: couponCode.trim(),
        restaurantId,
        orderAmount: subtotal
      });
      
      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
        toast.success('Coupon applied successfully!');
        setCouponCode('');
      } else {
        toast.error(response.data.message || 'Invalid coupon code');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!restaurantId) {
      toast.error('Restaurant ID is missing');
      return;
    }

    if (!tableNumber) {
      toast.error('Table number is required');
      return;
    }

    // Validate coupon minimum order amount
    if (appliedCoupon && appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      toast.error(`Minimum order amount of $${appliedCoupon.minOrderAmount} required for this coupon`);
      return;
    }

    setCheckingOut(true);

    try {
      const orderItems = cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));

      const response = await api.post('/billing/orders/public', {
        restaurantId,
        tableNumber,
        items: orderItems,
        couponCode: appliedCoupon?.code,
        notes: orderNotes || undefined
      });

      // Navigate to payment page
      navigate('/payment', {
        state: {
          paymentData: {
            orderId: response.data.id,
            amount: total,
            restaurantId: restaurantId!,
            tableNumber: parseInt(tableNumber!),
          }
        }
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setCheckingOut(false);
    }
  };

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-secondary">
              {restaurant?.name || 'Restaurant Menu'}
            </h1>
            {tableNumber && (
              <p className="text-sm text-gray-600">Table {tableNumber}</p>
            )}
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative btn-primary flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart ({cart.length})
            {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No items found matching your search.</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-secondary mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => openItemModal(item)}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    {!item.image && (
                      <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-secondary text-lg flex-1">{item.name}</h3>
                      {!item.isAvailable && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.aiDescription || item.description || 'Delicious item'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        disabled={!item.isAvailable}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {showItemModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-secondary">
                  {selectedItem.name}
                </h2>
                <button
                  onClick={() => {
                    setShowItemModal(false);
                    setSelectedItem(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {selectedItem.image && (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl font-bold text-primary">
                      ${selectedItem.price.toFixed(2)}
                    </span>
                    {!selectedItem.isAvailable && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        Currently Unavailable
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {selectedItem.aiDescription || selectedItem.description || 'No description available.'}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>Category: {selectedItem.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedItem);
                    setShowItemModal(false);
                    setSelectedItem(null);
                  }}
                  disabled={!selectedItem.isAvailable}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
      {showCart && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-secondary">Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                    <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg">
                      <div className="flex-1">
                            <h3 className="font-medium text-secondary">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-2 border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        <button
                          onClick={() => addToCart(item)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                    </div>
                  ))}
                </div>

                    {/* Coupon Section */}
                    <div className="border-t-2 pt-4 space-y-3">
                      {!appliedCoupon ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Have a coupon code?</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Enter code"
                              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            />
                            <button
                              onClick={handleApplyCoupon}
                              disabled={applyingCoupon || !couponCode.trim()}
                              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {applyingCoupon ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ticket className="w-4 h-4" />
                              )}
                              Apply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                                <p className="text-xs text-green-600">
                                  {appliedCoupon.type === 'percentage' 
                                    ? `${appliedCoupon.value}% off`
                                    : `$${appliedCoupon.value} off`}
                                </p>
                              </div>
                  </div>
                            <button
                              onClick={handleRemoveCoupon}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Order Notes */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Order Notes (Optional)</label>
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Special instructions for your order..."
                          rows={2}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                        />
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span className="font-medium">-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-lg font-bold text-secondary">Total:</span>
                          <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={checkingOut || cart.length === 0}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg"
                  >
                    {checkingOut ? (
                      <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            Proceed to Checkout
                          </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
          </>
      )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerMenuPage;

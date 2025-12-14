import fakeData from '../data/fakeBackend.json';

// Enable mock mode - set VITE_USE_FAKE_BACKEND=true/false in .env file
// Defaults to true if not set (for MVP testing)
const envValue = (import.meta as any).env?.VITE_USE_FAKE_BACKEND;
export const USE_MOCK_API = envValue === undefined || envValue === 'true';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find user by email
const findUserByEmail = (email: string) => {
  return fakeData.users.find(user => user.email === email);
};

// Helper to filter by restaurantId
const filterByRestaurantId = <T extends { restaurantId: string }>(
  items: T[],
  restaurantId: string
): T[] => {
  return items.filter(item => item.restaurantId === restaurantId);
};

// Mock API responses
export const mockApi = {
  // Auth endpoints
  async login(email: string, password: string) {
    await delay(500);
    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      const error: any = new Error('Invalid credentials');
      error.response = { status: 401, data: { message: 'Invalid credentials' } };
      throw error;
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}`;

    return {
      data: {
        user: {
          ...userWithoutPassword,
          role: user.role as 'admin' | 'owner',
        },
        token,
      },
    };
  },

  // Restaurant endpoints
  async getRestaurants(search?: string, status?: string) {
    await delay(300);
    let restaurants = fakeData.restaurants.map(rest => ({
      ...rest,
      owner: fakeData.users.find(u => u.restaurantId === rest.id) ? {
        email: fakeData.users.find(u => u.restaurantId === rest.id)!.email,
      } : undefined,
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      restaurants = restaurants.filter(rest =>
        rest.name.toLowerCase().includes(searchLower) ||
        rest.email?.toLowerCase().includes(searchLower) ||
        rest.address?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status) {
      restaurants = restaurants.filter(rest => rest.status === status);
    }

    return { data: restaurants };
  },

  async updateRestaurant(id: string, data: any) {
    await delay(300);
    const index = fakeData.restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      const error: any = new Error('Restaurant not found');
      error.response = { status: 404, data: { message: 'Restaurant not found' } };
      throw error;
    }

    fakeData.restaurants[index] = {
      ...fakeData.restaurants[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const restaurant = fakeData.restaurants[index];
    return {
      data: {
        ...restaurant,
        owner: fakeData.users.find(u => u.restaurantId === restaurant.id) ? {
          email: fakeData.users.find(u => u.restaurantId === restaurant.id)!.email,
        } : undefined,
      },
    };
  },

  async deleteRestaurant(id: string) {
    await delay(300);
    const index = fakeData.restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      const error: any = new Error('Restaurant not found');
      error.response = { status: 404, data: { message: 'Restaurant not found' } };
      throw error;
    }

    fakeData.restaurants.splice(index, 1);
    return { data: { message: 'Restaurant deleted successfully' } };
  },

  async updateRestaurantStatus(id: string, status: string) {
    await delay(300);
    const index = fakeData.restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      const error: any = new Error('Restaurant not found');
      error.response = { status: 404, data: { message: 'Restaurant not found' } };
      throw error;
    }

    fakeData.restaurants[index] = {
      ...fakeData.restaurants[index],
      status: status as any,
      updatedAt: new Date().toISOString(),
    };

    const restaurant = fakeData.restaurants[index];
    return {
      data: {
        ...restaurant,
        owner: fakeData.users.find(u => u.restaurantId === restaurant.id) ? {
          email: fakeData.users.find(u => u.restaurantId === restaurant.id)!.email,
        } : undefined,
      },
    };
  },

  async getRestaurantPublic(id: string) {
    await delay(300);
    const restaurant = fakeData.restaurants.find(r => r.id === id);
    if (!restaurant) {
      const error: any = new Error('Restaurant not found');
      error.response = { status: 404, data: { message: 'Restaurant not found' } };
      throw error;
    }
    return { data: restaurant };
  },

  async getRestaurantStats(id: string) {
    await delay(300);
    const stats = fakeData.restaurantStats[id as keyof typeof fakeData.restaurantStats];
    if (!stats) {
      return { data: { totalRevenue: 0 } };
    }
    return { data: stats };
  },

  // Owner endpoints
  async getOwners(search?: string) {
    await delay(300);
    let owners = fakeData.users
      .filter(user => user.role === 'owner')
      .map(owner => ({
        id: owner.id,
        email: owner.email,
        name: owner.name,
        restaurant: owner.restaurantId
          ? {
            id: owner.restaurantId,
            name: fakeData.restaurants.find(r => r.id === owner.restaurantId)?.name || '',
          }
          : undefined,
        createdAt: owner.createdAt,
      }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      owners = owners.filter(owner =>
        owner.email.toLowerCase().includes(searchLower) ||
        owner.name?.toLowerCase().includes(searchLower) ||
        owner.restaurant?.name.toLowerCase().includes(searchLower)
      );
    }

    return { data: owners };
  },

  async createOwner(data: { email: string; name?: string; password?: string; restaurantId?: string }) {
    await delay(300);
    const existingUser = fakeData.users.find(u => u.email === data.email);
    if (existingUser) {
      const error: any = new Error('Owner with this email already exists');
      error.response = { status: 400, data: { message: 'Owner with this email already exists' } };
      throw error;
    }

    const newOwner = {
      id: `owner-${Date.now()}`,
      email: data.email,
      password: data.password || 'owner123',
      name: data.name || 'Owner',
      role: 'owner' as const,
      restaurantId: data.restaurantId || null,
      createdAt: new Date().toISOString(),
    };

    fakeData.users.push(newOwner);

    return {
      data: {
        id: newOwner.id,
        email: newOwner.email,
        name: newOwner.name,
        restaurant: newOwner.restaurantId
          ? {
            id: newOwner.restaurantId,
            name: fakeData.restaurants.find(r => r.id === newOwner.restaurantId)?.name || '',
          }
          : undefined,
        createdAt: newOwner.createdAt,
      },
    };
  },

  async updateOwner(id: string, data: { email?: string; name?: string; restaurantId?: string }) {
    await delay(300);
    const index = fakeData.users.findIndex(u => u.id === id && u.role === 'owner');
    if (index === -1) {
      const error: any = new Error('Owner not found');
      error.response = { status: 404, data: { message: 'Owner not found' } };
      throw error;
    }

    if (data.email && data.email !== fakeData.users[index].email) {
      const existingUser = fakeData.users.find(u => u.email === data.email && u.id !== id);
      if (existingUser) {
        const error: any = new Error('Owner with this email already exists');
        error.response = { status: 400, data: { message: 'Owner with this email already exists' } };
        throw error;
      }
    }

    fakeData.users[index] = {
      ...fakeData.users[index],
      ...(data.email && { email: data.email }),
      ...(data.name && { name: data.name }),
      ...(data.restaurantId !== undefined && { restaurantId: data.restaurantId }),
    };

    const owner = fakeData.users[index];
    return {
      data: {
        id: owner.id,
        email: owner.email,
        name: owner.name,
        restaurant: owner.restaurantId
          ? {
            id: owner.restaurantId,
            name: fakeData.restaurants.find(r => r.id === owner.restaurantId)?.name || '',
          }
          : undefined,
        createdAt: owner.createdAt,
      },
    };
  },

  async deleteOwner(id: string) {
    await delay(300);
    const index = fakeData.users.findIndex(u => u.id === id && u.role === 'owner');
    if (index === -1) {
      const error: any = new Error('Owner not found');
      error.response = { status: 404, data: { message: 'Owner not found' } };
      throw error;
    }

    fakeData.users.splice(index, 1);
    return { data: { message: 'Owner deleted successfully' } };
  },

  // Menu Item endpoints
  async getItems(restaurantId?: string) {
    await delay(300);
    if (restaurantId) {
      return {
        data: filterByRestaurantId(fakeData.menuItems, restaurantId),
      };
    }
    return { data: fakeData.menuItems };
  },

  async getItemsPublic(restaurantId: string) {
    await delay(300);
    return {
      data: filterByRestaurantId(fakeData.menuItems, restaurantId),
    };
  },

  async generateAIDescription(itemId: string) {
    await delay(1000);
    const item = fakeData.menuItems.find(i => i.id === itemId);
    if (!item) {
      const error: any = new Error('Item not found');
      error.response = { status: 404, data: { message: 'Item not found' } };
      throw error;
    }

    // Simulate AI description generation
    const aiDescriptions: Record<string, string> = {
      'item-1': 'A timeless Italian classic featuring a perfectly crisp crust, creamy fresh mozzarella, and aromatic basil leaves drizzled with extra virgin olive oil. This traditional Neapolitan-style pizza embodies the essence of Italian cuisine.',
      'item-2': 'Indulge in this rich and creamy Roman classic, featuring al dente spaghetti tossed with crispy pancetta, eggs, and freshly grated Parmigiano-Reggiano. A decadent comfort food that\'s both elegant and satisfying.',
      'item-3': 'Crisp romaine lettuce tossed in our house-made Caesar dressing, topped with shaved parmesan and homemade croutons. A refreshing classic that pairs perfectly with any meal.',
      'item-4': 'A heavenly Italian dessert featuring layers of coffee-soaked ladyfingers, rich mascarpone cream, and a dusting of cocoa powder. This elegant treat melts in your mouth with every spoonful.',
      'item-5': 'Tender breaded chicken breast smothered in marinara sauce and melted mozzarella, served over pasta. A hearty Italian-American favorite that never disappoints.',
      'item-6': 'Premium Atlantic salmon, expertly sliced and served fresh. Each piece offers a buttery texture and delicate flavor that showcases the quality of our seafood selection.',
      'item-7': 'A California favorite featuring fresh crab, creamy avocado, and crisp cucumber, rolled in sushi rice and nori. Perfect for sushi beginners and connoisseurs alike.',
      'item-8': 'An exquisite roll featuring tender eel, crisp cucumber, and creamy avocado, elegantly topped with our signature eel sauce. A favorite among sushi enthusiasts.',
      'item-9': 'A warm, comforting traditional Japanese soup made with fermented soybean paste, seaweed, and tofu. The perfect start to any Japanese meal.',
      'item-10': 'Creamy, smooth ice cream infused with premium matcha green tea powder. A refreshing and authentic Japanese dessert that balances sweetness with earthy tea flavors.',
    };

    item.aiDescription = aiDescriptions[itemId] || 'AI-generated description for this delicious item.';

    return { data: item };
  },

  async createItem(data: { restaurantId: string; name: string; description?: string; price: number; category: string; image?: string; isAvailable?: boolean }) {
    await delay(500);
    const newItem: any = {
      id: `item-${Date.now()}`,
      restaurantId: data.restaurantId,
      name: data.name,
      description: data.description || '',
      price: data.price,
      category: data.category,
      image: data.image || '',
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      aiDescription: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fakeData.menuItems.push(newItem);
    return { data: newItem };
  },

  async updateItem(itemId: string, data: Partial<{ name: string; description?: string; price: number; category: string; image?: string; isAvailable: boolean }>) {
    await delay(500);
    const index = fakeData.menuItems.findIndex(i => i.id === itemId);
    if (index === -1) {
      const error: any = new Error('Item not found');
      error.response = { status: 404, data: { message: 'Item not found' } };
      throw error;
    }

    fakeData.menuItems[index] = {
      ...fakeData.menuItems[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return { data: fakeData.menuItems[index] };
  },

  async deleteItem(itemId: string) {
    await delay(500);
    const index = fakeData.menuItems.findIndex(i => i.id === itemId);
    if (index === -1) {
      const error: any = new Error('Item not found');
      error.response = { status: 404, data: { message: 'Item not found' } };
      throw error;
    }

    fakeData.menuItems.splice(index, 1);
    return { data: { message: 'Item deleted successfully' } };
  },

  // Table endpoints
  async getTables(restaurantId?: string) {
    await delay(300);
    if (restaurantId) {
      return {
        data: filterByRestaurantId(fakeData.tables, restaurantId),
      };
    }
    return { data: fakeData.tables };
  },

  async generateQR(tableId: string) {
    await delay(500);
    const table = fakeData.tables.find(t => t.id === tableId);
    if (!table) {
      const error: any = new Error('Table not found');
      error.response = { status: 404, data: { message: 'Table not found' } };
      throw error;
    }

    // Generate QR code URL
    table.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://dineflow.com/menu/${table.restaurantId}?table=${table.tableNumber}`;

    return { data: table };
  },

  async validateQRCode(qrData: string) {
    await delay(500);
    // Parse QR code data - format: /menu/:restaurantId?table=:tableNumber
    // or full URL: https://dineflow.com/menu/:restaurantId?table=:tableNumber

    try {
      let restaurantId: string | null = null;
      let tableNumber: string | null = null;

      // Handle different QR code formats
      if (qrData.includes('/menu/')) {
        const match = qrData.match(/\/menu\/([^?]+)(?:\?table=(\d+))?/);
        if (match) {
          restaurantId = match[1];
          tableNumber = match[2] || null;
        }
      } else if (qrData.includes('restaurantId') && qrData.includes('table')) {
        // JSON format
        const data = JSON.parse(qrData);
        restaurantId = data.restaurantId;
        tableNumber = data.table?.toString() || null;
      }

      if (!restaurantId) {
        const error: any = new Error('Invalid QR code format');
        error.response = { status: 400, data: { message: 'Invalid QR code format' } };
        throw error;
      }

      // Validate restaurant exists
      const restaurant = fakeData.restaurants.find(r => r.id === restaurantId);
      if (!restaurant) {
        const error: any = new Error('Restaurant not found');
        error.response = { status: 404, data: { message: 'Restaurant not found' } };
        throw error;
      }

      // Validate table if provided
      if (tableNumber) {
        const table = fakeData.tables.find(
          t => t.restaurantId === restaurantId && t.tableNumber === parseInt(tableNumber)
        );
        if (!table) {
          const error: any = new Error('Table not found');
          error.response = { status: 404, data: { message: 'Table not found' } };
          throw error;
        }
      }

      return {
        data: {
          restaurantId,
          tableNumber: tableNumber ? parseInt(tableNumber) : null,
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            logo: restaurant.logo,
          },
          valid: true,
        },
      };
    } catch (error: any) {
      if (error.response) throw error;
      const apiError: any = new Error('Invalid QR code');
      apiError.response = { status: 400, data: { message: 'Invalid QR code' } };
      throw apiError;
    }
  },

  async createTable(data: { restaurantId: string; tableNumber: number; capacity: number; status?: string }) {
    await delay(500);
    const newTable: any = {
      id: `table-${Date.now()}`,
      restaurantId: data.restaurantId,
      tableNumber: data.tableNumber,
      capacity: data.capacity,
      status: data.status || 'AVAILABLE',
      qrCode: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fakeData.tables.push(newTable);
    return { data: newTable };
  },

  async updateTable(tableId: string, data: Partial<{ tableNumber: number; capacity: number; status: string }>) {
    await delay(500);
    const index = fakeData.tables.findIndex(t => t.id === tableId);
    if (index === -1) {
      const error: any = new Error('Table not found');
      error.response = { status: 404, data: { message: 'Table not found' } };
      throw error;
    }

    fakeData.tables[index] = {
      ...fakeData.tables[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return { data: fakeData.tables[index] };
  },

  async deleteTable(tableId: string) {
    await delay(500);
    const index = fakeData.tables.findIndex(t => t.id === tableId);
    if (index === -1) {
      const error: any = new Error('Table not found');
      error.response = { status: 404, data: { message: 'Table not found' } };
      throw error;
    }

    fakeData.tables.splice(index, 1);
    return { data: { message: 'Table deleted successfully' } };
  },

  // Order endpoints
  async getOrders(restaurantId?: string) {
    await delay(300);
    if (restaurantId) {
      return {
        data: fakeData.orders.filter(order => order.restaurantId === restaurantId),
      };
    }
    return { data: fakeData.orders };
  },

  async getOrder(orderId: string) {
    await delay(300);
    const order = fakeData.orders.find(o => o.id === orderId);
    if (!order) {
      const error: any = new Error('Order not found');
      error.response = { status: 404, data: { message: 'Order not found' } };
      throw error;
    }
    return { data: order };
  },

  async getOrderPublic(orderId: string) {
    await delay(300);
    const order = fakeData.orders.find(o => o.id === orderId);
    if (!order) {
      const error: any = new Error('Order not found');
      error.response = { status: 404, data: { message: 'Order not found' } };
      throw error;
    }

    // Get restaurant info
    const restaurant = fakeData.restaurants.find(r => r.id === order.restaurantId);
    const table = fakeData.tables.find(t => t.id === order.tableId);

    return {
      data: {
        ...order,
        restaurant: restaurant ? {
          name: restaurant.name,
          address: restaurant.address,
        } : undefined,
        table: table ? {
          tableNumber: table.tableNumber,
        } : undefined,
      },
    };
  },

  async createOrderPublic(data: { restaurantId: string; tableNumber: string; items: any[]; couponCode?: string; notes?: string }) {
    await delay(1000);

    // Find table
    const restaurant = fakeData.restaurants.find(r => r.id === data.restaurantId);
    if (!restaurant) {
      const error: any = new Error('Restaurant not found');
      error.response = { status: 404, data: { message: 'Restaurant not found' } };
      throw error;
    }

    const table = fakeData.tables.find(
      t => t.restaurantId === data.restaurantId && t.tableNumber === parseInt(data.tableNumber)
    );
    if (!table) {
      const error: any = new Error('Table not found');
      error.response = { status: 404, data: { message: 'Table not found' } };
      throw error;
    }

    // Calculate total
    let subtotal = 0;
    const orderItems = data.items.map(item => {
      const menuItem = fakeData.menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) {
        const error: any = new Error(`Menu item ${item.menuItemId} not found`);
        error.response = { status: 404, data: { message: `Menu item not found` } };
        throw error;
      }
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      return {
        id: `order-item-${Date.now()}-${item.menuItemId}`,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        subtotal: itemSubtotal,
        menuItem: {
          name: menuItem.name,
          price: menuItem.price,
        },
      };
    });

    // Apply coupon if provided
    let discount = 0;
    if (data.couponCode) {
      const coupon = fakeData.coupons?.find(
        c => c.code.toUpperCase() === data.couponCode?.toUpperCase() &&
          c.restaurantId === data.restaurantId &&
          c.status === 'active'
      );
      if (coupon) {
        if (coupon.type === 'percentage') {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        } else if (coupon.type === 'fixed') {
          discount = Math.min(coupon.value, subtotal);
        }
        // Update coupon usage
        coupon.usedCount = (coupon.usedCount || 0) + 1;
      }
    }

    const total = subtotal - discount;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder: any = {
      id: `order-${Date.now()}`,
      restaurantId: data.restaurantId,
      tableId: table.id,
      orderNumber,
      status: 'PENDING',
      totalAmount: total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems,
    };

    fakeData.orders.push(newOrder);

    return {
      data: {
        ...newOrder,
        restaurant: {
          name: restaurant.name,
          address: restaurant.address,
        },
        table: {
          tableNumber: table.tableNumber,
        },
      },
    };
  },

  async updateOrderStatus(orderId: string, status: string) {
    await delay(500);
    const order = fakeData.orders.find(o => o.id === orderId);
    if (!order) {
      const error: any = new Error('Order not found');
      error.response = { status: 404, data: { message: 'Order not found' } };
      throw error;
    }
    order.status = status as any;
    order.updatedAt = new Date().toISOString();
    return { data: order };
  },

  // Bill endpoints
  async getBills(restaurantId?: string) {
    await delay(300);
    if (restaurantId) {
      return {
        data: fakeData.bills.filter(bill => bill.restaurantId === restaurantId),
      };
    }
    return { data: fakeData.bills };
  },

  async downloadPDF(billId: string) {
    await delay(1000);
    const bill = fakeData.bills.find(b => b.id === billId);
    if (!bill) {
      const error: any = new Error('Bill not found');
      error.response = { status: 404, data: { message: 'Bill not found' } };
      throw error;
    }

    // Return a mock blob (in real app, this would be a PDF)
    const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    return { data: blob };
  },

  // Admin Analytics endpoints
  async getAdminStats() {
    await delay(300);
    const totalRevenue = fakeData.bills.reduce((sum, bill) => sum + bill.total, 0);
    const totalOrders = fakeData.orders.length;
    const activeOrders = fakeData.orders.filter(o =>
      o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING'
    ).length;
    const totalRestaurants = fakeData.restaurants.length;
    const totalOwners = fakeData.users.filter(u => u.role === 'owner').length;

    // Calculate revenue growth (mock calculation)
    const currentMonthRevenue = totalRevenue;
    const previousMonthRevenue = totalRevenue * 0.9; // Mock previous month
    const revenueGrowth = previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;

    return {
      data: {
        totalRevenue,
        totalOrders,
        activeOrders,
        totalRestaurants,
        totalOwners,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      },
    };
  },

  async getAdminAnalytics(range: 'week' | 'month' | 'year' = 'month') {
    await delay(300);
    const now = new Date();
    const rangeMap = {
      week: 7,
      month: 30,
      year: 365,
    };
    const days = rangeMap[range];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredBills = fakeData.bills.filter(bill =>
      new Date(bill.createdAt) >= cutoffDate
    );
    const filteredOrders = fakeData.orders.filter(order =>
      new Date(order.createdAt) >= cutoffDate
    );

    const totalRevenue = filteredBills.reduce((sum, bill) => sum + bill.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate revenue trends (mock monthly data)
    const revenueData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayBills = filteredBills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        return billDate.toDateString() === date.toDateString();
      });
      const dayRevenue = dayBills.reduce((sum, bill) => sum + bill.total, 0);
      revenueData.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
      });
    }

    return {
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueData,
        totalRestaurants: fakeData.restaurants.length,
        activeRestaurants: fakeData.restaurants.filter(r => r.status === 'active' || !r.status).length,
        totalOwners: fakeData.users.filter(u => u.role === 'owner').length,
      },
    };
  },

  // Subscription endpoints
  async getSubscriptions() {
    await delay(300);
    return {
      data: fakeData.subscriptions.map(sub => ({
        ...sub,
        restaurant: fakeData.restaurants.find(r => r.id === sub.restaurantId),
        plan: fakeData.subscriptionPlans.find(p => p.id === sub.planId),
      })),
    };
  },

  async getSubscriptionPlans() {
    await delay(300);
    return { data: fakeData.subscriptionPlans };
  },

  async updateSubscriptionPlan(id: string, data: { monthlyPrice?: number; yearlyPrice?: number; features?: string[] }) {
    await delay(300);
    const index = fakeData.subscriptionPlans.findIndex(p => p.id === id);
    if (index === -1) {
      const error: any = new Error('Plan not found');
      error.response = { status: 404, data: { message: 'Plan not found' } };
      throw error;
    }

    fakeData.subscriptionPlans[index] = {
      ...fakeData.subscriptionPlans[index],
      ...data,
    };

    return { data: fakeData.subscriptionPlans[index] };
  },

  // API Keys endpoints
  async getAPIKeys(search?: string, status?: string) {
    await delay(300);
    let keys = fakeData.apiKeys || [];

    if (search) {
      const searchLower = search.toLowerCase();
      keys = keys.filter(key =>
        key.name.toLowerCase().includes(searchLower) ||
        key.keyPrefix.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      keys = keys.filter(key => key.status === status);
    }

    return { data: keys };
  },

  async createAPIKey(data: { name: string; description?: string; permissions?: any; rateLimit?: any; expiresAt?: string }) {
    await delay(500);
    const keyPrefix = `df_live_${Math.random().toString(36).substring(2, 10)}`;
    const fullKey = `${keyPrefix}_${Math.random().toString(36).substring(2, 32)}`;

    const newKey: any = {
      id: `key-${Date.now()}`,
      name: data.name,
      description: data.description || 'API key created via admin panel',
      key: fullKey,
      keyPrefix,
      permissions: data.permissions || {
        restaurants: true,
        orders: true,
        menu: true,
        analytics: false,
        billing: false,
      },
      rateLimit: data.rateLimit || {
        requests: 1000,
        period: 'hour',
      },
      status: 'active' as const,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt || null,
    };

    // Only add optional fields if they exist
    if (data.expiresAt) {
      newKey.expiresAt = data.expiresAt;
    }

    if (!fakeData.apiKeys) fakeData.apiKeys = [];
    fakeData.apiKeys.push(newKey);

    return { data: newKey };
  },

  async updateAPIKey(id: string, data: { name?: string; description?: string; permissions?: any; rateLimit?: any; status?: string }) {
    await delay(300);
    if (!fakeData.apiKeys) fakeData.apiKeys = [];
    const index = fakeData.apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      const error: any = new Error('API key not found');
      error.response = { status: 404, data: { message: 'API key not found' } };
      throw error;
    }

    fakeData.apiKeys[index] = {
      ...fakeData.apiKeys[index],
      ...data,
    };

    return { data: fakeData.apiKeys[index] };
  },

  async deleteAPIKey(id: string) {
    await delay(300);
    if (!fakeData.apiKeys) fakeData.apiKeys = [];
    const index = fakeData.apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      const error: any = new Error('API key not found');
      error.response = { status: 404, data: { message: 'API key not found' } };
      throw error;
    }

    fakeData.apiKeys.splice(index, 1);
    return { data: { message: 'API key deleted successfully' } };
  },

  async regenerateAPIKey(id: string) {
    await delay(500);
    if (!fakeData.apiKeys) fakeData.apiKeys = [];
    const index = fakeData.apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      const error: any = new Error('API key not found');
      error.response = { status: 404, data: { message: 'API key not found' } };
      throw error;
    }

    const newKeyPrefix = `df_live_${Math.random().toString(36).substring(2, 10)}`;
    const newFullKey = `${newKeyPrefix}_${Math.random().toString(36).substring(2, 32)}`;

    const updatedKey: any = {
      ...fakeData.apiKeys[index],
      key: newFullKey,
      keyPrefix: newKeyPrefix,
      usageCount: 0,
    };
    // Remove lastUsed when regenerating
    delete updatedKey.lastUsed;
    fakeData.apiKeys[index] = updatedKey;

    return { data: fakeData.apiKeys[index] };
  },

  // Loyalty Programs endpoints
  async getLoyaltyPrograms(search?: string, status?: string) {
    await delay(300);
    let programs = fakeData.loyaltyPrograms || [];

    if (search) {
      const searchLower = search.toLowerCase();
      programs = programs.filter(program =>
        program.name.toLowerCase().includes(searchLower) ||
        program.restaurantName.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      programs = programs.filter(program => program.status === status);
    }

    return { data: programs };
  },

  async createLoyaltyProgram(data: any) {
    await delay(500);
    const restaurant = fakeData.restaurants.find(r => r.id === data.restaurantId);
    const newProgram = {
      id: `loyalty-${Date.now()}`,
      restaurantId: data.restaurantId,
      restaurantName: restaurant?.name || 'Unknown Restaurant',
      name: data.name,
      description: data.description || '',
      type: data.type || 'points',
      rules: data.rules || {},
      rewards: data.rewards || [],
      status: 'active' as const,
      totalMembers: 0,
      totalPointsIssued: 0,
      totalPointsRedeemed: 0,
      createdAt: new Date().toISOString(),
    };

    if (!fakeData.loyaltyPrograms) fakeData.loyaltyPrograms = [];
    fakeData.loyaltyPrograms.push(newProgram);

    return { data: newProgram };
  },

  async updateLoyaltyProgram(id: string, data: any) {
    await delay(300);
    if (!fakeData.loyaltyPrograms) fakeData.loyaltyPrograms = [];
    const index = fakeData.loyaltyPrograms.findIndex(p => p.id === id);
    if (index === -1) {
      const error: any = new Error('Loyalty program not found');
      error.response = { status: 404, data: { message: 'Loyalty program not found' } };
      throw error;
    }

    fakeData.loyaltyPrograms[index] = {
      ...fakeData.loyaltyPrograms[index],
      ...data,
    };

    return { data: fakeData.loyaltyPrograms[index] };
  },

  async deleteLoyaltyProgram(id: string) {
    await delay(300);
    if (!fakeData.loyaltyPrograms) fakeData.loyaltyPrograms = [];
    const index = fakeData.loyaltyPrograms.findIndex(p => p.id === id);
    if (index === -1) {
      const error: any = new Error('Loyalty program not found');
      error.response = { status: 404, data: { message: 'Loyalty program not found' } };
      throw error;
    }

    fakeData.loyaltyPrograms.splice(index, 1);
    return { data: { message: 'Loyalty program deleted successfully' } };
  },

  // Coupons endpoints
  async getCoupons(search?: string, status?: string, type?: string) {
    await delay(300);
    let coupons = fakeData.coupons || [];

    if (search) {
      const searchLower = search.toLowerCase();
      coupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchLower) ||
        coupon.name.toLowerCase().includes(searchLower) ||
        coupon.restaurantName.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      coupons = coupons.filter(coupon => coupon.status === status);
    }

    if (type && type !== 'all') {
      coupons = coupons.filter(coupon => coupon.type === type);
    }

    return { data: coupons };
  },

  async createCoupon(data: any) {
    await delay(500);
    const restaurant = fakeData.restaurants.find(r => r.id === data.restaurantId);
    const newCoupon = {
      id: `coupon-${Date.now()}`,
      code: data.code.toUpperCase(),
      restaurantId: data.restaurantId,
      restaurantName: restaurant?.name || 'Unknown Restaurant',
      name: data.name,
      description: data.description || '',
      type: data.type || 'percentage',
      value: data.value || 0,
      minOrderAmount: data.minOrderAmount,
      maxDiscount: data.maxDiscount,
      validFrom: data.validFrom || new Date().toISOString(),
      validUntil: data.validUntil,
      usageLimit: data.usageLimit,
      usedCount: 0,
      status: 'active' as const,
      applicableTo: data.applicableTo || 'all',
      createdAt: new Date().toISOString(),
    };

    if (!fakeData.coupons) fakeData.coupons = [];
    fakeData.coupons.push(newCoupon);

    return { data: newCoupon };
  },

  async updateCoupon(id: string, data: any) {
    await delay(300);
    if (!fakeData.coupons) fakeData.coupons = [];
    const index = fakeData.coupons.findIndex(c => c.id === id);
    if (index === -1) {
      const error: any = new Error('Coupon not found');
      error.response = { status: 404, data: { message: 'Coupon not found' } };
      throw error;
    }

    fakeData.coupons[index] = {
      ...fakeData.coupons[index],
      ...data,
      ...(data.code && { code: data.code.toUpperCase() }),
    };

    return { data: fakeData.coupons[index] };
  },

  async deleteCoupon(id: string) {
    await delay(300);
    if (!fakeData.coupons) fakeData.coupons = [];
    const index = fakeData.coupons.findIndex(c => c.id === id);
    if (index === -1) {
      const error: any = new Error('Coupon not found');
      error.response = { status: 404, data: { message: 'Coupon not found' } };
      throw error;
    }

    fakeData.coupons.splice(index, 1);
    return { data: { message: 'Coupon deleted successfully' } };
  },

  async validateCoupon(data: { code: string; restaurantId: string; orderAmount: number }) {
    await delay(500);
    if (!fakeData.coupons) fakeData.coupons = [];

    const coupon = fakeData.coupons.find(
      c => c.code.toUpperCase() === data.code.toUpperCase() &&
        c.restaurantId === data.restaurantId &&
        c.status === 'active'
    );

    if (!coupon) {
      const error: any = new Error('Invalid or expired coupon code');
      error.response = { status: 400, data: { message: 'Invalid or expired coupon code', valid: false } };
      throw error;
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      const error: any = new Error('Coupon has expired');
      error.response = { status: 400, data: { message: 'Coupon has expired', valid: false } };
      throw error;
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      const error: any = new Error('Coupon usage limit reached');
      error.response = { status: 400, data: { message: 'Coupon usage limit reached', valid: false } };
      throw error;
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && data.orderAmount < coupon.minOrderAmount) {
      const error: any = new Error(`Minimum order amount of $${coupon.minOrderAmount} required`);
      error.response = { status: 400, data: { message: `Minimum order amount of $${coupon.minOrderAmount} required`, valid: false } };
      throw error;
    }

    return {
      data: {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          maxDiscount: coupon.maxDiscount,
          minOrderAmount: coupon.minOrderAmount,
        },
      },
    };
  },

  // POS Integrations endpoints
  async getPOSIntegrations(search?: string, status?: string) {
    await delay(300);
    let integrations = fakeData.posIntegrations || [];

    if (search) {
      const searchLower = search.toLowerCase();
      integrations = integrations.filter(integration =>
        integration.restaurantName.toLowerCase().includes(searchLower) ||
        integration.providerName.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      integrations = integrations.filter(integration => integration.status === status);
    }

    return { data: integrations };
  },

  async createPOSIntegration(data: any) {
    await delay(500);
    const restaurant = fakeData.restaurants.find(r => r.id === data.restaurantId);
    const providerNames: Record<string, string> = {
      square: 'Square',
      toast: 'Toast',
      clover: 'Clover',
      revel: 'Revel Systems',
      custom: 'Custom POS',
    };

    const newIntegration = {
      id: `pos-${Date.now()}`,
      restaurantId: data.restaurantId,
      restaurantName: restaurant?.name || 'Unknown Restaurant',
      provider: data.provider || 'custom',
      providerName: providerNames[data.provider] || 'Custom POS',
      status: 'disconnected' as const,
      lastSync: new Date().toISOString(),
      syncFrequency: data.syncFrequency || '15min',
      syncDirection: data.syncDirection || 'bidirectional',
      menuSyncEnabled: data.menuSyncEnabled !== undefined ? data.menuSyncEnabled : true,
      orderSyncEnabled: data.orderSyncEnabled !== undefined ? data.orderSyncEnabled : true,
      paymentSyncEnabled: data.paymentSyncEnabled !== undefined ? data.paymentSyncEnabled : false,
      inventorySyncEnabled: data.inventorySyncEnabled !== undefined ? data.inventorySyncEnabled : false,
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
      endpoint: data.endpoint,
      createdAt: new Date().toISOString(),
    };

    if (!fakeData.posIntegrations) fakeData.posIntegrations = [];
    fakeData.posIntegrations.push(newIntegration);

    return { data: newIntegration };
  },

  async updatePOSIntegration(id: string, data: any) {
    await delay(300);
    if (!fakeData.posIntegrations) fakeData.posIntegrations = [];
    const index = fakeData.posIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      const error: any = new Error('POS integration not found');
      error.response = { status: 404, data: { message: 'POS integration not found' } };
      throw error;
    }

    fakeData.posIntegrations[index] = {
      ...fakeData.posIntegrations[index],
      ...data,
    };

    return { data: fakeData.posIntegrations[index] };
  },

  async deletePOSIntegration(id: string) {
    await delay(300);
    if (!fakeData.posIntegrations) fakeData.posIntegrations = [];
    const index = fakeData.posIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      const error: any = new Error('POS integration not found');
      error.response = { status: 404, data: { message: 'POS integration not found' } };
      throw error;
    }

    fakeData.posIntegrations.splice(index, 1);
    return { data: { message: 'POS integration deleted successfully' } };
  },

  async syncPOSIntegration(id: string) {
    await delay(2000);
    if (!fakeData.posIntegrations) fakeData.posIntegrations = [];
    const index = fakeData.posIntegrations.findIndex(i => i.id === id);
    if (index === -1) {
      const error: any = new Error('POS integration not found');
      error.response = { status: 404, data: { message: 'POS integration not found' } };
      throw error;
    }

    fakeData.posIntegrations[index] = {
      ...fakeData.posIntegrations[index],
      status: 'connected' as const,
      lastSync: new Date().toISOString(),
    };

    return { data: fakeData.posIntegrations[index] };
  },

  // Activity Logs endpoints
  async getActivityLogs(search?: string, action?: string, userId?: string, limit?: number) {
    await delay(300);
    let logs = fakeData.activityLogs || [];

    if (search) {
      const searchLower = search.toLowerCase();
      logs = logs.filter(log =>
        log.userName.toLowerCase().includes(searchLower) ||
        log.resourceName.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower)
      );
    }

    if (action) {
      logs = logs.filter(log => log.action === action);
    }

    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }

    // Sort by date (newest first)
    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      logs = logs.slice(0, limit);
    }

    return { data: logs };
  },

  // Bulk Operations endpoints
  async bulkUpdateRestaurants(ids: string[], data: any) {
    await delay(500);
    const updated: any[] = [];
    const errors: any[] = [];

    ids.forEach(id => {
      const index = fakeData.restaurants.findIndex(r => r.id === id);
      if (index !== -1) {
        fakeData.restaurants[index] = {
          ...fakeData.restaurants[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        updated.push(fakeData.restaurants[index]);
      } else {
        errors.push({ id, message: 'Restaurant not found' });
      }
    });

    return {
      data: {
        updated: updated.length,
        failed: errors.length,
        results: updated,
        errors,
      },
    };
  },

  async bulkDeleteRestaurants(ids: string[]) {
    await delay(500);
    const deleted: string[] = [];
    const errors: any[] = [];

    ids.forEach(id => {
      const index = fakeData.restaurants.findIndex(r => r.id === id);
      if (index !== -1) {
        fakeData.restaurants.splice(index, 1);
        deleted.push(id);
      } else {
        errors.push({ id, message: 'Restaurant not found' });
      }
    });

    return {
      data: {
        deleted: deleted.length,
        failed: errors.length,
        deletedIds: deleted,
        errors,
      },
    };
  },

  // Advanced Analytics endpoints
  async getAdvancedAnalytics(range: 'week' | 'month' | 'year' = 'month') {
    await delay(400);
    const now = new Date();
    const rangeMap = {
      week: 7,
      month: 30,
      year: 365,
    };
    const days = rangeMap[range];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredBills = fakeData.bills.filter(bill =>
      new Date(bill.createdAt) >= cutoffDate
    );
    const filteredOrders = fakeData.orders.filter(order =>
      new Date(order.createdAt) >= cutoffDate
    );

    const totalRevenue = filteredBills.reduce((sum, bill) => sum + bill.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by restaurant
    const revenueByRestaurant: Record<string, number> = {};
    filteredBills.forEach(bill => {
      const restId = bill.restaurantId;
      revenueByRestaurant[restId] = (revenueByRestaurant[restId] || 0) + bill.total;
    });

    // Orders by status
    const ordersByStatus: Record<string, number> = {};
    filteredOrders.forEach(order => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Top performing restaurants
    const restaurantPerformance = Object.entries(revenueByRestaurant)
      .map(([restaurantId, revenue]) => {
        const restaurant = fakeData.restaurants.find(r => r.id === restaurantId);
        const orders = filteredOrders.filter(o => o.restaurantId === restaurantId).length;
        return {
          restaurantId,
          restaurantName: restaurant?.name || 'Unknown',
          revenue,
          orders,
          averageOrderValue: orders > 0 ? revenue / orders : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueByRestaurant,
        ordersByStatus,
        restaurantPerformance,
        totalRestaurants: fakeData.restaurants.length,
        activeRestaurants: fakeData.restaurants.filter(r => r.status === 'active' || !r.status).length,
        dateRange: {
          from: cutoffDate.toISOString(),
          to: now.toISOString(),
        },
      },
    };
  },
};

// Intercept axios requests when mock mode is enabled
export const interceptAxiosRequests = (axiosInstance: any) => {
  if (!USE_MOCK_API) {
    console.log('🔧 Mock API Mode: DISABLED - Using real backend API');
    return;
  }

  console.log('🔧 Mock API Mode: ENABLED - Using fake backend data');
  console.log('💡 To disable, set VITE_USE_FAKE_BACKEND=false in .env file');

  // Store original methods
  const originalGet = axiosInstance.get.bind(axiosInstance);
  const originalPost = axiosInstance.post.bind(axiosInstance);
  const originalPut = axiosInstance.put.bind(axiosInstance);
  const originalPatch = axiosInstance.patch.bind(axiosInstance);
  const originalDelete = axiosInstance.delete.bind(axiosInstance);

  // Override get method
  axiosInstance.get = async function (url: string, config?: any) {
    if (!USE_MOCK_API) {
      return originalGet(url, config);
    }

    try {
      // Handle GET /restaurants
      if (url.includes('/restaurants')) {
        if (url.includes('/public/')) {
          const id = url.split('/public/')[1];
          return await mockApi.getRestaurantPublic(id);
        } else if (url.includes('/stats')) {
          const id = url.split('/restaurants/')[1]?.split('/stats')[0];
          return await mockApi.getRestaurantStats(id);
        } else {
          const params = new URLSearchParams(url.split('?')[1] || '');
          const search = params.get('search') || undefined;
          const status = params.get('status') || undefined;
          return await mockApi.getRestaurants(search, status);
        }
      }

      // Handle GET /owners
      if (url.includes('/owners')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const search = params.get('search') || undefined;
        return await mockApi.getOwners(search);
      }

      // Handle GET /admin/stats
      if (url.includes('/admin/stats')) {
        return await mockApi.getAdminStats();
      }

      // Handle GET /admin/analytics
      if (url.includes('/admin/analytics')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const range = (params.get('range') || 'month') as 'week' | 'month' | 'year';
        return await mockApi.getAdminAnalytics(range);
      }

      // Handle GET /subscriptions
      if (url.includes('/subscriptions') && !url.includes('/plans')) {
        return await mockApi.getSubscriptions();
      }

      // Handle GET /subscriptions/plans
      if (url.includes('/subscriptions/plans') || url.includes('/subscription-plans')) {
        return await mockApi.getSubscriptionPlans();
      }

      // Handle GET /items
      if (url.includes('/items')) {
        if (url.includes('/public/')) {
          const restaurantId = url.split('/public/')[1];
          return await mockApi.getItemsPublic(restaurantId);
        } else {
          const params = new URLSearchParams(url.split('?')[1] || '');
          const restaurantId = params.get('restaurantId') || undefined;
          return await mockApi.getItems(restaurantId);
        }
      }

      // Handle GET /tables
      if (url.includes('/tables')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const restaurantId = params.get('restaurantId') || undefined;
        return await mockApi.getTables(restaurantId);
      }

      // Handle GET /billing/orders or /orders
      if (url.includes('/billing/orders') || (url.includes('/orders') && !url.includes('/items'))) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const restaurantId = params.get('restaurantId') || undefined;
        // Check if it's a single order request
        if (url.split('/orders/').length > 1 && !url.includes('?')) {
          const orderId = url.split('/orders/')[1] || url.split('/billing/orders/')[1];
          // Check if it's a public endpoint
          if (url.includes('/public/') || url.includes('/orders/public/')) {
            return await mockApi.getOrderPublic(orderId);
          }
          return await mockApi.getOrder(orderId);
        }
        return await mockApi.getOrders(restaurantId);
      }

      // Handle GET /billing/bills
      if (url.includes('/billing/bills') && !url.includes('/pdf')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const restaurantId = params.get('restaurantId') || undefined;
        return await mockApi.getBills(restaurantId);
      }

      // Handle GET /billing/bills/:id/pdf
      if (url.includes('/billing/bills/') && url.includes('/pdf')) {
        const billId = url.split('/billing/bills/')[1]?.split('/pdf')[0];
        return await mockApi.downloadPDF(billId);
      }

      // Handle GET /api-keys
      if (url.includes('/api-keys') || url.includes('/api/keys')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const search = params.get('search') || undefined;
        const status = params.get('status') || undefined;
        return await mockApi.getAPIKeys(search, status);
      }

      // Handle GET /loyalty-programs or /loyalty
      if (url.includes('/loyalty-programs') || url.includes('/loyalty')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const search = params.get('search') || undefined;
        const status = params.get('status') || undefined;
        const restaurantId = params.get('restaurantId') || undefined;
        const result = await mockApi.getLoyaltyPrograms(search, status);
        // Filter by restaurantId if provided
        if (restaurantId && result.data) {
          result.data = result.data.filter((p: any) => p.restaurantId === restaurantId);
        }
        return result;
      }

      // Handle GET /coupons
      if (url.includes('/coupons')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const search = params.get('search') || undefined;
        const status = params.get('status') || undefined;
        const type = params.get('type') || undefined;
        const restaurantId = params.get('restaurantId') || undefined;
        const result = await mockApi.getCoupons(search, status, type);
        // Filter by restaurantId if provided
        if (restaurantId && result.data) {
          result.data = result.data.filter((c: any) => c.restaurantId === restaurantId);
        }
        return result;
      }

      // Handle GET /pos-integrations or /pos
      if (url.includes('/pos-integrations') || url.includes('/pos')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const search = params.get('search') || undefined;
        const status = params.get('status') || undefined;
        return await mockApi.getPOSIntegrations(search, status);
      }

      // Handle GET /activity-logs or /logs
      if (url.includes('/activity-logs') || url.includes('/logs')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const search = params.get('search') || undefined;
        const action = params.get('action') || undefined;
        const userId = params.get('userId') || undefined;
        const limit = params.get('limit') ? parseInt(params.get('limit')!) : undefined;
        return await mockApi.getActivityLogs(search, action, userId, limit);
      }

      // Handle GET /admin/analytics/advanced
      if (url.includes('/admin/analytics/advanced') || url.includes('/analytics/advanced')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        const range = (params.get('range') || 'month') as 'week' | 'month' | 'year';
        return await mockApi.getAdvancedAnalytics(range);
      }

      // Fallback to original if no mock match
      return originalGet(url, config);
    } catch (error: any) {
      // Re-throw axios-like error
      const axiosError: any = new Error(error.message || 'Request failed');
      axiosError.response = error.response || { status: 500, data: { message: error.message } };
      throw axiosError;
    }
  };

  // Override post method
  axiosInstance.post = async function (url: string, data?: any, config?: any) {
    if (!USE_MOCK_API) {
      return originalPost(url, data, config);
    }

    try {
      // Handle POST /auth/login
      if (url.includes('/auth/login')) {
        return await mockApi.login(data.email, data.password);
      }

      // Handle POST /items/:id/ai-description
      if (url.includes('/items/') && url.includes('/ai-description')) {
        const itemId = url.split('/items/')[1]?.split('/ai-description')[0];
        return await mockApi.generateAIDescription(itemId);
      }

      // Handle POST /items (create item)
      if (url.includes('/items') && !url.includes('/ai-description') && !url.includes('/public/')) {
        return await mockApi.createItem(data);
      }

      // Handle POST /tables/:id/qr
      if (url.includes('/tables/') && url.includes('/qr')) {
        const tableId = url.split('/tables/')[1]?.split('/qr')[0];
        return await mockApi.generateQR(tableId);
      }

      // Handle POST /tables/validate-qr
      if (url.includes('/tables/validate-qr') || url.includes('/validate-qr')) {
        return await mockApi.validateQRCode(data.qrData);
      }

      // Handle POST /tables (create table)
      if (url.includes('/tables') && !url.includes('/qr') && !url.includes('/validate')) {
        return await mockApi.createTable(data);
      }

      // Handle POST /restaurants
      if (url.includes('/restaurants') && !url.includes('/public/')) {
        const newRestaurant = {
          id: `rest-${Date.now()}`,
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        fakeData.restaurants.push(newRestaurant);
        return {
          data: {
            ...newRestaurant,
            owner: undefined,
          },
        };
      }

      // Handle POST /owners
      if (url.includes('/owners')) {
        return await mockApi.createOwner(data);
      }

      // Handle POST /api-keys or /api/keys
      if (url.includes('/api-keys') || url.includes('/api/keys')) {
        return await mockApi.createAPIKey(data);
      }

      // Handle POST /loyalty-programs or /loyalty
      if (url.includes('/loyalty-programs') || url.includes('/loyalty')) {
        return await mockApi.createLoyaltyProgram(data);
      }

      // Handle POST /coupons/validate
      if (url.includes('/coupons/validate')) {
        return await mockApi.validateCoupon(data);
      }

      // Handle POST /coupons
      if (url.includes('/coupons') && !url.includes('/validate')) {
        return await mockApi.createCoupon(data);
      }

      // Handle POST /pos-integrations or /pos
      if (url.includes('/pos-integrations') || url.includes('/pos')) {
        return await mockApi.createPOSIntegration(data);
      }

      // Handle POST /restaurants/bulk-update
      if (url.includes('/restaurants/bulk-update')) {
        return await mockApi.bulkUpdateRestaurants(data.ids || [], data.data || {});
      }

      // Handle POST /restaurants/bulk-delete
      if (url.includes('/restaurants/bulk-delete')) {
        return await mockApi.bulkDeleteRestaurants(data.ids || []);
      }

      // Handle POST /pos-integrations/:id/sync
      if (url.includes('/pos-integrations/') && url.includes('/sync')) {
        const id = url.split('/pos-integrations/')[1]?.split('/sync')[0] || url.split('/pos/')[1]?.split('/sync')[0];
        if (id) {
          return await mockApi.syncPOSIntegration(id);
        }
      }

      // Handle POST /api-keys/:id/regenerate
      if (url.includes('/api-keys/') && url.includes('/regenerate')) {
        const id = url.split('/api-keys/')[1]?.split('/regenerate')[0] || url.split('/api/keys/')[1]?.split('/regenerate')[0];
        if (id) {
          return await mockApi.regenerateAPIKey(id);
        }
      }

      // Fallback to original if no mock match
      return originalPost(url, data, config);
    } catch (error: any) {
      // Re-throw axios-like error
      const axiosError: any = new Error(error.message || 'Request failed');
      axiosError.response = error.response || { status: 500, data: { message: error.message } };
      throw axiosError;
    }
  };

  // Override put method
  axiosInstance.put = async function (url: string, data?: any, config?: any) {
    if (!USE_MOCK_API) {
      return originalPut(url, data, config);
    }

    try {
      // Handle PUT /restaurants/:id
      if (url.includes('/restaurants/') && !url.includes('/status')) {
        const id = url.split('/restaurants/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateRestaurant(id, data);
        }
      }

      // Handle PUT /owners/:id
      if (url.includes('/owners/')) {
        const id = url.split('/owners/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateOwner(id, data);
        }
      }

      // Handle PUT /items/:id
      if (url.includes('/items/') && !url.includes('/ai-description')) {
        const id = url.split('/items/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateItem(id, data);
        }
      }

      // Handle PUT /tables/:id
      if (url.includes('/tables/') && !url.includes('/qr')) {
        const id = url.split('/tables/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateTable(id, data);
        }
      }

      // Handle PUT /billing/orders/:id or /orders/:id
      if ((url.includes('/billing/orders/') || url.includes('/orders/')) && !url.includes('/status')) {
        const id = url.split('/orders/')[1]?.split('?')[0] || url.split('/billing/orders/')[1]?.split('?')[0];
        if (id && data.status) {
          return await mockApi.updateOrderStatus(id, data.status);
        }
      }

      // Handle PUT /subscriptions/plans/:id
      if (url.includes('/subscriptions/plans/') || url.includes('/subscription-plans/')) {
        const id = url.split('/plans/')[1]?.split('?')[0] || url.split('/subscription-plans/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateSubscriptionPlan(id, data);
        }
      }

      // Handle PUT /api-keys/:id or /api/keys/:id
      if (url.includes('/api-keys/') || url.includes('/api/keys/')) {
        const id = url.split('/api-keys/')[1]?.split('?')[0] || url.split('/api/keys/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateAPIKey(id, data);
        }
      }

      // Handle PUT /loyalty-programs/:id or /loyalty/:id
      if (url.includes('/loyalty-programs/') || url.includes('/loyalty/')) {
        const id = url.split('/loyalty-programs/')[1]?.split('?')[0] || url.split('/loyalty/')[1]?.split('?')[0];
        if (id && !id.includes('sync')) {
          return await mockApi.updateLoyaltyProgram(id, data);
        }
      }

      // Handle PUT /coupons/:id
      if (url.includes('/coupons/')) {
        const id = url.split('/coupons/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.updateCoupon(id, data);
        }
      }

      // Handle PUT /pos-integrations/:id or /pos/:id
      if (url.includes('/pos-integrations/') || url.includes('/pos/')) {
        const id = url.split('/pos-integrations/')[1]?.split('?')[0] || url.split('/pos/')[1]?.split('?')[0];
        if (id && !id.includes('sync') && !id.includes('connect')) {
          return await mockApi.updatePOSIntegration(id, data);
        }
      }

      // Fallback to original if no mock match
      return originalPut(url, data, config);
    } catch (error: any) {
      const axiosError: any = new Error(error.message || 'Request failed');
      axiosError.response = error.response || { status: 500, data: { message: error.message } };
      throw axiosError;
    }
  };

  // Override patch method
  axiosInstance.patch = async function (url: string, data?: any, config?: any) {
    if (!USE_MOCK_API) {
      return originalPatch(url, data, config);
    }

    try {
      // Handle PATCH /restaurants/:id/status
      if (url.includes('/restaurants/') && url.includes('/status')) {
        const id = url.split('/restaurants/')[1]?.split('/status')[0];
        if (id && data.status) {
          return await mockApi.updateRestaurantStatus(id, data.status);
        }
      }

      // Handle PATCH /api-keys/:id/status
      if (url.includes('/api-keys/') && url.includes('/status')) {
        const id = url.split('/api-keys/')[1]?.split('/status')[0] || url.split('/api/keys/')[1]?.split('/status')[0];
        if (id && data.status) {
          return await mockApi.updateAPIKey(id, { status: data.status });
        }
      }

      // Handle PATCH /loyalty-programs/:id/status
      if (url.includes('/loyalty-programs/') && url.includes('/status')) {
        const id = url.split('/loyalty-programs/')[1]?.split('/status')[0] || url.split('/loyalty/')[1]?.split('/status')[0];
        if (id && data.status) {
          return await mockApi.updateLoyaltyProgram(id, { status: data.status });
        }
      }

      // Handle PATCH /coupons/:id/status
      if (url.includes('/coupons/') && url.includes('/status')) {
        const id = url.split('/coupons/')[1]?.split('/status')[0];
        if (id && data.status) {
          return await mockApi.updateCoupon(id, { status: data.status });
        }
      }

      // Handle PATCH /pos-integrations/:id/connect
      if (url.includes('/pos-integrations/') && url.includes('/connect')) {
        const id = url.split('/pos-integrations/')[1]?.split('/connect')[0] || url.split('/pos/')[1]?.split('/connect')[0];
        if (id) {
          return await mockApi.updatePOSIntegration(id, { status: 'connected' });
        }
      }

      // Handle PATCH /pos-integrations/:id/disconnect
      if (url.includes('/pos-integrations/') && url.includes('/disconnect')) {
        const id = url.split('/pos-integrations/')[1]?.split('/disconnect')[0] || url.split('/pos/')[1]?.split('/disconnect')[0];
        if (id) {
          return await mockApi.updatePOSIntegration(id, { status: 'disconnected' });
        }
      }

      // Fallback to original if no mock match
      return originalPatch(url, data, config);
    } catch (error: any) {
      const axiosError: any = new Error(error.message || 'Request failed');
      axiosError.response = error.response || { status: 500, data: { message: error.message } };
      throw axiosError;
    }
  };

  // Override delete method
  axiosInstance.delete = async function (url: string, config?: any) {
    if (!USE_MOCK_API) {
      return originalDelete(url, config);
    }

    try {
      // Handle DELETE /restaurants/:id
      if (url.includes('/restaurants/')) {
        const id = url.split('/restaurants/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.deleteRestaurant(id);
        }
      }

      // Handle DELETE /owners/:id
      if (url.includes('/owners/')) {
        const id = url.split('/owners/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.deleteOwner(id);
        }
      }

      // Handle DELETE /items/:id
      if (url.includes('/items/')) {
        const id = url.split('/items/')[1]?.split('?')[0];
        if (id && !id.includes('ai-description')) {
          return await mockApi.deleteItem(id);
        }
      }

      // Handle DELETE /tables/:id
      if (url.includes('/tables/')) {
        const id = url.split('/tables/')[1]?.split('?')[0];
        if (id && !id.includes('qr')) {
          return await mockApi.deleteTable(id);
        }
      }

      // Handle DELETE /api-keys/:id or /api/keys/:id
      if (url.includes('/api-keys/') || url.includes('/api/keys/')) {
        const id = url.split('/api-keys/')[1]?.split('?')[0] || url.split('/api/keys/')[1]?.split('?')[0];
        if (id && !id.includes('regenerate')) {
          return await mockApi.deleteAPIKey(id);
        }
      }

      // Handle DELETE /loyalty-programs/:id or /loyalty/:id
      if (url.includes('/loyalty-programs/') || url.includes('/loyalty/')) {
        const id = url.split('/loyalty-programs/')[1]?.split('?')[0] || url.split('/loyalty/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.deleteLoyaltyProgram(id);
        }
      }

      // Handle DELETE /coupons/:id
      if (url.includes('/coupons/')) {
        const id = url.split('/coupons/')[1]?.split('?')[0];
        if (id) {
          return await mockApi.deleteCoupon(id);
        }
      }

      // Handle DELETE /pos-integrations/:id or /pos/:id
      if (url.includes('/pos-integrations/') || url.includes('/pos/')) {
        const id = url.split('/pos-integrations/')[1]?.split('?')[0] || url.split('/pos/')[1]?.split('?')[0];
        if (id && !id.includes('sync') && !id.includes('connect')) {
          return await mockApi.deletePOSIntegration(id);
        }
      }

      // Fallback to original if no mock match
      return originalDelete(url, config);
    } catch (error: any) {
      const axiosError: any = new Error(error.message || 'Request failed');
      axiosError.response = error.response || { status: 500, data: { message: error.message } };
      throw axiosError;
    }
  };
};

export default mockApi;

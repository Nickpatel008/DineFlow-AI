import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Store,
  Users,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  CreditCard,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

// Generate dummy data based on time range
const generateDummyData = (timeRange: 'week' | 'month' | 'year') => {
  const now = new Date();
  const data: any[] = [];

  if (timeRange === 'week') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        revenue: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 150) + 50,
        customers: Math.floor(Math.random() * 200) + 100,
        avgOrderValue: Math.floor(Math.random() * 50) + 25,
      });
    }
  } else if (timeRange === 'month') {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    for (let i = 0; i < 4; i++) {
      data.push({
        date: weeks[i],
        revenue: Math.floor(Math.random() * 20000) + 10000,
        orders: Math.floor(Math.random() * 600) + 300,
        customers: Math.floor(Math.random() * 800) + 400,
        avgOrderValue: Math.floor(Math.random() * 50) + 25,
      });
    }
  } else {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    for (let i = 0; i < 12; i++) {
      data.push({
        date: months[i],
        revenue: Math.floor(Math.random() * 80000) + 40000,
        orders: Math.floor(Math.random() * 2500) + 1200,
        customers: Math.floor(Math.random() * 3000) + 1500,
        avgOrderValue: Math.floor(Math.random() * 50) + 25,
      });
    }
  }

  return data;
};

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    totalRestaurants: 0,
    activeRestaurants: 0,
    totalOwners: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    customerGrowth: 0,
    conversionRate: 0,
    averageWaitTime: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [restaurantPerformanceData, setRestaurantPerformanceData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadDummyData();
  }, [timeRange]);

  const loadDummyData = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate dummy chart data
      const generatedData = generateDummyData(timeRange);
      setChartData(generatedData);

      // Calculate stats from dummy data
      const totalRevenue = generatedData.reduce((sum, d) => sum + d.revenue, 0);
      const totalOrders = generatedData.reduce((sum, d) => sum + d.orders, 0);
      const totalCustomers = generatedData.reduce((sum, d) => sum + d.customers, 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Payment method distribution
      const paymentMethods = [
        { name: 'Cash', value: 35, color: '#10b981' },
        { name: 'Credit Card', value: 28, color: '#3b82f6' },
        { name: 'Debit Card', value: 22, color: '#8b5cf6' },
        { name: 'Mobile Payment', value: 15, color: '#f59e0b' },
      ];
      setPaymentMethodData(paymentMethods);

      // Restaurant performance data
      const restaurants = [
        { name: 'The Gourmet', revenue: 45000, orders: 1200, growth: 12.5 },
        { name: 'Bella Vista', revenue: 38000, orders: 980, growth: 8.3 },
        { name: 'Ocean Breeze', revenue: 32000, orders: 850, growth: 15.2 },
        { name: 'Mountain Peak', revenue: 28000, orders: 720, growth: -2.1 },
        { name: 'City Lights', revenue: 25000, orders: 650, growth: 5.7 },
      ];
      setRestaurantPerformanceData(restaurants);

      // Hourly order distribution
      const hours = [];
      for (let i = 8; i <= 22; i++) {
        hours.push({
          hour: `${i}:00`,
          orders: Math.floor(Math.random() * 50) + (i >= 12 && i <= 14 ? 30 : i >= 18 && i <= 20 ? 40 : 10),
        });
      }
      setHourlyData(hours);

      // Set comprehensive stats
      setStats({
        totalRevenue: totalRevenue,
        monthlyRevenue: timeRange === 'month' ? totalRevenue : totalRevenue * 4,
        revenueGrowth: 12.5,
        totalRestaurants: 24,
        activeRestaurants: 20,
        totalOwners: 18,
        totalOrders: totalOrders,
        ordersGrowth: 8.3,
        averageOrderValue: avgOrderValue,
        totalCustomers: totalCustomers,
        customerGrowth: 15.2,
        conversionRate: 68.5,
        averageWaitTime: 18,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#FF7A00', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6 max-w-[1920px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Statistics & Analytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const csvContent = [
                ['Date', 'Revenue', 'Orders', 'Customers', 'Avg Order Value'],
                ...chartData.map(d => [
                  d.date,
                  d.revenue.toString(),
                  d.orders.toString(),
                  d.customers.toString(),
                  d.avgOrderValue.toFixed(2),
                ])
              ].map(row => row.join(',')).join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `analytics_export_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
              
              toast.success('Analytics data exported successfully');
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              {stats.revenueGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {timeRange === 'week' ? 'This week' : timeRange === 'month' ? 'This month' : 'This year'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
              {stats.activeRestaurants}/{stats.totalRestaurants}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Restaurants</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeRestaurants}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {stats.totalRestaurants} total restaurants
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              {stats.ordersGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalOrders.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Avg: ${stats.averageOrderValue.toFixed(2)} per order
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              {stats.customerGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalCustomers.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {stats.conversionRate.toFixed(1)}% conversion rate
          </p>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue & Orders Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                Revenue & Orders Trend
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {timeRange === 'week' ? 'Daily' : timeRange === 'month' ? 'Weekly' : 'Monthly'} overview
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                  if (name === 'orders') return [value, 'Orders'];
                  return [value, name];
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                fill="url(#colorRevenue)"
                fillOpacity={0.3}
                stroke="#FF7A00"
                strokeWidth={2}
                name="Revenue"
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Orders"
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Methods Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Payment Methods
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Distribution by payment type
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`${value}%`, 'Usage']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Restaurant Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Top Restaurants
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Revenue performance by restaurant
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={restaurantPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#FF7A00" radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Order Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Hourly Order Distribution
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Peak hours analysis
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis
                dataKey="hour"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [value, 'Orders']}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Wait Time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.averageWaitTime} min
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                ${stats.averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Owners</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalOwners}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Stats Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Restaurant Performance Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Restaurant
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Orders
                  </th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurantPerformanceData.map((restaurant, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {restaurant.name}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-gray-900 dark:text-gray-100">
                      ${restaurant.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-gray-600 dark:text-gray-400">
                      {restaurant.orders}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      <span
                        className={`font-semibold ${
                          restaurant.growth > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {restaurant.growth > 0 ? '+' : ''}
                        {restaurant.growth.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Key Metrics Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                ${stats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalOrders.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Customers</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalCustomers.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Restaurants</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {stats.activeRestaurants}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Growth</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +{stats.revenueGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsPage;

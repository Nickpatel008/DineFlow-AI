import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Store, 
  Users, 
  CheckCircle2, 
  Rocket, 
  BarChart3,
  CreditCard,
  Settings,
  Menu as MenuIcon,
  ShoppingCart,
  Receipt,
  QrCode,
  Zap,
  Target,
  TrendingUp,
  UserPlus,
  FileText,
  PieChart,
  Activity,
  Smartphone,
  Scan,
  Star,
  Image as ImageIcon,
  Tag,
  List,
  Filter,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Mail,
  Bell,
  Key,
  Database
} from 'lucide-react';

interface Feature {
  name: string;
  description: string;
  icon: any;
}

interface Role {
  id: string;
  name: string;
  icon: any;
  color: string;
  iconBg: string;
  iconColor: string;
  description: string;
  tasks: { text: string; icon: any }[];
  features: Feature[];
  roadmap: {
    phase: string;
    status: 'completed' | 'in-progress' | 'planned';
    items: string[];
  }[];
}

const RolesFeaturesPage = () => {
  const [activeRole, setActiveRole] = useState<string>('super-admin');

  const roles: Role[] = [
    {
      id: 'super-admin',
      name: 'Super Admin',
      icon: Shield,
      color: 'purple',
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      description: 'Complete platform control and management. Super Admins oversee all restaurants, manage subscriptions, pricing plans, and platform-wide settings.',
      tasks: [
        { text: 'Manage all restaurants and their owners', icon: Store },
        { text: 'Create and manage subscription plans', icon: CreditCard },
        { text: 'Monitor platform-wide analytics and statistics', icon: BarChart3 },
        { text: 'Handle billing and subscription management', icon: DollarSign },
        { text: 'Configure platform settings and features', icon: Settings },
        { text: 'Manage user roles and permissions', icon: Key },
        { text: 'View and manage all orders across restaurants', icon: ShoppingCart },
        { text: 'Generate comprehensive reports and insights', icon: FileText }
      ],
      features: [
        { name: 'Restaurant Management', description: 'Create, edit, delete restaurants with full control', icon: Store },
        { name: 'Owner Management', description: 'Add, remove, and manage restaurant owners', icon: UserPlus },
        { name: 'Subscription Plans', description: 'Create and manage pricing tiers and features', icon: CreditCard },
        { name: 'Subscriptions', description: 'View and manage all restaurant subscriptions', icon: Receipt },
        { name: 'Analytics Dashboard', description: 'Platform-wide statistics and performance metrics', icon: PieChart },
        { name: 'Pricing Management', description: 'Set and update subscription pricing dynamically', icon: DollarSign },
        { name: 'Settings', description: 'Configure platform-wide settings and preferences', icon: Settings },
        { name: 'Profile Management', description: 'Customize admin profile and banner designs', icon: UserPlus },
        { name: 'Order Overview', description: 'View orders from all restaurants in one place', icon: Eye },
        { name: 'Billing Management', description: 'Track payments, invoices, and revenue', icon: Activity }
      ],
      roadmap: [
        {
          phase: 'Phase 1 - Core Admin Features',
          status: 'completed',
          items: [
            'Restaurant CRUD operations',
            'Owner management system',
            'Basic subscription management',
            'Analytics dashboard',
            'Settings and profile management'
          ]
        },
        {
          phase: 'Phase 2 - Advanced Management',
          status: 'in-progress',
          items: [
            'Advanced analytics and reporting',
            'Bulk operations for restaurants',
            'Automated subscription billing',
            'Multi-currency support',
            'Advanced user role management'
          ]
        },
        {
          phase: 'Phase 3 - Enterprise Features',
          status: 'planned',
          items: [
            'White-label customization',
            'API access management',
            'Custom subscription plans',
            'Advanced security features',
            'Multi-tenant management'
          ]
        }
      ]
    },
    {
      id: 'restaurant-owner',
      name: 'Restaurant Owner',
      icon: Store,
      color: 'orange',
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      description: 'Complete control over restaurant operations. Owners manage their restaurant\'s menu, tables, orders, bills, and settings.',
      tasks: [
        { text: 'Manage restaurant profile and information', icon: Edit },
        { text: 'Create and manage menu items with categories', icon: MenuIcon },
        { text: 'Add and manage tables with QR code generation', icon: QrCode },
        { text: 'View and process customer orders', icon: ShoppingCart },
        { text: 'Generate bills and invoices for orders', icon: Receipt },
        { text: 'Track restaurant performance and analytics', icon: TrendingUp },
        { text: 'Configure restaurant settings', icon: Settings },
        { text: 'Manage subscription and billing', icon: CreditCard }
      ],
      features: [
        { name: 'Dashboard', description: 'Overview of restaurant performance and key metrics', icon: BarChart3 },
        { name: 'Menu Management', description: 'Add, edit, delete menu items with AI-generated descriptions', icon: MenuIcon },
        { name: 'Table Management', description: 'Create tables and generate QR codes for each table', icon: QrCode },
        { name: 'Order Management', description: 'View and update order status in real-time', icon: ShoppingCart },
        { name: 'Bill Management', description: 'Create bills, generate PDF invoices, send via email', icon: Receipt },
        { name: 'Settings', description: 'Configure restaurant preferences and details', icon: Settings },
        { name: 'Analytics', description: 'View sales, orders, and performance metrics', icon: BarChart3 },
        { name: 'AI Features', description: 'Generate menu descriptions and business insights', icon: Zap },
        { name: 'QR Code System', description: 'Generate QR codes for contactless ordering', icon: Scan },
        { name: 'Invoice Generation', description: 'Create and send professional invoices', icon: Mail }
      ],
      roadmap: [
        {
          phase: 'Phase 1 - Core Restaurant Features',
          status: 'completed',
          items: [
            'Restaurant dashboard',
            'Menu management with categories',
            'Table management with QR codes',
            'Order tracking and management',
            'Bill generation and invoicing'
          ]
        },
        {
          phase: 'Phase 2 - Enhanced Features',
          status: 'in-progress',
          items: [
            'Advanced analytics and insights',
            'Inventory management',
            'Staff management',
            'Customer loyalty program',
            'Promotional offers and coupons'
          ]
        },
        {
          phase: 'Phase 3 - Advanced Capabilities',
          status: 'planned',
          items: [
            'Multi-restaurant management',
            'Kitchen Display System (KDS)',
            'Real-time order updates',
            'Customer reviews and ratings',
            'Integration with POS systems'
          ]
        }
      ]
    },
    {
      id: 'customer',
      name: 'Customer / Normal User',
      icon: Users,
      color: 'blue',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      description: 'End users who visit restaurants and place orders. Customers can browse menus, add items to cart, and place orders using QR codes.',
      tasks: [
        { text: 'Scan QR code to access restaurant menu', icon: Scan },
        { text: 'Browse menu items by categories', icon: List },
        { text: 'Add items to shopping cart', icon: ShoppingCart },
        { text: 'Place orders from the menu', icon: CheckCircle2 },
        { text: 'View order confirmation', icon: Eye },
        { text: 'Track order status (future)', icon: Clock },
        { text: 'Make payments (future)', icon: CreditCard },
        { text: 'Leave reviews and ratings (future)', icon: Star }
      ],
      features: [
        { name: 'Public Menu View', description: 'Browse restaurant menu without login required', icon: Eye },
        { name: 'QR Code Scanning', description: 'Access menu via table QR code instantly', icon: Scan },
        { name: 'Shopping Cart', description: 'Add, remove, and modify items before ordering', icon: ShoppingCart },
        { name: 'Order Placement', description: 'Place orders directly from menu with one click', icon: CheckCircle2 },
        { name: 'Order Confirmation', description: 'View order details and confirmation receipt', icon: FileText },
        { name: 'Responsive Design', description: 'Works seamlessly on all devices and screen sizes', icon: Smartphone },
        { name: 'Dark Mode Support', description: 'Comfortable viewing in any lighting condition', icon: Settings },
        { name: 'Category Filtering', description: 'Browse menu by categories for easy navigation', icon: Filter },
        { name: 'Item Details', description: 'View descriptions, prices, and images', icon: ImageIcon },
        { name: 'Real-time Updates', description: 'See order status updates in real-time (coming soon)', icon: Bell }
      ],
      roadmap: [
        {
          phase: 'Phase 1 - Basic Ordering',
          status: 'completed',
          items: [
            'Public menu browsing',
            'QR code menu access',
            'Shopping cart functionality',
            'Order placement',
            'Order confirmation page'
          ]
        },
        {
          phase: 'Phase 2 - Enhanced Experience',
          status: 'in-progress',
          items: [
            'Order status tracking',
            'Payment integration',
            'Order history',
            'Favorite items',
            'Special dietary filters'
          ]
        },
        {
          phase: 'Phase 3 - Advanced Features',
          status: 'planned',
          items: [
            'Loyalty points and rewards',
            'Customer reviews and ratings',
            'Order customization options',
            'Split bill functionality',
            'Social sharing features'
          ]
        }
      ]
    }
  ];

  const activeRoleData = roles.find(r => r.id === activeRole) || roles[0];
  const ActiveIcon = activeRoleData.icon;

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          System Roles & Features
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Explore all user roles, their responsibilities, features, and development roadmap
        </p>
      </div>

      {/* Role Tabs */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <motion.button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 ${isActive ? role.iconBg : 'bg-gray-100 dark:bg-gray-700'} rounded flex items-center justify-center`}>
                    <Icon className={`w-3 h-3 ${isActive ? role.iconColor : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <span>{role.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Role Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 ${activeRoleData.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <ActiveIcon className={`w-6 h-6 ${activeRoleData.iconColor}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {activeRoleData.name}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {activeRoleData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${activeRoleData.iconBg} rounded-lg flex items-center justify-center`}>
                <Target className={`w-4 h-4 ${activeRoleData.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Key Tasks</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activeRoleData.tasks.map((task, index) => {
                const TaskIcon = task.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`w-7 h-7 ${activeRoleData.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <TaskIcon className={`w-3.5 h-3.5 ${activeRoleData.iconColor}`} />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed flex-1 pt-0.5">
                      {task.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${activeRoleData.iconBg} rounded-lg flex items-center justify-center`}>
                <Zap className={`w-4 h-4 ${activeRoleData.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Available Features</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeRoleData.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${activeRoleData.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <FeatureIcon className={`w-4 h-4 ${activeRoleData.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {feature.name}
                        </h4>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roadmap Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 ${activeRoleData.iconBg} rounded-lg flex items-center justify-center`}>
                <Rocket className={`w-4 h-4 ${activeRoleData.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Development Roadmap</h3>
            </div>
            <div className="space-y-4">
              {activeRoleData.roadmap.map((phase, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute -left-1.5 top-0">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      phase.status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : phase.status === 'in-progress'
                        ? 'bg-yellow-500 border-yellow-500'
                        : 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'
                    }`} />
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {phase.phase}
                      </h4>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        phase.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : phase.status === 'in-progress'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                      }`}>
                        {phase.status === 'completed' ? 'Done' : phase.status === 'in-progress' ? 'Active' : 'Planned'}
                      </span>
                    </div>
                    <ul className="space-y-1.5 mt-2">
                      {phase.items.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2 className={`w-3 h-3 flex-shrink-0 mt-0.5 transition-colors ${
                            phase.status === 'completed'
                              ? 'text-green-500 dark:text-green-400'
                              : phase.status === 'in-progress'
                              ? 'text-yellow-500 dark:text-yellow-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`} />
                          <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tasks</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {activeRoleData.tasks.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Features</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {activeRoleData.features.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Rocket className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Roadmap Phases</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {activeRoleData.roadmap.length}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RolesFeaturesPage;

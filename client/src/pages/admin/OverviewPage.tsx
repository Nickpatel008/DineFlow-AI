import { motion } from 'framer-motion';
import { 
  Target, Rocket, Zap, Shield, BarChart3, Users, Store, 
  CreditCard, CheckCircle2, Calendar, TrendingUp, Globe
} from 'lucide-react';

const OverviewPage = () => {
  const features = [
    {
      icon: Store,
      title: 'Restaurant Management',
      description: 'Complete control over restaurant profiles, menus, tables, and operations',
    },
    {
      icon: Users,
      title: 'Owner Management',
      description: 'Manage restaurant owners, assign permissions, and track activities',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Real-time analytics, revenue tracking, and performance metrics',
    },
    {
      icon: CreditCard,
      title: 'Subscription Management',
      description: 'Flexible pricing plans, billing cycles, and subscription tracking',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with role-based access control',
    },
    {
      icon: Zap,
      title: 'AI-Powered Features',
      description: 'Smart menu descriptions, automated recommendations, and insights',
    },
  ];

  const roadmap = [
    {
      phase: 'Phase 1 - Foundation',
      status: 'completed',
      items: [
        'Core restaurant management system',
        'Owner and admin dashboards',
        'Basic subscription management',
        'Analytics and reporting',
      ],
    },
    {
      phase: 'Phase 2 - Enhancement',
      status: 'in-progress',
      items: [
        'Advanced analytics and insights',
        'Multi-restaurant support',
        'Enhanced subscription features',
        'Mobile app development',
      ],
    },
    {
      phase: 'Phase 3 - Scale',
      status: 'planned',
      items: [
        'API integrations',
        'Third-party payment gateways',
        'White-label solutions',
        'Enterprise features',
      ],
    },
    {
      phase: 'Phase 4 - Innovation',
      status: 'planned',
      items: [
        'AI-powered recommendations',
        'Predictive analytics',
        'Automated marketing tools',
        'Global expansion features',
      ],
    },
  ];

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">DineFlow AI Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Understanding the purpose, features, and roadmap of DineFlow AI SaaS Platform
        </p>
      </div>

      {/* Purpose Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Our Purpose</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          DineFlow AI is a comprehensive SaaS platform designed to revolutionize restaurant management and operations. 
          We empower restaurants of all sizes to streamline their operations, enhance customer experience, and grow their business 
          through intelligent technology solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Simplify Operations</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Automate daily tasks, manage menus, track orders, and handle billing seamlessly
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Drive Growth</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Make data-driven decisions with real-time analytics and performance insights
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Enhance Experience</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Provide exceptional dining experiences through QR menus, order tracking, and more
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* What We Offer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">What We Offer</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Complete Restaurant Management System
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage restaurant profiles, menus, tables, orders, and bills all in one place
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Multi-User Support
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Separate dashboards for Super Admins and Restaurant Owners with role-based access
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Subscription & Billing Management
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Flexible pricing plans, automated billing, invoice generation, and payment tracking
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Real-Time Analytics & Reporting
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Track revenue, orders, customer trends, and performance metrics with detailed reports
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                QR Code Menu System
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Generate QR codes for tables, enable contactless ordering, and improve customer experience
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                AI-Powered Features
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Intelligent menu descriptions, automated insights, and smart recommendations
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Product Roadmap</h2>
        </div>
        <div className="space-y-6">
          {roadmap.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700"
            >
              <div className="absolute -left-2 top-0">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  phase.status === 'completed' 
                    ? 'bg-green-500 border-green-500' 
                    : phase.status === 'in-progress'
                    ? 'bg-yellow-500 border-yellow-500 animate-pulse'
                    : 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'
                }`} />
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {phase.phase}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    phase.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : phase.status === 'in-progress'
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                  }`}>
                    {phase.status === 'completed' ? 'Completed' : phase.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </span>
                </div>
                <ul className="space-y-2 mt-3">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        phase.status === 'completed'
                          ? 'text-green-500 dark:text-green-400'
                          : phase.status === 'in-progress'
                          ? 'text-yellow-500 dark:text-yellow-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Target Audience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Who Can Use DineFlow AI?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-primary/5 to-teal-50 dark:from-primary/10 dark:to-teal-900/10 rounded-lg border border-primary/20 dark:border-primary/30">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Small Restaurants</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Perfect for cafes, bistros, and small dining establishments looking to digitize their operations
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-primary/5 to-teal-50 dark:from-primary/10 dark:to-teal-900/10 rounded-lg border border-primary/20 dark:border-primary/30">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Growing Businesses</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Ideal for expanding restaurants that need scalable solutions and advanced analytics
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-primary/5 to-teal-50 dark:from-primary/10 dark:to-teal-900/10 rounded-lg border border-primary/20 dark:border-primary/30">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Restaurant Chains</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enterprise solutions for multi-location restaurants with centralized management
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-primary/5 to-teal-50 dark:from-primary/10 dark:to-teal-900/10 rounded-lg border border-primary/20 dark:border-primary/30">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">SaaS Administrators</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Complete control panel for managing multiple restaurants, subscriptions, and platform operations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-primary/10 to-teal-50 dark:from-primary/20 dark:to-teal-900/20 rounded-xl p-6 border border-primary/20 dark:border-primary/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Key Benefits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Increased Efficiency
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Automate repetitive tasks and streamline operations to save time and reduce errors
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Better Decision Making
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Access real-time data and insights to make informed business decisions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Cost Savings
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Reduce operational costs through automation and optimized workflows
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">4</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Scalability
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Grow your business without worrying about system limitations or infrastructure
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">5</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Enhanced Customer Experience
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Provide seamless ordering, quick service, and personalized experiences
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">6</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Competitive Advantage
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Stay ahead with modern technology and innovative features
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewPage;


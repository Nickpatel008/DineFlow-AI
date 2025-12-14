import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Check, X, Edit, Save, 
  Sparkles, Zap, Crown, Building2, Settings, 
  Bell, Receipt, FileText, Landmark
} from 'lucide-react';
import api from '../../utils/api';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  icon: any;
}

interface BillingConfig {
  paymentMethods: {
    creditCard: boolean;
    debitCard: boolean;
    paypal: boolean;
    bankTransfer: boolean;
    stripe: boolean;
  };
  defaultBillingCycle: 'monthly' | 'yearly';
  currency: string;
  taxEnabled: boolean;
  taxRate: number;
  invoiceSettings: {
    autoGenerate: boolean;
    sendEmail: boolean;
    dueDays: number;
  };
  notifications: {
    paymentReminder: boolean;
    paymentReceived: boolean;
    invoiceGenerated: boolean;
  };
}

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [showBillingConfig, setShowBillingConfig] = useState(false);
  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    paymentMethods: {
      creditCard: true,
      debitCard: true,
      paypal: false,
      bankTransfer: false,
      stripe: true,
    },
    defaultBillingCycle: 'monthly',
    currency: 'USD',
    taxEnabled: true,
    taxRate: 8.5,
    invoiceSettings: {
      autoGenerate: true,
      sendEmail: true,
      dueDays: 30,
    },
    notifications: {
      paymentReminder: true,
      paymentReceived: true,
      invoiceGenerated: true,
    },
  });
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editData, setEditData] = useState<{ monthly: number; yearly: number } | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions/plans');
      const plansData = response.data || [];
      
      // Map API plans to component format
      const mappedPlans: PricingPlan[] = plansData.map((plan: any) => {
        let icon = Building2;
        if (plan.id === 'plan-professional') icon = Zap;
        if (plan.id === 'plan-enterprise') icon = Crown;
        
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          monthlyPrice: plan.monthlyPrice,
          yearlyPrice: plan.yearlyPrice,
          features: plan.features || [],
          popular: plan.popular || false,
          icon,
        };
      });

      // If no plans, use defaults
      if (mappedPlans.length === 0) {
        setPlans([
          {
            id: 'plan-basic',
            name: 'Basic',
            description: 'Perfect for small restaurants',
            monthlyPrice: 29.99,
            yearlyPrice: 299.99,
            features: ['Up to 5 tables', 'Basic menu management', 'Order tracking', 'Email support', 'Basic analytics'],
            icon: Building2,
          },
          {
            id: 'plan-professional',
            name: 'Professional',
            description: 'Ideal for growing businesses',
            monthlyPrice: 79.99,
            yearlyPrice: 799.99,
            features: ['Unlimited tables', 'Advanced menu management', 'Real-time order tracking', 'Priority support', 'Advanced analytics', 'QR code generation', 'Custom branding'],
            popular: true,
            icon: Zap,
          },
          {
            id: 'plan-enterprise',
            name: 'Enterprise',
            description: 'For large restaurant chains',
            monthlyPrice: 199.99,
            yearlyPrice: 1999.99,
            features: ['Everything in Professional', 'Multi-location support', 'Dedicated account manager', '24/7 phone support', 'Custom integrations', 'White-label solution', 'API access', 'Advanced reporting'],
            icon: Crown,
          },
        ]);
      } else {
        setPlans(mappedPlans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setEditData({ monthly: plan.monthlyPrice, yearly: plan.yearlyPrice });
      setEditingPlan(planId);
    }
  };

  const handleSave = async (planId: string) => {
    if (!editData) return;

    setSubmitting(true);
    try {
      await api.put(`/subscriptions/plans/${planId}`, {
        monthlyPrice: editData.monthly,
        yearlyPrice: editData.yearly,
      });
      
      setPlans(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, monthlyPrice: editData.monthly, yearlyPrice: editData.yearly }
          : plan
      ));
      setEditingPlan(null);
      setEditData(null);
    } catch (error: any) {
      console.error('Failed to update plan:', error);
      alert(error.response?.data?.message || 'Failed to update plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setEditData(null);
  };

  const handleSaveBillingConfig = async () => {
    setSubmitting(true);
    try {
      // Save billing config to localStorage for now (in real app, would save to backend)
      localStorage.setItem('billingConfig', JSON.stringify(billingConfig));
      setShowBillingConfig(false);
      alert('Billing configuration saved successfully');
    } catch (error) {
      console.error('Failed to save billing config:', error);
      alert('Failed to save billing configuration');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Load billing config from localStorage
    const saved = localStorage.getItem('billingConfig');
    if (saved) {
      try {
        setBillingConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse billing config:', e);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="py-6 pr-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Pricing & Billing</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Configure subscription plans and billing settings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Yearly
            </button>
          </div>
          <button
            onClick={() => setShowBillingConfig(!showBillingConfig)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              showBillingConfig
                ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            {showBillingConfig ? 'Hide Configuration' : 'Billing Configuration'}
          </button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const isEditing = editingPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl p-6 border-2 transition-all flex flex-col h-full ${
                plan.popular 
                  ? 'bg-gradient-to-br from-primary/10 dark:from-primary/20 to-teal-50 dark:to-teal-900/20 border-primary shadow-lg' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  plan.popular ? 'bg-primary/20 dark:bg-primary/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>
              </div>

              <div className="mb-4 flex-shrink-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Monthly Price</label>
                      <input
                        type="number"
                        value={editData?.monthly || 0}
                        onChange={(e) => setEditData(prev => ({ ...prev!, monthly: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Yearly Price</label>
                      <input
                        type="number"
                        value={editData?.yearly || 0}
                        onChange={(e) => setEditData(prev => ({ ...prev!, yearly: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">${price.toFixed(2)}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Save ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(2)} per year
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-4 flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 flex-shrink-0 mt-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSave(plan.id)}
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={submitting}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(plan.id)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Pricing
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Side Drawer Overlay */}
      <AnimatePresence>
        {showBillingConfig && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBillingConfig(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            
            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl z-[101] flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Billing Configuration</h2>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">Update payment settings</p>
                </div>
                <button
                  onClick={() => setShowBillingConfig(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors active:scale-95"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {/* Card Stack Visualization */}
                <div className="mb-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Payment Cards</h3>
                  </div>
                  <div className="relative h-32 flex items-center justify-center overflow-visible">
                    <AnimatePresence>
                      {billingConfig.paymentMethods.creditCard && (
                        <motion.div
                          key="creditCard"
                          initial={{ opacity: 0, scale: 0.7, x: 80, rotate: -12 }}
                          animate={{ opacity: 1, scale: 1, x: 0, rotate: -12 }}
                          exit={{ opacity: 0, scale: 0.7, x: 80, rotate: -12 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute w-48 h-28 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg p-3 text-white"
                          style={{ zIndex: 4 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-semibold">CREDIT CARD</div>
                            <div className="text-[10px] font-bold">VISA</div>
                          </div>
                          <div className="text-sm font-bold mb-1.5">•••• •••• •••• 4242</div>
                          <div className="flex justify-between text-[10px]">
                            <span>JOHN DOE</span>
                            <span>12/25</span>
                          </div>
                        </motion.div>
                      )}
                      {billingConfig.paymentMethods.stripe && (
                        <motion.div
                          key="stripe"
                          initial={{ opacity: 0, scale: 0.7, x: 80, rotate: -8 }}
                          animate={{ opacity: 1, scale: 1, x: -15, rotate: -8 }}
                          exit={{ opacity: 0, scale: 0.7, x: 80, rotate: -8 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute w-48 h-28 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg p-3 text-white"
                          style={{ zIndex: 3 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-semibold">STRIPE</div>
                            <div className="text-[10px] font-bold">CARD</div>
                          </div>
                          <div className="text-sm font-bold mb-1.5">•••• •••• •••• 5555</div>
                          <div className="flex justify-between text-[10px]">
                            <span>JOHN DOE</span>
                            <span>09/26</span>
                          </div>
                        </motion.div>
                      )}
                      {billingConfig.paymentMethods.debitCard && (
                        <motion.div
                          key="debitCard"
                          initial={{ opacity: 0, scale: 0.7, x: 80, rotate: -4 }}
                          animate={{ opacity: 1, scale: 1, x: -30, rotate: -4 }}
                          exit={{ opacity: 0, scale: 0.7, x: 80, rotate: -4 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute w-48 h-28 rounded-lg bg-gradient-to-br from-green-600 to-green-800 shadow-lg p-3 text-white"
                          style={{ zIndex: 2 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-semibold">DEBIT CARD</div>
                            <div className="text-[10px] font-bold">VISA</div>
                          </div>
                          <div className="text-sm font-bold mb-1.5">•••• •••• •••• 1234</div>
                          <div className="flex justify-between text-[10px]">
                            <span>JOHN DOE</span>
                            <span>06/27</span>
                          </div>
                        </motion.div>
                      )}
                      {billingConfig.paymentMethods.paypal && (
                        <motion.div
                          key="paypal"
                          initial={{ opacity: 0, scale: 0.7, x: 80, rotate: 0 }}
                          animate={{ opacity: 1, scale: 1, x: -45, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.7, x: 80, rotate: 0 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute w-48 h-28 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg p-3 text-white"
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-semibold">PAYPAL</div>
                            <div className="text-[10px] font-bold">ACCOUNT</div>
                          </div>
                          <div className="text-sm font-bold mb-1.5">user@example.com</div>
                          <div className="flex justify-between text-[10px]">
                            <span>LINKED</span>
                            <span>ACTIVE</span>
                          </div>
                        </motion.div>
                      )}
                      {billingConfig.paymentMethods.bankTransfer && (
                        <motion.div
                          key="bankTransfer"
                          initial={{ opacity: 0, scale: 0.7, x: 80, rotate: 4 }}
                          animate={{ opacity: 1, scale: 1, x: -60, rotate: 4 }}
                          exit={{ opacity: 0, scale: 0.7, x: 80, rotate: 4 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute w-48 h-28 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg p-3 text-white"
                          style={{ zIndex: 0 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-1.5">
                              <Landmark className="w-3 h-3" />
                              <div className="text-[10px] font-semibold">BANK TRANSFER</div>
                            </div>
                            <div className="text-[10px] font-bold">ACH</div>
                          </div>
                          <div className="text-sm font-bold mb-1.5">•••• •••• •••• 9876</div>
                          <div className="flex justify-between text-[10px]">
                            <span>ACCOUNT NUMBER</span>
                            <span>VERIFIED</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {Object.values(billingConfig.paymentMethods).every(v => !v) && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        No payment methods selected
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Methods Selection - Compact */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Payment Methods</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(billingConfig.paymentMethods).map(([method, enabled]) => {
                      const methodLabels: { [key: string]: string } = {
                        creditCard: 'Credit Card',
                        debitCard: 'Debit Card',
                        paypal: 'PayPal',
                        bankTransfer: 'Bank Transfer',
                        stripe: 'Stripe'
                      };
                      
                      const getIcon = (methodName: string) => {
                        if (methodName === 'bankTransfer') return Landmark;
                        return CreditCard;
                      };
                      
                      const getMethodColor = (methodName: string) => {
                        if (methodName === 'creditCard') return 'blue';
                        if (methodName === 'stripe') return 'purple';
                        if (methodName === 'debitCard') return 'green';
                        if (methodName === 'paypal') return 'yellow';
                        if (methodName === 'bankTransfer') return 'indigo';
                        return 'gray';
                      };
                      
                      const Icon = getIcon(method);
                      const color = getMethodColor(method);
                      
                      const colorClasses = {
                        blue: enabled ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700',
                        purple: enabled ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700',
                        green: enabled ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700',
                        yellow: enabled ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700',
                        indigo: enabled ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700',
                        gray: enabled ? 'border-gray-500 bg-gray-50 dark:bg-gray-900/20' : 'border-gray-200 dark:border-gray-700',
                      };
                      
                      const iconBgClasses = {
                        blue: enabled ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-600',
                        purple: enabled ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-600',
                        green: enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-600',
                        yellow: enabled ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-600',
                        indigo: enabled ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-100 dark:bg-gray-600',
                        gray: enabled ? 'bg-gray-100 dark:bg-gray-900/30' : 'bg-gray-100 dark:bg-gray-600',
                      };
                      
                      const iconColorClasses = {
                        blue: enabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400',
                        purple: enabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400',
                        green: enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400',
                        yellow: enabled ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400',
                        indigo: enabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400',
                        gray: enabled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400',
                      };
                      
                      const checkColorClasses = {
                        blue: 'text-blue-600 dark:text-blue-400',
                        purple: 'text-purple-600 dark:text-purple-400',
                        green: 'text-green-600 dark:text-green-400',
                        yellow: 'text-yellow-600 dark:text-yellow-400',
                        indigo: 'text-indigo-600 dark:text-indigo-400',
                        gray: 'text-gray-600 dark:text-gray-400',
                      };
                      
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setBillingConfig(prev => ({
                            ...prev,
                            paymentMethods: {
                              ...prev.paymentMethods,
                              [method]: !prev.paymentMethods[method as keyof typeof prev.paymentMethods],
                            },
                          }))}
                          className={`relative p-2 rounded-md border transition-all hover:scale-[1.02] active:scale-[0.98] ${colorClasses[color as keyof typeof colorClasses]} ${
                            !enabled ? 'bg-white dark:bg-gray-700/50 hover:border-gray-300' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${iconBgClasses[color as keyof typeof iconBgClasses]}`}>
                              <Icon className={`w-3.5 h-3.5 ${iconColorClasses[color as keyof typeof iconColorClasses]}`} />
                            </div>
                            <span className={`text-[10px] font-medium flex-1 ${
                              enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {methodLabels[method] || method}
                            </span>
                            {enabled && (
                              <Check className={`w-3 h-3 ${checkColorClasses[color as keyof typeof checkColorClasses]}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Billing Cycle & Currency - Compact */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={billingConfig.defaultBillingCycle}
                      onChange={(e) => setBillingConfig(prev => ({
                        ...prev,
                        defaultBillingCycle: e.target.value as 'monthly' | 'yearly',
                      }))}
                      className="w-full px-2 py-1.5 text-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <select
                      value={billingConfig.currency}
                      onChange={(e) => setBillingConfig(prev => ({
                        ...prev,
                        currency: e.target.value,
                      }))}
                      className="w-full px-2 py-1.5 text-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                </div>

                {/* Tax Settings - Compact */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Receipt className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Tax Settings</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBillingConfig(prev => ({
                      ...prev,
                      taxEnabled: !prev.taxEnabled,
                    }))}
                    className={`w-full flex items-center justify-between p-2 rounded-md border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                      billingConfig.taxEnabled
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Enable Tax</span>
                    <div className={`relative w-9 h-5 rounded-full transition-colors ${
                      billingConfig.taxEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        billingConfig.taxEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </button>
                  {billingConfig.taxEnabled && (
                    <div className="mt-1.5">
                      <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={billingConfig.taxRate}
                        onChange={(e) => setBillingConfig(prev => ({
                          ...prev,
                          taxRate: parseFloat(e.target.value) || 0,
                        }))}
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-2 py-1.5 text-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Invoice Settings - Compact */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Invoice Settings</h3>
                  </div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setBillingConfig(prev => ({
                        ...prev,
                        invoiceSettings: {
                          ...prev.invoiceSettings,
                          autoGenerate: !prev.invoiceSettings.autoGenerate,
                        },
                      }))}
                      className={`w-full flex items-center justify-between p-2 rounded-md border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                        billingConfig.invoiceSettings.autoGenerate
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Auto-generate invoices</span>
                      <div className={`relative w-9 h-5 rounded-full transition-colors ${
                        billingConfig.invoiceSettings.autoGenerate ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                          billingConfig.invoiceSettings.autoGenerate ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingConfig(prev => ({
                        ...prev,
                        invoiceSettings: {
                          ...prev.invoiceSettings,
                          sendEmail: !prev.invoiceSettings.sendEmail,
                        },
                      }))}
                      className={`w-full flex items-center justify-between p-2 rounded-md border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                        billingConfig.invoiceSettings.sendEmail
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Send invoice via email</span>
                      <div className={`relative w-9 h-5 rounded-full transition-colors ${
                        billingConfig.invoiceSettings.sendEmail ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                          billingConfig.invoiceSettings.sendEmail ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </button>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Due Days</label>
                      <input
                        type="number"
                        value={billingConfig.invoiceSettings.dueDays}
                        onChange={(e) => setBillingConfig(prev => ({
                          ...prev,
                          invoiceSettings: {
                            ...prev.invoiceSettings,
                            dueDays: parseInt(e.target.value) || 30,
                          },
                        }))}
                        min="1"
                        max="90"
                        className="w-full px-2 py-1.5 text-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings - Compact */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bell className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(billingConfig.notifications).map(([key, enabled]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setBillingConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: !prev.notifications[key as keyof typeof prev.notifications],
                          },
                        }))}
                        className={`w-full flex items-center justify-between p-2 rounded-md border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                          enabled
                            ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                            : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className={`relative w-9 h-5 rounded-full transition-colors ${
                          enabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                            enabled ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with Save Button */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  onClick={handleSaveBillingConfig}
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-primary text-white rounded-md text-xs font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingPage;


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreditCard,
  Calendar,
  Globe,
  DollarSign,
  FileText,
  Mail,
  Settings,
  Save,
  Check,
  ChevronDown,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Receipt,
  Banknote,
  Wallet,
  Building2,
  Percent as PercentIcon,
  Bell,
} from 'lucide-react';
import { toast } from '../../utils/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

// Form validation schema
const billingConfigSchema = z.object({
  // Payment Methods
  paymentMethods: z.object({
    creditCard: z.boolean(),
    debitCard: z.boolean(),
    stripe: z.boolean(),
    bankTransfer: z.boolean(),
    paypal: z.boolean(),
  }),
  
  // Billing Cycle
  billingCycle: z.enum(['monthly', 'quarterly', 'yearly']),
  
  // Currency
  currency: z.string().min(1, 'Currency is required'),
  
  // Tax Settings
  taxEnabled: z.boolean(),
  taxRate: z.number().min(0).max(100).optional(),
  
  // Invoice Settings
  autoGenerateInvoice: z.boolean(),
  sendInvoiceEmail: z.boolean(),
  paymentDueDays: z.number().min(1).max(365),
});

type BillingConfigForm = z.infer<typeof billingConfigSchema>;

const BillingConfigurationPage = () => {
  const [saving, setSaving] = useState(false);
  const [taxRatePreset, setTaxRatePreset] = useState<string>('custom');
  const [paymentDueDaysPreset, setPaymentDueDaysPreset] = useState<string>('30');

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<BillingConfigForm>({
    resolver: zodResolver(billingConfigSchema),
    defaultValues: {
      paymentMethods: {
        creditCard: true,
        debitCard: true,
        stripe: true,
        bankTransfer: false,
        paypal: false,
      },
      billingCycle: 'monthly',
      currency: 'USD',
      taxEnabled: true,
      taxRate: 8.5,
      autoGenerateInvoice: true,
      sendInvoiceEmail: true,
      paymentDueDays: 30,
    },
  });

  const paymentMethods = watch('paymentMethods');
  const billingCycle = watch('billingCycle');
  const currency = watch('currency');
  const taxEnabled = watch('taxEnabled');
  const taxRate = watch('taxRate');
  const autoGenerateInvoice = watch('autoGenerateInvoice');
  const sendInvoiceEmail = watch('sendInvoiceEmail');
  const paymentDueDays = watch('paymentDueDays');

  // Tax rate preset options
  const taxRateOptions = [
    { value: '5', label: '5%' },
    { value: '8', label: '8%' },
    { value: '10', label: '10%' },
    { value: '15', label: '15%' },
    { value: 'custom', label: 'Custom' },
  ];

  // Payment due days preset options
  const paymentDueDaysOptions = [
    { value: '7', label: '7 days' },
    { value: '15', label: '15 days' },
    { value: '30', label: '30 days' },
    { value: '45', label: '45 days' },
    { value: '60', label: '60 days' },
  ];

  // Sync preset states with form values
  useEffect(() => {
    const taxRateStr = taxRate?.toString() || '8.5';
    const matchingPreset = taxRateOptions.find(opt => opt.value === taxRateStr);
    if (matchingPreset) {
      setTaxRatePreset(matchingPreset.value);
    } else {
      setTaxRatePreset('custom');
    }
  }, [taxRate]);

  useEffect(() => {
    const daysStr = paymentDueDays?.toString() || '30';
    const matchingPreset = paymentDueDaysOptions.find(opt => opt.value === daysStr);
    if (matchingPreset) {
      setPaymentDueDaysPreset(matchingPreset.value);
    }
  }, [paymentDueDays]);

  const onSubmit = async (_data: BillingConfigForm) => {
    try {
      setSaving(true);
      // TODO: Replace with actual API call
      // await api.post('/billing/configuration', _data);
      toast.success('Billing configuration saved successfully!');
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  // Modern Checkbox Component
  const ModernCheckbox = ({
    id,
    label,
    checked,
    onChange,
    icon: Icon,
    description,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: any;
    description?: string;
  }) => {
    return (
      <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        htmlFor={id}
        className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
          checked
            ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <motion.div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
              checked
                ? 'border-primary bg-primary'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
            animate={{
              scale: checked ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {Icon && (
              <Icon
                className={`w-5 h-5 ${
                  checked ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                } transition-colors`}
              />
            )}
            <span
              className={`font-semibold text-sm ${
                checked
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {label}
            </span>
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        )}
      </motion.label>
    );
  };

  // Modern Dropdown Component
  const ModernDropdown = ({
    label,
    value,
    options,
    onChange,
    icon: Icon,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string; icon?: any }[];
    onChange: (value: string) => void;
    icon?: any;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary dark:hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            {selectedOption?.icon && (
              <selectedOption.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedOption?.label || value}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {options.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        value === option.value
                          ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary'
                          : ''
                      }`}
                    >
                      {OptionIcon && (
                        <OptionIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          value === option.value
                            ? 'text-primary'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {option.label}
                      </span>
                      {value === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const billingCycleOptions = [
    { value: 'monthly', label: 'Monthly', icon: Calendar },
    { value: 'quarterly', label: 'Quarterly', icon: TrendingUp },
    { value: 'yearly', label: 'Yearly', icon: Shield },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)', icon: DollarSign },
    { value: 'EUR', label: 'EUR (€)', icon: Euro },
    { value: 'GBP', label: 'GBP (£)', icon: PoundSterling },
    { value: 'JPY', label: 'JPY (¥)', icon: Yen },
  ];

  return (
    <div className="py-6 pr-6 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Billing Configuration
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage payment methods, billing cycles, and invoice settings
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configuration
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-l-4 border-primary rounded-r-lg flex items-start gap-3"
      >
        <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Configure your billing preferences to streamline payment processing and invoice
          management. Changes take effect immediately for new transactions.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Payment Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Payment Methods
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Select payment methods available for your customers
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernCheckbox
              id="creditCard"
              label="Credit Card"
              checked={paymentMethods.creditCard}
              onChange={(checked) =>
                setValue('paymentMethods.creditCard', checked, { shouldDirty: true })
              }
              icon={CreditCard}
              description="Accept credit card payments"
            />
            <ModernCheckbox
              id="debitCard"
              label="Debit Card"
              checked={paymentMethods.debitCard}
              onChange={(checked) =>
                setValue('paymentMethods.debitCard', checked, { shouldDirty: true })
              }
              icon={Banknote}
              description="Accept debit card payments"
            />
            <ModernCheckbox
              id="stripe"
              label="Stripe"
              checked={paymentMethods.stripe}
              onChange={(checked) =>
                setValue('paymentMethods.stripe', checked, { shouldDirty: true })
              }
              icon={Zap}
              description="Stripe payment gateway"
            />
            <ModernCheckbox
              id="bankTransfer"
              label="Bank Transfer"
              checked={paymentMethods.bankTransfer}
              onChange={(checked) =>
                setValue('paymentMethods.bankTransfer', checked, { shouldDirty: true })
              }
              icon={Building2}
              description="Direct bank transfers"
            />
            <ModernCheckbox
              id="paypal"
              label="PayPal"
              checked={paymentMethods.paypal}
              onChange={(checked) =>
                setValue('paymentMethods.paypal', checked, { shouldDirty: true })
              }
              icon={Wallet}
              description="PayPal payments"
            />
          </div>
        </motion.div>

        {/* Default Billing Cycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Default Billing Cycle
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Set the default billing frequency for your business
              </p>
            </div>
          </div>
          <ModernDropdown
            label="Select billing cycle"
            value={billingCycle}
            options={billingCycleOptions}
            onChange={(value) => setValue('billingCycle', value as any, { shouldDirty: true })}
            icon={Calendar}
          />
        </motion.div>

        {/* Currency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Currency</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Choose your primary currency for transactions
              </p>
            </div>
          </div>
          <ModernDropdown
            label="Select currency"
            value={currency}
            options={currencyOptions}
            onChange={(value) => setValue('currency', value, { shouldDirty: true })}
            icon={Globe}
          />
        </motion.div>

        {/* Tax Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Tax Settings</CardTitle>
                  <CardDescription>
                    Configure tax calculation for your transactions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="taxEnabled" className="text-base font-semibold cursor-pointer">
                    Enable Tax
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Apply tax to all transactions
                  </p>
                </div>
                <Switch
                  id="taxEnabled"
                  checked={taxEnabled}
                  onCheckedChange={(checked) => setValue('taxEnabled', checked, { shouldDirty: true })}
                />
              </div>
              <AnimatePresence>
                {taxEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-semibold">
                      Tax Rate (%)
                    </Label>
                    <RadioGroup
                      value={taxRatePreset}
                      onValueChange={(value) => {
                        setTaxRatePreset(value);
                        if (value !== 'custom') {
                          setValue('taxRate', parseFloat(value), { shouldDirty: true });
                        }
                      }}
                      className="flex flex-wrap gap-4"
                    >
                      {taxRateOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`tax-${option.value}`} />
                          <Label
                            htmlFor={`tax-${option.value}`}
                            className="text-sm font-normal cursor-pointer text-gray-700 dark:text-gray-300"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {taxRatePreset === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2"
                      >
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg flex items-center justify-center z-10">
                            <PercentIcon className="w-5 h-5 text-primary" />
                          </div>
                          <Input
                            id="taxRate"
                            type="number"
                            value={taxRate || 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setValue('taxRate', val, { shouldDirty: true });
                            }}
                            min={0}
                            max={100}
                            step={0.1}
                            className="pl-16 pr-12"
                            placeholder="Enter custom rate"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            %
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoice Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>
                    Manage invoice generation and delivery preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Receipt className="w-5 h-5 text-primary" />
                    <Label htmlFor="autoGenerateInvoice" className="text-base font-semibold cursor-pointer">
                      Auto-generate invoices
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically create invoices for completed orders
                  </p>
                </div>
                <Switch
                  id="autoGenerateInvoice"
                  checked={autoGenerateInvoice}
                  onCheckedChange={(checked) =>
                    setValue('autoGenerateInvoice', checked, { shouldDirty: true })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-5 h-5 text-primary" />
                    <Label htmlFor="sendInvoiceEmail" className="text-base font-semibold cursor-pointer">
                      Send invoice via email
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email invoices to customers automatically
                  </p>
                </div>
                <Switch
                  id="sendInvoiceEmail"
                  checked={sendInvoiceEmail}
                  onCheckedChange={(checked) =>
                    setValue('sendInvoiceEmail', checked, { shouldDirty: true })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Payment Due Days
                </Label>
                <RadioGroup
                  value={paymentDueDaysPreset}
                  onValueChange={(value) => {
                    setPaymentDueDaysPreset(value);
                    setValue('paymentDueDays', parseInt(value), { shouldDirty: true });
                  }}
                  className="flex flex-wrap gap-4"
                >
                  {paymentDueDaysOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`days-${option.value}`} />
                      <Label
                        htmlFor={`days-${option.value}`}
                        className="text-sm font-normal cursor-pointer text-gray-700 dark:text-gray-300"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure email notifications for billing events
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-5 h-5 text-primary" />
                    <Label htmlFor="sendInvoiceEmailNotification" className="text-base font-semibold cursor-pointer">
                      Invoice email notifications
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications when invoices are sent
                  </p>
                </div>
                <Switch
                  id="sendInvoiceEmailNotification"
                  checked={sendInvoiceEmail}
                  onCheckedChange={(checked) =>
                    setValue('sendInvoiceEmail', checked, { shouldDirty: true })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 text-primary" />
                    <Label htmlFor="paymentReminderNotification" className="text-base font-semibold cursor-pointer">
                      Payment reminder notifications
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when payments are due soon
                  </p>
                </div>
                <Switch
                  id="paymentReminderNotification"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-5 h-5 text-primary" />
                    <Label htmlFor="paymentReceivedNotification" className="text-base font-semibold cursor-pointer">
                      Payment received notifications
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive alerts when payments are successfully processed
                  </p>
                </div>
                <Switch
                  id="paymentReceivedNotification"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 -mx-6 -mb-6 mt-8 shadow-lg rounded-t-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {isDirty && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-orange-500 rounded-full"
                />
              )}
              <span>{isDirty ? 'You have unsaved changes' : 'All changes saved'}</span>
            </div>
            <motion.button
              type="submit"
              disabled={saving || !isDirty}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

// Currency icon components
const Euro = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15 18.5A6.48 6.48 0 0 1 9.24 15H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24A6.491 6.491 0 0 1 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3A8.955 8.955 0 0 0 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06a8.262 8.262 0 0 0 0 2H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z" />
  </svg>
);

const PoundSterling = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14 21c-1.1 0-2-.9-2-2H6c-1.1 0-2-.9-2-2v-1h10v-1H6V9c0-2.21 1.79-4 4-4h2V3h2v2h2v2h-2v2h-2v2h4v2H6v1h8c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2z" />
  </svg>
);

const Yen = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.5 3h9l-3 6h3l-5 10v-6h-2v6l-5-10h3l-3-6z" />
  </svg>
);

export default BillingConfigurationPage;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  User, 
  Lock, 
  Mail,
  Smartphone,
  Moon,
  Sun,
  Eye,
  EyeOff,
  ChevronRight,
  Check,
  AlertCircle,
  X
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  
  const [settings, setSettings] = useState({
    // General
    language: 'English',
    timezone: 'UTC+0',
    dateFormat: 'MM/DD/YYYY',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    orderNotifications: true,
    marketingEmails: false,
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30 minutes',
    
    // Appearance
    sidebarCollapsed: false,
    compactMode: false,
  });

  useEffect(() => {
    // Initialize theme on mount
    const root = document.documentElement;
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.remove('light', 'dark');
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingsSections = [
    {
      id: 'general',
      title: 'General',
      icon: Settings,
      description: 'Basic application settings',
      items: [
        {
          type: 'select',
          label: 'Language',
          value: settings.language,
          options: ['English', 'Spanish', 'French', 'German', 'Italian'],
          onChange: (val: string) => handleSelectChange('language', val),
        },
        {
          type: 'select',
          label: 'Timezone',
          value: settings.timezone,
          options: ['UTC+0', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+5', 'UTC+8'],
          onChange: (val: string) => handleSelectChange('timezone', val),
        },
        {
          type: 'select',
          label: 'Date Format',
          value: settings.dateFormat,
          options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
          onChange: (val: string) => handleSelectChange('dateFormat', val),
        },
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage how you receive updates',
      items: [
        {
          type: 'toggle',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          value: settings.emailNotifications,
          onChange: () => handleToggle('emailNotifications'),
        },
        {
          type: 'toggle',
          label: 'Push Notifications',
          description: 'Receive browser push notifications',
          value: settings.pushNotifications,
          onChange: () => handleToggle('pushNotifications'),
        },
        {
          type: 'toggle',
          label: 'SMS Notifications',
          description: 'Receive notifications via SMS',
          value: settings.smsNotifications,
          onChange: () => handleToggle('smsNotifications'),
        },
        {
          type: 'toggle',
          label: 'Order Notifications',
          description: 'Get notified about new orders',
          value: settings.orderNotifications,
          onChange: () => handleToggle('orderNotifications'),
        },
        {
          type: 'toggle',
          label: 'Marketing Emails',
          description: 'Receive promotional emails and updates',
          value: settings.marketingEmails,
          onChange: () => handleToggle('marketingEmails'),
        },
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Protect your account',
      items: [
        {
          type: 'toggle',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          value: settings.twoFactorAuth,
          onChange: () => handleToggle('twoFactorAuth'),
        },
        {
          type: 'toggle',
          label: 'Login Alerts',
          description: 'Get notified of new login attempts',
          value: settings.loginAlerts,
          onChange: () => handleToggle('loginAlerts'),
        },
        {
          type: 'select',
          label: 'Session Timeout',
          value: settings.sessionTimeout,
          options: ['15 minutes', '30 minutes', '1 hour', '2 hours', 'Never'],
          onChange: (val: string) => handleSelectChange('sessionTimeout', val),
        },
        {
          type: 'button',
          label: 'Change Password',
          description: 'Update your account password',
          onClick: () => setShowPasswordChange(!showPasswordChange),
        },
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel',
      items: [
        {
          type: 'radio',
          label: 'Theme',
          value: theme,
          options: [
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'auto', label: 'Auto', icon: Eye },
          ],
          onChange: (val: string) => setTheme(val as 'light' | 'dark' | 'auto'),
        },
        {
          type: 'toggle',
          label: 'Compact Mode',
          description: 'Reduce spacing for a denser layout',
          value: settings.compactMode,
          onChange: () => handleToggle('compactMode'),
        },
      ]
    },
  ];

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-gray-300'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SelectDropdown = ({ 
    value, 
    options, 
    onChange 
  }: { 
    value: string; 
    options: string[]; 
    onChange: (val: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          <span>{value}</span>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto transition-colors"
              >
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 ease-in-out flex items-center justify-between ${
                      value === option ? 'bg-primary/5 dark:bg-primary/20 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{option}</span>
                    {value === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-4 h-4 text-primary" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ThemeButton = ({ 
    option, 
    isSelected, 
    onClick 
  }: { 
    option: { value: string; label: string; icon: any }; 
    isSelected: boolean; 
    onClick: () => void;
  }) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const Icon = option.icon;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
      
      // Call onClick after a small delay for better UX
      setTimeout(() => {
        onClick();
      }, 50);
    };

    return (
      <button
        onClick={handleClick}
              className={`relative flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 overflow-hidden transition-all duration-300 ease-in-out ${
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/20 shadow-md scale-105'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
              }`}
      >
        {/* Water Ripple Effect */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full bg-primary/40"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.8,
              x: 0,
              y: 0,
            }}
            animate={{
              width: 200,
              height: 200,
              opacity: 0,
              x: -100,
              y: -100,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          />
        ))}
        
        <motion.div
          className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
            isSelected ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          }`}
          animate={{
            scale: isSelected ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <motion.span
          className={`text-sm font-medium transition-colors duration-300 ${
            isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
          }`}
          animate={{
            scale: isSelected ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {option.label}
        </motion.span>
      </button>
    );
  };

  const RadioGroup = ({ 
    value, 
    options, 
    onChange 
  }: { 
    value: string; 
    options: Array<{ value: string; label: string; icon: any }>; 
    onChange: (val: string) => void;
  }) => {
    return (
      <div className="flex gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <ThemeButton
              key={option.value}
              option={option}
              isSelected={isSelected}
              onClick={() => onChange(option.value)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-6 pr-6 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </motion.div>

      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-300"
            >
              {/* Section Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-6 space-y-6">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`pb-6 ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {item.label}
                        </label>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        {item.type === 'toggle' && (
                          <ToggleSwitch 
                            enabled={item.value as boolean} 
                            onChange={item.onChange}
                          />
                        )}
                        {item.type === 'select' && (
                          <SelectDropdown
                            value={item.value as string}
                            options={item.options || []}
                            onChange={item.onChange}
                          />
                        )}
                        {item.type === 'radio' && (
                          <RadioGroup
                            value={item.value as string}
                            options={item.options || []}
                            onChange={item.onChange}
                          />
                        )}
                        {item.type === 'button' && (
                          <button
                            onClick={item.onClick}
                            className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            {item.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Password Change Modal */}
        {showPasswordChange && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transition-colors duration-300"
        >
          <div className="px-6 py-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change Password</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle password change logic here
                    setShowPasswordChange(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

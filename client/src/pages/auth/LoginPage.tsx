import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import { toast } from '../../utils/toast';
import { Sparkles, Mail, Lock, LogIn, Eye, EyeOff, User, Shield, Store, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const funFacts = [
  "Did you know? The average restaurant uses 2,000+ ingredients across their menu!",
  "Fun fact: QR code menus reduce contact by 100% compared to physical menus.",
  "Interesting: Restaurants that use digital menus see 30% faster table turnover.",
  "Did you know? Multi-cuisine restaurants serve an average of 5 different culinary traditions!",
  "Fun fact: Smart ordering systems can reduce order errors by up to 90%.",
];

// Image transition configuration
const IMAGE_TRANSITION_DURATION = 0.5; // Transition duration in seconds (quick and formal)

// Aesthetic restaurant images for login screen
const loginImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
];

const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Randomly select an image on page load
  const [currentImageIndex, setCurrentImageIndex] = useState(() => 
    Math.floor(Math.random() * loginImages.length)
  );
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [funFact] = useState(funFacts[Math.floor(Math.random() * funFacts.length)]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  
  const isEmailFloating = emailValue || focusedField === 'email' || errors.email;
  const isPasswordFloating = passwordValue || focusedField === 'password' || errors.password;

  const handleQuickFill = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setFocusedField(null);
    setError('');
  };

  const quickFillOptions = [
    {
      label: 'Super Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      label: 'Restaurant Owner',
      email: 'owner@italianbistro.com',
      password: 'owner123',
      icon: Store,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      label: 'Normal User',
      email: 'customer@example.com',
      password: 'customer123',
      icon: User,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
  ];

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/login', data);
      setAuth(response.data.user, response.data.token);
      toast.success('Login successful! Welcome back.');
      
      // Small delay to ensure state is set before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'owner') {
        navigate('/owner');
      } else if (response.data.user.role === 'customer') {
        // Customer can access menu pages or be redirected to menu selection
        navigate('/menu/rest-1?table=1');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Left Side - 70% - Image Section */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: IMAGE_TRANSITION_DURATION, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${loginImages[currentImageIndex]}')`,
            }}
          />
        </AnimatePresence>
        {/* Black Vignette Overlay - Reduced intensity */}
        <div className="absolute inset-0 vignette z-10 opacity-50"></div>
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        
        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {loginImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'w-8 bg-white shadow-lg'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Side - 30% - Login Form */}
      <div className="w-full lg:w-[30%] flex flex-col justify-center items-center bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-8 min-h-screen">
        <div className="max-w-sm w-full">
          {/* Mobile Logo/Header */}
          <div className="lg:hidden mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              DineFlow AI
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Smart Dining. Simplified.
            </p>
          </div>

          {/* Desktop Logo/Header */}
          <div className="hidden lg:block mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">DF</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  DineFlow <span className="text-primary">AI</span>
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Smart Dining. Simplified.
                </p>
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue to your account
            </p>
          </div>

          {/* Fun Fact */}
          <div className="mb-5 p-3 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary rounded-r-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{funFact}</p>
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            {/* Floating Email Input */}
            <div className="relative">
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20">
                  <Mail className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    emailValue || errors.email || focusedField === 'email'
                      ? 'text-primary' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className={`w-full pl-9 pr-3 pt-3.5 pb-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.email
                      ? 'border-red-300 dark:border-red-500 focus:border-red-500'
                      : emailValue || focusedField === 'email'
                      ? 'border-primary focus:border-primary'
                      : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                  } bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
                <label
                  className={`absolute pointer-events-none transition-all duration-200 z-10 ${
                    isEmailFloating
                      ? 'top-0 left-8 -translate-y-1/2 text-[10px] text-primary font-semibold bg-white dark:bg-gray-800 px-1.5'
                      : 'top-1/2 left-9 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Email Address
                </label>
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Floating Password Input */}
            <div className="relative">
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20">
                  <Lock className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    passwordValue || errors.password || focusedField === 'password'
                      ? 'text-primary' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className={`w-full pl-9 pr-9 pt-3.5 pb-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.password
                      ? 'border-red-300 dark:border-red-500 focus:border-red-500'
                      : passwordValue || focusedField === 'password'
                      ? 'border-primary focus:border-primary'
                      : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                  } bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100`}
                />
                <label
                  className={`absolute pointer-events-none transition-all duration-200 z-10 ${
                    isPasswordFloating
                      ? 'top-0 left-8 -translate-y-1/2 text-[10px] text-primary font-semibold bg-white dark:bg-gray-800 px-1.5'
                      : 'top-1/2 left-9 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                to="/reset-password"
                className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Quick Fill Buttons */}
          <div className="mt-6">
            <div className="mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">
                Quick Fill Credentials
              </p>
              <div className="flex flex-col gap-2">
                {quickFillOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleQuickFill(option.email, option.password)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${option.borderColor} ${option.bgColor} ${option.textColor} hover:shadow-md transition-all duration-200 text-xs font-medium group`}
                    >
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-[10px] opacity-75">{option.email}</div>
                      </div>
                      <Zap className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Need help? Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;




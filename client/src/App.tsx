import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import CustomerMenuPage from './pages/customer/CustomerMenuPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import PaymentPage from './pages/customer/PaymentPage';
import QRScanPage from './pages/customer/QRScanPage';
import PublicProfileViewPage from './pages/public/PublicProfileViewPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Wait for Zustand to hydrate
    if (_hasHydrated) {
      setIsInitializing(false);
      return;
    }
    
    // Fallback: check localStorage directly and wait for hydration
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      // If we have auth data in localStorage, wait a bit for hydration
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // No auth data, safe to proceed
      setIsInitializing(false);
    }
  }, [_hasHydrated]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
            minWidth: '300px',
            maxWidth: '500px',
          },
          // Success toast
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #d1fae5',
            },
          },
          // Error toast
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #fee2e2',
            },
          },
          // Loading toast
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },
          // Default icon styling
          icon: {
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      />
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to={user?.role === 'admin' ? '/admin' : '/owner'} /> : <LoginPage />} 
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/scan" element={<QRScanPage />} />
        <Route path="/qr/:code?" element={<QRScanPage />} />
        <Route path="/menu/:restaurantId" element={<CustomerMenuPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/public/profile/:userId" element={<PublicProfileViewPage />} />
        <Route 
          path="/" 
          element={
            isAuthenticated() 
              ? <Navigate to={user?.role === 'admin' ? '/admin' : '/owner'} replace />
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




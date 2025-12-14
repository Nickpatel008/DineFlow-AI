  import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Camera, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import QRScanner from '../../components/customer/QRScanner';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

const QRScanPage = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [validating, setValidating] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleScanSuccess = async (decodedText: string) => {
    setValidating(true);
    try {
      const response = await api.post('/tables/validate-qr', { qrData: decodedText });
      const { restaurantId, tableNumber, restaurant } = response.data;

      toast.success(`Welcome to ${restaurant.name}!`);
      
      // Navigate to menu page
      const url = `/menu/${restaurantId}${tableNumber ? `?table=${tableNumber}` : ''}`;
      navigate(url);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid QR code. Please try again.';
      toast.error(errorMessage);
      setShowScanner(true); // Keep scanner open to try again
    } finally {
      setValidating(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }

    setValidating(true);
    try {
      const response = await api.post('/tables/validate-qr', { qrData: qrCode.trim() });
      const { restaurantId, tableNumber, restaurant } = response.data;

      toast.success(`Welcome to ${restaurant.name}!`);
      
      const url = `/menu/${restaurantId}${tableNumber ? `?table=${tableNumber}` : ''}`;
      navigate(url);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid QR code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!showScanner && !manualInput ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            {/* Logo/Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-lg">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
                DineFlow <span className="text-primary">AI</span>
              </h1>
              <p className="text-gray-600">Scan the QR code on your table to view the menu</p>
            </div>

            {/* Action Buttons */}
            <div className="card p-6 space-y-4">
              <button
                onClick={() => setShowScanner(true)}
                className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
              >
                <Camera className="w-6 h-6" />
                Scan QR Code
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => setManualInput(true)}
                className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-lg"
              >
                <QrCode className="w-6 h-6" />
                Enter QR Code Manually
              </button>
            </div>

            {/* Info */}
            <div className="card bg-blue-50 border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900 mb-1">How it works</p>
                  <p className="text-xs text-blue-800">
                    Find the QR code on your table, scan it with your camera, and instantly access the digital menu.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : showScanner ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {validating ? (
              <div className="card p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Validating QR code...</p>
              </div>
            ) : (
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onError={(error) => {
                  console.error('Scanner error:', error);
                }}
                onClose={() => setShowScanner(false)}
              />
            )}

            <button
              onClick={() => setShowScanner(false)}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6 space-y-4"
          >
            <div>
              <h2 className="text-2xl font-heading font-bold text-secondary mb-2">
                Enter QR Code
              </h2>
              <p className="text-sm text-gray-600">
                Enter the QR code URL or data from your table
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Data
                </label>
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="e.g., /menu/rest-1?table=1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={validating}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setManualInput(false);
                    setQrCode('');
                  }}
                  className="flex-1 btn-secondary"
                  disabled={validating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  disabled={validating || !qrCode.trim()}
                >
                  {validating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QRScanPage;


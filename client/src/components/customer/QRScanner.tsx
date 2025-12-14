import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

const QRScanner = ({ onScanSuccess, onError, onClose }: QRScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'idle' | 'granted' | 'denied'>('idle');

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors (they're frequent during scanning)
        }
      );

      setScanning(true);
      setCameraPermission('granted');
      setError(null);
    } catch (err: any) {
      console.error('QR Scanner error:', err);
      setScanning(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermission('denied');
        setError('Camera permission denied. Please allow camera access to scan QR codes.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please use a device with a camera.');
      } else {
        setError('Failed to start camera. Please try again.');
      }
      
      if (onError) {
        onError(err.message || 'Failed to start QR scanner');
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
          setScanning(false);
        })
        .catch((err) => {
          console.error('Error stopping scanner:', err);
        });
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    stopScanning();
    onScanSuccess(decodedText);
  };

  const handleClose = () => {
    stopScanning();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-secondary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5" />
            <h3 className="font-bold text-lg">Scan QR Code</h3>
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scanner Area */}
        <div className="relative bg-black">
          <div id="qr-reader" className="w-full" style={{ minHeight: '300px' }}></div>
          
          {/* Overlay Instructions */}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-primary rounded-lg w-64 h-64 flex items-center justify-center">
                <div className="text-white text-center px-4">
                  <p className="text-sm font-medium mb-2">Position QR code</p>
                  <p className="text-xs text-gray-300">within the frame</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-t border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                {cameraPermission === 'denied' && (
                  <p className="text-xs text-red-600 mt-1">
                    Please enable camera permissions in your browser settings and refresh the page.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!error && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Point your camera at the QR code on the table
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;


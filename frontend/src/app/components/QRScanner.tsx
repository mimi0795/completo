import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStoppingRef = useRef(false);

  const stopScanning = async () => {
    if (scannerRef.current && !isStoppingRef.current) {
      try {
        isStoppingRef.current = true;
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      } finally {
        isStoppingRef.current = false;
      }
    }

    setIsScanning(false);
  };

  const startScanning = async () => {
    if (scannerRef.current) {
      return;
    }

    try {
      setError(null);
      setScanResult(null);
      setIsScanning(true);

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScanResult(decodedText);
          onScanSuccess(decodedText);
          void stopScanning();
        },
        () => {
          // Ignore scan misses while the camera is active.
        }
      );
    } catch (err) {
      scannerRef.current = null;
      setIsScanning(false);
      setError('Erro ao acessar a camera. Verifique as permissoes.');
      console.error('Error starting scanner:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        void stopScanning();
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 border border-zinc-200 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-6 h-6 text-indigo-600" />
        <h2 className="text-zinc-900">Scanner de QR Code</h2>
      </div>

      <div className="space-y-4">
        {!isScanning && !scanResult && (
          <button
            onClick={startScanning}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            type="button"
          >
            <QrCode className="w-5 h-5" />
            Iniciar Scanner
          </button>
        )}

        <div
          id="qr-reader"
          className={`w-full rounded-lg overflow-hidden border-2 border-indigo-600 ${
            isScanning ? 'block' : 'hidden'
          }`}
        />

        {isScanning && (
          <button
            onClick={stopScanning}
            className="w-full bg-zinc-600 text-white py-3 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
            type="button"
          >
            Parar Scanner
          </button>
        )}

        {scanResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-900 font-medium mb-1">
                QR Code lido com sucesso!
              </p>
              <p className="text-green-700 text-sm">
                Codigo: {scanResult}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!isScanning && !scanResult && (
          <div className="text-center py-8 text-zinc-500">
            <QrCode className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p>Clique no botao acima para escanear o QR Code da empresa</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Swords, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

// RPG-themed Alert Component
const RPGAlert = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-8 h-8" />,
    error: <AlertTriangle className="w-8 h-8" />,
    warning: <AlertTriangle className="w-8 h-8" />,
    info: <Info className="w-8 h-8" />
  };

  const colors = {
    success: 'from-green-600 to-emerald-600',
    error: 'from-red-600 to-red-800',
    warning: 'from-yellow-600 to-orange-600',
    info: 'from-blue-600 to-indigo-600'
  };

  const borderColors = {
    success: 'border-green-700',
    error: 'border-red-700',
    warning: 'border-yellow-700',
    info: 'border-blue-700'
  };

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`bg-gradient-to-r ${colors[type]} border-4 ${borderColors[type]} p-6 min-w-[400px] max-w-[600px] shadow-2xl rounded-2xl`}>
        <div className="flex items-center gap-4 text-white">
          <div className="flex-shrink-0 animate-pulse">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white drop-shadow-lg" style={{ fontFamily: 'MedievalSharp, cursive' }}>
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 hover:scale-110 transition-transform text-white hover:text-yellow-200"
          >
            <X className="w-6 h-6 drop-shadow-lg" />
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <Swords className="w-5 h-5 text-white/80 drop-shadow" />
          <Swords className="w-5 h-5 text-white/80 drop-shadow" />
          <Swords className="w-5 h-5 text-white/80 drop-shadow" />
        </div>
      </div>
    </div>
  );
};

// Confirmation Dialog Component
const RPGConfirm = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-600 rounded-2xl p-8 max-w-md shadow-2xl transform scale-100 animate-pulse">
        <div className="text-center mb-6">
          <AlertTriangle className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-bounce" />
          <p className="text-xl font-bold text-amber-900" style={{ fontFamily: 'MedievalSharp, cursive' }}>
            {message}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl border-3 border-green-700 hover:scale-105 transition-transform shadow-lg"
            style={{ fontFamily: 'MedievalSharp, cursive' }}
          >
            ⚔️ Yes
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl border-3 border-red-700 hover:scale-105 transition-transform shadow-lg"
            style={{ fontFamily: 'MedievalSharp, cursive' }}
          >
            🛡️ No
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <Swords className="w-5 h-5 text-amber-700" />
          <Swords className="w-5 h-5 text-amber-700" />
        </div>
      </div>
    </div>
  );
};

// Alert Manager
let showAlertCallback = null;
let showConfirmCallback = null;

export const setAlertManager = (callback) => {
  showAlertCallback = callback;
};

export const setConfirmManager = (callback) => {
  showConfirmCallback = callback;
};

export const showRPGAlert = (message, type = 'info', onConfirm = null) => {
  // If onConfirm is provided, show confirmation dialog
  if (onConfirm && showConfirmCallback) {
    showConfirmCallback(message, onConfirm);
  } else if (showAlertCallback) {
    showAlertCallback(message, type);
  } else {
    // Fallback to normal alert
    alert(message);
  }
};

// Alert Container Component
export const RPGAlertContainer = () => {
  const [alerts, setAlerts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    setAlertManager((message, type) => {
      const id = Date.now();
      setAlerts(prev => [...prev, { id, message, type }]);
    });

    setConfirmManager((message, onConfirm) => {
      setConfirm({ message, onConfirm });
    });
  }, []);

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleConfirm = () => {
    if (confirm?.onConfirm) {
      confirm.onConfirm();
    }
    setConfirm(null);
  };

  const handleCancel = () => {
    setConfirm(null);
  };

  return (
    <>
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          style={{ top: `${6 + index * 5}rem` }}
          className="fixed left-1/2 transform -translate-x-1/2 z-50"
        >
          <RPGAlert
            message={alert.message}
            type={alert.type}
            onClose={() => removeAlert(alert.id)}
          />
        </div>
      ))}
      {confirm && (
        <RPGConfirm
          message={confirm.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default RPGAlert;

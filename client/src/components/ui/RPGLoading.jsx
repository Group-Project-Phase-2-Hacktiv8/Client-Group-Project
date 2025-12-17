import { Swords, Shield, Flame } from 'lucide-react';

// RPG-themed Loading Component
const RPGLoading = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-8'}`}>
      <div className="relative">
        {/* Rotating Swords */}
        <div className="relative w-32 h-32 animate-spin">
          <Swords className="w-32 h-32 text-amber-600 absolute inset-0" />
        </div>
        
        {/* Center Shield */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-16 h-16 text-amber-800 animate-pulse" />
        </div>

        {/* Flame effects */}
        <Flame className="w-8 h-8 text-orange-500 absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce" />
        <Flame className="w-8 h-8 text-orange-500 absolute -bottom-2 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>

      <div className="mt-8 text-center">
        <p className="text-2xl font-bold text-amber-900 rpg-title animate-pulse">
          {message}
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <span className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>

      {/* Decorative swords */}
      <div className="flex gap-3 mt-6">
        <Swords className="w-6 h-6 text-amber-700 animate-pulse" />
        <Swords className="w-6 h-6 text-amber-700 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <Swords className="w-6 h-6 text-amber-700 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 z-[9999] flex items-center justify-center">
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        {content}
      </div>
    );
  }

  return content;
};

// Small inline loading spinner
export const RPGSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Swords className={`${sizes[size]} text-amber-600 animate-spin`} />
    </div>
  );
};

export default RPGLoading;

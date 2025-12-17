import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import soundManager from '../../utils/soundManager';

const SoundControl = () => {
  const [isMuted, setIsMuted] = useState(false);

  // Load mute state on mount
  useEffect(() => {
    const mutedState = soundManager.getMuteState();
    setIsMuted(mutedState);
  }, []);

  const toggleSound = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
    // Play click sound only if unmuting
    if (!newMutedState) {
      setTimeout(() => soundManager.playSound('BUTTON_CLICK'), 100);
    }
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed top-4 right-4 z-50 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 border-3 border-amber-800"
      title={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6" />
      ) : (
        <Volume2 className="w-6 h-6" />
      )}
    </button>
  );
};

export default SoundControl;

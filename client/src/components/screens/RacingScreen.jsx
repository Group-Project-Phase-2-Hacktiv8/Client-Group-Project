import RaceTrack from "../race/RaceTrack";
import TypingArea from "../race/TypingArea";
import { Swords, Flame } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import RPGLoading from "../ui/RPGLoading";
import { showRPGAlert } from "../ui/RPGAlert";
import soundManager, { MUSIC } from "../../utils/soundManager";

const RacingScreen = () => {
  const { gameText, roomCode } = useGame();
  const navigate = useNavigate();

  // Start racing music
  useEffect(() => {
    soundManager.initBackgroundMusic(MUSIC.RACING);
    soundManager.playBackgroundMusic();
    
    return () => {
      soundManager.stopBackgroundMusic();
    };
  }, []);

  // Redirect to lobby if no game state after refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameText && !roomCode) {
        console.log('⚠️ No game text in RacingScreen, redirecting...');
        // Silent redirect, GameContext already handled it
        navigate('/lobby', { replace: true });
      }
    }, 1000); // Longer delay to let GameContext redirect first
    
    return () => clearTimeout(timer);
  }, [gameText, roomCode, navigate]);

  // Show loading if game text is not yet loaded
  if (!gameText) {
    return (
      <div className="min-h-screen rpg-background castle-bg">
        <RPGLoading message="⚔️ Preparing Battle Arena..." fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen rpg-background castle-bg p-4 py-8 relative overflow-hidden">
      {/* Epic particles */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 rpg-card p-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
            <Swords className="w-16 h-16 text-amber-700" />
            <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold rpg-title text-amber-900 mb-2">
            ⚔️ BATTLE ARENA ⚔️
          </h1>
          <div className="sword-divider"></div>
          <p className="text-amber-800 rpg-text text-xl">Type Swift, Strike True!</p>
        </div>

        <RaceTrack />
        <TypingArea />
      </div>
    </div>
  );
};

export default RacingScreen;

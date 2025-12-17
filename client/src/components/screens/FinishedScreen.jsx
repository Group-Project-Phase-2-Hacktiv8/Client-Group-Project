import { useNavigate } from "react-router";
import { Trophy, Crown, Sparkles, Skull, Frown } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { useEffect } from "react";
import soundManager, { MUSIC } from "../../utils/soundManager";
import { showRPGAlert } from "../ui/RPGAlert";

const FinishedScreen = () => {
  const {
    winner,
    progress,
    players,
    roomCode,
    username,
    setCurrentWordIndex,
    setTypedText,
    setProgress,
    setWinner,
  } = useGame();
  const navigate = useNavigate();

  // Redirect to lobby if no game state after refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!winner && !roomCode) {
        console.log('⚠️ No winner in FinishedScreen, redirecting...');
        // Silent redirect, GameContext already handled it
        navigate('/lobby', { replace: true });
      }
    }, 1000); // Longer delay to let GameContext redirect first
    
    return () => clearTimeout(timer);
  }, [winner, roomCode, navigate]);

  const isWinner = winner === username;

  useEffect(() => {
    if (winner) {
      soundManager.stopBackgroundMusic();
      
      if (isWinner) {
        // User won - play victory
        soundManager.initBackgroundMusic(MUSIC.VICTORY);
        soundManager.playBackgroundMusic();
        soundManager.playSound('VICTORY');
      } else {
        // User lost - play defeat
        soundManager.playSound('DEFEAT');
      }
    }
    
    return () => {
      soundManager.stopBackgroundMusic();
    };
  }, [winner, isWinner]);

  const sortedPlayers = [...players].sort((a, b) => {
    const aProgress = progress[a.name] || 0;
    const bProgress = progress[b.name] || 0;
    return bProgress - aProgress;
  });

  const playAgain = () => {
    soundManager.playSound('BUTTON_CLICK');
    soundManager.stopBackgroundMusic();
    setCurrentWordIndex(0);
    setTypedText("");
    setProgress({});
    setWinner(null);
    navigate("/waiting");
  };

  return (
    <div className="min-h-screen rpg-background castle-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particles */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              width: '6px',
              height: '6px',
              background: isWinner 
                ? ['#ffd700', '#ffed4e', '#ffa500'][Math.floor(Math.random() * 3)]
                : ['#666', '#888', '#555'][Math.floor(Math.random() * 3)]
            }}
          />
        ))}
      </div>

      <div className="rpg-card p-8 md:p-12 max-w-3xl w-full relative z-10">
        {isWinner ? (
          // VICTORY SCREEN
          <div className="text-center mb-8">
            <div className="inline-block p-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce shadow-2xl glow border-4 border-amber-600">
              <Crown className="w-20 h-20 text-white sparkle" />
            </div>
            <h1 className="text-6xl font-bold rpg-title text-amber-900 mb-4">
              ⚔️ VICTORY! ⚔️
            </h1>
            <div className="sword-divider"></div>
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-6 border-4 border-amber-600 mt-6">
              <p className="text-2xl rpg-text text-amber-800 mb-2">
                You are the Champion!
              </p>
              <p className="text-3xl font-bold rpg-title text-amber-900">
                👑 Glorious Victory! 👑
              </p>
            </div>
          </div>
        ) : (
          // DEFEAT SCREEN
          <div className="text-center mb-8">
            <div className="inline-block p-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mb-6 shadow-2xl border-4 border-gray-700">
              <Skull className="w-20 h-20 text-white animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold rpg-title text-gray-800 mb-4">
              💀 DEFEAT 💀
            </h1>
            <div className="sword-divider"></div>
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6 border-4 border-gray-600 mt-6">
              <p className="text-2xl rpg-text text-gray-700 mb-2 flex items-center justify-center gap-2">
                <Frown className="w-8 h-8" />
                You were defeated...
              </p>
              <p className="text-xl font-bold rpg-text text-gray-800 mt-3">
                Champion: 👑 {winner} 👑
              </p>
              <p className="text-lg rpg-text text-gray-600 mt-2">
                Train harder and return stronger!
              </p>
            </div>
          </div>
        )}

        <div className={`rounded-2xl p-8 mb-8 border-4 ${
          isWinner 
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-600' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-600'
        }`}>
          <h3 className={`text-3xl font-bold rpg-title mb-6 flex items-center justify-center gap-3 ${
            isWinner ? 'text-amber-900' : 'text-gray-800'
          }`}>
            <Trophy className="w-8 h-8" />
            {isWinner ? 'Hall of Heroes' : 'Battle Results'}
            <Sparkles className="w-8 h-8" />
          </h3>
          <div className="space-y-4">
            {sortedPlayers.map((player, idx) => {
              const playerProgress = progress[player.name] || 0;
              const isCurrentPlayer = player.name === username;
              const medals = ["🥇", "🥈", "🥉"];
              const colors = [
                "from-yellow-400 to-orange-500",
                "from-gray-300 to-gray-400",
                "from-orange-400 to-orange-600"
              ];

              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-r ${colors[idx] || "from-amber-100 to-amber-200"} rounded-xl p-5 flex items-center justify-between shadow-lg border-3 ${
                    isCurrentPlayer 
                      ? 'border-purple-600 ring-4 ring-purple-300' 
                      : 'border-amber-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{medals[idx] || "🏁"}</span>
                    <div>
                      <span className="font-bold text-2xl rpg-title text-amber-900">
                        {player.name}
                        {isCurrentPlayer && " (You)"}
                      </span>
                      {player.isBot && (
                        <span className="ml-2 text-sm text-amber-700">🤖</span>
                      )}
                      {player.character && (
                        <span className="ml-2 text-2xl">{player.character.emoji}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-2xl font-bold rpg-title text-amber-900">
                    {Math.round(playerProgress)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={playAgain}
          className={`w-full text-xl py-5 rounded-xl font-bold transition-all duration-200 ${
            isWinner
              ? 'rpg-button'
              : 'bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 hover:scale-105'
          }`}
        >
          {isWinner ? '⚔️ QUEST AGAIN ⚔️' : '💪 TRAIN & RETRY 💪'}
        </button>
      </div>
    </div>
  );
};

export default FinishedScreen;

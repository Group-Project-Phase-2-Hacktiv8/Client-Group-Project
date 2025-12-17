import { Flag, Swords } from "lucide-react";
import { useGame } from "../../contexts/GameContext";

const RaceTrack = () => {
  const { players, progress, username } = useGame();

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-2xl p-6 mb-6 border-4 border-amber-600">
      <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
        <Swords className="w-7 h-7" />
        ⚔️ Battle Arena ⚔️
        <Flag className="w-7 h-7 ml-auto text-green-600" />
      </h3>
      <div className="space-y-6">
        {players.map((player, idx) => {
          const playerProgress = progress[player.name] || 0;
          const isCurrentUser = player.name === username;
          const character = player.character || { emoji: '⚔️', color: 'from-gray-500 to-gray-700' };

          return (
            <div key={idx} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center shadow-lg border-2 border-white`}>
                  <span className="text-lg">{character.emoji}</span>
                </div>
                <span
                  className={`font-bold text-lg ${
                    isCurrentUser ? "text-purple-700" : "text-gray-800"
                  }`}
                >
                  {player.name} {isCurrentUser && "👑"}
                  {player.isBot && " 🤖"}
                </span>
                <span className="ml-auto text-sm font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-full">
                  {Math.round(playerProgress)}%
                </span>
              </div>
              
              {/* RPG-style race track */}
              <div className="relative h-16 bg-gradient-to-r from-green-800 via-green-600 to-green-800 rounded-xl overflow-hidden border-2 border-green-900 shadow-inner">
                {/* Track pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 40px)'
                  }}></div>
                </div>
                
                {/* Progress bar */}
                <div
                  className={`h-full bg-gradient-to-r ${character.color} transition-all duration-300 ease-out opacity-30`}
                  style={{ width: `${playerProgress}%` }}
                />
                
                {/* Character sprite with animation */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-4xl transition-all duration-300 ease-out drop-shadow-lg animate-bounce"
                  style={{ 
                    left: `calc(${playerProgress}% - 20px)`,
                    animationDuration: '1s'
                  }}
                >
                  {character.emoji}
                </div>
                
                {/* Finish flag */}
                {playerProgress >= 95 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl animate-pulse">
                    🏁
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceTrack;

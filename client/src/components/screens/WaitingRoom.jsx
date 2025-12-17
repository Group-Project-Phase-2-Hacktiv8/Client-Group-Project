import { Crown, Users, Bot, Trash2, Castle, Swords, LogOut, Shield } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import soundManager, { MUSIC } from "../../utils/soundManager";
import { showRPGAlert } from "../ui/RPGAlert";
import { RPGSpinner } from "../ui/RPGLoading";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const {
    roomCode,
    players,
    isRoomMaster,
    language,
    maxPlayers,
    changeLanguage,
    startGame: socketStartGame,
    changeMaxPlayers,
    addBot,
    removeBot,
    leaveRoom,
  } = useGame();

  const [showBotMenu, setShowBotMenu] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isAddingBot, setIsAddingBot] = useState(false);

  // Redirect to lobby if no room code (connection lost after refresh)
  useEffect(() => {
    // Small delay to allow GameContext to handle refresh first
    const timer = setTimeout(() => {
      if (!roomCode) {
        console.log('⚠️ No room code in WaitingRoom, redirecting...');
        // Silent redirect, GameContext already showed message
        navigate('/lobby', { replace: true });
      }
    }, 1000); // Longer delay to let GameContext redirect first
    
    return () => clearTimeout(timer);
  }, [roomCode, navigate]);

  // Continue playing lobby music
  useEffect(() => {
    soundManager.initBackgroundMusic(MUSIC.LOBBY);
    soundManager.playBackgroundMusic();
    
    return () => {
      soundManager.stopBackgroundMusic();
    };
  }, []);

  // Close bot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBotMenu && !event.target.closest('.bot-menu-container')) {
        setShowBotMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBotMenu]);

  const startGame = () => {
    setIsStarting(true);
    soundManager.playSound('GAME_START');
    socketStartGame();
    // Reset after navigation (will unmount anyway)
    setTimeout(() => setIsStarting(false), 2000);
  };

  const handleAddBot = async (difficulty) => {
    setIsAddingBot(true);
    soundManager.playSound('BUTTON_CLICK');
    addBot(difficulty);
    setShowBotMenu(false);
    // Small delay for UX
    setTimeout(() => setIsAddingBot(false), 500);
  };

  const handleLeaveRoom = () => {
    showRPGAlert('⚠️ Are you sure you want to leave the guild?', 'warning', () => {
      soundManager.playSound('BUTTON_CLICK');
      leaveRoom();
    });
  };

  return (
    <div className="min-h-screen rpg-background castle-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particle effects */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="rpg-card p-8 md:p-12 max-w-4xl w-full relative z-10">
        {/* Leave Room Button */}
        <button
          onClick={handleLeaveRoom}
          className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold rpg-text flex items-center gap-2 transition-all hover:scale-105 shadow-lg border-2 border-red-800"
        >
          <LogOut className="w-5 h-5" />
          Leave Guild
        </button>

        <div className="text-center mb-8">
          <Castle className="w-20 h-20 text-amber-700 mx-auto mb-4 sparkle" />
          <div className="inline-block px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-4 border-4 border-amber-700 shadow-lg glow">
            <span className="text-amber-900 font-mono font-bold text-2xl rpg-title">
              {roomCode}
            </span>
          </div>
          <h2 className="text-4xl font-bold rpg-title text-amber-900 mb-2">
            🏰 Guild Hall 🏰
          </h2>
          <div className="sword-divider"></div>
          <p className="text-amber-800 rpg-text text-lg">
            Share the code with fellow warriors!
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Players ({players.length}/{maxPlayers})
          </h3>
          <div className="space-y-3">
            {players.map((player, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      player.isBot
                        ? "bg-gradient-to-r from-gray-400 to-gray-600"
                        : idx === 0
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : "bg-gradient-to-r from-blue-400 to-purple-500"
                    } flex items-center justify-center text-white font-bold`}
                  >
                    {player.isBot ? "🤖" : player.name[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {player.name}
                    </span>
                    {player.isBot && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({player.difficulty})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!player.isBot && idx === 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Master
                    </span>
                  )}
                  {player.isBot && isRoomMaster && (
                    <button
                      onClick={() => removeBot(player.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isRoomMaster && (
          <div className="space-y-6">
            {/* Room Settings Card */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-4 border-amber-600 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-amber-700" />
                <h3 className="text-xl font-bold rpg-title text-amber-900">Guild Settings</h3>
              </div>
              
              <label className="block text-base font-bold rpg-title text-amber-900 mb-3">
                👥 Room Capacity
              </label>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      soundManager.playSound('BUTTON_CLICK');
                      changeMaxPlayers(num);
                    }}
                    disabled={num < players.length}
                    className={`py-3 rounded-xl font-bold rpg-title text-lg transition-all duration-200 border-3 ${
                      maxPlayers === num
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg scale-110 border-amber-700"
                        : num < players.length
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                        : "bg-white text-amber-900 hover:bg-amber-100 border-amber-600 hover:scale-105"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
               {/* Bot Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-4 border-purple-600 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6 text-purple-700" />
                <h3 className="text-xl font-bold rpg-title text-purple-900">🤖 AI Warriors</h3>
              </div>
              <div className="relative bot-menu-container">
                <button
                  onClick={() => setShowBotMenu(!showBotMenu)}
                  disabled={players.length >= maxPlayers || isAddingBot}
                  className={`w-full py-4 rounded-xl font-bold rpg-title text-lg transition-all duration-200 border-3 flex items-center justify-center gap-2 ${
                    players.length >= maxPlayers || isAddingBot
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                      : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white hover:shadow-lg hover:scale-105 border-purple-800"
                  }`}
                >
                  {isAddingBot ? (
                    <>
                      <RPGSpinner size="sm" />
                      <span>Summoning...</span>
                    </>
                  ) : (
                    "+ Add AI Warrior"
                  )}
                </button>
                {showBotMenu && players.length < maxPlayers && (
                  <div className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-2xl border-4 border-purple-600 z-50 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => handleAddBot("easy")}
                      className="w-full px-6 py-4 text-left hover:bg-green-100 transition-all border-b-2 border-gray-200 hover:scale-105 transform"
                    >
                      <div className="font-bold rpg-title text-lg text-green-700">
                        🐢 Easy Warrior
                      </div>
                      <div className="text-sm text-gray-600 rpg-text">~30 WPM - Beginner</div>
                    </button>
                    <button
                      onClick={() => handleAddBot("medium")}
                      className="w-full px-6 py-4 text-left hover:bg-yellow-100 transition-all border-b-2 border-gray-200 hover:scale-105 transform"
                    >
                      <div className="font-bold rpg-title text-lg text-yellow-700">
                        🐎 Medium Warrior
                      </div>
                      <div className="text-sm text-gray-600 rpg-text">~50 WPM - Skilled</div>
                    </button>
                    <button
                      onClick={() => handleAddBot("hard")}
                      className="w-full px-6 py-4 text-left hover:bg-red-100 transition-all hover:scale-105 transform"
                    >
                      <div className="font-bold rpg-title text-lg text-red-700">
                        ⚡ Hard Warrior
                      </div>
                      <div className="text-sm text-gray-600 rpg-text">~80 WPM - Master</div>
                    </button>
                  </div>
                )}
              </div>
            </div>

              <div className="sword-divider my-4"></div>

              <label className="block text-base font-bold rpg-title text-amber-900 mb-3">
                🌍 Select Language
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    soundManager.playSound('BUTTON_CLICK');
                    changeLanguage("Indonesia");
                  }}
                  className={`py-4 rounded-xl font-bold rpg-title transition-all duration-200 border-3 ${
                    language === "Indonesia"
                      ? "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg scale-105 border-red-800"
                      : "bg-white text-gray-700 hover:bg-red-50 border-red-600 hover:scale-105"
                  }`}
                >
                  🇮🇩 Indonesia
                </button>
                <button
                  onClick={() => {
                    soundManager.playSound('BUTTON_CLICK');
                    changeLanguage("Inggris");
                  }}
                  className={`py-4 rounded-xl font-bold rpg-title transition-all duration-200 border-3 ${
                    language === "Inggris"
                      ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg scale-105 border-blue-800"
                      : "bg-white text-gray-700 hover:bg-blue-50 border-blue-600 hover:scale-105"
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={players.length < 2 || isStarting}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                players.length >= 2 && !isStarting
                  ? "bg-gradient-to-r from-green-600 to-teal-600 text-white hover:shadow-lg transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isStarting ? (
                <>
                  <RPGSpinner size="md" />
                  <span>Preparing Battle...</span>
                </>
              ) : players.length >= 2 ? (
                "🏁 Start Game!"
              ) : (
                "Waiting for more players..."
              )}
            </button>
          </div>
        )}

        {!isRoomMaster && (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">
                Waiting for room master to start the game...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;

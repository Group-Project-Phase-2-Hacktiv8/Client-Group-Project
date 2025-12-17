/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Crown, Users, Castle, Scroll } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import soundManager, { MUSIC } from "../../utils/soundManager";
import { RPGSpinner } from "../ui/RPGLoading";

const LobbyScreen = () => {
  const {
    username,
    createRoom: socketCreateRoom,
    joinRoom: socketJoinRoom,
    socket,
  } = useGame();
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  // Start lobby music
  useEffect(() => {
    soundManager.initBackgroundMusic(MUSIC.LOBBY);
    soundManager.playBackgroundMusic();

    return () => {
      soundManager.stopBackgroundMusic();
    };
  }, []);

  const createRoom = () => {
    setIsCreating(true);
    soundManager.playSound("BUTTON_CLICK");
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    socketCreateRoom(code);
    setTimeout(() => setIsCreating(false), 1000);
  };

  const joinRoom = () => {
    if (input.trim()) {
      setIsJoining(true);
      soundManager.playSound("BUTTON_CLICK");
      const code = input.trim().toUpperCase();
      setErrorMessage("");
      socketJoinRoom(code);
      setTimeout(() => setIsJoining(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
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

      <div className="rpg-card p-8 md:p-12 max-w-3xl w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold rpg-title text-amber-900 mb-4">
            🏰 Welcome, {username}! 🏰
          </h2>
          <div className="sword-divider"></div>
          <p className="text-amber-800 rpg-text text-lg">
            Choose Your Path, Noble Warrior
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 border-4 border-amber-600 shadow-lg">
            <div className="text-center mb-6">
              <Castle className="w-16 h-16 text-amber-700 mx-auto mb-3 sparkle" />
              <h3 className="text-2xl font-bold rpg-title text-amber-900">
                Build Castle
              </h3>
              <p className="text-sm text-amber-700 rpg-text">
                Become the Guild Master
              </p>
            </div>
            <button
              onClick={createRoom}
              disabled={isCreating}
              className={`rpg-button w-full flex items-center justify-center gap-3 ${
                isCreating ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isCreating ? (
                <>
                  <RPGSpinner size="md" />
                  <span>Building...</span>
                </>
              ) : (
                "👑 Create Guild 👑"
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border-4 border-blue-600 shadow-lg">
            <div className="text-center mb-6">
              <Scroll className="w-16 h-16 text-blue-700 mx-auto mb-3 sparkle" />
              <h3 className="text-2xl font-bold rpg-title text-blue-900">
                Join Quest
              </h3>
              <p className="text-sm text-blue-700 rpg-text">Enter Guild Code</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="rpg-input w-full"
                placeholder="ABC123"
                maxLength={6}
              />
              {errorMessage && (
                <div className="bg-red-100 border-3 border-red-600 text-red-800 px-4 py-2 rounded-xl text-center font-bold rpg-text animate-pulse">
                  ⚠️ {errorMessage} ⚠️
                </div>
              )}
              <button
                onClick={joinRoom}
                disabled={isJoining || !input.trim()}
                className={`rpg-button w-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center gap-3 ${
                  isJoining || !input.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isJoining ? (
                  <>
                    <RPGSpinner size="md" />
                    <span>Joining...</span>
                  </>
                ) : (
                  "⚔️ Join Battle ⚔️"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;

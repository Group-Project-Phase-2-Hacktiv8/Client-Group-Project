import { useState } from "react";
import { useNavigate } from "react-router";
import { Swords, Crown, Shield } from "lucide-react";
import { useGame } from "../../contexts/GameContext";
import soundManager from "../../utils/soundManager";
import sessionManager from "../../utils/sessionManager";
import { RPGSpinner } from "../ui/RPGLoading";

const LoginScreen = () => {
  const { setUsername } = useGame();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (input.trim()) {
      setIsLoading(true);
      soundManager.playSound('BUTTON_CLICK');
      const trimmedUsername = input.trim();
      setUsername(trimmedUsername);
      sessionManager.initializeSession(trimmedUsername);
      setTimeout(() => {
        navigate("/lobby");
        setIsLoading(false);
      }, 800);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen rpg-background castle-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particle effects */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="rpg-card p-8 md:p-12 max-w-lg w-full transform hover:scale-105 transition-transform duration-300 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-6">
            <Shield className="w-12 h-12 text-amber-600 animate-pulse" />
            <Swords className="w-16 h-16 text-amber-700" />
            <Crown className="w-12 h-12 text-amber-600 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold rpg-title text-amber-900 mb-2">
            ⚔️ TYPING QUEST ⚔️
          </h1>
          <div className="sword-divider"></div>
          <p className="text-amber-800 rpg-text text-lg">
            Enter the Arena and Prove Your Worth!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold rpg-title text-amber-900 mb-3 text-center">
              CHOOSE YOUR HERO NAME
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="rpg-input w-full"
              placeholder="Sir Typealot..."
              maxLength={20}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading || !input.trim()}
            className={`rpg-button w-full flex items-center justify-center gap-3 ${
              isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RPGSpinner size="md" />
                <span>Entering...</span>
              </>
            ) : (
              "⚔️ BEGIN QUEST ⚔️"
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-amber-700 rpg-text">
          <p>🏰 Multiplayer • 🤖 AI Bots • ⚡ Real-time Battle</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

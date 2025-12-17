/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../../contexts/GameContext";
import soundManager from "../../utils/soundManager";
import { Scroll, Feather } from "lucide-react";

const TypingArea = () => {
  const {
    gameText,
    currentWordIndex,
    setCurrentWordIndex,
    typedText,
    setTypedText,
    progress,
    username,
    updateProgress,
    finishGame,
  } = useGame();
  const navigate = useNavigate();

  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);

  const words = gameText.split(" ");
  const currentWord = words[currentWordIndex] || "";

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWordIndex]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTypedText(value);

    const isCorrect = currentWord.startsWith(value);
    
    // Play error sound when user makes mistake
    if (!isCorrect && value.length > 0 && !hasError) {
      soundManager.playSound('ERROR');
    }
    
    setHasError(!isCorrect);

    if (value.endsWith(" ") && value.trim() === currentWord) {
      soundManager.playSound('TYPING');
      const newIndex = currentWordIndex + 1;
      const newProgress = (newIndex / words.length) * 100;

      setCurrentWordIndex(newIndex);
      setTypedText("");
      setHasError(false);

      // Send progress to server
      updateProgress(newProgress);

      if (newProgress >= 100) {
        soundManager.playSound('FINISH');
        finishGame();
        navigate("/finished");
      }
    }
  };

  return (
    <div className="rpg-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <Scroll className="w-8 h-8 text-amber-700" />
        <h3 className="text-2xl font-bold rpg-title text-amber-900">Ancient Scroll</h3>
        <Feather className="w-6 h-6 text-amber-600 ml-auto animate-pulse" />
      </div>

      <div className="mb-8 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border-4 border-amber-600">
        <div className="flex flex-wrap gap-3 text-xl leading-relaxed rpg-text">
          {words.map((word, idx) => {
            let className = "px-3 py-2 rounded-lg transition-all duration-200";
            if (idx < currentWordIndex) {
              className += " bg-green-600 text-white font-bold shadow-md";
            } else if (idx === currentWordIndex) {
              className +=
                " bg-amber-400 text-amber-900 font-bold ring-4 ring-amber-600 animate-pulse scale-110";
            } else {
              className += " text-gray-600 bg-white/50";
            }
            return (
              <span key={idx} className={className}>
                {word}
              </span>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Feather className="w-6 h-6 text-amber-600" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleInputChange}
          className={`rpg-input w-full pl-14 pr-6 py-5 text-2xl ${
            hasError
              ? "border-red-600 bg-red-50 animate-pulse"
              : "border-amber-600"
          }`}
          placeholder="Write your legend..."
          autoComplete="off"
          spellCheck="false"
        />
        {hasError && (
          <p className="mt-3 text-center text-lg text-red-700 font-bold rpg-text animate-bounce">
            ⚠️ Incorrect Spell! Retry with Backspace ⚠️
          </p>
        )}
      </div>

      <div className="mt-6 text-center bg-amber-100 py-3 rounded-xl border-2 border-amber-600">
        <p className="text-lg font-bold rpg-text text-amber-900">
          📜 Word {currentWordIndex + 1} of {words.length} 📜
        </p>
      </div>
    </div>
  );
};

export default TypingArea;

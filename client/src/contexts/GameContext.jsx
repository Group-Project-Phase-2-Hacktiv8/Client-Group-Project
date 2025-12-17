/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSocket } from "../hooks/useSocket";
import { showRPGAlert } from "../components/ui/RPGAlert";
import { assignCharactersToPlayers } from "../utils/characters";
import sessionManager from "../utils/sessionManager";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};

export const GameProvider = ({ children }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  // Game State with localStorage persistence
  const [gameState, setGameState] = useState(() => {
    return localStorage.getItem('gameState') || "login";
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || "";
  });
  const [roomCode, setRoomCode] = useState(() => {
    return localStorage.getItem('roomCode') || "";
  });
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('players');
    return saved ? JSON.parse(saved) : [];
  });
  const [isRoomMaster, setIsRoomMaster] = useState(() => {
    return localStorage.getItem('isRoomMaster') === 'true';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || "Indonesia";
  });
  const [gameText, setGameText] = useState(() => {
    return localStorage.getItem('gameText') || "";
  });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [progress, setProgress] = useState({});
  const [winner, setWinner] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(() => {
    const saved = localStorage.getItem('maxPlayers');
    return saved ? parseInt(saved) : 3;
  });
  const [bots, setBots] = useState([]);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gameState', gameState);
  }, [gameState]);

  useEffect(() => {
    if (username) localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    if (roomCode) localStorage.setItem('roomCode', roomCode);
    else localStorage.removeItem('roomCode');
  }, [roomCode]);

  useEffect(() => {
    if (players.length > 0) localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('isRoomMaster', isRoomMaster.toString());
  }, [isRoomMaster]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (gameText) localStorage.setItem('gameText', gameText);
  }, [gameText]);

  useEffect(() => {
    localStorage.setItem('maxPlayers', maxPlayers.toString());
  }, [maxPlayers]);

  // Handle page refresh - redirect to appropriate page
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if user should be redirected to lobby
    if (sessionManager.shouldRedirectToLobby(currentPath)) {
      console.log('🔄 Redirecting to lobby from:', currentPath);
      
      // Clear room-related data
      sessionManager.clearRoomSession();
      
      // Clear state
      setRoomCode('');
      setPlayers([]);
      setIsRoomMaster(false);
      setGameText('');
      setWinner(null);
      setProgress({});
      
      // Redirect immediately without alert for smooth UX
      navigate('/lobby', { replace: true });
    } else {
      // Update activity if on valid page
      sessionManager.updateActivity();
    }
  }, []);  // Run only once on mount
  
  // Update activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      sessionManager.updateActivity();
    };
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, []);

  // Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    // Room created
    socket.on("room_created", ({ roomCode, isRoomMaster, players, maxPlayers: max }) => {
      setRoomCode(roomCode);
      setIsRoomMaster(isRoomMaster);
      setPlayers(assignCharactersToPlayers(players));
      setMaxPlayers(max || 3);
      if (location.pathname !== "/waiting") {
        navigate("/waiting");
      }
    });

    // Room joined
    socket.on(
      "room_joined",
      ({ roomCode, isRoomMaster, players, language, maxPlayers: max }) => {
        setRoomCode(roomCode);
        setIsRoomMaster(isRoomMaster);
        setPlayers(assignCharactersToPlayers(players));
        setLanguage(language);
        setMaxPlayers(max || 3);
        if (location.pathname !== "/waiting") {
          navigate("/waiting");
        }
      }
    );

    // Player joined
    socket.on("player_joined", ({ players, newPlayer }) => {
      setPlayers(assignCharactersToPlayers(players));
      console.log(`${newPlayer} joined the room`);
    });

    // Player left
    socket.on("player_left", ({ playerName, players }) => {
      setPlayers(assignCharactersToPlayers(players));
      console.log(`${playerName} left the room`);
    });

    // Language changed
    socket.on("language_changed", ({ language }) => {
      setLanguage(language);
    });

    // Max players changed
    socket.on("max_players_changed", ({ maxPlayers: max }) => {
      setMaxPlayers(max);
    });

    // Bot added
    socket.on("bot_added", ({ bot, players }) => {
      setPlayers(assignCharactersToPlayers(players));
      setBots(prev => [...prev, bot]);
    });

    // Bot removed
    socket.on("bot_removed", ({ botId, players }) => {
      setPlayers(assignCharactersToPlayers(players));
      setBots(prev => prev.filter(b => b.id !== botId));
    });

    // New master assigned
    socket.on("new_master_assigned", ({ newMasterId, newMasterName }) => {
      if (socket.id === newMasterId) {
        setIsRoomMaster(true);
        showRPGAlert(`👑 You are now the Guild Master!`, 'success');
      }
      console.log(`${newMasterName} is now the room master`);
    });

    // Game started
    socket.on("game_started", ({ gameText }) => {
      console.log("🎮 Game started! Text received:", gameText);
      setGameText(gameText);
      setCurrentWordIndex(0);
      setTypedText("");
      setProgress({});
      if (location.pathname !== "/racing") {
        navigate("/racing");
      }
    });

    // Progress updated
    socket.on(
      "progress_updated",
      ({ playerName, progress: playerProgress }) => {
        setProgress((prev) => ({ ...prev, [playerName]: playerProgress }));
      }
    );

    // Player finished
    socket.on("player_finished", ({ playerName, leaderboard }) => {
      if (!winner) {
        setWinner(playerName);
        if (location.pathname !== "/finished") {
          navigate("/finished");
        }
      }
    });

    // Error handling
    socket.on("error", ({ message }) => {
      // Check if this is an authorization/room error (likely from refresh)
      const isAuthError = message.toLowerCase().includes('not authorized') || 
                         message.toLowerCase().includes('room not found') ||
                         message.toLowerCase().includes('invalid');
      
      if (isAuthError) {
        console.log('❌ Authorization error, redirecting silently...');
        
        // Clear room state
        sessionManager.clearRoomSession();
        
        setRoomCode('');
        setPlayers([]);
        setIsRoomMaster(false);
        setGameText('');
        
        // Silent redirect without alert
        setTimeout(() => {
          navigate('/lobby', { replace: true });
        }, 500);
      } else {
        // Show alert only for non-auth errors
        showRPGAlert(message, 'error');
      }
    });

    // Left room successfully
    socket.on("left_room_success", () => {
      navigate("/lobby");
    });

    return () => {
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("language_changed");
      socket.off("max_players_changed");
      socket.off("bot_added");
      socket.off("bot_removed");
      socket.off("new_master_assigned");
      socket.off("game_started");
      socket.off("progress_updated");
      socket.off("player_finished");
      socket.off("error");
      socket.off("left_room_success");
    };
  }, [socket, winner, navigate, location]);

  // Socket Actions with null checks
  const createRoom = (roomCode) => {
    if (!socket) {
      console.warn('Socket not connected yet');
      return;
    }
    sessionManager.startRoomSession(roomCode);
    socket.emit("create_room", { username, roomCode });
  };

  const joinRoom = (roomCode) => {
    if (!socket) {
      console.warn('Socket not connected yet');
      return;
    }
    sessionManager.startRoomSession(roomCode);
    socket.emit("join_room", { username, roomCode });
  };

  const changeLanguage = (newLanguage) => {
    if (!socket) return;
    socket.emit("change_language", { roomCode, language: newLanguage });
  };

  const startGame = () => {
    if (!socket) return;
    socket.emit("start_game", { roomCode });
  };

  const updateProgress = (newProgress) => {
    if (!socket) return;
    socket.emit("update_progress", { roomCode, progress: newProgress });
  };

  const finishGame = () => {
    if (!socket) return;
    socket.emit("player_finished", { roomCode });
  };

  const changeMaxPlayers = (newMaxPlayers) => {
    if (!socket) return;
    socket.emit("change_max_players", { roomCode, maxPlayers: newMaxPlayers });
  };

  const addBot = (difficulty) => {
    if (!socket) return;
    socket.emit("add_bot", { roomCode, difficulty });
  };

  const removeBot = (botId) => {
    if (!socket) return;
    socket.emit("remove_bot", { roomCode, botId });
  };

  const leaveRoom = () => {
    if (!socket) return;
    socket.emit("leave_room", { roomCode });
    // Clear session on leave
    sessionManager.clearRoomSession();
  };

  const value = {
    socket,
    gameState,
    setGameState,
    username,
    setUsername,
    roomCode,
    setRoomCode,
    players,
    setPlayers,
    isRoomMaster,
    setIsRoomMaster,
    language,
    setLanguage,
    gameText,
    setGameText,
    currentWordIndex,
    setCurrentWordIndex,
    typedText,
    setTypedText,
    progress,
    setProgress,
    winner,
    setWinner,
    maxPlayers,
    setMaxPlayers,
    bots,
    setBots,
    // Actions
    createRoom,
    joinRoom,
    changeLanguage,
    startGame,
    updateProgress,
    finishGame,
    changeMaxPlayers,
    addBot,
    removeBot,
    leaveRoom,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSocket } from "../hooks/useSocket";
import { showRPGAlert } from "../components/ui/RPGAlert";
import { assignCharactersToPlayers } from "../utils/characters";

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

  // Game State with localStorage initialization
  const [gameState, setGameState] = useState("login");
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );
  const [roomCode, setRoomCode] = useState(
    () => localStorage.getItem("roomCode") || ""
  );
  const [players, setPlayers] = useState([]);
  const [isRoomMaster, setIsRoomMaster] = useState(
    () => localStorage.getItem("isRoomMaster") === "true"
  );
  const [language, setLanguage] = useState("Indonesia");
  const [gameText, setGameText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [progress, setProgress] = useState({});
  const [winner, setWinner] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(3);
  const [bots, setBots] = useState([]);
  const [isRejoining, setIsRejoining] = useState(false);
  const [hasAttemptedRejoin, setHasAttemptedRejoin] = useState(false);

  // Socket Event Listeners AND Auto-rejoin logic combined
  useEffect(() => {
    if (!socket) return;

    // Room created
    socket.on(
      "room_created",
      ({ roomCode, isRoomMaster, players, maxPlayers: max }) => {
        setRoomCode(roomCode);
        setIsRoomMaster(isRoomMaster);
        setPlayers(assignCharactersToPlayers(players));
        setMaxPlayers(max || 3);
        // Save to localStorage
        localStorage.setItem("roomCode", roomCode);
        localStorage.setItem("isRoomMaster", isRoomMaster);
        if (location.pathname !== "/waiting") {
          navigate("/waiting");
        }
      }
    );

    // Room joined
    socket.on(
      "room_joined",
      ({ roomCode, isRoomMaster, players, language, maxPlayers: max }) => {
        console.log("📥 room_joined received:", {
          roomCode,
          isRoomMaster,
          players,
          language,
          maxPlayers: max,
        });
        setRoomCode(roomCode);
        setIsRoomMaster(isRoomMaster);
        setPlayers(assignCharactersToPlayers(players));
        setLanguage(language);
        setMaxPlayers(max || 3);
        setIsRejoining(false);
        setHasAttemptedRejoin(true);
        // Save to localStorage
        localStorage.setItem("roomCode", roomCode);
        localStorage.setItem("isRoomMaster", isRoomMaster.toString());
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
      setBots((prev) => [...prev, bot]);
    });

    // Bot removed
    socket.on("bot_removed", ({ botId, players }) => {
      setPlayers(assignCharactersToPlayers(players));
      setBots((prev) => prev.filter((b) => b.id !== botId));
    });

    // New master assigned
    socket.on("new_master_assigned", ({ newMasterId, newMasterName }) => {
      if (socket.id === newMasterId) {
        setIsRoomMaster(true);
        showRPGAlert(`👑 You are now the Guild Master!`, "success");
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

    // Rejoin failed
    socket.on("rejoin_failed", ({ message }) => {
      console.log("❌ Rejoin failed:", message);
      setIsRejoining(false);
      setHasAttemptedRejoin(false);
      // Clear localStorage
      localStorage.removeItem("roomCode");
      localStorage.removeItem("isRoomMaster");
      // Redirect to lobby
      showRPGAlert(
        message || "Room no longer exists. Please create or join a new room.",
        "warning"
      );
      navigate("/lobby");
    });

    // Error handling
    socket.on("error", ({ message }) => {
      showRPGAlert(message, "error");
      setIsRejoining(false);
    });

    // Left room successfully
    socket.on("left_room_success", () => {
      // Clear localStorage
      localStorage.removeItem("roomCode");
      localStorage.removeItem("isRoomMaster");
      navigate("/lobby");
    });

    // Auto-rejoin on refresh - AFTER all listeners are set up
    const savedRoomCode = localStorage.getItem("roomCode");
    const savedUsername = localStorage.getItem("username");

    if (
      savedRoomCode &&
      savedUsername &&
      !hasAttemptedRejoin &&
      (location.pathname === "/waiting" ||
        location.pathname === "/racing" ||
        location.pathname === "/finished")
    ) {
      setHasAttemptedRejoin(true);
      setIsRejoining(true);
      console.log("🔄 Attempting to rejoin room:", savedRoomCode);
      socket.emit("rejoin_room", {
        username: savedUsername,
        roomCode: savedRoomCode,
      });
    }

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
      socket.off("rejoin_failed");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, winner, navigate, location]);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    }
  }, [username]);

  // Socket Actions
  const createRoom = (roomCode) => {
    socket?.emit("create_room", { username, roomCode });
  };

  const joinRoom = (roomCode) => {
    socket?.emit("join_room", { username, roomCode });
  };

  const changeLanguage = (newLanguage) => {
    socket?.emit("change_language", { roomCode, language: newLanguage });
  };

  const startGame = () => {
    socket?.emit("start_game", { roomCode });
  };

  const updateProgress = (newProgress) => {
    socket?.emit("update_progress", { roomCode, progress: newProgress });
  };

  const finishGame = () => {
    socket?.emit("player_finished", { roomCode });
  };

  const changeMaxPlayers = (newMaxPlayers) => {
    socket?.emit("change_max_players", { roomCode, maxPlayers: newMaxPlayers });
  };

  const addBot = (difficulty) => {
    socket?.emit("add_bot", { roomCode, difficulty });
  };

  const removeBot = (botId) => {
    socket?.emit("remove_bot", { roomCode, botId });
  };

  const leaveRoom = () => {
    // Use roomCode from state or localStorage as fallback
    const currentRoomCode = roomCode || localStorage.getItem("roomCode");
    if (currentRoomCode) {
      socket?.emit("leave_room", { roomCode: currentRoomCode });
    }
    // Clear local state immediately
    setRoomCode("");
    setPlayers([]);
    setIsRoomMaster(false);
    setIsRejoining(false);
    setHasAttemptedRejoin(false);
    localStorage.removeItem("roomCode");
    localStorage.removeItem("isRoomMaster");
    // Navigate to lobby
    navigate("/lobby");
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
    isRejoining,
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

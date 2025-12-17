import { BrowserRouter, Routes, Route } from "react-router";
import { GameProvider } from "./contexts/GameContext";
import LoginScreen from "./components/screens/LoginScreen";
import LobbyScreen from "./components/screens/LobbyScreen";
import WaitingRoom from "./components/screens/WaitingRoom";
import RacingScreen from "./components/screens/RacingScreen";
import FinishedScreen from "./components/screens/FinishedScreen";
import { RPGAlertContainer } from "./components/ui/RPGAlert";
import SoundControl from "./components/ui/SoundControl";

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <RPGAlertContainer />
        <SoundControl />
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/lobby" element={<LobbyScreen />} />
          <Route path="/waiting" element={<WaitingRoom />} />
          <Route path="/racing" element={<RacingScreen />} />
          <Route path="/finished" element={<FinishedScreen />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;

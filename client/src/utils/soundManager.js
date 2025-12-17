// Sound Manager for RPG Theme
// Handles background music and sound effects

class SoundManager {
  constructor() {
    this.bgMusic = null;
    this.isMuted = false;
    this.sounds = {};
  }

  // Initialize background music
  initBackgroundMusic(src) {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
    
    this.bgMusic = new Audio(src);
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;
    
    return this.bgMusic;
  }

  // Play background music
  playBackgroundMusic() {
    if (this.bgMusic && !this.isMuted) {
      this.bgMusic.play().catch(err => {
        console.log('Background music autoplay prevented:', err);
      });
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  // Load sound effect
  loadSound(name, src) {
    this.sounds[name] = new Audio(src);
    this.sounds[name].volume = 0.5;
  }

  // Play sound effect
  playSound(name) {
    if (this.sounds[name] && !this.isMuted) {
      const sound = this.sounds[name].cloneNode();
      sound.volume = 0.5;
      sound.play().catch(err => {
        console.log(`Sound ${name} play error:`, err);
      });
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.bgMusic) {
      if (this.isMuted) {
        this.bgMusic.pause();
      } else {
        this.bgMusic.play().catch(err => console.log('Play error:', err));
      }
    }
    
    // Save mute state to localStorage
    localStorage.setItem('soundMuted', this.isMuted.toString());
    
    return this.isMuted;
  }

  // Get mute state from localStorage
  getMuteState() {
    const saved = localStorage.getItem('soundMuted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
    return this.isMuted;
  }

  // Set volume
  setVolume(volume) {
    if (this.bgMusic) {
      this.bgMusic.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();

// Pre-load sound effects
export const SOUNDS = {
  BUTTON_CLICK: '/sounds/effects/button-klick.mp3',
  GAME_START: '/sounds/effects/game-start.mp3',
  TYPING: '/sounds/effects/typing.mp3',
  VICTORY: '/sounds/effects/victory.mp3',
  DEFEAT: '/sounds/effects/defeat.mp3',
  ERROR: '/sounds/effects/error.mp3',
};

export const MUSIC = {
  LOBBY: '/sounds/music/lobby-theme.mp3',
  WAITING: '/sounds/music/waiting-theme.mp3',
  RACING: '/sounds/music/race-theme.mp3',
  VICTORY: '/sounds/music/victory-theme.mp3',
};

// Initialize sounds
Object.entries(SOUNDS).forEach(([key, src]) => {
  soundManager.loadSound(key, src);
});

export default soundManager;

// Session Manager for handling page refresh and session state
class SessionManager {
  constructor() {
    this.SESSION_KEY = 'typing_quest_session';
    this.LAST_ACTIVITY_KEY = 'typing_quest_last_activity';
    this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  }

  // Check if current navigation is a page refresh
  isPageRefresh() {
    try {
      const navigationEntries = performance.getEntriesByType('navigation');
      return navigationEntries.length > 0 && navigationEntries[0].type === 'reload';
    } catch (error) {
      console.warn('Performance API not available:', error);
      return false;
    }
  }

  // Check if session is expired
  isSessionExpired() {
    const lastActivity = localStorage.getItem(this.LAST_ACTIVITY_KEY);
    if (!lastActivity) return true;

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    return timeSinceLastActivity > this.SESSION_TIMEOUT;
  }

  // Update last activity timestamp
  updateActivity() {
    localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
  }

  // Clear room session data
  clearRoomSession() {
    localStorage.removeItem('roomCode');
    localStorage.removeItem('players');
    localStorage.removeItem('isRoomMaster');
    localStorage.removeItem('gameText');
    localStorage.removeItem(this.LAST_ACTIVITY_KEY);
  }

  // Clear all session data
  clearAllSession() {
    this.clearRoomSession();
    localStorage.removeItem('username');
    localStorage.removeItem('language');
    localStorage.removeItem('maxPlayers');
    localStorage.removeItem('gameState');
  }

  // Check if user should be redirected to lobby
  shouldRedirectToLobby(currentPath) {
    const protectedPaths = ['/waiting', '/racing', '/finished'];
    
    if (!protectedPaths.includes(currentPath)) {
      return false;
    }

    // If page was refreshed, always redirect from protected paths
    if (this.isPageRefresh()) {
      console.log('🔄 Page refresh detected on protected path:', currentPath);
      return true;
    }

    // Check session expiration
    if (this.isSessionExpired()) {
      console.log('⏰ Session expired');
      return true;
    }

    // Check if required data exists
    const roomCode = localStorage.getItem('roomCode');
    if (!roomCode && currentPath !== '/lobby') {
      console.log('❌ No room code found');
      return true;
    }

    return false;
  }

  // Initialize session on login
  initializeSession(username) {
    localStorage.setItem('username', username);
    this.updateActivity();
  }

  // Start room session
  startRoomSession(roomCode) {
    localStorage.setItem('roomCode', roomCode);
    this.updateActivity();
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Auto-update activity every minute if page is visible
if (typeof document !== 'undefined') {
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      sessionManager.updateActivity();
    }
  }, 60000); // Every minute
}

export default sessionManager;

class ConnectionManager {
  constructor() {
    this.activeConnections = new Map();
  }

  connect(sessionId, ws) {
    if (!this.activeConnections.has(sessionId)) {
      this.activeConnections.set(sessionId, new Set());
    }
    this.activeConnections.get(sessionId).add(ws);
    console.log(`WebSocket connected for session ${sessionId}`);
  }

  disconnect(sessionId, ws) {
    if (this.activeConnections.has(sessionId)) {
      this.activeConnections.get(sessionId).delete(ws);
      if (this.activeConnections.get(sessionId).size === 0) {
        this.activeConnections.delete(sessionId);
      }
    }
  }

  broadcast(sessionId, message) {
    if (this.activeConnections.has(sessionId)) {
      const payload = JSON.stringify(message);
      this.activeConnections.get(sessionId).forEach(ws => {
        if (ws.readyState === 1) { // OPEN
          ws.send(payload);
        }
      });
    }
  }
}

module.exports = new ConnectionManager();

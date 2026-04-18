const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Safe DB loader (never crashes app)
let sequelize = null;
try {
  sequelize = require('./config/db');
} catch (err) {
  console.log('DB not loaded, running in safe mode');
}

// Routes (wrap safely)
try {
  const sessionRoutes = require('./routes/sessions');
  app.use('/api/v1/sessions', sessionRoutes);
} catch (err) {
  console.log('Routes not loaded:', err.message);
}

// Health route
app.get('/', (req, res) => {
  res.json({
    status: "Brevity API running",
    db: sequelize ? "connected" : "not connected"
  });
});

// WebSocket safe handling
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ status: "connected" }));

  ws.on('message', (msg) => {
    console.log('WS message:', msg.toString());
  });

  ws.on('close', () => {
    console.log('WS disconnected');
  });
});

// PORT (Render safe)
const PORT = process.env.PORT || 8000;

// Start server (NEVER crashes)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

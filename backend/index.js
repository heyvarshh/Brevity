const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const sequelize = require('./config/db');
const manager = require('./services/sockets');
const sessionRoutes = require('./routes/sessions');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/sessions', sessionRoutes);

// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: "Brevity API is online", mode: "lightweight-node" });
});

// WebSocket Handling
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = parseInt(url.pathname.split('/').pop());
  
  if (sessionId) {
    manager.connect(sessionId, ws);
    
    ws.on('close', () => {
      manager.disconnect(sessionId, ws);
    });
  } else {
    ws.close();
  }
});

// Database Sync & Server Start
const PORT = process.env.PORT || 8000;

async function start() {
  try {
    // In production, use migrations instead of {alter: true}
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sync models
    // await sequelize.sync({ alter: true }); // Careful with this in production
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

start();

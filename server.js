const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const DEFAULT_DURATION = 30;
const MAX_HISTORY = 20;

const state = {
  durationSeconds: DEFAULT_DURATION,
  endTime: null, // epoch ms, null = nessuna asta in corso
  lastBidder: null,
  ended: false,
  history: [], // { name, at }
};

let expiryTimer = null;

function scheduleExpiry() {
  if (expiryTimer) clearTimeout(expiryTimer);
  const msLeft = state.endTime - Date.now();
  expiryTimer = setTimeout(() => {
    state.ended = true;
    io.emit('state', publicState());
  }, Math.max(msLeft, 0));
}

function publicState() {
  return {
    durationSeconds: state.durationSeconds,
    endTime: state.endTime,
    lastBidder: state.lastBidder,
    ended: state.ended,
    history: state.history,
    serverNow: Date.now(),
  };
}

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.emit('state', publicState());

  socket.on('setDuration', (seconds) => {
    const n = Math.floor(Number(seconds));
    if (!Number.isFinite(n) || n < 1 || n > 36000) return;
    state.durationSeconds = n;
    io.emit('state', publicState());
  });

  socket.on('bid', (name) => {
    const clean = String(name || '').trim().slice(0, 40);
    if (!clean) return;
    state.endTime = Date.now() + state.durationSeconds * 1000;
    state.lastBidder = clean;
    state.ended = false;
    state.history.unshift({ name: clean, at: Date.now() });
    state.history = state.history.slice(0, MAX_HISTORY);
    scheduleExpiry();
    io.emit('state', publicState());
  });
});

server.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

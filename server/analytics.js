const express = require('express');
const app = express();

app.use(express.json());

// In-memory analytics store
const analytics = {
  sessions: [],
  commands: [],
  videos: []
};

// Track user sessions
app.post('/api/analytics/session', (req, res) => {
  const session = {
    id: Date.now(),
    timestamp: new Date(),
    ...req.body
  };
  analytics.sessions.push(session);
  res.json({ success: true });
});

// Track voice commands
app.post('/api/analytics/command', (req, res) => {
  const command = {
    timestamp: new Date(),
    ...req.body
  };
  analytics.commands.push(command);
  res.json({ success: true });
});

// Get analytics data
app.get('/api/analytics/stats', (req, res) => {
  res.json({
    totalSessions: analytics.sessions.length,
    totalCommands: analytics.commands.length,
    popularCommands: getPopularCommands(),
    avgSessionTime: getAvgSessionTime()
  });
});

function getPopularCommands() {
  const counts = {};
  analytics.commands.forEach(cmd => {
    counts[cmd.command] = (counts[cmd.command] || 0) + 1;
  });
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
}

function getAvgSessionTime() {
  if (analytics.sessions.length === 0) return 0;
  const total = analytics.sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  return total / analytics.sessions.length;
}

module.exports = app;
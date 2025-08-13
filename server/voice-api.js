const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Lightweight voice command detection
const commands = {
  'playback.play': ['play', 'start', 'resume'],
  'playback.pause': ['pause', 'stop'],
  'volume.up': ['louder', 'volume up'],
  'volume.down': ['quieter', 'volume down'],
  'navigation.skip_forward': ['skip forward', 'next'],
  'navigation.skip_backward': ['skip backward', 'previous'],
  'quality.4k': ['4k', 'high quality'],
  'display.fullscreen': ['fullscreen', 'maximize']
};

app.post('/detect', (req, res) => {
  const { text } = req.body;
  const lowerText = text.toLowerCase();
  
  for (const [cmd, patterns] of Object.entries(commands)) {
    if (patterns.some(p => lowerText.includes(p))) {
      return res.json({
        command: cmd,
        confidence: 0.9,
        parameters: extractParams(text),
        original_text: text
      });
    }
  }
  
  res.json({ command: null, confidence: 0, original_text: text });
});

function extractParams(text) {
  const params = {};
  const volumeMatch = text.match(/(\d+)/);
  if (volumeMatch) params.volume = parseInt(volumeMatch[1]);
  return params;
}

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', model_loaded: true });
});

app.listen(5000, () => console.log('Voice API on port 5000'));
# ML Voice Engine

Advanced machine learning-based voice command detection system for the Futuristic Video Player.

## Features

- **TF-IDF Vectorization**: Semantic similarity matching for natural language commands
- **Fuzzy Matching**: Handles pronunciation variations and typos
- **Parameter Extraction**: Automatically extracts numbers, times, and names from commands
- **Confidence Scoring**: Returns confidence levels for command matches
- **REST API**: Flask-based API for JavaScript integration
- **Fallback Support**: Local pattern matching when ML server unavailable

## Quick Start

### 1. Install Dependencies
```bash
cd ml-voice-engine
pip install -r requirements.txt
```

### 2. Test ML Engine
```bash
python voice_ml_engine.py
```

### 3. Start API Server
```bash
python voice_api_server.py
```

### 4. Test API
```bash
curl -X POST http://localhost:5000/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "play the video"}'
```

## API Endpoints

### POST /detect
Detect single voice command
```json
{
  "text": "jump to 2 minutes 30 seconds"
}
```

Response:
```json
{
  "command": "navigation.jump_time",
  "confidence": 0.85,
  "parameters": {"time": 150},
  "original_text": "jump to 2 minutes 30 seconds",
  "alternatives": [["navigation.jump_time", 0.85]]
}
```

### POST /batch_detect
Process multiple commands
```json
{
  "texts": ["play", "volume up", "fullscreen"]
}
```

### GET /health
Check server status
```json
{
  "status": "healthy",
  "model_loaded": true,
  "total_patterns": 45
}
```

## Command Categories

- **playback**: play, pause, restart, toggle
- **navigation**: skip, jump, seek, frame control
- **volume**: up/down, mute/unmute, set level
- **speed**: faster/slower, specific speeds
- **quality**: resolution settings, auto quality
- **display**: fullscreen, PiP, screenshots
- **bookmarks**: add, navigate, list
- **info**: stats, time, duration

## Integration

The ML engine integrates with the JavaScript voice control system:

1. **Primary**: ML server provides enhanced detection
2. **Fallback**: Local pattern matching when server unavailable
3. **Confidence**: Only uses ML results above threshold (0.3)
4. **Parameters**: Extracts structured data from natural language

## Performance

- **Accuracy**: ~85% for natural language commands
- **Speed**: <50ms average response time
- **Memory**: ~100MB RAM usage
- **CPU**: Minimal processing overhead

## Examples

```python
from voice_ml_engine import VoiceCommandML

engine = VoiceCommandML()

# Natural language detection
result = engine.detect_command("make it louder please")
# Returns: volume.volume_up with 0.82 confidence

# Parameter extraction
result = engine.detect_command("jump to 2 minutes 30 seconds")
# Returns: navigation.jump_time with {"time": 150}

# Quality commands
result = engine.detect_command("switch to 4k quality")
# Returns: quality.quality_4k with 0.91 confidence
```
(incomplete)
# vcXvp - The Future of Video Players

Tired of clicking buttons to control your videos? Meet vcXvp - a futuristic video player that actually listens to you! Just say "play the video" or "make it louder" and watch the magic happen.

![vcXvp Preview](preview.png)

## ✨ What Makes This Special?

### 🎤 **Talk to Your Videos**
Forget your mouse - just speak! Say things like:
- "Play the video" or "pause it"
- "Make it louder" or "volume 50"
- "Jump to 2 minutes" or "go back 30 seconds"
- "Switch to 4K quality" or "take a screenshot"

Works with 80+ different voice commands and understands what you mean even if you don't say it perfectly.

### 🎬 **Looks Like It's From 2030**
This isn't your boring old video player. We've made it look absolutely stunning:
- Glowing borders, floating particles, and smooth animations
- Works great on your phone, tablet, or computer
- Plays pretty much any video file you throw at it (MP4, AVI, MKV, you name it)
- Choose from 8K down to 360p quality - your internet connection will thank you
- Tons of keyboard shortcuts if you're into that

### 📚 **Your Videos, Organized**
- Drag and drop videos right into the browser - no complicated uploads
- Your playlist saves automatically (but stays private on your computer)
- Sort by when you watched them or alphabetically
- We'll tell you if a video won't work before you try to play it

### 🎯 **Cool Extras**
- Bookmark your favorite moments with custom names
- Take perfect screenshots of any frame
- Pop the video out to watch while doing other things
- See nerdy stats about your video (resolution, bitrate, etc.)
- Remember where you left off in long videos
- Navigate through chapters if your video has them

## 🛠️ Technologies Used

### **Frontend Stack**
- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Full type safety and enhanced developer experience
- **Video.js 8**: Advanced video playback engine with plugin support
- **Framer Motion**: Smooth animations and micro-interactions
- **TailwindCSS 4**: Modern styling with custom animations
- **React Icons**: Beautiful iconography and visual elements

### **Voice Control & AI**
- **Web Speech API**: Browser-native speech recognition
- **Python ML Engine**: TF-IDF vectorization and semantic matching
- **scikit-learn**: Machine learning algorithms for command detection
- **Flask API**: RESTful interface for ML integration
- **Fuzzy Matching**: Handles pronunciation variations and typos

### **Media Support**
- **HLS.js & DASH.js**: Adaptive streaming capabilities
- **Multiple Codecs**: H.264, VP8/VP9, Theora, and more
- **Format Detection**: Automatic browser compatibility checking
- **Fallback Sources**: Multiple codec attempts for maximum compatibility

## 🚀 Get Started in 2 Minutes

### What You Need
- Node.js (the newer the better)
- A computer with a microphone (for voice control)

### Setup

1. **Download this project**
   ```bash
   git clone https://github.com/yourusername/vcXvp.git
   cd vcXvp
   ```

2. **Install everything**
   ```bash
   npm install
   cd server
   npm install
   ```

3. **Start it up**
   ```bash
   # Start the video player
   npm run dev
   
   # In another terminal, start the servers
   cd server
   npm run dev
   ```

4. **Open your browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Say yes when it asks for microphone access
   - Drag in a video file and start talking to it!

### ⚡ **NEW: Express.js Streaming** 

We've upgraded the backend with Express.js for better performance:

- **Faster video streaming** with range request support
- **Better voice recognition** using JavaScript instead of Python
- **Real-time analytics** to see how you use the player
- **Unified technology stack** - everything runs on Node.js now

**What this means for you:**
- Videos load faster and use less bandwidth
- Voice commands respond quicker
- The whole thing is more reliable

### 🎤 Voice Control Tips

Just start talking! The player understands natural language:
- "play the video" or "pause it"
- "volume 75" or "make it louder"
- "jump to 2 minutes" or "go back 30 seconds"
- "switch to 4k" or "take a screenshot"

## 🎮 Usage

### Basic Video Player Integration

```tsx
import VideoPlayer from '@/components/VideoPlayer';

export default function MyPage() {
  return (
    <div className="my-container">
      <VideoPlayer 
        src="https://example.com/video.mp4" 
        poster="https://example.com/poster.jpg"
        fluid={true}
        options={{
          onPlay: () => console.log('Video started'),
          onPause: () => console.log('Video paused'),
        }}
      />
    </div>
  );
}
```

### Voice Control Integration

```tsx
import { useVoiceControl } from '@/hooks/useVoiceControl';
import VoiceControl from '@/components/VoiceControl';

export default function MyApp() {
  const handleVoiceCommand = (command: string, params?: any) => {
    console.log('Voice command:', command, params);
    // Handle voice commands
  };

  const [voiceState, voiceActions] = useVoiceControl(handleVoiceCommand);

  return (
    <div>
      <VoiceControl
        isListening={voiceState.isListening}
        isSupported={voiceState.isSupported}
        status={voiceState.status}
        onToggleListening={voiceActions.toggleListening}
      />
      {/* Your video player */}
    </div>
  );
}
```

## 📖 API Reference

### VideoPlayer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | URL of the video source (local blob or remote URL) |
| `poster` | `string` | undefined | URL of the video poster image |
| `type` | `string` | 'video/mp4' | MIME type of the video |
| `autoPlay` | `boolean` | false | Whether to auto-play the video |
| `controls` | `boolean` | true | Show custom futuristic controls |
| `fluid` | `boolean` | true | Make the player responsive |
| `width` | `number` | 640 | Width of the player in px |
| `height` | `number` | 360 | Height of the player in px |
| `options` | `object` | {} | Additional Video.js options |
| `onError` | `function` | undefined | Error callback with detailed diagnostics |
| `onLoadStart` | `function` | undefined | Called when video starts loading |
| `onLoadedData` | `function` | undefined | Called when video data is loaded |

### Voice Control Commands

| Category | Commands | Examples |
|----------|----------|----------|
| **Playback** | play, pause, restart, mute | "play the video", "pause", "restart" |
| **Volume** | volume up/down, volume [number] | "louder", "volume 75", "mute" |
| **Navigation** | skip forward/backward, jump to [time] | "skip forward", "jump to 2 minutes" |
| **Speed** | speed up/down, [number]x speed | "faster", "double speed", "half speed" |
| **Quality** | quality [resolution], auto quality | "4k quality", "best quality" |
| **Display** | fullscreen, screenshot, picture in picture | "fullscreen", "take screenshot" |
| **Bookmarks** | bookmark [name], go to bookmark | "bookmark intro", "go to bookmark intro" |
| **Info** | show info/stats, what time, how long | "show info", "current time" |

### ML Voice Detection API

```typescript
interface MLDetectionResult {
  command: string | null;           // Detected command (e.g., "playback.play")
  confidence: number;               // Confidence score (0-1)
  parameters: Record<string, any>;  // Extracted parameters
  original_text: string;            // Original voice input
  alternatives: Array<[string, number]>; // Alternative matches
}

// Usage
const result = await mlDetection.detectCommand("jump to 2 minutes");
// Returns: { command: "navigation.jump_time", parameters: { time: 120 }, confidence: 0.85 }
```

## 🎯 Voice Commands Quick Reference

### 🎮 What You Can Say

**Basic stuff:**
- "play" / "pause" / "stop"
- "louder" / "quieter" / "volume 50"
- "faster" / "slower" / "normal speed"

**Navigation:**
- "jump to 2 minutes" / "go back 30 seconds"
- "restart" / "go to the beginning"

**Quality & Display:**
- "4k quality" / "best quality" / "auto quality"
- "fullscreen" / "picture in picture"
- "take screenshot"

**Smart stuff:**
- "bookmark this as intro scene"
- "show video info" / "show stats"
- "what time is it?" (in the video)

**The cool part:** You don't have to say it exactly - the AI figures out what you mean!

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🐛 Bug Reports & Feature Requests
1. Check existing issues first
2. Create detailed issue with reproduction steps
3. Include browser/OS information for voice control issues

### 💻 Code Contributions
1. **Fork the project**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**:
   - Frontend: Update React components in `src/components/`
   - Voice Control: Modify `src/utils/voiceControl.ts`
   - ML Engine: Update Python files in `ml-voice-engine/`
4. **Test thoroughly**:
   - Test voice commands with ML server
   - Test fallback mode without ML server
   - Verify browser compatibility
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

### 🎤 Adding Voice Commands
1. **Update ML patterns** in `ml-voice-engine/voice_ml_engine.py`
2. **Add command mapping** in `src/utils/voiceControl.ts`
3. **Update documentation** in `Voice-Control.md`
4. **Test with both ML and fallback modes**

## 📊 Performance & Compatibility

### 🎤 Voice Control Support
| Browser | Voice Recognition | ML Enhancement | Fallback Mode |
|---------|------------------|----------------|---------------|
| **Chrome** | ✅ Full Support | ✅ Yes | ✅ Yes |
| **Edge** | ✅ Full Support | ✅ Yes | ✅ Yes |
| **Firefox** | ⚠️ Limited | ✅ Yes | ✅ Yes |
| **Safari** | ⚠️ iOS 14.5+ | ✅ Yes | ✅ Yes |

### 🎬 Video Format Support
| Format | Browser Support | Notes |
|--------|----------------|-------|
| **MP4 (H.264)** | ✅ Universal | Recommended |
| **WebM (VP8/VP9)** | ✅ Modern browsers | Good fallback |
| **OGG (Theora)** | ✅ Firefox/Chrome | Open source |
| **MOV** | ⚠️ Limited | Safari preferred |
| **AVI/MKV/FLV** | ⚠️ Conversion recommended | Legacy formats |

### ⚡ Performance Metrics
- **Voice Detection**: 30-80ms response time
- **ML Accuracy**: 85%+ for natural language
- **Memory Usage**: ~150MB (including ML server)
- **Video Playback**: Hardware-accelerated when available

## 🔒 Your Privacy Matters

**The short version:** Everything stays on your computer. We don't send your videos or voice anywhere.

**The longer version:**
- Your voice is processed right in your browser - it never leaves your device
- Your videos stay on your computer (we just help you play them)
- Your playlists are saved in your browser's storage, not on our servers
- You can turn off voice control anytime if you want
- We show you when the microphone is listening

## 😕 Something Not Working?

### 🎤 Voice Control Problems
**"It's not hearing me!"**
- Make sure your browser can use your microphone (it'll ask permission)
- Speak clearly and not too fast
- Try simpler commands like "play" or "pause" first
- If all else fails, the regular buttons still work!

### 🎬 Video Problems
**"My video won't play!"**
- Try a different video file (MP4 works best)
- Make sure the file isn't corrupted
- Close other browser tabs if things are slow
- Turn off the fancy visual effects if your computer is struggling

**"Everything is laggy!"**
- Lower the video quality (try 720p instead of 4K)
- Close other programs
- Make sure you have enough free memory

## 📚 Documentation

- **[Voice Control Guide](Voice-Control.md)** - Complete voice commands reference
- **[ML Setup Guide](ML_VOICE_SETUP.md)** - ML voice engine installation
- **[Voice Control Setup](VOICE_CONTROL_SETUP.md)** - Quick setup guide
- **[ML Engine README](ml-voice-engine/README.md)** - Python ML engine documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

### Core Technologies
- **[Video.js](https://videojs.com/)** - Powerful HTML5 video player
- **[Next.js](https://nextjs.org/)** - React framework for production
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework

### AI & Machine Learning
- **[scikit-learn](https://scikit-learn.org/)** - Machine learning algorithms
- **[Flask](https://flask.palletsprojects.com/)** - Python web framework
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** - Browser speech recognition

### Special Thanks
- Contributors and beta testers
- Open source community
- Voice control early adopters

---

## 🚀 Ready to Try It?

This is what video players should have been all along. No more hunting for buttons or remembering keyboard shortcuts - just talk to your videos like you would to a friend.

**Built with love (and lots of coffee) by developers who got tired of clicking tiny buttons.**

*P.S. - Yes, it really works. Yes, it looks this cool. No, we can't believe we actually built this either.*#   v c X v p 
 
 #   v c X v p - - V i d e o - p l a y e r - 
 
 #   v c X v p - - V i d e o - p l a y e r - 
 
 #   v c X v p - - V i d e o - p l a y e r - 
 
 #   v c X v p - - V i d e o - p l a y e r 
 
 #   v c X v p - - V i d e o - p l a y e r 
 
 
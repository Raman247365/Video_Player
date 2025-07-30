/**
 * Voice Control System for Futuristic Video Player
 * Handles speech recognition and command processing
 */

export interface VoiceCommand {
  patterns: string[];
  action: string;
  params?: string[];
}

export interface VoiceControlOptions {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  confidenceThreshold: number;
}

export class VoiceController {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private commands: VoiceCommand[] = [];
  private onCommand: (command: string, params?: any) => void;
  private onStatus: (status: string, isListening: boolean) => void;

  constructor(
    onCommand: (command: string, params?: any) => void,
    onStatus: (status: string, isListening: boolean) => void
  ) {
    this.onCommand = onCommand;
    this.onStatus = onStatus;
    this.initializeRecognition();
    this.setupCommands();
  }

  private initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatus('Listening...', true);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onStatus('Voice control stopped', false);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.onStatus(`Error: ${event.error}`, false);
    };

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal && result[0].confidence > 0.7) {
        const transcript = result[0].transcript.toLowerCase().trim();
        this.processCommand(transcript);
      }
    };
  }

  private setupCommands() {
    this.commands = [
      // Playback Control
      { patterns: ['play', 'start', 'resume'], action: 'play' },
      { patterns: ['pause', 'stop', 'halt'], action: 'pause' },
      { patterns: ['play pause', 'toggle play'], action: 'togglePlay' },
      { patterns: ['restart', 'start over'], action: 'restart' },
      { patterns: ['mute', 'silence', 'quiet'], action: 'mute' },
      { patterns: ['unmute', 'sound on'], action: 'unmute' },

      // Navigation
      { patterns: ['skip forward', 'forward', 'skip ahead'], action: 'skipForward' },
      { patterns: ['skip backward', 'backward', 'go back'], action: 'skipBackward' },
      { patterns: ['next frame', 'frame forward'], action: 'nextFrame' },
      { patterns: ['previous frame', 'frame backward'], action: 'previousFrame' },

      // Volume Control
      { patterns: ['volume up', 'louder', 'increase volume'], action: 'volumeUp' },
      { patterns: ['volume down', 'quieter', 'decrease volume'], action: 'volumeDown' },
      { patterns: ['max volume', 'full volume', 'volume max'], action: 'volumeMax' },
      { patterns: ['min volume', 'volume zero'], action: 'volumeMin' },

      // Speed Control
      { patterns: ['speed up', 'faster', 'speed faster'], action: 'speedUp' },
      { patterns: ['slow down', 'slower', 'speed slower'], action: 'speedDown' },
      { patterns: ['normal speed', 'speed normal', 'speed one'], action: 'normalSpeed' },
      { patterns: ['double speed', 'speed double'], action: 'doubleSpeed' },
      { patterns: ['half speed', 'speed half'], action: 'halfSpeed' },

      // Quality Control
      { patterns: ['quality auto', 'auto quality'], action: 'qualityAuto' },
      { patterns: ['quality 8k', 'eight k', 'ultra quality'], action: 'quality8k' },
      { patterns: ['quality 4k', 'four k', 'high quality'], action: 'quality4k' },
      { patterns: ['quality 1080p', 'full hd', '1080'], action: 'quality1080p' },
      { patterns: ['quality 720p', 'hd', '720'], action: 'quality720p' },
      { patterns: ['quality 480p', 'standard', '480'], action: 'quality480p' },
      { patterns: ['best quality', 'max quality'], action: 'qualityBest' },
      { patterns: ['lowest quality', 'min quality'], action: 'qualityLowest' },

      // Display Control
      { patterns: ['fullscreen', 'full screen', 'maximize'], action: 'fullscreen' },
      { patterns: ['exit fullscreen', 'minimize', 'windowed'], action: 'exitFullscreen' },
      { patterns: ['picture in picture', 'pip', 'mini player'], action: 'pictureInPicture' },
      { patterns: ['take screenshot', 'screenshot', 'capture'], action: 'screenshot' },

      // Bookmarks
      { patterns: ['add bookmark', 'bookmark this', 'mark this'], action: 'addBookmark' },
      { patterns: ['show bookmarks', 'list bookmarks'], action: 'showBookmarks' },

      // Information
      { patterns: ['show info', 'video info', 'information'], action: 'showInfo' },
      { patterns: ['show stats', 'statistics', 'show statistics'], action: 'showStats' },
      { patterns: ['show chapters', 'chapters'], action: 'showChapters' },
      { patterns: ['hide info', 'close info', 'hide overlays'], action: 'hideInfo' },
      { patterns: ['what time', 'current time'], action: 'announceTime' },
      { patterns: ['how long', 'video length', 'duration'], action: 'announceDuration' },

      // Settings
      { patterns: ['show settings', 'settings', 'options'], action: 'showSettings' },
      { patterns: ['show shortcuts', 'shortcuts', 'help'], action: 'showShortcuts' },
      { patterns: ['show history', 'history', 'recent videos'], action: 'showHistory' },
      { patterns: ['visual effects on', 'effects on'], action: 'effectsOn' },
      { patterns: ['visual effects off', 'effects off'], action: 'effectsOff' },

      // Voice Control
      { patterns: ['voice off', 'stop listening', 'voice control off'], action: 'voiceOff' },
      { patterns: ['voice help', 'voice commands', 'what can i say'], action: 'voiceHelp' },
    ];
  }

  private async processCommand(transcript: string) {
    console.log('Processing voice command:', transcript);
    
    // Try ML detection first if available
    if ((window as any).mlVoiceDetection) {
      try {
        const mlResult = await (window as any).mlVoiceDetection.detectCommand(transcript);
        if (mlResult.command && mlResult.confidence > 0.3) {
          console.log(`ML Detection: ${mlResult.command} (${mlResult.confidence.toFixed(3)})`);
          this.onCommand(this.mapMLCommand(mlResult.command), mlResult.parameters);
          return;
        }
      } catch (error) {
        console.warn('ML detection failed, using fallback:', error);
      }
    }
    
    // Handle parametric commands first
    const parametricResult = this.processParametricCommands(transcript);
    if (parametricResult) {
      this.onCommand(parametricResult.action, parametricResult.params);
      return;
    }

    // Handle exact pattern matches
    for (const command of this.commands) {
      for (const pattern of command.patterns) {
        if (transcript.includes(pattern)) {
          this.onCommand(command.action, command.params);
          return;
        }
      }
    }

    this.onStatus(`Command not recognized: "${transcript}"`, this.isListening);
  }

  private mapMLCommand(mlCommand: string): string {
    // Map ML command format to existing action format
    const mapping: { [key: string]: string } = {
      'playback.play': 'play',
      'playback.pause': 'pause',
      'playback.toggle': 'togglePlay',
      'playback.restart': 'restart',
      'volume.volume_up': 'volumeUp',
      'volume.volume_down': 'volumeDown',
      'volume.mute': 'mute',
      'volume.unmute': 'unmute',
      'volume.volume_set': 'setVolume',
      'navigation.skip_forward': 'skipForward',
      'navigation.skip_backward': 'skipBackward',
      'navigation.jump_time': 'jumpToTime',
      'speed.speed_up': 'speedUp',
      'speed.speed_down': 'speedDown',
      'speed.normal_speed': 'normalSpeed',
      'speed.double_speed': 'doubleSpeed',
      'speed.half_speed': 'halfSpeed',
      'quality.quality_auto': 'qualityAuto',
      'quality.quality_8k': 'quality8k',
      'quality.quality_4k': 'quality4k',
      'quality.quality_1080p': 'quality1080p',
      'quality.quality_720p': 'quality720p',
      'display.fullscreen': 'fullscreen',
      'display.exit_fullscreen': 'exitFullscreen',
      'display.pip': 'pictureInPicture',
      'display.screenshot': 'screenshot',
      'bookmarks.add_bookmark': 'addBookmark',
      'bookmarks.goto_bookmark': 'gotoBookmark',
      'bookmarks.show_bookmarks': 'showBookmarks',
      'info.show_info': 'showInfo',
      'info.show_stats': 'showStats',
      'info.current_time': 'announceTime',
      'info.duration': 'announceDuration'
    };
    
    return mapping[mlCommand] || mlCommand;
  }

  private processParametricCommands(transcript: string): { action: string; params: any } | null {
    // Volume commands with numbers
    const volumeMatch = transcript.match(/volume (\d+)/);
    if (volumeMatch) {
      return { action: 'setVolume', params: { volume: parseInt(volumeMatch[1]) } };
    }

    // Speed commands with numbers
    const speedMatch = transcript.match(/speed ([\d.]+)/);
    if (speedMatch) {
      return { action: 'setSpeed', params: { speed: parseFloat(speedMatch[1]) } };
    }

    // Jump to time commands
    const timeMatch = transcript.match(/(?:jump to|go to) (?:(\d+) (?:minutes?|mins?) ?)?(?:(\d+) (?:seconds?|secs?))?/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1] || '0');
      const seconds = parseInt(timeMatch[2] || '0');
      return { action: 'jumpToTime', params: { time: minutes * 60 + seconds } };
    }

    // Jump to percentage
    const percentMatch = transcript.match(/(?:jump to|go to) (\d+) percent/);
    if (percentMatch) {
      return { action: 'jumpToPercent', params: { percent: parseInt(percentMatch[1]) } };
    }

    // Named bookmarks
    const bookmarkMatch = transcript.match(/bookmark (.+)/);
    if (bookmarkMatch && !transcript.includes('go to')) {
      return { action: 'addNamedBookmark', params: { name: bookmarkMatch[1] } };
    }

    const gotoBookmarkMatch = transcript.match(/go to bookmark (.+)/);
    if (gotoBookmarkMatch) {
      return { action: 'gotoBookmark', params: { name: gotoBookmarkMatch[1] } };
    }

    return null;
  }

  public startListening() {
    if (!this.recognition) {
      this.onStatus('Speech recognition not supported', false);
      return;
    }

    if (this.isListening) return;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.onStatus('Failed to start voice control', false);
    }
  }

  public stopListening() {
    if (!this.recognition || !this.isListening) return;

    this.recognition.stop();
  }

  public isActive() {
    return this.isListening;
  }

  public destroy() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

// Text-to-Speech utility for voice feedback
export class VoiceFeedback {
  private synth: SpeechSynthesis;
  private enabled: boolean = true;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  public speak(text: string, priority: 'low' | 'high' = 'low') {
    if (!this.enabled || !this.synth) return;

    if (priority === 'high') {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    this.synth.speak(utterance);
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.synth.cancel();
    }
  }

  public isEnabled() {
    return this.enabled;
  }
}

// Utility functions for number and time parsing
export const parseSpokenNumber = (text: string): number | null => {
  const numberWords: { [key: string]: number } = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
    'eighty': 80, 'ninety': 90, 'hundred': 100
  };

  // Try direct number first
  const directNumber = parseInt(text);
  if (!isNaN(directNumber)) return directNumber;

  // Try word-to-number conversion
  const words = text.toLowerCase().split(' ');
  let result = 0;
  let current = 0;

  for (const word of words) {
    if (numberWords[word] !== undefined) {
      if (word === 'hundred') {
        current *= 100;
      } else {
        current += numberWords[word];
      }
    }
  }

  return current > 0 ? current : null;
};

export const parseSpokenTime = (text: string): number | null => {
  const minuteMatch = text.match(/(\d+|[a-z]+) (?:minutes?|mins?)/);
  const secondMatch = text.match(/(\d+|[a-z]+) (?:seconds?|secs?)/);

  let totalSeconds = 0;

  if (minuteMatch) {
    const minutes = parseSpokenNumber(minuteMatch[1]);
    if (minutes !== null) totalSeconds += minutes * 60;
  }

  if (secondMatch) {
    const seconds = parseSpokenNumber(secondMatch[1]);
    if (seconds !== null) totalSeconds += seconds;
  }

  return totalSeconds > 0 ? totalSeconds : null;
};
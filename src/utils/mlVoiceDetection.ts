/**
 * ML-Enhanced Voice Detection Integration
 * Connects JavaScript voice control with Python ML engine
 */

interface MLDetectionResult {
  command: string | null;
  confidence: number;
  parameters: Record<string, any>;
  original_text: string;
  alternatives: Array<[string, number]>;
}

interface MLVoiceConfig {
  apiUrl: string;
  fallbackMode: boolean;
  confidenceThreshold: number;
  useLocalFallback: boolean;
}

export class MLVoiceDetection {
  private config: MLVoiceConfig;
  private isServerAvailable: boolean = false;

  constructor(config: Partial<MLVoiceConfig> = {}) {
    this.config = {
      apiUrl: 'http://localhost:5000',
      fallbackMode: true,
      confidenceThreshold: 0.3,
      useLocalFallback: true,
      ...config
    };
    
    this.checkServerHealth();
  }

  private async checkServerHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        method: 'GET',
        timeout: 2000
      } as RequestInit);
      
      if (response.ok) {
        this.isServerAvailable = true;
        console.log('✅ ML Voice Detection Server Connected');
      }
    } catch (error) {
      this.isServerAvailable = false;
      console.log('⚠️ ML Server unavailable, using local fallback');
    }
  }

  async detectCommand(text: string): Promise<MLDetectionResult> {
    // Try ML server first if available
    if (this.isServerAvailable) {
      try {
        const response = await fetch(`${this.config.apiUrl}/detect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Only return if confidence is above threshold
          if (result.confidence >= this.config.confidenceThreshold) {
            return result;
          }
        }
      } catch (error) {
        console.warn('ML detection failed, falling back to local:', error);
        this.isServerAvailable = false;
      }
    }

    // Fallback to local pattern matching
    if (this.config.useLocalFallback) {
      return this.localPatternMatch(text);
    }

    return {
      command: null,
      confidence: 0,
      parameters: {},
      original_text: text,
      alternatives: []
    };
  }

  private localPatternMatch(text: string): MLDetectionResult {
    const lowerText = text.toLowerCase().trim();
    
    // Enhanced local patterns with confidence scoring
    const patterns = [
      // Playback
      { patterns: ['play', 'start', 'resume'], command: 'playback.play', confidence: 0.9 },
      { patterns: ['pause', 'stop', 'halt'], command: 'playback.pause', confidence: 0.9 },
      { patterns: ['restart', 'start over'], command: 'playback.restart', confidence: 0.8 },
      
      // Volume
      { patterns: ['volume up', 'louder', 'increase volume'], command: 'volume.volume_up', confidence: 0.8 },
      { patterns: ['volume down', 'quieter', 'decrease volume'], command: 'volume.volume_down', confidence: 0.8 },
      { patterns: ['mute', 'silence'], command: 'volume.mute', confidence: 0.9 },
      { patterns: ['unmute', 'sound on'], command: 'volume.unmute', confidence: 0.9 },
      
      // Navigation
      { patterns: ['skip forward', 'forward', 'skip ahead'], command: 'navigation.skip_forward', confidence: 0.8 },
      { patterns: ['skip backward', 'backward', 'go back'], command: 'navigation.skip_backward', confidence: 0.8 },
      { patterns: ['jump to', 'go to', 'seek to'], command: 'navigation.jump_time', confidence: 0.7 },
      
      // Speed
      { patterns: ['speed up', 'faster'], command: 'speed.speed_up', confidence: 0.8 },
      { patterns: ['slow down', 'slower'], command: 'speed.speed_down', confidence: 0.8 },
      { patterns: ['normal speed', 'regular speed'], command: 'speed.normal_speed', confidence: 0.8 },
      { patterns: ['double speed', 'two x'], command: 'speed.double_speed', confidence: 0.8 },
      { patterns: ['half speed', 'slow motion'], command: 'speed.half_speed', confidence: 0.8 },
      
      // Quality
      { patterns: ['quality auto', 'auto quality'], command: 'quality.quality_auto', confidence: 0.8 },
      { patterns: ['8k', 'eight k', 'ultra quality'], command: 'quality.quality_8k', confidence: 0.9 },
      { patterns: ['4k', 'four k', 'ultra hd'], command: 'quality.quality_4k', confidence: 0.9 },
      { patterns: ['1080p', 'full hd'], command: 'quality.quality_1080p', confidence: 0.9 },
      { patterns: ['720p', 'hd'], command: 'quality.quality_720p', confidence: 0.9 },
      
      // Display
      { patterns: ['fullscreen', 'full screen', 'maximize'], command: 'display.fullscreen', confidence: 0.9 },
      { patterns: ['exit fullscreen', 'minimize'], command: 'display.exit_fullscreen', confidence: 0.8 },
      { patterns: ['picture in picture', 'pip'], command: 'display.pip', confidence: 0.9 },
      { patterns: ['screenshot', 'capture', 'take picture'], command: 'display.screenshot', confidence: 0.8 },
      
      // Bookmarks
      { patterns: ['add bookmark', 'bookmark this'], command: 'bookmarks.add_bookmark', confidence: 0.8 },
      { patterns: ['show bookmarks', 'list bookmarks'], command: 'bookmarks.show_bookmarks', confidence: 0.8 },
      
      // Info
      { patterns: ['show info', 'video info'], command: 'info.show_info', confidence: 0.8 },
      { patterns: ['show stats', 'statistics'], command: 'info.show_stats', confidence: 0.8 },
      { patterns: ['what time', 'current time'], command: 'info.current_time', confidence: 0.8 },
      { patterns: ['how long', 'duration'], command: 'info.duration', confidence: 0.8 },
    ];

    // Find best match using fuzzy matching
    let bestMatch = { command: null, confidence: 0, patterns: [] };
    
    for (const pattern of patterns) {
      for (const p of pattern.patterns) {
        if (lowerText.includes(p)) {
          const confidence = this.calculateFuzzyScore(lowerText, p) * pattern.confidence;
          if (confidence > bestMatch.confidence) {
            bestMatch = { ...pattern, confidence };
          }
        }
      }
    }

    // Extract parameters
    const parameters = this.extractParameters(text);

    return {
      command: bestMatch.command,
      confidence: bestMatch.confidence,
      parameters,
      original_text: text,
      alternatives: []
    };
  }

  private calculateFuzzyScore(text: string, pattern: string): number {
    // Simple fuzzy matching score
    if (text === pattern) return 1.0;
    if (text.includes(pattern)) return 0.9;
    
    // Levenshtein distance approximation
    const longer = text.length > pattern.length ? text : pattern;
    const shorter = text.length > pattern.length ? pattern : text;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private extractParameters(text: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract numbers
    const numbers = text.match(/\b(\d+(?:\.\d+)?)\b/g);
    if (numbers) {
      params.number = parseFloat(numbers[0]);
    }
    
    // Extract time patterns
    const timeMatch = text.match(/(\d+)\s*(?:minutes?|mins?)\s*(?:(\d+)\s*(?:seconds?|secs?))?/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      params.time = minutes * 60 + seconds;
    }
    
    // Extract percentage
    const percentMatch = text.match(/(\d+)\s*(?:percent|%)/);
    if (percentMatch) {
      params.percent = parseInt(percentMatch[1]);
    }
    
    // Extract bookmark names
    const bookmarkMatch = text.match(/bookmark\s+(.+?)(?:\s+at|\s*$)/);
    if (bookmarkMatch) {
      params.bookmark_name = bookmarkMatch[1].trim();
    }
    
    return params;
  }

  async batchDetect(texts: string[]): Promise<MLDetectionResult[]> {
    if (this.isServerAvailable) {
      try {
        const response = await fetch(`${this.config.apiUrl}/batch_detect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ texts }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.results;
        }
      } catch (error) {
        console.warn('Batch ML detection failed:', error);
      }
    }

    // Fallback to individual local processing
    return Promise.all(texts.map(text => this.localPatternMatch(text)));
  }

  setConfidenceThreshold(threshold: number): void {
    this.config.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  getServerStatus(): boolean {
    return this.isServerAvailable;
  }
}
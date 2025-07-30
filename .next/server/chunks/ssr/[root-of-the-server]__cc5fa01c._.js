module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/utils/voiceControl.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Voice Control System for Futuristic Video Player
 * Handles speech recognition and command processing
 */ __turbopack_context__.s({
    "VoiceController": (()=>VoiceController),
    "VoiceFeedback": (()=>VoiceFeedback),
    "parseSpokenNumber": (()=>parseSpokenNumber),
    "parseSpokenTime": (()=>parseSpokenTime)
});
class VoiceController {
    recognition = null;
    isListening = false;
    commands = [];
    onCommand;
    onStatus;
    constructor(onCommand, onStatus){
        this.onCommand = onCommand;
        this.onStatus = onStatus;
        this.initializeRecognition();
        this.setupCommands();
    }
    initializeRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.onstart = ()=>{
            this.isListening = true;
            this.onStatus('Listening...', true);
        };
        this.recognition.onend = ()=>{
            this.isListening = false;
            this.onStatus('Voice control stopped', false);
        };
        this.recognition.onerror = (event)=>{
            console.error('Speech recognition error:', event.error);
            this.onStatus(`Error: ${event.error}`, false);
        };
        this.recognition.onresult = (event)=>{
            const result = event.results[event.results.length - 1];
            if (result.isFinal && result[0].confidence > 0.7) {
                const transcript = result[0].transcript.toLowerCase().trim();
                this.processCommand(transcript);
            }
        };
    }
    setupCommands() {
        this.commands = [
            // Playback Control
            {
                patterns: [
                    'play',
                    'start',
                    'resume'
                ],
                action: 'play'
            },
            {
                patterns: [
                    'pause',
                    'stop',
                    'halt'
                ],
                action: 'pause'
            },
            {
                patterns: [
                    'play pause',
                    'toggle play'
                ],
                action: 'togglePlay'
            },
            {
                patterns: [
                    'restart',
                    'start over'
                ],
                action: 'restart'
            },
            {
                patterns: [
                    'mute',
                    'silence',
                    'quiet'
                ],
                action: 'mute'
            },
            {
                patterns: [
                    'unmute',
                    'sound on'
                ],
                action: 'unmute'
            },
            // Navigation
            {
                patterns: [
                    'skip forward',
                    'forward',
                    'skip ahead'
                ],
                action: 'skipForward'
            },
            {
                patterns: [
                    'skip backward',
                    'backward',
                    'go back'
                ],
                action: 'skipBackward'
            },
            {
                patterns: [
                    'next frame',
                    'frame forward'
                ],
                action: 'nextFrame'
            },
            {
                patterns: [
                    'previous frame',
                    'frame backward'
                ],
                action: 'previousFrame'
            },
            // Volume Control
            {
                patterns: [
                    'volume up',
                    'louder',
                    'increase volume'
                ],
                action: 'volumeUp'
            },
            {
                patterns: [
                    'volume down',
                    'quieter',
                    'decrease volume'
                ],
                action: 'volumeDown'
            },
            {
                patterns: [
                    'max volume',
                    'full volume',
                    'volume max'
                ],
                action: 'volumeMax'
            },
            {
                patterns: [
                    'min volume',
                    'volume zero'
                ],
                action: 'volumeMin'
            },
            // Speed Control
            {
                patterns: [
                    'speed up',
                    'faster',
                    'speed faster'
                ],
                action: 'speedUp'
            },
            {
                patterns: [
                    'slow down',
                    'slower',
                    'speed slower'
                ],
                action: 'speedDown'
            },
            {
                patterns: [
                    'normal speed',
                    'speed normal',
                    'speed one'
                ],
                action: 'normalSpeed'
            },
            {
                patterns: [
                    'double speed',
                    'speed double'
                ],
                action: 'doubleSpeed'
            },
            {
                patterns: [
                    'half speed',
                    'speed half'
                ],
                action: 'halfSpeed'
            },
            // Quality Control
            {
                patterns: [
                    'quality auto',
                    'auto quality'
                ],
                action: 'qualityAuto'
            },
            {
                patterns: [
                    'quality 8k',
                    'eight k',
                    'ultra quality'
                ],
                action: 'quality8k'
            },
            {
                patterns: [
                    'quality 4k',
                    'four k',
                    'high quality'
                ],
                action: 'quality4k'
            },
            {
                patterns: [
                    'quality 1080p',
                    'full hd',
                    '1080'
                ],
                action: 'quality1080p'
            },
            {
                patterns: [
                    'quality 720p',
                    'hd',
                    '720'
                ],
                action: 'quality720p'
            },
            {
                patterns: [
                    'quality 480p',
                    'standard',
                    '480'
                ],
                action: 'quality480p'
            },
            {
                patterns: [
                    'best quality',
                    'max quality'
                ],
                action: 'qualityBest'
            },
            {
                patterns: [
                    'lowest quality',
                    'min quality'
                ],
                action: 'qualityLowest'
            },
            // Display Control
            {
                patterns: [
                    'fullscreen',
                    'full screen',
                    'maximize'
                ],
                action: 'fullscreen'
            },
            {
                patterns: [
                    'exit fullscreen',
                    'minimize',
                    'windowed'
                ],
                action: 'exitFullscreen'
            },
            {
                patterns: [
                    'picture in picture',
                    'pip',
                    'mini player'
                ],
                action: 'pictureInPicture'
            },
            {
                patterns: [
                    'take screenshot',
                    'screenshot',
                    'capture'
                ],
                action: 'screenshot'
            },
            // Bookmarks
            {
                patterns: [
                    'add bookmark',
                    'bookmark this',
                    'mark this'
                ],
                action: 'addBookmark'
            },
            {
                patterns: [
                    'show bookmarks',
                    'list bookmarks'
                ],
                action: 'showBookmarks'
            },
            // Information
            {
                patterns: [
                    'show info',
                    'video info',
                    'information'
                ],
                action: 'showInfo'
            },
            {
                patterns: [
                    'show stats',
                    'statistics',
                    'show statistics'
                ],
                action: 'showStats'
            },
            {
                patterns: [
                    'show chapters',
                    'chapters'
                ],
                action: 'showChapters'
            },
            {
                patterns: [
                    'hide info',
                    'close info',
                    'hide overlays'
                ],
                action: 'hideInfo'
            },
            {
                patterns: [
                    'what time',
                    'current time'
                ],
                action: 'announceTime'
            },
            {
                patterns: [
                    'how long',
                    'video length',
                    'duration'
                ],
                action: 'announceDuration'
            },
            // Settings
            {
                patterns: [
                    'show settings',
                    'settings',
                    'options'
                ],
                action: 'showSettings'
            },
            {
                patterns: [
                    'show shortcuts',
                    'shortcuts',
                    'help'
                ],
                action: 'showShortcuts'
            },
            {
                patterns: [
                    'show history',
                    'history',
                    'recent videos'
                ],
                action: 'showHistory'
            },
            {
                patterns: [
                    'visual effects on',
                    'effects on'
                ],
                action: 'effectsOn'
            },
            {
                patterns: [
                    'visual effects off',
                    'effects off'
                ],
                action: 'effectsOff'
            },
            // Voice Control
            {
                patterns: [
                    'voice off',
                    'stop listening',
                    'voice control off'
                ],
                action: 'voiceOff'
            },
            {
                patterns: [
                    'voice help',
                    'voice commands',
                    'what can i say'
                ],
                action: 'voiceHelp'
            }
        ];
    }
    async processCommand(transcript) {
        console.log('Processing voice command:', transcript);
        // Try ML detection first if available
        if (window.mlVoiceDetection) {
            try {
                const mlResult = await window.mlVoiceDetection.detectCommand(transcript);
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
        for (const command of this.commands){
            for (const pattern of command.patterns){
                if (transcript.includes(pattern)) {
                    this.onCommand(command.action, command.params);
                    return;
                }
            }
        }
        this.onStatus(`Command not recognized: "${transcript}"`, this.isListening);
    }
    mapMLCommand(mlCommand) {
        // Map ML command format to existing action format
        const mapping = {
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
    processParametricCommands(transcript) {
        // Volume commands with numbers
        const volumeMatch = transcript.match(/volume (\d+)/);
        if (volumeMatch) {
            return {
                action: 'setVolume',
                params: {
                    volume: parseInt(volumeMatch[1])
                }
            };
        }
        // Speed commands with numbers
        const speedMatch = transcript.match(/speed ([\d.]+)/);
        if (speedMatch) {
            return {
                action: 'setSpeed',
                params: {
                    speed: parseFloat(speedMatch[1])
                }
            };
        }
        // Jump to time commands
        const timeMatch = transcript.match(/(?:jump to|go to) (?:(\d+) (?:minutes?|mins?) ?)?(?:(\d+) (?:seconds?|secs?))?/);
        if (timeMatch) {
            const minutes = parseInt(timeMatch[1] || '0');
            const seconds = parseInt(timeMatch[2] || '0');
            return {
                action: 'jumpToTime',
                params: {
                    time: minutes * 60 + seconds
                }
            };
        }
        // Jump to percentage
        const percentMatch = transcript.match(/(?:jump to|go to) (\d+) percent/);
        if (percentMatch) {
            return {
                action: 'jumpToPercent',
                params: {
                    percent: parseInt(percentMatch[1])
                }
            };
        }
        // Named bookmarks
        const bookmarkMatch = transcript.match(/bookmark (.+)/);
        if (bookmarkMatch && !transcript.includes('go to')) {
            return {
                action: 'addNamedBookmark',
                params: {
                    name: bookmarkMatch[1]
                }
            };
        }
        const gotoBookmarkMatch = transcript.match(/go to bookmark (.+)/);
        if (gotoBookmarkMatch) {
            return {
                action: 'gotoBookmark',
                params: {
                    name: gotoBookmarkMatch[1]
                }
            };
        }
        return null;
    }
    startListening() {
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
    stopListening() {
        if (!this.recognition || !this.isListening) return;
        this.recognition.stop();
    }
    isActive() {
        return this.isListening;
    }
    destroy() {
        if (this.recognition) {
            this.recognition.stop();
            this.recognition = null;
        }
    }
}
class VoiceFeedback {
    synth;
    enabled = true;
    constructor(){
        this.synth = window.speechSynthesis;
    }
    speak(text, priority = 'low') {
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
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.synth.cancel();
        }
    }
    isEnabled() {
        return this.enabled;
    }
}
const parseSpokenNumber = (text)=>{
    const numberWords = {
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'ten': 10,
        'eleven': 11,
        'twelve': 12,
        'thirteen': 13,
        'fourteen': 14,
        'fifteen': 15,
        'sixteen': 16,
        'seventeen': 17,
        'eighteen': 18,
        'nineteen': 19,
        'twenty': 20,
        'thirty': 30,
        'forty': 40,
        'fifty': 50,
        'sixty': 60,
        'seventy': 70,
        'eighty': 80,
        'ninety': 90,
        'hundred': 100
    };
    // Try direct number first
    const directNumber = parseInt(text);
    if (!isNaN(directNumber)) return directNumber;
    // Try word-to-number conversion
    const words = text.toLowerCase().split(' ');
    let result = 0;
    let current = 0;
    for (const word of words){
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
const parseSpokenTime = (text)=>{
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
}}),
"[project]/src/utils/mlVoiceDetection.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * ML-Enhanced Voice Detection Integration
 * Connects JavaScript voice control with Python ML engine
 */ __turbopack_context__.s({
    "MLVoiceDetection": (()=>MLVoiceDetection)
});
class MLVoiceDetection {
    config;
    isServerAvailable = false;
    constructor(config = {}){
        this.config = {
            apiUrl: 'http://localhost:5000',
            fallbackMode: true,
            confidenceThreshold: 0.3,
            useLocalFallback: true,
            ...config
        };
        this.checkServerHealth();
    }
    async checkServerHealth() {
        try {
            const response = await fetch(`${this.config.apiUrl}/health`, {
                method: 'GET',
                timeout: 2000
            });
            if (response.ok) {
                this.isServerAvailable = true;
                console.log('✅ ML Voice Detection Server Connected');
            }
        } catch (error) {
            this.isServerAvailable = false;
            console.log('⚠️ ML Server unavailable, using local fallback');
        }
    }
    async detectCommand(text) {
        // Try ML server first if available
        if (this.isServerAvailable) {
            try {
                const response = await fetch(`${this.config.apiUrl}/detect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text
                    })
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
    localPatternMatch(text) {
        const lowerText = text.toLowerCase().trim();
        // Enhanced local patterns with confidence scoring
        const patterns = [
            // Playback
            {
                patterns: [
                    'play',
                    'start',
                    'resume'
                ],
                command: 'playback.play',
                confidence: 0.9
            },
            {
                patterns: [
                    'pause',
                    'stop',
                    'halt'
                ],
                command: 'playback.pause',
                confidence: 0.9
            },
            {
                patterns: [
                    'restart',
                    'start over'
                ],
                command: 'playback.restart',
                confidence: 0.8
            },
            // Volume
            {
                patterns: [
                    'volume up',
                    'louder',
                    'increase volume'
                ],
                command: 'volume.volume_up',
                confidence: 0.8
            },
            {
                patterns: [
                    'volume down',
                    'quieter',
                    'decrease volume'
                ],
                command: 'volume.volume_down',
                confidence: 0.8
            },
            {
                patterns: [
                    'mute',
                    'silence'
                ],
                command: 'volume.mute',
                confidence: 0.9
            },
            {
                patterns: [
                    'unmute',
                    'sound on'
                ],
                command: 'volume.unmute',
                confidence: 0.9
            },
            // Navigation
            {
                patterns: [
                    'skip forward',
                    'forward',
                    'skip ahead'
                ],
                command: 'navigation.skip_forward',
                confidence: 0.8
            },
            {
                patterns: [
                    'skip backward',
                    'backward',
                    'go back'
                ],
                command: 'navigation.skip_backward',
                confidence: 0.8
            },
            {
                patterns: [
                    'jump to',
                    'go to',
                    'seek to'
                ],
                command: 'navigation.jump_time',
                confidence: 0.7
            },
            // Speed
            {
                patterns: [
                    'speed up',
                    'faster'
                ],
                command: 'speed.speed_up',
                confidence: 0.8
            },
            {
                patterns: [
                    'slow down',
                    'slower'
                ],
                command: 'speed.speed_down',
                confidence: 0.8
            },
            {
                patterns: [
                    'normal speed',
                    'regular speed'
                ],
                command: 'speed.normal_speed',
                confidence: 0.8
            },
            {
                patterns: [
                    'double speed',
                    'two x'
                ],
                command: 'speed.double_speed',
                confidence: 0.8
            },
            {
                patterns: [
                    'half speed',
                    'slow motion'
                ],
                command: 'speed.half_speed',
                confidence: 0.8
            },
            // Quality
            {
                patterns: [
                    'quality auto',
                    'auto quality'
                ],
                command: 'quality.quality_auto',
                confidence: 0.8
            },
            {
                patterns: [
                    '8k',
                    'eight k',
                    'ultra quality'
                ],
                command: 'quality.quality_8k',
                confidence: 0.9
            },
            {
                patterns: [
                    '4k',
                    'four k',
                    'ultra hd'
                ],
                command: 'quality.quality_4k',
                confidence: 0.9
            },
            {
                patterns: [
                    '1080p',
                    'full hd'
                ],
                command: 'quality.quality_1080p',
                confidence: 0.9
            },
            {
                patterns: [
                    '720p',
                    'hd'
                ],
                command: 'quality.quality_720p',
                confidence: 0.9
            },
            // Display
            {
                patterns: [
                    'fullscreen',
                    'full screen',
                    'maximize'
                ],
                command: 'display.fullscreen',
                confidence: 0.9
            },
            {
                patterns: [
                    'exit fullscreen',
                    'minimize'
                ],
                command: 'display.exit_fullscreen',
                confidence: 0.8
            },
            {
                patterns: [
                    'picture in picture',
                    'pip'
                ],
                command: 'display.pip',
                confidence: 0.9
            },
            {
                patterns: [
                    'screenshot',
                    'capture',
                    'take picture'
                ],
                command: 'display.screenshot',
                confidence: 0.8
            },
            // Bookmarks
            {
                patterns: [
                    'add bookmark',
                    'bookmark this'
                ],
                command: 'bookmarks.add_bookmark',
                confidence: 0.8
            },
            {
                patterns: [
                    'show bookmarks',
                    'list bookmarks'
                ],
                command: 'bookmarks.show_bookmarks',
                confidence: 0.8
            },
            // Info
            {
                patterns: [
                    'show info',
                    'video info'
                ],
                command: 'info.show_info',
                confidence: 0.8
            },
            {
                patterns: [
                    'show stats',
                    'statistics'
                ],
                command: 'info.show_stats',
                confidence: 0.8
            },
            {
                patterns: [
                    'what time',
                    'current time'
                ],
                command: 'info.current_time',
                confidence: 0.8
            },
            {
                patterns: [
                    'how long',
                    'duration'
                ],
                command: 'info.duration',
                confidence: 0.8
            }
        ];
        // Find best match using fuzzy matching
        let bestMatch = {
            command: null,
            confidence: 0,
            patterns: []
        };
        for (const pattern of patterns){
            for (const p of pattern.patterns){
                if (lowerText.includes(p)) {
                    const confidence = this.calculateFuzzyScore(lowerText, p) * pattern.confidence;
                    if (confidence > bestMatch.confidence) {
                        bestMatch = {
                            ...pattern,
                            confidence
                        };
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
    calculateFuzzyScore(text, pattern) {
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
    levenshteinDistance(str1, str2) {
        const matrix = [];
        for(let i = 0; i <= str2.length; i++){
            matrix[i] = [
                i
            ];
        }
        for(let j = 0; j <= str1.length; j++){
            matrix[0][j] = j;
        }
        for(let i = 1; i <= str2.length; i++){
            for(let j = 1; j <= str1.length; j++){
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[str2.length][str1.length];
    }
    extractParameters(text) {
        const params = {};
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
    async batchDetect(texts) {
        if (this.isServerAvailable) {
            try {
                const response = await fetch(`${this.config.apiUrl}/batch_detect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        texts
                    })
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
        return Promise.all(texts.map((text)=>this.localPatternMatch(text)));
    }
    setConfidenceThreshold(threshold) {
        this.config.confidenceThreshold = Math.max(0, Math.min(1, threshold));
    }
    getServerStatus() {
        return this.isServerAvailable;
    }
}
}}),
"[project]/src/hooks/useVoiceControl.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * React hook for voice control integration
 */ __turbopack_context__.s({
    "useVoiceControl": (()=>useVoiceControl)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$voiceControl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/voiceControl.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mlVoiceDetection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/mlVoiceDetection.ts [app-ssr] (ecmascript)");
;
;
;
const useVoiceControl = (onCommand)=>{
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isListening: false,
        isSupported: false,
        status: 'Voice control ready',
        lastCommand: null
    });
    const voiceController = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const voiceFeedback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mlDetection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((command, params)=>{
        setState((prev)=>({
                ...prev,
                lastCommand: command
            }));
        onCommand(command, params);
        // Provide voice feedback
        if (voiceFeedback.current?.isEnabled()) {
            const feedbackText = getCommandFeedback(command, params);
            if (feedbackText) {
                voiceFeedback.current.speak(feedbackText);
            }
        }
    }, [
        onCommand
    ]);
    const handleStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((status, isListening)=>{
        setState((prev)=>({
                ...prev,
                status,
                isListening
            }));
    }, []);
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        voiceController.current?.startListening();
    }, []);
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        voiceController.current?.stopListening();
    }, []);
    const toggleListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (state.isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [
        state.isListening,
        startListening,
        stopListening
    ]);
    const setVoiceFeedback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((enabled)=>{
        voiceFeedback.current?.setEnabled(enabled);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if speech recognition is supported
        const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        setState((prev)=>({
                ...prev,
                isSupported
            }));
        if (isSupported) {
            voiceController.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$voiceControl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VoiceController"](handleCommand, handleStatus);
            voiceFeedback.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$voiceControl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VoiceFeedback"]();
            mlDetection.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mlVoiceDetection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MLVoiceDetection"]();
            // Make ML detection globally available
            window.mlVoiceDetection = mlDetection.current;
        }
        return ()=>{
            voiceController.current?.destroy();
        };
    }, [
        handleCommand,
        handleStatus
    ]);
    return [
        state,
        {
            startListening,
            stopListening,
            toggleListening,
            setVoiceFeedback
        }
    ];
};
// Helper function to generate voice feedback text
const getCommandFeedback = (command, params)=>{
    const feedbackMap = {
        play: 'Playing',
        pause: 'Paused',
        togglePlay: 'Toggled playback',
        restart: 'Restarting video',
        mute: 'Muted',
        unmute: 'Unmuted',
        skipForward: 'Skipped forward',
        skipBackward: 'Skipped backward',
        volumeUp: 'Volume increased',
        volumeDown: 'Volume decreased',
        volumeMax: 'Volume at maximum',
        volumeMin: 'Volume at minimum',
        speedUp: 'Speed increased',
        speedDown: 'Speed decreased',
        normalSpeed: 'Normal speed',
        doubleSpeed: 'Double speed',
        halfSpeed: 'Half speed',
        fullscreen: 'Fullscreen mode',
        exitFullscreen: 'Exited fullscreen',
        pictureInPicture: 'Picture in picture mode',
        screenshot: 'Screenshot taken',
        addBookmark: 'Bookmark added',
        showInfo: 'Showing video information',
        showStats: 'Showing statistics',
        showSettings: 'Opening settings',
        voiceOff: 'Voice control disabled'
    };
    if (params) {
        switch(command){
            case 'setVolume':
                return `Volume set to ${params.volume} percent`;
            case 'setSpeed':
                return `Speed set to ${params.speed}x`;
            case 'jumpToTime':
                return `Jumped to ${Math.floor(params.time / 60)} minutes ${params.time % 60} seconds`;
            case 'jumpToPercent':
                return `Jumped to ${params.percent} percent`;
            case 'addNamedBookmark':
                return `Bookmark "${params.name}" added`;
            case 'gotoBookmark':
                return `Jumped to bookmark "${params.name}"`;
            default:
                return feedbackMap[command] || null;
        }
    }
    return feedbackMap[command] || null;
};
}}),
"[project]/src/components/VoiceControl.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const VoiceControl = ({ isListening, isSupported, status, lastCommand, voiceFeedbackEnabled, onToggleListening, onToggleVoiceFeedback, onShowCommands })=>{
    if (!isSupported) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "voice-control-unsupported",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-gray-500 text-sm",
                children: "Voice control not supported"
            }, void 0, false, {
                fileName: "[project]/src/components/VoiceControl.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/VoiceControl.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-420de37d64a028ce" + " " + "voice-control-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                className: `voice-control-button ${isListening ? 'listening' : ''}`,
                onClick: onToggleListening,
                whileHover: {
                    scale: 1.1
                },
                whileTap: {
                    scale: 0.9
                },
                title: isListening ? 'Stop voice control' : 'Start voice control',
                children: [
                    isListening ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMicrophone"], {}, void 0, false, {
                        fileName: "[project]/src/components/VoiceControl.tsx",
                        lineNumber: 46,
                        columnNumber: 24
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaMicrophoneSlash"], {}, void 0, false, {
                        fileName: "[project]/src/components/VoiceControl.tsx",
                        lineNumber: 46,
                        columnNumber: 43
                    }, this),
                    isListening && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "listening-pulse",
                        animate: {
                            scale: [
                                1,
                                1.5,
                                1
                            ],
                            opacity: [
                                0.5,
                                0.8,
                                0.5
                            ]
                        },
                        transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/VoiceControl.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/VoiceControl.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                className: "voice-feedback-button",
                onClick: onToggleVoiceFeedback,
                whileHover: {
                    scale: 1.1
                },
                whileTap: {
                    scale: 0.9
                },
                title: voiceFeedbackEnabled ? 'Disable voice feedback' : 'Enable voice feedback',
                children: voiceFeedbackEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaVolumeUp"], {}, void 0, false, {
                    fileName: "[project]/src/components/VoiceControl.tsx",
                    lineNumber: 73,
                    columnNumber: 33
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaVolumeOff"], {}, void 0, false, {
                    fileName: "[project]/src/components/VoiceControl.tsx",
                    lineNumber: 73,
                    columnNumber: 50
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/VoiceControl.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                className: "voice-help-button",
                onClick: onShowCommands,
                whileHover: {
                    scale: 1.1
                },
                whileTap: {
                    scale: 0.9
                },
                title: "Show voice commands",
                children: "?"
            }, void 0, false, {
                fileName: "[project]/src/components/VoiceControl.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: (isListening || lastCommand) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "voice-status",
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    transition: {
                        duration: 0.3
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-420de37d64a028ce" + " " + "status-text",
                            children: status
                        }, void 0, false, {
                            fileName: "[project]/src/components/VoiceControl.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this),
                        lastCommand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-420de37d64a028ce" + " " + "last-command",
                            children: [
                                "Last: ",
                                lastCommand
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VoiceControl.tsx",
                            lineNumber: 99,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/VoiceControl.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/VoiceControl.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            isListening && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VoiceWaveform, {}, void 0, false, {
                fileName: "[project]/src/components/VoiceControl.tsx",
                lineNumber: 106,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "420de37d64a028ce",
                children: ".voice-control-container.jsx-420de37d64a028ce{align-items:center;gap:8px;display:flex;position:relative}.voice-control-button.jsx-420de37d64a028ce{color:#fff;cursor:pointer;background:#0009;border:2px solid #ffffff4d;border-radius:50%;justify-content:center;align-items:center;width:40px;height:40px;transition:all .3s;display:flex;position:relative;overflow:hidden}.voice-control-button.jsx-420de37d64a028ce:hover{background:#000c;border-color:#fff9}.voice-control-button.listening.jsx-420de37d64a028ce{color:#0f0;background:#00ff001a;border-color:#0f0;box-shadow:0 0 20px #00ff004d}.listening-pulse.jsx-420de37d64a028ce{pointer-events:none;border:2px solid #0f0;border-radius:50%;position:absolute;inset:-2px}.voice-feedback-button.jsx-420de37d64a028ce,.voice-help-button.jsx-420de37d64a028ce{color:#fff;cursor:pointer;background:#0009;border:1px solid #ffffff4d;border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;font-size:12px;transition:all .3s;display:flex}.voice-feedback-button.jsx-420de37d64a028ce:hover,.voice-help-button.jsx-420de37d64a028ce:hover{background:#000c;border-color:#fff9}.voice-status.jsx-420de37d64a028ce{backdrop-filter:blur(10px);background:#000000e6;border:1px solid #ffffff4d;border-radius:8px;min-width:200px;padding:8px 12px;position:absolute;top:-60px;left:0}.status-text.jsx-420de37d64a028ce{color:#0f0;margin-bottom:4px;font-size:12px;font-weight:500}.last-command.jsx-420de37d64a028ce{color:#ffffffb3;font-size:11px}.voice-control-unsupported.jsx-420de37d64a028ce{background:#ff00001a;border:1px solid #ff00004d;border-radius:4px;align-items:center;padding:4px 8px;display:flex}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/VoiceControl.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
};
// Voice waveform visualization component
const VoiceWaveform = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-5fbdae3a054233bc" + " " + "voice-waveform",
        children: [
            [
                ...Array(5)
            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "waveform-bar",
                    animate: {
                        scaleY: [
                            0.3,
                            1,
                            0.3
                        ]
                    },
                    transition: {
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }
                }, i, false, {
                    fileName: "[project]/src/components/VoiceControl.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "5fbdae3a054233bc",
                children: ".voice-waveform.jsx-5fbdae3a054233bc{align-items:end;gap:2px;height:20px;display:flex;position:absolute;top:-30px;left:50%;transform:translate(-50%)}.waveform-bar.jsx-5fbdae3a054233bc{transform-origin:bottom;background:#0f0;border-radius:1px;width:3px;height:100%}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/VoiceControl.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = VoiceControl;
}}),
"[project]/src/components/Navbar.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useVoiceControl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useVoiceControl.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$VoiceControl$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/VoiceControl.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const Navbar = ()=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoverIndex, setHoverIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleVoiceCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((command, params)=>{
        console.log('Navbar voice command:', command, params);
    }, []);
    const [voiceState, voiceActions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useVoiceControl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVoiceControl"])(handleVoiceCommand);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
        };
    }, [
        scrolled
    ]);
    const navItems = [
        {
            name: 'Home',
            path: '/'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0 relative group",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "text-white font-bold text-xl flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "vX"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 51,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 53,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -top-1 right-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 delay-100"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 54,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -left-1 top-0 h-0 w-[1px] bg-white group-hover:h-full transition-all duration-300 delay-200"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 55,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -right-1 bottom-0 h-0 w-[1px] bg-white group-hover:h-full transition-all duration-300 delay-300"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 56,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -right-2 -top-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 59,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:block",
                                        children: "vcXvp"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center justify-center flex-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-1 bg-gray-900/50 border border-gray-700/50 rounded-md text-xs text-gray-400 backdrop-blur-sm relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-4 h-4 border border-gray-600 rounded text-center leading-3 text-[10px] group-hover:border-white group-hover:text-white transition-colors",
                                                children: "/"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 69,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "group-hover:text-white transition-colors",
                                                children: "Command Prompt"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 70,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -inset-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex md:items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-baseline space-x-4 mr-4",
                                    children: navItems.map((item, index)=>{
                                        const isActive = pathname === item.path;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            onMouseEnter: ()=>setHoverIndex(index),
                                            onMouseLeave: ()=>setHoverIndex(null),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.path,
                                                    className: `px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`,
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navbar.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ${isActive ? 'w-full' : hoverIndex === index ? 'w-full' : 'w-0'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Navbar.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 21
                                                }, this),
                                                (isActive || hoverIndex === index) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute -left-1 bottom-0 w-1 h-1 bg-white rounded-full animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navbar.tsx",
                                                            lineNumber: 107,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute -right-1 bottom-0 w-1 h-1 bg-white rounded-full animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/Navbar.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, item.name, true, {
                                            fileName: "[project]/src/components/Navbar.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$VoiceControl$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    isListening: voiceState.isListening,
                                    isSupported: voiceState.isSupported,
                                    status: voiceState.status,
                                    lastCommand: voiceState.lastCommand,
                                    voiceFeedbackEnabled: true,
                                    onToggleListening: voiceActions.toggleListening,
                                    onToggleVoiceFeedback: ()=>{},
                                    onShowCommands: ()=>{}
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:hidden flex items-center mr-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-2 py-1 bg-gray-900/50 border border-gray-700/50 rounded text-xs text-gray-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-3 h-3 border border-gray-600 rounded text-center leading-2 text-[8px] inline-block mr-1",
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "CMD"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:hidden flex items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setMenuOpen(!menuOpen),
                                className: "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none",
                                "aria-expanded": "false",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Open main menu"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-6 h-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `absolute left-0 block w-6 h-0.5 bg-white transform transition-all duration-300 ${menuOpen ? 'top-3 rotate-45' : 'top-2'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `absolute left-0 block w-6 h-0.5 bg-white transform transition-all duration-300 ${menuOpen ? 'opacity-0' : 'top-3 opacity-100'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `absolute left-0 block w-6 h-0.5 bg-white transform transition-all duration-300 ${menuOpen ? 'top-3 -rotate-45' : 'top-4'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Navbar.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Navbar.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-60' : 'max-h-0'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-md",
                    children: navItems.map((item)=>{
                        const isActive = pathname === item.path;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.path,
                            className: `block px-3 py-2 rounded-md text-base font-medium relative overflow-hidden group ${isActive ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`,
                            onClick: ()=>setMenuOpen(false),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative z-10",
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 181,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 182,
                                    columnNumber: 17
                                }, this),
                                isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute left-0 top-0 h-full w-[2px] bg-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 184,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, item.name, true, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 173,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/Navbar.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`,
                style: {
                    animation: 'scanHorizontal 4s linear infinite'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 w-5 h-5 border-t border-l border-white/20"
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 right-0 w-5 h-5 border-t border-r border-white/20"
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Navbar.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Navbar;
}}),
"[project]/src/components/CommandPrompt.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const commands = [
    'play',
    'pause',
    'stop',
    'mute',
    'fullscreen',
    'pip',
    'volume',
    'speed',
    'seek',
    'forward',
    'backward',
    'next',
    'prev',
    'previous',
    'shuffle',
    'repeat',
    'quality',
    'screenshot',
    'capture',
    'bookmark',
    'bookmarks',
    'debug',
    'console',
    'inspect',
    'stats',
    'home',
    'back',
    'forward-page',
    'upload',
    'folder',
    'clear',
    'reload',
    'theme',
    'minimize',
    'maximize',
    'close',
    'help'
];
const CommandPrompt = ({ isOpen, onClose, onCommand })=>{
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const suggestions = commands.filter((cmd)=>cmd.toLowerCase().includes(input.toLowerCase()) && input.length > 0).slice(0, 8);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [
        isOpen
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (input.trim()) {
            onCommand(input.trim());
            setInput('');
            onClose();
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev)=>Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev)=>Math.max(prev - 1, 0));
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestions[selectedIndex]) {
                setInput(suggestions[selectedIndex]);
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setSelectedIndex(0);
    }, [
        input
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: -20,
                    scale: 0.95
                },
                animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    y: -20,
                    scale: 0.95
                },
                className: "bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl mx-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-400 text-lg",
                                    children: ">"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CommandPrompt.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: inputRef,
                                    type: "text",
                                    value: input,
                                    onChange: (e)=>setInput(e.target.value),
                                    onKeyDown: handleKeyDown,
                                    placeholder: "Type a command...",
                                    className: "flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CommandPrompt.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CommandPrompt.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/CommandPrompt.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    suggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-gray-700 max-h-48 overflow-y-auto",
                        children: suggestions.map((suggestion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `px-4 py-2 text-sm cursor-pointer transition-colors ${index === selectedIndex ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`,
                                onClick: ()=>{
                                    setInput(suggestion);
                                    inputRef.current?.focus();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 mr-2",
                                        children: ">"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CommandPrompt.tsx",
                                        lineNumber: 109,
                                        columnNumber: 19
                                    }, this),
                                    suggestion
                                ]
                            }, suggestion, true, {
                                fileName: "[project]/src/components/CommandPrompt.tsx",
                                lineNumber: 97,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/CommandPrompt.tsx",
                        lineNumber: 95,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 text-xs text-gray-500 border-t border-gray-700",
                        children: input.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Type to see suggestions • Tab to complete • ↑↓ to navigate"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommandPrompt.tsx",
                            lineNumber: 118,
                            columnNumber: 15
                        }, this) : suggestions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Tab to complete • Enter to execute • Escape to close"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommandPrompt.tsx",
                            lineNumber: 120,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "No matches found • Enter to execute • Escape to close"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommandPrompt.tsx",
                            lineNumber: 122,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/CommandPrompt.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CommandPrompt.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/CommandPrompt.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/CommandPrompt.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = CommandPrompt;
}}),
"[project]/src/components/CommandPromptProvider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CommandPrompt$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CommandPrompt.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
const CommandPromptProvider = ({ children })=>{
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if (e.key === '/' && !isOpen) {
                e.preventDefault();
                setIsOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return ()=>document.removeEventListener('keydown', handleKeyDown);
    }, [
        isOpen
    ]);
    const handleCommand = (command)=>{
        const cmd = command.toLowerCase().trim();
        const args = cmd.split(' ');
        const action = args[0];
        // Get video element if exists
        const video = document.querySelector('video');
        switch(action){
            // Playback controls
            case 'play':
                video?.play();
                break;
            case 'pause':
                video?.pause();
                break;
            case 'stop':
                video && (video.currentTime = 0, video.pause());
                break;
            case 'mute':
                video && (video.muted = !video.muted);
                break;
            case 'fullscreen':
                video?.requestFullscreen();
                break;
            // Volume controls
            case 'volume':
                if (video && args[1]) {
                    const vol = parseInt(args[1]) / 100;
                    if (vol >= 0 && vol <= 1) video.volume = vol;
                }
                break;
            // Speed controls
            case 'speed':
                if (video && args[1]) {
                    const speed = parseFloat(args[1]);
                    if (speed > 0 && speed <= 4) video.playbackRate = speed;
                }
                break;
            // Navigation
            case 'seek':
                if (video && args[1]) {
                    const time = parseInt(args[1]);
                    if (time >= 0) video.currentTime = time;
                }
                break;
            case 'forward':
                video && (video.currentTime += 10);
                break;
            case 'backward':
                video && (video.currentTime -= 10);
                break;
            // Playlist controls
            case 'next':
                document.querySelector('[data-next-video]')?.click();
                break;
            case 'prev':
            case 'previous':
                document.querySelector('[data-prev-video]')?.click();
                break;
            case 'shuffle':
                localStorage.setItem('shuffle', 'true');
                break;
            case 'repeat':
                localStorage.setItem('repeat', 'true');
                break;
            // Quality controls
            case 'quality':
                if (args[1]) {
                    const qualities = [
                        '144p',
                        '240p',
                        '360p',
                        '480p',
                        '720p',
                        '1080p',
                        '1440p',
                        '2160p'
                    ];
                    if (qualities.includes(args[1])) console.log(`Quality set to ${args[1]}`);
                }
                break;
            // Screenshot and recording
            case 'screenshot':
            case 'capture':
                if (video) {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d')?.drawImage(video, 0, 0);
                    canvas.toBlob((blob)=>{
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `screenshot-${Date.now()}.png`;
                            a.click();
                        }
                    });
                }
                break;
            // Bookmarks
            case 'bookmark':
                if (video) {
                    const time = video.currentTime;
                    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                    bookmarks.push({
                        time,
                        name: args.slice(1).join(' ') || `Bookmark ${bookmarks.length + 1}`
                    });
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    console.log('Bookmark saved');
                }
                break;
            case 'bookmarks':
                const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                console.log('Bookmarks:', bookmarks);
                break;
            // Developer tools
            case 'debug':
                console.log('Video info:', {
                    currentTime: video?.currentTime,
                    duration: video?.duration,
                    volume: video?.volume,
                    speed: video?.playbackRate
                });
                break;
            case 'console':
                console.clear();
                break;
            case 'inspect':
                document.body.style.outline = '1px solid red';
                break;
            case 'stats':
                console.log('App stats:', {
                    localStorage: Object.keys(localStorage).length,
                    videos: document.querySelectorAll('video').length
                });
                break;
            // Navigation
            case 'home':
                window.location.href = '/';
                break;
            case 'back':
                window.history.back();
                break;
            case 'forward-page':
                window.history.forward();
                break;
            // App controls
            case 'upload':
                document.querySelector('input[type="file"]')?.click();
                break;
            case 'folder':
                document.querySelector('input[webkitdirectory]')?.click();
                break;
            case 'clear':
                localStorage.clear();
                window.location.reload();
                break;
            case 'reload':
                window.location.reload();
                break;
            case 'theme':
                document.body.classList.toggle('light-theme');
                break;
            case 'pip':
                video?.requestPictureInPicture();
                break;
            // Window controls
            case 'minimize':
                console.log('Minimize not available in browser');
                break;
            case 'maximize':
                document.documentElement.requestFullscreen();
                break;
            case 'close':
                window.close();
                break;
            // Help
            case 'help':
                console.log(`Commands:
🎮 Playback: play, pause, stop, mute, fullscreen, pip
🔊 Audio: volume [0-100], speed [0.25-4]
⏭️ Navigation: seek [sec], forward, backward, next, prev
📋 Playlist: shuffle, repeat, upload, folder
🎯 Quality: quality [144p-2160p]
📸 Capture: screenshot, bookmark [name], bookmarks
🛠️ Debug: debug, console, inspect, stats
🌐 Navigate: home, back, forward-page
💻 System: clear, reload, theme, minimize, maximize, close`);
                break;
            default:
                console.log('Unknown command. Type "help" for available commands.');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CommandPrompt$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isOpen,
                onClose: ()=>setIsOpen(false),
                onCommand: handleCommand
            }, void 0, false, {
                fileName: "[project]/src/components/CommandPromptProvider.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = CommandPromptProvider;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__cc5fa01c._.js.map
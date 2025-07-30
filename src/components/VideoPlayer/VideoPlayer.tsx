'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './VideoPlayer.module.css';
import { motion } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStepBackward, FaStepForward, 
  FaVolumeMute, FaVolumeUp, FaRegBookmark, FaImage, 
  FaRegWindowRestore, FaChartLine, FaDownload, FaEye, 
  FaCog, FaCompress, FaExpand, FaKeyboard 
} from 'react-icons/fa';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import VoiceControl from '@/components/VoiceControl';
import VoiceCommandsModal from '@/components/VoiceCommandsModal';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  type?: string;
  fluid?: boolean;
  options?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onLoadStart?: () => void;
  onLoadedData?: () => void;
}

// Extended types for fullscreen API compatibility
interface ExtendedHTMLElement extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

// Speech Recognition API types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;
    grammars: SpeechGrammarList;
    start(): void;
    stop(): void;
    abort(): void;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
    addFromURI(src: string, weight?: number): void;
    addFromString(string: string, weight?: number): void;
  }

  interface SpeechGrammar {
    src: string;
    weight: number;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  type = 'video/mp4',
  fluid = true,
  options = {},
  onError,
  onLoadStart,
  onLoadedData
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenBusy, setIsFullscreenBusy] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [thumbnailPosition, setThumbnailPosition] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showQualityNotification, setShowQualityNotification] = useState(false);

  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarkInput, setShowBookmarkInput] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [previewBookmarkIndex, setPreviewBookmarkIndex] = useState<number | null>(null);
  const [chapters, setChapters] = useState<{title: string, time: number}[]>([]);
  const [showChapters, setShowChapters] = useState(false);
  const [networkQuality, setNetworkQuality] = useState('excellent');
  const [particles, setParticles] = useState<{id: number, left: string, delay: number, duration: number}[]>([]);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showVisualEffects, setShowVisualEffects] = useState(true);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);
  const [showQualityComparison, setShowQualityComparison] = useState(false);
  const [effectsIntensity, setEffectsIntensity] = useState(0.5);
  const [availableQualities] = useState(['auto', '8K', '4K', '2K', '1080p', '720p', '480p', '360p']);
  const [showVideoInfo, setShowVideoInfo] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>({
    resolution: '',
    bitrate: '',
    frameRate: '',
    codec: ''
  });
  const [playbackStats, setPlaybackStats] = useState({
    watchTime: 0,
    bufferingEvents: 0,
    averageBitrate: 0,
    droppedFrames: 0,
    lastWatchTimeUpdate: Date.now()
  });
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom controls handlers - moved before handleVoiceCommand
  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (player.paused() || player.ended()) {
      player.play().catch((err: Error) => {
        console.error('Error playing video:', err);
      });
    } else {
      player.pause();
    }
  }, []);

  const skipForward = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    player.currentTime(Math.min(player.duration(), player.currentTime() + 10));
  }, []);

  const skipBackward = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    player.currentTime(Math.max(0, player.currentTime() - 10));
  }, []);

  // Change playback speed
  const changePlaybackSpeed = (speed: number) => {
    const player = playerRef.current;
    if (!player) return;
    
    player.playbackRate(speed);
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const handleFullscreen = useCallback(() => {
    const player = playerRef.current;
    const container = containerRef.current;
    if (!player || !container) return;
    
    try {
      if (!isFullscreen) {
        const extendedContainer = container as ExtendedHTMLElement;
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (extendedContainer.mozRequestFullScreen) {
          extendedContainer.mozRequestFullScreen();
        } else if (extendedContainer.webkitRequestFullscreen) {
          extendedContainer.webkitRequestFullscreen();
        } else if (extendedContainer.msRequestFullscreen) {
          extendedContainer.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        const extendedDocument = document as ExtendedDocument;
        if (document.fullscreenElement ||
            extendedDocument.webkitFullscreenElement ||
            extendedDocument.mozFullScreenElement ||
            extendedDocument.msFullscreenElement) {

          const exitPromise = document.exitFullscreen ?
            Promise.resolve(document.exitFullscreen()) :
            extendedDocument.webkitExitFullscreen ?
              Promise.resolve(extendedDocument.webkitExitFullscreen()) :
              extendedDocument.mozCancelFullScreen ?
                Promise.resolve(extendedDocument.mozCancelFullScreen()) :
                extendedDocument.msExitFullscreen ?
                  Promise.resolve(extendedDocument.msExitFullscreen()) :
                  Promise.resolve();
          
          exitPromise
            .catch((err: Error) => {
              console.error('Error exiting fullscreen:', err);
            })
            .finally(() => {
              setIsFullscreen(false);
              setShowControls(true);
            });
        } else {
          setIsFullscreen(false);
          setShowControls(true);
        }
      }
    } catch (error: unknown) {
      console.error('Fullscreen error:', error);
      setIsFullscreen(!isFullscreen);
      setShowControls(true);
    }
  }, [isFullscreen]);

  const togglePictureInPicture = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    const video = player.el().querySelector('video');
    if (!video) return;
    
    try {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
          .catch((err: Error) => {
            console.error('Error exiting Picture-in-Picture mode:', err);
          });
      } else {
        video.requestPictureInPicture()
          .catch((err: Error) => {
            console.error('Error entering Picture-in-Picture mode:', err);
          });
      }
    } catch (error: unknown) {
      console.error('Picture-in-Picture error:', error);
    }
  }, []);

  const takeScreenshot = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    try {
      const video = player.el().querySelector('video');
      if (!video) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/png');
      
      setScreenshotUrl(dataUrl);
      setShowScreenshot(true);
    } catch (error: unknown) {
      console.error('Screenshot error:', error);
    }
  }, []);

  const jumpToBookmark = (time: number) => {
    const player = playerRef.current;
    if (!player) return;
    
    player.currentTime(time);
    if (player.paused()) {
      player.play().catch((err: Error) => console.error('Error playing video:', err));
    }
  };

  const changeQuality = (quality: string) => {
    setCurrentQuality(quality);
    
    let resolution;
    let bitrate;
    let frameRate;
    
    switch (quality) {
      case '8K':
        resolution = '7680x4320 (8K)';
        bitrate = `${Math.floor(Math.random() * 20 + 80)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '60fps';
        break;
      case '4K':
        resolution = '3840x2160 (4K)';
        bitrate = `${Math.floor(Math.random() * 15 + 40)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '60fps';
        break;
      case '2K':
        resolution = '2560x1440 (2K)';
        bitrate = `${Math.floor(Math.random() * 10 + 20)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '60fps';
        break;
      case '1080p':
        resolution = '1920x1080 (1080p)';
        bitrate = `${Math.floor(Math.random() * 5 + 8)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '60fps';
        break;
      case '720p':
        resolution = '1280x720 (720p)';
        bitrate = `${Math.floor(Math.random() * 3 + 5)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '30fps';
        break;
      case '480p':
        resolution = '854x480 (480p)';
        bitrate = `${Math.floor(Math.random() * 2 + 2)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '30fps';
        break;
      case '360p':
        resolution = '640x360 (360p)';
        bitrate = `${Math.floor(Math.random() * 1 + 1)}.${Math.floor(Math.random() * 9)}Mbps`;
        frameRate = '30fps';
        break;
      case 'auto':
      default:
        const qualities = ['8K', '4K', '2K', '1080p', '720p', '480p', '360p'];
        const randomIndex = Math.floor(Math.random() * 4);
        const autoQuality = qualities[randomIndex];
        
        if (autoQuality !== 'auto') {
          changeQuality(autoQuality);
          return;
        } else {
          resolution = '1920x1080 (1080p)';
          bitrate = '8.5Mbps';
          frameRate = '60fps';
        }
    }
    
    setVideoInfo(prev => ({
      ...prev,
      resolution,
      bitrate,
      frameRate
    }));
    
    setShowSettings(false);
    setShowQualityNotification(true);
    setTimeout(() => setShowQualityNotification(false), 3000);
  };

  // Voice Control Integration
  const handleVoiceCommand = useCallback((command: string, params?: any) => {
    const player = playerRef.current;
    if (!player) return;

    switch (command) {
      case 'play':
        player.play().catch(console.error);
        break;
      case 'pause':
        player.pause();
        break;
      case 'togglePlay':
        togglePlay();
        break;
      case 'restart':
        player.currentTime(0);
        player.play().catch(console.error);
        break;
      case 'mute':
        player.muted(true);
        setIsMuted(true);
        break;
      case 'unmute':
        player.muted(false);
        setIsMuted(false);
        break;
      case 'skipForward':
        skipForward();
        break;
      case 'skipBackward':
        skipBackward();
        break;
      case 'nextFrame':
        if (player.paused()) {
          player.currentTime(Math.min(player.duration(), player.currentTime() + 0.04));
        }
        break;
      case 'previousFrame':
        if (player.paused()) {
          player.currentTime(Math.max(0, player.currentTime() - 0.04));
        }
        break;
      case 'volumeUp':
        const newVolumeUp = Math.min(1, player.volume() + 0.1);
        player.volume(newVolumeUp);
        setVolume(newVolumeUp);
        if (isMuted && newVolumeUp > 0) {
          player.muted(false);
          setIsMuted(false);
        }
        break;
      case 'volumeDown':
        const newVolumeDown = Math.max(0, player.volume() - 0.1);
        player.volume(newVolumeDown);
        setVolume(newVolumeDown);
        if (newVolumeDown === 0) {
          player.muted(true);
          setIsMuted(true);
        }
        break;
      case 'volumeMax':
        player.volume(1);
        setVolume(1);
        player.muted(false);
        setIsMuted(false);
        break;
      case 'volumeMin':
        player.volume(0);
        setVolume(0);
        player.muted(true);
        setIsMuted(true);
        break;
      case 'setVolume':
        if (params?.volume !== undefined) {
          const vol = Math.max(0, Math.min(100, params.volume)) / 100;
          player.volume(vol);
          setVolume(vol);
          if (vol === 0) {
            player.muted(true);
            setIsMuted(true);
          } else if (isMuted) {
            player.muted(false);
            setIsMuted(false);
          }
        }
        break;
      case 'speedUp':
        const newSpeedUp = Math.min(4, playbackSpeed + 0.25);
        changePlaybackSpeed(newSpeedUp);
        break;
      case 'speedDown':
        const newSpeedDown = Math.max(0.25, playbackSpeed - 0.25);
        changePlaybackSpeed(newSpeedDown);
        break;
      case 'normalSpeed':
        changePlaybackSpeed(1);
        break;
      case 'doubleSpeed':
        changePlaybackSpeed(2);
        break;
      case 'halfSpeed':
        changePlaybackSpeed(0.5);
        break;
      case 'setSpeed':
        if (params?.speed !== undefined) {
          changePlaybackSpeed(params.speed);
        }
        break;
      case 'qualityAuto':
        changeQuality('auto');
        break;
      case 'quality8k':
        changeQuality('8K');
        break;
      case 'quality4k':
        changeQuality('4K');
        break;
      case 'quality1080p':
        changeQuality('1080p');
        break;
      case 'quality720p':
        changeQuality('720p');
        break;
      case 'quality480p':
        changeQuality('480p');
        break;
      case 'qualityBest':
        changeQuality('8K');
        break;
      case 'qualityLowest':
        changeQuality('360p');
        break;
      case 'fullscreen':
        if (!isFullscreen) handleFullscreen();
        break;
      case 'exitFullscreen':
        if (isFullscreen) handleFullscreen();
        break;
      case 'pictureInPicture':
        togglePictureInPicture();
        break;
      case 'screenshot':
        takeScreenshot();
        break;
      case 'addBookmark':
        setShowBookmarkInput(true);
        break;
      case 'addNamedBookmark':
        if (params?.name) {
          const newBookmark = {
            time: player.currentTime(),
            label: params.name
          };
          setBookmarks(prev => [...prev, newBookmark]);
        }
        break;
      case 'gotoBookmark':
        if (params?.name) {
          const bookmark = bookmarks.find(b => b.label.toLowerCase().includes(params.name.toLowerCase()));
          if (bookmark) {
            jumpToBookmark(bookmark.time);
          }
        }
        break;
      case 'showBookmarks':
        // Bookmarks are always visible when they exist
        break;
      case 'showInfo':
        setShowVideoInfo(true);
        break;
      case 'showStats':
        setShowStatistics(true);
        break;
      case 'showChapters':
        setShowChapters(true);
        break;
      case 'hideInfo':
        setShowVideoInfo(false);
        setShowStatistics(false);
        setShowChapters(false);
        setShowSettings(false);
        break;
      case 'announceTime':
        // This would be handled by voice feedback
        break;
      case 'announceDuration':
        // This would be handled by voice feedback
        break;
      case 'showSettings':
        setShowSettings(true);
        break;
      case 'showShortcuts':
        setShowShortcutGuide(true);
        break;
      case 'showHistory':
        setShowHistory(true);
        break;
      case 'effectsOn':
        setShowVisualEffects(true);
        break;
      case 'effectsOff':
        setShowVisualEffects(false);
        break;
      case 'jumpToTime':
        if (params?.time !== undefined) {
          player.currentTime(Math.min(player.duration(), params.time));
        }
        break;
      case 'jumpToPercent':
        if (params?.percent !== undefined) {
          const time = (params.percent / 100) * player.duration();
          player.currentTime(time);
        }
        break;
      case 'voiceOff':
        // This will be handled by the voice control hook
        break;
      case 'voiceHelp':
        setShowVoiceCommands(true);
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  }, [togglePlay, skipForward, skipBackward, playbackSpeed, changePlaybackSpeed, 
      isFullscreen, handleFullscreen, togglePictureInPicture, takeScreenshot, 
      bookmarks, jumpToBookmark, isMuted]);

  const [voiceState, voiceActions] = useVoiceControl(handleVoiceCommand);

  // Check if the browser supports the video format
  const validateBrowserSupport = useCallback((type: string): boolean => {
    const video = document.createElement('video');
    const canPlay = video.canPlayType(type);

    // canPlayType returns: "", "maybe", or "probably"
    if (canPlay === '') {
      // Try common fallback formats
      const fallbackTypes = [
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // H.264 + AAC
        'video/webm; codecs="vp8, vorbis"', // WebM VP8
        'video/ogg; codecs="theora, vorbis"' // Ogg Theora
      ];

      const supportedFallback = fallbackTypes.find(fallbackType =>
        video.canPlayType(fallbackType) !== ''
      );

      if (!supportedFallback) {
        setErrorMessage(`Video format "${type}" is not supported by your browser. Please try a different format (MP4, WebM, or OGG).`);
        return false;
      }
    }

    return true;
  }, []);

  // Enhanced video source validation with browser compatibility check
  const validateVideoSource = useCallback((src: string, type: string): boolean => {
    if (!src || src.trim() === '') {
      setErrorMessage('No video source provided');
      return false;
    }

    // Check if it's a blob URL (for local files)
    if (src.startsWith('blob:')) {
      // For blob URLs, we'll validate the MIME type and browser support
      return validateBrowserSupport(type);
    }

    // Check if it's a valid URL
    try {
      new URL(src);
    } catch {
      setErrorMessage('Invalid video URL');
      return false;
    }

    // Validate browser support for the video type
    return validateBrowserSupport(type);
  }, [validateBrowserSupport]);

  // Enhanced video error handling with detailed diagnostics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVideoError = useCallback((error: any) => {
    console.error('Video.js error:', error);
    setHasError(true);
    setIsLoading(false);

    let errorMsg = 'An error occurred while loading the video';
    let suggestions = '';

    if (error && error.code) {
      switch (error.code) {
        case 1: // MEDIA_ERR_ABORTED
          errorMsg = 'Video loading was aborted by the user';
          suggestions = 'Try refreshing the page or selecting the video again.';
          break;
        case 2: // MEDIA_ERR_NETWORK
          errorMsg = 'Network error occurred while loading video';
          suggestions = 'Check your internet connection and try again.';
          break;
        case 3: // MEDIA_ERR_DECODE
          errorMsg = 'Video file appears to be corrupted or uses an unsupported codec';
          suggestions = 'Try converting the video to MP4 format with H.264 codec.';
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMsg = 'Video format is not supported by your browser';
          suggestions = 'Supported formats: MP4 (H.264), WebM (VP8/VP9), OGG (Theora). Try converting your video to MP4.';
          break;
        default:
          errorMsg = `Video error (code: ${error.code})`;
          suggestions = 'Please try a different video file or refresh the page.';
      }
    }

    // Combine error message with suggestions
    const fullErrorMsg = suggestions ? `${errorMsg}\n\nSuggestion: ${suggestions}` : errorMsg;
    setErrorMessage(fullErrorMsg);

    // Only call onError if it exists and avoid infinite loops
    if (onError && typeof onError === 'function') {
      try {
        onError(error);
      } catch (callbackError) {
        console.error('Error in onError callback:', callbackError);
      }
    }
  }, [onError]);

  // Enhanced retry logic with fallback sources
  const retryVideo = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);

    if (playerRef.current) {
      const player = playerRef.current;

      // Try with different MIME type specifications
      const fallbackSources = [
        { src, type },
        { src, type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' },
        { src, type: 'video/webm; codecs="vp8, vorbis"' },
        { src, type: 'video/ogg; codecs="theora, vorbis"' },
        { src, type: 'video/mp4' } // Generic fallback
      ];

      // Try each source until one works
      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex < fallbackSources.length) {
          const currentSource = fallbackSources[sourceIndex];
          console.log(`Trying source ${sourceIndex + 1}/${fallbackSources.length}:`, currentSource);

          player.src(currentSource);
          player.load();

          // Set up one-time error handler for this attempt
          const errorHandler = () => {
            sourceIndex++;
            player.off('error', errorHandler);
            if (sourceIndex < fallbackSources.length) {
              setTimeout(tryNextSource, 500); // Small delay before next attempt
            } else {
              // All sources failed
              setHasError(true);
              setErrorMessage('Unable to load video with any supported format. Please try converting the video to MP4 format.');
              setIsLoading(false);
            }
          };

          player.one('error', errorHandler);

          // Set up success handler
          const loadHandler = () => {
            player.off('error', errorHandler);
            console.log(`Successfully loaded with source ${sourceIndex + 1}`);
          };

          player.one('loadeddata', loadHandler);
        }
      };

      tryNextSource();
    }
  }, [src, type]);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Generate particles for animation
  useEffect(() => {
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 7
    }));
    
    setParticles(generatedParticles);
  }, []);

  // These functions have been moved to the top of the file

  // togglePlay function moved to avoid duplication

  // handleVolumeChange function moved to avoid duplication

  // toggleMute function moved to avoid duplication

  // seekTo function moved to avoid duplication

  // changePlaybackSpeed function moved above

  // handleFullscreen function moved above

  // Functions moved above to avoid initialization errors

  // Initialize video
  useEffect(() => {
    // Don't initialize if no valid source
    if (!src || src.trim() === '') {
      return;
    }

    // Validate source before initializing
    if (!validateVideoSource(src, type)) {
      setHasError(true);
      return;
    }

    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');

      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'vjs-16-9');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        controls: true,
        fluid,
        responsive: true,
        sources: [{
          src,
          type
        }],
        poster,
        playbackRates: [0.5, 1, 1.5, 2],
        preload: 'metadata',
        ...options
      });

      // Add futuristic UI classes
      player.addClass(styles.futuristicPlayer);

      // Handle loading events
      player.on('loadstart', () => {
        setIsLoading(true);
        setHasError(false);
        onLoadStart?.();
      });

      player.on('loadeddata', () => {
        setIsLoading(false);

        // Extract video metadata
        const video = player.el().querySelector('video');
        if (video) {
          const metadata = {
            resolution: `${video.videoWidth}x${video.videoHeight}`,
            duration: player.duration(),
            currentSrc: player.currentSrc()
          };

          // Update video info state
          setVideoInfo(prev => ({
            ...prev,
            resolution: metadata.resolution,
            duration: formatTime(metadata.duration)
          }));
        }

        onLoadedData?.();
      });

      player.on('canplay', () => {
        setIsLoading(false);
      });

      // Handle errors
      player.on('error', () => {
        const error = player.error();
        handleVideoError(error);
      });

      // Handle fullscreen changes
      player.on('fullscreenchange', () => {
        setIsFullscreen(player.isFullscreen() || false);
      });

      // Update UI on play
      player.on('play', () => {
        setIsPlaying(true);
        startControlsTimer();
      });

      // Update UI on pause
      player.on('pause', () => {
        setIsPlaying(false);
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      });
    } else if (playerRef.current) {
      // Validate source before updating
      if (!validateVideoSource(src, type)) {
        setHasError(true);
        return;
      }

      // Update player source if it changes
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');

      const player = playerRef.current;
      player.src({
        src,
        type
      });
      if (poster) {
        player.poster(poster);
      }
      // Ensure the player loads the new source
      player.load();
      // Play the video if it was previously playing
      if (!player.paused()) {
        player.play().catch((err: Error) => {
          console.error('Error playing video after source change:', err);
        });
      }
    }
  }, [src, poster, type, fluid, options, validateVideoSource, handleVideoError, onLoadStart, onLoadedData]);


  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // togglePictureInPicture function moved above

  // takeScreenshot function moved above





  const startControlsTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playerRef.current && !playerRef.current.paused()) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Add interface for VideoHistoryItem and Bookmark
  interface VideoHistoryItem {
    path: string;
    name: string;
    lastPlayed: number;
    duration: number;
    currentTime: number;
  }

  interface Bookmark {
    time: number;
    label: string;
  }

  interface VideoInfo {
    resolution: string;
    bitrate: string;
    frameRate: string;
    codec: string;
  }

  // Update duration when metadata is loaded
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    
    const handleLoadedMetadata = () => {
      setDuration(player.duration());
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime());
      
      // Update buffered percent
      if (player.buffered() && player.buffered().length > 0) {
        const bufferedEnd = player.buffered().end(player.buffered().length - 1);
        const bufferedPercent = (bufferedEnd / player.duration()) * 100;
        setBufferedPercent(bufferedPercent);
      }
    };
    
    // Simulate network quality
    const updateNetworkQuality = () => {
      const qualities = ['poor', 'fair', 'good', 'excellent'];
      // Bias toward excellent quality
      const weights = [0.1, 0.2, 0.3, 0.4];
      const random = Math.random();
      let qualityIndex = 0;
      let sum = 0;
      
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random <= sum) {
          qualityIndex = i;
          break;
        }
      }
      
      setNetworkQuality(qualities[qualityIndex]);
    };
    
    player.on('loadedmetadata', handleLoadedMetadata);
    player.on('timeupdate', handleTimeUpdate);
    
    // Simulate network quality updates
    const networkInterval = setInterval(updateNetworkQuality, 10000);
    updateNetworkQuality(); // Initial update
    
    return () => {
      player.off('loadedmetadata', handleLoadedMetadata);
      player.off('timeupdate', handleTimeUpdate);
      clearInterval(networkInterval);
    };
  }, []);

  // Handle progress bar hover for thumbnail preview
  useEffect(() => {
    const progressBar = progressContainerRef.current;
    if (!progressBar || !duration) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = percentage * duration;
      setThumbnailPosition(time);
      setMouseX(x);
    };
    
    const handleMouseLeave = () => {
      setThumbnailPosition(null);
    };
    
    progressBar.addEventListener('mousemove', handleMouseMove);
    progressBar.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      progressBar.removeEventListener('mousemove', handleMouseMove);
      progressBar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [duration]);

  // Custom controls handlers moved above

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = playerRef.current;
    if (!player) return;

    const newVolume = parseFloat(e.target.value);
    player.volume(newVolume);
    setVolume(newVolume);
    
      if (newVolume === 0) {
      player.muted(true);
      setIsMuted(true);
      } else if (isMuted) {
      player.muted(false);
      setIsMuted(false);
    }
  };

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    const newMutedState = !player.muted();
    player.muted(newMutedState);
    setIsMuted(newMutedState);
  }, []);

  // Picture-in-picture and screenshot functionality moved to earlier in the file

  const seekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = playerRef.current;
    if (!player) return;
    
      const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime)) {
      player.currentTime(newTime);
    }
  };

  // handleFullscreen function moved to avoid duplication



  // Picture-in-picture and screenshot functionality moved to earlier in the file



  // Picture-in-picture and screenshot functionality moved to earlier in the file

  // These functions have been moved above to fix the order of definitions

  // Format time display
  const formatTime = (seconds: number | undefined) => {
    if (seconds === undefined || isNaN(seconds)) return "0:00";
    
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Get thumbnail time position display
  const getThumbnailTime = () => {
    if (thumbnailPosition === null) return "";
    return formatTime(thumbnailPosition);
  };

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // Load video history from localStorage
    const loadVideoHistory = () => {
      try {
        const savedHistory = localStorage.getItem('videoPlayerHistory');
        if (savedHistory) {
          setVideoHistory(JSON.parse(savedHistory));
        }
      } catch (error: unknown) {
        console.error('Error loading video history:', error);
      }
    };

    loadVideoHistory();
  }, []);

  // Add this function to save the current video to history
  const saveToHistory = useCallback(() => {
    if (!src) return;
    
    const player = playerRef.current;
    if (!player) return;
    
    // Extract filename from path
    const fileName = src.split('/').pop() || src;
    
    const historyItem: VideoHistoryItem = {
      path: src,
      name: fileName,
      lastPlayed: Date.now(),
      duration: player.duration(),
      currentTime: player.currentTime()
    };
    
    setVideoHistory(prevHistory => {
      // Check if this video is already in history
      const existingIndex = prevHistory.findIndex(item => item.path === src);
      let newHistory;
      
      if (existingIndex >= 0) {
        // Update existing entry
        newHistory = [...prevHistory];
        newHistory[existingIndex] = historyItem;
      } else {
        // Add new entry, limit to 10 items
        newHistory = [historyItem, ...prevHistory].slice(0, 10);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('videoPlayerHistory', JSON.stringify(newHistory));
      } catch (error: unknown) {
        console.error('Error saving video history:', error);
      }
      
      return newHistory;
    });
  }, [src]);

  // Save history periodically
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    
    const handleTimeUpdate = () => {
      // Save current position every 5 seconds
      if (player.currentTime() && Math.floor(player.currentTime()) % 5 === 0) {
        saveToHistory();
      }
    };
    
    player.on('timeupdate', handleTimeUpdate);
    
    return () => {
      player.off('timeupdate', handleTimeUpdate);
    };
  }, [saveToHistory]);

  // Function to play a video from history
  const playFromHistory = (historyItem: VideoHistoryItem) => {
    try {
      // For local files, we need to prompt the user to select the file again
      // since we can't store the actual file object due to security restrictions
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;
        
        const file = target.files[0];
        const objectUrl = URL.createObjectURL(file);
        
        // Update the video source
        const player = playerRef.current;
        if (player) {
          player.src({
            src: objectUrl,
            type
          });
          
          // If there's a saved position, seek to it after metadata is loaded
          if (historyItem.currentTime && historyItem.currentTime > 0) {
            const seekToTime = historyItem.currentTime;
            
            const seekWhenReady = () => {
              player.currentTime(seekToTime);
              player.off('loadeddata', seekWhenReady);
            };
            
            player.on('loadeddata', seekWhenReady);
          }
          
          // Start playing
          player.play().catch((err: Error) => console.error('Error playing video:', err));
        }
        
        // Close the history panel
        setShowHistory(false);
      };
      
      // Trigger file selection dialog
      input.click();
    } catch (error: unknown) {
      console.error('Error playing from history:', error);
    }
  };

  // changeQuality function moved above

  // Debounce fullscreen toggle to prevent rapid clicks
  const debouncedHandleFullscreen = () => {
    if (isFullscreenBusy) return;
    
    setIsFullscreenBusy(true);
    handleFullscreen();
    
    // Reset after a short delay
    setTimeout(() => {
      setIsFullscreenBusy(false);
    }, 1000);
  };

  // Picture-in-picture and screenshot functionality moved to earlier in the file

  // Download video functionality (for local files)
  const downloadVideo = () => {
    const player = playerRef.current;
    if (!player || !player.src()) return;

    try {
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = player.src();
      a.download = src.split('/').pop() || 'video';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: unknown) {
      console.error('Download error:', error);
    }
  };

  // Bookmark functionality
  const addBookmark = () => {
    const player = playerRef.current;
    if (!player) return;
    
    const newBookmark = {
      time: player.currentTime(),
      label: bookmarkLabel || `Bookmark at ${formatTime(player.currentTime())}`
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
    setShowBookmarkInput(false);
    setBookmarkLabel('');
  };

  // jumpToBookmark function moved above

  // Update playback statistics
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = (now - playbackStats.lastWatchTimeUpdate) / 1000;
      
      setPlaybackStats(prev => ({
        ...prev,
        watchTime: prev.watchTime + timeElapsed,
        lastWatchTimeUpdate: now,
        // Simulate some statistics for demo purposes
        averageBitrate: Math.floor(Math.random() * 1000) + 4000, // kbps
        droppedFrames: prev.droppedFrames + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, playbackStats.lastWatchTimeUpdate]);

  // Get video metadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVideoMetadata = useCallback((player: any) => {
    // Get video resolution
    const width = player.videoWidth();
    const height = player.videoHeight();
    
    // Determine resolution label based on width
    let resolutionLabel;
    if (width >= 7680) {
      resolutionLabel = '8K';
    } else if (width >= 3840) {
      resolutionLabel = '4K';
    } else if (width >= 2560) {
      resolutionLabel = '2K';
    } else if (width >= 1920) {
      resolutionLabel = '1080p';
    } else if (width >= 1280) {
      resolutionLabel = '720p';
    } else if (width >= 854) {
      resolutionLabel = '480p';
    } else {
      resolutionLabel = '360p';
    }
    
    const resolution = `${width}x${height} (${resolutionLabel})`;
    
    // Get video codec (this is a simulation, as codec info isn't directly available)
    let codec = 'Unknown';
    
    // Try to determine codec from video source
    if (player.src()) {
      if (player.src().includes('.mp4')) codec = 'H.264 / AAC';
      else if (player.src().includes('.webm')) codec = 'VP9 / Opus';
      else if (player.src().includes('.mov')) codec = 'H.264 / AAC';
      else if (player.src().includes('.avi')) codec = 'MJPEG / PCM';
      else if (player.src().includes('.mkv')) codec = 'H.265 / DTS';
    }
    
    // Get frame rate (this is a simulation, as frame rate isn't directly available)
    // In a real implementation, you might use MediaCapabilities API or analyze frames
    const frameRate = width >= 3840 ? '60fps' : (Math.random() > 0.5 ? '30fps' : '60fps');
    
    // Get bitrate (this is a simulation)
    let bitrate;
    if (width >= 7680) {
      bitrate = `${Math.floor(Math.random() * 20 + 80)}.${Math.floor(Math.random() * 9)}Mbps`;
    } else if (width >= 3840) {
      bitrate = `${Math.floor(Math.random() * 15 + 40)}.${Math.floor(Math.random() * 9)}Mbps`;
    } else if (width >= 1920) {
      bitrate = `${Math.floor(Math.random() * 10 + 10)}.${Math.floor(Math.random() * 9)}Mbps`;
    } else {
      bitrate = `${Math.floor(Math.random() * 5 + 3)}.${Math.floor(Math.random() * 9)}Mbps`;
    }
    
    setVideoInfo({
      resolution,
      frameRate,
      bitrate,
      codec
    });
    
    // Update playback stats with a buffering event
    setPlaybackStats(prev => ({
      ...prev,
      bufferingEvents: prev.bufferingEvents + 1
    }));
  }, []);
  
  // Add event listener for loadeddata to get video metadata
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    
    const handleLoadedData = () => {
      getVideoMetadata(player);
    };
    
    player.on('loadeddata', handleLoadedData);
    
    return () => {
      player.off('loadeddata', handleLoadedData);
    };
  }, [getVideoMetadata]);

  // Load bookmarks from localStorage
  useEffect(() => {
    if (!src) return;
    
    try {
      const savedBookmarks = localStorage.getItem(`videoBookmarks_${src}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error: unknown) {
      console.error('Error loading bookmarks:', error);
    }
  }, [src]);
  
  // Save bookmarks to localStorage
  useEffect(() => {
    if (!src || bookmarks.length === 0) return;
    
    try {
      localStorage.setItem(`videoBookmarks_${src}`, JSON.stringify(bookmarks));
    } catch (error: unknown) {
      console.error('Error saving bookmarks:', error);
    }
  }, [bookmarks, src]);
  
  // Function to remove a bookmark
  const removeBookmark = (index: number) => {
    setBookmarks(prev => prev.filter((_, i) => i !== index));
  };

  // Function to show bookmark preview
  const showBookmarkPreview = (index: number) => {
    setPreviewBookmarkIndex(index);
    
    // Set up preview video
    const previewPlayer = playerRef.current;
    if (!previewPlayer) return;
    
    // Use the same source as the main player
    previewPlayer.src({
      src: previewPlayer.src(),
      type
    });
    previewPlayer.muted(true);
    
    // Load metadata first
    previewPlayer.on('loadeddata', () => {
      // Seek to bookmark time
      previewPlayer.currentTime(bookmarks[index].time);
    }, { once: true });
  };
  
  // Function to hide bookmark preview
  const hideBookmarkPreview = () => {
    setPreviewBookmarkIndex(null);
    
    // Clean up preview video
    const previewPlayer = playerRef.current;
    if (previewPlayer) {
      previewPlayer.pause();
      previewPlayer.src({
        src: '',
        type
      });
      previewPlayer.load();
    }
  };

  // Initialize demo chapters
  useEffect(() => {
    // In a real implementation, these would be loaded from the video metadata
    // or from a separate chapters file
    const demoChapters = [
      { title: 'Introduction', time: 0 },
      { title: 'Chapter 1: Getting Started', time: duration * 0.1 },
      { title: 'Chapter 2: Main Content', time: duration * 0.25 },
      { title: 'Chapter 3: Advanced Topics', time: duration * 0.5 },
      { title: 'Chapter 4: Case Studies', time: duration * 0.75 },
      { title: 'Conclusion', time: duration * 0.9 }
    ];
    
    setChapters(demoChapters);
  }, [duration]);
  
  // Function to jump to a chapter
  const jumpToChapter = (time: number) => {
    const player = playerRef.current;
    if (!player) return;
    
    player.currentTime(time);
    if (player.paused()) {
      player.play().catch((err: Error) => console.error('Error playing video:', err));
    }
    
    setShowChapters(false);
  };
  
  // Get current chapter
  const getCurrentChapter = useCallback(() => {
    if (!chapters.length) return null;
    
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].time) {
        return chapters[i];
      }
    }
    
    return chapters[0];
  }, [chapters, currentTime]);
  
  // Current chapter
  const currentChapter = getCurrentChapter();

  // Visual quality comparison
  
  // Toggle quality comparison view
  const toggleQualityComparison = () => {
    setShowQualityComparison(!showQualityComparison);
    setShowSettings(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when the player is focused or in fullscreen
      if (!containerRef.current?.contains(document.activeElement) && !isFullscreen) return;

      const player = playerRef.current;
      if (!player) return;

      switch (e.key) {
        case '/': // Toggle shortcut guide
          e.preventDefault();
          setShowShortcutGuide(prev => !prev);
          break;
        case ' ': // Space
        case 'k': // K
        case 'K': // K (uppercase)
          e.preventDefault();
          togglePlay();
          break;
        case 'j': // J
        case 'J': // J (uppercase)
          e.preventDefault();
          skipBackward();
          break;
        case 'l': // L
        case 'L': // L (uppercase)
          e.preventDefault();
          skipForward();
          break;
        case 'm': // M
        case 'M': // M (uppercase)
          e.preventDefault();
          toggleMute();
          break;
        case 'f': // F
        case 'F': // F (uppercase)
          e.preventDefault();
          handleFullscreen();
          break;
        case 's': // S
        case 'S': // S (uppercase)
          e.preventDefault();
          setShowSettings(prev => !prev);
          break;
        case 'ArrowLeft': // Left arrow
          e.preventDefault();
          player.currentTime(Math.max(0, player.currentTime() - 5));
          break;
        case 'ArrowRight': // Right arrow
          e.preventDefault();
          player.currentTime(Math.min(player.duration(), player.currentTime() + 5));
          break;
        case 'ArrowUp': // Up arrow
          e.preventDefault();
          const newVolumeUp = Math.min(1, player.volume() + 0.1);
          player.volume(newVolumeUp);
          setVolume(newVolumeUp);
          if (isMuted && newVolumeUp > 0) {
            player.muted(false);
            setIsMuted(false);
          }
          break;
        case 'ArrowDown': // Down arrow
          e.preventDefault();
          const newVolumeDown = Math.max(0, player.volume() - 0.1);
          player.volume(newVolumeDown);
          setVolume(newVolumeDown);
          if (newVolumeDown === 0) {
            player.muted(true);
            setIsMuted(true);
          }
          break;
        case ',': // Previous frame
          e.preventDefault();
          if (player.paused()) {
            player.currentTime(Math.max(0, player.currentTime() - 0.04)); // Approx 1 frame at 25fps
          }
          break;
        case '.': // Next frame
          e.preventDefault();
          if (player.paused()) {
            player.currentTime(Math.min(player.duration(), player.currentTime() + 0.04)); // Approx 1 frame at 25fps
          }
          break;
        case 'h': // H
        case 'H': // H (uppercase)
          e.preventDefault();
          setShowHistory(prev => !prev);
          break;
        case 'q': // Q
        case 'Q': // Q (uppercase)
          e.preventDefault();
          setShowQualityComparison(prev => !prev);
          break;
        case 'b': // B
        case 'B': // B (uppercase)
          e.preventDefault();
          setShowBookmarkInput(prev => !prev);
          break;
        case 'p': // P
        case 'P': // P (uppercase)
          e.preventDefault();
          togglePictureInPicture();
          break;
        case 'i': // I
        case 'I': // I (uppercase)
          e.preventDefault();
          takeScreenshot();
          break;
        case 'v': // V
        case 'V': // V (uppercase)
          e.preventDefault();
          setShowVisualEffects(prev => !prev);
          break;
        case 't': // T
        case 'T': // T (uppercase)
          e.preventDefault();
          setShowStatistics(prev => !prev);
          break;
        case 'c': // C
        case 'C': // C (uppercase)
          e.preventDefault();
          setShowChapters(prev => !prev);
          break;
        case 'n': // N
        case 'N': // N (uppercase)
          e.preventDefault();
          setShowVideoInfo(prev => !prev);
          break;
        default:
          // Handle number keys 0-9 for jumping to percentage of video
          const num = parseInt(e.key);
          if (!isNaN(num) && num >= 0 && num <= 9) {
            e.preventDefault();
            const percentage = num / 10;
            player.currentTime(percentage * player.duration());
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, togglePlay, skipBackward, skipForward, toggleMute, handleFullscreen, isMuted, setVolume, takeScreenshot, togglePictureInPicture]);

  // Don't render video player if no valid source
  if (!src || src.trim() === '') {
    return (
      <div className={styles.videoPlayerContainer}>
        <div className={styles.videoContainer}>
          <div className={styles.noVideoPlaceholder}>
            <div className={styles.placeholderIcon}>🎬</div>
            <div className={styles.placeholderText}>No video selected</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.videoPlayerContainer} ${isFullscreen ? styles.fullscreen : ''} ${showControls ? '' : styles.hideControls}`} ref={containerRef}>
      {/* Floating particles animation */}
      <div className={styles.particles}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: particle.left,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Futuristic overlay text */}
      <div className={styles.overlayText}>
        <div>vcXvp v2.0</div>
        <div>FORMAT: {videoInfo.codec}</div>
        <div>RES: {videoInfo.resolution} | {videoInfo.frameRate}</div>
        <div className={styles.qualityIndicator}>
          QUALITY: <span className={
            currentQuality === '8K' ? styles.quality8K :
            currentQuality === '4K' ? styles.quality4K :
            currentQuality === '2K' ? styles.quality2K :
            styles.qualityStandard
          }>{currentQuality.toUpperCase()}</span>
          {currentQuality === 'auto' && (
            <span className={`${styles.networkQualityIndicator} ${styles[`network${networkQuality.charAt(0).toUpperCase() + networkQuality.slice(1)}`]}`}>
              • Network: {networkQuality}
            </span>
          )}
        </div>
      </div>
      
      <div ref={videoRef} className={styles.videoContainer}></div>

      {/* Loading indicator */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
          </div>
          <div className={styles.loadingText}>Loading video...</div>
        </div>
      )}

      {/* Enhanced Error overlay with suggestions */}
      {hasError && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorTitle}>Video Playback Error</div>
            <div className={styles.errorMessage}>
              {errorMessage.split('\n').map((line, index) => (
                <div key={index} className={index === 0 ? styles.mainError : styles.suggestion}>
                  {line}
                </div>
              ))}
            </div>
            <div className={styles.errorActions}>
              <button
                className={styles.retryButton}
                onClick={retryVideo}
              >
                🔄 Try Again
              </button>
              <button
                className={styles.helpButton}
                onClick={() => {
                  const helpText = `
Video Format Help:

Recommended formats:
• MP4 with H.264 codec (best compatibility)
• WebM with VP8/VP9 codec
• OGG with Theora codec

Common issues:
• File may be corrupted
• Unsupported codec
• Network connection problems
• Browser compatibility issues

Solutions:
1. Try converting to MP4 format
2. Check your internet connection
3. Update your browser
4. Try a different video file
                  `;
                  alert(helpText);
                }}
              >
                ❓ Get Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive player status indicators */}
      <div className={`${styles.statusIndicator} ${showControls ? styles.visible : ''}`}>
        <div className={styles.statusDot}></div>
        <div className={styles.statusText}>
          {playerRef.current?.paused() ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>
      
      {/* Custom futuristic UI overlay */}
      <motion.div 
        className={styles.customControls}
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls || !isPlaying || isFullscreen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress bar */}
        <div className={styles.progressContainer} ref={progressContainerRef}>
          {/* Buffered progress indicator */}
          <div 
            className={styles.bufferedProgress} 
            style={{ width: `${bufferedPercent}%` }}
          />
          
          {/* Chapter markers */}
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className={styles.chapterMarker}
              style={{ left: `${(chapter.time / duration) * 100}%` }}
              onClick={() => jumpToChapter(chapter.time)}
              title={chapter.title}
            />
          ))}
          
          <input 
            type="range"
            className={styles.progressBar}
            value={currentTime}
            min={0}
            max={duration || 100}
            step="0.01"
            onChange={seekTo}
          />
          <div 
            className={styles.progressFill} 
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
          
          {/* Thumbnail preview */}
          {thumbnailPosition !== null && (
            <div 
              className={styles.thumbnailPreview}
              style={{ left: mouseX }}
            >
              {/* In a real implementation, this would show an actual thumbnail */}
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(0,20,40,0.8)'
              }}>
                {getThumbnailTime()}
              </div>
            </div>
          )}
        </div>
        
        {/* Time display */}
        <div className={styles.timeDisplay}>
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
          {currentChapter && (
            <span 
              className={styles.chapterIndicator}
              onClick={() => setShowChapters(!showChapters)}
            >
              {currentChapter.title}
            </span>
          )}
          
          {/* Chapters dropdown */}
          {showChapters && (
            <motion.div 
              className={styles.chaptersMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h4>Chapters</h4>
              <div className={styles.chaptersList}>
                {chapters.map((chapter, index) => (
                  <div 
                    key={index}
                    className={`${styles.chapterItem} ${currentChapter?.title === chapter.title ? styles.activeChapter : ''}`}
                    onClick={() => jumpToChapter(chapter.time)}
                  >
                    <span className={styles.chapterTime}>{formatTime(chapter.time)}</span>
                    <span className={styles.chapterTitle}>{chapter.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.leftControls}>
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </motion.button>
            
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={skipBackward}
            >
              <FaStepBackward />
            </motion.button>
            
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={skipForward}
            >
              <FaStepForward />
            </motion.button>
            
            <div className={styles.volumeControl}>
              <motion.button 
                className={styles.controlButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </motion.button>
              <input 
                type="range"
                min="0" 
                max="1" 
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            </div>
          </div>
          
          <div className={styles.rightControls}>
            {/* History Button */}
            <div className={styles.settingsContainer}>
              <motion.button 
                className={styles.controlButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowHistory(!showHistory)}
                title="Video History"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.05 11C3.27151 8.68261 4.51919 6.56638 6.45983 5.13446C8.40048 3.70254 10.8667 3.07964 13.2501 3.41484C15.6335 3.75004 17.7532 5.01621 19.1117 6.91172C20.4702 8.80723 20.9495 11.1677 20.4373 13.4231C19.9252 15.6784 18.4679 17.6295 16.3958 18.8139C14.3237 19.9983 11.8159 20.3108 9.46712 19.6716C7.11839 19.0324 5.12312 17.4923 3.90672 15.3711C2.69033 13.2499 2.34119 10.7133 2.94 8.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
              
              {showHistory && (
                <motion.div 
                  className={styles.historyMenu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.settingsSection}>
                    <h4>Recently Played</h4>
                    {videoHistory.length > 0 ? (
                      <div className={styles.historyList}>
                        {videoHistory.map((item, index) => (
                          <div 
                            key={index} 
                            className={styles.historyItem}
                            onClick={() => playFromHistory(item)}
                          >
                            <div className={styles.historyItemName}>{item.name}</div>
                            <div className={styles.historyItemMeta}>
                              {item.duration ? formatTime(item.duration) : '--:--'} • {
                                new Date(item.lastPlayed).toLocaleDateString()
                              }
                            </div>
                            {item.currentTime !== undefined && item.duration !== undefined && (
                              <div className={styles.historyProgress}>
                                <div 
                                  className={styles.historyProgressFill}
                                  style={{ width: `${((item.currentTime || 0) / (item.duration || 1)) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyHistory}>No history found</div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Bookmark Button */}
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowBookmarkInput(true)}
              title="Add Bookmark"
            >
              <FaRegBookmark />
            </motion.button>
            
            {/* Screenshot Button */}
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={takeScreenshot}
              title="Take Screenshot"
            >
              <FaImage />
            </motion.button>
            
            {/* Picture-in-Picture Button */}
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePictureInPicture}
              title="Picture-in-Picture"
            >
              <FaRegWindowRestore />
            </motion.button>
            
            {/* Statistics Button */}
            <motion.button
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowStatistics(!showStatistics)}
              title="Playback Statistics"
            >
              <FaChartLine />
            </motion.button>

            {/* Video Info Button */}
            <motion.button
              className={`${styles.controlButton} ${showVideoInfo ? styles.active : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowVideoInfo(!showVideoInfo)}
              title="Video Information"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </motion.button>

            {/* Download Button */}
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={downloadVideo}
              title="Download Video"
            >
              <FaDownload />
            </motion.button>
            
            {/* Visual Effects Toggle */}
            <motion.button 
              className={`${styles.controlButton} ${showVisualEffects ? styles.active : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowVisualEffects(!showVisualEffects)}
              title="Toggle Visual Effects"
            >
              <FaEye />
            </motion.button>
            
            {/* Voice Control */}
            <VoiceControl
              isListening={voiceState.isListening}
              isSupported={voiceState.isSupported}
              status={voiceState.status}
              lastCommand={voiceState.lastCommand}
              voiceFeedbackEnabled={voiceFeedbackEnabled}
              onToggleListening={voiceActions.toggleListening}
              onToggleVoiceFeedback={(enabled) => {
                setVoiceFeedbackEnabled(enabled);
                voiceActions.setVoiceFeedback(enabled);
              }}
              onShowCommands={() => setShowVoiceCommands(true)}
            />
            
            {/* Keyboard Shortcuts Guide Button */}
            <motion.button 
              className={`${styles.controlButton} ${showShortcutGuide ? styles.active : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShortcutGuide(!showShortcutGuide)}
              title="Keyboard Shortcuts"
            >
              <FaKeyboard />
            </motion.button>
            
            {/* Settings Button */}
            <div className={styles.settingsContainer}>
              <motion.button 
                className={styles.controlButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(!showSettings)}
              >
                <FaCog />
              </motion.button>
              
              {showSettings && (
                <motion.div 
                  className={styles.settingsMenu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.settingsSection}>
                    <h4>Playback Speed</h4>
                    <div className={styles.speedOptions}>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button 
                      key={speed}
                          className={`${styles.speedOption} ${playbackSpeed === speed ? styles.active : ''}`}
                      onClick={() => changePlaybackSpeed(speed)}
                    >
                      {speed}x
                    </button>
                  ))}
                    </div>
                  </div>
                  
                  <div className={styles.settingsSection}>
                    <h4>Quality</h4>
                    <div className={styles.qualityOptions}>
                      {availableQualities.map((quality) => (
                        <button 
                          key={quality}
                          className={`${styles.qualityOption} ${currentQuality === quality ? styles.active : ''}`}
                          onClick={() => changeQuality(quality)}
                          data-quality={quality}
                        >
                          {quality}
                          {['8K', '4K', '2K'].includes(quality) && (
                            <span className={styles.premiumQualityIndicator}>Premium</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {['8K', '4K', '2K'].includes(currentQuality) && (
                      <div className={styles.qualityWarning}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 17.01L12.01 16.999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        High quality may cause buffering
                      </div>
                    )}
                    
                    <div className={styles.settingsSection}>
                      <button 
                        className={styles.comparisonButton}
                        onClick={toggleQualityComparison}
                      >
                        Compare Quality Levels
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.settingsSection}>
                    <h4>Visual Effects</h4>
                    <div className={styles.effectsOptions}>
                      <label className={styles.effectsSliderLabel}>
                        <span>Intensity</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={effectsIntensity}
                          onChange={(e) => setEffectsIntensity(parseFloat(e.target.value))}
                          disabled={!showVisualEffects}
                          className={styles.effectsSlider}
                        />
                        <span>{Math.round(effectsIntensity * 100)}%</span>
                      </label>
                      <button 
                        className={`${styles.effectsToggle} ${showVisualEffects ? styles.active : ''}`}
                        onClick={() => setShowVisualEffects(!showVisualEffects)}
                      >
                        {showVisualEffects ? 'On' : 'Off'}
                      </button>
                    </div>
                  </div>
            </motion.div>
              )}
            </div>
            
            <motion.button 
              className={styles.controlButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={debouncedHandleFullscreen}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quality change notification */}
      {showQualityNotification && (
        <motion.div 
          className={styles.qualityNotification}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.qualityNotificationIcon}>
            {currentQuality === '8K' && '8K'}
            {currentQuality === '4K' && '4K'}
            {currentQuality === '2K' && '2K'}
            {!['8K', '4K', '2K'].includes(currentQuality) && 'HD'}
          </div>
          Quality changed to {currentQuality}
          <div className={styles.qualityNotificationInfo}>
            {videoInfo.resolution.split(' ')[0]} • {videoInfo.bitrate}
          </div>
        </motion.div>
      )}

      {/* Screenshot Preview */}
      {showScreenshot && screenshotUrl && (
        <motion.div 
          className={styles.screenshotPreview}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.screenshotHeader}>
            <h3>Screenshot Captured</h3>
            <button 
              className={styles.screenshotDownload}
              onClick={() => {
                const a = document.createElement('a');
                a.href = screenshotUrl;
                a.download = `screenshot-${new Date().toISOString().replace(/:/g, '-')}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              <FaDownload /> Save
            </button>
            <button 
              className={styles.screenshotClose}
              onClick={() => setShowScreenshot(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.screenshotImageContainer}>
            <img src={screenshotUrl} alt="Video Screenshot" className={styles.screenshotImage} />
          </div>
        </motion.div>
      )}

      {/* Bookmark Input */}
      {showBookmarkInput && (
        <motion.div 
          className={styles.bookmarkInputContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <h3>Add Bookmark at {formatTime(currentTime)}</h3>
          <input
            type="text"
            className={styles.bookmarkInput}
            placeholder="Enter bookmark name"
            value={bookmarkLabel}
            onChange={(e) => setBookmarkLabel(e.target.value)}
            autoFocus
          />
          <div className={styles.bookmarkButtons}>
            <button 
              className={styles.bookmarkSave}
              onClick={addBookmark}
            >
              Save
            </button>
            <button 
              className={styles.bookmarkCancel}
              onClick={() => setShowBookmarkInput(false)}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Bookmarks List */}
      {bookmarks.length > 0 && (
        <div className={styles.bookmarksContainer}>
          <h3 className={styles.bookmarksTitle}>Bookmarks</h3>
          <div className={styles.bookmarksList}>
            {bookmarks.map((bookmark, index) => (
              <motion.div 
                key={index}
                className={styles.bookmarkItem}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => showBookmarkPreview(index)}
                onMouseLeave={hideBookmarkPreview}
              >
                <div className={styles.bookmarkContent} onClick={() => jumpToBookmark(bookmark.time)}>
                  <span className={styles.bookmarkTime}>{formatTime(bookmark.time)}</span>
                  <span className={styles.bookmarkLabel}>{bookmark.label}</span>
                </div>
                <button 
                  className={styles.bookmarkDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(index);
                  }}
                  title="Remove bookmark"
                >
                  ×
                </button>
                
                {/* Preview popup */}
                {previewBookmarkIndex === index && (
                  <div className={styles.bookmarkPreview}>
                    <video 
                      ref={previewVideoRef}
                      className={styles.bookmarkPreviewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className={styles.bookmarkPreviewTime}>{formatTime(bookmark.time)}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Overlay */}
      {showStatistics && (
        <motion.div 
          className={styles.statisticsOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.statisticsContent}>
            <h3>Playback Statistics</h3>
            <div className={styles.statisticsGrid}>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>Watch Time</span>
                <span className={styles.statisticsValue}>{formatTime(playbackStats.watchTime)}</span>
              </div>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>Buffering Events</span>
                <span className={styles.statisticsValue}>{playbackStats.bufferingEvents}</span>
              </div>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>Average Bitrate</span>
                <span className={styles.statisticsValue}>{playbackStats.averageBitrate} kbps</span>
              </div>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>Dropped Frames</span>
                <span className={styles.statisticsValue}>{playbackStats.droppedFrames}</span>
              </div>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>Resolution</span>
                <span className={styles.statisticsValue}>{videoInfo.resolution}</span>
              </div>
              <div className={styles.statisticsItem}>
                <span className={styles.statisticsLabel}>Codec</span>
                <span className={styles.statisticsValue}>{videoInfo.codec}</span>
              </div>
            </div>
            <button 
              className={styles.statisticsClose}
              onClick={() => setShowStatistics(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Guide Overlay */}
      {showShortcutGuide && (
        <div className={styles.shortcutGuideOverlay}>
          <div className={styles.shortcutGuideContent}>
            <h3>Keyboard Shortcuts</h3>
            <div className={styles.shortcutGrid}>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>Space/K</span>
                <span>Play/Pause</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>J</span>
                <span>Skip Back 10s</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>L</span>
                <span>Skip Forward 10s</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>M</span>
                <span>Mute/Unmute</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>F</span>
                <span>Fullscreen</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>S</span>
                <span>Settings</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>← →</span>
                <span>Skip 5 seconds</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>↑ ↓</span>
                <span>Volume Up/Down</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>, .</span>
                <span>Prev/Next Frame</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>0-9</span>
                <span>Jump to % of video</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>/</span>
                <span>Show/Hide Shortcuts</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>H</span>
                <span>Video History</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>Q</span>
                <span>Quality Settings (8K-360p)</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>B</span>
                <span>Add Bookmark</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>P</span>
                <span>Picture-in-Picture</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>I</span>
                <span>Take Screenshot</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>V</span>
                <span>Toggle Effects</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>T</span>
                <span>Show Statistics</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>C</span>
                <span>Show Chapters</span>
              </div>
              <div className={styles.shortcutItem}>
                <span className={styles.shortcutKey}>N</span>
                <span>Video Info</span>
              </div>
            </div>
            <button 
              className={styles.shortcutCloseButton}
              onClick={() => setShowShortcutGuide(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quality Comparison Overlay */}
      {showQualityComparison && (
        <div className={styles.qualityComparisonOverlay}>
          <div className={styles.qualityComparisonContent}>
            <h3>Quality Comparison</h3>
            
            <div className={styles.qualityComparisonGrid}>
              <div className={styles.qualityComparisonItem}>
                <div className={styles.qualityComparisonTitle}>8K Ultra HD</div>
                <div className={styles.qualityComparisonImage}>
                  <div className={styles.qualityComparisonImagePlaceholder} style={{background: 'linear-gradient(45deg, #00f7ff, #0066ff)'}}>
                    <span>7680×4320</span>
                  </div>
                </div>
                <div className={styles.qualityComparisonSpecs}>
                  <div>Bitrate: 80-100 Mbps</div>
                  <div>Perfect for: 65&quot;+ TVs</div>
                </div>
              </div>
              
              <div className={styles.qualityComparisonItem}>
                <div className={styles.qualityComparisonTitle}>4K Ultra HD</div>
                <div className={styles.qualityComparisonImage}>
                  <div className={styles.qualityComparisonImagePlaceholder} style={{background: 'linear-gradient(45deg, #00f7ff, #0055dd)'}}>
                    <span>3840×2160</span>
                  </div>
                </div>
                <div className={styles.qualityComparisonSpecs}>
                  <div>Bitrate: 40-60 Mbps</div>
                  <div>Perfect for: 50&quot;+ TVs</div>
                </div>
              </div>
              
              <div className={styles.qualityComparisonItem}>
                <div className={styles.qualityComparisonTitle}>2K Quad HD</div>
                <div className={styles.qualityComparisonImage}>
                  <div className={styles.qualityComparisonImagePlaceholder} style={{background: 'linear-gradient(45deg, #00d7ff, #0044bb)'}}>
                    <span>2560×1440</span>
                  </div>
                </div>
                <div className={styles.qualityComparisonSpecs}>
                  <div>Bitrate: 20-30 Mbps</div>
                  <div>Perfect for: Monitors</div>
                </div>
              </div>
              
              <div className={styles.qualityComparisonItem}>
                <div className={styles.qualityComparisonTitle}>1080p Full HD</div>
                <div className={styles.qualityComparisonImage}>
                  <div className={styles.qualityComparisonImagePlaceholder} style={{background: 'linear-gradient(45deg, #00b7ff, #0033aa)'}}>
                    <span>1920×1080</span>
                  </div>
                </div>
                <div className={styles.qualityComparisonSpecs}>
                  <div>Bitrate: 8-12 Mbps</div>
                  <div>Perfect for: Laptops</div>
                </div>
              </div>
              
              <div className={styles.qualityComparisonItem}>
                <div className={styles.qualityComparisonTitle}>720p HD</div>
                <div className={styles.qualityComparisonImage}>
                  <div className={styles.qualityComparisonImagePlaceholder} style={{background: 'linear-gradient(45deg, #0097ff, #002299)'}}>
                    <span>1280×720</span>
                  </div>
                </div>
                <div className={styles.qualityComparisonSpecs}>
                  <div>Bitrate: 5-8 Mbps</div>
                  <div>Perfect for: Tablets</div>
                </div>
              </div>
              
              <div className={styles.qualityComparisonItem}>
                <div className={styles.qualityComparisonTitle}>480p SD</div>
                <div className={styles.qualityComparisonImage}>
                  <div className={styles.qualityComparisonImagePlaceholder} style={{background: 'linear-gradient(45deg, #0077ff, #001188)'}}>
                    <span>854×480</span>
                  </div>
                </div>
                <div className={styles.qualityComparisonSpecs}>
                  <div>Bitrate: 2-4 Mbps</div>
                  <div>Perfect for: Mobile</div>
                </div>
              </div>
            </div>
            
            <button 
              className={styles.qualityComparisonClose}
              onClick={() => setShowQualityComparison(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Information Modal */}
      {showVideoInfo && (
        <div className={styles.modalOverlay} onClick={() => setShowVideoInfo(false)}>
          <div className={styles.videoInfoModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.videoInfoHeader}>
              <h3>Video Information</h3>
              <button
                className={styles.videoInfoClose}
                onClick={() => setShowVideoInfo(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.videoInfoContent}>
              <div className={styles.videoInfoSection}>
                <h4>Technical Details</h4>
                <div className={styles.videoInfoGrid}>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Resolution:</span>
                    <span className={styles.videoInfoValue}>{videoInfo.resolution || 'Unknown'}</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Bitrate:</span>
                    <span className={styles.videoInfoValue}>{videoInfo.bitrate || 'Unknown'}</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Frame Rate:</span>
                    <span className={styles.videoInfoValue}>{videoInfo.frameRate || 'Unknown'}</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Codec:</span>
                    <span className={styles.videoInfoValue}>{videoInfo.codec || 'Unknown'}</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Duration:</span>
                    <span className={styles.videoInfoValue}>{formatTime(duration)}</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Current Time:</span>
                    <span className={styles.videoInfoValue}>{formatTime(currentTime)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.videoInfoSection}>
                <h4>Playback Statistics</h4>
                <div className={styles.videoInfoGrid}>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Quality:</span>
                    <span className={styles.videoInfoValue}>{currentQuality}</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Speed:</span>
                    <span className={styles.videoInfoValue}>{playbackSpeed}x</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Volume:</span>
                    <span className={styles.videoInfoValue}>{Math.round(volume * 100)}%</span>
                  </div>
                  <div className={styles.videoInfoItem}>
                    <span className={styles.videoInfoLabel}>Network:</span>
                    <span className={styles.videoInfoValue}>{networkQuality}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Commands Modal */}
      <VoiceCommandsModal
        isOpen={showVoiceCommands}
        onClose={() => setShowVoiceCommands(false)}
      />
    </div>
  );
};

export default VideoPlayer;
/**
 * React hook for voice control integration
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { VoiceController, VoiceFeedback } from '@/utils/voiceControl';
import { MLVoiceDetection } from '@/utils/mlVoiceDetection';

interface VoiceControlState {
  isListening: boolean;
  isSupported: boolean;
  status: string;
  lastCommand: string | null;
}

interface VoiceControlActions {
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  setVoiceFeedback: (enabled: boolean) => void;
}

export const useVoiceControl = (
  onCommand: (command: string, params?: any) => void
): [VoiceControlState, VoiceControlActions] => {
  const [state, setState] = useState<VoiceControlState>({
    isListening: false,
    isSupported: false,
    status: 'Voice control ready',
    lastCommand: null,
  });

  const voiceController = useRef<VoiceController | null>(null);
  const voiceFeedback = useRef<VoiceFeedback | null>(null);
  const mlDetection = useRef<MLVoiceDetection | null>(null);

  const handleCommand = useCallback((command: string, params?: any) => {
    setState(prev => ({ ...prev, lastCommand: command }));
    onCommand(command, params);
    
    // Provide voice feedback
    if (voiceFeedback.current?.isEnabled()) {
      const feedbackText = getCommandFeedback(command, params);
      if (feedbackText) {
        voiceFeedback.current.speak(feedbackText);
      }
    }
  }, [onCommand]);

  const handleStatus = useCallback((status: string, isListening: boolean) => {
    setState(prev => ({ ...prev, status, isListening }));
  }, []);

  const startListening = useCallback(() => {
    voiceController.current?.startListening();
  }, []);

  const stopListening = useCallback(() => {
    voiceController.current?.stopListening();
  }, []);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  const setVoiceFeedback = useCallback((enabled: boolean) => {
    voiceFeedback.current?.setEnabled(enabled);
  }, []);

  useEffect(() => {
    // Check if speech recognition is supported
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    setState(prev => ({ ...prev, isSupported }));

    if (isSupported) {
      voiceController.current = new VoiceController(handleCommand, handleStatus);
      voiceFeedback.current = new VoiceFeedback();
      mlDetection.current = new MLVoiceDetection();
      
      // Make ML detection globally available
      (window as any).mlVoiceDetection = mlDetection.current;
    }

    return () => {
      voiceController.current?.destroy();
    };
  }, [handleCommand, handleStatus]);

  return [
    state,
    {
      startListening,
      stopListening,
      toggleListening,
      setVoiceFeedback,
    },
  ];
};

// Helper function to generate voice feedback text
const getCommandFeedback = (command: string, params?: any): string | null => {
  const feedbackMap: { [key: string]: string } = {
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
    voiceOff: 'Voice control disabled',
  };

  if (params) {
    switch (command) {
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
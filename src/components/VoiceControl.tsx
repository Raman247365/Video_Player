'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeOff } from 'react-icons/fa';

interface VoiceControlProps {
  isListening: boolean;
  isSupported: boolean;
  status: string;
  lastCommand: string | null;
  voiceFeedbackEnabled: boolean;
  onToggleListening: () => void;
  onToggleVoiceFeedback: () => void;
  onShowCommands: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isSupported,
  status,
  lastCommand,
  voiceFeedbackEnabled,
  onToggleListening,
  onToggleVoiceFeedback,
  onShowCommands,
}) => {
  if (!isSupported) {
    return (
      <div className="voice-control-unsupported">
        <span className="text-gray-500 text-sm">Voice control not supported</span>
      </div>
    );
  }

  return (
    <div className="voice-control-container">
      {/* Voice Control Button */}
      <motion.button
        className={`voice-control-button ${isListening ? 'listening' : ''}`}
        onClick={onToggleListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isListening ? 'Stop voice control' : 'Start voice control'}
      >
        {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
        
        {/* Listening animation */}
        {isListening && (
          <motion.div
            className="listening-pulse"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Voice Feedback Toggle */}
      <motion.button
        className="voice-feedback-button"
        onClick={onToggleVoiceFeedback}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={voiceFeedbackEnabled ? 'Disable voice feedback' : 'Enable voice feedback'}
      >
        {voiceFeedbackEnabled ? <FaVolumeUp /> : <FaVolumeOff />}
      </motion.button>

      {/* Help Button */}
      <motion.button
        className="voice-help-button"
        onClick={onShowCommands}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Show voice commands"
      >
        ?
      </motion.button>

      {/* Status Display */}
      <AnimatePresence>
        {(isListening || lastCommand) && (
          <motion.div
            className="voice-status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="status-text">{status}</div>
            {lastCommand && (
              <div className="last-command">Last: {lastCommand}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Waveform Visualization */}
      {isListening && <VoiceWaveform />}

      <style jsx>{`
        .voice-control-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-control-button {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .voice-control-button:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(0, 0, 0, 0.8);
        }

        .voice-control-button.listening {
          border-color: #00ff00;
          background: rgba(0, 255, 0, 0.1);
          color: #00ff00;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }

        .listening-pulse {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid #00ff00;
          border-radius: 50%;
          pointer-events: none;
        }

        .voice-feedback-button,
        .voice-help-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 12px;
        }

        .voice-feedback-button:hover,
        .voice-help-button:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(0, 0, 0, 0.8);
        }

        .voice-status {
          position: absolute;
          top: -60px;
          left: 0;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 8px 12px;
          min-width: 200px;
          backdrop-filter: blur(10px);
        }

        .status-text {
          color: #00ff00;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .last-command {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
        }

        .voice-control-unsupported {
          display: flex;
          align-items: center;
          padding: 4px 8px;
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

// Voice waveform visualization component
const VoiceWaveform: React.FC = () => {
  return (
    <div className="voice-waveform">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="waveform-bar"
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}

      <style jsx>{`
        .voice-waveform {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: end;
          gap: 2px;
          height: 20px;
        }

        .waveform-bar {
          width: 3px;
          height: 100%;
          background: #00ff00;
          border-radius: 1px;
          transform-origin: bottom;
        }
      `}</style>
    </div>
  );
};

export default VoiceControl;
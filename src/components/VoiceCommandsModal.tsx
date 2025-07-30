'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCommandsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceCommandsModal: React.FC<VoiceCommandsModalProps> = ({ isOpen, onClose }) => {
  const commandCategories = [
    {
      title: '🎮 Playback Control',
      commands: [
        { command: 'play / start / resume', description: 'Start playback' },
        { command: 'pause / stop', description: 'Pause playback' },
        { command: 'play pause', description: 'Toggle play/pause' },
        { command: 'restart', description: 'Restart from beginning' },
        { command: 'mute / unmute', description: 'Toggle audio' },
      ]
    },
    {
      title: '⏭️ Navigation',
      commands: [
        { command: 'skip forward', description: 'Skip 10 seconds forward' },
        { command: 'skip backward', description: 'Skip 10 seconds backward' },
        { command: 'jump to [time]', description: 'Jump to specific time' },
        { command: 'jump to [percent]', description: 'Jump to percentage' },
        { command: 'next frame', description: 'Next frame (when paused)' },
      ]
    },
    {
      title: '🔊 Volume Control',
      commands: [
        { command: 'volume up / down', description: 'Adjust volume by 10%' },
        { command: 'volume [number]', description: 'Set volume to specific %' },
        { command: 'max volume', description: 'Set to 100%' },
        { command: 'min volume', description: 'Set to 0%' },
      ]
    },
    {
      title: '⚡ Speed Control',
      commands: [
        { command: 'speed up / slow down', description: 'Adjust playback speed' },
        { command: 'normal speed', description: 'Reset to 1x speed' },
        { command: 'speed [number]', description: 'Set specific speed' },
        { command: 'double speed', description: 'Set to 2x speed' },
        { command: 'half speed', description: 'Set to 0.5x speed' },
      ]
    },
    {
      title: '🎯 Quality Control',
      commands: [
        { command: 'quality auto', description: 'Auto quality selection' },
        { command: 'quality 8k / 4k / 1080p', description: 'Set specific quality' },
        { command: 'best quality', description: 'Highest available quality' },
        { command: 'lowest quality', description: 'Lowest available quality' },
      ]
    },
    {
      title: '📺 Display Control',
      commands: [
        { command: 'fullscreen', description: 'Enter fullscreen mode' },
        { command: 'exit fullscreen', description: 'Exit fullscreen mode' },
        { command: 'picture in picture', description: 'Toggle PiP mode' },
        { command: 'take screenshot', description: 'Capture current frame' },
      ]
    },
    {
      title: '🔖 Bookmarks',
      commands: [
        { command: 'add bookmark', description: 'Add bookmark at current time' },
        { command: 'bookmark [name]', description: 'Add named bookmark' },
        { command: 'go to bookmark [name]', description: 'Jump to bookmark' },
        { command: 'show bookmarks', description: 'Display bookmarks list' },
      ]
    },
    {
      title: '📊 Information',
      commands: [
        { command: 'show info', description: 'Display video information' },
        { command: 'show stats', description: 'Display playback statistics' },
        { command: 'what time', description: 'Announce current time' },
        { command: 'how long', description: 'Announce video duration' },
      ]
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="voice-commands-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="voice-commands-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>🎤 Voice Commands</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="modal-content">
              <div className="intro-text">
                <p>Control the video player with your voice! Say any of these commands:</p>
              </div>

              <div className="commands-grid">
                {commandCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    className="command-category"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3>{category.title}</h3>
                    <div className="commands-list">
                      {category.commands.map((cmd, cmdIndex) => (
                        <div key={cmdIndex} className="command-item">
                          <div className="command-text">"{cmd.command}"</div>
                          <div className="command-description">{cmd.description}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="tips-section">
                <h3>💡 Tips</h3>
                <ul>
                  <li>Speak clearly and at normal volume</li>
                  <li>Wait for the green microphone indicator</li>
                  <li>Use natural language: "jump to 2 minutes 30 seconds"</li>
                  <li>Say "voice off" to disable voice control</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            .voice-commands-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 2000;
              backdrop-filter: blur(4px);
            }

            .voice-commands-modal {
              background: rgba(20, 20, 20, 0.95);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              width: 90%;
              max-width: 1000px;
              max-height: 90vh;
              overflow-y: auto;
              box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
            }

            .modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .modal-header h2 {
              color: #00ff00;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
              text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            }

            .close-button {
              background: none;
              border: none;
              color: white;
              font-size: 28px;
              cursor: pointer;
              padding: 0;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              transition: all 0.3s ease;
            }

            .close-button:hover {
              background: rgba(255, 255, 255, 0.1);
              color: #ff4444;
            }

            .modal-content {
              padding: 20px;
            }

            .intro-text {
              margin-bottom: 24px;
              text-align: center;
            }

            .intro-text p {
              color: rgba(255, 255, 255, 0.8);
              font-size: 16px;
              margin: 0;
            }

            .commands-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
              margin-bottom: 24px;
            }

            .command-category {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 16px;
            }

            .command-category h3 {
              color: #00ff00;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 12px 0;
              text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
            }

            .commands-list {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .command-item {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }

            .command-text {
              color: #ffffff;
              font-family: 'Courier New', monospace;
              font-size: 13px;
              font-weight: 500;
              background: rgba(0, 255, 0, 0.1);
              padding: 4px 8px;
              border-radius: 4px;
              border: 1px solid rgba(0, 255, 0, 0.3);
            }

            .command-description {
              color: rgba(255, 255, 255, 0.7);
              font-size: 12px;
              padding-left: 8px;
            }

            .tips-section {
              background: rgba(0, 255, 0, 0.05);
              border: 1px solid rgba(0, 255, 0, 0.2);
              border-radius: 8px;
              padding: 16px;
            }

            .tips-section h3 {
              color: #00ff00;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 12px 0;
            }

            .tips-section ul {
              margin: 0;
              padding-left: 20px;
              color: rgba(255, 255, 255, 0.8);
            }

            .tips-section li {
              margin-bottom: 4px;
              font-size: 14px;
            }

            @media (max-width: 768px) {
              .voice-commands-modal {
                width: 95%;
                margin: 20px;
              }

              .commands-grid {
                grid-template-columns: 1fr;
              }

              .modal-header {
                padding: 16px;
              }

              .modal-content {
                padding: 16px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCommandsModal;
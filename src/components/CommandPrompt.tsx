'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

const commands = [
  'play', 'pause', 'stop', 'mute', 'fullscreen', 'pip',
  'volume', 'speed', 'seek', 'forward', 'backward',
  'next', 'prev', 'previous', 'shuffle', 'repeat',
  'quality', 'screenshot', 'capture', 'bookmark', 'bookmarks',
  'debug', 'console', 'inspect', 'stats',
  'home', 'back', 'forward-page', 'upload', 'folder',
  'clear', 'reload', 'theme', 'minimize', 'maximize', 'close', 'help'
];

const CommandPrompt: React.FC<CommandPromptProps> = ({ isOpen, onClose, onCommand }) => {
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = commands.filter(cmd => 
    cmd.toLowerCase().includes(input.toLowerCase()) && input.length > 0
  ).slice(0, 8);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions[selectedIndex]) {
        setInput(suggestions[selectedIndex]);
      }
    }
  };
  
  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl mx-4"
        >
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-lg">></span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
              />
            </div>
          </form>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-t border-gray-700 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                >
                  <span className="text-gray-500 mr-2">></span>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          
          <div className="px-4 pb-4 text-xs text-gray-500 border-t border-gray-700">
            {input.length === 0 ? (
              <span>Type to see suggestions • Tab to complete • ↑↓ to navigate</span>
            ) : suggestions.length > 0 ? (
              <span>Tab to complete • Enter to execute • Escape to close</span>
            ) : (
              <span>No matches found • Enter to execute • Escape to close</span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPrompt;
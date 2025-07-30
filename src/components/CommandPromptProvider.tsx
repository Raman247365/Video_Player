'use client';

import React, { useState, useEffect } from 'react';
import CommandPrompt from './CommandPrompt';

interface CommandPromptProviderProps {
  children: React.ReactNode;
}

const CommandPromptProvider: React.FC<CommandPromptProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    const args = cmd.split(' ');
    const action = args[0];
    
    // Get video element if exists
    const video = document.querySelector('video') as HTMLVideoElement;
    
    switch (action) {
      // Playback controls
      case 'play': video?.play(); break;
      case 'pause': video?.pause(); break;
      case 'stop': video && (video.currentTime = 0, video.pause()); break;
      case 'mute': video && (video.muted = !video.muted); break;
      case 'fullscreen': video?.requestFullscreen(); break;
      
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
        
      case 'forward': video && (video.currentTime += 10); break;
      case 'backward': video && (video.currentTime -= 10); break;
      
      // Playlist controls
      case 'next': document.querySelector('[data-next-video]')?.click(); break;
      case 'prev': case 'previous': document.querySelector('[data-prev-video]')?.click(); break;
      case 'shuffle': localStorage.setItem('shuffle', 'true'); break;
      case 'repeat': localStorage.setItem('repeat', 'true'); break;
      
      // Quality controls
      case 'quality':
        if (args[1]) {
          const qualities = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
          if (qualities.includes(args[1])) console.log(`Quality set to ${args[1]}`);
        }
        break;
        
      // Screenshot and recording
      case 'screenshot': case 'capture':
        if (video) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0);
          canvas.toBlob(blob => {
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
          bookmarks.push({ time, name: args.slice(1).join(' ') || `Bookmark ${bookmarks.length + 1}` });
          localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
          console.log('Bookmark saved');
        }
        break;
        
      case 'bookmarks':
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        console.log('Bookmarks:', bookmarks);
        break;
        
      // Developer tools
      case 'debug': console.log('Video info:', { currentTime: video?.currentTime, duration: video?.duration, volume: video?.volume, speed: video?.playbackRate }); break;
      case 'console': console.clear(); break;
      case 'inspect': document.body.style.outline = '1px solid red'; break;
      case 'stats': console.log('App stats:', { localStorage: Object.keys(localStorage).length, videos: document.querySelectorAll('video').length }); break;
      
      // Navigation
      case 'home': window.location.href = '/'; break;
      case 'back': window.history.back(); break;
      case 'forward-page': window.history.forward(); break;
      
      // App controls
      case 'upload': document.querySelector('input[type="file"]')?.click(); break;
      case 'folder': document.querySelector('input[webkitdirectory]')?.click(); break;
      case 'clear': localStorage.clear(); window.location.reload(); break;
      case 'reload': window.location.reload(); break;
      case 'theme': document.body.classList.toggle('light-theme'); break;
      case 'pip': video?.requestPictureInPicture(); break;
      
      // Window controls
      case 'minimize': console.log('Minimize not available in browser'); break;
      case 'maximize': document.documentElement.requestFullscreen(); break;
      case 'close': window.close(); break;
      
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

  return (
    <>
      {children}
      <CommandPrompt
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCommand={handleCommand}
      />
    </>
  );
};

export default CommandPromptProvider;
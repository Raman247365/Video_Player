'use client';

'use client';

import * as React from 'react';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import Playlist, { PlaylistItem } from '@/components/VideoPlayer/Playlist';
import ParticlesBackground from '@/components/ParticlesBackground';
import { validateVideoFile } from '@/utils/videoUtils';
import { FaFileUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import VoiceCommandsModal from '@/components/VoiceCommandsModal';

export default function Home() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showFeatures, setShowFeatures] = React.useState(false);
  const [playlistItems, setPlaylistItems] = React.useState<PlaylistItem[]>([]);
  const [currentVideo, setCurrentVideo] = React.useState<PlaylistItem | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'recent' | 'name'>('recent');
  const [videoError, setVideoError] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [showWelcomeTutorial, setShowWelcomeTutorial] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{fileName: string, progress: number} | null>(null);
  const [showVoiceCommands, setShowVoiceCommands] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  // Utility function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load saved videos from localStorage on component mount
  React.useEffect(() => {
    const loadSavedVideos = () => {
      try {
        const savedVideosJson = localStorage.getItem('futuristicPlayer_videos');
        if (savedVideosJson) {
          const savedVideos = JSON.parse(savedVideosJson);
          if (Array.isArray(savedVideos) && savedVideos.length > 0) {
            // Convert saved paths back to playlist items (without src URLs)
            const videoItems = savedVideos.map(video => ({
              ...video,
              src: '', // Will need to be re-selected by user
            }));
            
            // Don't set current video if no src available
            setPlaylistItems(videoItems);
            return; // Skip setting current video

          }
        }
      } catch (error) {
        console.error('Error loading saved videos:', error);
      }
    };

    loadSavedVideos();

    // Show tutorial for first-time users
    const hasSeenTutorial = localStorage.getItem('futuristic-player-tutorial-seen');
    if (!hasSeenTutorial && playlistItems.length === 0) {
      setTimeout(() => setShowWelcomeTutorial(true), 2000);
    }
  }, []); // Remove playlistItems.length dependency to prevent infinite re-renders

  // Save video paths to localStorage whenever the playlist changes
  React.useEffect(() => {
    if (playlistItems.length > 0) {
      try {
        // Save file paths instead of blob URLs
        const videoPaths = playlistItems.map(item => ({
          id: item.id,
          title: item.title,
          filePath: item.filePath,
          type: item.type,
          lastAccessed: item.lastAccessed,
          metadata: item.metadata
        }));
        localStorage.setItem('futuristicPlayer_videos', JSON.stringify(videoPaths));
      } catch (error) {
        console.error('Error saving videos to localStorage:', error);
      }
    }
  }, [playlistItems]);

  // Save the currently playing video ID
  React.useEffect(() => {
    if (currentVideo) {
      localStorage.setItem('futuristicPlayer_lastPlayed', currentVideo.id);
    }
  }, [currentVideo]);

  // Video player event handlers
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleVideoSelect = React.useCallback((video: PlaylistItem) => {
    // If no src, prompt user to select the file again
    if (!video.src) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const fileUrl = URL.createObjectURL(file);
          const updatedVideo = { ...video, src: fileUrl };
          
          // Update playlist with new src
          const updatedPlaylist = playlistItems.map(item => 
            item.id === video.id ? { ...updatedVideo, lastAccessed: Date.now() } : item
          );
          
          setPlaylistItems(updatedPlaylist);
          setCurrentVideo(updatedVideo);
          setIsPlaying(true);
        }
      };
      input.click();
      return;
    }
    
    // Update the lastAccessed timestamp
    const updatedPlaylist = playlistItems.map(item => {
      if (item.id === video.id) {
        return {
          ...item,
          lastAccessed: Date.now()
        };
      }
      return item;
    });
    
    setPlaylistItems(updatedPlaylist);
    setCurrentVideo(video);
    setIsPlaying(true);
  }, [playlistItems]);

  // Process files function that can be used by both file input and drag & drop
  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const newPlaylistItems: PlaylistItem[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      // Show upload progress
      setUploadProgress({ fileName: file.name, progress: 0 });

      // Simulate upload progress with setTimeout
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 25;
        setUploadProgress({ fileName: file.name, progress });
        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setUploadProgress(null), 500);
        }
      }, 100);

      // Validate video file using enhanced validation
      const validation = validateVideoFile(file);

      if (!validation.valid) {
        setVideoError(`${file.name}: ${validation.error}`);
        clearInterval(progressInterval);
        setUploadProgress(null);
        return; // Skip this file
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn(`Warnings for ${file.name}:`, validation.warnings);
        // You could show these warnings to the user in a toast notification
      }



      // Create a blob URL for the file
      const fileUrl = URL.createObjectURL(file);

      // Extract basic metadata
      const metadata = {
        size: file.size,
        lastModified: file.lastModified,
        sizeFormatted: formatFileSize(file.size)
      };
      
      // Enhanced MIME type detection with browser compatibility check
      let fileType = file.type || '';
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      // Comprehensive extension to MIME type mapping with codec information
      const extensionMap: Record<string, string> = {
        // Most compatible formats
        'mp4': 'video/mp4',
        'm4v': 'video/mp4',
        // Web-optimized formats
        'webm': 'video/webm',
        'ogg': 'video/ogg',
        'ogv': 'video/ogg',
        // Common formats (may need conversion)
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'flv': 'video/x-flv',
        'wmv': 'video/x-ms-wmv',
        'mkv': 'video/x-matroska',
        '3gp': 'video/3gpp',
        'asf': 'video/x-ms-asf',
        'rm': 'video/x-pn-realvideo',
        'rmvb': 'video/x-pn-realvideo',
        'vob': 'video/x-ms-vob'
      };

      // If browser doesn't provide MIME type, determine from extension
      if (!fileType || fileType === '') {
        fileType = extensionMap[fileExtension] || 'video/mp4';
      }

      // Validate that it's actually a video file
      if (!fileType.startsWith('video/') && !file.name.match(/\.(mp4|webm|ogg|mov|avi|flv|wmv|mkv|m4v|3gp)$/i)) {
        setVideoError(`File "${file.name}" is not a supported video format. Please use MP4, WebM, OGG, or other common video formats.`);
        clearInterval(progressInterval);
        setUploadProgress(null);
        return; // Skip this file
      }

      // Check browser support for the detected format
      const testVideo = document.createElement('video');
      const canPlay = testVideo.canPlayType(fileType);

      if (canPlay === '') {
        // Try to suggest a better format
        const recommendedFormat = fileExtension === 'avi' || fileExtension === 'wmv' || fileExtension === 'flv'
          ? 'MP4 with H.264 codec'
          : 'MP4 format';

        console.warn(`File "${file.name}" (${fileType}) may not be fully supported by your browser. Consider converting to ${recommendedFormat} for better compatibility.`);
        // Continue anyway, but with a warning
      }
      
      // Create a new playlist item
      const newItem: PlaylistItem = {
        id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name,
        src: fileUrl,
        type: fileType,
        filePath: file.webkitRelativePath || file.name, // Store full path
        lastAccessed: Date.now(), // Add timestamp for sorting
        metadata
      };
      
      newPlaylistItems.push(newItem);
    });

    // Add new videos to playlist
    const updatedPlaylist = [...playlistItems, ...newPlaylistItems];
    setPlaylistItems(updatedPlaylist);

    // Set the first new video as current if no video is playing
    if (!currentVideo && newPlaylistItems.length > 0) {
      setCurrentVideo(newPlaylistItems[0]);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show success message
    if (newPlaylistItems.length > 0) {
      console.log(`Successfully added ${newPlaylistItems.length} video(s)!`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Create file URLs for browsing without uploading
    const newPlaylistItems: PlaylistItem[] = [];
    Array.from(files).forEach((file) => {
      const validation = validateVideoFile(file);
      if (!validation.valid) return;
      
      const fileUrl = URL.createObjectURL(file);
      const metadata = {
        size: file.size,
        lastModified: file.lastModified,
        sizeFormatted: formatFileSize(file.size)
      };
      
      const newItem: PlaylistItem = {
        id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name,
        src: fileUrl,
        type: file.type || 'video/mp4',
        filePath: file.webkitRelativePath || file.name,
        lastAccessed: Date.now(),
        metadata
      };
      
      newPlaylistItems.push(newItem);
    });
    
    setPlaylistItems(prev => [...prev, ...newPlaylistItems]);
    if (!currentVideo && newPlaylistItems.length > 0) {
      setCurrentVideo(newPlaylistItems[0]);
    }
    
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openFolderSelector = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFiles = files.filter(file => file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|ogg|mov|avi|flv|wmv|mkv|m4v|3gp)$/i));

    if (videoFiles.length === 0) {
      setVideoError('Please drop video files only');
      return;
    }

    // Process dropped files
    processFiles(videoFiles);
  };

  // Function to clear all videos from playlist and storage
  const clearPlaylist = () => {
    setPlaylistItems([]);
    setCurrentVideo(null);
    localStorage.removeItem('futuristicPlayer_videos');
    localStorage.removeItem('futuristicPlayer_lastPlayed');
  };

  // Sort playlist items based on current sort order
  const sortedPlaylistItems = React.useMemo(() => {
    if (sortOrder === 'recent') {
      return [...playlistItems].sort((a, b) => {
        const timeA = a.lastAccessed || 0;
        const timeB = b.lastAccessed || 0;
        return timeB - timeA; // Most recent first
      });
    } else {
      return [...playlistItems].sort((a, b) => {
        return a.title.localeCompare(b.title); // Alphabetical by name
      });
    }
  }, [playlistItems, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'recent' ? 'name' : 'recent');
  };



  return (
    <main
      className={`min-h-screen bg-black text-white transition-all duration-300 ${
        isDragOver ? 'bg-gray-900 border-2 border-dashed border-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hero section with futuristic background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          {/* Animated tech background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi4wNzUgMC0xMSA0LjkyNS0xMSAxMXM0LjkyNSAxMSAxMSAxMSAxMS00LjkyNSAxMS0xMS00LjkyNS0xMS0xMS0xMXptMC0yYzcuMTggMCAxMyA1LjgyIDEzIDEzcy01LjgyIDEzLTEzIDEzLTEzLTUuODItMTMtMTMgNS44Mi0xMyAxMy0xM3ptMC0yYzkuMzg5IDAgMTcgNy42MSAxNyAxN3MtNy42MSAxNy0xNyAxNy0xNy03LjYxLTE3LTE3IDcuNjEtMTcgMTctMTd6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')]"></div>
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-12 gap-4 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`v-${i}`} className="h-full w-[1px] bg-gradient-to-b from-transparent via-gray-700/20 to-transparent"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-12 gap-4 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`h-${i}`} className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700/20 to-transparent"></div>
            ))}
          </div>
          
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 circuit-pattern opacity-10"></div>
          
          {/* Animated particles */}
          <ParticlesBackground />
          
          
          {/* Radar scanner effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none opacity-20">
            <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
            <div className="absolute inset-0 border border-white/20 rounded-full" style={{ transform: 'scale(0.8)' }}></div>
            <div className="absolute inset-0 border border-white/10 rounded-full" style={{ transform: 'scale(0.6)' }}></div>
            <div className="absolute inset-0 border border-white/5 rounded-full" style={{ transform: 'scale(0.4)' }}></div>
            <div className="absolute left-1/2 top-1/2 h-1/2 w-1 bg-gradient-to-t from-white/50 to-transparent origin-bottom animate-radar"></div>
          </div>
          
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-scan"></div>
          </div>
          
          {/* Noise overlay */}
          <div className="absolute inset-0 noise-bg opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 glow-text">
              <span className="block text-white relative hover:text-cyan-400 transition-colors duration-300 cursor-default hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                vcXvp
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></span>
                <span className="absolute -left-4 top-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="absolute -right-4 top-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-8 hover:text-blue-300 transition-colors duration-300 cursor-default">
              Experience the next generation of video playback with our hyper-futuristic, 
              feature-rich player that supports local video files.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeatures(!showFeatures)}
                className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium border border-cyan-400 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] hover:border-cyan-300 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 opacity-30"></span>
                <span className="absolute inset-0 border border-cyan-400 opacity-0 group-hover:opacity-40 rounded-full scale-90 group-hover:scale-100 transition-all duration-300"></span>
                <span className="relative z-10">{showFeatures ? 'Hide Features' : 'Explore Features'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openFileSelector}
                className="px-6 py-3 bg-gray-900 rounded-full font-medium flex items-center gap-2 border border-blue-400 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,100,255,0.8)] hover:border-blue-300 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 opacity-30"></span>
                <span className="absolute inset-0 border border-blue-400 opacity-0 group-hover:opacity-40 rounded-full scale-90 group-hover:scale-100 transition-all duration-300"></span>
                <span className="relative z-10 flex items-center gap-2"><FaFileUpload /> Select Videos</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openFolderSelector}
                className="px-6 py-3 bg-gray-900 rounded-full font-medium flex items-center gap-2 border border-purple-400 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(128,0,255,0.8)] hover:border-purple-300 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 opacity-30"></span>
                <span className="absolute inset-0 border border-purple-400 opacity-0 group-hover:opacity-40 rounded-full scale-90 group-hover:scale-100 transition-all duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">📁 Open Folder</span>
              </motion.button>
            </div>
            

            <p className="text-sm text-gray-500 mt-4 hover:text-purple-400 transition-colors duration-300 cursor-default">
              Or drag and drop video files anywhere on this page
            </p>
            <button
              className="mt-4 text-xs text-blue-400 hover:text-blue-300 underline"
              onClick={() => setShowWelcomeTutorial(true)}
            >
              Show Tutorial Again
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      {showFeatures && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-16 bg-black"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white relative inline-block">
              <span className="relative z-10">Advanced Features</span>
              <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></span>
              <span className="absolute -left-4 top-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="absolute -right-4 top-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black p-6 rounded-xl border border-gray-800 relative group overflow-hidden hover:shadow-[0_0_20px_rgba(192,192,192,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 opacity-30"></div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-700 rounded-xl transition-colors duration-300"></div>
                  <div className="absolute h-[1px] w-0 bg-gradient-to-r from-transparent via-white to-transparent bottom-0 left-0 group-hover:w-full transition-all duration-700"></div>
                  <div className="absolute h-[1px] w-0 bg-gradient-to-r from-transparent via-white to-transparent top-0 right-0 group-hover:w-full transition-all duration-700"></div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Glowing dots */}
                  <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Feature icon with glow effect */}
                  <div className="text-white mb-4 text-3xl relative z-10 group-hover:animate-pulse transition-all duration-300">
                    <div className="absolute -inset-2 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-100 relative z-10 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-400 relative z-10">{feature.description}</p>
                  
                  {/* Tech circuit line */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-[1px] -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-[80%] transition-all duration-700 delay-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Welcome Tutorial Modal */}
      {showWelcomeTutorial && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="bg-gray-900 border border-blue-500 rounded-xl p-8 max-w-2xl mx-4 text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold mb-4 text-blue-400">Welcome to vcXvp!</h2>
            <div className="text-left space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📁</span>
                <span>Drag & drop video files anywhere or click &quot;Upload Your Videos&quot;</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⌨️</span>
                <span>Use keyboard shortcuts: Space (play/pause), F (fullscreen), / (shortcuts guide)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <span>Advanced features: Video info (N), Statistics (T), Visual effects (V)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💾</span>
                <span>Your videos are saved locally in your browser - no uploads to servers!</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>Supported formats: MP4, WebM, OGG, MOV, AVI, FLV, WMV, MKV</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                onClick={() => {
                  localStorage.setItem('futuristic-player-tutorial-seen', 'true');
                  setShowWelcomeTutorial(false);
                  openFileSelector();
                }}
              >
                Get Started - Select Videos
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                onClick={() => {
                  localStorage.setItem('futuristic-player-tutorial-seen', 'true');
                  setShowWelcomeTutorial(false);
                }}
              >
                Skip Tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="text-center p-8 border-2 border-dashed border-blue-500 rounded-xl bg-gray-900 bg-opacity-90">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold mb-2 text-blue-400">Drop Video Files Here</h3>
            <p className="text-gray-300">Release to upload your videos</p>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="fixed top-4 left-4 z-50 bg-blue-900 border border-blue-700 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Uploading: {uploadProgress.fileName}</span>
            <span className="text-xs">{uploadProgress.progress}%</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error notification */}
      {videoError && (
        <div className="fixed top-4 right-4 z-50 bg-red-900 border border-red-700 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              <span className="text-sm">{videoError}</span>
            </div>
            <button
              onClick={() => setVideoError(null)}
              className="ml-4 text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Video player and playlist section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-white relative inline-block">
              <span className="relative z-10">Video Player</span>
              <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></span>
              <span className="absolute -left-4 top-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
            </h2>
            <div className="rounded-xl overflow-hidden bg-black aspect-video border border-gray-800 relative group">
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-700 rounded-xl transition-all duration-500 z-10 pointer-events-none"></div>
              <div className="absolute h-[1px] w-0 bg-gradient-to-r from-transparent via-white to-transparent bottom-0 left-0 group-hover:w-full transition-all duration-700 z-10 pointer-events-none"></div>
              <div className="absolute h-[1px] w-0 bg-gradient-to-r from-transparent via-white to-transparent top-0 right-0 group-hover:w-full transition-all duration-700 z-10 pointer-events-none"></div>
              <div className="absolute w-[1px] h-0 bg-gradient-to-b from-transparent via-white to-transparent top-0 left-0 group-hover:h-full transition-all duration-700 z-10 pointer-events-none"></div>
              <div className="absolute w-[1px] h-0 bg-gradient-to-b from-transparent via-white to-transparent bottom-0 right-0 group-hover:h-full transition-all duration-700 z-10 pointer-events-none"></div>
              {currentVideo && currentVideo.src ? (
                <VideoPlayer
                  key={currentVideo.src}
                  src={currentVideo.src}
                  poster={currentVideo.poster}
                  type={currentVideo.type || 'video/mp4'}
                  fluid={true}
                  options={{
                    onPlay: handlePlay,
                    onPause: handlePause,
                  }}
                  onError={(error) => {
                    console.error('Video player error:', error);
                    setVideoError(`Failed to load video: ${currentVideo.title}`);
                  }}
                  onLoadStart={() => {
                    setVideoError(null);
                  }}
                  onLoadedData={() => {
                    // Video loaded successfully
                  }}
                />
              ) : currentVideo ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-5xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold mb-2">{currentVideo.title}</h3>
                    <p className="text-gray-400 mb-6">Click to select this video file</p>
                    <button 
                      onClick={() => handleVideoSelect(currentVideo)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm flex items-center gap-2 mx-auto border border-blue-500"
                    >
                      📁 Select File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-5xl mb-4">📁</div>
                    <h3 className="text-xl font-semibold mb-2">No Videos Yet</h3>
                    <p className="text-gray-400 mb-6">Select your videos to start playing</p>
                    <button 
                      onClick={openFileSelector}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm flex items-center gap-2 mx-auto border border-gray-700 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(192,192,192,0.3)]"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></span>
                      <span className="absolute inset-0 border border-white opacity-0 group-hover:opacity-20 rounded-md scale-90 group-hover:scale-100 transition-all duration-300"></span>
                      <span className="relative z-10 flex items-center gap-2"><FaFileUpload /> Select Videos</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {currentVideo && (
              <div className="mt-4">
                <h3 className="text-xl font-bold text-white">{currentVideo.title}</h3>
                {currentVideo.description && (
                  <p className="text-gray-400">{currentVideo.description}</p>
                )}
                <div className="mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openFileSelector}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm flex items-center gap-2 border border-gray-700 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(192,192,192,0.3)]"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></span>
                    <span className="absolute inset-0 border border-white opacity-0 group-hover:opacity-20 rounded-md scale-90 group-hover:scale-100 transition-all duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2"><FaFileUpload /> Add More Videos</span>
                  </motion.button>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-6 text-white relative inline-block">
              <span className="relative z-10">Playlist</span>
              <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></span>
              <span className="absolute -left-4 top-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
            </h2>
            <div className="bg-black bg-opacity-80 rounded-xl p-4 border border-gray-800 relative group">
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-700 rounded-xl transition-all duration-500 z-10 pointer-events-none"></div>
              <div className="absolute h-[1px] w-0 bg-gradient-to-r from-transparent via-white to-transparent bottom-0 left-0 group-hover:w-full transition-all duration-700 z-10 pointer-events-none"></div>
              <div className="absolute h-[1px] w-0 bg-gradient-to-r from-transparent via-white to-transparent top-0 right-0 group-hover:w-full transition-all duration-700 z-10 pointer-events-none"></div>
              <div className="absolute w-[1px] h-0 bg-gradient-to-b from-transparent via-white to-transparent top-0 left-0 group-hover:h-full transition-all duration-700 z-10 pointer-events-none"></div>
              <div className="absolute w-[1px] h-0 bg-gradient-to-b from-transparent via-white to-transparent bottom-0 right-0 group-hover:h-full transition-all duration-700 z-10 pointer-events-none"></div>
              
              {/* Playlist header with clear button */}
              {playlistItems.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-400">
                    {playlistItems.length} {playlistItems.length === 1 ? 'video' : 'videos'} saved
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleSortOrder}
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs flex items-center gap-1 border border-gray-700 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(192,192,192,0.3)]"
                      title={sortOrder === 'recent' ? 'Sort by name' : 'Sort by recent'}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></span>
                      <span className="relative z-10">{sortOrder === 'recent' ? 'Recent' : 'A-Z'}</span>
                    </button>
                    <button 
                      onClick={clearPlaylist}
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs flex items-center gap-1 border border-gray-700 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(192,192,192,0.3)]"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></span>
                      <span className="relative z-10">Clear</span>
                    </button>
                  </div>
                </div>
              )}
              
              {playlistItems.length > 0 ? (
                <Playlist
                  items={sortedPlaylistItems}
                  currentVideoId={currentVideo?.id}
                  onSelectVideo={handleVideoSelect}
                  isPlaying={isPlaying}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Your playlist is empty</p>
                  <button 
                    onClick={openFileSelector}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm inline-flex items-center gap-2 border border-gray-700 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(192,192,192,0.3)]"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></span>
                    <span className="absolute inset-0 border border-white opacity-0 group-hover:opacity-20 rounded-md scale-90 group-hover:scale-100 transition-all duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2"><FaFileUpload /> Select Videos</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Storage info */}
            {playlistItems.length > 0 && (
              <div className="mt-4 p-3 bg-black bg-opacity-50 rounded-lg border border-gray-800 text-xs text-gray-400">
                <p className="mb-1">Videos are saved in your browser&apos;s local storage.</p>
                <p>Video files will be reloaded when you return to this page.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          accept="video/*"
          webkitdirectory=""
          multiple
          onChange={handleFolderChange}
          className="hidden"
        />
      </div>

      {/* Voice Commands Modal */}
      <VoiceCommandsModal
        isOpen={showVoiceCommands}
        onClose={() => setShowVoiceCommands(false)}
      />

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} vcXvp. Built with Next.js and React.
          </p>
        </div>
      </footer>
    </main>
  );
}

// Add voice control to features
const features = [
  {
    title: '🎤 Voice Control',
    description: 'Control the player with natural voice commands. Say "play", "volume up", "jump to 2 minutes" and more.',
    icon: '🎤',
  },
  {
    title: 'Local File Playback',
    description: 'Upload and play video files directly from your device with support for various formats.',
    icon: '📂',
  },
  {
    title: 'Cinematic UI',
    description: 'Immersive, futuristic interface with motion animations and holographic effects.',
    icon: '🎬',
  },
  {
    title: 'Advanced Controls',
    description: 'Custom progress bar, volume controls, playback speed settings, and more.',
    icon: '🎮',
  },
  {
    title: 'Format Support',
    description: 'Play MP4, WebM, and many other formats seamlessly.',
    icon: '🎞️',
  },
  {
    title: 'Responsive Design',
    description: 'Adapts perfectly to any device or screen size.',
    icon: '📱',
  },
  {
    title: 'Performance',
    description: 'Optimized for smooth playback and low resource usage.',
    icon: '⚡',
  },
];

'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Playlist.module.css';

export interface PlaylistItem {
  id: string;
  title: string;
  src: string;
  type?: string;
  poster?: string;
  description?: string;
  duration?: number;
  filePath?: string;
  lastAccessed?: number;
  metadata?: {
    size: number;
    sizeFormatted: string;
    lastModified: number;
    resolution?: string;
    bitrate?: string;
    frameRate?: string;
    codec?: string;
  };
}

interface PlaylistProps {
  items: PlaylistItem[];
  currentVideoId?: string;
  onSelectVideo: (video: PlaylistItem) => void;
  isPlaying?: boolean;
}

const Playlist: React.FC<PlaylistProps> = ({ items, currentVideoId, onSelectVideo, isPlaying }) => {
  return (
    <div className={styles.playlist}>
      {/* Futuristic header */}
      <div className={styles.playlistHeader}>
        <div className={styles.playlistTitle}>
          <div className={styles.titleText}>PLAYLIST</div>
          <div className={styles.titleDecoration}></div>
        </div>
        <div className={styles.playlistCount}>
          <span className={styles.countNumber}>{items.length}</span>
          <span className={styles.countLabel}>VIDEOS</span>
        </div>
      </div>
      
      {/* Scanning line effect */}
      <div className={styles.scanEffect}></div>
      
      {/* Playlist items */}
      <div className={styles.playlistItems}>
        {items.map((item) => {
          const isActive = item.id === currentVideoId;
          const isCurrentlyPlaying = isActive && isPlaying;
          
          return (
            <div 
              key={item.id}
              className={`${styles.playlistItem} ${isActive ? styles.activeItem : ''}`}
              onClick={() => onSelectVideo(item)}
            >
              {/* Tech border effect */}
              <div className={styles.itemBorder}></div>
              
              {/* Video thumbnail */}
              <div className={styles.thumbnailContainer}>
                {item.poster ? (
                  <Image
                    src={item.poster}
                    alt={item.title}
                    className={styles.thumbnail}
                    width={120}
                    height={68}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.placeholderThumbnail}>
                    <span>▶</span>
                  </div>
                )}
                
                {/* Play indicator */}
                {isCurrentlyPlaying && (
                  <div className={styles.playingIndicator}>
                    <div className={styles.playingBar}></div>
                    <div className={styles.playingBar}></div>
                    <div className={styles.playingBar}></div>
                </div>
                )}
                
                {/* Corner accents */}
                <div className={`${styles.thumbnailCorner} ${styles.topLeft}`}></div>
                <div className={`${styles.thumbnailCorner} ${styles.topRight}`}></div>
                <div className={`${styles.thumbnailCorner} ${styles.bottomLeft}`}></div>
                <div className={`${styles.thumbnailCorner} ${styles.bottomRight}`}></div>
              </div>
              
              {/* Video info */}
              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {item.title}
                  {isActive && <span className={styles.activeIndicator}></span>}
                </div>
                
                {item.duration && (
                  <div className={styles.itemDuration}>
                    {formatDuration(item.duration)}
                  </div>
                )}
                
                {/* Display file path if available */}
                {item.filePath && (
                  <div className={styles.itemFilePath} title={item.filePath}>
                    {item.filePath}
                  </div>
                )}
                
                {/* Metadata display */}
                {item.metadata && (
                  <div className={styles.itemMetadata}>
                    <span className={styles.metadataItem}>
                      📁 {item.metadata.sizeFormatted}
                    </span>
                    {item.metadata.resolution && (
                      <span className={styles.metadataItem}>
                        📺 {item.metadata.resolution}
                      </span>
                    )}
                    {item.metadata.codec && (
                      <span className={styles.metadataItem}>
                        🎬 {item.metadata.codec}
                      </span>
                    )}
                  </div>
                )}

                {/* Last accessed time if available */}
                {item.lastAccessed && (
                  <div className={styles.itemAccessTime}>
                    {new Date(item.lastAccessed).toLocaleDateString()}
                  </div>
                )}
                
                {/* Tech line decoration */}
                <div className={styles.infoDecoration}></div>
              </div>
              
              {/* Hover effect */}
              <div className={styles.hoverEffect}></div>
            </div>
          );
        })}
      </div>
      
      {/* Futuristic footer */}
      <div className={styles.playlistFooter}>
        <div className={styles.footerLine}></div>
        <div className={styles.footerDot}></div>
      </div>
    </div>
  );
};

// Helper function to format duration in MM:SS
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default Playlist; 
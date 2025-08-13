/**
 * Video utility functions for format detection, validation, and conversion suggestions
 */

// Express.js streaming integration
export const createStreamingUrl = (filename: string): string => {
  return `http://localhost:3003/stream/${filename}`;
};

export const uploadToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('video', file);
  
  const response = await fetch('http://localhost:3003/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.url;
};

export interface VideoFormatInfo {
  extension: string;
  mimeType: string;
  browserSupport: 'excellent' | 'good' | 'limited' | 'poor';
  description: string;
  recommendedCodec?: string;
}

export const VIDEO_FORMATS: Record<string, VideoFormatInfo> = {
  mp4: {
    extension: 'mp4',
    mimeType: 'video/mp4',
    browserSupport: 'excellent',
    description: 'MP4 (H.264/AVC)',
    recommendedCodec: 'H.264 + AAC'
  },
  webm: {
    extension: 'webm',
    mimeType: 'video/webm',
    browserSupport: 'good',
    description: 'WebM (VP8/VP9)',
    recommendedCodec: 'VP9 + Opus'
  },
  ogg: {
    extension: 'ogg',
    mimeType: 'video/ogg',
    browserSupport: 'good',
    description: 'OGG (Theora)',
    recommendedCodec: 'Theora + Vorbis'
  },
  mov: {
    extension: 'mov',
    mimeType: 'video/quicktime',
    browserSupport: 'limited',
    description: 'QuickTime (MOV)',
    recommendedCodec: 'H.264 + AAC'
  },
  avi: {
    extension: 'avi',
    mimeType: 'video/x-msvideo',
    browserSupport: 'poor',
    description: 'AVI (Various codecs)',
    recommendedCodec: 'Convert to MP4'
  },
  mkv: {
    extension: 'mkv',
    mimeType: 'video/x-matroska',
    browserSupport: 'limited',
    description: 'Matroska (MKV)',
    recommendedCodec: 'H.264 + AAC'
  }
};

/**
 * Check if a video format is supported by the current browser
 */
export function checkBrowserSupport(mimeType: string): {
  supported: boolean;
  level: 'probably' | 'maybe' | 'none';
  suggestions: string[];
} {
  const video = document.createElement('video');
  const canPlay = video.canPlayType(mimeType);
  
  const suggestions: string[] = [];
  
  if (canPlay === '') {
    suggestions.push('Convert to MP4 format with H.264 codec for best compatibility');
    suggestions.push('Try WebM format as an alternative');
    suggestions.push('Ensure your browser is up to date');
    
    return {
      supported: false,
      level: 'none',
      suggestions
    };
  }
  
  if (canPlay === 'maybe') {
    suggestions.push('Format is partially supported - playback may vary');
    suggestions.push('Consider converting to MP4 for guaranteed compatibility');
  }
  
  return {
    supported: true,
    level: canPlay as 'probably' | 'maybe',
    suggestions
  };
}

/**
 * Get detailed information about a video file
 */
export function getVideoFileInfo(file: File): {
  format: VideoFormatInfo | null;
  browserSupport: ReturnType<typeof checkBrowserSupport>;
  recommendations: string[];
} {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const format = VIDEO_FORMATS[extension] || null;
  const mimeType = file.type || format?.mimeType || 'video/mp4';
  
  const browserSupport = checkBrowserSupport(mimeType);
  const recommendations: string[] = [];
  
  // Add format-specific recommendations
  if (format) {
    switch (format.browserSupport) {
      case 'poor':
        recommendations.push(`${format.description} has limited browser support`);
        recommendations.push('Convert to MP4 (H.264) for best compatibility');
        break;
      case 'limited':
        recommendations.push(`${format.description} may not work in all browsers`);
        recommendations.push('MP4 format is recommended for universal compatibility');
        break;
      case 'good':
        recommendations.push(`${format.description} is well supported`);
        break;
      case 'excellent':
        recommendations.push(`${format.description} has excellent browser support`);
        break;
    }
  } else {
    recommendations.push('Unknown video format detected');
    recommendations.push('Supported formats: MP4, WebM, OGG, MOV, AVI, MKV');
  }
  
  return {
    format,
    browserSupport,
    recommendations: [...recommendations, ...browserSupport.suggestions]
  };
}

/**
 * Generate fallback video sources for better compatibility
 */
export function generateFallbackSources(originalSrc: string, originalType: string): Array<{src: string, type: string}> {
  const sources = [{ src: originalSrc, type: originalType }];
  
  // Add common fallback MIME types with codec specifications
  const fallbacks = [
    'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // H.264 Baseline + AAC
    'video/webm; codecs="vp8, vorbis"', // WebM VP8
    'video/ogg; codecs="theora, vorbis"' // OGG Theora
  ];
  
  fallbacks.forEach(fallbackType => {
    if (fallbackType !== originalType) {
      sources.push({ src: originalSrc, type: fallbackType });
    }
  });
  
  return sources;
}

/**
 * Validate video file before processing
 */
export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
  warnings: string[];
  info: ReturnType<typeof getVideoFileInfo>;
} {
  const warnings: string[] = [];
  const info = getVideoFileInfo(file);
  
  // Check file size (5GB limit)
  const maxSize = 5 * 1024 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB) exceeds the 5GB limit`,
      warnings,
      info
    };
  }
  
  // Check if it's actually a video file
  if (!info.format && !file.type.startsWith('video/')) {
    return {
      valid: false,
      error: 'File does not appear to be a video format',
      warnings,
      info
    };
  }
  
  // Add warnings for poor browser support
  if (info.format?.browserSupport === 'poor') {
    warnings.push(`${info.format.description} has poor browser support`);
  }
  
  if (!info.browserSupport.supported) {
    warnings.push('Video format may not play in your current browser');
  }
  
  return {
    valid: true,
    warnings,
    info
  };
}

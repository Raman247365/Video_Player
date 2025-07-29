/**
 * Utility functions for managing memory and cleaning up resources
 */

// Track blob URLs for cleanup
const blobUrls = new Set<string>();

/**
 * Create a blob URL and track it for cleanup
 */
export function createTrackedBlobUrl(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  blobUrls.add(url);
  return url;
}

/**
 * Revoke a specific blob URL
 */
export function revokeBlobUrl(url: string): void {
  if (blobUrls.has(url)) {
    URL.revokeObjectURL(url);
    blobUrls.delete(url);
  }
}

/**
 * Clean up all tracked blob URLs
 */
export function cleanupAllBlobUrls(): void {
  blobUrls.forEach(url => {
    URL.revokeObjectURL(url);
  });
  blobUrls.clear();
}

/**
 * Safe localStorage operations with error handling
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.code === 22) {
        console.warn('localStorage quota exceeded. Consider clearing old data.');
      }
      return false;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

/**
 * Debounce function to limit rapid function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit function calls to once per interval
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

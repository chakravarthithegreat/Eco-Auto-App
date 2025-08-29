/**
 * Audio Context Manager
 * Handles the lifecycle of the Web Audio API context
 */

class AudioContextManager {
  constructor() {
    this.audioContext = null;
    this.isSuspended = false;
  }

  /**
   * Get or create the audio context
   * @returns {AudioContext} The audio context
   */
  getAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isSuspended = false;
      } catch (e) {
        console.warn('AudioContext not supported:', e);
      }
    }
    return this.audioContext;
  }

  /**
   * Resume the audio context if it's suspended
   */
  async resumeContext() {
    if (this.audioContext && this.isSuspended) {
      try {
        await this.audioContext.resume();
        this.isSuspended = false;
      } catch (e) {
        console.warn('Failed to resume audio context:', e);
      }
    }
  }

  /**
   * Suspend the audio context to save resources
   */
  async suspendContext() {
    if (this.audioContext && !this.isSuspended) {
      try {
        await this.audioContext.suspend();
        this.isSuspended = true;
      } catch (e) {
        console.warn('Failed to suspend audio context:', e);
      }
    }
  }

  /**
   * Close the audio context to free resources
   */
  async closeContext() {
    if (this.audioContext) {
      try {
        await this.audioContext.close();
        this.audioContext = null;
        this.isSuspended = false;
      } catch (e) {
        console.warn('Failed to close audio context:', e);
      }
    }
  }

  /**
   * Check if the audio context is available
   * @returns {boolean} Whether the audio context is available
   */
  isAvailable() {
    return !!this.audioContext;
  }
}

// Export a singleton instance
export const audioContextManager = new AudioContextManager();
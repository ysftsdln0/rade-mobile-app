/**
 * Motion Design Tokens
 * Animation durations, easing curves, and spring configurations
 * Based on Material Design 3 motion principles
 */

import { Easing } from 'react-native';

export const motion = {
  // Duration values (milliseconds)
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },

  // Material Design 3 easing curves
  easing: {
    // Standard easing - most common, natural
    standard: Easing.bezier(0.4, 0.0, 0.2, 1),
    
    // Decelerate - entering elements
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
    
    // Accelerate - exiting elements
    accelerate: Easing.bezier(0.4, 0.0, 1, 1),
    
    // Sharp - quick, decisive transitions
    sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
    
    // Emphasized - pronounced, expressive
    emphasized: Easing.bezier(0.2, 0.0, 0.0, 1),
  },

  // Spring animation configurations
  spring: {
    // Gentle spring - smooth, soft
    gentle: {
      damping: 20,
      mass: 0.8,
      stiffness: 100,
    },
    
    // Bouncy spring - playful, energetic
    bouncy: {
      damping: 8,
      mass: 0.5,
      stiffness: 200,
    },
    
    // Snappy spring - quick, responsive
    snappy: {
      damping: 15,
      mass: 0.4,
      stiffness: 300,
    },
    
    // Wobbly spring - elastic, attention-grabbing
    wobbly: {
      damping: 6,
      mass: 0.6,
      stiffness: 180,
    },
  },

  // Gesture thresholds
  gesture: {
    swipeThreshold: 50,       // Minimum distance for swipe
    longPressDelay: 500,      // Time for long press (ms)
    doubleTapDelay: 300,      // Max time between taps (ms)
    velocityThreshold: 0.5,   // Minimum velocity for fling
  },

  // Haptic feedback intensities
  haptic: {
    light: 'light' as const,
    medium: 'medium' as const,
    heavy: 'heavy' as const,
  },
} as const;

// Animation presets for common UI patterns
export const animationPresets = {
  // Button press
  buttonPress: {
    scale: 0.95,
    duration: motion.duration.fast,
    easing: motion.easing.standard,
  },
  
  // Card press
  cardPress: {
    scale: 0.98,
    duration: motion.duration.fast,
    easing: motion.easing.standard,
  },
  
  // Modal present
  modalPresent: {
    duration: motion.duration.normal,
    easing: motion.easing.decelerate,
  },
  
  // Modal dismiss
  modalDismiss: {
    duration: motion.duration.normal,
    easing: motion.easing.accelerate,
  },
  
  // List item entry
  listItemEntry: {
    delay: 50, // Per item
    duration: motion.duration.normal,
    easing: motion.easing.decelerate,
  },
  
  // Toast notification
  toast: {
    duration: motion.duration.normal,
    easing: motion.easing.emphasized,
  },
  
  // Counter animation
  counter: {
    duration: motion.duration.slower,
    easing: motion.easing.decelerate,
  },
  
  // Progress bar
  progress: {
    duration: motion.duration.slow,
    easing: motion.easing.standard,
  },
} as const;

export default motion;

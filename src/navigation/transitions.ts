import {
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { Easing } from "react-native";

/**
 * Custom screen transition animations for React Navigation
 *
 * Usage in navigator:
 * ```tsx
 * <Stack.Screen
 *   name="Details"
 *   component={DetailsScreen}
 *   options={screenTransitions.slideFromRight}
 * />
 * ```
 */

/**
 * Slide from bottom transition (iOS style)
 */
export const slideFromBottom: StackNavigationOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true,
  cardOverlayEnabled: true,
};

/**
 * Slide from right transition (default Android style with custom timing)
 */
export const slideFromRight: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Material emphasized
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1), // Material emphasized accelerate
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
      }),
    },
  }),
};

/**
 * Fade transition (subtle)
 */
export const fade: StackNavigationOptions = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 250,
        easing: Easing.inOut(Easing.ease),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      },
    },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  }),
};

/**
 * Scale from center (zoom effect)
 */
export const scaleFromCenter: StackNavigationOptions = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  }),
};

/**
 * Flip (3D rotation effect)
 */
export const flip: StackNavigationOptions = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 350,
        easing: Easing.inOut(Easing.ease),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      backfaceVisibility: "hidden",
      transform: [
        { perspective: 1000 },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["90deg", "0deg"],
          }),
        },
      ],
    },
  }),
};

/**
 * Slide and fade (combined effect)
 */
export const slideAndFade: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  transitionSpec: {
    open: {
      animation: "spring",
      config: {
        stiffness: 250,
        damping: 25,
        mass: 0.5,
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width * 0.3, 0],
          }),
        },
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    },
  }),
};

/**
 * Default export with all transitions
 */
export const screenTransitions = {
  slideFromBottom,
  slideFromRight,
  fade,
  scaleFromCenter,
  flip,
  slideAndFade,
};

export default screenTransitions;

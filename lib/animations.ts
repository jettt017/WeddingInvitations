import { Variants } from "framer-motion";

// Premium cinematic easing curves
export const EASE_GOLDEN = [0.16, 1, 0.3, 1] as const; // Custom cubic-bezier for high-end luxury motions
export const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

export const fadeIn = (direction: "up" | "down" | "left" | "right" | "none" = "none", duration = 1.2, delay = 0): Variants => {
  const getTransform = () => {
    switch (direction) {
      case "up":
        return { y: 40, x: 0 };
      case "down":
        return { y: -40, x: 0 };
      case "left":
        return { x: 40, y: 0 };
      case "right":
        return { x: -40, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  return {
    hidden: {
      opacity: 0,
      ...getTransform(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: EASE_GOLDEN,
      },
    },
  };
};

export const staggerContainer = (staggerChildren = 0.15, delayChildren = 0): Variants => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const scaleUp = (duration = 1.4, delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: EASE_GOLDEN,
      },
    },
  };
};

export const letterSpread = (duration = 1.8, delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      letterSpacing: "0.05em",
    },
    visible: {
      opacity: 1,
      letterSpacing: "0.25em",
      transition: {
        duration,
        delay,
        ease: EASE_GOLDEN,
      },
    },
  };
};

export const elegantLine = (duration = 1.5, delay = 0): Variants => {
  return {
    hidden: {
      width: 0,
    },
    visible: {
      width: "100%",
      transition: {
        duration,
        delay,
        ease: EASE_GOLDEN,
      },
    },
  };
};

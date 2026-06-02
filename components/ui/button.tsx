"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

type CombinedProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">> &
  HTMLMotionProps<"button">;

export interface ButtonProps extends CombinedProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden font-sans text-xs font-semibold tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            // Primary - Solid Emerald with Gold accents
            "bg-brand-emerald text-brand-cream hover:bg-brand-emerald-dark border border-brand-emerald":
              variant === "primary",
            // Secondary - Solid Cream/Gold
            "bg-brand-gold text-brand-emerald hover:bg-brand-gold-dark border border-brand-gold":
              variant === "secondary",
            // Outline - Transparent with Gold Border & Golden Hover background slide
            "bg-transparent text-brand-gold hover:text-brand-cream border border-brand-gold/50 hover:border-brand-gold hover:bg-brand-gold":
              variant === "outline",
            // Ghost - Simple text link with elegant letter spacing expand or color change
            "bg-transparent text-brand-charcoal hover:text-brand-gold hover:bg-transparent px-0 py-0":
              variant === "ghost",
          },
          {
            "px-6 py-2.5 text-[10px]": size === "sm",
            "px-8 py-3.5": size === "md",
            "px-10 py-4.5 text-[13px]": size === "lg",
          },
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;

"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="font-sans text-[10px] uppercase tracking-widest text-brand-clay font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-transparent border-b border-brand-gold/30 py-2.5 text-sm font-sans text-brand-charcoal placeholder-brand-clay/50 focus:border-brand-gold focus:outline-none transition-all duration-300",
            {
              "border-red-500 focus:border-red-500": error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="font-sans text-[10px] text-red-500 mt-1">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="font-sans text-[10px] uppercase tracking-widest text-brand-clay font-medium">
            {label}
          </label>
        )}
        <textarea
          rows={rows}
          className={cn(
            "w-full bg-transparent border-b border-brand-gold/30 py-2.5 text-sm font-sans text-brand-charcoal placeholder-brand-clay/50 focus:border-brand-gold focus:outline-none transition-all duration-300 resize-none",
            {
              "border-red-500 focus:border-red-500": error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="font-sans text-[10px] text-red-500 mt-1">{error}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export default Input;

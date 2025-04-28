"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all duration-300 ease-in-out"
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
        backgroundSize: "200% 100%",
        animation: "gradient-shift 2s ease infinite"
      }}
    >
      {/* Add shine effect */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="h-full w-1/4 bg-white/20 -skew-x-[45deg] transform opacity-30"
          style={{
            animation: "shimmer 2s infinite linear"
          }}
        />
      </div>
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

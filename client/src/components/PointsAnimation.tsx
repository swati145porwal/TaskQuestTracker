import { useTaskContext } from "@/context/TaskContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function PointsAnimation() {
  const { showPointsAnimation, pointsAnimationValue, pointsAnimationPosition } = useTaskContext();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (showPointsAnimation) {
      setShowConfetti(true);
      
      // Hide confetti after animation completes
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [showPointsAnimation]);
  
  // Generate random sizes for particle effects
  const particleSizes = Array.from({ length: 60 }).map(() => Math.random() * 5 + 2);
  
  return (
    <>
      <AnimatePresence>
        {showPointsAnimation && (
          <motion.div
            className="fixed z-50 flex items-center gap-1"
            style={{
              left: `${pointsAnimationPosition.x - 80}px`,
              top: `${pointsAnimationPosition.y}px`
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1, y: -30 }}
            exit={{ scale: 1, opacity: 0, y: -70 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full px-4 py-1.5 shadow-lg flex items-center text-lg"
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{ duration: 0.2, repeat: 5, repeatType: "reverse" }}
            >
              <Sparkles className="h-4 w-4 mr-1 text-yellow-200" />
              +{pointsAnimationValue}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none z-40">
          {/* Confetti particles */}
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = [
              'hsl(var(--primary))', 
              'hsl(var(--secondary))',
              'hsl(var(--accent))',
              'hsl(var(--success))',
              'hsl(var(--warning))'
            ];
            
            const shapes = ['circle', 'square', 'triangle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 8 + 5;
            
            return (
              <motion.div
                key={`confetti-${i}`}
                className={`absolute ${shape === 'circle' ? 'rounded-full' : shape === 'square' ? '' : ''}`}
                style={{
                  left: `${pointsAnimationPosition.x - 50 + Math.random() * 100}px`,
                  top: `${pointsAnimationPosition.y}px`,
                  width: `${size}px`,
                  height: shape === 'triangle' ? `${size * 0.866}px` : `${size}px`,
                  backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                  clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
                  boxShadow: '0 0 2px rgba(0,0,0,0.1)',
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  opacity: 0, 
                  y: `${Math.random() * 100 + 100}px`,
                  x: `${(Math.random() - 0.5) * 200}px`,
                  rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)
                }}
                transition={{ 
                  duration: Math.random() * 1.5 + 1,
                  ease: "easeOut"
                }}
              />
            );
          })}
          
          {/* Glitter particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${pointsAnimationPosition.x - 50 + Math.random() * 100}px`,
                top: `${pointsAnimationPosition.y}px`,
                width: `${particleSizes[i]}px`,
                height: `${particleSizes[i]}px`,
                boxShadow: '0 0 4px white'
              }}
              initial={{ opacity: 1, scale: 0 }}
              animate={{ 
                opacity: 0, 
                scale: Math.random() * 2 + 1,
                y: `${(Math.random() - 0.5) * 100}px`,
                x: `${(Math.random() - 0.5) * 100}px`
              }}
              transition={{ 
                duration: Math.random() * 0.8 + 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

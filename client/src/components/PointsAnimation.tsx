import { useTaskContext } from "@/context/TaskContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PointsAnimation() {
  const { showPointsAnimation, pointsAnimationValue, pointsAnimationPosition } = useTaskContext();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (showPointsAnimation) {
      setShowConfetti(true);
      
      // Hide confetti after animation completes
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showPointsAnimation]);
  
  return (
    <>
      <AnimatePresence>
        {showPointsAnimation && (
          <motion.div
            className="fixed z-50 bg-primary-500 text-white font-bold rounded-full px-3 py-1 shadow-lg"
            style={{
              left: `${pointsAnimationPosition.x - 70}px`,
              top: `${pointsAnimationPosition.y + 20}px`
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1, y: -20 }}
            exit={{ scale: 1, opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            +{pointsAnimationValue}
          </motion.div>
        )}
      </AnimatePresence>
      
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: [
                  '#6366F1', // primary-500
                  '#EC4899', // secondary-500
                  '#8B5CF6', // accent-500
                  '#10B981', // success-500
                  '#F59E0B', // warning-500
                ][Math.floor(Math.random() * 5)]
              }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ 
                opacity: 0, 
                y: `${Math.random() * 100 + 50}%`,
                x: `${(Math.random() - 0.5) * 200}px`
              }}
              transition={{ 
                duration: Math.random() * 1 + 1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

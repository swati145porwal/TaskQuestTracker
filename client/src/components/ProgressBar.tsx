interface ProgressBarProps {
  progress: number;
  max?: number;
}

export default function ProgressBar({ progress, max = 100 }: ProgressBarProps) {
  const percentage = Math.min(Math.round((progress / max) * 100), 100);
  
  return (
    <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
      {/* Animated dots for a more interactive feel */}
      <div className="absolute inset-0 flex justify-between px-1 opacity-30">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-0.5 w-0.5 bg-gray-400 rounded-full self-center"></div>
        ))}
      </div>
      
      <div 
        className="progress-fill h-full rounded-full transition-all duration-500 ease-in-out" 
        style={{ width: `${percentage}%` }}
      >
        {/* Add a shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="h-full w-1/4 bg-white/20 transform -skew-x-45 transition-all animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  max?: number;
}

export default function ProgressBar({ progress, max = 100 }: ProgressBarProps) {
  const percentage = Math.min(Math.round((progress / max) * 100), 100);
  
  return (
    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="progress-fill h-full bg-primary-500 rounded-full transition-all duration-500 ease-in-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

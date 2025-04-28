interface PointsDisplayProps {
  points: number;
}

export default function PointsDisplay({ points }: PointsDisplayProps) {
  return (
    <div className="points-badge flex items-center px-3 py-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-1.5 rounded-full mr-2 flex items-center justify-center shadow-md">
        <i className="ri-coin-line text-sm"></i>
      </div>
      <span className="font-bold text-gradient text-lg">{points}</span>
      <span className="text-primary ml-1 text-sm">points</span>
    </div>
  );
}

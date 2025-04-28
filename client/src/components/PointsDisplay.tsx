interface PointsDisplayProps {
  points: number;
}

export default function PointsDisplay({ points }: PointsDisplayProps) {
  return (
    <div className="flex items-center bg-primary-50 px-3 py-1.5 rounded-full">
      <div className="bg-primary-500 text-white p-1 rounded-full mr-2 flex items-center justify-center">
        <i className="ri-coin-line text-sm"></i>
      </div>
      <span className="font-medium text-primary-700 font-outfit">{points}</span>
      <span className="text-primary-500 ml-1 text-sm font-outfit">points</span>
    </div>
  );
}

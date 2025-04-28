import { useTaskContext } from "@/context/TaskContext";
import PointsDisplay from "./PointsDisplay";

export default function Header() {
  const { user } = useTaskContext();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <i className="ri-game-fill text-primary-500 text-2xl mr-2"></i>
          <h1 className="text-xl font-bold font-outfit text-gray-800">TaskQuest</h1>
        </div>
        
        {user && <PointsDisplay points={user.points} />}
        
        <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
          <i className="ri-user-line text-gray-600"></i>
        </div>
      </div>
    </header>
  );
}

import { useTaskContext } from "@/context/TaskContext";
import PointsDisplay from "./PointsDisplay";

export default function Header() {
  const { user } = useTaskContext();
  
  return (
    <header className="glass-effect sticky top-0 z-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg shadow-lg mr-3">
            <i className="ri-gamepad-line text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold font-outfit text-gradient">TaskQuest</h1>
        </div>
        
        {user && <PointsDisplay points={user.points} />}
        
        <div className="relative">
          <div className="rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 w-10 h-10 flex items-center justify-center shadow-md border border-white/50">
            <i className="ri-user-line text-primary"></i>
          </div>
          {user && user.streak && user.streak > 0 && (
            <div className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {user.streak}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

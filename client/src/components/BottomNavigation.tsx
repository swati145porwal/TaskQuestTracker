import { Link, useLocation } from "wouter";
import { useTaskContext } from "@/context/TaskContext";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { setActiveTab } = useTaskContext();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 md:hidden">
      <Link href="/">
        <a 
          className={`flex flex-col items-center p-2 ${location === "/" ? "text-primary-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("tasks")}
        >
          <i className="ri-list-check text-xl"></i>
          <span className="text-xs mt-1">Tasks</span>
        </a>
      </Link>
      
      <Link href="/rewards">
        <a 
          className={`flex flex-col items-center p-2 ${location === "/rewards" ? "text-primary-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("rewards")}
        >
          <i className="ri-gift-line text-xl"></i>
          <span className="text-xs mt-1">Rewards</span>
        </a>
      </Link>
      
      <Link href="/stats">
        <a 
          className={`flex flex-col items-center p-2 ${location === "/stats" ? "text-primary-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("stats")}
        >
          <i className="ri-bar-chart-line text-xl"></i>
          <span className="text-xs mt-1">Stats</span>
        </a>
      </Link>
      
      <Link href="/history">
        <a 
          className={`flex flex-col items-center p-2 ${location === "/history" ? "text-primary-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("history")}
        >
          <i className="ri-history-line text-xl"></i>
          <span className="text-xs mt-1">History</span>
        </a>
      </Link>
    </nav>
  );
}

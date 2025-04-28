import { Link, useLocation } from "wouter";
import { useTaskContext } from "@/context/TaskContext";
import { BarChart3, Gift, History, ListTodo, Calendar } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { setActiveTab } = useTaskContext();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 glass-effect shadow-lg rounded-full flex justify-around py-1 px-1 md:hidden z-10 max-w-sm mx-auto">
      <Link href="/">
        <div 
          className={`flex flex-col items-center p-2 mx-1 rounded-full ${
            isActive("/") 
              ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white" 
              : "text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
          } transition-all cursor-pointer`}
          onClick={() => setActiveTab("tasks")}
        >
          <ListTodo className={`h-5 w-5 ${isActive("/") ? "stroke-[2.5]" : ""}`} />
          <span className="text-xs mt-0.5 font-medium">Tasks</span>
        </div>
      </Link>
      
      <Link href="/calendar">
        <div 
          className={`flex flex-col items-center p-2 mx-1 rounded-full ${
            isActive("/calendar") 
              ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white" 
              : "text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
          } transition-all cursor-pointer`}
        >
          <Calendar className={`h-5 w-5 ${isActive("/calendar") ? "stroke-[2.5]" : ""}`} />
          <span className="text-xs mt-0.5 font-medium">Calendar</span>
        </div>
      </Link>
      
      <Link href="/rewards">
        <div 
          className={`flex flex-col items-center p-2 mx-1 rounded-full ${
            isActive("/rewards") 
              ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white" 
              : "text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
          } transition-all cursor-pointer`}
          onClick={() => setActiveTab("rewards")}
        >
          <Gift className={`h-5 w-5 ${isActive("/rewards") ? "stroke-[2.5]" : ""}`} />
          <span className="text-xs mt-0.5 font-medium">Rewards</span>
        </div>
      </Link>
      
      <Link href="/stats">
        <div 
          className={`flex flex-col items-center p-2 mx-1 rounded-full ${
            isActive("/stats") 
              ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white" 
              : "text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
          } transition-all cursor-pointer`}
          onClick={() => setActiveTab("stats")}
        >
          <BarChart3 className={`h-5 w-5 ${isActive("/stats") ? "stroke-[2.5]" : ""}`} />
          <span className="text-xs mt-0.5 font-medium">Stats</span>
        </div>
      </Link>
      
      <Link href="/history">
        <div 
          className={`flex flex-col items-center p-2 mx-1 rounded-full ${
            isActive("/history") 
              ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white" 
              : "text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
          } transition-all cursor-pointer`}
          onClick={() => setActiveTab("history")}
        >
          <History className={`h-5 w-5 ${isActive("/history") ? "stroke-[2.5]" : ""}`} />
          <span className="text-xs mt-0.5 font-medium">History</span>
        </div>
      </Link>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { formatRelativeTime } from "@/lib/utils";
import TaskProofManager from "@/components/TaskProofManager";
import { CheckCircle, Coins } from "lucide-react";

interface CompletedTaskWithDetails {
  id: number;
  userId: number;
  taskId: number;
  completedAt: string;
  pointsEarned: number;
  task?: {
    id: number;
    title: string;
    time?: string;
  };
}

export default function HistoryPage() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTaskWithDetails[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("week");
  
  useEffect(() => {
    // Fetch history data
    async function fetchHistory() {
      try {
        const response = await fetch("/api/completed-tasks");
        if (response.ok) {
          const data = await response.json();
          setCompletedTasks(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }
    
    fetchHistory();
  }, []);
  
  // Group completed tasks by date
  const groupedTasks: Record<string, CompletedTaskWithDetails[]> = {};
  
  completedTasks.forEach(task => {
    const date = new Date(task.completedAt);
    const dateKey = date.toDateString();
    
    if (!groupedTasks[dateKey]) {
      groupedTasks[dateKey] = [];
    }
    
    groupedTasks[dateKey].push(task);
  });
  
  // Get relative date heading (Today, Yesterday, etc.)
  const getRelativeDateHeading = (dateKey: string) => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (dateKey === today) {
      return "Today";
    } else if (dateKey === yesterdayString) {
      return "Yesterday";
    } else {
      return new Date(dateKey).toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };
  
  return (
    <div className="animate-fadeIn">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <Link href="/">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            Tasks
          </a>
        </Link>
        <Link href="/rewards">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            Rewards
          </a>
        </Link>
        <Link href="/stats">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            Stats
          </a>
        </Link>
        <Link href="/history">
          <a className="text-primary-500 border-b-2 border-primary-500 px-4 py-2 font-medium text-sm font-outfit">
            History
          </a>
        </Link>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 font-outfit">Task History</h2>
        <div className="bg-white rounded-md border border-gray-200 flex">
          <button 
            className={`px-3 py-1 text-sm font-medium ${view === "day" ? "text-white bg-primary-500" : "text-gray-800"}`}
            onClick={() => setView("day")}
          >
            Day
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium ${view === "week" ? "text-white bg-primary-500" : "text-gray-800"}`}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium ${view === "month" ? "text-white bg-primary-500" : "text-gray-800"}`}
            onClick={() => setView("month")}
          >
            Month
          </button>
        </div>
      </div>
      
      {/* Day headings */}
      {Object.keys(groupedTasks).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([dateKey, tasks]) => (
            <div key={dateKey}>
              <h3 className="text-md font-medium text-gray-700 mb-3">{getRelativeDateHeading(dateKey)}</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {tasks.map(task => (
                  <div key={task.id} className="p-4 flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-success-100 text-success-600 rounded-md">
                      <i className="ri-check-line"></i>
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="text-gray-800 font-medium">{task.task?.title}</h4>
                      <span className="text-gray-500 text-sm">
                        {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                      <i className="ri-coin-line text-gray-600 mr-1"></i>
                      <span className="text-gray-700 text-sm">{task.pointsEarned} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <div className="text-gray-400 mb-2">
            <i className="ri-history-line text-3xl"></i>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">No history yet</h3>
          <p className="text-gray-500 text-sm">Complete tasks to see your history</p>
        </div>
      )}
    </div>
  );
}

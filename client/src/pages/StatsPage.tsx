import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTaskContext } from "@/context/TaskContext";

interface WeeklyStat {
  day: string;
  count: number;
}

interface TopTask {
  task?: {
    id: number;
    title: string;
  };
  count: number;
}

export default function StatsPage() {
  const { user } = useTaskContext();
  const [stats, setStats] = useState({
    totalPoints: 0,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTasksCompleted: 0
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [topTasks, setTopTasks] = useState<TopTask[]>([]);
  
  useEffect(() => {
    // Fetch stats data
    async function fetchStats() {
      try {
        const statsResponse = await fetch("/api/stats");
        const weeklyResponse = await fetch("/api/stats/weekly");
        const topTasksResponse = await fetch("/api/stats/top-tasks");
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyStats(weeklyData);
        }
        
        if (topTasksResponse.ok) {
          const topTasksData = await topTasksResponse.json();
          setTopTasks(topTasksData);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    
    fetchStats();
  }, []);
  
  // Icon mappings for top tasks
  const taskIcons = [
    { icon: "ri-heart-pulse-line", color: "bg-primary-100 text-primary-600" },
    { icon: "ri-mental-health-line", color: "bg-accent-100 text-accent-600" },
    { icon: "ri-book-read-line", color: "bg-warning-100 text-warning-600" }
  ];
  
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
          <a className="text-primary-500 border-b-2 border-primary-500 px-4 py-2 font-medium text-sm font-outfit">
            Stats
          </a>
        </Link>
        <Link href="/history">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            History
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Total Points</h3>
            <i className="ri-coin-line text-primary-400"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800 font-outfit">{stats.totalPoints}</p>
          <p className="text-green-500 text-sm flex items-center mt-2">
            <i className="ri-arrow-up-line mr-1"></i>
            <span>25% increase this week</span>
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Completion Rate</h3>
            <i className="ri-percent-line text-accent-500"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800 font-outfit">{stats.completionRate}%</p>
          <p className="text-green-500 text-sm flex items-center mt-2">
            <i className="ri-arrow-up-line mr-1"></i>
            <span>5% increase this week</span>
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Current Streak</h3>
            <i className="ri-fire-line text-warning-500"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800 font-outfit">{stats.currentStreak} days</p>
          <p className="text-gray-500 text-sm flex items-center mt-2">
            <span>Longest: {stats.longestStreak} days</span>
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-gray-800 font-semibold mb-4">Weekly Task Completion</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStats}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} tasks`, 'Completed']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-semibold mb-4">Top Completed Tasks</h3>
        <div className="space-y-3">
          {topTasks.length > 0 ? (
            topTasks.map((item, index) => (
              <div key={item.task?.id || index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center ${taskIcons[index]?.color || "bg-gray-100 text-gray-600"} rounded-md`}>
                    <i className={taskIcons[index]?.icon || "ri-checkbox-circle-line"}></i>
                  </div>
                  <span className="ml-3 text-gray-700">{item.task?.title || "Unknown task"}</span>
                </div>
                <span className="text-gray-500 text-sm">{item.count} times</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Complete more tasks to see statistics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

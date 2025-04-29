import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { useTaskContext } from "@/context/TaskContext";
import { Award, Calendar, ChevronUp, Flame, Sparkle, Star, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  totalPoints: number;
}

interface CompletedTaskInfo {
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
  const [activeChart, setActiveChart] = useState<'daily' | 'weekly'>('weekly');
  const [dailyTaskData, setDailyTaskData] = useState<{ hour: string; tasks: number }[]>([
    { hour: '6AM', tasks: 0 },
    { hour: '9AM', tasks: 0 },
    { hour: '12PM', tasks: 0 },
    { hour: '3PM', tasks: 0 },
    { hour: '6PM', tasks: 0 },
    { hour: '9PM', tasks: 0 },
  ]);
  
  useEffect(() => {
    // Fetch stats data
    async function fetchStats() {
      try {
        const statsResponse = await fetch("/api/stats");
        const weeklyResponse = await fetch("/api/stats/weekly");
        const topTasksResponse = await fetch("/api/stats/top-tasks");
        const completedTasksResponse = await fetch("/api/completed-tasks");
        
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
        
        if (completedTasksResponse.ok) {
          const completedTasks: CompletedTaskInfo[] = await completedTasksResponse.json();
          
          // Process completed tasks to calculate productivity by time of day
          if (completedTasks.length > 0) {
            // Initialize counters
            let morning = 0, afternoon = 0, evening = 0, night = 0, total = 0;
            
            // Initialize daily task data hours
            const hourCounts: Record<number, number> = {};
            
            completedTasks.forEach((task: CompletedTaskInfo) => {
              // Extract hour from completedAt timestamp
              const completedAt = new Date(task.completedAt);
              const hour = completedAt.getHours();
              
              total++;
              
              // Count tasks by hour for daily chart
              hourCounts[hour] = (hourCounts[hour] || 0) + 1;
              
              // Categorize by time of day for pie chart
              if (hour >= 5 && hour < 12) {
                morning++;
              } else if (hour >= 12 && hour < 17) {
                afternoon++;
              } else if (hour >= 17 && hour < 22) {
                evening++;
              } else {
                night++;
              }
            });
            
            // Update daily task data
            setDailyTaskData([
              { hour: '6AM', tasks: hourCounts[6] || 0 },
              { hour: '9AM', tasks: hourCounts[9] || 0 },
              { hour: '12PM', tasks: hourCounts[12] || 0 },
              { hour: '3PM', tasks: hourCounts[15] || 0 },
              { hour: '6PM', tasks: hourCounts[18] || 0 },
              { hour: '9PM', tasks: hourCounts[21] || 0 },
            ]);
            
            // Calculate percentages for pie chart
            setProductivityByTimeOfDay([
              { name: 'Morning', value: total ? Math.round((morning / total) * 100) : 25 },
              { name: 'Afternoon', value: total ? Math.round((afternoon / total) * 100) : 25 },
              { name: 'Evening', value: total ? Math.round((evening / total) * 100) : 25 },
              { name: 'Night', value: total ? Math.round((night / total) * 100) : 25 }
            ]);
            
            // Update streak data based on the last 7 days
            const today = new Date();
            const streakUpdates = [...streakData];
            
            for (let i = 0; i < 7; i++) {
              const date = new Date(today);
              date.setDate(date.getDate() - i);
              const dayIndex = date.getDay();
              
              // Check if any tasks were completed on this day
              const hasCompletedTasks = completedTasks.some((task: CompletedTaskInfo) => {
                const taskDate = new Date(task.completedAt);
                return taskDate.getDate() === date.getDate() && 
                       taskDate.getMonth() === date.getMonth() && 
                       taskDate.getFullYear() === date.getFullYear();
              });
              
              if (hasCompletedTasks) {
                streakUpdates[dayIndex].completed = true;
              }
            }
            
            setStreakData(streakUpdates);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    
    fetchStats();
  }, []);

  // Calculate productivity distribution from completed tasks
  const [productivityByTimeOfDay, setProductivityByTimeOfDay] = useState([
    { name: 'Morning', value: 0 },
    { name: 'Afternoon', value: 0 },
    { name: 'Evening', value: 0 },
    { name: 'Night', value: 0 }
  ]);
  
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--warning))'];
  
  // Prepare data for streak visualization
  const [streakData, setStreakData] = useState(
    Array.from({ length: 7 }).map((_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      completed: false
    }))
  );
  
  return (
    <div className="animate-fadeIn pb-10">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <Link href="/">
          <div className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            Tasks
          </div>
        </Link>
        <Link href="/rewards">
          <div className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            Rewards
          </div>
        </Link>
        <Link href="/stats">
          <div className="text-primary border-b-2 border-primary px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            Stats
          </div>
        </Link>
        <Link href="/history">
          <div className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            History
          </div>
        </Link>
      </div>
      
      {/* User Stats Overview */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gradient">{user?.username?.charAt(0) || 'D'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-grow">
              <h2 className="text-2xl font-bold font-outfit mb-1">{user?.username || 'Demo User'}</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Points</div>
                    <div className="font-bold text-gradient">{stats.totalPoints}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-success/10">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Completion Rate</div>
                    <div className="font-bold">{stats.completionRate}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-accent/10">
                    <Flame className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Streak</div>
                    <div className="font-bold">{stats.currentStreak} days</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-warning/10">
                    <Award className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Completed</div>
                    <div className="font-bold">{stats.totalTasksCompleted} tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Streak calendar */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Streak Calendar</h3>
            <div className="flex gap-1.5 mb-2">
              {streakData.map((day, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className={`
                    w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center
                    ${day.completed 
                      ? 'bg-gradient-to-br from-primary to-primary/70 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {i === stats.currentStreak % 7 && day.completed ? (
                      <Sparkle className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-medium">{day.day}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Current streak: {stats.currentStreak} days</span>
                <span>Longest streak: {stats.longestStreak} days</span>
              </div>
              <Progress 
                value={(stats.currentStreak / (stats.longestStreak || 1)) * 100} 
                className="h-2 bg-gray-100" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Task Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-bold text-lg font-outfit">Task Completion</h3>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
              <button 
                className={`px-3 py-1 ${activeChart === 'daily' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                onClick={() => setActiveChart('daily')}
              >
                Daily
              </button>
              <button 
                className={`px-3 py-1 ${activeChart === 'weekly' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                onClick={() => setActiveChart('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'weekly' ? (
                <BarChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} tasks`, 'Completed']}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #F3F4F6' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              ) : (
                <AreaChart 
                  data={dailyTaskData} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} tasks`, 'Completed']}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #F3F4F6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#areaGradient)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Productivity by Time */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-bold text-lg font-outfit mb-4">Task Productivity</h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productivityByTimeOfDay}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {productivityByTimeOfDay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconSize={10}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Productivity']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Tasks */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
        <h3 className="text-gray-800 font-bold text-lg font-outfit mb-4">Top Completed Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topTasks.length > 0 ? (
            topTasks.map((item, index) => (
              <div 
                key={item.task?.id || index} 
                className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg
                    bg-gradient-to-br ${
                      index === 0 ? 'from-primary to-secondary' : 
                      index === 1 ? 'from-blue-400 to-blue-500' : 
                      index === 2 ? 'from-indigo-400 to-indigo-500' : 
                      'from-gray-400 to-gray-500'
                    } text-white shadow-sm`}
                  >
                    {index === 0 && <Award className="h-5 w-5" />}
                    {index === 1 && <Award className="h-5 w-5" />}
                    {index === 2 && <Award className="h-5 w-5" />}
                    {index > 2 && <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  <div className="ml-3">
                    <div className="text-gray-800 font-medium">{item.task?.title || "Unknown task"}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Completed {item.count} times</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-md py-1 px-2 text-primary text-sm">
                  +{item.totalPoints} pts
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 md:col-span-2">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-gray-700 font-medium mb-1">No completed tasks yet</h4>
              <p className="text-gray-500 text-sm">Complete tasks to see your statistics here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

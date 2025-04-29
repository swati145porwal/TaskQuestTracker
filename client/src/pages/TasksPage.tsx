import { Link } from "wouter";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/TaskCard";
import ProgressBar from "@/components/ProgressBar";
import AddTaskModal from "@/components/AddTaskModal";
import { calculateProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Flame, ListChecks, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TasksPage() {
  const { tasks, user, openAddTaskModal } = useTaskContext();
  
  const completedTasks = tasks.filter(task => task.isCompleted);
  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  const completedTasksCount = completedTasks.length;
  const totalTasksCount = tasks.length;
  const progressPercentage = calculateProgress(completedTasksCount, totalTasksCount);
  
  return (
    <div className="animate-fadeIn">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <Link href="/">
          <div className="text-primary border-b-2 border-primary px-4 py-2 font-semibold text-sm font-outfit cursor-pointer">
            Tasks
          </div>
        </Link>
        <Link href="/rewards">
          <div className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            Rewards
          </div>
        </Link>
        <Link href="/stats">
          <div className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            Stats
          </div>
        </Link>
        <Link href="/history">
          <div className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit cursor-pointer">
            History
          </div>
        </Link>
      </div>
      
      {/* User Profile Section */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/stats">
              <div className="relative cursor-pointer transform hover:scale-105 transition-all floating">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5 shadow-md shadow-primary/30">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-gradient">{user?.username?.charAt(0) || 'D'}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-gradient-to-r from-accent to-accent/80 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm dot-pulse">
                  {user?.streak || 0}
                </div>
              </div>
            </Link>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-bold font-outfit">{user?.username || 'Demo User'}</h2>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <Flame className="h-3 w-3 mr-1 text-accent" />
                    <span>{user?.streak || 0} day streak</span>
                  </div>
                </div>
                <Link href="/rewards">
                  <div className="flex flex-col items-end cursor-pointer group hover-card">
                    <div className="text-xs text-gray-500 flex items-center">
                      Total Points 
                      <span className="ml-1 bg-accent/10 text-accent text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        Redeem
                      </span>
                    </div>
                    <div className="text-xl font-bold text-gradient flex items-center">
                      {user?.points || 0}
                      <span className="ml-2 text-xs font-normal bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                        {user?.points && user.points > 500 ? "You can redeem rewards!" : "Keep going!"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <div className="text-gray-500">Today's Progress</div>
                  <div className="font-medium">
                    <span className="text-primary">{completedTasksCount}</span>
                    <span className="text-gray-400">/{totalTasksCount}</span>
                  </div>
                </div>
                <ProgressBar progress={progressPercentage} max={100} />
              </div>
            </div>
          </div>
          
          {/* Streak Motivation - Duolingo Style */}
          {user?.streak && user.streak > 0 ? (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-warning/10 to-accent/10 p-3 rounded-xl mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-warning to-accent flex items-center justify-center text-white font-bold shadow-lg mr-3 floating">
                    {user.streak}
                  </div>
                  <div>
                    <h4 className="font-bold text-gradient">You're on fire!</h4>
                    <p className="text-xs text-gray-600">
                      {user.streak === 1 ? (
                        "Amazing first day! Keep going for more rewards."
                      ) : user.streak < 3 ? (
                        "Great start! 3-day streaks give bonus points!"
                      ) : user.streak < 7 ? (
                        "Fantastic work! Keep this up for a week to unlock achievements."
                      ) : (
                        "Incredible dedication! You're building powerful habits!"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Timeline for today */}
          <div className={`${user?.streak && user.streak > 0 ? '' : 'mt-4 pt-4 border-t border-gray-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Today's Timeline</h3>
              <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            
            <div className="relative pl-6">
              {/* Timeline track */}
              <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
              
              {incompleteTasks.length > 0 ? (
                incompleteTasks.slice(0, 3).map((task, index) => (
                  <div key={task.id} className="mb-3 relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-primary/50 z-10"></div>
                    
                    <div className="text-xs text-gray-400 mb-0.5">
                      {task.time || (index === 0 ? '9:00 AM' : index === 1 ? '1:30 PM' : '4:00 PM')}
                    </div>
                    <div className="text-sm font-medium text-gray-700">{task.title}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-2">No remaining tasks for today</div>
              )}
              
              {incompleteTasks.length > 3 && (
                <div className="text-xs text-primary font-medium mt-1 text-center">
                  +{incompleteTasks.length - 3} more tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-primary/30 bg-gradient-to-b from-white to-primary/5">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListChecks className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gradient mb-2 font-outfit">No tasks yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Start your productivity journey by adding your first task and earn points!</p>
          <Button 
            onClick={openAddTaskModal} 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Your First Task
          </Button>
        </div>
      ) : (
        <>
          {/* Tasks List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 font-outfit flex items-center">
                <span className="bg-primary/10 w-7 h-7 rounded-full flex items-center justify-center mr-2 shadow-sm">
                  <span className="text-gradient font-bold">{incompleteTasks.length}</span>
                </span>
                <span>Tasks To Do</span>
              </h2>
            </div>
            
            {/* Task List */}
            <div className="space-y-3">
              {incompleteTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
          
          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700 font-outfit flex items-center">
                  <span className="bg-success/10 w-7 h-7 rounded-full flex items-center justify-center mr-2 shadow-sm">
                    <span className="text-success font-bold">{completedTasks.length}</span>
                  </span>
                  <span>Completed</span>
                </h2>
              </div>
              
              <div className="space-y-3">
                {completedTasks.slice(0, 3).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {completedTasks.length > 3 && (
                  <div className="text-center py-3">
                    <Link href="/history">
                      <div className="inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full cursor-pointer hover-card">
                        View All {completedTasks.length} Completed Tasks →
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Add Task Button - Top position */}
      <div className="fixed top-20 right-6 z-10">
        <motion.button 
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg hover:shadow-primary/30 transition-all"
          onClick={openAddTaskModal}
          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlusCircle className="h-5 w-5" />
          <span className="font-medium">New Task</span>
        </motion.button>
      </div>
      
      <AddTaskModal />
    </div>
  );
}

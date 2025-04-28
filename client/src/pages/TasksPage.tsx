import { Link } from "wouter";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/TaskCard";
import ProgressBar from "@/components/ProgressBar";
import AddTaskModal from "@/components/AddTaskModal";
import { calculateProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Flame, ListChecks, PlusCircle } from "lucide-react";

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
          <a className="text-primary border-b-2 border-primary px-4 py-2 font-semibold text-sm font-outfit">
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
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            History
          </a>
        </Link>
      </div>
      
      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gradient font-outfit">Today's Progress</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="bg-gradient-to-r from-accent to-accent/80 text-xs text-white px-3 py-1 rounded-full font-medium flex items-center shadow-sm">
                <Flame className="h-3.5 w-3.5 mr-1 stroke-[2.5]" />
                <span className="font-bold">{user?.streak || 0}</span> 
                <span className="ml-0.5">day streak</span>
              </div>
            </div>
            <span className="text-sm text-primary font-bold bg-primary/5 px-2 py-1 rounded-md">
              {completedTasksCount}/{totalTasksCount} completed
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <ProgressBar progress={progressPercentage} max={100} />
          
          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <span>{completedTasksCount} done</span>
            <span>{totalTasksCount - completedTasksCount} remaining</span>
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
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 animate-pulse"
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
                      <div className="inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full cursor-pointer">
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
      
      {/* Add Task Button */}
      <button 
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:shadow-primary/30 transition-all add-button"
        onClick={openAddTaskModal}
      >
        <PlusCircle className="h-7 w-7" />
      </button>
      
      <AddTaskModal />
    </div>
  );
}

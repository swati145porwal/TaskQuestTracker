import { Link } from "wouter";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/TaskCard";
import ProgressBar from "@/components/ProgressBar";
import AddTaskModal from "@/components/AddTaskModal";
import { calculateProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const { tasks, user, openAddTaskModal } = useTaskContext();
  
  const completedTasksCount = tasks.filter(task => task.isCompleted).length;
  const totalTasksCount = tasks.length;
  const progressPercentage = calculateProgress(completedTasksCount, totalTasksCount);
  
  return (
    <div className="animate-fadeIn">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <Link href="/">
          <a className="text-primary-500 border-b-2 border-primary-500 px-4 py-2 font-medium text-sm font-outfit">
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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800 font-outfit">Daily Progress</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="bg-accent-500 text-xs text-white px-2 py-0.5 rounded-full font-medium flex items-center">
                <i className="ri-fire-fill mr-1"></i>
                <span>{user?.streak || 0}</span> day streak
              </div>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {completedTasksCount}/{totalTasksCount} completed
            </span>
          </div>
        </div>
        
        <ProgressBar progress={progressPercentage} />
      </div>
      
      {/* Tasks List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 font-outfit">Today's Tasks</h2>
        </div>
        
        {/* Task List */}
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <div className="text-gray-400 mb-2">
                <i className="ri-file-list-3-line text-3xl"></i>
              </div>
              <h3 className="text-gray-700 font-medium mb-1">No tasks yet</h3>
              <p className="text-gray-500 text-sm mb-3">Add your first task to get started</p>
              <Button onClick={openAddTaskModal} size="sm">Add Task</Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Task Button */}
      <button 
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all"
        onClick={openAddTaskModal}
      >
        <i className="ri-add-line text-2xl"></i>
      </button>
      
      <AddTaskModal />
    </div>
  );
}

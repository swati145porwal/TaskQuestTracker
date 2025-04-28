import React, { useRef, useState } from "react";
import { Task } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, Clock, Coins, Trash2, Star, ListChecks, BookOpen, HeartPulse, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskContext();
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCompleteTask = async (e: React.MouseEvent) => {
    if (task.isCompleted) return;
    
    const rect = checkboxRef.current?.getBoundingClientRect();
    if (rect) {
      const position = {
        x: rect.right,
        y: rect.top
      };
      await completeTask(task.id, position);
    }
  };
  
  // Determine category and icon
  const getTaskCategoryInfo = () => {
    const description = task.description?.toLowerCase() || '';
    
    if (description.includes('[health]')) {
      return { 
        category: 'Health', 
        icon: <HeartPulse className="h-3.5 w-3.5" />, 
        color: 'from-green-400 to-emerald-500' 
      };
    } else if (description.includes('[work]')) {
      return { 
        category: 'Work', 
        icon: <ListChecks className="h-3.5 w-3.5" />, 
        color: 'from-blue-400 to-indigo-500' 
      };
    } else if (description.includes('[wellness]')) {
      return { 
        category: 'Wellness', 
        icon: <Star className="h-3.5 w-3.5" />, 
        color: 'from-yellow-400 to-amber-500' 
      };
    } else if (description.includes('[self-improvement]')) {
      return { 
        category: 'Self-improvement', 
        icon: <Brain className="h-3.5 w-3.5" />, 
        color: 'from-pink-400 to-rose-500' 
      };
    }
    
    return { 
      category: '', 
      icon: null, 
      color: 'from-primary to-secondary' 
    };
  };
  
  const { category, icon, color } = getTaskCategoryInfo();
  
  return (
    <motion.div
      className={`hover-card rounded-xl relative shadow-sm ${
        task.isCompleted 
          ? "bg-gray-50 border border-gray-100" 
          : "task-card border-l-4 border-l-primary/50 border-t border-r border-b border-gray-100"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Task glow effect on hover */}
      {!task.isCompleted && isHovered && (
        <div className="absolute inset-0 -z-10 bg-primary/5 rounded-xl blur-md"></div>
      )}
      
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {task.isCompleted ? (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-success to-success/70 shadow-md flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            ) : (
              <motion.button 
                ref={checkboxRef}
                className="custom-checkbox w-9 h-9 rounded-lg border-2 border-primary/30 flex items-center justify-center hover:border-primary transition-all"
                onClick={handleCompleteTask}
                whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="h-5 w-5 text-primary opacity-0 group-hover:opacity-10" />
              </motion.button>
            )}
          </div>
          
          <div className="ml-3 flex-grow">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`${
                task.isCompleted 
                  ? "text-gray-500 line-through" 
                  : "text-gray-800"
                } font-medium font-outfit text-base`}
              >
                {task.title}
              </h3>
              
              {category && (
                <span className={`bg-gradient-to-r ${color} text-white text-[10px] rounded-full px-2 py-0.5 inline-flex items-center gap-1 shadow-sm`}>
                  {icon}
                  <span>{category}</span>
                </span>
              )}
            </div>
            
            {task.description && (
              <p className={`${
                task.isCompleted 
                  ? "text-gray-400 line-through" 
                  : "text-gray-500"
                } text-sm mt-1`}
              >
                {task.description.replace(/\[.*?\]/g, '')}
              </p>
            )}
            
            <div className="flex flex-wrap items-center mt-2 gap-2">
              {task.time && (
                <div className="flex items-center text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{task.time}</span>
                </div>
              )}
              
              {task.isCompleted && (
                <div className="flex items-center text-success text-xs bg-success/10 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end ml-4">
            <motion.div 
              className={`${
                task.isCompleted 
                  ? "bg-gray-200 text-gray-500" 
                  : "bg-gradient-to-r from-primary/20 to-primary shadow-sm"
                } px-3 py-1.5 rounded-full text-xs font-bold flex items-center`}
              whileHover={!task.isCompleted ? { scale: 1.05, y: -2 } : {}}
            >
              <Coins className={`h-3.5 w-3.5 ${task.isCompleted ? "text-gray-500" : "text-white"} mr-1`} />
              <span className={task.isCompleted ? "text-gray-500" : "text-white"}>{task.points} pts</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Shimmer effect for non-completed tasks */}
      {!task.isCompleted && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div 
            className="h-full w-1/3 bg-white/20 -skew-x-[45deg] transform opacity-30"
            style={{
              animation: "shimmer 3s infinite linear",
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        </div>
      )}
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="absolute top-2 right-2 text-gray-400 hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

import React, { useRef } from "react";
import { Task } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Clock, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskContext();
  const checkboxRef = useRef<HTMLButtonElement>(null);
  
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
  
  return (
    <div className={`task-card rounded-xl p-4 relative animate-slideUp mb-4 shadow-sm ${task.isCompleted ? "completed" : ""}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {task.isCompleted ? (
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-success to-success/70 shadow-md flex items-center justify-center">
              <i className="ri-check-line text-white"></i>
            </div>
          ) : (
            <button 
              ref={checkboxRef}
              className="custom-checkbox w-7 h-7 rounded-md border-2 border-primary/50 flex items-center justify-center hover:bg-primary/5 transition-all hover:scale-105 hover:shadow-md"
              onClick={handleCompleteTask}
            >
              <i className="ri-check-line text-primary opacity-0"></i>
            </button>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={`${task.isCompleted ? "text-gray-500 line-through" : "text-gray-800"} font-medium font-outfit`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`${task.isCompleted ? "text-gray-400 line-through" : "text-gray-500"} text-sm mt-1`}>
              {task.description}
            </p>
          )}
          
          {task.time && (
            <div className="flex items-center mt-2 text-gray-400 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>{task.time}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end ml-4">
          <div className={`${
            task.isCompleted 
              ? "bg-gray-200 text-gray-500" 
              : "bg-gradient-to-r from-primary/20 to-secondary/20 text-gradient shadow-sm"
            } px-3 py-1 rounded-full text-xs font-bold flex items-center`}
          >
            <i className={`ri-coin-line ${task.isCompleted ? "text-gray-500" : "text-primary"} mr-1`}></i>
            <span>{task.points} pts</span>
          </div>
        </div>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="absolute top-2 right-2 text-gray-400 hover:text-destructive transition-colors p-1 rounded-full hover:bg-destructive/10"
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
    </div>
  );
}

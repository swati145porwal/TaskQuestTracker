import React, { useRef } from "react";
import { Task } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

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
    <div className={`task-card rounded-xl p-4 relative animate-slideUp mb-3 ${task.isCompleted ? "bg-gray-50" : "bg-white"}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {task.isCompleted ? (
            <div className="w-6 h-6 rounded-md bg-primary-500 border-2 border-primary-500 flex items-center justify-center">
              <i className="ri-check-line text-white"></i>
            </div>
          ) : (
            <button 
              ref={checkboxRef}
              className="custom-checkbox w-6 h-6 rounded-md border-2 border-primary-300 flex items-center justify-center hover:bg-primary-50 transition-colors"
              onClick={handleCompleteTask}
            >
              <i className="ri-check-line text-primary-500 opacity-0"></i>
            </button>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={`${task.isCompleted ? "text-gray-500 line-through" : "text-gray-800"} font-medium`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`${task.isCompleted ? "text-gray-400 line-through" : "text-gray-500"} text-sm mt-1`}>
              {task.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end ml-4">
          <div className={`${task.isCompleted ? "bg-gray-200 text-gray-500" : "bg-primary-100 text-primary-700"} px-2 py-0.5 rounded-full text-xs font-medium flex items-center`}>
            <i className="ri-coin-line text-xs mr-1"></i>
            <span>{task.points} pts</span>
          </div>
          {task.time && (
            <span className="text-gray-400 text-xs mt-1">{task.time}</span>
          )}
        </div>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
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
            <AlertDialogAction onClick={() => deleteTask(task.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

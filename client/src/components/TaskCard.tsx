import React, { useRef, useState } from "react";
import { Task } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Coins, Trash2, Star, ListChecks, BookOpen, HeartPulse, Brain, Pencil, Undo, Calendar, Repeat, Check, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReminderSettings from "./ReminderSettings";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskContext();
  const { toast } = useToast();
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showFailAnimation, setShowFailAnimation] = useState(false);
  const [editingPoints, setEditingPoints] = useState(false);
  const [newPoints, setNewPoints] = useState(task.points.toString());
  const [showActions, setShowActions] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  
  const handleCompleteTask = async (e: React.MouseEvent) => {
    if (task.isCompleted) return;
    
    const rect = checkboxRef.current?.getBoundingClientRect();
    if (rect) {
      const position = {
        x: rect.right,
        y: rect.top
      };
      
      setShowSuccessAnimation(true);
      
      // Success animation will show for 1.5 seconds before completing the task
      setTimeout(async () => {
        await completeTask(task.id, position);
        setShowSuccessAnimation(false);
      }, 1500);
    }
  };
  
  const handleFailTask = () => {
    setShowFailAnimation(true);
    
    // Show sad emoji animation for 2 seconds
    setTimeout(() => {
      setShowFailAnimation(false);
      
      // Show toast notification
      toast({
        title: "Task not completed",
        description: "Don't worry, you can try again later!",
        variant: "destructive",
      });
    }, 2000);
  };
  
  const handleEditPoints = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update points logic would go here
    // For now we'll just show a toast notification
    toast({
      title: "Points updated",
      description: `Task points updated to ${newPoints}`,
    });
    
    setEditingPoints(false);
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
            {editingPoints ? (
              <form onSubmit={handleEditPoints} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  className="w-16 h-8 text-xs p-1"
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="bg-primary/20 text-primary rounded-full p-1.5"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Check className="h-3 w-3" />
                </motion.button>
              </form>
            ) : (
              <Popover open={showActions} onOpenChange={setShowActions}>
                <PopoverTrigger asChild>
                  <motion.div 
                    className={`${
                      task.isCompleted 
                        ? "bg-gray-200 text-gray-500" 
                        : "bg-gradient-to-r from-primary/20 to-primary shadow-sm"
                      } px-3 py-1.5 rounded-full text-xs font-bold flex items-center cursor-pointer`}
                    whileHover={!task.isCompleted ? { scale: 1.05, y: -2 } : {}}
                    onClick={() => !task.isCompleted && setShowActions(true)}
                  >
                    <Coins className={`h-3.5 w-3.5 ${task.isCompleted ? "text-gray-500" : "text-white"} mr-1`} />
                    <span className={task.isCompleted ? "text-gray-500" : "text-white"}>{task.points} pts</span>
                  </motion.div>
                </PopoverTrigger>
                {!task.isCompleted && (
                  <PopoverContent className="w-48 p-2" align="end">
                    <div className="space-y-1">
                      <motion.button
                        className="w-full text-xs flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setEditingPoints(true)}
                        whileHover={{ x: 2 }}
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-600" />
                        <span>Edit points</span>
                      </motion.button>
                      
                      <motion.button
                        className="w-full text-xs flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={handleFailTask}
                        whileHover={{ x: 2 }}
                      >
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                        <span className="text-destructive">Failed to complete</span>
                      </motion.button>
                      
                      <motion.button
                        className="w-full text-xs flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setIsReminderOpen(true);
                          setShowActions(false);
                        }}
                        whileHover={{ x: 2 }}
                      >
                        <Bell className="h-3.5 w-3.5 text-gray-600" />
                        <span>Set reminder</span>
                      </motion.button>
                      
                      <motion.button
                        className="w-full text-xs flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <Repeat className="h-3.5 w-3.5 text-gray-600" />
                        <span>Make recurring</span>
                      </motion.button>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            )}
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
      
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div 
            className="absolute inset-0 bg-success/10 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                opacity: 1,
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-success text-white rounded-full p-4 shadow-lg"
            >
              <CheckCircle className="h-12 w-12" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-4 text-center bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-success"
            >
              Task completed! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Failure Animation Overlay */}
      <AnimatePresence>
        {showFailAnimation && (
          <motion.div 
            className="absolute inset-0 bg-destructive/10 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                opacity: 1,
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-destructive text-white rounded-full p-4 shadow-lg"
            >
              <XCircle className="h-12 w-12" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-4 text-center bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-destructive"
            >
              We'll try again later 😢
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-3 right-3"
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <motion.button 
              className="text-gray-400 hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10 bg-white shadow-sm"
              aria-label="Delete task"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl text-gradient font-bold">Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-3">
                <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10 text-sm text-gray-600">
                  Deleting this task will remove it permanently from your task list. All progress related to this task will be lost.
                </div>
              </div>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="hover:bg-gray-100">Cancel</AlertDialogCancel>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <AlertDialogAction 
                    onClick={() => deleteTask(task.id)} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Task
                  </AlertDialogAction>
                </motion.div>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
      
      {/* Reminder Settings Dialog */}
      <ReminderSettings
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        task={task}
      />
    </motion.div>
  );
}

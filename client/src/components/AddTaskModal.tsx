import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, ListChecks, PenLine, Star, Tag, Brain, Heart, HeartPulse, Sparkles, Repeat, Bell } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const TASK_TEMPLATES = [
  { 
    title: "Morning workout routine", 
    description: "Daily exercise to stay healthy", 
    points: 50, 
    time: "7:00 AM",
    category: "Health"
  },
  { 
    title: "Read for 30 minutes", 
    description: "Reading session to expand knowledge", 
    points: 30, 
    time: "8:30 PM",
    category: "Self-improvement"
  },
  { 
    title: "Meditate for 10 minutes", 
    description: "Daily mindfulness practice", 
    points: 20, 
    time: "6:30 AM",
    category: "Wellness"
  },
  { 
    title: "Drink 8 glasses of water", 
    description: "Stay hydrated throughout the day", 
    points: 25, 
    time: "All day",
    category: "Health"
  }
];

const TASK_CATEGORIES = [
  { name: "Health", color: "from-green-400 to-emerald-500", icon: <HeartPulse className="h-3 w-3" /> },
  { name: "Work", color: "from-blue-400 to-indigo-500", icon: <ListChecks className="h-3 w-3" /> },
  { name: "Personal", color: "from-purple-400 to-violet-500", icon: <PenLine className="h-3 w-3" /> },
  { name: "Wellness", color: "from-yellow-400 to-amber-500", icon: <Sparkles className="h-3 w-3" /> },
  { name: "Self-improvement", color: "from-pink-400 to-rose-500", icon: <Brain className="h-3 w-3" /> }
];

export default function AddTaskModal() {
  const { isAddTaskModalOpen, closeAddTaskModal, addTask } = useTaskContext();
  const { toast } = useToast();
  
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPoints, setTaskPoints] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskCategory, setTaskCategory] = useState("Health");
  const [activeTab, setActiveTab] = useState("create");
  const [remindOnDate, setRemindOnDate] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringSchedule, setRecurringSchedule] = useState("daily");
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      toast({
        title: "Task name required",
        description: "Please enter a name for your task.",
        variant: "destructive",
      });
      return;
    }
    
    if (!taskPoints || parseInt(taskPoints) <= 0) {
      toast({
        title: "Valid points required",
        description: "Please enter a positive number of points.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addTask({
        title: taskName,
        description: taskDescription,
        points: parseInt(taskPoints),
        time: taskTime,
        date: null, // Add date field which will be used with the calendar feature
        category: taskCategory,
        googleEventId: null
      });
      
      toast({
        title: "Task added successfully",
        description: "Your new task has been created.",
        variant: "default",
      });
      
      // Reset form
      resetForm();
      closeAddTaskModal();
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Failed to add task",
        description: "An error occurred while creating your task.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskPoints("");
    setTaskTime("");
    setTaskCategory("Health");
    setRemindOnDate(false);
    setActiveTab("create");
  };
  
  const handleClose = () => {
    resetForm();
    closeAddTaskModal();
  };
  
  const selectTemplate = (template: typeof TASK_TEMPLATES[0]) => {
    setTaskName(template.title);
    setTaskDescription(template.description);
    setTaskPoints(template.points.toString());
    setTaskTime(template.time);
    setTaskCategory(template.category);
    setActiveTab("create");
  };
  
  const getPointsValue = () => {
    const value = parseInt(taskPoints);
    if (isNaN(value) || value <= 0) return 1;
    if (value > 100) return 100;
    return value;
  };
  
  return (
    <Dialog open={isAddTaskModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gradient font-outfit">Add New Task</DialogTitle>
          <DialogDescription>
            Create tasks to build habits and earn points when completed.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create" className="text-sm">Create Task</TabsTrigger>
            <TabsTrigger value="templates" className="text-sm">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskName" className="text-sm font-medium">Task Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ListChecks className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input 
                    id="taskName" 
                    placeholder="e.g., Morning workout" 
                    className="pl-9"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taskDesc" className="text-sm font-medium">Description (optional)</Label>
                <Textarea 
                  id="taskDesc" 
                  placeholder="e.g., 30-minute cardio exercise" 
                  className="resize-none"
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskPoints" className="text-sm font-medium">Points</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="taskPoints"
                        type="number"
                        min="1"
                        max="100"
                        placeholder="50"
                        className="pr-10"
                        value={taskPoints}
                        onChange={(e) => setTaskPoints(e.target.value)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="text-xs px-1.5 py-0.5 bg-primary/10 rounded-md text-primary font-medium">
                          pts
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary/60 to-secondary/60 rounded-full"
                        style={{ width: `${getPointsValue()}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taskTime" className="text-sm font-medium">Time (optional)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="taskTime"
                      placeholder="e.g., 8:00 AM"
                      className="pl-9"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <div className="flex flex-wrap gap-2">
                  {TASK_CATEGORIES.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setTaskCategory(category.name)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
                        taskCategory === category.name 
                          ? `bg-gradient-to-r ${category.color} text-white shadow-sm` 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon}
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-100 space-y-3">
                {/* Time Options Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Time options</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTimeOptions(!showTimeOptions)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                        showTimeOptions ? 'bg-primary border-primary' : 'bg-gray-200 border-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          showTimeOptions ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {showTimeOptions && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-50 p-3 rounded-md space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Repeat className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">Make it recurring</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsRecurring(!isRecurring)}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                                isRecurring ? 'bg-primary border-primary' : 'bg-gray-200 border-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isRecurring ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                          
                          {isRecurring && (
                            <div className="grid grid-cols-4 gap-2 pt-2">
                              {["daily", "weekly", "monthly", "custom"].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setRecurringSchedule(option)}
                                  className={`text-xs p-2 rounded-md text-center transition-all capitalize ${
                                    recurringSchedule === option 
                                      ? 'bg-primary/20 text-primary font-medium' 
                                      : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Reminder Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Set reminder</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRemindOnDate(!remindOnDate)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out ${
                        remindOnDate ? 'bg-primary border-primary' : 'bg-gray-200 border-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          remindOnDate ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {remindOnDate && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-50 p-3 rounded-md space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="reminder-enabled" className="flex items-center gap-2 text-xs text-gray-600">
                              <Bell className="h-3.5 w-3.5" />
                              Enable reminders
                            </Label>
                            <div className="relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out border-primary bg-primary">
                              <span className="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-3.5" />
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="remind-before" className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="h-3.5 w-3.5" />
                              Remind me before task is due
                            </Label>
                            <select
                              id="remind-before"
                              className="h-8 text-xs rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary w-full px-3"
                            >
                              <option value="5">5 minutes</option>
                              <option value="10">10 minutes</option>
                              <option value="15">15 minutes</option>
                              <option value="30" selected>30 minutes</option>
                              <option value="60">1 hour</option>
                              <option value="120">2 hours</option>
                              <option value="1440">1 day</option>
                            </select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="notification-type" className="text-xs text-gray-600">Notification type</Label>
                            <select
                              id="notification-type"
                              className="h-8 text-xs rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary w-full px-3"
                            >
                              <option value="app">In-app only</option>
                              <option value="browser" selected>Browser notification</option>
                              <option value="both">Both</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <DialogFooter className="mt-6 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md font-medium gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create Task
                  </Button>
                </motion.div>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <AnimatePresence>
                {TASK_TEMPLATES.map((template, index) => {
                  // Get the category icon
                  const categoryInfo = TASK_CATEGORIES.find(cat => cat.name === template.category);
                  
                  return (
                    <motion.div 
                      key={index}
                      className="border border-gray-100 rounded-lg p-3 cursor-pointer transition-all hover:border-primary/20 bg-white hover-card"
                      onClick={() => selectTemplate(template)}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                        transition: { duration: 0.2 }
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${categoryInfo?.color || 'from-primary to-secondary'} flex items-center justify-center mr-2 shadow-sm`}>
                            {categoryInfo?.icon || <Star className="h-4 w-4 text-white" />}
                          </div>
                          <h4 className="font-medium text-gray-800">{template.title}</h4>
                        </div>
                        <motion.div 
                          className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full"
                          whileHover={{ scale: 1.1 }}
                        >
                          {template.points} pts
                        </motion.div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 pl-10">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                          <Tag className="h-3 w-3 mr-1" />
                          {template.category}
                        </div>
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.time}
                        </div>
                      </div>
                      <motion.div 
                        className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden hidden"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary/60 to-secondary/60"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => setActiveTab("create")}
                  className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-gray-800 font-medium"
                  variant="outline"
                >
                  <PenLine className="h-4 w-4 mr-2" />
                  Create Custom Task
                </Button>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

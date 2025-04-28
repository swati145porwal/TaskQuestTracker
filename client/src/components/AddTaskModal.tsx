import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AddTaskModal() {
  const { isAddTaskModalOpen, closeAddTaskModal, addTask } = useTaskContext();
  const { toast } = useToast();
  
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPoints, setTaskPoints] = useState("");
  const [taskTime, setTaskTime] = useState("");
  
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
        time: taskTime
      });
      
      // Reset form
      setTaskName("");
      setTaskDescription("");
      setTaskPoints("");
      setTaskTime("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  const handleClose = () => {
    // Reset form
    setTaskName("");
    setTaskDescription("");
    setTaskPoints("");
    setTaskTime("");
    closeAddTaskModal();
  };
  
  return (
    <Dialog open={isAddTaskModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 font-outfit">Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with points to earn when completed.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input 
              id="taskName" 
              placeholder="e.g., Morning workout" 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taskDesc">Description (optional)</Label>
            <Input 
              id="taskDesc" 
              placeholder="e.g., 30-minute cardio exercise" 
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskPoints">Points</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-coin-line text-gray-400"></i>
                </div>
                <Input
                  id="taskPoints"
                  type="number"
                  min="1"
                  placeholder="50"
                  className="pl-9"
                  value={taskPoints}
                  onChange={(e) => setTaskPoints(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskTime">Time (optional)</Label>
              <Input
                id="taskTime"
                placeholder="e.g., Morning"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

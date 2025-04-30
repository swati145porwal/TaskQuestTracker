import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useGuest } from "@/context/GuestContext";
import type { Task, Reward, User, RedeemedReward } from "@shared/schema";

type TabType = "tasks" | "rewards" | "stats" | "history" | "profile";

interface TaskContextType {
  user: User | null;
  tasks: Task[];
  rewards: Reward[];
  redeemedRewards: (RedeemedReward & { reward?: Reward })[];
  activeTab: TabType;
  isAddTaskModalOpen: boolean;
  isAddRewardModalOpen: boolean;
  showPointsAnimation: boolean;
  pointsAnimationValue: number;
  pointsAnimationPosition: { x: number; y: number };
  isGuestMode: boolean;
  setActiveTab: (tab: TabType) => void;
  openAddTaskModal: () => void;
  closeAddTaskModal: () => void;
  openAddRewardModal: () => void;
  closeAddRewardModal: () => void;
  completeTask: (taskId: number, position: { x: number; y: number }) => Promise<void>;
  addTask: (task: Omit<Task, "id" | "userId" | "isCompleted" | "createdAt">) => Promise<void>;
  updateTask: (taskId: number, taskData: Partial<Omit<Task, "id" | "userId" | "isCompleted" | "createdAt">>) => Promise<boolean>;
  deleteTask: (taskId: number) => Promise<void>;
  addReward: (reward: Omit<Reward, "id" | "userId">) => Promise<void>;
  redeemReward: (rewardId: number) => Promise<void>;
  deleteReward: (rewardId: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<(RedeemedReward & { reward?: Reward })[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsAnimationValue, setPointsAnimationValue] = useState(0);
  const [pointsAnimationPosition, setPointsAnimationPosition] = useState({ x: 0, y: 0 });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { isGuestMode, guestUser } = useGuest();

  // Get the effective user (either authenticated user or guest user)
  const effectiveUser = user || (isGuestMode ? guestUser : null);

  // Store guest data in localStorage
  const [guestTasks, setGuestTasks] = useState<Task[]>([]);
  const [guestRewards, setGuestRewards] = useState<Reward[]>([]);
  const [guestRedeemedRewards, setGuestRedeemedRewards] = useState<(RedeemedReward & { reward?: Reward })[]>([]);

  // Initialize guest data from localStorage
  useEffect(() => {
    if (isGuestMode) {
      const storedTasks = localStorage.getItem('guestTasks');
      const storedRewards = localStorage.getItem('guestRewards');
      const storedRedeemedRewards = localStorage.getItem('guestRedeemedRewards');
      
      if (storedTasks) setGuestTasks(JSON.parse(storedTasks));
      if (storedRewards) setGuestRewards(JSON.parse(storedRewards));
      if (storedRedeemedRewards) setGuestRedeemedRewards(JSON.parse(storedRedeemedRewards));
    }
  }, [isGuestMode]);

  // Update localStorage when guest data changes
  useEffect(() => {
    if (isGuestMode) {
      localStorage.setItem('guestTasks', JSON.stringify(guestTasks));
      localStorage.setItem('guestRewards', JSON.stringify(guestRewards));
      localStorage.setItem('guestRedeemedRewards', JSON.stringify(guestRedeemedRewards));
    }
  }, [isGuestMode, guestTasks, guestRewards, guestRedeemedRewards]);

  // Fetch initial data when the user is authenticated or in guest mode
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = async () => {
    // Skip if no user is available and not in guest mode
    if (!user && !isGuestMode) return;
    
    // If in guest mode, use local state instead of API calls
    if (isGuestMode) {
      setTasks(guestTasks);
      setRewards(guestRewards);
      setRedeemedRewards(guestRedeemedRewards);
      return;
    }
    
    // Regular user with API calls
    try {
      const tasksResponse = await fetch("/api/tasks");
      const rewardsResponse = await fetch("/api/rewards");
      const redeemedRewardsResponse = await fetch("/api/redeemed-rewards");
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      }
      
      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData);
      }
      
      if (redeemedRewardsResponse.ok) {
        const redeemedRewardsData = await redeemedRewardsResponse.json();
        setRedeemedRewards(redeemedRewardsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openAddTaskModal = () => setIsAddTaskModalOpen(true);
  const closeAddTaskModal = () => setIsAddTaskModalOpen(false);
  const openAddRewardModal = () => setIsAddRewardModalOpen(true);
  const closeAddRewardModal = () => setIsAddRewardModalOpen(false);

  const completeTask = async (taskId: number, position: { x: number; y: number }) => {
    try {
      // Guest mode task completion
      if (isGuestMode && guestUser) {
        // Find the task in the guest tasks
        const taskIndex = guestTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
          throw new Error("Task not found");
        }
        
        const task = guestTasks[taskIndex];
        const pointsEarned = task.points;
        
        // Update the task as completed
        const updatedTasks = [...guestTasks];
        updatedTasks[taskIndex] = {
          ...task,
          isCompleted: true
        };
        
        // Update the guest user points
        const updatedGuestUser = {
          ...guestUser,
          points: (guestUser.points || 0) + pointsEarned
        };
        
        // Add to completed tasks
        const newCompletedTask = {
          id: Date.now(), // Use timestamp as a simple ID
          userId: guestUser.id,
          taskId: task.id,
          completedAt: new Date(),
          pointsEarned: pointsEarned
        };
        
        // Update all the state
        setGuestTasks(updatedTasks);
        
        // Show points animation
        setPointsAnimationValue(pointsEarned);
        setPointsAnimationPosition(position);
        setShowPointsAnimation(true);
        
        // Hide animation after 1.5 seconds
        setTimeout(() => {
          setShowPointsAnimation(false);
        }, 1500);
        
        // Refresh data to update the UI
        setTasks(updatedTasks);
        
        toast({
          title: "Task completed!",
          description: `You earned ${pointsEarned} points.`,
        });
        
        return;
      }
      
      // Regular user task completion with API
      const response = await apiRequest("PUT", `/api/tasks/${taskId}/complete`, null);
      const data = await response.json();
      
      if (data.success) {
        // Show points animation
        setPointsAnimationValue(data.pointsEarned);
        setPointsAnimationPosition(position);
        setShowPointsAnimation(true);
        
        // Hide animation after 1.5 seconds
        setTimeout(() => {
          setShowPointsAnimation(false);
        }, 1500);
        
        // Refresh data
        await refreshData();
        
        toast({
          title: "Task completed!",
          description: `You earned ${data.pointsEarned} points.`,
        });
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTask = async (task: Omit<Task, "id" | "userId" | "isCompleted" | "createdAt">) => {
    try {
      // Handle task creation in guest mode
      if (isGuestMode && guestUser) {
        // Create a new task with a temporary ID
        const newTask: Task = {
          ...task,
          id: Date.now(), // Use timestamp as a simple ID
          userId: guestUser.id,
          isCompleted: false,
          createdAt: new Date()
        };
        
        // Add to guest tasks
        const updatedTasks = [...guestTasks, newTask];
        setGuestTasks(updatedTasks);
        
        // Update the UI
        setTasks(updatedTasks);
        
        closeAddTaskModal();
        toast({
          title: "Task added",
          description: "Your new task has been added successfully.",
        });
        
        return;
      }
      
      // Regular user task creation with API
      const response = await apiRequest("POST", "/api/tasks", task);
      if (response.ok) {
        await refreshData();
        closeAddTaskModal();
        toast({
          title: "Task added",
          description: "Your new task has been added successfully.",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: number, taskData: Partial<Omit<Task, "id" | "userId" | "isCompleted" | "createdAt">>) => {
    try {
      // Handle task update in guest mode
      if (isGuestMode) {
        // Find the task index
        const taskIndex = guestTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
          throw new Error("Task not found");
        }
        
        // Update the task
        const updatedTasks = [...guestTasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          ...taskData
        };
        
        // Update state
        setGuestTasks(updatedTasks);
        
        // Update UI
        setTasks(updatedTasks);
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
        return true;
      }
      
      // Regular user task update with API
      const response = await apiRequest("PUT", `/api/tasks/${taskId}`, taskData);
      if (response.ok) {
        await refreshData();
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      // Handle task deletion in guest mode
      if (isGuestMode) {
        // Filter out the task to delete
        const updatedTasks = guestTasks.filter(task => task.id !== taskId);
        
        // Update state
        setGuestTasks(updatedTasks);
        
        // Update UI
        setTasks(updatedTasks);
        
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully.",
        });
        
        return;
      }
      
      // Regular user task deletion with API
      const response = await apiRequest("DELETE", `/api/tasks/${taskId}`, null);
      if (response.ok) {
        await refreshData();
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addReward = async (reward: Omit<Reward, "id" | "userId">) => {
    try {
      // Handle reward creation in guest mode
      if (isGuestMode && guestUser) {
        // Create a new reward with a temporary ID
        const newReward: Reward = {
          ...reward,
          id: Date.now(), // Use timestamp as a simple ID
          userId: guestUser.id
        };
        
        // Add to guest rewards
        const updatedRewards = [...guestRewards, newReward];
        setGuestRewards(updatedRewards);
        
        // Update the UI
        setRewards(updatedRewards);
        
        closeAddRewardModal();
        toast({
          title: "Reward added",
          description: "Your new reward has been added successfully.",
        });
        
        return;
      }
      
      // Regular user reward creation with API
      const response = await apiRequest("POST", "/api/rewards", reward);
      if (response.ok) {
        await refreshData();
        closeAddRewardModal();
        toast({
          title: "Reward added",
          description: "Your new reward has been added successfully.",
        });
      }
    } catch (error) {
      console.error("Error adding reward:", error);
      toast({
        title: "Error",
        description: "Failed to add reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const redeemReward = async (rewardId: number) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      
      if (!reward) {
        throw new Error("Reward not found");
      }
      
      // Handle guest mode reward redemption
      if (isGuestMode && guestUser) {
        // Check if guest has enough points
        if (guestUser.points < reward.points) {
          toast({
            title: "Not enough points",
            description: `You need ${reward.points - guestUser.points} more points to redeem this reward.`,
            variant: "destructive",
          });
          return;
        }
        
        // Update guest user points
        const updatedGuestUser = {
          ...guestUser,
          points: guestUser.points - reward.points
        };
        
        // Create redeemed reward
        const newRedeemedReward = {
          id: Date.now(),
          userId: guestUser.id,
          rewardId: reward.id,
          pointsSpent: reward.points,
          redeemedAt: new Date(),
          reward: reward
        };
        
        // Update guest redeemed rewards
        const updatedRedeemedRewards = [...guestRedeemedRewards, newRedeemedReward];
        setGuestRedeemedRewards(updatedRedeemedRewards);
        
        // Update UI
        setRedeemedRewards(updatedRedeemedRewards);
        
        toast({
          title: "Reward redeemed!",
          description: `You redeemed ${reward.title} for ${reward.points} points.`,
        });
        
        return;
      }
      
      // Check if authenticated user has enough points
      if (user && user.points < reward.points) {
        toast({
          title: "Not enough points",
          description: `You need ${reward.points - user.points} more points to redeem this reward.`,
          variant: "destructive",
        });
        return;
      }
      
      // Regular user reward redemption with API
      const response = await apiRequest("POST", `/api/rewards/${rewardId}/redeem`, null);
      const data = await response.json();
      
      if (data.success) {
        await refreshData();
        toast({
          title: "Reward redeemed!",
          description: `You redeemed ${reward.title} for ${reward.points} points.`,
        });
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteReward = async (rewardId: number) => {
    try {
      // Handle reward deletion in guest mode
      if (isGuestMode) {
        // Filter out the reward to delete
        const updatedRewards = guestRewards.filter(reward => reward.id !== rewardId);
        
        // Update state
        setGuestRewards(updatedRewards);
        
        // Update UI
        setRewards(updatedRewards);
        
        toast({
          title: "Reward deleted",
          description: "Your reward has been deleted successfully.",
        });
        
        return;
      }
      
      // Regular user reward deletion with API
      const response = await apiRequest("DELETE", `/api/rewards/${rewardId}`, null);
      if (response.ok) {
        await refreshData();
        toast({
          title: "Reward deleted",
          description: "Your reward has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast({
        title: "Error",
        description: "Failed to delete reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user: isGuestMode ? guestUser : user,
    tasks,
    rewards,
    redeemedRewards,
    activeTab,
    isAddTaskModalOpen,
    isAddRewardModalOpen,
    showPointsAnimation,
    pointsAnimationValue,
    pointsAnimationPosition,
    isGuestMode,
    setActiveTab,
    openAddTaskModal,
    closeAddTaskModal,
    openAddRewardModal,
    closeAddRewardModal,
    completeTask,
    addTask,
    updateTask,
    deleteTask,
    addReward,
    redeemReward,
    deleteReward,
    refreshData
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}

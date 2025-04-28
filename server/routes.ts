import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, 
  insertRewardSchema, 
  insertRedeemedRewardSchema,
  insertCompletedTaskSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user", async (req: Request, res: Response) => {
    // For demo purposes, return the first user (demo user)
    const user = await storage.getUser(1);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Task routes
  app.get("/api/tasks", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      // For demo, use the demo user (id=1)
      const userId = 1;
      
      const taskData = { ...req.body, userId };
      const parsedTask = insertTaskSchema.parse(taskData);
      
      const newTask = await storage.createTask(parsedTask);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id/complete", async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      if (task.isCompleted) {
        return res.status(400).json({ error: "Task already completed" });
      }
      
      // Update task completion status
      await storage.updateTaskCompletion(taskId, true);
      
      // Add record to completed tasks
      const completedTaskData = {
        userId: task.userId,
        taskId: task.id,
        pointsEarned: task.points
      };
      
      const parsedCompletedTask = insertCompletedTaskSchema.parse(completedTaskData);
      await storage.createCompletedTask(parsedCompletedTask);
      
      // Update user points
      const user = await storage.getUser(task.userId);
      
      if (user) {
        await storage.updateUserPoints(user.id, user.points + task.points);
      }
      
      res.json({ success: true, pointsEarned: task.points });
    } catch (error) {
      res.status(500).json({ error: "Failed to complete task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      
      const deleted = await storage.deleteTask(taskId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Reward routes
  app.get("/api/rewards", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    const rewards = await storage.getRewards(userId);
    res.json(rewards);
  });

  app.post("/api/rewards", async (req: Request, res: Response) => {
    try {
      // For demo, use the demo user (id=1)
      const userId = 1;
      
      const rewardData = { ...req.body, userId };
      const parsedReward = insertRewardSchema.parse(rewardData);
      
      const newReward = await storage.createReward(parsedReward);
      res.status(201).json(newReward);
    } catch (error) {
      res.status(400).json({ error: "Invalid reward data" });
    }
  });

  app.post("/api/rewards/:id/redeem", async (req: Request, res: Response) => {
    try {
      const rewardId = parseInt(req.params.id);
      
      if (isNaN(rewardId)) {
        return res.status(400).json({ error: "Invalid reward ID" });
      }
      
      // For demo, use the demo user (id=1)
      const userId = 1;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const reward = await storage.getReward(rewardId);
      
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      if (user.points < reward.points) {
        return res.status(400).json({ error: "Not enough points to redeem this reward" });
      }
      
      // Create redeemed reward record
      const redeemedRewardData = {
        userId,
        rewardId
      };
      
      const parsedRedeemedReward = insertRedeemedRewardSchema.parse(redeemedRewardData);
      const redeemedReward = await storage.redeemReward(parsedRedeemedReward);
      
      // Deduct points from user
      await storage.updateUserPoints(userId, user.points - reward.points);
      
      res.json({ 
        success: true, 
        redeemedReward,
        pointsRemaining: user.points - reward.points 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to redeem reward" });
    }
  });

  app.delete("/api/rewards/:id", async (req: Request, res: Response) => {
    try {
      const rewardId = parseInt(req.params.id);
      
      if (isNaN(rewardId)) {
        return res.status(400).json({ error: "Invalid reward ID" });
      }
      
      const deleted = await storage.deleteReward(rewardId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete reward" });
    }
  });

  // Redeemed rewards routes
  app.get("/api/redeemed-rewards", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    const redeemedRewards = await storage.getRedeemedRewards(userId);
    
    // Get the reward details for each redeemed reward
    const redeemedRewardsWithDetails = await Promise.all(
      redeemedRewards.map(async (redeemedReward) => {
        const reward = await storage.getReward(redeemedReward.rewardId);
        return {
          ...redeemedReward,
          reward
        };
      })
    );
    
    res.json(redeemedRewardsWithDetails);
  });

  // Completed tasks routes
  app.get("/api/completed-tasks", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    const completedTasks = await storage.getCompletedTasks(userId);
    
    // Get the task details for each completed task
    const completedTasksWithDetails = await Promise.all(
      completedTasks.map(async (completedTask) => {
        const task = await storage.getTask(completedTask.taskId);
        return {
          ...completedTask,
          task
        };
      })
    );
    
    res.json(completedTasksWithDetails);
  });

  // Stats routes
  app.get("/api/stats", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const tasks = await storage.getTasks(userId);
    const completedTasks = await storage.getCompletedTasks(userId);
    
    // Calculate total tasks and completion rate
    const totalTasks = tasks.length;
    const completedTasksCount = tasks.filter(task => task.isCompleted).length;
    const completionRate = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
    
    // Create stats object
    const stats = {
      totalPoints: user.points,
      completionRate: Math.round(completionRate),
      currentStreak: user.streak,
      longestStreak: 12, // Mocked for demo
      totalTasksCompleted: completedTasks.length
    };
    
    res.json(stats);
  });

  // Weekly stats
  app.get("/api/stats/weekly", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    
    // Get dates for the last 7 days
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    
    // Get all completed tasks for the week
    const weeklyTasks = await storage.getCompletedTasksForTimePeriod(userId, weekAgo, today);
    
    // Create an array for the past 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyStats = [];
    
    // Count completions by day
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      
      const dayOfWeek = days[date.getDay()];
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      // Count tasks completed on this day
      const tasksThisDay = weeklyTasks.filter(task => {
        const taskDate = new Date(task.completedAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      }).length;
      
      weeklyStats.push({
        day: dayOfWeek,
        count: tasksThisDay
      });
    }
    
    res.json(weeklyStats);
  });

  // Top completed tasks
  app.get("/api/stats/top-tasks", async (req: Request, res: Response) => {
    // For demo, use the demo user (id=1)
    const userId = 1;
    
    const completedTasks = await storage.getCompletedTasks(userId);
    
    // Count occurrences of each task
    const taskCounts: Record<number, number> = {};
    completedTasks.forEach(task => {
      taskCounts[task.taskId] = (taskCounts[task.taskId] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const sortedTasks = Object.entries(taskCounts)
      .map(([taskId, count]) => ({ taskId: parseInt(taskId), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Get top 3
    
    // Fetch task details
    const topTasks = await Promise.all(
      sortedTasks.map(async ({ taskId, count }) => {
        const task = await storage.getTask(taskId);
        return {
          task,
          count
        };
      })
    );
    
    res.json(topTasks);
  });

  const httpServer = createServer(app);
  return httpServer;
}

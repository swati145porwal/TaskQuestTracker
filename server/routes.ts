import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertTaskSchema, 
  insertRewardSchema, 
  insertRedeemedRewardSchema,
  insertCompletedTaskSchema,
  insertTaskProofSchema
} from "@shared/schema";
import { createOAuth2Client, getAuthUrl, getTokens, getUserInfo } from "./services/google-auth";
import { getCalendarEvents, convertEventsToTasks } from "./services/google-calendar";

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "You must be logged in to access this resource" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // User routes - now handled by auth.ts

  // Task routes
  app.get("/api/tasks", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  });

  app.post("/api/tasks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      
      const taskData = { ...req.body, userId };
      const parsedTask = insertTaskSchema.parse(taskData);
      
      const newTask = await storage.createTask(parsedTask);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      // Ensure user owns this task
      if (task.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to complete this task" });
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

  app.delete("/api/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      
      // Ensure user owns this task
      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      if (task.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to delete this task" });
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
  app.get("/api/rewards", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const rewards = await storage.getRewards(userId);
    res.json(rewards);
  });

  app.post("/api/rewards", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      
      const rewardData = { ...req.body, userId };
      const parsedReward = insertRewardSchema.parse(rewardData);
      
      const newReward = await storage.createReward(parsedReward);
      res.status(201).json(newReward);
    } catch (error) {
      res.status(400).json({ error: "Invalid reward data" });
    }
  });

  app.post("/api/rewards/:id/redeem", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const rewardId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      if (isNaN(rewardId)) {
        return res.status(400).json({ error: "Invalid reward ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const reward = await storage.getReward(rewardId);
      
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      // Ensure user owns this reward
      if (reward.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to redeem this reward" });
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

  app.delete("/api/rewards/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const rewardId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      if (isNaN(rewardId)) {
        return res.status(400).json({ error: "Invalid reward ID" });
      }
      
      // Ensure user owns this reward
      const reward = await storage.getReward(rewardId);
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      if (reward.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to delete this reward" });
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
  app.get("/api/redeemed-rewards", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
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
  app.get("/api/completed-tasks", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
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
  app.get("/api/stats", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
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
      longestStreak: 12, // Mocked for now
      totalTasksCompleted: completedTasks.length
    };
    
    res.json(stats);
  });

  // Weekly stats
  app.get("/api/stats/weekly", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    
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
  app.get("/api/stats/top-tasks", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    
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

  // Google Auth routes
  app.get('/api/google/auth', isAuthenticated, (req: Request, res: Response) => {
    const oAuth2Client = createOAuth2Client();
    const authUrl = getAuthUrl(oAuth2Client);
    res.json({ authUrl });
  });

  app.get('/api/google/callback', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect('/auth?error=not_authenticated');
    }

    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.redirect('/auth?error=invalid_code');
    }

    try {
      const oAuth2Client = createOAuth2Client();
      const tokens = await getTokens(oAuth2Client, code);
      
      // Set the credentials on the OAuth2 client
      oAuth2Client.setCredentials(tokens);
      
      // Get user info from Google
      const userInfo = await getUserInfo(oAuth2Client);
      
      // Store refresh token and user info in database
      await storage.updateUserGoogleData(
        req.user.id, 
        tokens.refresh_token || null,
        userInfo.emailAddresses?.[0]?.value || null,
        userInfo.photos?.[0]?.url || null
      );
      
      // Redirect to the calendar import page
      res.redirect('/calendar/import');
    } catch (error) {
      console.error('Error during Google authentication:', error);
      res.redirect('/auth?error=google_auth_failed');
    }
  });

  // Google Calendar import route
  app.get('/api/google/calendar/import', isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await storage.getUser(userId);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(400).json({ error: 'Google account not connected' });
    }
    
    try {
      const oAuth2Client = createOAuth2Client();
      
      // Set the credentials using the refresh token
      oAuth2Client.setCredentials({
        refresh_token: user.googleRefreshToken
      });
      
      // Get calendar events
      const events = await getCalendarEvents(oAuth2Client);
      
      // Convert events to tasks
      const tasks = convertEventsToTasks(events, userId);
      
      // Insert tasks into database
      const createdTasks = await Promise.all(
        tasks.map(task => storage.createTask(task))
      );
      
      res.json({ 
        success: true, 
        message: `Imported ${createdTasks.length} events as tasks`, 
        tasks: createdTasks 
      });
    } catch (error) {
      console.error('Error importing Google Calendar events:', error);
      res.status(500).json({ error: 'Failed to import calendar events' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
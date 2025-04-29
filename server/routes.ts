import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertTaskSchema, 
  insertRewardSchema, 
  insertRedeemedRewardSchema,
  insertCompletedTaskSchema,
  insertTaskProofSchema,
  insertAvatarSchema
} from "@shared/schema";
import { createOAuth2Client, getAuthUrl, getTokens, getUserInfo } from "./services/google-auth";
import { getCalendarEvents, convertEventsToTasks } from "./services/google-calendar";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup file upload middleware
const uploadDir = path.join(process.cwd(), "uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Create upload middleware with file type filtering
const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: function (req, file, cb) {
    // Accept images and audio files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed'));
    }
  }
});

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "You must be logged in to access this resource" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the public directory
  app.use('/avatars', express.static(path.join(process.cwd(), 'public/avatars')));
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
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

  app.put("/api/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
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
      
      if (task.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to update this task" });
      }
      
      // Only allow updating title, description, points, time, date, category, googleEventId
      const { title, description, points, time, date, category, googleEventId } = req.body;
      
      const updatedTask = await storage.updateTask(taskId, {
        title,
        description,
        points,
        time,
        date,
        category,
        googleEventId
      });
      
      res.status(200).json({
        success: true,
        task: updatedTask
      });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
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

  // Task Proof routes
  app.get("/api/task-proofs/:completedTaskId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const completedTaskId = parseInt(req.params.completedTaskId);
      const userId = req.user!.id;
      
      if (isNaN(completedTaskId)) {
        return res.status(400).json({ error: "Invalid completed task ID" });
      }
      
      // Check if the completed task belongs to the user
      const completedTasks = await storage.getCompletedTasks(userId);
      const completedTask = completedTasks.find(task => task.id === completedTaskId);
      
      if (!completedTask) {
        return res.status(403).json({ error: "You don't have permission to access this task's proofs" });
      }
      
      const proofs = await storage.getTaskProofs(completedTaskId);
      res.json(proofs);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve task proofs" });
    }
  });

  // File upload route for task proofs
  app.post("/api/upload", isAuthenticated, upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      // Generate relative URL for the uploaded file
      const fileUrl = `/uploads/${path.basename(req.file.path)}`;
      
      // Determine file type
      const proofType = req.file.mimetype.startsWith('image/') ? 'image' : 'audio';
      
      res.json({
        success: true,
        file: {
          url: fileUrl,
          type: proofType,
          originalName: req.file.originalname,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
  
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Simple security check - only logged in users can access uploads
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  }, (req, res, next) => {
    // Use Express's static file middleware for the uploads directory
    const options = {
      dotfiles: 'deny' as const,
      maxAge: '1d',
      index: false,
    };
    // This only responds to requests that weren't handled by the previous middleware
    res.sendFile(path.join(uploadDir, req.path), options, (err) => {
      if (err) {
        next();
      }
    });
  });

  app.post("/api/task-proofs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { completedTaskId, proofType, proofUrl } = req.body;
      
      if (!completedTaskId || !proofType || !proofUrl) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if the completed task belongs to the user
      const completedTasks = await storage.getCompletedTasks(userId);
      const completedTask = completedTasks.find(task => task.id === completedTaskId);
      
      if (!completedTask) {
        return res.status(403).json({ error: "You don't have permission to add proofs to this task" });
      }
      
      // Validate proof type
      if (proofType !== 'image' && proofType !== 'audio') {
        return res.status(400).json({ error: "Invalid proof type. Must be 'image' or 'audio'" });
      }
      
      const proofData = {
        completedTaskId,
        proofType,
        proofUrl
      };
      
      const parsedProof = insertTaskProofSchema.parse(proofData);
      const newProof = await storage.createTaskProof(parsedProof);
      
      res.status(201).json(newProof);
    } catch (error) {
      res.status(500).json({ error: "Failed to save task proof" });
    }
  });

  app.delete("/api/task-proofs/:proofId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const proofId = parseInt(req.params.proofId);
      const userId = req.user!.id;
      
      if (isNaN(proofId)) {
        return res.status(400).json({ error: "Invalid proof ID" });
      }
      
      // Get all completed tasks for the user
      const completedTasks = await storage.getCompletedTasks(userId);
      
      // Find the proof by checking all proofs from all completed tasks
      let foundProof = null;
      for (const task of completedTasks) {
        const proofs = await storage.getTaskProofs(task.id);
        const proof = proofs.find(p => p.id === proofId);
        if (proof) {
          foundProof = proof;
          break;
        }
      }
      
      if (!foundProof) {
        return res.status(404).json({ error: "Proof not found or doesn't belong to you" });
      }
      
      const deleted = await storage.deleteTaskProof(proofId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Proof not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task proof" });
    }
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

  // Route to serve avatar images directly
  app.get("/api/avatars/:id/image", async (req: Request, res: Response) => {
    try {
      const avatarId = parseInt(req.params.id);
      
      if (isNaN(avatarId)) {
        return res.status(400).json({ error: "Invalid avatar ID" });
      }
      
      // Get the avatar from the database
      const avatar = await storage.getAvatar(avatarId);
      
      if (!avatar) {
        return res.status(404).json({ error: "Avatar not found" });
      }

      // If the image URL starts with /, serve it directly from the public directory
      if (avatar.imageUrl && avatar.imageUrl.startsWith('/')) {
        // Remove the leading / to get the relative path from public
        const imagePath = avatar.imageUrl.substring(1);
        return res.sendFile(path.join(process.cwd(), 'public', imagePath));
      }
      
      // Fallback for external URLs
      res.redirect(avatar.imageUrl);
    } catch (error) {
      console.error("Error serving avatar image:", error);
      res.status(500).json({ error: "Failed to serve avatar image" });
    }
  });

  // Avatar routes
  app.get("/api/avatars", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const avatars = await storage.getAvatars();
      res.json(avatars);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      res.status(500).json({ error: "Failed to fetch avatars" });
    }
  });

  app.get("/api/avatars/unlocked", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get all avatars that the user has unlocked based on their streak
      const avatars = await storage.getAvatars();
      const unlockedAvatars = avatars.filter(avatar => 
        avatar.isDefault || avatar.streakRequired <= user.streak
      );
      
      res.json(unlockedAvatars);
    } catch (error) {
      console.error("Error fetching unlocked avatars:", error);
      res.status(500).json({ error: "Failed to fetch unlocked avatars" });
    }
  });

  app.put("/api/user/avatar", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { avatarId } = req.body;
      
      if (!avatarId || isNaN(Number(avatarId))) {
        return res.status(400).json({ error: "Invalid avatar ID" });
      }
      
      // Verify that the avatar exists
      const avatar = await storage.getAvatar(Number(avatarId));
      if (!avatar) {
        return res.status(404).json({ error: "Avatar not found" });
      }
      
      // Verify that the user has unlocked this avatar
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (!avatar.isDefault && avatar.streakRequired > user.streak) {
        return res.status(403).json({ 
          error: "You haven't unlocked this avatar yet",
          requiredStreak: avatar.streakRequired,
          currentStreak: user.streak
        });
      }
      
      // Update the user's avatar
      const updatedUser = await storage.updateUserAvatar(userId, Number(avatarId));
      
      res.json({ 
        success: true, 
        currentAvatarId: updatedUser?.currentAvatarId 
      });
    } catch (error) {
      console.error("Error updating user avatar:", error);
      res.status(500).json({ error: "Failed to update user avatar" });
    }
  });

  // Admin route for creating avatars (in a real app, this would be protected with admin middleware)
  app.post("/api/avatars", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const avatarData = req.body;
      const parsedAvatar = insertAvatarSchema.parse(avatarData);
      
      const newAvatar = await storage.createAvatar(parsedAvatar);
      res.status(201).json(newAvatar);
    } catch (error) {
      console.error("Error creating avatar:", error);
      res.status(400).json({ error: "Invalid avatar data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
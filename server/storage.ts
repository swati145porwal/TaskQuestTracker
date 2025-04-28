import { 
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  rewards, type Reward, type InsertReward,
  redeemedRewards, type RedeemedReward, type InsertRedeemedReward,
  completedTasks, type CompletedTask, type InsertCompletedTask
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  updateUserStreak(userId: number, streak: number): Promise<User | undefined>;
  
  // Task methods
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskCompletion(taskId: number, isCompleted: boolean): Promise<Task | undefined>;
  deleteTask(taskId: number): Promise<boolean>;
  
  // Reward methods
  getRewards(userId: number): Promise<Reward[]>;
  getReward(id: number): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  deleteReward(rewardId: number): Promise<boolean>;
  
  // Redeemed Reward methods
  getRedeemedRewards(userId: number): Promise<RedeemedReward[]>;
  redeemReward(redeemedReward: InsertRedeemedReward): Promise<RedeemedReward>;
  
  // Completed Task methods
  getCompletedTasks(userId: number): Promise<CompletedTask[]>;
  getCompletedTasksForTimePeriod(userId: number, startDate: Date, endDate: Date): Promise<CompletedTask[]>;
  createCompletedTask(completedTask: InsertCompletedTask): Promise<CompletedTask>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private rewards: Map<number, Reward>;
  private redeemedRewards: Map<number, RedeemedReward>;
  private completedTasks: Map<number, CompletedTask>;
  private currentUserId: number;
  private currentTaskId: number;
  private currentRewardId: number;
  private currentRedeemedRewardId: number;
  private currentCompletedTaskId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.rewards = new Map();
    this.redeemedRewards = new Map();
    this.completedTasks = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentRewardId = 1;
    this.currentRedeemedRewardId = 1;
    this.currentCompletedTaskId = 1;
    
    // Add a demo user and default data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: "demo",
      password: "password",
      points: 750,
      streak: 5
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo tasks
    const demoTasks: InsertTask[] = [
      {
        userId: demoUser.id,
        title: "Morning workout routine",
        description: "30-minute cardio exercise",
        points: 50,
        time: "8:00 AM"
      },
      {
        userId: demoUser.id,
        title: "Meditate for 10 minutes",
        description: "Mindfulness practice",
        points: 30,
        time: "7:15 AM"
      },
      {
        userId: demoUser.id,
        title: "Drink 2 liters of water",
        description: "Stay hydrated throughout the day",
        points: 25,
        time: "All day"
      },
      {
        userId: demoUser.id,
        title: "Read for 30 minutes",
        description: "Personal development book",
        points: 40,
        time: "Evening"
      },
      {
        userId: demoUser.id,
        title: "Take vitamins",
        description: "Daily supplements",
        points: 15,
        time: "8:30 AM"
      }
    ];

    demoTasks.forEach(taskData => {
      const task: Task = {
        ...taskData,
        id: this.currentTaskId++,
        isCompleted: false,
        createdAt: new Date()
      };
      this.tasks.set(task.id, task);
    });

    // Mark some tasks as completed
    this.tasks.get(2)!.isCompleted = true;
    this.tasks.get(5)!.isCompleted = true;

    // Create demo rewards
    const demoRewards: InsertReward[] = [
      {
        userId: demoUser.id,
        title: "Rest Day",
        description: "Skip your workout for one day",
        points: 200,
        icon: "ri-rest-time-line",
        color: "from-accent-500 to-secondary-500"
      },
      {
        userId: demoUser.id,
        title: "Cheat Meal",
        description: "Eat whatever you want for one meal",
        points: 300,
        icon: "ri-restaurant-line",
        color: "from-warning-500 to-secondary-500"
      },
      {
        userId: demoUser.id,
        title: "Movie Night",
        description: "Enjoy a movie with snacks",
        points: 250,
        icon: "ri-movie-line",
        color: "from-success-500 to-primary-500"
      }
    ];

    demoRewards.forEach(rewardData => {
      const reward: Reward = {
        ...rewardData,
        id: this.currentRewardId++
      };
      this.rewards.set(reward.id, reward);
    });

    // Create some redeemed rewards
    const now = new Date();
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const redeemedReward1: RedeemedReward = {
      id: this.currentRedeemedRewardId++,
      userId: demoUser.id,
      rewardId: 2, // Cheat Meal
      redeemedAt: twoDaysAgo
    };

    const redeemedReward2: RedeemedReward = {
      id: this.currentRedeemedRewardId++,
      userId: demoUser.id,
      rewardId: 1, // Rest Day
      redeemedAt: oneWeekAgo
    };

    this.redeemedRewards.set(redeemedReward1.id, redeemedReward1);
    this.redeemedRewards.set(redeemedReward2.id, redeemedReward2);

    // Add some completed tasks
    const completedTask1: CompletedTask = {
      id: this.currentCompletedTaskId++,
      userId: demoUser.id,
      taskId: 2,
      completedAt: new Date(),
      pointsEarned: 30
    };

    const completedTask2: CompletedTask = {
      id: this.currentCompletedTaskId++,
      userId: demoUser.id,
      taskId: 5,
      completedAt: new Date(),
      pointsEarned: 15
    };

    this.completedTasks.set(completedTask1.id, completedTask1);
    this.completedTasks.set(completedTask2.id, completedTask2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, points: 0, streak: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.points = points;
    this.users.set(userId, user);
    return user;
  }

  async updateUserStreak(userId: number, streak: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.streak = streak;
    this.users.set(userId, user);
    return user;
  }

  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask, 
      id, 
      isCompleted: false,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTaskCompletion(taskId: number, isCompleted: boolean): Promise<Task | undefined> {
    const task = await this.getTask(taskId);
    if (!task) return undefined;
    
    task.isCompleted = isCompleted;
    this.tasks.set(taskId, task);
    return task;
  }

  async deleteTask(taskId: number): Promise<boolean> {
    return this.tasks.delete(taskId);
  }

  // Reward methods
  async getRewards(userId: number): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(reward => reward.userId === userId);
  }

  async getReward(id: number): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = this.currentRewardId++;
    const reward: Reward = { ...insertReward, id };
    this.rewards.set(id, reward);
    return reward;
  }

  async deleteReward(rewardId: number): Promise<boolean> {
    return this.rewards.delete(rewardId);
  }

  // Redeemed Reward methods
  async getRedeemedRewards(userId: number): Promise<RedeemedReward[]> {
    return Array.from(this.redeemedRewards.values())
      .filter(redeemedReward => redeemedReward.userId === userId)
      .sort((a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime());
  }

  async redeemReward(insertRedeemedReward: InsertRedeemedReward): Promise<RedeemedReward> {
    const id = this.currentRedeemedRewardId++;
    const redeemedReward: RedeemedReward = { 
      ...insertRedeemedReward, 
      id, 
      redeemedAt: new Date()
    };
    this.redeemedRewards.set(id, redeemedReward);
    return redeemedReward;
  }

  // Completed Task methods
  async getCompletedTasks(userId: number): Promise<CompletedTask[]> {
    return Array.from(this.completedTasks.values())
      .filter(completedTask => completedTask.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getCompletedTasksForTimePeriod(userId: number, startDate: Date, endDate: Date): Promise<CompletedTask[]> {
    return (await this.getCompletedTasks(userId))
      .filter(task => {
        const completedAt = task.completedAt;
        return completedAt >= startDate && completedAt <= endDate;
      });
  }

  async createCompletedTask(insertCompletedTask: InsertCompletedTask): Promise<CompletedTask> {
    const id = this.currentCompletedTaskId++;
    const completedTask: CompletedTask = { 
      ...insertCompletedTask, 
      id, 
      completedAt: new Date()
    };
    this.completedTasks.set(id, completedTask);
    return completedTask;
  }
}

export const storage = new MemStorage();

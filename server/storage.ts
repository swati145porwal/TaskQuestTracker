import { 
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  rewards, type Reward, type InsertReward,
  redeemedRewards, type RedeemedReward, type InsertRedeemedReward,
  completedTasks, type CompletedTask, type InsertCompletedTask
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, between } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  updateUserStreak(userId: number, streak: number): Promise<User | undefined>;
  updateUserGoogleData(userId: number, refreshToken: string | null, email: string | null, pictureUrl: string | null): Promise<User | undefined>;
  
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

  // Session store
  sessionStore: any; // Type as 'any' to avoid import issues
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ points })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserStreak(userId: number, streak: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ streak })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserGoogleData(userId: number, refreshToken: string | null, email: string | null, pictureUrl: string | null): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ 
        googleRefreshToken: refreshToken,
        googleEmail: email,
        googlePictureUrl: pictureUrl 
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values({
      ...insertTask,
      time: insertTask.time || null,
      date: insertTask.date || null,
      description: insertTask.description || null
    }).returning();
    return result[0];
  }

  async updateTaskCompletion(taskId: number, isCompleted: boolean): Promise<Task | undefined> {
    const result = await db
      .update(tasks)
      .set({ isCompleted })
      .where(eq(tasks.id, taskId))
      .returning();
    return result[0];
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();
    return result.length > 0;
  }

  // Reward methods
  async getRewards(userId: number): Promise<Reward[]> {
    return db.select().from(rewards).where(eq(rewards.userId, userId));
  }

  async getReward(id: number): Promise<Reward | undefined> {
    const result = await db.select().from(rewards).where(eq(rewards.id, id));
    return result[0];
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const result = await db.insert(rewards).values({
      ...insertReward,
      description: insertReward.description || null
    }).returning();
    return result[0];
  }

  async deleteReward(rewardId: number): Promise<boolean> {
    const result = await db.delete(rewards).where(eq(rewards.id, rewardId)).returning();
    return result.length > 0;
  }

  // Redeemed Reward methods
  async getRedeemedRewards(userId: number): Promise<RedeemedReward[]> {
    return db
      .select()
      .from(redeemedRewards)
      .where(eq(redeemedRewards.userId, userId))
      .orderBy(desc(redeemedRewards.redeemedAt));
  }

  async redeemReward(insertRedeemedReward: InsertRedeemedReward): Promise<RedeemedReward> {
    const result = await db.insert(redeemedRewards).values(insertRedeemedReward).returning();
    return result[0];
  }

  // Completed Task methods
  async getCompletedTasks(userId: number): Promise<CompletedTask[]> {
    return db
      .select()
      .from(completedTasks)
      .where(eq(completedTasks.userId, userId))
      .orderBy(desc(completedTasks.completedAt));
  }

  async getCompletedTasksForTimePeriod(userId: number, startDate: Date, endDate: Date): Promise<CompletedTask[]> {
    return db
      .select()
      .from(completedTasks)
      .where(
        and(
          eq(completedTasks.userId, userId),
          between(completedTasks.completedAt, startDate, endDate)
        )
      );
  }

  async createCompletedTask(insertCompletedTask: InsertCompletedTask): Promise<CompletedTask> {
    const result = await db.insert(completedTasks).values(insertCompletedTask).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
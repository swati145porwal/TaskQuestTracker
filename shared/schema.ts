import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Avatars available in the system
export const avatars = pgTable("avatars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  streakRequired: integer("streak_required").notNull().default(0),
  isDefault: boolean("is_default").notNull().default(false),
  description: text("description"),
  category: text("category"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  currentAvatarId: integer("current_avatar_id"), // Reference to the avatar being used
  googleRefreshToken: text("google_refresh_token"),
  googleEmail: text("google_email"),
  googlePictureUrl: text("google_picture_url"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  priority: text("priority").default("medium"), // Options: "high", "medium", "low"
  time: text("time"),
  date: text("date"),
  category: text("category"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  googleEventId: text("google_event_id"),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const redeemedRewards = pgTable("redeemed_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
});

export const completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  pointsEarned: integer("points_earned").notNull(),
});

export const taskProofs = pgTable("task_proofs", {
  id: serial("id").primaryKey(),
  completedTaskId: integer("completed_task_id").notNull(),
  proofType: text("proof_type").notNull(), // "image" or "audio"
  proofUrl: text("proof_url").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Insert schemas
export const insertAvatarSchema = createInsertSchema(avatars).pick({
  name: true,
  imageUrl: true,
  streakRequired: true,
  isDefault: true,
  description: true,
  category: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  currentAvatarId: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  points: true,
  priority: true,
  time: true,
  date: true,
  category: true,
  googleEventId: true,
});

export const insertRewardSchema = createInsertSchema(rewards).pick({
  userId: true,
  title: true,
  description: true,
  points: true,
  icon: true,
  color: true,
});

export const insertRedeemedRewardSchema = createInsertSchema(redeemedRewards).pick({
  userId: true,
  rewardId: true,
});

export const insertCompletedTaskSchema = createInsertSchema(completedTasks).pick({
  userId: true,
  taskId: true,
  pointsEarned: true,
});

export const insertTaskProofSchema = createInsertSchema(taskProofs).pick({
  completedTaskId: true,
  proofType: true,
  proofUrl: true,
});

// Types
export type InsertAvatar = z.infer<typeof insertAvatarSchema>;
export type Avatar = typeof avatars.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;

export type InsertRedeemedReward = z.infer<typeof insertRedeemedRewardSchema>;
export type RedeemedReward = typeof redeemedRewards.$inferSelect;

export type InsertCompletedTask = z.infer<typeof insertCompletedTaskSchema>;
export type CompletedTask = typeof completedTasks.$inferSelect;

export type InsertTaskProof = z.infer<typeof insertTaskProofSchema>;
export type TaskProof = typeof taskProofs.$inferSelect;

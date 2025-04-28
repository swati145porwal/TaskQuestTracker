import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to relative time (e.g., "2 days ago")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Calculate progress percentage
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Generate random colors for rewards
export const gradientColors = [
  "from-primary-500 to-accent-500",
  "from-accent-500 to-secondary-500",
  "from-secondary-500 to-primary-500",
  "from-warning-500 to-secondary-500",
  "from-success-500 to-primary-500",
  "from-primary-600 to-warning-500",
  "from-accent-500 to-success-500"
];

// Get random gradient color
export function getRandomGradient(): string {
  const randomIndex = Math.floor(Math.random() * gradientColors.length);
  return gradientColors[randomIndex];
}

// Default reward icons
export const rewardIcons = [
  "ri-rest-time-line",
  "ri-restaurant-line",
  "ri-movie-line",
  "ri-game-line",
  "ri-shopping-bag-line",
  "ri-cup-line",
  "ri-headphone-line",
  "ri-music-line",
  "ri-book-line",
  "ri-tv-line"
];

// Get random icon
export function getRandomIcon(): string {
  const randomIndex = Math.floor(Math.random() * rewardIcons.length);
  return rewardIcons[randomIndex];
}

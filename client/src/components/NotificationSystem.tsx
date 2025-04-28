import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';
import { Task } from '@shared/schema';
import { useTaskContext } from '@/context/TaskContext';

interface Reminder {
  id: number;
  taskId: number;
  taskTitle: string;
  time: Date;
  triggered: boolean;
}

export default function NotificationSystem() {
  const { tasks } = useTaskContext();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  
  // Ask for notification permission when component mounts
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionGranted(permission === 'granted');
      }
    };
    
    checkNotificationPermission();
  }, []);
  
  // Generate reminders based on tasks
  useEffect(() => {
    if (!tasks.length) return;
    
    // Clear previous reminders
    setReminders([]);
    
    // Create a reminder for each task
    const newReminders: Reminder[] = [];
    
    tasks.forEach(task => {
      if (task.isCompleted) return;
      
      // Get current time and add 10 minutes (in a real app, this would be based on task due date)
      const reminderTime = new Date();
      reminderTime.setMinutes(reminderTime.getMinutes() + 10);
      
      newReminders.push({
        id: Math.floor(Math.random() * 1000000),
        taskId: task.id,
        taskTitle: task.title,
        time: reminderTime,
        triggered: false,
      });
    });
    
    setReminders(newReminders);
  }, [tasks]);
  
  // Check for reminders that need to be triggered
  useEffect(() => {
    if (!reminders.length || !permissionGranted) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      
      const updatedReminders = reminders.map(reminder => {
        // If reminder is already triggered or not yet due, skip it
        if (reminder.triggered || reminder.time > now) {
          return reminder;
        }
        
        // Trigger notification
        showNotification(reminder.taskTitle);
        
        // Show toast notification
        toast({
          title: "Task Reminder",
          description: `Don't forget to complete: ${reminder.taskTitle}`,
          variant: "default",
        });
        
        // Mark reminder as triggered
        return { ...reminder, triggered: true };
      });
      
      setReminders(updatedReminders);
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [reminders, permissionGranted]);
  
  const showNotification = (taskTitle: string) => {
    if (!('Notification' in window) || !permissionGranted) return;
    
    try {
      new Notification('Task Reminder', {
        body: `Don't forget to complete: ${taskTitle}`,
        icon: '/favicon.ico', // Use app favicon as notification icon
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };
  
  // This component doesn't render anything visible
  return null;
}
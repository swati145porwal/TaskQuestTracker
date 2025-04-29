import { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Flame, Check, Star, User, Plus, X, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { user, tasks, openAddTaskModal } = useTaskContext();
  const { logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const [viewedNotifications, setViewedNotifications] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };
  
  // Generate notifications based on streak and completed tasks
  const generateNotifications = () => {
    const notifications = [];
    
    // Streak notification
    if (user?.streak) {
      notifications.push({
        id: 'streak',
        title: `${user.streak} Day Streak!`,
        content: user.streak >= 7 
          ? "Amazing consistency! Keep it up!" 
          : "You're building a great habit!",
        icon: <Flame className="h-5 w-5 text-accent" />,
        time: 'Today'
      });
    }
    
    // Points milestone
    if (user?.points) {
      if (user.points >= 500) {
        notifications.push({
          id: 'points-500',
          title: 'Points Milestone!',
          content: "You've reached 500 points! Check out premium rewards.",
          icon: <Star className="h-5 w-5 text-yellow-500" />,
          time: 'Today'
        });
      }
    }
    
    // Tasks completion
    const completedTasks = tasks?.filter(t => t.isCompleted) || [];
    if (completedTasks.length > 0) {
      notifications.push({
        id: 'tasks-completed',
        title: `${completedTasks.length} Tasks Completed`,
        content: "Great job completing your tasks today!",
        icon: <Check className="h-5 w-5 text-success" />,
        time: '2h ago'
      });
    }
    
    // Add task reminder if few tasks
    if ((tasks?.length || 0) < 3) {
      notifications.push({
        id: 'add-tasks',
        title: 'Add More Tasks',
        content: "Plan your day by adding more tasks to complete.",
        icon: <Plus className="h-5 w-5 text-primary" />,
        time: 'Now',
        action: () => openAddTaskModal()
      });
    }
    
    return notifications;
  };
  
  const notifications = generateNotifications();
  
  // Reset viewedNotifications when the notifications change (e.g., when a new task is completed)
  useEffect(() => {
    if (notifications.length > 0) {
      setViewedNotifications(false);
    }
  }, [notifications.length, tasks]);
  

  
  return (
    <header className="glass-effect sticky top-0 z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg shadow-lg mr-3 hover-card">
                <i className="ri-gamepad-line text-white text-xl"></i>
              </div>
              <h1 className="text-xl font-bold font-outfit text-gradient">
                {title || "TaskQuest"}
              </h1>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Add Task Button */}
          <motion.button 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-primary/30 transition-all w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-1.5 md:gap-1.5"
            onClick={openAddTaskModal}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline text-sm font-medium">New Task</span>
          </motion.button>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <Popover onOpenChange={(open) => {
            if (open) {
              // When popover opens, mark notifications as viewed
              setViewedNotifications(true);
            }
          }}>
            <PopoverTrigger asChild>
              <motion.button 
                className="relative p-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5 text-primary" />
                {notifications.length > 0 && !viewedNotifications && (
                  <motion.div 
                    className="absolute -top-2 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {notifications.length}
                  </motion.div>
                )}
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-lg">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 font-outfit font-semibold text-gray-700 flex justify-between items-center">
                <span>Notifications ({notifications.length})</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={() => setViewedNotifications(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No notifications</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div 
                        key={notification.id}
                        className="border-b border-gray-100 last:border-0 p-3 hover:bg-gray-50 cursor-pointer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onClick={notification.action}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-gradient-to-r from-primary/20 to-secondary/20 p-2 rounded-full mr-3">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div 
                className="relative cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 w-10 h-10 flex items-center justify-center shadow-md border border-white/50">
                  {user?.username ? (
                    <span className="text-primary font-medium">{user.username[0]}</span>
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                {user?.streak && user.streak > 0 && (
                  <motion.div 
                    className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {user.streak}
                  </motion.div>
                )}
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.username ? `Hi, ${user.username}` : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/stats">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Stats</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

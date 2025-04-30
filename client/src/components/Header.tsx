import { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { useAuth } from "@/hooks/use-auth";
import { useGuest } from "@/context/GuestContext";
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
  const { isGuestMode, guestUser, disableGuestMode } = useGuest();
  const [, navigate] = useLocation();
  const [viewedNotifications, setViewedNotifications] = useState(true);
  
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
    
    // Guest mode notification
    if (isGuestMode) {
      notifications.push({
        id: 'guest-mode',
        title: 'Guest Mode Active',
        content: "Your data won't be saved. Sign in to save your progress.",
        icon: <User className="h-5 w-5 text-yellow-500" />,
        time: 'Now',
        action: () => {
          disableGuestMode();
          navigate('/auth');
        }
      });
      
      // Add task reminder for guest users too
      if ((tasks?.length || 0) < 3) {
        notifications.push({
          id: 'add-tasks',
          title: 'Add Your First Tasks',
          content: "Try creating some tasks to see how the app works.",
          icon: <Plus className="h-5 w-5 text-primary" />,
          time: 'Now',
          action: () => openAddTaskModal()
        });
      }
      
      return notifications;
    }
    
    // Regular user notifications
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
  
  // Display notifications only when needed
  // We'll avoid resetting the viewed status too frequently to prevent notifications
  // from constantly reappearing
  useEffect(() => {
    // Only change viewed status when new notifications appear or after explicit user actions
    if (viewedNotifications && notifications.length > 0 && 
        // Only show new notifications after task changes
        (tasks?.some(t => t.isCompleted) || false)) {
      setViewedNotifications(false);
    }
  }, [tasks]);
  

  
  return (
    <header className="glass-effect sticky top-0 z-20 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="bg-primary text-white p-1.5 rounded-md mr-2.5">
                <i className="ri-gamepad-line text-white text-lg"></i>
              </div>
              <h1 className="text-lg font-semibold font-outfit text-foreground">
                {title || "TaskQuest"}
              </h1>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Add Task Button */}
          <motion.button 
            className="bg-primary hover:bg-primary/90 text-white rounded-md flex items-center justify-center shadow-sm transition-all w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 md:gap-1.5"
            onClick={openAddTaskModal}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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
                className="relative p-2 rounded-md bg-muted/80 hover:bg-muted transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                {notifications.length > 0 && !viewedNotifications && (
                  <div 
                    className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {notifications.length}
                  </div>
                )}
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-sm">
              <div className="bg-muted p-3 font-outfit text-sm text-foreground flex justify-between items-center border-b">
                <span>Notifications ({notifications.length})</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setViewedNotifications(true)}
                >
                  <X className="h-3 w-3" />
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
                      <div 
                        key={notification.id}
                        className="border-b border-muted p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={notification.action}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-background p-1.5 rounded-md mr-2 border">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`rounded-md w-9 h-9 flex items-center justify-center border ${isGuestMode ? 'bg-yellow-100 dark:bg-yellow-950/50' : 'bg-muted/80'}`}>
                  {isGuestMode ? (
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">G</span>
                  ) : user?.username ? (
                    <span className="text-foreground font-medium">{user.username[0]}</span>
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {/* Show only the streak badge if it's significant and not in guest mode */}
                {!isGuestMode && user?.streak && user.streak >= 3 && (
                  <div 
                    className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {user.streak}
                  </div>
                )}
                
                {/* Show guest mode indicator */}
                {isGuestMode && (
                  <div 
                    className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    !
                  </div>
                )}
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex justify-between items-center">
                {isGuestMode ? (
                  <>
                    <span>Guest Mode</span>
                    <div className="px-1.5 py-0.5 text-[10px] rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      Limited
                    </div>
                  </>
                ) : user?.username ? (
                  `Hi, ${user.username}`
                ) : (
                  'My Account'
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {isGuestMode && (
                <>
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    Your data won't be saved between sessions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-blue-600 dark:text-blue-400"
                    onClick={() => {
                      disableGuestMode();
                      navigate('/auth');
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign In/Register</span>
                  </DropdownMenuItem>
                </>
              )}
              
              {!isGuestMode && (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

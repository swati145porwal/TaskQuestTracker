import { useEffect } from "react";
import { motion } from "framer-motion";
import UserProfile from "@/components/UserProfile";
import { useTaskContext } from "@/context/TaskContext";

export default function ProfilePage() {
  const { setActiveTab } = useTaskContext();
  
  useEffect(() => {
    // Update active tab when component mounts
    setActiveTab("profile");
  }, [setActiveTab]);

  return (
    <div className="container max-w-4xl pb-20">
      <motion.div 
        className="mb-6 pt-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Your Profile
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          View your progress, achievements, and customize your avatar
        </p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <UserProfile />
      </motion.div>
    </div>
  );
}
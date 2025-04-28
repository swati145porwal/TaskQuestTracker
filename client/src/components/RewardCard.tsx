import { useState } from "react";
import { Reward } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Gift, Lock, Sparkles, Trash2, Trophy, Award, Star, Coffee, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface RewardCardProps {
  reward: Reward;
}

export default function RewardCard({ reward }: RewardCardProps) {
  const { user, redeemReward, deleteReward } = useTaskContext();
  const [isHovered, setIsHovered] = useState(false);
  
  const hasEnoughPoints = user && user.points >= reward.points;
  const progressPercentage = user && reward.points > 0 ? Math.min((user.points / reward.points) * 100, 100) : 0;
  const remainingPoints = user ? Math.max(reward.points - user.points, 0) : reward.points;
  
  // Get icon based on reward title or description
  const getRewardIcon = () => {
    const title = reward.title.toLowerCase();
    const desc = reward.description?.toLowerCase() || '';
    
    if (title.includes('rest') || desc.includes('rest')) {
      return <Coffee className="h-8 w-8 text-white" />;
    } else if (title.includes('movie') || desc.includes('movie') || title.includes('show') || desc.includes('show')) {
      return <Star className="h-8 w-8 text-white" />;
    } else if (title.includes('cheat') || desc.includes('cheat') || title.includes('meal') || desc.includes('meal')) {
      return <Trophy className="h-8 w-8 text-white" />;
    } else if (title.includes('break') || desc.includes('break') || title.includes('time') || desc.includes('time')) {
      return <Clock className="h-8 w-8 text-white" />;
    }
    
    return <Award className="h-8 w-8 text-white" />;
  };
  
  // Get card colors based on reward points
  const getCardColors = () => {
    if (reward.points < 100) {
      return "from-blue-400 to-blue-600";
    } else if (reward.points < 300) {
      return "from-purple-400 to-indigo-600";
    } else if (reward.points < 500) {
      return "from-pink-400 to-rose-600";
    } else {
      return "from-amber-400 to-orange-600";
    }
  };
  
  const colors = reward.color || getCardColors();
  
  return (
    <motion.div 
      className="hover-card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Reward Header with Icon */}
      <div className={`relative h-32 bg-gradient-to-tr ${colors} flex items-center justify-center overflow-hidden`}>
        {/* Abstract background shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-black/10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-black/10 translate-x-1/3 translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4" />
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="h-full w-1/2 bg-white/20 -skew-x-[45deg] transform opacity-30"
            style={{
              animation: "shimmer 3s infinite linear",
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        </div>
        
        {/* Icon container */}
        <motion.div 
          className="bg-white/20 p-5 rounded-full backdrop-blur-sm shadow-lg relative z-10"
          animate={isHovered ? {
            scale: [1, 1.1, 1.05],
            transition: { duration: 0.5, repeat: 0, repeatType: "reverse" }
          } : {}}
        >
          {reward.icon ? (
            <i className={`${reward.icon} text-white text-4xl`}></i>
          ) : (
            getRewardIcon()
          )}
        </motion.div>
        
        {/* Points badge */}
        <div className="absolute top-3 right-3 bg-white/90 text-sm font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-gradient">{reward.points}</span>
        </div>
        
        {/* Locked overlay */}
        {!hasEnoughPoints && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-black/40 p-2 rounded-full">
              <Lock className="h-6 w-6 text-white/90" />
            </div>
          </div>
        )}
      </div>
      
      {/* Reward Content */}
      <div className="p-5">
        <h3 className="text-gray-800 font-outfit font-semibold text-lg mb-1">{reward.title}</h3>
        <p className="text-gray-500 text-sm">{reward.description}</p>
        
        {/* Points Progress */}
        <div className="mt-4">
          {!hasEnoughPoints ? (
            <>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <span className="text-primary font-medium">Your points: {user?.points || 0}</span>
                <span className="text-gray-500">
                  Need <span className="text-accent font-medium">{remainingPoints}</span> more
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full progress-fill rounded-full relative"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-1/4 bg-white/20 -skew-x-[45deg] transform opacity-50" />
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <div className="flex items-center py-2 px-3 bg-success/10 text-success rounded-lg text-sm mb-2">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>You have enough points to redeem this reward!</span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex justify-between items-center">
          <Button 
            variant={hasEnoughPoints ? "default" : "outline"}
            size="sm"
            className={
              hasEnoughPoints 
                ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md gap-1.5 px-5 py-2" 
                : "text-gray-400 border-gray-200 gap-1.5"
            }
            onClick={() => hasEnoughPoints && redeemReward(reward.id)}
            disabled={!hasEnoughPoints}
          >
            {hasEnoughPoints ? <Sparkles className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
            {hasEnoughPoints ? "Redeem Now" : "Not Enough Points"}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-destructive hover:bg-destructive/10 p-2 rounded-full bg-white/75 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl text-gradient font-bold">Delete Reward</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{reward.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-3">
                  <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/10 text-sm">
                    <p className="text-gray-600 mb-2">
                      This reward will be permanently removed from your rewards list.
                    </p>
                    {hasEnoughPoints && (
                      <div className="text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-100">
                        <Trophy className="h-3.5 w-3.5 inline-block mr-1" /> 
                        You have enough points to redeem this reward. Consider redeeming it before deleting.
                      </div>
                    )}
                  </div>
                </div>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="hover:bg-gray-100">Cancel</AlertDialogCancel>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <AlertDialogAction 
                      onClick={() => deleteReward(reward.id)} 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Reward
                    </AlertDialogAction>
                  </motion.div>
                </AlertDialogFooter>
              </motion.div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}

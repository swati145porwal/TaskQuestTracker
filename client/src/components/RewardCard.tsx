import { Reward } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Trash2 } from "lucide-react";

interface RewardCardProps {
  reward: Reward;
}

export default function RewardCard({ reward }: RewardCardProps) {
  const { user, redeemReward, deleteReward } = useTaskContext();
  
  const hasEnoughPoints = user && user.points >= reward.points;
  const progressPercentage = user && reward.points > 0 ? Math.min((user.points / reward.points) * 100, 100) : 0;
  
  return (
    <div className="reward-card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      {/* Reward Header with Icon */}
      <div className={`relative h-28 bg-gradient-to-tr ${reward.color} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-black/10 translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
          <i className={`${reward.icon} text-white text-4xl`}></i>
        </div>
      </div>
      
      {/* Reward Content */}
      <div className="p-5">
        <h3 className="text-gray-800 font-outfit font-semibold text-lg">{reward.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{reward.description}</p>
        
        {/* Points Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1 rounded-full shadow-sm">
              <i className="ri-coin-line text-primary mr-1.5"></i>
              <span className="text-gradient font-bold">{reward.points}</span>
            </div>
            
            {!hasEnoughPoints && (
              <span className="text-xs text-gray-500 font-medium">
                {user?.points || 0}/{reward.points} points
              </span>
            )}
          </div>
          
          {/* Show progress bar if they don't have enough points */}
          {!hasEnoughPoints && (
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary/60 to-secondary/60"
                style={{ width: `${progressPercentage}%` }}
              ></div>
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
                ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md gap-1.5" 
                : "text-gray-400 border-gray-200 gap-1.5"
            }
            onClick={() => hasEnoughPoints && redeemReward(reward.id)}
            disabled={!hasEnoughPoints}
          >
            {hasEnoughPoints ? <Sparkles className="h-3.5 w-3.5" /> : <Gift className="h-3.5 w-3.5" />}
            {hasEnoughPoints ? "Redeem Now" : "Not Enough Points"}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-destructive hover:bg-destructive/10 p-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Reward</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this reward? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteReward(reward.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

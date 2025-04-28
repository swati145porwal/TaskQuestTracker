import { Reward } from "@shared/schema";
import { useTaskContext } from "@/context/TaskContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface RewardCardProps {
  reward: Reward;
}

export default function RewardCard({ reward }: RewardCardProps) {
  const { user, redeemReward, deleteReward } = useTaskContext();
  
  const hasEnoughPoints = user && user.points >= reward.points;
  
  return (
    <div className="reward-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className={`h-24 bg-gradient-to-r ${reward.color} flex items-center justify-center`}>
        <i className={`${reward.icon} text-white text-4xl`}></i>
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg">{reward.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{reward.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center bg-primary-50 px-2 py-1 rounded-full">
            <i className="ri-coin-line text-primary-500 mr-1"></i>
            <span className="text-primary-600 font-medium text-sm">{reward.points} points</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className={hasEnoughPoints ? "text-primary-500 hover:text-primary-600" : "text-gray-400 cursor-not-allowed"}
              onClick={() => hasEnoughPoints && redeemReward(reward.id)}
              disabled={!hasEnoughPoints}
            >
              Redeem
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
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
                  <AlertDialogAction onClick={() => deleteReward(reward.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

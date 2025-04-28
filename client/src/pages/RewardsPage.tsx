import { Link } from "wouter";
import { useTaskContext } from "@/context/TaskContext";
import RewardCard from "@/components/RewardCard";
import AddRewardModal from "@/components/AddRewardModal";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function RewardsPage() {
  const { rewards, redeemedRewards, openAddRewardModal } = useTaskContext();
  
  return (
    <div className="animate-fadeIn">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <Link href="/">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            Tasks
          </a>
        </Link>
        <Link href="/rewards">
          <a className="text-primary-500 border-b-2 border-primary-500 px-4 py-2 font-medium text-sm font-outfit">
            Rewards
          </a>
        </Link>
        <Link href="/stats">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            Stats
          </a>
        </Link>
        <Link href="/history">
          <a className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium text-sm font-outfit">
            History
          </a>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 font-outfit">Available Rewards</h2>
          <button 
            className="text-sm text-primary-500 font-medium flex items-center hover:text-primary-600"
            onClick={openAddRewardModal}
          >
            <i className="ri-add-circle-line mr-1"></i>
            Add Reward
          </button>
        </div>
        
        {rewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map(reward => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-2">
              <i className="ri-gift-line text-3xl"></i>
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No rewards yet</h3>
            <p className="text-gray-500 text-sm mb-3">Create rewards to motivate yourself</p>
            <Button onClick={openAddRewardModal} size="sm">Add Reward</Button>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-800 font-outfit mb-4">Redeemed Rewards</h2>
        
        {redeemedRewards.length > 0 ? (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            {redeemedRewards.map((redeemedReward, index) => (
              <div key={redeemedReward.id} className={`flex items-center justify-between ${index !== redeemedRewards.length - 1 ? 'border-b border-gray-100 pb-4 mb-4' : ''}`}>
                <div>
                  <h3 className="text-gray-800 font-medium">{redeemedReward.reward?.title}</h3>
                  <span className="text-gray-500 text-sm">Redeemed {formatRelativeTime(redeemedReward.redeemedAt)}</span>
                </div>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                  <i className="ri-coin-line text-gray-500 mr-1"></i>
                  <span className="text-gray-600 font-medium text-sm">{redeemedReward.reward?.points} points</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-2">
              <i className="ri-history-line text-3xl"></i>
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No redeemed rewards</h3>
            <p className="text-gray-500 text-sm">Your redemption history will appear here</p>
          </div>
        )}
      </div>
      
      <AddRewardModal />
    </div>
  );
}

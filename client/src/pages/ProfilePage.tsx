import { useEffect } from "react";
import Header from "@/components/Header";
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
      <Header title="Your Profile" />
      <div className="flex flex-col items-center py-6">
        <UserProfile />
      </div>
    </div>
  );
}
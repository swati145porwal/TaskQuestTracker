import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Trophy, 
  Award, 
  Star, 
  Flame,
  Calendar,
  Edit
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AvatarSelector from "./AvatarSelector";
import { useTaskContext } from "@/context/TaskContext";

export default function UserProfile() {
  const { user } = useAuth();
  const { refreshData } = useTaskContext();
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  if (!user) {
    return null;
  }

  // Handle opening the avatar selector
  const handleOpenAvatarSelector = () => {
    setIsAvatarSelectorOpen(true);
  };

  // Function to get avatar URL or placeholder
  const getAvatarUrl = () => {
    // If user has Google profile picture, use that
    if (user.googlePictureUrl) {
      return user.googlePictureUrl;
    }
    
    // Otherwise, use avatar from our system or a placeholder
    return "/avatars/default1.png";
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleOpenAvatarSelector}
              title="Change Avatar"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={getAvatarUrl()} alt={user.username} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center text-2xl">{user.username}</CardTitle>
            <CardDescription className="text-center flex items-center justify-center gap-1 mt-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              {user.points} Points
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">Current Streak</span>
              </div>
              <span className="text-2xl font-bold">{user.streak} days</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Achievement</span>
              </div>
              {user.streak >= 30 ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Power User
                </Badge>
              ) : user.streak >= 7 ? (
                <Badge variant="secondary">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Regular
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Beginner
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Avatar Milestones
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>3 Day Streak</span>
                <Badge variant={user.streak >= 3 ? "default" : "outline"}>
                  {user.streak >= 3 ? "Unlocked" : `${user.streak}/3`}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>7 Day Streak</span>
                <Badge variant={user.streak >= 7 ? "default" : "outline"}>
                  {user.streak >= 7 ? "Unlocked" : `${user.streak}/7`}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>14 Day Streak</span>
                <Badge variant={user.streak >= 14 ? "default" : "outline"}>
                  {user.streak >= 14 ? "Unlocked" : `${user.streak}/14`}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>30 Day Streak</span>
                <Badge variant={user.streak >= 30 ? "default" : "outline"}>
                  {user.streak >= 30 ? "Unlocked" : `${user.streak}/30`}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => refreshData()}>
            Refresh Stats
          </Button>
        </CardFooter>
      </Card>

      {/* Avatar Selector Dialog */}
      <AvatarSelector
        open={isAvatarSelectorOpen}
        onOpenChange={setIsAvatarSelectorOpen}
        currentAvatarId={user.currentAvatarId || null}
        userStreak={user.streak}
      />
    </>
  );
}
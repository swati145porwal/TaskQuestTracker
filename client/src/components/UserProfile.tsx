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
  Edit,
  Share2,
  Link
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AvatarSelector from "./AvatarSelector";
import { useTaskContext } from "@/context/TaskContext";
import SocialShareComponent from "./SocialShareComponent";
import SocialConnectComponent from "./SocialConnectComponent";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";

export default function UserProfile() {
  const { user } = useAuth();
  const { refreshData } = useTaskContext();
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState(false);
  const [isSocialConnectOpen, setIsSocialConnectOpen] = useState(false);

  if (!user) {
    return null;
  }

  // Handle opening the avatar selector
  const handleOpenAvatarSelector = () => {
    setIsAvatarSelectorOpen(true);
  };

  // Function to get avatar URL or placeholder
  const getAvatarUrl = (): string | undefined => {
    // If user has Google profile picture and no custom avatar is selected, use Google picture
    if (user.googlePictureUrl && !user.currentAvatarId) {
      return user.googlePictureUrl;
    }
    
    // If user has selected a custom avatar, use that
    if (user.currentAvatarId) {
      return `/api/avatars/${user.currentAvatarId}/image`;
    }
    
    // Fallback to user initial (return undefined)
    return undefined;
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto mt-4 bg-gradient-to-br from-background to-secondary/20 border-primary/10">
        <CardHeader className="relative pb-2">
          <div className="absolute top-4 right-4">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full hover:bg-primary/20 hover:text-primary"
              onClick={handleOpenAvatarSelector}
              title="Change Avatar"
            >
              <Edit className="h-4 w-4 mr-2" />
              Change Avatar
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <Avatar className="h-28 w-28 mb-4 ring-4 ring-background relative">
                <AvatarImage src={getAvatarUrl()} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-primary/50 to-secondary/50 text-white">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center text-2xl font-bold mt-2">{user.username}</CardTitle>
            <CardDescription className="text-center flex items-center justify-center gap-1 mt-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{user.points} Points</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border border-white/10 shadow-sm">
              <div className="flex items-center gap-1 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">Current Streak</span>
              </div>
              {user.streak > 0 ? (
                <span className="text-3xl font-bold text-orange-500 dark:text-orange-400">{user.streak}</span>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-orange-300 dark:text-orange-300">-</span>
                  <span className="text-xs text-orange-400/70 mt-1">Start a streak today!</span>
                </div>
              )}
              {user.streak > 0 && (
                <span className="text-sm mt-1 text-muted-foreground font-medium">
                  {user.streak === 1 ? "day" : "days"}
                </span>
              )}
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border border-white/10 shadow-sm">
              <div className="flex items-center gap-1 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Points</span>
              </div>
              <span className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{user.points}</span>
              <span className="text-sm mt-1 text-muted-foreground font-medium">total</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 shadow-sm">
            <h3 className="text-base font-medium mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Achievements & Avatars</span>
            </h3>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-muted-foreground">Current Rank:</span>
              <div className="mt-1">
                {user.streak >= 30 ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md">
                    <Award className="h-3.5 w-3.5 mr-2" />
                    Power User
                  </Badge>
                ) : user.streak >= 14 ? (
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md">
                    <Award className="h-3.5 w-3.5 mr-2" />
                    Advanced
                  </Badge>
                ) : user.streak >= 7 ? (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-md">
                    <Award className="h-3.5 w-3.5 mr-2" />
                    Regular
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Award className="h-3.5 w-3.5 mr-2" />
                    Beginner
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Avatar Milestones:</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${user.streak >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                    <span className="text-sm">3 Day Streak</span>
                  </div>
                  <Badge variant={user.streak >= 3 ? "default" : "outline"} className={user.streak >= 3 ? "bg-primary" : ""}>
                    {user.streak >= 3 ? "Unlocked" : (user.streak > 0 ? `${user.streak}/3` : "0/3")}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${user.streak >= 7 ? 'bg-primary' : 'bg-muted'}`}></div>
                    <span className="text-sm">7 Day Streak</span>
                  </div>
                  <Badge variant={user.streak >= 7 ? "default" : "outline"} className={user.streak >= 7 ? "bg-primary" : ""}>
                    {user.streak >= 7 ? "Unlocked" : (user.streak > 0 ? `${user.streak}/7` : "0/7")}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${user.streak >= 14 ? 'bg-primary' : 'bg-muted'}`}></div>
                    <span className="text-sm">14 Day Streak</span>
                  </div>
                  <Badge variant={user.streak >= 14 ? "default" : "outline"} className={user.streak >= 14 ? "bg-primary" : ""}>
                    {user.streak >= 14 ? "Unlocked" : (user.streak > 0 ? `${user.streak}/14` : "0/14")}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${user.streak >= 30 ? 'bg-primary' : 'bg-muted'}`}></div>
                    <span className="text-sm">30 Day Streak</span>
                  </div>
                  <Badge variant={user.streak >= 30 ? "default" : "outline"} className={user.streak >= 30 ? "bg-primary" : ""}>
                    {user.streak >= 30 ? "Unlocked" : (user.streak > 0 ? `${user.streak}/30` : "0/30")}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenAvatarSelector}
                  className="w-full bg-secondary/50 hover:bg-primary/20 hover:text-primary border-white/20"
                >
                  View & Change Avatars
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {/* Social media section */}
          <div className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/10 shadow-sm">
            <h3 className="text-base font-medium mb-3 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <span>Social & Share</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSocialShareOpen(true)}
                className="bg-primary/10 hover:bg-primary/20 border-white/10 gap-1.5"
              >
                <Share2 className="h-4 w-4" />
                Share Progress
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSocialConnectOpen(true)}
                className="bg-primary/10 hover:bg-primary/20 border-white/10 gap-1.5"
              >
                <Link className="h-4 w-4" />
                Connect Accounts
              </Button>
            </div>
          </div>

          <div className="w-full flex justify-center gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refreshData()}
              className="flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Refresh Stats
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleOpenAvatarSelector}
              className="flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21a8 8 0 0 0-16 0"></path>
              </svg>
              Change Avatar
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Complete daily tasks to maintain your streak and unlock special avatars!
          </p>
        </CardFooter>
      </Card>

      {/* Avatar Selector Dialog */}
      <AvatarSelector
        open={isAvatarSelectorOpen}
        onOpenChange={setIsAvatarSelectorOpen}
        currentAvatarId={user.currentAvatarId || null}
        userStreak={user.streak}
      />

      {/* Social Share Dialog */}
      <Dialog open={isSocialShareOpen} onOpenChange={setIsSocialShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center font-bold">
              <span className="text-gradient">Share Your Progress</span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Share your achievements with friends and inspire them to join TaskQuest!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            
            <div className="bg-success/10 text-success text-sm px-4 py-2 rounded-full mb-4">
              {user.streak > 0 ? (
                <>
                  <Flame className="h-4 w-4 inline-block mr-1" />
                  <span>{user.streak} day streak with {user.points} total points!</span>
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 inline-block mr-1" />
                  <span>Started my journey with {user.points} points so far!</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-medium mb-3">Share options:</h4>
              <SocialShareComponent 
                title={user.streak > 0 ? "Check out my productivity streak!" : "Just started my productivity journey!"}
                description={user.streak > 0
                  ? `I've maintained a ${user.streak}-day streak and earned ${user.points} points on TaskQuest. Join me in building better habits!`
                  : `I'm using TaskQuest to build better habits and have earned ${user.points} points so far. Join me on this journey!`
                }
                variant="default"
                className="w-full justify-center"
              />
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Connect Dialog */}
      <Dialog open={isSocialConnectOpen} onOpenChange={setIsSocialConnectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center font-bold">
              <span className="text-gradient">Connect Accounts</span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Connect your social accounts to enhance your TaskQuest experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-medium mb-3">Your connected accounts:</h4>
              <SocialConnectComponent 
                variant="default"
                className="w-full"
                onConnect={(platform) => {
                  console.log(`Connected to ${platform}`);
                  // Handle connection logic here
                }}
              />
            </div>
            
            <div className="mt-4 text-xs text-center text-muted-foreground">
              Connecting accounts allows for easier sharing and syncing your achievements across platforms.
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
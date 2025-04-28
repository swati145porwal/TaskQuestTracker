import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Lock, Trophy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Avatar as AvatarType } from "@shared/schema";

// Define the response type for updating avatar
interface UpdateAvatarResponse {
  success: boolean;
  currentAvatarId: number;
}

interface AvatarSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarId?: number | null;
  userStreak: number;
}

export default function AvatarSelector({ 
  open, 
  onOpenChange,
  currentAvatarId,
  userStreak
}: AvatarSelectorProps) {
  const [avatars, setAvatars] = useState<AvatarType[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(currentAvatarId || null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  // Fetch avatars when the component opens
  useEffect(() => {
    if (open) {
      fetchAvatars();
    }
  }, [open]);

  // Fetch all avatars from the server
  const fetchAvatars = async () => {
    try {
      const response = await fetch('/api/avatars');
      if (!response.ok) {
        throw new Error('Failed to fetch avatars');
      }
      const data = await response.json();
      setAvatars(data);
    } catch (error) {
      console.error('Error fetching avatars:', error);
      toast({
        title: "Error",
        description: "Failed to load avatars. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Mutation to update the user's avatar
  const updateAvatarMutation = useMutation<UpdateAvatarResponse, Error, number>({
    mutationFn: async (avatarId: number) => {
      const response = await apiRequest('PUT', '/api/user/avatar', { avatarId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Success",
        description: "Your avatar has been updated!",
        variant: "default"
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update avatar. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSelectAvatar = (avatarId: number) => {
    setSelectedAvatarId(avatarId);
  };

  const handleSaveAvatar = () => {
    if (selectedAvatarId !== null) {
      updateAvatarMutation.mutate(selectedAvatarId);
    }
  };

  // Filter avatars based on the selected tab
  const getFilteredAvatars = () => {
    if (activeTab === "unlocked") {
      return avatars.filter(avatar => 
        avatar.isDefault || avatar.streakRequired <= userStreak
      );
    } else if (activeTab === "locked") {
      return avatars.filter(avatar => 
        !avatar.isDefault && avatar.streakRequired > userStreak
      );
    }
    return avatars;
  };

  const filteredAvatars = getFilteredAvatars();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Select an avatar to represent yourself. Unlock more avatars by maintaining your streak!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="grid grid-cols-3 gap-4 mb-4 max-h-[300px] overflow-y-auto p-1">
              {filteredAvatars.map((avatar) => {
                const isUnlocked = avatar.isDefault || avatar.streakRequired <= userStreak;
                const isSelected = selectedAvatarId === avatar.id;
                
                return (
                  <div
                    key={avatar.id}
                    className={`relative flex flex-col items-center p-2 border rounded-md cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => isUnlocked && handleSelectAvatar(avatar.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                        <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      {isSelected && (
                        <CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-background rounded-full" />
                      )}
                      
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <span className="text-xs font-medium mt-1 text-center line-clamp-1">
                      {avatar.name}
                    </span>
                    
                    {!avatar.isDefault && (
                      <Badge 
                        variant={isUnlocked ? "secondary" : "outline"}
                        className="mt-1 text-xs gap-1"
                      >
                        <Trophy className="h-3 w-3" /> 
                        {avatar.streakRequired} days
                      </Badge>
                    )}
                  </div>
                );
              })}
              
              {filteredAvatars.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No avatars found in this category.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAvatar}
            disabled={selectedAvatarId === null || selectedAvatarId === currentAvatarId}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
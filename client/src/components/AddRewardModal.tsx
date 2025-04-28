import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getRandomGradient, rewardIcons, gradientColors } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Star, Trophy, Lightbulb, Clock, Heart, Coffee, Book, Pizza, Film, Gamepad, Music, Compass } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Custom icons for rewards
const CUSTOM_ICONS = [
  { icon: <Trophy className="h-5 w-5" />, name: "Trophy" },
  { icon: <Gift className="h-5 w-5" />, name: "Gift" },
  { icon: <Star className="h-5 w-5" />, name: "Star" },
  { icon: <Heart className="h-5 w-5" />, name: "Heart" },
  { icon: <Coffee className="h-5 w-5" />, name: "Coffee" },
  { icon: <Pizza className="h-5 w-5" />, name: "Pizza" },
  { icon: <Film className="h-5 w-5" />, name: "Movie" },
  { icon: <Book className="h-5 w-5" />, name: "Book" },
  { icon: <Music className="h-5 w-5" />, name: "Music" },
  { icon: <Gamepad className="h-5 w-5" />, name: "Game" },
  { icon: <Clock className="h-5 w-5" />, name: "Time" },
  { icon: <Compass className="h-5 w-5" />, name: "Adventure" },
];

// Reward templates for quick creation
const REWARD_TEMPLATES = [
  {
    title: "Cheat Meal",
    description: "Enjoy a guilt-free meal of your choice",
    points: 250,
    icon: "ri-restaurant-line",
    color: "from-orange-500 to-pink-500"
  },
  {
    title: "Movie Night",
    description: "Watch any movie with snacks",
    points: 200,
    icon: "ri-movie-line",
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Sleep In",
    description: "Sleep an extra hour in the morning",
    points: 150,
    icon: "ri-sleep-line",
    color: "from-indigo-500 to-cyan-500"
  },
  {
    title: "Gaming Break",
    description: "One hour of guilt-free gaming",
    points: 180,
    icon: "ri-gamepad-line",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Shopping Treat",
    description: "Buy something small for yourself",
    points: 300,
    icon: "ri-shopping-bag-line",
    color: "from-pink-500 to-rose-500"
  }
];

export default function AddRewardModal() {
  const { isAddRewardModalOpen, closeAddRewardModal, addReward } = useTaskContext();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("create");
  const [rewardName, setRewardName] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardIcon, setRewardIcon] = useState(rewardIcons[0]);
  const [rewardColor, setRewardColor] = useState(gradientColors[0]);
  const [selectedCustomIcon, setSelectedCustomIcon] = useState(CUSTOM_ICONS[0].name);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rewardName.trim()) {
      toast({
        title: "Reward name required",
        description: "Please enter a name for your reward.",
        variant: "destructive",
      });
      return;
    }
    
    if (!rewardPoints || parseInt(rewardPoints) <= 0) {
      toast({
        title: "Valid points required",
        description: "Please enter a positive number of points.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addReward({
        title: rewardName,
        description: rewardDescription,
        points: parseInt(rewardPoints),
        icon: rewardIcon,
        color: rewardColor
      });
      
      // Reset form
      setRewardName("");
      setRewardDescription("");
      setRewardPoints("");
      setRewardIcon(rewardIcons[0]);
      setRewardColor(gradientColors[0]);
    } catch (error) {
      console.error("Error adding reward:", error);
    }
  };
  const handleClose = () => {
    // Reset form
    setRewardName("");
    setRewardDescription("");
    setRewardPoints("");
    setRewardIcon(rewardIcons[0]);
    setRewardColor(gradientColors[0]);
    setActiveTab("create");
    closeAddRewardModal();
  };
  
  // Function to handle template selection
  const selectTemplate = (template: typeof REWARD_TEMPLATES[0]) => {
    setRewardName(template.title);
    setRewardDescription(template.description);
    setRewardPoints(template.points.toString());
    setRewardIcon(template.icon);
    setRewardColor(template.color);
    setActiveTab("create");
  };
  
  return (
    <Dialog open={isAddRewardModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 font-outfit">Add New Reward</DialogTitle>
          <DialogDescription>
            Create a new reward that you can redeem with your points.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="create" className="text-sm">Create Reward</TabsTrigger>
              <TabsTrigger value="templates" className="text-sm">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="rewardName">Reward Name</Label>
                  <Input 
                    id="rewardName" 
                    placeholder="e.g., Movie Night" 
                    value={rewardName}
                    onChange={(e) => setRewardName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rewardDesc">Description (optional)</Label>
                  <Input 
                    id="rewardDesc" 
                    placeholder="e.g., Watch a movie with popcorn" 
                    value={rewardDescription}
                    onChange={(e) => setRewardDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rewardPoints">Points Cost</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-coin-line text-gray-400"></i>
                    </div>
                    <Input
                      id="rewardPoints"
                      type="number"
                      min="1"
                      placeholder="200"
                      className="pl-9"
                      value={rewardPoints}
                      onChange={(e) => setRewardPoints(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rewardIcon">Icon</Label>
                    <Select value={rewardIcon} onValueChange={(value) => setRewardIcon(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {rewardIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center">
                              <i className={`${icon} mr-2`}></i>
                              <span>{icon.split('-').slice(1, -1).join(' ')}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rewardColor">Color Theme</Label>
                    <Select value={rewardColor} onValueChange={(value) => setRewardColor(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradientColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded mr-2 bg-gradient-to-r ${color}`}></div>
                              <span>Gradient {gradientColors.indexOf(color) + 1}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <motion.div 
                  className="rounded-lg overflow-hidden border border-gray-200 mt-4 shadow-sm"
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className={`h-20 bg-gradient-to-r ${rewardColor} flex items-center justify-center`}>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <i className={`${rewardIcon} text-white text-3xl`}></i>
                    </motion.div>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-white">
                    <div className="text-sm font-medium text-gray-700">Preview</div>
                    <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {rewardPoints ? `${rewardPoints} points` : "Set points"}
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-3">
                  Choose a template to start with. You can customize it afterward.
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {REWARD_TEMPLATES.map((template, index) => (
                    <motion.div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => selectTemplate(template)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                          <i className={`${template.icon} text-white`}></i>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{template.title}</h3>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                        <Badge className="ml-auto bg-gray-100 text-gray-600 hover:bg-gray-100">
                          {template.points} pts
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    className="text-xs" 
                    onClick={() => setActiveTab("create")}
                  >
                    I'd rather create my own
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md font-medium gap-2"
              >
                <Trophy className="h-4 w-4" />
                Create Reward
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

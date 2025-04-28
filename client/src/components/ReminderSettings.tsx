import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock } from 'lucide-react';
import { Task } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ReminderSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export default function ReminderSettings({ 
  open, 
  onOpenChange,
  task
}: ReminderSettingsProps) {
  const { toast } = useToast();
  const [remindBefore, setRemindBefore] = useState<string>("30");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  
  const handleSaveSettings = () => {
    // In a production app, we would save these settings to the database
    // For now, we'll just show a toast notification
    
    if (reminderEnabled) {
      toast({
        title: "Reminder Set",
        description: `You'll be reminded ${remindBefore} minutes before "${task.title}" is due.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Reminder Disabled",
        description: `Reminders for "${task.title}" have been turned off.`,
        variant: "default",
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Task Reminder Settings
          </DialogTitle>
          <DialogDescription>
            Set up reminders for your task: {task.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-enabled" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Enable reminders
            </Label>
            <Switch 
              id="reminder-enabled" 
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>
          
          {reminderEnabled && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="remind-before" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Remind me before task is due
                </Label>
                <Select
                  value={remindBefore}
                  onValueChange={setRemindBefore}
                  disabled={!reminderEnabled}
                >
                  <SelectTrigger id="remind-before">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="1440">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notification-type">Notification type</Label>
                <Select defaultValue="both" disabled={!reminderEnabled}>
                  <SelectTrigger id="notification-type">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">In-app only</SelectItem>
                    <SelectItem value="browser">Browser notification</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
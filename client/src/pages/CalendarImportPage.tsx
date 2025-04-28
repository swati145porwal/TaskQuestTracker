import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useTaskContext } from "@/context/TaskContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Cloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CalendarImportPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [importedTasks, setImportedTasks] = useState<any[]>([]);
  const { user } = useAuth();
  const { refreshData } = useTaskContext();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already connected to Google
  useEffect(() => {
    if (user?.googleRefreshToken) {
      setIsConnected(true);
    }
  }, [user]);

  const connectToGoogle = async () => {
    try {
      setIsConnecting(true);
      const response = await apiRequest("GET", "/api/google/auth");
      const data = await response.json();
      
      // Redirect to Google consent screen
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Error connecting to Google:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Google. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const importCalendarEvents = async () => {
    try {
      setIsImporting(true);
      const response = await apiRequest("GET", "/api/google/calendar/import");
      
      if (!response.ok) {
        throw new Error("Failed to import calendar events");
      }
      
      const data = await response.json();
      setImportedTasks(data.tasks || []);
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${data.tasks.length} events as tasks.`,
      });
      
      await refreshData();
    } catch (error) {
      console.error("Error importing calendar events:", error);
      toast({
        title: "Import failed",
        description: "Failed to import calendar events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Header title="Google Calendar" />
      
      <div className="mb-8 text-center">
        <div className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-2 font-outfit">Google Calendar Integration</h1>
          <p className="text-gray-600">Connect your Google Calendar to import events as tasks</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {!isConnected ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 font-outfit">Connect your Google Account</h2>
            <p className="text-gray-600 text-sm mb-6">Connecting allows TaskHabit to access your calendar events and import them as tasks.</p>
            
            <Button 
              className="w-full bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:opacity-90"
              onClick={connectToGoogle}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Cloud className="mr-2 h-4 w-4" />
              )}
              Connect with Google
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Connected to Google</h3>
                  <p className="text-xs text-gray-500">{user?.googleEmail}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={importCalendarEvents}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar className="mr-2 h-4 w-4" />
                  )}
                  Import Calendar Events
                </Button>
              </div>
            </div>
            
            {importedTasks.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-medium mb-4">Imported Tasks</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {importedTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium">{task.title}</div>
                      {task.date && <div className="text-xs text-gray-500">{task.date} {task.time || ""}</div>}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation("/calendar")}
                  >
                    View in Calendar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => setLocation("/")}
        >
          Return to Tasks
        </Button>
      </div>
    </div>
  );
}
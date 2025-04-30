import { useState } from "react";
import { useLocation } from "wouter";
import { useGuest } from "@/context/GuestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowRight, AlertTriangle, LogIn, UserPlus } from "lucide-react";
import Header from "@/components/Header";

export default function GuestPage() {
  const [, navigate] = useLocation();
  const { enableGuestMode } = useGuest();
  const [activeTab, setActiveTab] = useState("overview");

  const handleGuestContinue = () => {
    enableGuestMode();
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Guest Mode" />
      <main className="flex-grow w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3">Try TaskQuest Without an Account</h1>
            <p className="text-muted-foreground">Experience the app functionality without signing up</p>
          </div>

          <Card className="mb-8 shadow-sm border">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Guest Mode</CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Limited Functionality</span>
                </div>
              </div>
              <CardDescription>
                Guest mode lets you explore the app with some limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Available Features</TabsTrigger>
                  <TabsTrigger value="limitations">Limitations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <p>
                    Guest mode allows you to try TaskQuest without creating an account. You can create tasks, 
                    mark them as complete, and see how the gamification features work.
                  </p>
                  <div className="p-4 bg-muted/30 rounded-md border">
                    <p className="text-sm font-medium">Important Note:</p>
                    <p className="text-sm text-muted-foreground">
                      Your data will not be saved between sessions when using guest mode. Create an account to 
                      save your progress and access all features.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <ul className="space-y-2">
                    {[
                      "Create and manage tasks",
                      "Mark tasks as complete",
                      "Earn points for completed tasks",
                      "View the task dashboard",
                      "Experience the app's interface"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="limitations" className="space-y-4">
                  <ul className="space-y-2">
                    {[
                      "Your data is not saved between sessions",
                      "No access to calendar integration",
                      "No streaks or statistics tracking",
                      "Cannot unlock avatars and achievements",
                      "Limited to basic task management"
                    ].map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 bg-muted/10 border-t pt-6">
              <Button 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                onClick={handleGuestContinue}
              >
                Continue as Guest
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex w-full sm:w-auto gap-3">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/auth")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    navigate("/auth");
                    // Add any logic to switch to register tab
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
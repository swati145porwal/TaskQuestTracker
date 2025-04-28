import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import TasksPage from "@/pages/TasksPage";
import RewardsPage from "@/pages/RewardsPage";
import StatsPage from "@/pages/StatsPage";
import HistoryPage from "@/pages/HistoryPage";
import PointsAnimation from "@/components/PointsAnimation";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <TaskProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
              <AppRouter />
            </main>
            <BottomNavigation />
            <PointsAnimation />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </TaskProvider>
  );
}

// Move the Router component inside the App component to ensure it's wrapped by TaskProvider
function AppRouter() {
  const [location] = useLocation();
  
  return (
    <Switch>
      <Route path="/" component={TasksPage} />
      <Route path="/rewards" component={RewardsPage} />
      <Route path="/stats" component={StatsPage} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;

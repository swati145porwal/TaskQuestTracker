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
import ProfilePage from "@/pages/ProfilePage";
import CalendarPage from "@/pages/CalendarPage";
import CalendarImportPage from "@/pages/CalendarImportPage";
import AuthPage from "@/pages/auth-page";
import GuestPage from "@/pages/GuestPage";
import PointsAnimation from "@/components/PointsAnimation";
import NotificationSystem from "@/components/NotificationSystem";
import { TaskProvider } from "./context/TaskContext";
import { AuthProvider } from "./hooks/use-auth";
import { GuestProvider } from "./context/GuestContext";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GuestProvider>
            <TaskProvider>
              <TooltipProvider>
                <AppContent />
              </TooltipProvider>
            </TaskProvider>
          </GuestProvider>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-grow w-full mx-auto ${!isAuthPage ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6' : ''}`}>
        <AppRouter />
      </main>
      {!isAuthPage && <BottomNavigation />}
      <PointsAnimation />
      {!isAuthPage && <NotificationSystem />}
    </div>
  );
}

// Move the Router component inside the App component to ensure it's wrapped by TaskProvider
function AppRouter() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={TasksPage} />
      <ProtectedRoute path="/calendar" component={CalendarPage} />
      <ProtectedRoute path="/calendar/import" component={CalendarImportPage} />
      <ProtectedRoute path="/rewards" component={RewardsPage} />
      <ProtectedRoute path="/stats" component={StatsPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/guest" component={GuestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;

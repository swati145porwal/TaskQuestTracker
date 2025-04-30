import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGuest } from '@/context/GuestContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuestPage() {
  const [, navigate] = useLocation();
  const { isGuestMode, enableGuestMode } = useGuest();
  
  // If guest mode is already enabled, redirect to the main page
  useEffect(() => {
    if (isGuestMode) {
      navigate('/');
    }
  }, [isGuestMode, navigate]);
  
  const handleEnableGuestMode = () => {
    enableGuestMode();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Guest Mode</CardTitle>
          <CardDescription>
            Try out TaskQuest without creating an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              In guest mode, you can:
            </p>
            <ul className="text-sm space-y-2">
              {[
                'Create and manage tasks',
                'Mark tasks as completed',
                'Earn points for completing tasks',
                'Create custom rewards',
                'Try out the basic features of the app'
              ].map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Note:</strong> Your data won't be saved between sessions in guest mode.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleEnableGuestMode}
              className="w-full"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Guest Mode
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Back to Login/Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
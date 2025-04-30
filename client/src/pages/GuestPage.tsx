import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGuest } from '@/context/GuestContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SocialConnectComponent from '@/components/SocialConnectComponent';
import SocialShareComponent from '@/components/SocialShareComponent';

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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg">
        {/* Left side: Hero section with gradient background */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold">TaskQuest</h1>
            <p className="text-xl md:text-2xl font-light">Transform your daily tasks into rewarding achievements</p>
            <div className="py-4">
              <p className="text-white/80 text-sm mb-2">Share TaskQuest:</p>
              <SocialShareComponent 
                variant="compact" 
                className="justify-start" 
                title="Share TaskQuest" 
                description="Help others discover the app" 
              />
            </div>
          </motion.div>
        </div>
        
        {/* Right side: Guest mode card */}
        <Card className="w-full md:w-1/2 border-0 shadow-none rounded-none">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold text-gradient">Guest Mode</CardTitle>
            <CardDescription className="pt-2">
              Try out TaskQuest without creating an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                In guest mode, you can:
              </p>
              <ul className="text-sm space-y-3">
                {[
                  'Create and manage tasks',
                  'Mark tasks as completed',
                  'Earn points for completing tasks',
                  'Create custom rewards',
                  'Share achievements on social media',
                  'Try out the basic features of the app'
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/30">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note:</strong> Your data is saved locally in your browser but won't sync across devices in guest mode.
              </p>
            </div>
            
            {/* Social connections section */}
            <div className="social-connect-section">
              <p className="text-sm font-medium mb-2">Connect your social accounts:</p>
              <SocialConnectComponent variant="compact" />
            </div>
            
            <div className="flex flex-col space-y-3 pt-2">
              <Button 
                onClick={handleEnableGuestMode}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue to Guest Mode
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Back to Login/Register
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center opacity-70 text-xs pt-0">
            <p>© 2025 TaskQuest. All rights reserved</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
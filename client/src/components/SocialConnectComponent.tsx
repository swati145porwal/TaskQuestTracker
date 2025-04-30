import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github,
  Check,
  X
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SocialConnectComponentProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  onConnect?: (platform: string) => void;
}

interface SocialAccount {
  id: string;
  platform: string;
  icon: React.ReactNode;
  connected: boolean;
  username?: string;
  color: string;
}

export default function SocialConnectComponent({
  className = '',
  variant = 'default',
  onConnect
}: SocialConnectComponentProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Example social accounts state
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: 'facebook',
      platform: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      connected: false,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'twitter',
      platform: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      connected: false,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      connected: false,
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      connected: false,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      id: 'github',
      platform: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      connected: false,
      color: 'bg-gray-800 hover:bg-gray-900'
    }
  ]);

  const handleConnect = (platform: string) => {
    // Simulate connecting to a platform
    setSocialAccounts(accounts => 
      accounts.map(account => 
        account.id === platform 
          ? { ...account, connected: !account.connected, username: account.connected ? undefined : `user_${Math.floor(Math.random() * 1000)}` } 
          : account
      )
    );

    const isConnecting = !socialAccounts.find(acc => acc.id === platform)?.connected;
    
    toast({
      title: isConnecting ? "Account connected!" : "Account disconnected",
      description: isConnecting 
        ? `Your ${platform} account has been successfully connected.` 
        : `Your ${platform} account has been disconnected.`,
    });

    if (onConnect) {
      onConnect(platform);
    }
  };

  if (variant === 'minimal') {
    // Minimal display - just show connection status icons
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {socialAccounts.map(account => (
          <Button 
            key={account.id}
            size="sm" 
            variant={account.connected ? "default" : "outline"}
            className={`px-2 ${account.connected ? account.color : ''}`}
            onClick={() => handleConnect(account.id)}
          >
            {account.icon}
            {account.connected && <Check className="h-3 w-3 ml-1" />}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    // Compact display with toggles
    return (
      <div className={`space-y-3 ${className}`}>
        {socialAccounts.map(account => (
          <div key={account.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${account.connected ? account.color.split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`}>
                {account.icon}
              </div>
              <span className="ml-2 text-sm">{account.platform}</span>
            </div>
            <Switch 
              checked={account.connected} 
              onCheckedChange={() => handleConnect(account.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  // Default full component with dialog
  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Connect Social Accounts
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Connect Social Accounts</DialogTitle>
            <DialogDescription>
              Connect your social media accounts to share your achievements and progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {socialAccounts.map(account => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${account.connected ? account.color.split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {account.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.platform}</p>
                    {account.connected && account.username && (
                      <p className="text-xs text-muted-foreground">@{account.username}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant={account.connected ? "destructive" : "outline"}
                  onClick={() => handleConnect(account.id)}
                  className={account.connected ? "" : account.color}
                >
                  {account.connected ? (
                    <>
                      <X className="mr-1 h-4 w-4" />
                      Disconnect
                    </>
                  ) : "Connect"}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Separator className="my-4" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-sm" htmlFor="auto-share">Auto-share achievements</Label>
                <Switch id="auto-share" />
              </div>
              <p className="text-xs text-muted-foreground">
                Automatically share your achievements when you complete tasks
              </p>
            </div>
          </div>
          
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full dark:border-gray-700 dark:hover:bg-gray-800">
              Done
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
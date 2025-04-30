import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Share2, 
  X, 
  Link as LinkIcon
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
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface SocialShareComponentProps {
  title?: string;
  description?: string;
  shareUrl?: string;
  points?: number;
  taskTitle?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'button';
}

export default function SocialShareComponent({
  title = 'Share your achievement!',
  description = 'Share your progress with friends and family',
  shareUrl = window.location.href,
  points,
  taskTitle,
  className = '',
  variant = 'default'
}: SocialShareComponentProps) {
  const [open, setOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const generateShareText = () => {
    if (points && taskTitle) {
      return `I just earned ${points} points for completing "${taskTitle}" on TaskQuest! 🎯`;
    }
    return 'Check out my progress on TaskQuest! 🎯';
  };

  const shareText = generateShareText();
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  const copyToClipboard = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand('copy');
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    }
  };

  if (variant === 'button') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className={`flex items-center gap-1 ${className}`}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center">{title}</DialogTitle>
            <DialogDescription className="text-center">{description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Social share section */}
            <div className="flex justify-center space-x-4">
              <a 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href={socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-linkedin"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="#" 
                className="social-icon social-icon-instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Or copy the link:</p>
              <div className="flex gap-2">
                <Input
                  ref={linkInputRef}
                  readOnly
                  value={shareUrl}
                  className="text-sm dark:bg-gray-800 dark:border-gray-700"
                />
                <Button 
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogClose asChild>
            <Button variant="outline" className="w-full dark:border-gray-700 dark:hover:bg-gray-800">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        <a 
          href={socialLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon social-icon-facebook"
          style={{ width: '32px', height: '32px' }}
        >
          <Facebook size={14} />
        </a>
        <a 
          href={socialLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon social-icon-twitter"
          style={{ width: '32px', height: '32px' }}
        >
          <Twitter size={14} />
        </a>
        <a 
          href={socialLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon social-icon-linkedin"
          style={{ width: '32px', height: '32px' }}
        >
          <Linkedin size={14} />
        </a>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`social-share-card rounded-lg border bg-card p-4 ${className}`}>
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        <a 
          href={socialLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon social-icon-facebook"
        >
          <Facebook size={18} />
        </a>
        <a 
          href={socialLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon social-icon-twitter"
        >
          <Twitter size={18} />
        </a>
        <a 
          href={socialLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon social-icon-linkedin"
        >
          <Linkedin size={18} />
        </a>
        <a 
          href="#" 
          className="social-icon social-icon-instagram"
        >
          <Instagram size={18} />
        </a>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={copyToClipboard}
          className="ml-auto flex items-center gap-1"
        >
          <LinkIcon className="h-4 w-4" />
          <span>Copy Link</span>
        </Button>
      </div>
    </div>
  );
}
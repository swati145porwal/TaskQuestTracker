import React, { useState, useEffect } from "react";
import { Trash2, Image, FileAudio, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TaskProof } from "@shared/schema";

interface TaskProofDisplayProps {
  completedTaskId: number;
  onProofDeleted: () => void;
}

export default function TaskProofDisplay({ completedTaskId, onProofDeleted }: TaskProofDisplayProps) {
  const { toast } = useToast();
  const [proofs, setProofs] = useState<TaskProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchProofs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/task-proofs/${completedTaskId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch proofs');
        }
        
        const data = await response.json();
        setProofs(data);
      } catch (error) {
        console.error('Error fetching proofs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load task proofs',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProofs();
  }, [completedTaskId, toast]);
  
  const handleDeleteProof = async (proofId: number) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      await apiRequest('DELETE', `/api/task-proofs/${proofId}`);
      
      // Update local state
      setProofs(proofs.filter(proof => proof.id !== proofId));
      
      toast({
        title: 'Proof deleted',
        description: 'The proof has been removed successfully'
      });
      
      onProofDeleted();
    } catch (error) {
      console.error('Error deleting proof:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the proof',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (proofs.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 text-sm">
        No proofs added yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-3 p-1">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Proofs of Completion</h3>
      
      {proofs.map((proof) => (
        <motion.div
          key={proof.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group"
        >
          {/* Image or Audio indicator */}
          {proof.proofType === 'image' ? (
            <div className="relative aspect-video bg-gray-100">
              <img 
                src={proof.proofUrl} 
                alt="Task proof" 
                className="w-full h-full object-contain"
              />
              <a 
                href={proof.proofUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 bg-white/80 p-1 rounded-full shadow-sm hover:bg-white"
              >
                <ExternalLink className="h-4 w-4 text-gray-700" />
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <FileAudio className="h-6 w-6 text-primary mr-2" />
                <div>
                  <div className="text-sm font-medium">Audio recording</div>
                  <div className="text-xs text-gray-500">
                    {new Date(proof.uploadedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <audio controls className="h-8">
                  <source src={proof.proofUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
          
          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDeleteProof(proof.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
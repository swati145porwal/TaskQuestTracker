import React, { useState, useRef } from "react";
import { Camera, Mic, X, Upload, Image, FileAudio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TaskProofUploadProps {
  completedTaskId: number;
  onProofUploaded: () => void;
  onClose: () => void;
}

export default function TaskProofUpload({ completedTaskId, onProofUploaded, onClose }: TaskProofUploadProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "audio" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setUploadType("image");
      } else if (file.type.startsWith('audio/')) {
        setPreview(null);
        setUploadType("audio");
      }
    }
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };
  
  const uploadProof = async () => {
    if (!selectedFile || !uploadType) return;
    
    setIsUploading(true);
    
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const data = await response.json();
      
      // Now create the task proof
      await apiRequest('POST', '/api/task-proofs', {
        completedTaskId,
        proofType: uploadType,
        proofUrl: data.file.url
      });
      
      toast({
        title: 'Proof uploaded successfully!',
        description: 'Your task completion proof has been saved.'
      });
      
      onProofUploaded();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload proof. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Proof of Completion</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {!selectedFile ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            Add a photo or audio recording to prove you've completed this task.
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              <Input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 h-24">
                <Camera className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs font-medium">Take Photo</span>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              <Input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="audio/*"
                onChange={handleFileSelect}
                ref={audioInputRef}
              />
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 h-24">
                <Mic className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs font-medium">Record Audio</span>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative border rounded-xl overflow-hidden"
            >
              {uploadType === "image" && preview ? (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : uploadType === "audio" ? (
                <div className="flex items-center justify-center aspect-video bg-gray-100 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    <FileAudio className="h-16 w-16 text-primary mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(selectedFile.size / 1024)} KB
                    </span>
                  </div>
                </div>
              ) : null}
              
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={clearSelection}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={uploadProof}
              disabled={isUploading}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
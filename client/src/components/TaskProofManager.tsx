import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Image } from "lucide-react";
import TaskProofUpload from "@/components/TaskProofUpload";
import TaskProofDisplay from "@/components/TaskProofDisplay";

interface TaskProofManagerProps {
  completedTaskId: number;
}

export default function TaskProofManager({ completedTaskId }: TaskProofManagerProps) {
  const [activeTab, setActiveTab] = useState<string>("view");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleProofUploaded = () => {
    setActiveTab("view");
    setRefreshKey(prev => prev + 1);
  };
  
  const handleProofDeleted = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs text-primary"
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Proof</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6 pt-6 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View Proofs</TabsTrigger>
              <TabsTrigger value="add">Add Proof</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="view" className="p-1">
            <div className="px-4 py-2">
              <TaskProofDisplay 
                key={refreshKey}
                completedTaskId={completedTaskId} 
                onProofDeleted={handleProofDeleted}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="mt-0 p-1">
            <div className="px-4 py-2">
              <TaskProofUpload
                completedTaskId={completedTaskId}
                onProofUploaded={handleProofUploaded}
                onClose={() => setIsDialogOpen(false)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
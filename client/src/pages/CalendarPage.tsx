import React from "react";
import TaskCalendar from "@/components/Calendar/TaskCalendar";
import { useTaskContext } from "@/context/TaskContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function CalendarPage() {
  const { tasks } = useTaskContext();
  const [, setLocation] = useLocation();
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            Plan and organize tasks for specific dates
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-primary/20 hover:bg-primary/5"
            onClick={() => setLocation('/calendar/import')}
          >
            <Calendar className="h-4 w-4 text-primary" />
            <span>Import from Google</span>
          </Button>
        </div>
        
        <TaskCalendar />
      </motion.div>
    </div>
  );
}
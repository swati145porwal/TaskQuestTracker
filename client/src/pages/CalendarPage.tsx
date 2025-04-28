import React from "react";
import TaskCalendar from "@/components/Calendar/TaskCalendar";
import { useTaskContext } from "@/context/TaskContext";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const { tasks } = useTaskContext();
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-2 mb-6 text-sm text-gray-500">
          Plan and organize tasks for specific dates
        </div>
        
        <TaskCalendar />
      </motion.div>
    </div>
  );
}
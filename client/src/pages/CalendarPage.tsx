import React, { useState } from "react";
import Header from "@/components/Header";
import TaskCalendar from "@/components/Calendar/TaskCalendar";
import { useTaskContext } from "@/context/TaskContext";
import { motion } from "framer-motion";
import BottomNavigation from "@/components/BottomNavigation";

export default function CalendarPage() {
  const { tasks } = useTaskContext();
  
  return (
    <div className="max-w-5xl mx-auto px-4">
      <Header title="Calendar" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-2 mb-2 text-sm text-gray-500">
          Plan and organize tasks for specific dates
        </div>
        
        <TaskCalendar />
      </motion.div>
      
      <BottomNavigation />
    </div>
  );
}
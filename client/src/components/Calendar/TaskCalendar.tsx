import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTaskContext } from "@/context/TaskContext";
import { motion } from "framer-motion";
import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, ChevronLeft, ChevronRight, ListChecks, Plus } from "lucide-react";
import { Task } from "@shared/schema";
import TaskCard from "../TaskCard";

export default function TaskCalendar() {
  const { tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayDetail, setShowDayDetail] = useState(false);
  
  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    // If task has a specific date property, compare with selectedDate
    // For demo purposes, we're just showing all tasks on every date
    return true;
  });
  
  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowDayDetail(true);
    }
  };
  
  // Function to check if a date has tasks
  const getDateHasTasksClass = (date: Date) => {
    // For demo purposes, let's just highlight some random dates
    const day = date.getDate();
    if (day % 3 === 0) {
      return "bg-primary/20 text-primary font-medium";
    }
    return "";
  };
  
  // Helper to get day of month with ordinal suffix
  const getDayWithSuffix = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return `${day}${suffix}`;
  };
  
  return (
    <div className="mt-5 mb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gradient font-outfit">
          Plan Your Tasks
        </h2>
        
        {/* Add navigation buttons to easily go to prev/next day */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 p-0"
            onClick={() => {
              const prevDay = new Date(selectedDate);
              prevDay.setDate(prevDay.getDate() - 1);
              setSelectedDate(prevDay);
              setShowDayDetail(true);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 text-xs"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 p-0"
            onClick={() => {
              const nextDay = new Date(selectedDate);
              nextDay.setDate(nextDay.getDate() + 1);
              setSelectedDate(nextDay);
              setShowDayDetail(true);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-7 gap-4">
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <CalendarComponent 
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md"
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const extraClass = getDateHasTasksClass(date);
                  return (
                    <button 
                      {...props} 
                      className={`${props.className} ${extraClass} hover:bg-primary/20`}
                    />
                  );
                }
              }}
            />
          </div>
          
          <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Schedule for {format(selectedDate, "EEEE")}</h3>
                <p className="text-sm text-gray-600">
                  {format(selectedDate, "MMMM")} {getDayWithSuffix(selectedDate)}, {format(selectedDate, "yyyy")}
                </p>
                
                <Button 
                  size="sm" 
                  className="mt-3 bg-white text-primary hover:bg-primary/10 border border-primary/20 shadow-sm gap-1"
                  variant="outline"
                  onClick={() => setShowDayDetail(true)}
                >
                  <ListChecks className="h-3.5 w-3.5" />
                  <span>View tasks</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              Upcoming Tasks
            </h3>
            
            <Button 
              size="sm" 
              className="bg-primary/10 text-primary hover:bg-primary/20 gap-1 h-8"
              variant="ghost"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className={`w-2 h-10 rounded-full ${task.isCompleted ? 'bg-success' : 'bg-primary'}`} />
                <div className="flex-grow">
                  <h4 className={`font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Tomorrow</span>
                    {task.time && (
                      <>
                        <span>•</span>
                        <span>{task.time}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Day Detail Dialog */}
      <Dialog open={showDayDetail} onOpenChange={setShowDayDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient font-outfit">
              {format(selectedDate, "EEEE, MMMM d")}
            </DialogTitle>
            <DialogDescription>
              Manage all your tasks scheduled for this day.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">
                Daily Tasks
              </h3>
              
              <Button 
                size="sm" 
                className="bg-primary/10 text-primary hover:bg-primary/20 gap-1 h-8"
                variant="ghost"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {tasksForSelectedDate.length > 0 ? (
                  tasksForSelectedDate.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">No tasks for this day</h4>
                    <p className="text-sm text-gray-500 max-w-xs">
                      You don't have any tasks scheduled for {format(selectedDate, "MMMM d, yyyy")}.
                    </p>
                    <Button 
                      className="mt-4 gap-1 shadow-sm"
                      size="sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add a task</span>
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDayDetail(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
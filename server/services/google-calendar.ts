import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { InsertTask } from '@shared/schema';
import { addDays, subDays, startOfDay, format } from 'date-fns';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

// Get calendar events for the next 7 days
export async function getCalendarEvents(oAuth2Client: OAuth2Client): Promise<CalendarEvent[]> {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
  // Get events from today to 7 days from now
  const timeMin = startOfDay(new Date()).toISOString();
  const timeMax = startOfDay(addDays(new Date(), 7)).toISOString();
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });
  
  return response.data.items as CalendarEvent[];
}

// Convert Google Calendar events to TaskHabit tasks
export function convertEventsToTasks(events: CalendarEvent[], userId: number): InsertTask[] {
  return events.map(event => {
    // Extract date and time
    let date: string | null = null;
    let time: string | null = null;
    
    if (event.start.dateTime) {
      // Event has a specific time
      const startDate = new Date(event.start.dateTime);
      date = format(startDate, 'yyyy-MM-dd');
      time = format(startDate, 'HH:mm');
    } else if (event.start.date) {
      // All-day event
      date = event.start.date;
    }
    
    return {
      title: event.summary || 'Untitled Event',
      description: event.description || null,
      points: 10, // Default points for calendar events
      category: 'Calendar',
      isCompleted: false,
      userId,
      date,
      time,
      googleEventId: event.id,
    };
  });
}
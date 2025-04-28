'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { eventsApi, Event } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const { addNotification } = useAppStore();

  const fetchEvents = async (upcoming: boolean) => {
    try {
      setIsLoading(true);
      const result = await eventsApi.getAll(upcoming);
      setEvents(result);
    } catch (error) {
      console.error('Error fetching events:', error);
      addNotification({
        message: 'Failed to load events',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(showUpcoming);
  }, [showUpcoming]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button className="btn btn-primary">Create Event</button>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            className={`btn ${showUpcoming ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowUpcoming(true)}
          >
            Upcoming Events
          </button>
          <button
            className={`btn ${!showUpcoming ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowUpcoming(false)}
          >
            All Events
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="card p-6 text-center">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="card p-6 text-center">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card">
              <h3 className="text-lg font-medium mb-2">{event.title}</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(event.startTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {event.location}
                  </p>
                )}
              </div>
              
              {event.description && (
                <p className="text-sm mb-4">{event.description}</p>
              )}
              
              <div className="flex justify-end">
                <button className="btn btn-secondary">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

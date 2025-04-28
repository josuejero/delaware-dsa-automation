'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { membersApi, eventsApi, Member, Event } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addNotification } = useAppStore();
  
  const [membersStats, setMembersStats] = useState({
    total: 0,
    current: 0,
    expiringSoon: 0,
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // Set the user in the global store
      useAppStore.getState().setUser({
        id: parseInt(session.user.id),
        email: session.user.email,
        roles: session.user.roles,
      });
      
      // Load dashboard data
      const fetchData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch members data
          const [membersResponse, expiringSoonMembers, upcomingEventsData] = await Promise.all([
            membersApi.getAll(1, 0), // Just get the count
            membersApi.getExpiringSoon(),
            eventsApi.getAll(true),
          ]);
          
          // Calculate stats
          const currentMembers = membersResponse.items.filter(m => m.status === 'current').length;
          
          setMembersStats({
            total: membersResponse.total,
            current: currentMembers,
            expiringSoon: expiringSoonMembers.length,
          });
          
          setUpcomingEvents(upcomingEventsData.slice(0, 5)); // Show 5 most recent
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          addNotification({
            message: 'Failed to load dashboard data',
            type: 'error',
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [status, session, addNotification]);

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <p className="text-lg font-medium">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-medium mb-2">Total Members</h3>
          <p className="text-3xl font-bold text-brand-red">{membersStats.total}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-2">Current Members</h3>
          <p className="text-3xl font-bold text-green-600">{membersStats.current}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-2">Dues Expiring Soon</h3>
          <p className="text-3xl font-bold text-yellow-500">{membersStats.expiringSoon}</p>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
          <button 
            onClick={() => router.push('/events')}
            className="text-sm text-brand-red hover:underline"
          >
            View all
          </button>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="divide-y">
            {upcomingEvents.map(event => (
              <div key={event.id} className="py-3">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-600">{event.location}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events</p>
        )}
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function Notifications() {
  const { notifications, removeNotification } = useAppStore();

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 space-y-2">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`p-4 rounded-md shadow-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          <div className="flex justify-between">
            <p>{notification.message}</p>
            <button 
              onClick={() => removeNotification(notification.id)}
              className="text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

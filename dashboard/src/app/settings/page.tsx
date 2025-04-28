'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account and application settings</p>
      </div>
      
      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-4">Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {session?.user.email}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {session?.user.roles?.join(', ') || 'No roles assigned'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-medium mb-4">Application Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Settings
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Receive email notifications
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interface Theme
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md"
              defaultValue="light"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

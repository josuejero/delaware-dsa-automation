'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import Notifications from './Notifications';

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
}

const NavItem = ({ href, label, active }: NavItemProps) => (
  <Link href={href} 
    className={`flex items-center px-4 py-2 rounded-md ${active ? 'bg-brand-red text-white' : 'hover:bg-gray-100'}`}>
    {label}
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAppStore();
  
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-brand-red">Delaware DSA</h1>
          <p className="text-sm text-gray-600">Admin Dashboard</p>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem href="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
          <NavItem href="/members" label="Membership" active={isActive('/members')} />
          <NavItem href="/events" label="Events" active={isActive('/events')} />
          <NavItem href="/settings" label="Settings" active={isActive('/settings')} />
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          {user && (
            <div className="flex justify-between items-center">
              <span className="text-sm">{user.email}</span>
              <button 
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h2 className="text-lg font-medium text-gray-900 capitalize">
            {pathname.split('/')[1] || 'Dashboard'}
          </h2>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* Notifications */}
      <Notifications />
    </div>
  );
}

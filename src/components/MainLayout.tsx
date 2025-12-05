'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from './Sidebar';
import { dataStore } from '@/lib/store';
import { DEFAULT_USER_SETTINGS } from '@/types';
import { useAuth } from './AuthProvider';

interface MainLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

export function MainLayout({ children, userName }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>('User');
  const { user } = useAuth();

  useEffect(() => {
    // Get user name from settings or Supabase
    if (userName) {
      setDisplayName(userName);
    } else if (user?.user_metadata?.name) {
      setDisplayName(user.user_metadata.name);
    } else if (user?.email) {
      setDisplayName(user.email.split('@')[0]);
    } else {
      const settings = dataStore.getUserSettings();
      setDisplayName(settings.name || DEFAULT_USER_SETTINGS.name);
    }
  }, [userName, user]);

  return (
    <div className="min-h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userName={displayName}
      />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="container-dashboard py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

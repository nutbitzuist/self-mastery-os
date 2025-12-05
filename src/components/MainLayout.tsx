'use client';

import React, { useState } from 'react';
import { Sidebar, Header } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

export function MainLayout({ children, userName = 'Nut' }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        userName={userName}
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

import React from 'react';
import { Dock } from './Dock';
import { BackgroundGrid } from '../ui/BackgroundGrid';
import { AuroraBackground } from '../ui/AuroraBackground';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* Background Effects */}
      <BackgroundGrid />
      <AuroraBackground />
      
      {/* Noise Overlay */}
      <div className="bg-noise"></div>
      
      <div className="flex h-screen w-full">
        <main className="flex-1 flex flex-col relative z-10">
          <div className="flex-1 pb-24">
            {children}
          </div>
        </main>
      </div>
      
      <Dock />
    </>
  );
}

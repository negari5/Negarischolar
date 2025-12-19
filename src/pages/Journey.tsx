
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedJourneyTracker from '@/components/EnhancedJourneyTracker';

const Journey = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className={`container mx-auto space-y-4 sm:space-y-6 max-w-6xl ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-primary">My Journey</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Track your progress and achievements</p>
        </div>

        <EnhancedJourneyTracker />
      </div>
    </div>
  );
};

export default Journey;

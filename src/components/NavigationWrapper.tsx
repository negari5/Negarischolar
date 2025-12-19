import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Pages where we don't want to show navigation
  const hideNavPages = ['/super-admin-setup', '/admin', '/student', '/mentor', '/parent', '/school', '/profile', '/settings', '/mentors'];
  const shouldHideNav =
    location.pathname === '/' ||
    hideNavPages.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));
  const shouldShowNav = !shouldHideNav;

  const handleNotification = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  return (
    <div className="min-h-screen">
      <main className={shouldShowNav && isMobile ? 'pb-20' : ''}>
        {children}
      </main>
      {shouldShowNav && (
        <BottomNavigation onNotification={handleNotification} />
      )}
    </div>
  );
};

export default NavigationWrapper;
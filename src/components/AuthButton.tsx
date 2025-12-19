
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import AdminButton from './AdminButton';
import { LogOut, User } from 'lucide-react';

const AuthButton: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    return user?.email || 'User';
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <AdminButton />
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="text-negari-indigo font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
              {getDisplayName()}
            </span>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        className="bg-negari-orange hover:bg-negari-indigo text-white text-xs sm:text-sm px-3 py-2 sm:px-4"
      >
        Get Started
      </Button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AuthButton;

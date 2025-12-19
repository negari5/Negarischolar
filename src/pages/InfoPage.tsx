import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InfoSection from '@/components/InfoSection';

const InfoPage: React.FC = () => {
  const { profile } = useAuth();
  
  const getUserType = () => {
    if (profile?.user_type === 'student') return 'student';
    if (profile?.user_type === 'mentor') return 'mentor';
    if (profile?.user_type === 'parent') return 'parent';
    if (profile?.user_type === 'school') return 'school';
    return 'student'; // default
  };

  return <InfoSection userType={getUserType()} />;
};

export default InfoPage;
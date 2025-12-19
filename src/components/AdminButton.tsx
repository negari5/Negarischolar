
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AdminButton: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  if (!(profile?.is_admin || user?.email === 'negari@gmail.com')) {
    return null;
  }

  return (
    <Button
      onClick={() => navigate('/admin')}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-negari-gold text-negari-gold hover:bg-negari-gold hover:text-negari-navy dark:hover:text-negari-navy"
    >
      <Shield className="h-4 w-4" />
      Admin Panel
    </Button>
  );
};

export default AdminButton;

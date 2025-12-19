import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

const EnhancedStudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Student Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            This is a placeholder for the enhanced student dashboard. 
            Use the functional dashboard for full features.
          </p>
          <Button onClick={() => navigate('/student')} className="w-full">
            Go to Functional Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStudentDashboard;

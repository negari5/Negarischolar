import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Home, Search, Users, MessageSquare, User, GraduationCap, BookOpen, Building } from 'lucide-react';

interface ViewWebsiteSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPage: (page: string) => void;
}

const ViewWebsiteSelector: React.FC<ViewWebsiteSelectorProps> = ({
  open,
  onOpenChange,
  onSelectPage
}) => {
  const pages = [
    { path: '/student', name: 'Student Dashboard', icon: <GraduationCap className="h-4 w-4" />, description: 'Student portal and dashboard' },
    { path: '/mentor', name: 'Mentor Page', icon: <Users className="h-4 w-4" />, description: 'Mentor information and portal' },
    { path: '/parent', name: 'Parent Page', icon: <Users className="h-4 w-4" />, description: 'Parent support portal' },
    { path: '/school', name: 'School Page', icon: <Building className="h-4 w-4" />, description: 'School partnership portal' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Select Page to View
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {pages.map((page) => (
            <Card key={page.path} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {page.icon}
                  {page.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{page.description}</p>
                <Button 
                  size="sm" 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={() => onSelectPage(page.path)}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Page
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewWebsiteSelector;
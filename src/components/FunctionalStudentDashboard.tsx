import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BookOpen, Target, Award, Calendar, FileText, 
  Users, MessageCircle, TrendingUp, GraduationCap,
  Search, Filter, Plus, Eye, Edit, Trash2,
  CheckCircle, Clock, AlertTriangle, Star, UserCircle, Settings, LogOut, User
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FunctionalStudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [mentorSessions, setMentorSessions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch scholarships
      const { data: scholarshipsData } = await supabase
        .from('scholarships')
        .select('*')
        .eq('status', 'active')
        .order('deadline', { ascending: true })
        .limit(10);
      setScholarships(scholarshipsData || []);

      // Fetch applications with scholarships
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Fetch scholarship details for applications
      if (applicationsData && applicationsData.length > 0) {
        const scholarshipIds = applicationsData.map(app => app.scholarship_id);
        const { data: scholarshipsForApps } = await supabase
          .from('scholarships')
          .select('id, title, university, deadline')
          .in('id', scholarshipIds);
        
        // Map scholarships to applications
        const appsWithScholarships = applicationsData.map(app => ({
          ...app,
          scholarship: scholarshipsForApps?.find(s => s.id === app.scholarship_id)
        }));
        setApplications(appsWithScholarships);
      } else {
        setApplications([]);
      }

      // Fetch mentor sessions
      const { data: sessionsData } = await supabase
        .from('mentor_sessions')
        .select('*')
        .eq('student_id', user.id)
        .order('session_date', { ascending: true });
      setMentorSessions(sessionsData || []);

      // Fetch resources
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      setResources(resourcesData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleCreateApplication = async (scholarshipId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          scholarship_id: scholarshipId,
          status: 'draft',
          progress: 0,
          next_step: 'Start application'
        });

      if (error) throw error;

      toast.success('Application created successfully!');
      fetchData();
      setActiveTab('applications');
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Failed to create application');
    }
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationToDelete);

      if (error) throw error;

      toast.success('Application deleted successfully!');
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    }
  };

  const confirmDelete = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
                alt="Negari Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="font-comfortaa font-bold text-lg sm:text-xl text-primary">Negari</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Student Dashboard
              </Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium">Account</span>
              </button>
              
              {showAccountMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <div className="border-t border-border"></div>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/');
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            <TabsList className="inline-flex w-max min-w-full text-xs sm:text-sm bg-transparent">
              <TabsTrigger value="dashboard" className="whitespace-nowrap">Dashboard</TabsTrigger>
              <TabsTrigger value="scholarships" className="whitespace-nowrap">Scholarships</TabsTrigger>
              <TabsTrigger value="applications" className="whitespace-nowrap">Applications</TabsTrigger>
              <TabsTrigger value="mentors" className="whitespace-nowrap">Mentors</TabsTrigger>
              <TabsTrigger value="progress" className="whitespace-nowrap">Progress</TabsTrigger>
              <TabsTrigger value="resources" className="whitespace-nowrap">Resources</TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">Active applications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scholarships Found</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{scholarships.length}</div>
                  <p className="text-xs text-muted-foreground">Available opportunities</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {applications.filter(app => app.status === 'in_progress').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Applications in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mentor Sessions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{mentorSessions.length}</div>
                  <p className="text-xs text-muted-foreground">Scheduled sessions</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{app.scholarship?.title}</p>
                        <p className="text-sm text-muted-foreground">{app.next_step}</p>
                      </div>
                      <Badge variant={app.status === 'submitted' ? 'default' : 'secondary'}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No applications yet. Browse scholarships to get started!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scholarships.slice(0, 3).map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{scholarship.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                  {scholarships.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No scholarships available at the moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-primary">Scholarship Explorer</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search scholarships..." className="pl-10 w-full" />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scholarship.university}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-primary">{scholarship.amount}</span>
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(scholarship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCreateApplication(scholarship.id)}
                      >
                        Apply
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {scholarships.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No scholarships available at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">My Applications</h2>
              <Button onClick={() => setActiveTab('scholarships')}>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{app.scholarship?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {new Date(app.scholarship?.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={app.status === 'submitted' ? 'default' : 'secondary'}>
                          {app.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => confirmDelete(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{app.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${app.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Next step: {app.next_step}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {applications.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't started any applications yet.</p>
                  <Button onClick={() => setActiveTab('scholarships')}>
                    Browse Scholarships
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Mentors Tab */}
          <TabsContent value="mentors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Mentor Network</h2>
              <Button onClick={() => navigate('/mentors')}>
                <Users className="h-4 w-4 mr-2" />
                Find Mentor
              </Button>
            </div>

            <div className="space-y-4">
              {mentorSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{session.mentor?.full_name}</h3>
                        <p className="text-muted-foreground">{session.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.session_date).toLocaleDateString()} at {session.session_time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{session.status}</Badge>
                        <Button size="sm">Join Session</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {mentorSessions.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No mentor sessions scheduled yet.</p>
                  <Button onClick={() => navigate('/mentors')}>
                    Find a Mentor
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Progress Tracking</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Applications Submitted</span>
                      <span>{applications.filter(app => app.status === 'submitted').length}/{applications.length}</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${applications.length > 0 ? (applications.filter(app => app.status === 'submitted').length / applications.length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievement Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Profile Completed</p>
                        <p className="text-sm text-muted-foreground">Welcome to Negari!</p>
                      </div>
                    </div>
                    {applications.length > 0 && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        <div>
                          <p className="font-medium">First Application Started</p>
                          <p className="text-sm text-muted-foreground">Great start!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Learning Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <Button size="sm" className="w-full">Access Resource</Button>
                  </CardContent>
                </Card>
              ))}
              {resources.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No resources available yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApplicationToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteApplication}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FunctionalStudentDashboard;
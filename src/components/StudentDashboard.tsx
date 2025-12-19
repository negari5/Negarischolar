import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, Target, Award, Calendar, FileText, 
  Users, MessageCircle, TrendingUp, GraduationCap,
  Search, Filter, Plus, Eye, Edit, Trash2,
  CheckCircle, Clock, AlertTriangle, Star
} from 'lucide-react';
import InfoSection from './InfoSection';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInfo, setShowInfo] = useState(false);

  // Mock data
  const scholarships = [
    {
      id: '1',
      title: 'Fulbright Program',
      university: 'Various US Universities',
      deadline: '2024-10-15',
      amount: '$25,000',
      status: 'eligible'
    },
    {
      id: '2', 
      title: 'Rhodes Scholarship',
      university: 'Oxford University',
      deadline: '2024-09-30',
      amount: 'Full Coverage',
      status: 'applied'
    },
    {
      id: '3',
      title: 'Chevening Scholarship',
      university: 'UK Universities',
      deadline: '2024-11-01',
      amount: '£30,000',
      status: 'saved'
    }
  ];

  const applications = [
    {
      id: '1',
      scholarship: 'MIT Undergraduate Program',
      status: 'submitted',
      progress: 85,
      nextStep: 'Wait for response',
      deadline: '2024-12-01'
    },
    {
      id: '2',
      scholarship: 'Harvard Summer Program',
      status: 'in_progress',
      progress: 60,
      nextStep: 'Complete essays',
      deadline: '2024-11-15'
    }
  ];

  const mentorSessions = [
    {
      id: '1',
      mentor: 'Dr. Sarah Johnson',
      topic: 'Application Review',
      date: '2024-10-20',
      time: '3:00 PM',
      status: 'scheduled'
    },
    {
      id: '2',
      mentor: 'Michael Chen',
      topic: 'Interview Preparation',
      date: '2024-10-25',
      time: '10:00 AM',
      status: 'upcoming'
    }
  ];

  if (showInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <Button 
              variant="outline" 
              onClick={() => setShowInfo(false)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
        <InfoSection userType="student" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
                alt="Negari Logo" 
                className="h-10 w-10"
              />
              <span className="font-comfortaa font-bold text-xl text-primary">Negari</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Student Dashboard
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowInfo(true)}
              >
                Info
              </Button>
              <Button size="sm">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            <TabsList className="inline-flex w-max min-w-full gap-1 bg-transparent">
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
                  <div className="text-2xl font-bold text-primary">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scholarships Found</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">127</div>
                  <p className="text-xs text-muted-foreground">Matching your profile</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <p className="text-xs text-muted-foreground">Above average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mentor Sessions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">8</div>
                  <p className="text-xs text-muted-foreground">This month</p>
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
                        <p className="font-medium">{app.scholarship}</p>
                        <p className="text-sm text-muted-foreground">{app.nextStep}</p>
                      </div>
                      <Badge variant={app.status === 'submitted' ? 'default' : 'secondary'}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
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
                        <p className="text-sm text-muted-foreground">{scholarship.deadline}</p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Scholarship Explorer</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search scholarships..." className="pl-10 w-80" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                      <Badge variant={
                        scholarship.status === 'eligible' ? 'default' :
                        scholarship.status === 'applied' ? 'secondary' : 'outline'
                      }>
                        {scholarship.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{scholarship.university}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-primary">{scholarship.amount}</span>
                      <span className="text-sm text-muted-foreground">Due: {scholarship.deadline}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">My Applications</h2>
              <Button>
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
                        <h3 className="text-lg font-semibold">{app.scholarship}</h3>
                        <p className="text-sm text-muted-foreground">Deadline: {app.deadline}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={app.status === 'submitted' ? 'default' : 'secondary'}>
                          {app.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
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
                        Next step: {app.nextStep}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mentors Tab */}
          <TabsContent value="mentors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Mentor Network</h2>
              <Button>
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
                        <h3 className="text-lg font-semibold">{session.mentor}</h3>
                        <p className="text-muted-foreground">{session.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.date} at {session.time}
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
                      <span>3/5</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-3/5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Essays Completed</span>
                      <span>7/10</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-7/10" />
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
                        <p className="text-sm text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">First Application Submitted</p>
                        <p className="text-sm text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Interview Preparation</p>
                        <p className="text-sm text-muted-foreground">In progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Learning Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Essay Writing Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive guide to writing compelling scholarship essays.
                  </p>
                  <Button size="sm" className="w-full">Access Guide</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Interview Prep</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Practice common interview questions and improve your skills.
                  </p>
                  <Button size="sm" className="w-full">Start Practice</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Goal Setting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Set and track your academic and career goals effectively.
                  </p>
                  <Button size="sm" className="w-full">Set Goals</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
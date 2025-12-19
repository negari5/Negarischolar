import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import InfoSection from '@/components/InfoSection';
import { 
  Users, Calendar, Target, FileText, Heart, 
  DollarSign, CheckCircle, Clock, Info, 
  Home as HomeIcon, TrendingUp, Shield, UserCircle, User, Settings, LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const FunctionalParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useLanguage();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  // TODO: Fetch from database
  const childProgress = {
    name: 'Your Child',
    grade: 'N/A',
    gpa: 'N/A',
    applications: 0,
    scholarships: 0,
    completionRate: 0
  };

  const upcomingDeadlines: any[] = [];

  const financialOverview = {
    estimatedCost: 0,
    scholarshipPotential: 0,
    familyContribution: 0,
    savingsProgress: 0
  };

  if (activeTab === 'info') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
                  alt="Negari Logo" 
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
                <div>
                  <h1 className="font-comfortaa font-bold text-lg sm:text-xl text-primary">Parent Dashboard</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Supporting {childProgress.name}'s Journey</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('home')}>
                  <HomeIcon className="h-4 w-4 mr-1" />
                  <span className="hidden xs:inline">Back to Dashboard</span>
                </Button>
                <Badge variant="secondary">Parent</Badge>
              </div>
            </div>
          </div>
        </header>
        <InfoSection userType="parent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
                alt="Negari Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <div>
                <h1 className="font-comfortaa font-bold text-lg sm:text-xl text-primary">Parent Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Supporting {childProgress.name}'s Journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative">
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  <span className="text-xs sm:text-sm font-medium">Account</span>
                </button>

                {showAccountMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border border-border overflow-hidden z-50 bg-popover text-popover-foreground">
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
              <Badge variant="secondary">Parent</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            <TabsList className="inline-flex w-max min-w-full text-xs sm:text-sm bg-transparent">
              <TabsTrigger value="home" className="whitespace-nowrap">{t('home')}</TabsTrigger>
              <TabsTrigger value="progress" className="whitespace-nowrap">Progress</TabsTrigger>
              <TabsTrigger value="financial" className="whitespace-nowrap">Financial</TabsTrigger>
              <TabsTrigger value="support" className="whitespace-nowrap">Support</TabsTrigger>
              <TabsTrigger value="info" className="whitespace-nowrap">{t('info')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-6">
            {/* Child Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Child Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{childProgress.name}</h3>
                    <p className="text-muted-foreground">{childProgress.grade}</p>
                    <p className="text-sm">GPA: {childProgress.gpa}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{childProgress.applications}</div>
                    <p className="text-sm text-muted-foreground">Active Applications</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{childProgress.scholarships}</div>
                    <p className="text-sm text-muted-foreground">Scholarships Found</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{childProgress.completionRate}%</div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming deadlines</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Financial planning data not available yet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Child's Progress Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Current GPA:</span>
                        <span className="font-semibold">{childProgress.gpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grade Level:</span>
                        <span className="font-semibold">{childProgress.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Class Rank:</span>
                        <span className="font-semibold">N/A</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Submitted:</span>
                        <span className="font-semibold text-green-600">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress:</span>
                        <span className="font-semibold text-yellow-600">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Planned:</span>
                        <span className="font-semibold text-blue-600">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Test Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>SAT:</span>
                        <span className="font-semibold">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IELTS:</span>
                        <span className="font-semibold">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TOEFL:</span>
                        <span className="font-semibold">N/A</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Financial Planning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Cost breakdown not available yet</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Funding Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Funding strategy not configured yet</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Parent Support Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Parent Support Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Connect with other parents going through the same journey</p>
                    <Button className="w-full">Join Community</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Financial Aid Webinars
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Learn about financing international education</p>
                    <Button className="w-full" variant="outline">Schedule Session</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      University Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Comprehensive guides about universities and programs</p>
                    <Button className="w-full" variant="outline">Access Guides</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500" />
                      Visa & Immigration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Expert guidance on visa applications and processes</p>
                    <Button className="w-full" variant="outline">Get Help</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FunctionalParentDashboard;
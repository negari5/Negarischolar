import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import InfoSection from '@/components/InfoSection';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, GraduationCap, TrendingUp, Award, Building,
  BarChart3, Globe, Target, Info, Home as HomeIcon,
  CheckCircle, Clock, BookOpen, Shield, UserCircle, User, Settings, LogOut
} from 'lucide-react';

const FunctionalSchoolDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
                  <h1 className="font-comfortaa font-bold text-lg sm:text-xl text-primary">School Dashboard</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Bole High School - International Programs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('home')}>
                  <HomeIcon className="h-4 w-4 mr-1" />
                  <span className="hidden xs:inline">Back to Dashboard</span>
                </Button>
                <Badge variant="secondary">School Partner</Badge>
              </div>
            </div>
          </div>
        </header>
        <InfoSection userType="school" />
      </div>
    );
  }

  // TODO: Fetch from database
  const schoolStats = {
    totalStudents: 0,
    activeApplications: 0,
    successRate: 0,
    partnershipsActive: 0,
    scholarshipWinners: 0
  };

  const recentActivity: any[] = [];

  const partnerships: any[] = [];

  const representativeInfo = {
    name: 'N/A',
    position: 'N/A',
    email: 'N/A',
    phone: 'N/A',
    experience: 'N/A'
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img 
                src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
                alt="Negari Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <div>
                <h1 className="font-comfortaa font-bold text-lg sm:text-xl text-primary">School Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Bole High School - International Programs</p>
              </div>
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

              <Badge variant="secondary" className="hidden sm:inline-flex">School Partner</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            <TabsList className="inline-flex w-max min-w-full text-xs sm:text-sm bg-transparent">
              <TabsTrigger value="home" className="whitespace-nowrap">{t('home')}</TabsTrigger>
              <TabsTrigger value="students" className="whitespace-nowrap">Students</TabsTrigger>
              <TabsTrigger value="partnerships" className="whitespace-nowrap">Partnerships</TabsTrigger>
              <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics</TabsTrigger>
              <TabsTrigger value="representative" className="whitespace-nowrap">Representative</TabsTrigger>
              <TabsTrigger value="info" className="whitespace-nowrap">{t('info')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-6">
            {/* School Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{schoolStats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{schoolStats.activeApplications}</div>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{schoolStats.successRate}%</div>
                  <p className="text-xs text-muted-foreground">Acceptance rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{schoolStats.partnershipsActive}</div>
                  <p className="text-xs text-muted-foreground">Active partnerships</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Winners This Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{schoolStats.scholarshipWinners}</div>
                  <p className="text-xs text-muted-foreground">Scholarship recipients</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Student Activity</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      View All Students
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Add New Student
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Partnership Opportunities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Student Management</h2>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Grade 9:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grade 10:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grade 11:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grade 12:</span>
                        <span className="font-semibold">0 students</span>
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
                        <span>Preparing:</span>
                        <span className="font-semibold text-yellow-600">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Submitted:</span>
                        <span className="font-semibold text-blue-600">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accepted:</span>
                        <span className="font-semibold text-green-600">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>With Scholarships:</span>
                        <span className="font-semibold text-purple-600">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Destinations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>USA:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UK:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Canada:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Australia:</span>
                        <span className="font-semibold">0 students</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="partnerships">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">University Partnerships</h2>
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Partnerships Yet</h3>
                  <p className="text-muted-foreground">Start building university partnerships to expand opportunities.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">School Performance Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Success Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-2xl font-bold text-muted-foreground">N/A</p>
                      <p className="text-muted-foreground">No historical data available</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Applications:</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <Progress value={0} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Acceptances:</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <Progress value={0} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="representative">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">School Representative Information</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Primary Representative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg font-semibold">{representativeInfo.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Position</label>
                        <p className="text-lg">{representativeInfo.position}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Experience</label>
                        <p className="text-lg">{representativeInfo.experience}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{representativeInfo.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-lg">{representativeInfo.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button>Update Information</Button>
                        <Button variant="outline">Contact Support</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FunctionalSchoolDashboard;
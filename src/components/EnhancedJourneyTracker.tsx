import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import InfoSection from '@/components/InfoSection';
import DreamTracker from '@/components/DreamTracker';
import { 
  Target, Calendar, Trophy, BookOpen, Users, 
  CheckCircle, Clock, Star, TrendingUp, Award,
  MessageCircle, Video, FileText, ExternalLink
} from 'lucide-react';

const EnhancedJourneyTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('journey');
  const isMobile = useIsMobile();

  const journeyStats = {
    totalGoals: 12,
    completedGoals: 8,
    scholarshipsApplied: 5,
    mentorSessions: 3,
    completionRate: 67
  };

  const milestones = [
    { id: 1, title: 'Profile Setup', completed: true, date: '2024-01-15' },
    { id: 2, title: 'First Scholarship Research', completed: true, date: '2024-01-20' },
    { id: 3, title: 'IELTS Preparation Started', completed: true, date: '2024-02-01' },
    { id: 4, title: 'First Mentor Session', completed: true, date: '2024-02-10' },
    { id: 5, title: 'University Application', completed: false, date: '2024-03-01' },
    { id: 6, title: 'Scholarship Application', completed: false, date: '2024-03-15' }
  ];

  const achievements = [
    { title: 'First Steps', description: 'Completed profile setup', icon: CheckCircle, color: 'text-green-500' },
    { title: 'Research Master', description: 'Found 10+ scholarships', icon: BookOpen, color: 'text-blue-500' },
    { title: 'Social Connector', description: 'Connected with 5 mentors', icon: Users, color: 'text-purple-500' },
    { title: 'Goal Achiever', description: 'Completed 5 goals', icon: Trophy, color: 'text-yellow-500' }
  ];

  const upcomingTasks = [
    { task: 'Complete IELTS Registration', deadline: '2024-12-01', priority: 'high' },
    { task: 'Submit University Application', deadline: '2024-12-15', priority: 'high' },
    { task: 'Prepare Personal Statement', deadline: '2024-11-30', priority: 'medium' },
    { task: 'Schedule Mentor Session', deadline: '2024-11-28', priority: 'low' }
  ];

  const resources = [
    { 
      title: 'Scholarship Writing Guide', 
      type: 'PDF Guide', 
      description: 'Complete guide to writing winning scholarship essays',
      action: 'Download'
    },
    { 
      title: 'University Application Checklist', 
      type: 'Checklist', 
      description: 'Don\'t miss any important requirements',
      action: 'View'
    },
    { 
      title: 'IELTS Practice Tests', 
      type: 'Online Test', 
      description: 'Practice tests with instant feedback',
      action: 'Start Test'
    },
    { 
      title: 'Webinar: Study Abroad Success', 
      type: 'Video', 
      description: 'Learn from successful international students',
      action: 'Watch'
    }
  ];

  if (activeTab === 'info') {
    return (
      <div className="space-y-6">
        <InfoSection userType="student" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="journey">My Journey</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="info">Resources & Info</TabsTrigger>
        </TabsList>

        <TabsContent value="journey" className="space-y-6">
          {/* Journey Overview Stats */}
          <div className={`grid grid-cols-2 ${isMobile ? 'lg:grid-cols-3' : 'lg:grid-cols-5'} gap-4`}>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{journeyStats.totalGoals}</div>
                <p className="text-sm text-muted-foreground">Total Goals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{journeyStats.completedGoals}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{journeyStats.scholarshipsApplied}</div>
                <p className="text-sm text-muted-foreground">Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{journeyStats.mentorSessions}</div>
                <p className="text-sm text-muted-foreground">Mentor Sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{journeyStats.completionRate}%</div>
                <p className="text-sm text-muted-foreground">Completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Dream Tracker Integration */}
          <DreamTracker />

          {/* Milestones Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Journey Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{milestone.date}</p>
                    </div>
                    {milestone.completed && (
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{task.task}</h4>
                      <p className="text-sm text-muted-foreground">Due: {task.deadline}</p>
                    </div>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' : 
                      task.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`p-2 rounded-lg bg-background ${achievement.color}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Profile Completion</span>
                    <span className="font-semibold">90%</span>
                  </div>
                  <Progress value={90} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Application Readiness</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Test Preparation</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Scholarship Research</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>This Month's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-primary mb-2">15</div>
                <p className="text-muted-foreground mb-4">Goals completed this month</p>
                <Badge className="bg-green-100 text-green-800">+25% from last month</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          {/* Enhanced Resources Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{resource.title}</h4>
                        <Badge variant="outline" className="text-xs mt-1">{resource.type}</Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        {resource.action} <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Section Integration */}
          <InfoSection userType="student" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedJourneyTracker;
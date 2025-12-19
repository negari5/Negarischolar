import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap, Target, Brain, Calendar, Book, Globe, 
  TrendingUp, Users, Award, MessageCircle 
} from 'lucide-react';

const UserTypeBasedContent: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  const getContentForUserType = () => {
    switch (profile.user_type) {
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'Essential tools and guidance for students pursuing international education',
          modules: [
            {
              icon: <Book className="h-6 w-6 text-primary" />,
              title: 'Scholarship Explorer',
              description: 'Discover scholarships that match your profile and interests',
              status: 'available'
            },
            {
              icon: <Target className="h-6 w-6 text-secondary" />,
              title: 'Readiness Assessment',
              description: 'Evaluate your preparation level for international education',
              status: 'available'
            },
            {
              icon: <Award className="h-6 w-6 text-accent" />,
              title: 'Application Tracker',
              description: 'Manage your scholarship and university applications',
              status: 'available'
            },
            {
              icon: <Brain className="h-6 w-6 text-primary" />,
              title: 'AI Essay Coach',
              description: 'Get AI-powered assistance with your application essays',
              status: 'premium'
            }
          ]
        };

      case 'parent':
        return {
          title: 'Parent Dashboard',
          description: 'Support your child\'s educational journey with comprehensive tools',
          modules: [
            {
              icon: <Users className="h-6 w-6 text-secondary" />,
              title: 'Family Progress',
              description: 'Track your child\'s application progress and milestones',
              status: 'available'
            },
            {
              icon: <Calendar className="h-6 w-6 text-primary" />,
              title: 'Deadline Management',
              description: 'Stay informed about important application deadlines',
              status: 'available'
            },
            {
              icon: <Globe className="h-6 w-6 text-accent" />,
              title: 'University Information',
              description: 'Research universities and programs for your child',
              status: 'available'
            },
            {
              icon: <MessageCircle className="h-6 w-6 text-secondary" />,
              title: 'Family Communication',
              description: 'Coordinate with your child and mentors',
              status: 'available'
            }
          ]
        };

      case 'mentor':
        return {
          title: 'Mentor Dashboard',
          description: 'Guide and support students on their educational journey',
          modules: [
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: 'Student Management',
              description: 'Manage your mentees and track their progress',
              status: 'available'
            },
            {
              icon: <MessageCircle className="h-6 w-6 text-secondary" />,
              title: 'Communication Hub',
              description: 'Connect with students and their families',
              status: 'available'
            },
            {
              icon: <Target className="h-6 w-6 text-accent" />,
              title: 'Progress Tracking',
              description: 'Monitor student achievements and milestones',
              status: 'available'
            },
            {
              icon: <Award className="h-6 w-6 text-primary" />,
              title: 'Success Stories',
              description: 'Share and celebrate student successes',
              status: 'available'
            }
          ]
        };

      case 'school':
        return {
          title: 'School Dashboard',
          description: 'Manage your institution\'s international education programs',
          modules: [
            {
              icon: <GraduationCap className="h-6 w-6 text-secondary" />,
              title: 'Student Analytics',
              description: 'Track your students\' international education progress',
              status: 'available'
            },
            {
              icon: <Globe className="h-6 w-6 text-primary" />,
              title: 'Partnership Programs',
              description: 'Manage partnerships with international institutions',
              status: 'available'
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-accent" />,
              title: 'Performance Reports',
              description: 'Generate reports on student success rates',
              status: 'available'
            },
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: 'Staff Management',
              description: 'Coordinate with counselors and administrators',
              status: 'available'
            }
          ]
        };

      case 'admin':
      case 'super_admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage the Negari platform and support student success',
          modules: [
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: 'User Management',
              description: 'Manage student accounts, types, and platform access',
              status: 'available'
            },
            {
              icon: <Award className="h-6 w-6 text-secondary" />,
              title: 'Scholarship Management',
              description: 'Add, update, and manage scholarship opportunities',
              status: 'available'
            },
            {
              icon: <Book className="h-6 w-6 text-accent" />,
              title: 'Content Management',
              description: 'Upload resources, manage learning materials',
              status: 'available'
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-primary" />,
              title: 'Analytics & Reports',
              description: 'Monitor platform performance and generate insights',
              status: 'available'
            }
          ]
        };

      default:
        return null;
    }
  };

  const content = getContentForUserType();
  if (!content) return null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">{content.title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{content.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.modules.map((module, index) => (
          <Card 
            key={index} 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
              module.status === 'premium' 
                ? 'border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent' 
                : 'hover:border-primary/30'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {module.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-primary">{module.title}</CardTitle>
                    {module.status === 'premium' && (
                      <Badge className="bg-secondary text-white mt-1">Premium</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{module.description}</p>
              
              {module.status === 'premium' && (
                <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    🌟 Upgrade to Premium for advanced features
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Type Specific Tips */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-primary">Personalized Tips for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.user_type === 'student' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Apply to multiple scholarships to increase your chances of success
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Start your application process early and prepare all required documents
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Take the readiness assessment to identify areas for improvement
                </p>
              </>
            )}
            
            {profile.user_type === 'parent' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Stay involved in your child's application journey while respecting their independence
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Help with financial planning and understanding visa requirements
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Connect with other parents who have supported successful applicants
                </p>
              </>
            )}
            
            {profile.user_type === 'mentor' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Provide regular check-ins and personalized guidance to your mentees
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Share your experience and connect students with relevant opportunities
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Help students build confidence and overcome application anxiety
                </p>
              </>
            )}
            
            {profile.user_type === 'school' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Support your students with institutional backing and resources
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Build partnerships with international institutions for student exchanges
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Track and celebrate your students' international education successes
                </p>
              </>
            )}

            {(profile.user_type === 'admin' || profile.user_type === 'super_admin') && (
              <>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Keep scholarship information accurate and up-to-date
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Monitor user feedback to improve the platform experience
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                  Regularly review and update learning resources and content
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeBasedContent;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, Users, Award, Calendar, FileText, 
  Phone, Mail, MapPin, Globe, Clock, 
  CheckCircle, AlertCircle, Star
} from 'lucide-react';

interface InfoSectionProps {
  userType: 'student' | 'mentor' | 'parent' | 'school';
}

const InfoSection: React.FC<InfoSectionProps> = ({ userType }) => {
  const getInfoContent = () => {
    switch (userType) {
      case 'student':
        return {
          title: 'Student Information Hub',
          sections: [
            {
              title: 'Quick Stats',
              icon: <Award className="h-5 w-5" />,
              items: [
                'No data available yet. Start your journey to see your stats!'
              ]
            },
            {
              title: 'Upcoming Deadlines',
              icon: <Calendar className="h-5 w-5" />,
              items: [
                'No upcoming deadlines. Add scholarship applications to track deadlines.'
              ]
            },
            {
              title: 'Recent Activity',
              icon: <CheckCircle className="h-5 w-5" />,
              items: [
                'No recent activity. Start exploring scholarships and resources!'
              ]
            }
          ]
        };
      
      case 'mentor':
        return {
          title: 'Mentor Information Hub',
          sections: [
            {
              title: 'Mentoring Stats',
              icon: <Users className="h-5 w-5" />,
              items: [
                'No mentees assigned yet. Start accepting mentoring requests!'
              ]
            },
            {
              title: 'Upcoming Sessions',
              icon: <Calendar className="h-5 w-5" />,
              items: [
                'No upcoming sessions. Schedule sessions with your mentees!'
              ]
            },
            {
              title: 'Recognition',
              icon: <Star className="h-5 w-5" />,
              items: [
                'Your achievements will be displayed here as you mentor students.'
              ]
            }
          ]
        };

      case 'parent':
        return {
          title: 'Parent Information Hub',
          sections: [
            {
              title: 'Your Child\'s Progress',
              icon: <Users className="h-5 w-5" />,
              items: [
                'Link your child\'s account to view their progress here.'
              ]
            },
            {
              title: 'Financial Planning',
              icon: <FileText className="h-5 w-5" />,
              items: [
                'Financial planning tools will be available once your child starts applications.'
              ]
            },
            {
              title: 'Support Resources',
              icon: <Info className="h-5 w-5" />,
              items: [
                'Access parent support resources and guides in the resources section.'
              ]
            }
          ]
        };

      case 'school':
        return {
          title: 'School Information Hub',
          sections: [
            {
              title: 'Institution Stats',
              icon: <Award className="h-5 w-5" />,
              items: [
                'Your school statistics will appear here as students register.'
              ]
            },
            {
              title: 'Representative Info',
              icon: <Users className="h-5 w-5" />,
              items: [
                'Update your school representative information in settings.'
              ]
            },
            {
              title: 'Partnership Benefits',
              icon: <CheckCircle className="h-5 w-5" />,
              items: [
                'Explore partnership benefits and features available to schools.'
              ]
            }
          ]
        };

      default:
        return {
          title: 'Information Hub',
          sections: []
        };
    }
  };

  const info = getInfoContent();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Info className="h-6 w-6 text-primary" />
        <h2 className="text-xl sm:text-2xl font-comfortaa font-bold text-primary">{info.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {info.sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Information */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Phone className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-secondary" />
              <span className="text-sm">support@negari.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-secondary" />
              <span className="text-sm">+251-911-000000</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-sm">24/7 Support Available</span>
            </div>
          </div>
          <Button className="mt-4" size="sm">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoSection;
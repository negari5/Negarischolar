import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Zap, Sprout } from 'lucide-react';

interface UserTypeSelectorProps {
  onSelectUserType: (userType: 'starter' | 'senior' | 'rise' | 'junior') => void;
  selectedType: string | null;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelectUserType, selectedType }) => {
  const userTypes = [
    {
      id: 'junior',
      title: 'Negari Junior',
      subtitle: 'Grades 10-11 - Early Prep',
      description: 'Get ahead with early preparation. Build study habits, explore streams, and set scholarship dreams.',
      icon: <Sprout className="h-8 w-8 text-green-600" />,
      color: 'border-green-200 hover:border-green-400'
    },
    {
      id: 'starter',
      title: 'Negari Starter Kit',
      subtitle: 'Grade 12 - Pre-Exam',
      description: 'Focus on exam prep, document readiness, and scholarship awareness to ace your finals.',
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      color: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 'senior',
      title: 'Negari Senior',
      subtitle: 'Post-Grade 12 - Exam Completed',
      description: 'Ready to explore scholarships? Get personalized guidance, application help, and premium features.',
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      color: 'border-purple-200 hover:border-purple-400'
    },
    {
      id: 'rise',
      title: 'Negari RISE',
      subtitle: 'Alternative Track',
      description: 'Turn setbacks into opportunities. Explore alternative paths, build skills, and stay motivated.',
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      color: 'border-orange-200 hover:border-orange-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-negari-indigo mb-2">Choose Your Journey</h3>
        <p className="text-gray-600 text-sm">Select the path that matches your current academic stage</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {userTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all duration-200 ${type.color} ${
              selectedType === type.id ? 'ring-2 ring-negari-orange bg-orange-50' : 'hover:shadow-md'
            } min-h-[180px] p-6`}
            onClick={() => onSelectUserType(type.id as 'starter' | 'senior' | 'rise' | 'junior')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {type.icon}
                <div>
                  <CardTitle className="text-base font-semibold text-negari-indigo">
                    {type.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-gray-500">
                    {type.subtitle}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                {type.description}
              </p>
              {selectedType === type.id && (
                <div className="mt-3 flex justify-center">
                  <Button size="sm" className="bg-negari-orange hover:bg-negari-indigo text-white">
                    Selected ✓
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Target, Heart, BookOpen, Briefcase, Globe, Users, Lightbulb, Trophy } from 'lucide-react';

const UpdateMyDream = () => {
  const [dreamCategory, setDreamCategory] = useState('');
  const [dreamDetails, setDreamDetails] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const { toast } = useToast();

  const dreamCategories = [
    { value: 'education', label: 'Higher Education', icon: BookOpen },
    { value: 'career', label: 'Career Goals', icon: Briefcase },
    { value: 'entrepreneurship', label: 'Start a Business', icon: Lightbulb },
    { value: 'travel', label: 'Study Abroad', icon: Globe },
    { value: 'community', label: 'Community Impact', icon: Users },
    { value: 'personal', label: 'Personal Development', icon: Heart },
    { value: 'competition', label: 'Competitions & Awards', icon: Trophy },
    { value: 'skills', label: 'Skill Development', icon: Target }
  ];

  const timeframes = [
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
    { value: '5years', label: '5 Years' },
    { value: '10years', label: '10+ Years' }
  ];

  const handleSave = () => {
    if (!dreamCategory || !dreamDetails || !timeframe) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to update your dream.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Dream Updated!",
      description: "Your dream has been saved successfully. Keep working towards it!"
    });

    // Reset form
    setDreamCategory('');
    setDreamDetails('');
    setTimeframe('');
  };

  const selectedCategory = dreamCategories.find(cat => cat.value === dreamCategory);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-negari-indigo">
          {selectedCategory && <selectedCategory.icon className="h-5 w-5" />}
          Update My Dream
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dreamCategory">What's your main dream category?</Label>
          <Select value={dreamCategory} onValueChange={setDreamCategory}>
            <SelectTrigger className="bg-white/80 rounded-lg">
              <SelectValue placeholder="Select your dream category" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm rounded-lg">
              {dreamCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dreamDetails">Tell us more about your dream</Label>
          <Textarea
            id="dreamDetails"
            value={dreamDetails}
            onChange={(e) => setDreamDetails(e.target.value)}
            placeholder="Describe your dream in detail. What exactly do you want to achieve? Why is this important to you?"
            className="bg-white/80 rounded-lg min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeframe">When do you want to achieve this?</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="bg-white/80 rounded-lg">
              <SelectValue placeholder="Select your timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm rounded-lg">
              {timeframes.map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-negari-orange hover:bg-negari-indigo text-white font-semibold py-3 rounded-lg"
        >
          Save My Dream
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateMyDream;

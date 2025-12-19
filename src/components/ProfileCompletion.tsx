import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Phone, Calendar, MapPin, GraduationCap, Target } from 'lucide-react';

interface ProfileCompletionProps {
  onComplete: () => void;
}

const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Hawassa', 'Bahir Dar', 
  'Dessie', 'Jimma', 'Jijiga', 'Shashemene', 'Nekemte', 'Debre Markos',
  'Harar', 'Kombolcha', 'Debre Birhan', 'Arba Minch', 'Hosaena', 'Debre Zeit'
];

const FIELDS_OF_STUDY = [
  'Engineering', 'Medicine', 'Computer Science', 'Business Administration',
  'Economics', 'Law', 'International Relations', 'Psychology', 'Biology',
  'Chemistry', 'Physics', 'Mathematics', 'Architecture', 'Agriculture',
  'Education', 'Journalism', 'Pharmacy', 'Dentistry', 'Veterinary Medicine',
  'Environmental Science', 'Public Health', 'Social Work', 'Art & Design'
];

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Australia', 'New Zealand',
  'Japan', 'South Korea', 'Singapore', 'Switzerland', 'Austria', 'Belgium',
  'Italy', 'Spain', 'Ireland', 'Finland', 'Turkey', 'South Africa'
];

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    user_type: profile?.user_type || 'student',
    city: profile?.city || '',
    preparatory_school_type: profile?.preparatory_school_type || '',
    education_level: profile?.education_level || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    current_grade_level: profile?.current_grade_level || '',
    school_name: profile?.school_name || '',
    gpa: profile?.gpa?.toString() || '',
    career_interests: profile?.career_interests || [],
    preferred_countries: profile?.preferred_countries || [],
    preferred_fields: profile?.preferred_fields || [],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const updateData = {
        ...formData,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        has_completed_profile: true
      };

      console.log('Submitting profile update:', updateData);
      const { error } = await updateProfile(updateData);
      
      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Profile updated successfully');
      toast({
        title: "Profile Completed!",
        description: "Welcome to Negari! Let's start your journey.",
      });
      
      // Wait a bit for the database to update before redirecting
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeDescription = (type: string) => {
    switch (type) {
      case 'student': return 'Students looking for scholarship opportunities';
      case 'parent': return 'Parents supporting their child\'s education journey';
      case 'mentor': return 'Mentors guiding and supporting students';
      case 'school': return 'Educational institutions and representatives';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-sunrise-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-negari-indigo">Complete Your Profile</CardTitle>
          <p className="text-gray-600">Help us personalize your Negari experience</p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-1 ${
                  step >= stepNumber ? 'bg-negari-orange text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-negari-indigo flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user_type">I am a...</Label>
                  <Select value={formData.user_type} onValueChange={(value) => handleInputChange('user_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="student">
                          <div>
                            <div className="font-medium">Student</div>
                            <div className="text-sm text-gray-500">I am a student looking for scholarship opportunities</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="parent">
                          <div>
                            <div className="font-medium">Parent</div>
                            <div className="text-sm text-gray-500">I am a parent supporting my child's education</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="mentor">
                          <div>
                            <div className="font-medium">Mentor</div>
                            <div className="text-sm text-gray-500">I want to guide and support students</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="school">
                          <div>
                            <div className="font-medium">School</div>
                            <div className="text-sm text-gray-500">I represent an educational institution</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {ETHIOPIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+251..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-negari-indigo flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education_level">Education Level</Label>
                    <Select value={formData.education_level} onValueChange={(value) => handleInputChange('education_level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="grade10">Grade 10</SelectItem>
                        <SelectItem value="grade11">Grade 11</SelectItem>
                        <SelectItem value="grade12">Grade 12</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preparatory_school_type">School Type</Label>
                    <Select value={formData.preparatory_school_type} onValueChange={(value) => handleInputChange('preparatory_school_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="public">Public School</SelectItem>
                        <SelectItem value="private">Private School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="school_name">School Name</Label>
                  <Input
                    id="school_name"
                    value={formData.school_name}
                    onChange={(e) => handleInputChange('school_name', e.target.value)}
                    placeholder="Your current or most recent school"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_grade_level">Current Grade (if applicable)</Label>
                    <Input
                      id="current_grade_level"
                      value={formData.current_grade_level}
                      onChange={(e) => handleInputChange('current_grade_level', e.target.value)}
                      placeholder="e.g., Grade 12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gpa">GPA/Average (if known)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      placeholder="e.g., 3.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-negari-indigo flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Interests & Goals
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label>Fields of Study (select all that interest you)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {FIELDS_OF_STUDY.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={formData.preferred_fields.includes(field)}
                          onCheckedChange={() => handleArrayToggle('preferred_fields', field)}
                        />
                        <Label htmlFor={field} className="text-sm">{field}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Preferred Countries (select up to 5)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {COUNTRIES.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={country}
                          checked={formData.preferred_countries.includes(country)}
                          onCheckedChange={() => handleArrayToggle('preferred_countries', country)}
                          disabled={!formData.preferred_countries.includes(country) && formData.preferred_countries.length >= 5}
                        />
                        <Label htmlFor={country} className="text-sm">{country}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Career Interests (select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {[
                      'Research & Academia', 'Healthcare', 'Technology', 'Business & Finance',
                      'Engineering', 'Education', 'Government & Policy', 'Non-profit & NGO',
                      'Arts & Creative', 'Sports & Athletics', 'Media & Communications', 'Entrepreneurship'
                    ].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.career_interests.includes(interest)}
                          onCheckedChange={() => handleArrayToggle('career_interests', interest)}
                        />
                        <Label htmlFor={interest} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={step === 1}
              className="px-6"
            >
              Previous
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                variant="default"
                className="px-6"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                variant="default"
                className="px-6"
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
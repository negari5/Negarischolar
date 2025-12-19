import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Phone, MapPin, GraduationCap, BookOpen } from 'lucide-react';

interface MentorRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MentorRegistrationForm: React.FC<MentorRegistrationFormProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentUniversity: '',
    degree: '',
    fieldOfStudy: '',
    graduationYear: '',
    experience: '',
    expertise: '',
    bio: '',
    availability: 'part_time',
    languages: ''
  });

  const getEdgeFunctionErrorMessage = async (error: any) => {
    const ctx = error?.context;
    const status = ctx?.status;

    let bodyMessage = '';
    try {
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json();
        bodyMessage = body?.error || body?.message || '';
      }
    } catch {
      // ignore
    }

    if (status === 404) {
      return 'User creation requires the Supabase Edge Function `create-user-with-email` to be deployed in this project.';
    }
    if (status === 401) {
      return bodyMessage || 'You must be logged in to create users.';
    }
    if (status === 403) {
      return bodyMessage || 'You do not have permission to create users.';
    }

    return bodyMessage || error?.message || 'Failed to create mentor.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-user-with-email', {
        body: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.location,
          userType: 'mentor',
          isAdmin: false,
        },
      });

      if (error) {
        throw new Error(await getEdgeFunctionErrorMessage(error));
      }
      if ((data as any)?.error) throw new Error((data as any)?.error);

      toast({
        title: 'Invite Sent',
        description: 'Mentor invited successfully. They will receive an email invite if SMTP/Auth email is configured in Supabase.',
      });
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to create mentor.',
        variant: 'destructive',
      });
      return;
    } finally {
      setIsSubmitting(false);
    }
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      currentUniversity: '',
      degree: '',
      fieldOfStudy: '',
      graduationYear: '',
      experience: '',
      expertise: '',
      bio: '',
      availability: 'part_time',
      languages: ''
    });
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mentor Application Form
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Current Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-10"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Educational Background */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Educational Background</h3>
            <div>
              <Label htmlFor="currentUniversity">University/Institution *</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentUniversity"
                  className="pl-10"
                  value={formData.currentUniversity}
                  onChange={(e) => handleInputChange('currentUniversity', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degree">Degree Level *</Label>
                <Select value={formData.degree} onValueChange={(value) => handleInputChange('degree', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's</SelectItem>
                    <SelectItem value="master">Master's</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="professional">Professional Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear() + 10}
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="fieldOfStudy">Field of Study *</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fieldOfStudy"
                  className="pl-10"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Mentoring Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Mentoring Information</h3>
            <div>
              <Label htmlFor="experience">Previous Mentoring/Teaching Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe any previous mentoring, tutoring, or teaching experience..."
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="expertise">Areas of Expertise *</Label>
              <Textarea
                id="expertise"
                placeholder="List your areas of expertise (e.g., Application Essays, Interview Preparation, Scholarship Search, etc.)"
                value={formData.expertise}
                onChange={(e) => handleInputChange('expertise', e.target.value)}
                required
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio/Personal Statement *</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself and why you want to be a mentor (minimum 100 words)"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                required
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="part_time">Part-time (5-10 hours/week)</SelectItem>
                    <SelectItem value="flexible">Flexible (As needed)</SelectItem>
                    <SelectItem value="limited">Limited (1-3 hours/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  placeholder="e.g., English, Amharic, Oromo"
                  value={formData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorRegistrationForm;
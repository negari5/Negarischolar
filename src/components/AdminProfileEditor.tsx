import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Save, X, Crown, Shield } from 'lucide-react';

interface AdminProfileEditorProps {
  adminUser?: any;
  onUpdate?: () => void;
}

const AdminProfileEditor: React.FC<AdminProfileEditorProps> = ({ adminUser, onUpdate }) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use passed adminUser or current profile
  const targetUser = adminUser || profile;
  
  const [formData, setFormData] = useState({
    first_name: targetUser?.first_name || '',
    last_name: targetUser?.last_name || '',
    education_level: targetUser?.education_level || '',
    city: targetUser?.city || '',
    preparatory_school_type: targetUser?.preparatory_school_type || '',
    phone: targetUser?.phone || ''
  });

  const ethiopianCities = [
    'Addis Ababa', 'Dire Dawa', 'Hawassa', 'Mekelle', 'Adama', 'Gondar',
    'Dessie', 'Jimma', 'Jijiga', 'Shashamene', 'Bahir Dar', 'Kombolcha',
    'Debre Markos', 'Harar', 'Dila', 'Nekemte', 'Debre Berhan', 'Asella',
    'Adigrat', 'Wukro'
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Profile has been successfully updated!",
        });
        setIsOpen(false);
        onUpdate?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: targetUser?.first_name || '',
      last_name: targetUser?.last_name || '',
      education_level: targetUser?.education_level || '',
      city: targetUser?.city || '',
      preparatory_school_type: targetUser?.preparatory_school_type || '',
      phone: targetUser?.phone || ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {targetUser?.is_super_admin ? (
              <Crown className="h-5 w-5 text-primary" />
            ) : targetUser?.is_admin ? (
              <Shield className="h-5 w-5 text-secondary" />
            ) : (
              <User className="h-5 w-5" />
            )}
            Edit {targetUser?.is_super_admin ? 'Super Admin' : targetUser?.is_admin ? 'Admin' : 'User'} Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+251 9xx xxx xxx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData({...formData, city: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {ethiopianCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education_level">Education Level</Label>
            <Select
              value={formData.education_level}
              onValueChange={(value) => setFormData({...formData, education_level: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">Elementary School</SelectItem>
                <SelectItem value="middle_school">Middle School</SelectItem>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="preparatory">Preparatory School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preparatory_school_type">Preparatory School Type</Label>
            <Select
              value={formData.preparatory_school_type}
              onValueChange={(value) => setFormData({...formData, preparatory_school_type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select school type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public School</SelectItem>
                <SelectItem value="private">Private School</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading || !formData.first_name.trim() || !formData.last_name.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProfileEditor;

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, Mail, MapPin, GraduationCap, School, Camera, Home, X, Crown, Shield, Target, Check, Search, ChevronDown } from "lucide-react";
import { universities } from "@/data/universities";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import SelfAssessment from "@/components/SelfAssessment";
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydratedFromProfileRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    education_level: profile?.education_level || '',
    city: profile?.city || '',
    preparatory_school_type: profile?.preparatory_school_type || ''
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    currentPassword: '',
    confirmationCode: ''
  });

  const [goalsData, setGoalsData] = useState({
    dream_university: profile?.dream_university || '',
    dream_university_other: '',
    dream_major: profile?.dream_major || '',
    dream_major_other: '',
    target_country: profile?.target_country || '',
    target_country_other: '',
    career_interests: (profile?.career_interests || []).join(', '),
    career_interests_other: '',
    preferred_fields: profile?.preferred_fields || [] as string[],
    preferred_fields_other: '',
  });

  const [isEditingGoals, setIsEditingGoals] = useState(!profile?.has_completed_profile);

  const preferredFieldsOptions = [
    { value: 'stem', label: 'STEM (Science, Technology, Engineering, Math)' },
    { value: 'business', label: 'Business & Economics' },
    { value: 'health', label: 'Health Sciences' },
    { value: 'social_sciences', label: 'Social Sciences' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'education', label: 'Education' },
    { value: 'law', label: 'Law & Governance' },
    { value: 'agriculture', label: 'Agriculture & Food Systems' },
  ];

  const togglePreferredField = (value: string) => {
    setGoalsData(prev => {
      const currentFields = Array.isArray(prev.preferred_fields) ? prev.preferred_fields : [];
      if (currentFields.includes(value)) {
        return { ...prev, preferred_fields: currentFields.filter(f => f !== value) };
      } else {
        return { ...prev, preferred_fields: [...currentFields, value] };
      }
    });
  };

  const [countryFilter, setCountryFilter] = useState<'all' | 'best' | 'cheapest' | 'other'>('all');

  // University search state
  const [universitySearch, setUniversitySearch] = useState('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const universityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile || hydratedFromProfileRef.current) return;
    hydratedFromProfileRef.current = true;

    setFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      education_level: profile.education_level || '',
      city: profile.city || '',
      preparatory_school_type: profile.preparatory_school_type || ''
    });

    setGoalsData({
      dream_university: profile.dream_university || '',
      dream_university_other: '',
      dream_major: profile.dream_major || '',
      dream_major_other: '',
      target_country: profile.target_country || '',
      target_country_other: '',
      career_interests: (profile.career_interests || []).join(', '),
      career_interests_other: '',
      preferred_fields: profile.preferred_fields || ([] as string[]),
      preferred_fields_other: '',
    });

    setIsEditingGoals(!profile.has_completed_profile);

    const storedUni = profile.dream_university || '';
    if (storedUni) {
      const uniLabel = universities.find(u => u.value === storedUni)?.label;
      setUniversitySearch(uniLabel || storedUni);
    }
  }, [profile]);

  const filteredUniversities = universities.filter(uni =>
    uni.label.toLowerCase().includes(universitySearch.toLowerCase()) ||
    uni.country.toLowerCase().includes(universitySearch.toLowerCase())
  ).slice(0, 50); // Limit to 50 results for performance

  const [lastAssessment, setLastAssessment] = useState<any | null>(null);

  const ethiopianCities = [
    'Addis Ababa',
    'Dire Dawa',
    'Hawassa',
    'Mekelle',
    'Adama',
    'Gondar',
    'Dessie',
    'Jimma',
    'Jijiga',
    'Shashamane',
    'Bahir Dar',
    'Kombolcha',
    'Debre Markos',
    'Harar',
    'Dila',
    'Nekemte',
    'Debre Berhan',
    'Asella',
    'Adigrat',
    'Wukro'
  ];

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.first_name.trim() || !formData.last_name.trim()) {
        toast({
          title: "Validation Error",
          description: "First name and last name are required.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await updateProfile(formData);
      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      education_level: profile?.education_level || '',
      city: profile?.city || '',
      preparatory_school_type: profile?.preparatory_school_type || ''
    });
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChange = async () => {
    if (!user?.email) return;
    if (!emailData.newEmail.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please enter a new email address.',
        variant: 'destructive',
      });
      return;
    }
    if (!emailData.currentPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please enter your current password.',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingEmail(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: emailData.currentPassword,
      });

      if (signInError) {
        toast({
          title: 'Invalid current password',
          description: 'Please re-check your current password and try again.',
          variant: 'destructive',
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: emailData.newEmail.trim(),
      });

      if (updateError) {
        toast({
          title: 'Email update failed',
          description: updateError.message || 'Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Email update requested',
        description: 'Please check your inbox to confirm your new email address.',
      });
      setEmailData({ newEmail: '', currentPassword: '', confirmationCode: '' });
      setIsEditingEmail(false);
    } catch (e: any) {
      toast({
        title: 'Email update failed',
        description: e?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please enter your current and new password.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'New password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please confirm your new password.',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        toast({
          title: 'Invalid current password',
          description: 'Please re-check your current password and try again.',
          variant: 'destructive',
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        toast({
          title: 'Failed to change password',
          description: updateError.message || 'Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      toast({
        title: 'Failed to change password',
        description: e?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportMyData = async () => {
    if (!user?.id) return;
    setIsExporting(true);
    try {
      const userId = user.id;

      const [profileRes, appsRes, sessionsRes, messagesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('applications').select('*').eq('user_id', userId),
        supabase
          .from('mentor_sessions')
          .select('*')
          .or(`student_id.eq.${userId},mentor_id.eq.${userId}`),
        supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false }),
      ]);

      const exportPayload = {
        exported_at: new Date().toISOString(),
        user_id: userId,
        profile: profileRes.data,
        applications: appsRes.data || [],
        mentor_sessions: sessionsRes.data || [],
        messages: messagesRes.data || [],
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `negari-export-${userId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export ready',
        description: 'Your data export has been downloaded.',
      });
    } catch (e: any) {
      toast({
        title: 'Export failed',
        description: e?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      toast({
        title: 'Confirmation required',
        description: 'Type DELETE to confirm account deletion.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) {
        toast({
          title: 'Delete failed',
          description: error.message || 'Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      await supabase.auth.signOut();
      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.',
      });
      navigate('/', { replace: true });
    } catch (e: any) {
      toast({
        title: 'Delete failed',
        description: e?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteDialogOpen(false);
      setDeleteConfirmText('');
    }
  };

  const getEducationLevelDisplay = (level: string) => {
    const levels: { [key: string]: string } = {
      'elementary': 'Elementary School',
      'middle_school': 'Middle School',
      'high_school': 'High School',
      'preparatory': 'Preparatory School',
      'undergraduate': 'Undergraduate',
      'graduate': 'Graduate',
      'postgraduate': 'Postgraduate'
    };
    return levels[level] || level;
  };

  const getSchoolTypeDisplay = (type: string) => {
    return type === 'public' ? 'Public School' : type === 'private' ? 'Private School' : 'Not specified';
  };

  const isMobile = useIsMobile();

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const countryOptions = [
    // group: best, cheapest, other
    { value: 'africa', label: 'Africa (Region)', group: 'other' as const },
    { value: 'europe', label: 'Europe (Region)', group: 'other' as const },
    { value: 'asia', label: 'Asia (Region)', group: 'other' as const },
    { value: 'north_america', label: 'North America (Region)', group: 'other' as const },
    { value: 'south_america', label: 'South America (Region)', group: 'other' as const },
    { value: 'oceania', label: 'Oceania (Region)', group: 'other' as const },
    { value: 'antarctica', label: 'Antarctica (Region)', group: 'other' as const },
    { value: 'ethiopia', label: 'Ethiopia', group: 'cheapest' as const },
    { value: 'kenya', label: 'Kenya', group: 'cheapest' as const },
    { value: 'rwanda', label: 'Rwanda', group: 'cheapest' as const },
    { value: 'nigeria', label: 'Nigeria', group: 'cheapest' as const },
    { value: 'usa', label: 'United States', group: 'best' as const },
    { value: 'canada', label: 'Canada', group: 'best' as const },
    { value: 'uk', label: 'United Kingdom', group: 'best' as const },
    { value: 'germany', label: 'Germany', group: 'best' as const },
    { value: 'france', label: 'France', group: 'best' as const },
    { value: 'china', label: 'China', group: 'other' as const },
    { value: 'japan', label: 'Japan', group: 'other' as const },
    { value: 'australia', label: 'Australia', group: 'other' as const },
    { value: 'brazil', label: 'Brazil', group: 'other' as const },
  ];

  const getHomePath = () => {
    if (profile?.user_type === 'student') return '/student';
    if (profile?.user_type === 'mentor') return '/mentor';
    if (profile?.user_type === 'parent') return '/parent';
    if (profile?.user_type === 'school') return '/school';
    if (profile?.is_admin || profile?.is_super_admin) return '/admin';
    return '/student';
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastAssessment');
      if (stored) {
        setLastAssessment(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading last assessment:', error);
    }
  }, []);

  // Close university dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inputElement = universityInputRef.current;
      const dropdownParent = inputElement?.parentElement?.parentElement;
      
      if (dropdownParent && !dropdownParent.contains(target)) {
        setShowUniversityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:px-8 sm:py-8 space-y-4 sm:space-y-6">
        {/* Header with Home Button and Role Badge */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate(getHomePath())}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-negari-orange hover:text-white text-xs sm:text-sm rounded-lg"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{t('home')}</span>
          </Button>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <h1 className="text-lg sm:text-3xl font-bold text-negari-indigo text-center">{t('profile_my_profile')}</h1>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              {profile?.is_super_admin && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Super Admin</span>
                </Badge>
              )}
              {profile?.is_admin && !profile?.is_super_admin && (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Badge>
              )}
            </div>
          </div>
          <div className="w-10"></div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            navigate(`/profile?tab=${value}`, { replace: true });
          }}
          className="space-y-4"
        >
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            <TabsList className="inline-flex w-max min-w-full gap-1 text-xs sm:text-sm bg-transparent">
              <TabsTrigger value="profile" className="whitespace-nowrap">{t('profile_tab_profile')}</TabsTrigger>
              <TabsTrigger value="assessment" className="whitespace-nowrap">{t('profile_tab_assessment')}</TabsTrigger>
              <TabsTrigger value="goals" className="whitespace-nowrap">{t('profile_tab_goals')}</TabsTrigger>
              <TabsTrigger value="progress" className="whitespace-nowrap">{t('profile_tab_progress')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            {/* Profile Header */}
            <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                      <AvatarImage src={profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="bg-negari-orange/20 text-negari-orange text-lg sm:text-xl">
                        {(profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-negari-orange hover:bg-negari-indigo"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-negari-indigo">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : t('profile_complete_your_profile')
                      }
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                      {profile?.is_super_admin && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      )}
                      {profile?.is_admin && !profile?.is_super_admin && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {!profile?.is_admin && !profile?.is_super_admin && (
                        <Badge variant="outline">
                          User
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-negari-orange hover:text-white rounded-lg"
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">{isEditing ? t('profile_cancel') : t('profile_edit')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

          {/* Personal Information */}
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
                <User className="h-5 w-5" />
                {t('profile_personal_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                          placeholder="Enter your first name"
                          className="rounded-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          placeholder="Enter your last name"
                          className="rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => setFormData({...formData, city: value})}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          {ethiopianCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">{t('profile_first_name')}</Label>
                      <p className="text-negari-indigo font-medium">
                        {profile?.first_name || t('profile_not_provided')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{t('profile_last_name')}</Label>
                      <p className="text-negari-indigo font-medium">
                        {profile?.last_name || t('profile_not_provided')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-negari-indigo">
                      {profile?.city || t('profile_city_not_specified')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Educational Information */}
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
                <GraduationCap className="h-5 w-5" />
                {t('profile_educational_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="education_level">{t('profile_education_level')}</Label>
                    <Select
                      value={formData.education_level}
                      onValueChange={(value) => setFormData({...formData, education_level: value})}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
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
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select your preparatory school type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="public">Public School</SelectItem>
                        <SelectItem value="private">Private School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-negari-indigo">
                      {profile?.education_level ? getEducationLevelDisplay(profile.education_level) : t('profile_education_level_not_specified')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="text-negari-indigo">
                      {profile?.preparatory_school_type ? getSchoolTypeDisplay(profile.preparatory_school_type) : t('profile_school_type_not_specified')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Management */}
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
                <Mail className="h-5 w-5" />
                {t('profile_email_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('profile_current_email')}</Label>
                  <p className="text-negari-indigo font-medium break-all">{user?.email}</p>
                </div>
                <Dialog open={isEditingEmail} onOpenChange={setIsEditingEmail}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:bg-negari-orange hover:text-white rounded-lg">
                      {t('profile_change_email')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mx-4 max-w-md rounded-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('profile_change_email_title')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">{t('profile_new_email_address')}</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          value={emailData.newEmail}
                          onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})}
                          placeholder="Enter new email address"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('profile_current_password')}</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={emailData.currentPassword}
                          onChange={(e) => setEmailData({...emailData, currentPassword: e.target.value})}
                          placeholder="Enter current password"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="bg-muted/60 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-sm text-muted-foreground">
                          You will receive confirmation emails at both your current and new email addresses. 
                          Please confirm the change from both emails to complete the process.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleEmailChange}
                          disabled={isChangingEmail}
                          className="bg-negari-orange hover:bg-negari-indigo rounded-lg w-full"
                        >
                          {t('profile_send_confirmation')}
                        </Button>
                        <DialogClose asChild>
                          <Button variant="outline" className="rounded-lg w-full">
                            {t('profile_cancel')}
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Account & Security */}
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
                <Shield className="h-5 w-5" />
                {t('profile_account_security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rounded-lg">
                    {t('profile_change_password')}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-md rounded-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t('profile_change_password')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">{t('profile_current_password')}</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">{t('profile_new_password')}</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">{t('profile_confirm_new_password')}</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="bg-negari-orange hover:bg-negari-indigo rounded-lg w-full"
                      >
                        {isChangingPassword ? 'Updating…' : t('profile_update_password')}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded-lg w-full">
                          {t('profile_cancel')}
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="w-full justify-between rounded-lg"
                onClick={handleExportMyData}
                disabled={isExporting}
              >
                {isExporting ? t('profile_exporting') : t('profile_export_my_data')}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-between rounded-lg">
                    {t('profile_delete_account')}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-md rounded-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t('profile_delete_account_title')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t('profile_delete_warning')}
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="delete_confirm">{t('profile_type_delete_to_confirm')}</Label>
                      <Input
                        id="delete_confirm"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="rounded-lg w-full"
                      >
                        {isDeletingAccount ? 'Deleting…' : t('profile_delete_my_account')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="rounded-lg w-full"
                      >
                        {t('profile_cancel')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Save Button - Only show when editing */}
          {isEditing && (
            <div className="sticky bottom-0 -mx-4 sm:mx-0 mt-6 bg-background/90 backdrop-blur border-t border-border px-4 py-4 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleSave}
                  className="bg-negari-orange hover:bg-negari-indigo text-white font-semibold px-8 py-3 rounded-lg w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('profile_save_all_changes')}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="px-8 py-3 rounded-lg w-full sm:w-auto"
                >
                  {t('profile_cancel')}
                </Button>
              </div>
            </div>
          )}
          </TabsContent>

          <TabsContent value="goals">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
                      <Target className="h-5 w-5" />
                      {t('profile_goals_title')}
                    </CardTitle>
                    {!isEditingGoals && (
                      <Button
                        onClick={() => setIsEditingGoals(true)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-negari-orange hover:text-white rounded-lg"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('profile_edit')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingGoals ? (
                  <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dream_university">{t('profile_dream_university')}</Label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            ref={universityInputRef}
                            value={universitySearch}
                            onChange={(e) => {
                              setUniversitySearch(e.target.value);
                              setShowUniversityDropdown(true);
                              // Clear selection when typing
                              if (goalsData.dream_university && goalsData.dream_university !== 'other') {
                                setGoalsData({ ...goalsData, dream_university: '', dream_university_other: '' });
                              }
                            }}
                            onFocus={() => setShowUniversityDropdown(true)}
                            placeholder={t('profile_search_universities')}
                            className="rounded-lg pl-9 pr-8"
                          />
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                        {showUniversityDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {universitySearch.trim() && (
                              <button
                                type="button"
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted border-b border-border font-medium text-negari-indigo"
                                onClick={() => {
                                  const custom = universitySearch.trim();
                                  setGoalsData({ ...goalsData, dream_university: 'other', dream_university_other: custom });
                                  setShowUniversityDropdown(false);
                                  setUniversitySearch(custom);
                                }}
                              >
                                ➕ Add “{universitySearch.trim()}”
                              </button>
                            )}
                            <button
                              type="button"
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted border-b border-border font-medium text-negari-orange"
                              onClick={() => {
                                setGoalsData({ ...goalsData, dream_university: 'other', dream_university_other: '' });
                                setShowUniversityDropdown(false);
                                setUniversitySearch('');
                              }}
                            >
                              ✏️ Other (write your own)
                            </button>
                            {filteredUniversities.length > 0 ? (
                              filteredUniversities.map(uni => (
                                <button
                                  key={uni.value}
                                  type="button"
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between items-center ${
                                    goalsData.dream_university === uni.value ? 'bg-muted' : ''
                                  }`}
                                  onClick={() => {
                                    setGoalsData({ ...goalsData, dream_university: uni.value, dream_university_other: '' });
                                    setShowUniversityDropdown(false);
                                    setUniversitySearch(uni.label);
                                  }}
                                >
                                  <span>{uni.label}</span>
                                  <span className="text-xs text-muted-foreground">{uni.country}</span>
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                {t('profile_no_universities_found')}
                              </div>
                            )}
                            {filteredUniversities.length === 50 && (
                              <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border">
                                {t('profile_showing_first_50')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {goalsData.dream_university === 'other' && (
                        <Input
                          id="dream_university_other"
                          value={goalsData.dream_university_other}
                          onChange={(e) => setGoalsData({ ...goalsData, dream_university_other: e.target.value })}
                          placeholder="Type your dream university"
                          className="rounded-lg mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dream_major">Dream Major / Field of Study</Label>
                      <Select
                        value={goalsData.dream_major || (goalsData.dream_major_other ? 'other' : '')}
                        onValueChange={(value) => {
                          if (value === 'other') {
                            setGoalsData({ ...goalsData, dream_major: 'other', dream_major_other: '' });
                          } else {
                            setGoalsData({ ...goalsData, dream_major: value, dream_major_other: '' });
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your dream major" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg max-h-60">
                          <SelectItem value="other">Other (write your own)</SelectItem>
                          <SelectItem value="computer_science">Computer Science / Software Engineering</SelectItem>
                          <SelectItem value="medicine">Medicine / Health Professions</SelectItem>
                          <SelectItem value="engineering">Engineering (Civil, Mechanical, Electrical, etc.)</SelectItem>
                          <SelectItem value="business">Business, Management & Entrepreneurship</SelectItem>
                          <SelectItem value="law">Law & Legal Studies</SelectItem>
                          <SelectItem value="education">Education & Teacher Training</SelectItem>
                          <SelectItem value="arts">Arts, Design & Creative Industries</SelectItem>
                          <SelectItem value="natural_sciences">Natural Sciences (Physics, Chemistry, Biology)</SelectItem>
                          <SelectItem value="social_sciences">Social Sciences (Economics, Sociology, Politics)</SelectItem>
                        </SelectContent>
                      </Select>
                      {goalsData.dream_major === 'other' && (
                        <Input
                          id="dream_major_other"
                          value={goalsData.dream_major_other}
                          onChange={(e) => setGoalsData({ ...goalsData, dream_major_other: e.target.value })}
                          placeholder="Type your dream major"
                          className="rounded-lg mt-2"
                        />
                      )}
                    </div>
                  </div>

                    <div className="space-y-2">
                    <Label htmlFor="target_country">Target Country or Region for Study</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Select
                        value={countryFilter}
                        onValueChange={(value: 'all' | 'best' | 'cheapest' | 'other') => setCountryFilter(value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg max-h-60">
                          <SelectItem value="all">All destinations</SelectItem>
                          <SelectItem value="best">Best ranked</SelectItem>
                          <SelectItem value="cheapest">More affordable</SelectItem>
                          <SelectItem value="other">Other options</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={goalsData.target_country || (goalsData.target_country_other ? 'other' : '')}
                        onValueChange={(value) => {
                          if (value === 'other') {
                            setGoalsData({ ...goalsData, target_country: 'other', target_country_other: '' });
                          } else {
                            setGoalsData({ ...goalsData, target_country: value, target_country_other: '' });
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your target country or region" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg max-h-60">
                          <SelectItem value="other">Other (write your own)</SelectItem>
                          {countryOptions
                            .filter(opt => countryFilter === 'all' || opt.group === countryFilter)
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {goalsData.target_country === 'other' && (
                      <Input
                        id="target_country_other"
                        value={goalsData.target_country_other}
                        onChange={(e) => setGoalsData({ ...goalsData, target_country_other: e.target.value })}
                        placeholder="Type your target country"
                        className="rounded-lg mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="career_interests">Career Interests (comma separated)</Label>
                    <Select
                      value={goalsData.career_interests || (goalsData.career_interests_other ? 'other' : '')}
                      onValueChange={(value) => {
                        if (value === 'other') {
                          setGoalsData({ ...goalsData, career_interests: 'other', career_interests_other: '' });
                        } else {
                          setGoalsData({ ...goalsData, career_interests: value, career_interests_other: '' });
                        }
                      }}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select your main career interest" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg max-h-60">
                        <SelectItem value="other">Other (write your own)</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="medicine">Medicine & Health</SelectItem>
                        <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                        <SelectItem value="research">Research & Academia</SelectItem>
                        <SelectItem value="technology">Technology & Innovation</SelectItem>
                        <SelectItem value="education">Education & Teaching</SelectItem>
                        <SelectItem value="arts">Arts & Creative Industries</SelectItem>
                        <SelectItem value="public_service">Public Service & Policy</SelectItem>
                        <SelectItem value="environment">Environment & Sustainability</SelectItem>
                      </SelectContent>
                    </Select>
                    {goalsData.career_interests === 'other' && (
                      <Input
                        id="career_interests_other"
                        value={goalsData.career_interests_other}
                        onChange={(e) => setGoalsData({ ...goalsData, career_interests_other: e.target.value })}
                        placeholder="Type your career interests (you can list several)"
                        className="rounded-lg mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Fields of Study (select multiple)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border border-border rounded-lg bg-muted/30">
                      {preferredFieldsOptions.map(option => {
                        const isSelected = Array.isArray(goalsData.preferred_fields) && goalsData.preferred_fields.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => togglePreferredField(option.value)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                              isSelected
                                ? 'bg-negari-orange text-amber-900'
                                : 'bg-background border border-border hover:border-negari-orange hover:bg-muted text-foreground'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-amber-900 border-amber-900' : 'border-border'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-negari-orange" />}
                            </div>
                            <span className="flex-1">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="preferred_fields_other"
                        value={goalsData.preferred_fields_other}
                        onChange={(e) => setGoalsData({ ...goalsData, preferred_fields_other: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const newFields = goalsData.preferred_fields_other
                              .split(',')
                              .map(f => f.trim())
                              .filter(Boolean);
                            if (newFields.length > 0) {
                              const currentFields = Array.isArray(goalsData.preferred_fields) ? goalsData.preferred_fields : [];
                              const uniqueNewFields = newFields.filter(f => !currentFields.includes(f));
                              setGoalsData({
                                ...goalsData,
                                preferred_fields: [...currentFields, ...uniqueNewFields],
                                preferred_fields_other: ''
                              });
                            }
                          }
                        }}
                        placeholder="Other fields (type and press Enter to add)"
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFields = goalsData.preferred_fields_other
                            .split(',')
                            .map(f => f.trim())
                            .filter(Boolean);
                          if (newFields.length > 0) {
                            const currentFields = Array.isArray(goalsData.preferred_fields) ? goalsData.preferred_fields : [];
                            const uniqueNewFields = newFields.filter(f => !currentFields.includes(f));
                            setGoalsData({
                              ...goalsData,
                              preferred_fields: [...currentFields, ...uniqueNewFields],
                              preferred_fields_other: ''
                            });
                          }
                        }}
                        className="rounded-lg hover:bg-negari-orange hover:text-white"
                      >
                        Add
                      </Button>
                    </div>
                    {(Array.isArray(goalsData.preferred_fields) && goalsData.preferred_fields.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goalsData.preferred_fields.map(field => {
                          const option = preferredFieldsOptions.find(o => o.value === field);
                          return (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {option?.label || field}
                              <button
                                type="button"
                                onClick={() => togglePreferredField(field)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mt-6 mb-4 pt-4 border-t border-border">
                    <Button
                      onClick={async () => {
                        try {
                          const rawCareerInterests = goalsData.career_interests === 'other'
                            ? goalsData.career_interests_other
                            : goalsData.career_interests;

                          const careerInterestsArray = rawCareerInterests
                            .split(',')
                            .map(item => item.trim())
                            .filter(Boolean);

                          // Combine selected fields with any custom "other" fields
                          const selectedFields = Array.isArray(goalsData.preferred_fields) ? goalsData.preferred_fields : [];
                          const otherFields = goalsData.preferred_fields_other
                            .split(',')
                            .map(item => item.trim())
                            .filter(Boolean);
                          const preferredFieldsArray = [...selectedFields, ...otherFields];

                          // Get the university value - either the selected one or custom "other"
                          const dreamUniversityValue = goalsData.dream_university === 'other'
                            ? goalsData.dream_university_other?.trim()
                            : goalsData.dream_university;
                          
                          const dreamMajorValue = goalsData.dream_major === 'other'
                            ? goalsData.dream_major_other?.trim()
                            : goalsData.dream_major;
                          
                          const targetCountryValue = goalsData.target_country === 'other'
                            ? goalsData.target_country_other?.trim()
                            : goalsData.target_country;

                          const { error } = await updateProfile({
                            dream_university: dreamUniversityValue || null,
                            dream_major: dreamMajorValue || null,
                            target_country: targetCountryValue || null,
                            career_interests: careerInterestsArray.length ? careerInterestsArray : null,
                            preferred_fields: preferredFieldsArray.length ? preferredFieldsArray : null,
                            has_completed_profile: true,
                          });

                          if (error) {
                            console.error('Goals save error:', error);
                            toast({
                              title: "Error",
                              description: `Failed to save your goals: ${error.message || 'Please try again.'}`,
                              variant: "destructive",
                            });
                          } else {
                            toast({
                              title: "Goals Saved",
                              description: "Your goals have been saved. We'll use them to personalize scholarships and mentors.",
                            });
                            setIsEditingGoals(false);
                          }
                        } catch (error) {
                          console.error('Error saving goals:', error);
                          toast({
                            title: "Error",
                            description: "An unexpected error occurred while saving your goals.",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="bg-amber-900 hover:bg-amber-800 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {t('profile_save_my_goals')}
                    </Button>
                  </div>
                  </>
                  ) : (
                    /* Read-only view when not editing */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">{t('profile_dream_university')}</Label>
                          <p className="text-negari-indigo font-medium">
                            {goalsData.dream_university === 'other' 
                              ? goalsData.dream_university_other 
                              : universities.find(u => u.value === goalsData.dream_university)?.label || goalsData.dream_university || t('profile_not_specified')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">{t('profile_dream_major')}</Label>
                          <p className="text-negari-indigo font-medium">
                            {goalsData.dream_major === 'other' ? goalsData.dream_major_other : goalsData.dream_major || t('profile_not_specified')}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('profile_target_country')}</Label>
                        <p className="text-negari-indigo font-medium">
                          {goalsData.target_country === 'other' ? goalsData.target_country_other : goalsData.target_country || t('profile_not_specified')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('profile_career_interests')}</Label>
                        <p className="text-negari-indigo font-medium">
                          {goalsData.career_interests === 'other' ? goalsData.career_interests_other : goalsData.career_interests || t('profile_not_specified')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('profile_preferred_fields')}</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {Array.isArray(goalsData.preferred_fields) && goalsData.preferred_fields.length > 0 ? (
                            goalsData.preferred_fields.map(field => {
                              const option = preferredFieldsOptions.find(o => o.value === field);
                              return (
                                <Badge key={field} variant="secondary" className="text-xs">
                                  {option?.label || field}
                                </Badge>
                              );
                            })
                          ) : (
                            <p className="text-negari-indigo font-medium">{t('profile_not_specified')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessment">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-negari-indigo">
                    <Target className="h-5 w-5" />
                    {t('profile_assessment_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SelfAssessment onComplete={() => navigate('/profile?tab=goals')} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-negari-indigo">
                    <GraduationCap className="h-5 w-5" />
                    {t('profile_progress_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lastAssessment ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-1">{t('profile_last_assessment_score')}</p>
                        <p className="text-3xl font-bold text-negari-indigo">
                          {lastAssessment.score} / {lastAssessment.max_score ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('profile_completed_at')} {new Date(lastAssessment.completed_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        <p className="text-sm font-semibold text-negari-indigo">{t('profile_recommendations')}</p>
                        {lastAssessment.recommendations?.map((rec: string, index: number) => (
                          <div key={index} className="text-sm text-foreground bg-muted/40 rounded-lg p-2 border border-border">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{t('profile_no_assessment_results_yet')}</p>
                      <p className="text-sm mt-2">{t('profile_complete_assessment_to_see_progress')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Settings as SettingsIcon, Bell, Lock, Globe, Sun, Save, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const { theme, setTheme } = useTheme();

  const savedSettings = useMemo(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('userSettings') : null;
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const [notifications, setNotifications] = useState({
    email: savedSettings?.notifications?.email ?? true,
    push: savedSettings?.notifications?.push ?? true,
    scholarshipAlerts: savedSettings?.notifications?.scholarshipAlerts ?? true,
    mentorMessages: savedSettings?.notifications?.mentorMessages ?? true,
    weeklyDigest: savedSettings?.notifications?.weeklyDigest ?? false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: savedSettings?.privacy?.profileVisible ?? true,
    showEmail: savedSettings?.privacy?.showEmail ?? false,
    showPhone: savedSettings?.privacy?.showPhone ?? false,
  });

  const [appearance, setAppearance] = useState({
    theme: savedSettings?.appearance?.theme ?? theme,
    fontSize: savedSettings?.appearance?.fontSize ?? 'medium',
  });

  const [isSaving, setIsSaving] = useState(false);

  const getHomePath = () => {
    if (profile?.user_type === 'student') return '/student';
    if (profile?.user_type === 'mentor') return '/mentor';
    if (profile?.user_type === 'parent') return '/parent';
    if (profile?.user_type === 'school') return '/school';
    if (profile?.is_admin || profile?.is_super_admin) return '/admin';
    return '/student';
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save settings to profile or local storage
      localStorage.setItem('userSettings', JSON.stringify({
        notifications,
        privacy,
        appearance,
      }));

      if (appearance.theme === 'light' || appearance.theme === 'dark' || appearance.theme === 'system') {
        setTheme(appearance.theme);
      }

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const size = appearance.fontSize;
    const px = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
    document.documentElement.style.fontSize = px;
  }, [appearance.fontSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/80 to-purple-50/80 dark:from-background dark:via-background dark:to-muted/30">
      <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:px-8 sm:py-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate(getHomePath())}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-negari-orange hover:text-white text-xs sm:text-sm rounded-lg"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <h1 className="text-lg sm:text-3xl font-bold text-negari-indigo text-center">Settings</h1>
          <div className="w-10"></div>
        </div>

        {/* Notification Settings */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-gray-500">Receive push notifications on your device</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Scholarship Alerts</Label>
                <p className="text-xs text-gray-500">Get notified about new scholarships</p>
              </div>
              <Switch
                checked={notifications.scholarshipAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, scholarshipAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Mentor Messages</Label>
                <p className="text-xs text-gray-500">Notifications for mentor communications</p>
              </div>
              <Switch
                checked={notifications.mentorMessages}
                onCheckedChange={(checked) => setNotifications({ ...notifications, mentorMessages: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Weekly Digest</Label>
                <p className="text-xs text-gray-500">Receive a weekly summary email</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
              <Lock className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Profile Visibility</Label>
                <p className="text-xs text-gray-500">Allow others to view your profile</p>
              </div>
              <Switch
                checked={privacy.profileVisible}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Show Email</Label>
                <p className="text-xs text-gray-500">Display email on your public profile</p>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Show Phone Number</Label>
                <p className="text-xs text-gray-500">Display phone on your public profile</p>
              </div>
              <Switch
                checked={privacy.showPhone}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Theme</Label>
              <Select
                value={appearance.theme}
                onValueChange={(value) => {
                  setAppearance({ ...appearance, theme: value });
                  if (value === 'light' || value === 'dark' || value === 'system') {
                    setTheme(value);
                  }
                }}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Font Size</Label>
              <Select
                value={appearance.fontSize}
                onValueChange={(value) => setAppearance({ ...appearance, fontSize: value })}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
              <Globe className="h-5 w-5" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preferred Language</Label>
              <Select
                value={currentLanguage.code}
                onValueChange={(value) => {
                  const selectedLang = languages.find(l => l.code === value);
                  if (selectedLang) setLanguage(selectedLang);
                }}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg sm:text-xl">
              <SettingsIcon className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">Edit Profile</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                toast({
                  title: "Not implemented yet",
                  description: "Password change will be available in the next update."
                });
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">Change Password</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                toast({
                  title: "Not implemented yet",
                  description: "Data export will be available in the next update."
                });
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">Export My Data</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                toast({
                  title: "Not implemented yet",
                  description: "Account deletion will be available in the next update.",
                  variant: "destructive"
                });
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <span className="text-sm font-medium">Delete Account</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center pt-4 pb-8">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-amber-900 hover:bg-amber-800 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

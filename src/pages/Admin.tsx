
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, BarChart3, Shield, Search, Mail, Calendar, School } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  country: string | null;
  account_type: string | null;
  subscription_type: string;
  created_at: string;
}

const Admin = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Fetch all users (only admins can see this)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchUsers();
    }
  }, [profile, toast]);

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter(u => u.subscription_type !== 'freemium').length,
    recentUsers: users.filter(u => {
      const createdAt = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    }).length,
    completedProfiles: users.filter(u => u.full_name && u.account_type).length
  };

  const getAccountTypeDisplay = (type: string | null) => {
    if (!type) return 'Not specified';
    const types: { [key: string]: string } = {
      'junior': 'Negari Junior',
      'starter': 'Starter Kit',
      'senior': 'Negari Senior',
      'rise': 'Negari RISE',
      'student': 'Student',
      'mentor': 'Mentor',
      'parent': 'Parent',
      'school': 'School'
    };
    return types[type] || type;
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sunrise-gradient cultural-bg">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-negari-indigo mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage users and platform settings
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1">
            <TabsList className="inline-flex w-max min-w-full gap-1 bg-transparent">
              <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="users" className="whitespace-nowrap">Users</TabsTrigger>
              <TabsTrigger value="settings" className="whitespace-nowrap">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="negari-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-negari-orange/20 rounded-lg">
                      <Users className="h-6 w-6 text-negari-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-negari-indigo">{stats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="negari-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-negari-gold/20 rounded-lg">
                      <Shield className="h-6 w-6 text-negari-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Premium Users</p>
                      <p className="text-2xl font-bold text-negari-indigo">{stats.premiumUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="negari-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-negari-indigo/20 rounded-lg">
                      <Calendar className="h-6 w-6 text-negari-indigo" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">New This Week</p>
                      <p className="text-2xl font-bold text-negari-indigo">{stats.recentUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="negari-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-negari-sunrise/20 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-negari-sunrise" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Complete Profiles</p>
                      <p className="text-2xl font-bold text-negari-indigo">{stats.completedProfiles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="negari-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-negari-indigo">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-negari-orange mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-negari-orange/20 text-negari-orange">
                            {(user.full_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-negari-indigo">
                              {user.full_name || 'Profile Incomplete'}
                            </h4>
                            {user.subscription_type !== 'freemium' && (
                              <Badge className="bg-negari-gold text-white">{user.subscription_type}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            {user.account_type && (
                              <div className="flex items-center gap-1">
                                <School className="h-3 w-3" />
                                <span>{getAccountTypeDisplay(user.account_type)}</span>
                              </div>
                            )}
                            {user.country && (
                              <span>📍 {user.country}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="negari-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-negari-indigo">
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Platform settings will be available here.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Configure platform-wide settings, notifications, and preferences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

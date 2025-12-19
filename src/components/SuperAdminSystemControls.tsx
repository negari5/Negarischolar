import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  UserCog, 
  AlertTriangle,
  Database,
  Settings,
  Users,
  Lock,
  Crown,
  Building,
  CreditCard,
  BarChart3,
  Monitor
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SuperAdminSystemControlsProps {
  users: any[];
  onRefresh: () => void;
}

const SuperAdminSystemControls: React.FC<SuperAdminSystemControlsProps> = ({ users, onRefresh }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!profile?.is_super_admin) {
    return null;
  }

  const promoteToAdmin = async (userId: string, userName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          user_type: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "✅ Admin Promoted",
        description: `${userName} has been promoted to Admin with operational privileges.`,
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to promote user to admin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (userId: string, userName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: false,
          user_type: 'starter',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "🔄 Admin Removed",
        description: `${userName} has been reverted to regular User status.`,
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to remove admin privileges.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (userId: string, userEmail: string, userName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast({
        title: "📧 Password Reset Sent",
        description: `Password reset email sent to ${userName}.`,
      });
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to send password reset.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const superAdminUser = users.find(user => user.is_super_admin);
  const adminUsers = users.filter(user => user.is_admin && !user.is_super_admin);
  const regularUsers = users.filter(user => !user.is_admin && !user.is_super_admin);
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.is_active !== false).length;

  return (
    <div className="space-y-8">
      {/* Super Admin Profile Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            Super Admin Profile
            <Badge className="bg-primary text-primary-foreground">Highest Authority</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {superAdminUser ? (
            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{superAdminUser.full_name || superAdminUser.email}</h3>
                  <p className="text-muted-foreground">{superAdminUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="font-semibold text-primary">Super Admin</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Authority</div>
                  <div className="font-semibold">Platform Governance</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Access Level</div>
                  <div className="font-semibold text-primary">Unlimited</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Override</div>
                  <div className="font-semibold">All Actions</div>
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Responsibilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-3 w-3" />
                    Create, edit, and delete Admins
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    Set system-wide policies
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3 w-3" />
                    Manage subscription plans
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3" />
                    Monitor user analytics
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    Access all databases
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-3 w-3" />
                    Override any admin action
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No Super Admin found in the system</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-secondary" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg border">
              <div className="text-2xl font-bold text-primary">{totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg border">
              <div className="text-2xl font-bold text-secondary">{adminUsers.length}</div>
              <div className="text-sm text-muted-foreground">Operational Admins</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{totalUsers - activeUsers}</div>
              <div className="text-sm text-muted-foreground">Inactive Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Admin Management
            <Badge variant="secondary">Operational Level</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Admins */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Current Admins ({adminUsers.length})
              </h4>
              {adminUsers.length > 0 ? (
                <div className="space-y-3">
                  {adminUsers.map((user) => (
                    <div key={user.id} className="bg-background/50 border rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-secondary" />
                          </div>
                  <div>
                    <div className="font-medium">{user.full_name || user.email}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.phone && <div className="text-xs text-muted-foreground">📞 {user.phone}</div>}
                  </div>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                            Admin
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={loading}>
                                <Lock className="h-4 w-4 mr-1" />
                                Reset Password
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reset Admin Password</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Send a password reset email to {user.full_name || user.email}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => resetUserPassword(user.id, user.email, user.full_name || user.email)}>
                                  Send Reset Email
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={loading}>
                                <ShieldX className="h-4 w-4 mr-1" />
                                Remove Admin
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Admin Privileges</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove admin privileges from {user.full_name || user.email}? 
                                  They will lose access to the admin dashboard and all admin functions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => removeAdmin(user.id, user.full_name || user.email)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {/* Admin Responsibilities */}
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="text-xs text-muted-foreground mb-2">Admin Responsibilities:</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            Manage scholarships
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Upload resources
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            Handle support tickets
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <ShieldX className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No operational admins currently assigned.</p>
                  <p className="text-sm text-muted-foreground mt-1">Promote users below to help manage the platform.</p>
                </div>
              )}
            </div>

            {/* Promote Users */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Promote Users to Admin ({regularUsers.length} available)
              </h4>
              {regularUsers.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {regularUsers.slice(0, 15).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name || user.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email} • {user.user_type || 'User'}
                          </div>
                          {user.phone && <div className="text-xs text-muted-foreground">📞 {user.phone}</div>}
                          {user.city && <div className="text-xs text-muted-foreground">📍 {user.city}</div>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" disabled={loading}>
                              <Lock className="h-4 w-4 mr-1" />
                              Reset Password
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reset User Password</AlertDialogTitle>
                              <AlertDialogDescription>
                                Send a password reset email to {user.full_name || user.email}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => resetUserPassword(user.id, user.email, user.full_name || user.email)}>
                                Send Reset Email
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="default" size="sm" disabled={loading} className="bg-secondary hover:bg-secondary/90">
                              <ShieldCheck className="h-4 w-4 mr-1" />
                              Make Admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Promote to Admin</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to promote {user.full_name || user.email} to Admin? 
                                They will gain access to manage scholarships, upload resources, moderate discussions, and handle support tickets.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => promoteToAdmin(user.id, user.full_name || user.email)}
                                className="bg-secondary hover:bg-secondary/90"
                              >
                                Promote to Admin
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                  {regularUsers.length > 15 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Showing first 15 users. Use the Users tab to see all users.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">All users are either admins or super admins.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSystemControls;
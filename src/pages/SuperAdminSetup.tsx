import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminSetup: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [setupCode, setSetupCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('Super');
  const [lastName, setLastName] = useState('Admin');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'verify' | 'create' | 'basicInfo'>('verify');
  const [country, setCountry] = useState('Ethiopia');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Secret setup code - in production this should be environment variable
  const SUPER_ADMIN_SETUP_CODE = 'NEGARI_SUPER_ADMIN_2024';

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleCodeVerification = () => {
    if (setupCode !== SUPER_ADMIN_SETUP_CODE) {
      toast({
        title: "Invalid Setup Code",
        description: "The setup code is incorrect.",
        variant: "destructive"
      });
      return;
    }
    setStep('create');
  };

  const handleSuperAdminCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create the admin account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: `${firstName} ${lastName}`,
            account_type: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        setUserId(authData.user.id);
        toast({
          title: "Account Created!",
          description: "Please complete your basic information.",
        });
        setStep('basicInfo');
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to create Admin account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Update profile with basic info and admin flags
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          account_type: 'admin',
          is_admin: true,
          has_completed_profile: true,
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          country,
          city,
          date_of_birth: dateOfBirth,
          gender,
          phone
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });

      if (roleError) {
        console.error('Error adding admin role:', roleError);
      }

      toast({
        title: "Setup Complete!",
        description: "You can now sign in with your credentials.",
      });

      // Clear form and redirect
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSetupCode('');
      setStep('verify');
      
      navigate('/');
    } catch (error: any) {
      console.error('Error completing setup:', error);
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to complete profile setup.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <p className="text-muted-foreground">
            {step === 'verify' 
              ? 'Enter the setup code to create the Admin account'
              : step === 'create'
              ? 'Create the Admin account'
              : 'Complete your basic information'
            }
          </p>
        </CardHeader>
        <CardContent>
          {step === 'verify' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setupCode">Setup Code</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="setupCode"
                    type="password"
                    placeholder="Enter setup code"
                    value={setupCode}
                    onChange={(e) => setSetupCode(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={handleCodeVerification}
                className="w-full"
                disabled={!setupCode}
              >
                Verify Code
              </Button>
            </div>
          ) : step === 'create' ? (
            <form onSubmit={handleSuperAdminCreation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('verify')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={loading || !email || !password || !confirmPassword}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Next'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251..."
                  required
                />
              </div>

              <Button 
                type="submit"
                disabled={loading || !country || !city || !dateOfBirth || !gender || !phone}
                className="w-full"
              >
                {loading ? 'Completing Setup...' : 'Complete Setup'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSetup;
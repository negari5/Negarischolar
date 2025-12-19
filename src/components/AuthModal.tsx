
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserTypeSelector from './UserTypeSelector';
import DreamCollector from './DreamCollector';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [areaOfLiving, setAreaOfLiving] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState<'student' | 'parent' | 'mentor' | 'school' | null>(null);
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [showDreamCollector, setShowDreamCollector] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in."
          });
          // Go to main route; AppContent will handle first-time redirect
          navigate('/');
          onClose();
          resetForm();
        }
      } else {
        const { error } = await signUp(email, password, {
          // Match Supabase profiles columns
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          education_level: educationLevel,
          city: areaOfLiving,
          school_type: schoolType,
          phone: phoneNumber,
          phone_number: phoneNumber,
          user_type: userType
        });
        
        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created!",
            description: "We have sent you a verification email. Please check your inbox to verify your account before logging in."
          });
          // Keep signup form open and show inline verification notice
          setShowVerificationNotice(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setEducationLevel('');
    setAreaOfLiving('');
    setSchoolType('');
    setPhoneNumber('');
    setUserType(null);
    setShowVerificationNotice(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (showDreamCollector) {
    return (
      <DreamCollector 
        onComplete={() => {
          setShowDreamCollector(false);
          onClose();
          resetForm();
        }} 
      />
    );
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white font-medium">Password</Label>
          {isLogin && (
            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  toast({
                    title: "Email Required",
                    description: "Please enter your email address first.",
                    variant: "destructive"
                  });
                  return;
                }
                try {
                  const { supabase } = await import('@/integrations/supabase/client');
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  if (error) throw error;
                  toast({
                    title: "Email Sent",
                    description: "Check your email for the password reset link.",
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to send reset email. Please try again.",
                    variant: "destructive"
                  });
                }
              }}
              className="text-xs text-negari-gold hover:text-negari-navy transition-colors"
            >
              Forgot Password?
            </button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          className="bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg"
        />
      </div>

      {!isLogin && userType && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg"
              />
            </div>
          </div>

          {/* Student-specific fields */}
          {userType === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="educationLevel" className="text-white font-medium">Current Education Level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select your current education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="elementary">Elementary School</SelectItem>
                    <SelectItem value="middle_school">Middle School</SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="preparatory">Preparatory School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolType" className="text-white font-medium">School Type</Label>
                <Select value={schoolType} onValueChange={setSchoolType}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select your school type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="public">Public School</SelectItem>
                    <SelectItem value="private">Private School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Parent-specific fields */}
          {userType === 'parent' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="educationLevel" className="text-white font-medium">Child's Education Level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select your child's education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="elementary">Elementary School</SelectItem>
                    <SelectItem value="middle_school">Middle School</SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="preparatory">Preparatory School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolType" className="text-white font-medium">Number of Children</Label>
                <Select value={schoolType} onValueChange={setSchoolType}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="How many children do you have?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="1">1 child</SelectItem>
                    <SelectItem value="2">2 children</SelectItem>
                    <SelectItem value="3">3 children</SelectItem>
                    <SelectItem value="4+">4 or more children</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Mentor-specific fields */}
          {userType === 'mentor' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="educationLevel" className="text-white font-medium">Your Education Level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select your highest education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="undergraduate">Bachelor's Degree</SelectItem>
                    <SelectItem value="graduate">Master's Degree</SelectItem>
                    <SelectItem value="postgraduate">PhD/Doctorate</SelectItem>
                    <SelectItem value="professional">Professional Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolType" className="text-white font-medium">Area of Expertise</Label>
                <Select value={schoolType} onValueChange={setSchoolType}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select your area of expertise" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="engineering">Engineering & Technology</SelectItem>
                    <SelectItem value="medicine">Medicine & Health Sciences</SelectItem>
                    <SelectItem value="business">Business & Economics</SelectItem>
                    <SelectItem value="education">Education & Teaching</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="sciences">Natural Sciences</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* School-specific fields */}
          {userType === 'school' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="educationLevel" className="text-white font-medium">Institution Type</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select your institution type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="elementary">Elementary School</SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="preparatory">Preparatory School</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="vocational">Vocational Training Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolType" className="text-white font-medium">Institution Category</Label>
                <Select value={schoolType} onValueChange={setSchoolType}>
                  <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                    <SelectValue placeholder="Select institution category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 rounded-lg">
                    <SelectItem value="public">Public Institution</SelectItem>
                    <SelectItem value="private">Private Institution</SelectItem>
                    <SelectItem value="international">International School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="areaOfLiving" className="text-white font-medium">City</Label>
            <Select value={areaOfLiving} onValueChange={setAreaOfLiving}>
              <SelectTrigger className="bg-white/80 border-gray-300 text-gray-900 rounded-lg">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 max-h-60 rounded-lg">
                {ethiopianCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-white font-medium">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+251 9xx xxx xxx"
              className="bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg"
            />
          </div>
        </>
      )}

      <Button 
        type="submit" 
        className="w-full bg-negari-gold hover:bg-negari-navy text-negari-navy hover:text-white font-semibold rounded-lg py-3" 
        disabled={loading || (!isLogin && !userType)}
      >
        {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
      </Button>
    </form>
  );

  const renderRoleSelection = () => (
    <div className="space-y-3">
      {[
        { id: 'student', title: 'Student', description: 'I am a student looking for scholarship opportunities' },
        { id: 'parent', title: 'Parent', description: 'I am a parent supporting my child\'s education journey' },
        { id: 'mentor', title: 'Mentor', description: 'I want to guide and support students' },
        { id: 'school', title: 'School', description: 'I represent an educational institution' }
      ].map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => setUserType(type.id as 'student' | 'parent' | 'mentor' | 'school')}
          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
            userType === type.id 
              ? 'border-negari-gold bg-negari-gold/10' 
              : 'border-white/40 hover:border-negari-gold'
          }`}
        >
          <h4 className="font-semibold text-negari-gold">{type.title}</h4>
          <p className="text-sm text-white/80 mt-1">{type.description}</p>
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-none h-screen sm:h-screen overflow-y-auto bg-black/40 backdrop-blur-sm border-0 shadow-none rounded-none p-2 sm:p-4 flex items-center justify-center">
        <div
          className={`w-full max-w-[740px] overflow-y-auto bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-border p-6 sm:p-8 ${
            /* Shorter height for simple 'I am a...' step, taller for full form */
            !isLogin && !userType ? 'max-h-[740px]' : 'max-h-[940px]'
          }`}
        >
          <DialogHeader>
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="text-lg text-white/70 hover:text-white transition-colors leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : (!isLogin && !userType) ? 'Join Negari' : 'Complete Your Profile'}
            </DialogTitle><br /><br />
          </DialogHeader>

          {showVerificationNotice ? (
            <div className="mt-6 max-w-md mx-auto text-center space-y-6">
              <p className="text-white text-base">
                We've sent a verification link to
                <span className="font-semibold text-negari-gold"> {email}</span>.
              </p>
              <p className="text-white/80 text-sm">
                Please verify your email, then sign in to continue your journey with Negari Scholar.
              </p>
              <Button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setShowVerificationNotice(false);
                }}
                className="w-full bg-negari-gold hover:bg-negari-navy text-negari-navy hover:text-white font-semibold rounded-lg py-3"
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <>
              {/* Login/Signup Toggle Tabs */}
              <div className="flex gap-2 p-1 rounded-lg mb-6 w-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setUserType(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-sm transition-all ${
                    !isLogin 
                      ? 'bg-negari-gold text-negari-navy shadow-sm' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-sm transition-all ${
                    isLogin 
                      ? 'bg-negari-gold text-negari-navy shadow-sm' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {isLogin ? (
                <div className="mt-6 max-w-md mx-auto">
                  {renderForm()}
                </div>
              ) : !userType ? (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold text-white mb-1">I am a...</h3>
                    <p className="text-white/80 text-sm">Select the option that best describes you</p>
                  </div>
                  {renderRoleSelection()}
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="max-w-md w-full mx-auto md:mx-0">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setUserType(null)}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                      >
                        <span>←</span>
                        <span>Back to selection</span>
                      </button>
                      <div className="text-sm text-white/80">
                        Creating {userType} account
                      </div>
                    </div>
                    {renderForm()}
                  </div>

                  <div className="space-y-6 md:border-l md:border-white/20 pl-0 md:pl-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1">I am a...</h3>
                      <p className="text-white/80 text-sm">Select the option that best describes you</p>
                    </div>
                    {renderRoleSelection()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

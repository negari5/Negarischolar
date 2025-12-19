
import { useState, useEffect } from "react";
import { Sunrise, BookOpen, Plane, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PersonalizedWelcome = () => {
  const { profile } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return profile?.email?.split('@')[0] || 'Student';
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-negari-indigo via-negari-deep-purple to-negari-orange text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 cultural-bg opacity-10"></div>
      
      {/* Hero Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <BookOpen className="absolute top-10 left-10 h-8 w-8 opacity-20 animate-bounce-gentle" style={{animationDelay: '0s'}} />
        <Plane className="absolute top-20 right-20 h-6 w-6 opacity-30 animate-bounce-gentle" style={{animationDelay: '1s'}} />
        <GraduationCap className="absolute top-32 left-1/4 h-10 w-10 opacity-25 animate-bounce-gentle" style={{animationDelay: '2s'}} />
        <Sunrise className="absolute bottom-10 right-10 h-12 w-12 opacity-20 animate-bounce-gentle" style={{animationDelay: '0.5s'}} />
      </div>
      
      <div className="relative container mx-auto px-4 py-16 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-negari-gold to-negari-warm-yellow bg-clip-text text-transparent">
            {greeting}, {getDisplayName()}!
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Welcome to <span className="font-comfortaa font-bold text-negari-gold">Negari</span>
          </p>
          <div className="space-y-2">
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Your journey to global education starts here. Every step forward brings you closer to your dreams.
            </p>
            {profile?.education_level && (
              <p className="text-md text-white/70">
                Education Level: {profile.education_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            )}
            {profile?.city && (
              <p className="text-md text-white/70">
                Location: {profile.city}
              </p>
            )}
          </div>
        </div>
        
        {/* Hero Illustration Placeholder */}
        <div className="mt-12 relative">
          <div className="inline-block relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-negari-gold/30 to-negari-orange/30 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-negari-gold to-negari-orange flex items-center justify-center">
                <Sunrise className="h-8 w-8 md:h-12 md:w-12 text-white animate-bounce-gentle" />
              </div>
            </div>
            {/* Path illustration */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-negari-gold to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedWelcome;

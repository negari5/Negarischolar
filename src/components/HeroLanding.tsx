import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import AuthButton from "@/components/AuthButton";

const HeroLanding = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen hero-background flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/987774d6-b433-4b44-8bc9-3328cd4d42de.png" 
            alt="Negari Logo" 
            className="h-12 w-12"
          />
          <span className="font-comfortaa font-bold text-2xl text-white">Negari</span>
          {profile?.is_admin && (
            <Badge variant="secondary" className="bg-negari-gold text-negari-navy">
              Admin
            </Badge>
          )}
        </div>
        <AuthButton />
      </div>

      {/* Floating Graduation Caps */}
      <div className="floating-caps">
        <GraduationCap className="graduation-cap w-16 h-16 text-negari-gold" />
        <GraduationCap className="graduation-cap w-20 h-20 text-negari-gold" />
        <GraduationCap className="graduation-cap w-14 h-14 text-negari-gold" />
        <GraduationCap className="graduation-cap w-18 h-18 text-negari-gold" />
        <GraduationCap className="graduation-cap w-12 h-12 text-negari-gold" />
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-comfortaa font-bold text-accent mb-6 animate-fade-in-up">
          Negari is Here to<br />
          <span className="text-negari-gold">Open Doors</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          AI-powered scholarship companion guiding Ethiopian students from Grade 10 to global opportunities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Button 
            size="lg" 
            className="bg-negari-gold hover:bg-negari-gold-light text-negari-navy font-semibold px-8 py-6 text-lg rounded-full"
          >
            Start Your Journey
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm"
          >
            Discover Your Path
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="flex flex-col items-center text-white/60">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
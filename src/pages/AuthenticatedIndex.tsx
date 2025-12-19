
import { useAuth } from "@/contexts/AuthContext";

const AuthenticatedIndex = () => {
  const { profileLoaded } = useAuth();
  return (
    <div className="min-h-screen bg-negari-navy flex items-center justify-center">
      <div className="text-center px-4">
        <img 
          src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
          alt="Negari Logo" 
          className="h-16 w-auto mx-auto mb-4 animate-pulse"
        />
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-negari-gold mx-auto mb-4"></div>
        <p className="text-white font-medium text-sm sm:text-base">
          {profileLoaded ? 'Redirecting you…' : 'Loading your profile…'}
        </p>
      </div>
    </div>
  );
};

export default AuthenticatedIndex;

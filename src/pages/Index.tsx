import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedIndex from "./AuthenticatedIndex";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-negari-navy flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
            alt="Negari Logo" 
            className="h-20 w-auto mx-auto mb-4 animate-pulse"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-negari-gold mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your educational journey...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <AuthenticatedIndex />;
  }

  return <LandingPage />;
};

export default Index;
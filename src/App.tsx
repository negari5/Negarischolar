
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NavigationWrapper from "@/components/NavigationWrapper";
import { useEffect } from "react";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Journey from "./pages/Journey";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import InfoPage from "./pages/InfoPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminSetup from "./pages/SuperAdminSetup";
import QuickSetup from "./pages/QuickSetup";
import NotFound from "./pages/NotFound";
import EnhancedStudentDashboard from "./components/EnhancedStudentDashboard";
import StudentPage from "./pages/StudentPage";
import MentorPage from "./pages/MentorPage";
import ParentPage from "./pages/ParentPage";
import SchoolPage from "./pages/SchoolPage";
import Settings from "./pages/Settings";
import Mentors from "./pages/Mentors";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import CookiesPolicy from "./pages/CookiesPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, profileLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAdminUser = !!(
      profile?.is_admin ||
      user?.email === 'negari@gmail.com' ||
      user?.email === 'eyob@negarischolar.com'
    );

    if (user && isAdminUser && location.pathname === '/') {
      console.log('Admin detected, redirecting to /admin', { userEmail: user.email, isAdminUser, profile });
      navigate('/admin', { replace: true });
      return;
    }

    // Redirect logic for non-admin users on landing page
    if (user && !isAdminUser && location.pathname === '/') {
      if (!profileLoaded) return;

      // If profile is completed, go to their dashboard based on user type
      if (profile?.has_completed_profile) {
        const dashboardPath = 
          profile?.user_type === 'student' ? '/student' :
          profile?.user_type === 'mentor' ? '/mentor' :
          profile?.user_type === 'parent' ? '/parent' :
          profile?.user_type === 'school' ? '/school' :
          '/student'; // Default to student
        navigate(dashboardPath, { replace: true });
      } else {
        // First-time onboarding: send to assessment
        navigate('/profile?tab=assessment', { replace: true });
      }
    }
  }, [user, profile, profileLoaded, navigate, location.pathname]);

  return (
    <NavigationWrapper>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/super-admin-setup" element={<SuperAdminSetup />} />
        <Route path="/quick-setup" element={<QuickSetup />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/parent" element={<ParentPage />} />
        <Route path="/school" element={<SchoolPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NavigationWrapper>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

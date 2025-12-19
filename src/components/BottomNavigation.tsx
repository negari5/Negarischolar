
import { useState, useRef, useEffect } from "react";
import { Home, Search, Compass, MessageSquare, User, Users, Info, Settings, LogOut, UserCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavigationProps {
  onNotification: (title: string, description: string) => void;
}

const BottomNavigation = ({ onNotification }: BottomNavigationProps) => {
  const [activeTab, setActiveTab] = useState("home");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, profileLoaded, signOut } = useAuth();
  const { t } = useLanguage();

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getHomePath = () => {
    if (profile?.user_type === 'student') return '/student';
    if (profile?.user_type === 'mentor') return '/mentor';
    if (profile?.user_type === 'parent') return '/parent';
    if (profile?.user_type === 'school') return '/school';
    if (profile?.is_admin || profile?.is_super_admin) return '/admin';
    return '/student'; // Default to student dashboard for authenticated users
  };

  const navItems = [
    { id: "home", icon: Home, label: t('home'), path: getHomePath() },
    { id: "explore", icon: Search, label: t('explore'), path: "/explore" },
    { id: "mentors", icon: Users, label: t('mentors'), path: "/mentors" },
    { id: "journey", icon: Compass, label: t('journey'), path: "/journey" },
    { id: "messages", icon: MessageSquare, label: t('messages'), path: "/messages" },
    { id: "info", icon: Info, label: t('info'), path: "/info" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleTabClick = (tabId: string, label: string, path: string) => {
    // Do not gate navigation until we know the latest profile state.
    const needsOnboarding = profileLoaded ? !profile?.has_completed_profile : false;

    // Require Goals completion before exploring other sections
    if (needsOnboarding && tabId !== "home") {
      navigate('/profile?tab=goals');
      onNotification(
        "Complete Your Goals",
        "Please fill out your Goals so we can personalize scholarships and mentors before you explore other sections."
      );
      setActiveTab("account");
      return;
    }

    setActiveTab(tabId);
    navigate(path);
    if (tabId !== "home") {
      onNotification(
        `${label} Section`,
        `Welcome to the ${label} section! Explore all the features available here.`
      );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background/95 backdrop-blur-md border-t border-gray-200 dark:border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.label, item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 hover-bounce ${
                  isActive 
                    ? 'text-negari-orange bg-negari-orange/10' 
                    : 'text-gray-500 dark:text-muted-foreground hover:text-negari-indigo dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-accent'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'animate-bounce-gentle' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-negari-orange rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
          
          {/* Account Button with Dropdown */}
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 hover-bounce ${
                showAccountMenu || activeTab === 'account'
                  ? 'text-negari-orange bg-negari-orange/10' 
                  : 'text-gray-500 dark:text-muted-foreground hover:text-negari-indigo dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-accent'
              }`}
            >
              <UserCircle className="h-6 w-6" />
              <span className="text-xs font-medium">Account</span>
            </button>
            
            {/* Dropdown Menu */}
            {showAccountMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-popover rounded-lg shadow-lg border border-gray-200 dark:border-border overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowAccountMenu(false);
                    setActiveTab('account');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-foreground hover:bg-orange-50 dark:hover:bg-accent hover:text-negari-orange transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowAccountMenu(false);
                    setActiveTab('account');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-foreground hover:bg-orange-50 dark:hover:bg-accent hover:text-negari-orange transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="border-t border-gray-100 dark:border-border"></div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setShowAccountMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

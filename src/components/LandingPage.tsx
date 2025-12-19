import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GraduationCap, ChevronDown, Target, Users, Award, BookOpen, Brain, Sparkles, Star, Mail, Phone, MapPin, Shield, Globe, Smartphone, FileText, Heart, TrendingUp, Clock, Zap, MessageSquare, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import AuthButton from "@/components/AuthButton";
import AuthModal from "@/components/AuthModal";
import SelfAssessment from "@/components/SelfAssessment";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
const LandingPage = () => {
  const { profile } = useAuth();
  const { subscriptions } = useSubscriptions();
  const { t, currentLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  const isDarkMode = (() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  })();

  // Remove the mock subscription types - now using context
  // const subscriptionTypes = [ ... ];

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Basic SEO for landing page
  useEffect(() => {
    // document.title = "Negari — Open Doors to Global Opportunities";
    document.title = "Negari Scholars";
    const desc = "AI-powered scholarship companion guiding Ethiopian students from Grade 10 to global opportunities.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Listen for custom auth modal events
    const handleOpenAuthModal = () => setShowAuthModal(true);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, []);

  if (showAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Button 
              onClick={() => setShowAssessment(false)}
              variant="outline"
              className="mb-4"
            >
              ← {t('home')}
            </Button>
          </div>
          <SelfAssessment />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img 
              src={isScrolled 
                ? "/lovable-uploads/negari logo color.png" 
                : "/lovable-uploads/negari logo white.png"}
              alt="Negari Logo" 
              className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0"
            />
            <span className={`font-comfortaa font-bold text-lg sm:text-2xl truncate ${
              isScrolled ? 'text-gray-900 dark:text-foreground' : 'text-white'
            }`}>
              Negari
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <LanguageSwitcher />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className={`rounded-full px-2 ${
                isScrolled
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="bg-negari-navy hover:bg-negari-navy-dark text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap"
            >
              {t('start_journey')}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="min-h-[88vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        {/* Header */}
        <div className="relative z-10 hidden">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
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
        <div className="absolute inset-0 overflow-hidden">
          <GraduationCap className="absolute top-10 left-10 h-16 w-16 text-amber-400/30 animate-bounce" style={{animationDelay: '0s', animationDuration: '8s'}} />
          <GraduationCap className="absolute top-20 right-20 h-12 w-12 text-sky-400/25 animate-bounce" style={{animationDelay: '1s', animationDuration: '10s'}} />
          <GraduationCap className="absolute top-32 left-1/4 h-20 w-20 text-amber-400/20 animate-bounce" style={{animationDelay: '2s', animationDuration: '7s'}} />
          <GraduationCap className="absolute bottom-32 right-1/4 h-14 w-14 text-sky-400/35 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '9s'}} />
          <GraduationCap className="absolute bottom-20 left-20 h-18 w-18 text-amber-400/30 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '11s'}} />
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 relative z-10 pt-20">
          <div className="mb-6 animate-fade-in-up">
            <img 
              // src="/lovable-uploads/8100b743-8748-46c8-952a-e50f9e5f88e0.png" 
              src="/lovable-uploads/negari logo white.png" 
              alt="Negari Logo"
              className="h-28 w-28 mx-auto rounded-lg shadow-[0_0_40px_rgba(56,189,248,0.6)]"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-comfortaa font-bold text-white mb-5 animate-fade-in-up">
            {t('landing_hero_title_line1')}<br />
            <span className="text-negari-gold">{t('landing_hero_title_line2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t('landing_hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg" 
              onClick={() => setShowAuthModal(true)}
              className="bg-negari-gold hover:bg-negari-gold-light text-negari-navy font-semibold px-8 py-6 text-lg rounded-full"
            >
              {t('start_journey')}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowAssessment(true)}
              className="border-2 border-negari-gold text-negari-gold hover:bg-negari-gold/10 font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm"
            >
              {t('assessment_test')}
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce-gentle">
            <div className="flex flex-col items-center text-white/60">
              <span className="text-sm mb-2">{t('scroll_to_explore')}</span>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* What is Negari Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-gray-900 mb-6">
              {t('landing_what_is_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t('landing_what_is_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Jr. */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-negari-gold/10 rounded-xl">
                    <Brain className="h-8 w-8 text-negari-gold" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-comfortaa text-gray-900">{t('landing_path_jr_title')}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t('landing_path_jr_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_study_skills')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_career_exploration')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_foundation_building')}</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => {
                    if (profile) {
                      navigate('/student');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="w-full mt-4 bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_select_journey_path')}
                </Button>
              </CardContent>
            </Card>

            {/* Starter Kit */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-negari-gold/10 rounded-xl">
                    <BookOpen className="h-8 w-8 text-negari-gold" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-comfortaa text-gray-900">{t('landing_path_starter_title')}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t('landing_path_starter_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_essay_writing_coach')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_scholarship_database')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_application_tracker')}</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => {
                    if (profile) {
                      navigate('/student');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="w-full mt-4 bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_select_journey_path')}
                </Button>
              </CardContent>
            </Card>

            {/* Senior */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-negari-gold/10 rounded-xl">
                    <Users className="h-8 w-8 text-negari-gold" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-comfortaa text-gray-900">{t('landing_path_senior_title')}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t('landing_path_senior_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_ai_interview_prep')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_document_vault')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_mentor_network')}</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => {
                    if (profile) {
                      navigate('/student');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="w-full mt-4 bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_select_journey_path')}
                </Button>
              </CardContent>
            </Card>

            {/* RISE */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-negari-gold/10 rounded-xl">
                    <Sparkles className="h-8 w-8 text-negari-gold" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-comfortaa text-gray-900">{t('landing_path_rise_title')}</CardTitle>
                <CardDescription className="text-gray-600">
                  {t('landing_path_rise_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_personal_counselor')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_research_opportunities')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-negari-gold rounded-full"></div>
                    <span className="text-sm">{t('landing_leadership_development')}</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => {
                    if (profile) {
                      navigate('/student');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="w-full mt-4 bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_select_journey_path')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Moved here */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-gray-900 mb-6">{t('stay_updated')}</h2>
            <p className="text-xl text-gray-600 mb-12">{t('newsletter_desc')}</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              
              try {
                const { supabase } = await import('@/integrations/supabase/client');
                const { error } = await supabase
                  .from('newsletter_subscribers')
                  .insert({ email });
                
                if (error) {
                  if (error.code === '23505') {
                    toast({
                      title: "Already Subscribed",
                      description: "This email is already subscribed to our newsletter.",
                    });
                  } else {
                    throw error;
                  }
                } else {
                  toast({
                    title: "Successfully Subscribed!",
                    description: "Thank you for subscribing to our newsletter.",
                  });
                  e.currentTarget.reset();
                }
              } catch (error) {
                console.error('Newsletter subscription error:', error);
                toast({
                  title: "Subscription Failed",
                  description: "Please try again later.",
                  variant: "destructive"
                });
              }
            }} className="flex flex-col sm:flex-row gap-4 justify-center mb-8 max-w-md mx-auto">
              <Input 
                type="email" 
                name="email"
                placeholder={t('email_placeholder')} 
                className="flex-1"
                required
              />
              <Button type="submit" className="bg-negari-navy hover:bg-negari-navy-dark text-white px-8">
                {t('subscribe_now')}
              </Button>
            </form>
            <div className="text-center mb-12">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => window.open('https://t.me/negarischolars', '_blank')}
              >
                <MessageSquare className="h-4 w-4" />
                {t('join_telegram')}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('weekly_opportunities')}</h3>
                <p className="text-gray-600">{t('landing_weekly_opportunities_desc')}</p>
              </div>
              <div className="text-center">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('success_tips')}</h3>
                <p className="text-gray-600">{t('landing_success_stories_desc')}</p>
              </div>
              <div className="text-center">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('platform_updates')}</h3>
                <p className="text-gray-600">{t('landing_platform_updates_desc')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{t('landing_privacy_note')}</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-gray-900 mb-8">
              {t('landing_problem_title')}
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="text-8xl md:text-9xl font-bold text-negari-gold mb-4">85%</div>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                {t('landing_problem_stat_desc')}
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('landing_problem_body')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-comfortaa font-bold text-gray-900 mb-4">{t('landing_our_belief_title')}</h3>
            <blockquote className="text-2xl md:text-3xl font-medium text-negari-gold italic mb-6">
              "{t('landing_our_belief_quote')}"
            </blockquote>
            <p className="text-lg text-gray-600">
              {t('landing_our_belief_body1')}
            </p>
            <p className="text-lg text-gray-600 mt-4">
              {t('landing_our_belief_body2')}
            </p>
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-gray-900 mb-6">
              {t('landing_features_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing_features_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Brain className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_ai_essay_coach_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_ai_essay_coach_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Target className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_scholarship_finder_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_scholarship_finder_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Globe className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_offline_toolkit_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_offline_toolkit_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Shield className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_document_vault_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_document_vault_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Users className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_parent_mentor_portal_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_parent_mentor_portal_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Award className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_rise_pathway_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_rise_pathway_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <BookOpen className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_jr_prep_tools_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_jr_prep_tools_desc')}</p>
            </div>

            <div className="text-center group">
              <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-negari-gold/20 transition-colors">
                <Smartphone className="h-8 w-8 text-negari-gold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_feature_mobile_first_title')}</h3>
              <p className="text-gray-600">{t('landing_feature_mobile_first_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section */}
      <section className="py-14 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <SubscriptionPlans onSelectPlan={(plan) => setShowAuthModal(true)} />
        </div>
      </section>

      {/* Student Stories */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-gray-900 mb-6">
              {t('landing_student_stories_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing_student_stories_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{t('landing_story_1_quote')}"
                </blockquote>
                <div className="flex items-center">
                  <div className="bg-negari-navy rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    MT
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Meron Tadesse</h4>
                    <p className="text-gray-600">{t('landing_story_1_role')}</p>
                    <p className="text-gray-500 text-sm">Addis Ababa Science Academy</p>
                    <Badge className="mt-2 bg-negari-gold/10 text-negari-gold">{t('landing_badge_senior')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{t('landing_story_2_quote')}"
                </blockquote>
                <div className="flex items-center">
                  <div className="bg-negari-gold rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    DA
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Daniel Abebe</h4>
                    <p className="text-gray-600">{t('landing_story_2_role')}</p>
                    <p className="text-gray-500 text-sm">Jimma University</p>
                    <Badge className="mt-2 bg-negari-gold/10 text-negari-gold">{t('landing_badge_starter_kit')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{t('landing_story_3_quote')}"
                </blockquote>
                <div className="flex items-center">
                  <div className="bg-negari-navy rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    SM
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Sara Mekonnen</h4>
                    <p className="text-gray-600">{t('landing_story_3_role')}</p>
                    <p className="text-gray-500 text-sm">Harvard Business School</p>
                    <Badge className="mt-2 bg-negari-navy/10 text-negari-navy">{t('landing_badge_rise')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Join the Negari Community */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-comfortaa font-bold text-gray-900 mb-6">{t('landing_join_community_title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('landing_join_community_desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center hover:shadow-xl transition-shadow h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_students_title')}</h3>
                <p className="text-gray-600 mb-4">{t('landing_students_desc')}</p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_start_my_journey')}
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow h-full">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_parents_title')}</h3>
                <p className="text-gray-600 mb-4">{t('landing_parents_desc')}</p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_support_my_child')}
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_mentors_title')}</h3>
                <p className="text-gray-600 mb-4">{t('landing_mentors_desc2')}</p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_become_a_guide')}
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-negari-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-negari-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing_schools_title')}</h3>
                <p className="text-gray-600 mb-4">{t('landing_schools_desc2')}</p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-negari-navy hover:bg-negari-navy-dark text-white"
                >
                  {t('landing_bring_negari_to_classroom')}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <p className="text-gray-600">{t('landing_students_served')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-500 mb-2">500+</div>
              <p className="text-gray-600">{t('landing_scholarships_won')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">50+</div>
              <p className="text-gray-600">{t('landing_countries_reached')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
              <p className="text-gray-600">{t('landing_mentors_active')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/negari logo white.png" 
                  alt="Negari Logo" 
                  className="h-10 w-10"
                />
                <span className="font-comfortaa font-bold text-2xl">Negari</span>
              </div>
              <p className="text-white/70 mt-3 max-w-sm text-center md:text-left">
                {t('footer_tagline')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h3 className="font-semibold text-white mb-3">{t('footer_documents')}</h3>
                <div className="space-y-2">
                  <a href="/terms-of-use" className="block text-sm text-white/70 hover:text-white">
                    {t('footer_terms_of_use')}
                  </a>
                  <a href="/terms-and-conditions" className="block text-sm text-white/70 hover:text-white">
                    {t('footer_terms_and_conditions')}
                  </a>
                  <a href="/disclaimer" className="block text-sm text-white/70 hover:text-white">
                    {t('footer_disclaimer')}
                  </a>
                  <a href="/privacy-policy" className="block text-sm text-white/70 hover:text-white">
                    {t('footer_privacy_policy')}
                  </a>
                  <a href="/cookies-policy" className="block text-sm text-white/70 hover:text-white">
                    {t('footer_cookies_policy')}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">{t('footer_contact')}</h3>
                <div className="space-y-2 text-sm text-white/70">
                  <div>support@negari.com</div>
                  <div>+251-911-000000</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/50 text-sm">{t('footer_rights')}</p>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="inline-flex items-center justify-center rounded-full border border-white/20 px-2 py-1">{currentLanguage.flag}</span>
              <span className="hidden sm:inline">{currentLanguage.name}</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default LandingPage;

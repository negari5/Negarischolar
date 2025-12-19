import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  languages: Language[];
  t: (key: string) => string;
}

const allLanguages: Language[] = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'am', name: 'አማርኛ', flag: 'AM' },
  { code: 'om', name: 'Afaan Oromoo', flag: 'OM' },
  { code: 'ti', name: 'ትግርኛ', flag: 'TI' },
];

const LANGUAGE_SETTINGS_KEY = 'languageSettings';
const mapAdminLangToCode = (adminValue: string): string | null => {
  if (adminValue === 'english') return 'en';
  if (adminValue === 'amharic') return 'am';
  if (adminValue === 'oromifa') return 'om';
  if (adminValue === 'tigrigna') return 'ti';
  return null;
};

// Comprehensive translations for all sections
const translations: Record<string, Record<string, string>> = {
  en: {
    'start_journey': 'Start Your Journey',
    'assessment_test': 'Assessment Test',
    'scroll_to_explore': 'Scroll to explore',
    'landing_hero_title_line1': 'Negari is Here to',
    'landing_hero_title_line2': 'Open Doors',
    'landing_hero_subtitle': 'AI-powered scholarship companion guiding Ethiopian students from Grade 10 to global opportunities.',
    'welcome': 'Welcome',
    'scholarships': 'Scholarships',
    'mentors': 'Mentors',
    'applications': 'Applications',
    'profile': 'Profile',
    'home': 'Home',
    'explore': 'Explore',
    'journey': 'Journey',
    'messages': 'Messages',
    'info': 'Info',
    'stay_updated': 'Stay Updated. Stay Ahead.',
    'newsletter_desc': 'Get the latest scholarship opportunities, success tips, and platform updates delivered directly to your inbox. Join thousands of Ethiopian students on their journey to global education.',
    'subscribe_now': 'Subscribe Now',
    'join_telegram': 'Join our Telegram Community',
    'email_placeholder': 'Enter your email address',
    'weekly_opportunities': 'Weekly Opportunities',
    'success_tips': 'Success Tips',
    'platform_updates': 'Platform Updates',
    'guide_dreams': 'Guide the Next Generation of Global Leaders',
    'mentor_desc': 'Share your international education experience and help Ethiopian students achieve their dreams of studying abroad.',
    'start_mentoring': 'Start Mentoring',
    'learn_more': 'Learn More',
    'support_dreams': 'Support Your Child\'s Global Education Dreams',
    'parent_desc': 'Get the tools, resources, and support you need to guide your child through their international education journey.',
    'empower_institution': 'Empower Your Institution\'s Global Impact',
    'school_desc': 'Partner with Negari to enhance your school\'s international education programs and track student success on a global scale.',
    'recent_activity': 'Recent Activity',
    'system_health': 'System Health',
    'newsletter_management': 'Newsletter Management',
    'footer_settings': 'Footer Settings',
    'forgot_password': 'Forgot Password?',
    'email': 'Email',
    'password': 'Password',
    'login': 'Login',
    'signup': 'Sign Up',
    'welcome_back': 'Welcome Back',

    'profile_my_profile': 'My Profile',
    'profile_tab_profile': 'Profile',
    'profile_tab_assessment': 'Assessment',
    'profile_tab_goals': 'Goals',
    'profile_tab_progress': 'Progress',

    'profile_complete_your_profile': 'Complete Your Profile',
    'profile_personal_information': 'Personal Information',
    'profile_educational_information': 'Educational Information',
    'profile_email_settings': 'Email Settings',
    'profile_account_security': 'Account & Security',

    'profile_edit': 'Edit',
    'profile_cancel': 'Cancel',
    'profile_save_all_changes': 'Save All Changes',

    'profile_first_name': 'First Name',
    'profile_last_name': 'Last Name',
    'profile_city': 'City',
    'profile_first_name_required': 'First name and last name are required.',
    'profile_not_provided': 'Not provided',
    'profile_city_not_specified': 'City not specified',

    'profile_education_level': 'Education Level',
    'profile_school_type': 'Preparatory School Type',
    'profile_education_level_not_specified': 'Education level not specified',
    'profile_school_type_not_specified': 'School type not specified',

    'profile_current_email': 'Current Email',
    'profile_change_email': 'Change Email',
    'profile_change_email_title': 'Change Email Address',
    'profile_new_email_address': 'New Email Address',
    'profile_current_password': 'Current Password',
    'profile_send_confirmation': 'Send Confirmation',

    'profile_change_password': 'Change Password',
    'profile_new_password': 'New Password',
    'profile_confirm_new_password': 'Confirm New Password',
    'profile_update_password': 'Update Password',

    'profile_export_my_data': 'Export My Data',
    'profile_exporting': 'Exporting…',

    'profile_delete_account': 'Delete Account',
    'profile_delete_account_title': 'Delete Account',
    'profile_delete_warning': 'This will permanently delete your account and associated data. This action cannot be undone.',
    'profile_type_delete_to_confirm': 'Type DELETE to confirm',
    'profile_delete_my_account': 'Delete My Account',

    'profile_goals_title': 'Your Goals',
    'profile_dream_university': 'Dream University',
    'profile_search_universities': 'Search universities worldwide...',
    'profile_no_universities_found': 'No universities found. Try "Other" to write your own.',
    'profile_showing_first_50': 'Showing first 50 results. Type more to narrow down.',

    'profile_save_my_goals': 'Save My Goals',
    'profile_dream_major': 'Dream Major',
    'profile_target_country': 'Target Country',
    'profile_career_interests': 'Career Interests',
    'profile_preferred_fields': 'Preferred Fields of Study',
    'profile_not_specified': 'Not specified',

    'profile_assessment_title': 'Scholarship Readiness Assessment',
    'profile_progress_title': 'Your Progress',
    'profile_last_assessment_score': 'Last Assessment Score',
    'profile_completed_at': 'Completed at',
    'profile_recommendations': 'Recommendations',
    'profile_no_assessment_results_yet': 'No assessment results yet.',
    'profile_complete_assessment_to_see_progress': 'Complete your Scholarship Readiness Assessment to see your progress here.',

    'landing_what_is_title': 'What is Negari?',
    'landing_what_is_desc': 'Four specialized pathways designed to meet every Ethiopian student where they are and guide them to where they want to be.',

    'landing_path_jr_title': 'Jr.',
    'landing_path_jr_desc': 'Early preparation tools for middle school students (Grades 7-9)',
    'landing_path_starter_title': 'Starter Kit',
    'landing_path_starter_desc': 'Perfect for Grade 10-12 students beginning their scholarship journey',
    'landing_path_senior_title': 'Senior',
    'landing_path_senior_desc': 'Advanced tools for graduating students and university applicants',
    'landing_path_rise_title': 'RISE',
    'landing_path_rise_desc': 'Elite pathway for exceptional students aiming for top global universities',

    'landing_study_skills': 'Study Skills',
    'landing_career_exploration': 'Career Exploration',
    'landing_foundation_building': 'Foundation Building',
    'landing_essay_writing_coach': 'Essay Writing Coach',
    'landing_scholarship_database': 'Scholarship Database',
    'landing_application_tracker': 'Application Tracker',
    'landing_ai_interview_prep': 'AI Interview Prep',
    'landing_document_vault': 'Document Vault',
    'landing_mentor_network': 'Mentor Network',
    'landing_personal_counselor': 'Personal Counselor',
    'landing_research_opportunities': 'Research Opportunities',
    'landing_leadership_development': 'Leadership Development',
    'landing_select_journey_path': 'Select Your Journey Path',

    'landing_weekly_opportunities_desc': 'Fresh scholarship opportunities curated specifically for Ethiopian students',
    'landing_success_stories_desc': "Inspiring stories from students who've achieved their dreams",
    'landing_platform_updates_desc': 'Be the first to know about new features and improvements',
    'landing_privacy_note': 'We respect your privacy. Unsubscribe at any time. No spam, guaranteed.',

    'landing_problem_title': 'The Problem We Solve',
    'landing_problem_stat_desc': "Over 85% of Ethiopian students don't pass national exams, but we believe this doesn't define their potential or limit their destiny.",
    'landing_problem_body': 'Traditional education systems often fail to recognize diverse talents and alternative pathways to success. Many brilliant minds are left behind simply because they don\'t fit a narrow definition of academic achievement.',
    'landing_our_belief_title': 'Our Belief',
    'landing_our_belief_quote': "Talent shouldn't be lost to circumstance.",
    'landing_our_belief_body1': 'Negari believes that every Ethiopian student has the potential to achieve greatness when given the right tools, guidance, and opportunities.',
    'landing_our_belief_body2': "We're building bridges where traditional systems build walls, creating alternative pathways to global education and career opportunities.",

    'landing_features_title': 'Powerful Features',
    'landing_features_desc': 'Everything you need to navigate your educational journey and unlock global opportunities, all in one intelligent platform.',
    'landing_feature_ai_essay_coach_title': 'AI Essay Coach',
    'landing_feature_ai_essay_coach_desc': 'Get personalized feedback on your scholarship essays with AI-powered writing assistance',
    'landing_feature_scholarship_finder_title': 'Scholarship Finder',
    'landing_feature_scholarship_finder_desc': 'Discover relevant scholarships from our comprehensive database of global opportunities',
    'landing_feature_offline_toolkit_title': 'Offline Toolkit',
    'landing_feature_offline_toolkit_desc': 'Access essential tools and resources even without internet connectivity',
    'landing_feature_document_vault_title': 'Document Vault',
    'landing_feature_document_vault_desc': 'Securely store and organize all your academic documents and certificates',
    'landing_feature_parent_mentor_portal_title': 'Parent & Mentor Portal',
    'landing_feature_parent_mentor_portal_desc': 'Connect with mentors and keep parents involved in your academic journey',
    'landing_feature_rise_pathway_title': 'RISE Pathway',
    'landing_feature_rise_pathway_desc': 'Elite program for exceptional students targeting top global universities',
    'landing_feature_jr_prep_tools_title': 'Jr. Prep Tools',
    'landing_feature_jr_prep_tools_desc': 'Early preparation tools for middle school students to build strong academic foundations',
    'landing_feature_mobile_first_title': 'Mobile First',
    'landing_feature_mobile_first_desc': 'Optimized for mobile devices to ensure accessibility for all Ethiopian students',

    'sub_choose_subscription_title': 'Choose Your Subscription',
    'sub_choose_subscription_desc': 'Select a plan that fits your needs',
    'sub_recommended': 'Recommended',
    'sub_day_free_trial_suffix': '-day free trial',
    'sub_choose_prefix': 'Choose',
    'sub_select_journey_path_title': 'Select Your Journey Path',
    'sub_select_journey_path_desc': 'Choose the path that matches your academic stage',
    'sub_select_prefix': 'Select',

    'footer_tagline': "The future is yours. We're just here to guide you.",
    'footer_documents': 'Documents',
    'footer_terms_of_use': 'Terms of Use',
    'footer_terms_and_conditions': 'Terms & Conditions',
    'footer_disclaimer': 'Disclaimer',
    'footer_privacy_policy': 'Privacy Policy',
    'footer_cookies_policy': 'Cookies Policy',
    'footer_contact': 'Contact',
    'footer_rights': '© 2025 Negari. All rights reserved.',

    'landing_student_stories_title': 'Student Stories',
    'landing_student_stories_desc': "Real stories from Ethiopian students who've transformed their futures with Negari",
    'landing_join_community_title': 'Join the Negari Community',
    'landing_join_community_desc': "Whether you're a student, parent, mentor, or educator, there's a place for you in our mission to transform Ethiopian education.",
    'landing_students_title': 'Students',
    'landing_students_desc': 'Take control of your educational journey and unlock global opportunities',
    'landing_start_my_journey': 'Start My Journey',
    'landing_parents_title': 'Parents',
    'landing_parents_desc': "Support your child's dreams with tools designed for family involvement",
    'landing_support_my_child': 'Support My Child',
    'landing_mentors_title': 'Mentors',
    'landing_mentors_desc2': 'Guide the next generation of Ethiopian leaders and changemakers',
    'landing_become_a_guide': 'Become a Guide',
    'landing_schools_title': 'Schools',
    'landing_schools_desc2': 'Empower your students with comprehensive scholarship and career guidance',
    'landing_bring_negari_to_classroom': 'Bring Negari to My Classroom',
    'landing_students_served': 'Students Served',
    'landing_scholarships_won': 'Scholarships Won',
    'landing_countries_reached': 'Countries Reached',
    'landing_mentors_active': 'Mentors Active',

    'landing_story_1_quote': "Negari's AI essay coach helped me write a winning scholarship essay. I received a full scholarship to study Engineering in Canada!",
    'landing_story_1_role': 'Grade 12 Student',
    'landing_story_2_quote': "Through Negari's scholarship database, I found and won a scholarship to study Medicine in Germany. My dreams came true!",
    'landing_story_2_role': 'University Freshman',
    'landing_story_3_quote': 'The mentorship program connected me with alumni who guided me through my MBA application to Harvard Business School!',
    'landing_story_3_role': 'MBA Student',
    'landing_badge_senior': 'Senior',
    'landing_badge_starter_kit': 'Starter Kit',
    'landing_badge_rise': 'RISE',

    'plan_name_freemium': 'Freemium',
    'plan_name_basic': 'Basic Plan',
    'plan_name_premium': 'Premium Plan',
    'plan_name_enterprise': 'Enterprise Plan',
    'plan_duration_per_month': '/month',

    'plan_feature_basic_scholarship_search': 'Basic scholarship search',
    'plan_feature_profile_creation': 'Profile creation',
    'plan_feature_basic_support': 'Basic support',
    'plan_feature_community_access': 'Community access',
    'plan_feature_access_scholarship_database': 'Access to scholarship database',
    'plan_feature_basic_application_tracking': 'Basic application tracking',
    'plan_feature_email_support': 'Email support',
    'plan_feature_monthly_webinars': 'Monthly webinars',
    'plan_feature_everything_in_basic': 'Everything in Basic',
    'plan_feature_ai_essay_coach': 'AI essay coach',
    'plan_feature_priority_support': 'Priority support',
    'plan_feature_mentor_matching': 'Mentor matching',
    'plan_feature_advanced_analytics': 'Advanced analytics',
    'plan_feature_interview_preparation': 'Interview preparation',
    'plan_feature_everything_in_premium': 'Everything in Premium',
    'plan_feature_personal_counselor': 'Personal counselor',
    'plan_feature_custom_application_strategy': 'Custom application strategy',
    'plan_feature_direct_university_connections': 'Direct university connections',
    'plan_feature_24_7_phone_support': '24/7 phone support',

    'sub_path_junior_title': 'Negari Junior',
    'sub_path_junior_subtitle': 'Grades 10-11',
    'sub_path_junior_desc': 'Early preparation and foundation building',
    'sub_path_starter_title': 'Starter Kit',
    'sub_path_starter_subtitle': 'Grade 12',
    'sub_path_starter_desc': 'Exam preparation and document readiness',
    'sub_path_senior_title': 'Negari Senior',
    'sub_path_senior_subtitle': 'Post-Grade 12',
    'sub_path_senior_desc': 'Scholarship exploration and applications',
    'sub_path_rise_title': 'Negari RISE',
    'sub_path_rise_subtitle': 'Alternative Track',
    'sub_path_rise_desc': 'Alternative pathways and skill building',
  },
  am: {
    'start_journey': 'ጉዞዎን ይጀምሩ',
    'assessment_test': 'የግምገማ ፈተና',
    'scroll_to_explore': 'ለመመልከት ወደ ታች ይሸብልሉ',
    'landing_hero_title_line1': 'ነጋሪ እዚህ ነው',
    'landing_hero_title_line2': 'በሮችን ለመክፈት',
    'landing_hero_subtitle': 'ከ10ኛ ክፍል ጀምሮ የኢትዮጵያ ተማሪዎችን ወደ ዓለም አቀፍ እድሎች የሚመራ በAI የተጎላበተ የስኮላርሺፕ ጓደኛ።',
    'welcome': 'እንኳን ደህና መጡ',
    'scholarships': 'ስኮላርሺፕ',
    'mentors': 'አማካሪዎች',
    'applications': 'ማመልከቻዎች',
    'profile': 'መገለጫ',
    'home': 'ቤት',
    'explore': 'ያርቃሉ',
    'journey': 'ጉዞ',
    'messages': 'መልእክቶች',
    'info': 'መረጃ',

    'profile_my_profile': 'መገለጫዬ',
    'profile_tab_profile': 'መገለጫ',
    'profile_tab_assessment': 'ግምገማ',
    'profile_tab_goals': 'ግቦች',
    'profile_tab_progress': 'እድገት',

    'profile_complete_your_profile': 'መገለጫዎን ያጠናቁ',
    'profile_personal_information': 'የግል መረጃ',
    'profile_educational_information': 'የትምህርት መረጃ',
    'profile_email_settings': 'የኢሜይል ቅንብሮች',
    'profile_account_security': 'መለያ እና ደህንነት',

    'profile_edit': 'አርትዕ',
    'profile_cancel': 'ሰርዝ',
    'profile_save_all_changes': 'ሁሉንም ለውጦች አስቀምጥ',

    'profile_first_name': 'ስም',
    'profile_last_name': 'የአባት ስም',
    'profile_city': 'ከተማ',
    'profile_first_name_required': 'ስም እና የአባት ስም አስፈላጊ ናቸው።',
    'profile_not_provided': 'አልተሰጠም',
    'profile_city_not_specified': 'ከተማ አልተጠቀሰም',

    'profile_education_level': 'የትምህርት ደረጃ',
    'profile_school_type': 'የፕሪፓራቶሪ ት/ቤት አይነት',
    'profile_education_level_not_specified': 'የትምህርት ደረጃ አልተጠቀሰም',
    'profile_school_type_not_specified': 'የት/ቤት አይነት አልተጠቀሰም',

    'profile_current_email': 'የአሁኑ ኢሜይል',
    'profile_change_email': 'ኢሜይል ቀይር',
    'profile_change_email_title': 'የኢሜይል አድራሻ ቀይር',
    'profile_new_email_address': 'አዲስ የኢሜይል አድራሻ',
    'profile_current_password': 'የአሁኑ የይለፍ ቃል',
    'profile_send_confirmation': 'ማረጋገጫ ላክ',

    'profile_change_password': 'የይለፍ ቃል ቀይር',
    'profile_new_password': 'አዲስ የይለፍ ቃል',
    'profile_confirm_new_password': 'አዲሱን የይለፍ ቃል ያረጋግጡ',
    'profile_update_password': 'የይለፍ ቃል አዘምን',

    'profile_export_my_data': 'መረጃዬን ላክ',
    'profile_exporting': 'በመላክ ላይ…',

    'profile_delete_account': 'መለያ ሰርዝ',
    'profile_delete_account_title': 'መለያ ሰርዝ',
    'profile_delete_warning': 'ይህ መለያዎን እና ተያያዥ መረጃዎችን ሁሉ በቋሚነት ይሰርዛል። መመለስ አይቻልም።',
    'profile_type_delete_to_confirm': 'ለማረጋገጥ DELETE ይፃፉ',
    'profile_delete_my_account': 'መለያዬን ሰርዝ',

    'profile_goals_title': 'ግቦችዎ',
    'profile_dream_university': 'የህልም ዩኒቨርሲቲ',
    'profile_search_universities': 'ዩኒቨርሲቲዎችን በዓለም አቀፍ ይፈልጉ...',
    'profile_no_universities_found': 'ዩኒቨርሲቲ አልተገኘም። "Other" በመጠቀም በራስዎ ይጻፉ።',
    'profile_showing_first_50': 'የመጀመሪያ 50 ውጤቶች ብቻ እየታዩ ናቸው። የበለጠ በመጻፍ ያጥሩ።',

    'profile_save_my_goals': 'ግቦቼን አስቀምጥ',
    'profile_dream_major': 'የህልም ዋና ትምህርት (Major)',
    'profile_target_country': 'የመድረሻ ሀገር',
    'profile_career_interests': 'የሙያ ፍላጎቶች',
    'profile_preferred_fields': 'የተመረጡ የጥናት መስኮች',
    'profile_not_specified': 'አልተጠቀሰም',

    'profile_assessment_title': 'የስኮላርሺፕ ዝግጁነት ግምገማ',
    'profile_progress_title': 'እድገትዎ',
    'profile_last_assessment_score': 'የመጨረሻ ግምገማ ነጥብ',
    'profile_completed_at': 'ተጠናቋል በ',
    'profile_recommendations': 'ምክሮች',
    'profile_no_assessment_results_yet': 'እስካሁን የግምገማ ውጤት የለም።',
    'profile_complete_assessment_to_see_progress': 'እድገትዎን ለማየት የስኮላርሺፕ ዝግጁነት ግምገማውን ያጠናቁ።',
    'stay_updated': 'ሁልጊዜ ተዘምኑ። ዝግጁ ሁኑ።',
    'newsletter_desc': 'የቅርብ ጊዜ የስኮላርሺፕ እድሎችን፣ የስኬት ምክሮችን እና የመድረክ ዝመናዎችን በቀጥታ ወደ ኢሜይልዎ ያግኙ።',
    'subscribe_now': 'አሁን ይመዝገቡ',
    'join_telegram': 'የእኛን ቴሌግራም ማህበረሰብ ይቀላቀሉ',
    'email_placeholder': 'የኢሜይል አድራሻዎን ያስገቡ',
    'weekly_opportunities': 'ሳምንታዊ እድሎች',
    'success_tips': 'የስኬት ምክሮች',
    'platform_updates': 'የመድረክ ዝመናዎች',
    'guide_dreams': 'የአዲሱን ትውልድ የአለም መሪዎች መርሃ',
    'mentor_desc': 'የዓለም አቀፍ ትምህርት ልምድዎን ያጋሩ እና የኢትዮጵያ ተማሪዎች በአለም አቀፍ ደረጃ የመማር ህልማቸውን እንዲያሳኩ ይረዱ።',
    'start_mentoring': 'መምህርነት ጀምር',
    'learn_more': 'ተጨማሪ ይወቁ',
    'support_dreams': 'የልጅዎን የአሮጌ ትምህርት ህልሞች ይደግፉ',
    'parent_desc': 'የልጅዎን የአለም አቀፍ ትምህርት ጉዞ ለመምራት የሚያስፈልጉዎትን መሳሪያዎች፣ ሀብቶች እና ድጋፍ ያግኙ።',
    'empower_institution': 'የተቋምዎን የአለም አቀፍ ተፅእኖ ያጎልቡ',
    'school_desc': 'የተቋምዎን የአለም አቀፍ ትምህርት ፕሮግራሞች ለማሻሻል እና የተማሪዎችን ስኬት በአለም አቀፍ ደረጃ ለመከታተል ከነጋሪ ጋር ይተባበሩ።'
    ,
    'landing_what_is_title': 'ነጋሪ ምንድን ነው?',
    'landing_what_is_desc': 'እያንዳንዱን የኢትዮጵያ ተማሪ በሚገባ የሚያገኙና ወደ ሚፈልገው የሚመሩ 4 ልዩ መንገዶች።',

    'landing_path_jr_title': 'Jr.',
    'landing_path_jr_desc': 'ለመካከለኛ ት/ቤት ተማሪዎች (7-9) የቅድመ ዝግጅት መሳሪያዎች',
    'landing_path_starter_title': 'Starter Kit',
    'landing_path_starter_desc': 'ለ10-12 ክፍል ተማሪዎች የስኮላርሺፕ ጉዞ መጀመሪያ',
    'landing_path_senior_title': 'Senior',
    'landing_path_senior_desc': 'ለመመረቂያ ተማሪዎች እና የዩኒቨርሲቲ አመልካቾች የላቀ መሳሪያዎች',
    'landing_path_rise_title': 'RISE',
    'landing_path_rise_desc': 'ለከፍተኛ ዓለም አቀፍ ዩኒቨርሲቲዎች የሚመኙ ብቁ ተማሪዎች የላቀ መንገድ',

    'landing_study_skills': 'የመማር ክህሎት',
    'landing_career_exploration': 'ሙያ ምርመራ',
    'landing_foundation_building': 'መሠረት መገንባት',
    'landing_essay_writing_coach': 'የኤሴ መጻፍ አማካሪ',
    'landing_scholarship_database': 'የስኮላርሺፕ ዳታቤዝ',
    'landing_application_tracker': 'የማመልከቻ መከታተያ',
    'landing_ai_interview_prep': 'የAI ቃለ-መጠይቅ ዝግጅት',
    'landing_document_vault': 'የሰነድ ማህደር',
    'landing_mentor_network': 'የአማካሪ አውታረ መረብ',
    'landing_personal_counselor': 'የግል አማካሪ',
    'landing_research_opportunities': 'የምርምር እድሎች',
    'landing_leadership_development': 'የአመራር ልማት',
    'landing_select_journey_path': 'የጉዞ መንገድዎን ይምረጡ',

    'landing_weekly_opportunities_desc': 'ለኢትዮጵያ ተማሪዎች በተለይ የተመረጡ አዳዲስ የስኮላርሺፕ እድሎች',
    'landing_success_stories_desc': 'ህልማቸውን ያሳኩ ተማሪዎች የሚያነሳሱ ታሪኮች',
    'landing_platform_updates_desc': 'አዳዲስ ባህሪያትን እና ማሻሻያዎችን በመጀመሪያ ይወቁ',
    'landing_privacy_note': 'ግላዊነትዎን እናከብራለን። በማንኛውም ጊዜ ማቋረጥ ይችላሉ። ስፓም የለም።',

    'landing_problem_title': 'የምንፈታው ችግኝ',
    'landing_problem_stat_desc': 'ከ85% በላይ የኢትዮጵያ ተማሪዎች የብሔራዊ ፈተናዎችን አያልፉም፤ ነገር ግን ይህ ብቃታቸውን ወይም ዕድላቸውን አይገድብም ብለን እናምናለን።',
    'landing_problem_body': 'ባህላዊ የትምህርት ሥርዓቶች ብዙ ጊዜ ተለያዩ ችሎታዎችን እና አማራጭ መንገዶችን ማስተዋል አይችሉም። ብሩህ አእምሮዎች ከኋላ ይቀራሉ።',
    'landing_our_belief_title': 'እምነታችን',
    'landing_our_belief_quote': 'ችሎታ በሁኔታ ምክንያት መጠፋት የለበትም።',
    'landing_our_belief_body1': 'ነጋሪ ተማሪዎች በትክክለኛ መሳሪያዎች፣ መመሪያ እና እድሎች ከተደገፉ ታላቅ ነገር ማድረግ እንደሚችሉ ያምናል።',
    'landing_our_belief_body2': 'ባህላዊ ሥርዓቶች ግድግዳ በሚገነቡበት ጊዜ እኛ ድልድይ እንገንባለን፤ ወደ ዓለም አቀፍ ትምህርት እና ሙያ እድሎች መንገዶችን እንከፍታለን።',

    'landing_features_title': 'ኃይለኛ ባህሪያት',
    'landing_features_desc': 'የትምህርት ጉዞዎን ለመመራት እና ዓለም አቀፍ እድሎችን ለማግኘት የሚያስፈልጉ ነገሮች ሁሉ በአንድ ቦታ።',
    'landing_feature_ai_essay_coach_title': 'AI የኤሴ አማካሪ',
    'landing_feature_ai_essay_coach_desc': 'በAI የተጎላበተ የጽሁፍ እገዛ ጋር ለኤሴዎ የግል ግብረ መልስ ያግኙ',
    'landing_feature_scholarship_finder_title': 'ስኮላርሺፕ ፈላጊ',
    'landing_feature_scholarship_finder_desc': 'ከዓለም አቀፍ እድሎች ዳታቤዛችን ጋር ተዛማጅ ስኮላርሺፖችን ያግኙ',
    'landing_feature_offline_toolkit_title': 'ኦፍላይን መሳሪያ ስብስብ',
    'landing_feature_offline_toolkit_desc': 'ኢንተርኔት ባይኖርም አስፈላጊ መሳሪያዎችን እና ሀብቶችን ያግኙ',
    'landing_feature_document_vault_title': 'የሰነድ ማህደር',
    'landing_feature_document_vault_desc': 'የትምህርት ሰነዶችዎን እና ማስረጃዎችዎን በደህና ያከማቹ እና ያደራጁ',
    'landing_feature_parent_mentor_portal_title': 'የወላጅ እና አማካሪ ፖርታል',
    'landing_feature_parent_mentor_portal_desc': 'ከአማካሪዎች ጋር ይገናኙ እና ወላጆች በጉዞዎ እንዲሳተፉ ያድርጉ',
    'landing_feature_rise_pathway_title': 'RISE መንገድ',
    'landing_feature_rise_pathway_desc': 'ለከፍተኛ ዩኒቨርሲቲዎች የሚያስመሩ ብቁ ተማሪዎች የላቀ ፕሮግራም',
    'landing_feature_jr_prep_tools_title': 'Jr. የቅድመ ዝግጅት መሳሪያዎች',
    'landing_feature_jr_prep_tools_desc': 'ለመካከለኛ ት/ቤት ተማሪዎች ጠንካራ መሠረት ለመገንባት የሚረዱ መሳሪያዎች',
    'landing_feature_mobile_first_title': 'ሞባይል ቀዳሚ',
    'landing_feature_mobile_first_desc': 'ለሁሉም ተማሪዎች ቀላል ተደራሽነት እንዲኖር ለሞባይል ተስማሚ የተሰራ'
    ,
    'sub_choose_subscription_title': 'የደንበኝነት አይነት ይምረጡ',
    'sub_choose_subscription_desc': 'ለፍላጎትዎ የሚመች እቅድ ይምረጡ',
    'sub_recommended': 'የሚመከር',
    'sub_day_free_trial_suffix': '-ቀን ነፃ ሙከራ',
    'sub_choose_prefix': 'ይምረጡ',
    'sub_select_journey_path_title': 'የጉዞ መንገድዎን ይምረጡ',
    'sub_select_journey_path_desc': 'ከትምህርት ደረጃዎ ጋር የሚስማማ መንገድ ይምረጡ',
    'sub_select_prefix': 'ይምረጡ'
    ,
    'footer_tagline': 'ወደፊት የእርስዎ ነው። እኛ መመሪያ ብቻ ነን።',
    'footer_documents': 'ሰነዶች',
    'footer_terms_of_use': 'የአጠቃቀም መመሪያ',
    'footer_terms_and_conditions': 'ውሎች እና ሁኔታዎች',
    'footer_disclaimer': 'ማስታወቂያ',
    'footer_privacy_policy': 'የግላዊነት ፖሊሲ',
    'footer_cookies_policy': 'የኩኪ ፖሊሲ',
    'footer_contact': 'አግኙን',
    'footer_rights': '© 2025 ነጋሪ። መብቶች ሁሉ የተጠበቁ ናቸው።'
    ,
    'landing_student_stories_title': 'የተማሪ ታሪኮች',
    'landing_student_stories_desc': 'በነጋሪ ህይወታቸውን የቀየሩ የኢትዮጵያ ተማሪዎች እውነተኛ ታሪኮች',
    'landing_join_community_title': 'የነጋሪ ማህበረሰብ ይቀላቀሉ',
    'landing_join_community_desc': 'ተማሪ፣ ወላጅ፣ አማካሪ ወይም አስተማሪ ቢሆኑም በተልእኮአችን ውስጥ ቦታ አለዎት።',
    'landing_students_title': 'ተማሪዎች',
    'landing_students_desc': 'የትምህርት ጉዞዎን ይቆጣጠሩ እና ዓለም አቀፍ እድሎችን ያግኙ',
    'landing_start_my_journey': 'ጉዞዬን ጀምር',
    'landing_parents_title': 'ወላጆች',
    'landing_parents_desc': 'ለቤተሰብ ተሳትፎ የተነደፉ መሳሪያዎች ጋር የልጅዎን ህልም ይደግፉ',
    'landing_support_my_child': 'ልጄን ደግፍ',
    'landing_mentors_title': 'አማካሪዎች',
    'landing_mentors_desc2': 'የሚቀጥለውን ትውልድ መሪዎች እና ተለዋዋጮች መርሃ',
    'landing_become_a_guide': 'አማካሪ ሁን',
    'landing_schools_title': 'ት/ቤቶች',
    'landing_schools_desc2': 'ለተማሪዎችዎ የስኮላርሺፕ እና የሙያ መመሪያ የተሟላ ድጋፍ ይስጡ',
    'landing_bring_negari_to_classroom': 'ነጋሪን ወደ ት/ቤቴ አምጣ',
    'landing_students_served': 'የተገለገሉ ተማሪዎች',
    'landing_scholarships_won': 'የተሸነፉ ስኮላርሺፖች',
    'landing_countries_reached': 'የተደረሱ ሀገራት',
    'landing_mentors_active': 'ንቁ አማካሪዎች'
    ,
    'landing_story_1_quote': 'የነጋሪ የAI ኤሴ አማካሪ አሸናፊ የስኮላርሺፕ ኤሴ ለመጻፍ እጅግ ረዳኝ። በካናዳ ለመማር ሙሉ ስኮላርሺፕ አግኝቻለሁ!',
    'landing_story_1_role': '12ኛ ክፍል ተማሪ',
    'landing_story_2_quote': 'በነጋሪ የስኮላርሺፕ ዳታቤዝ በጀርመን ሕክምና ለመማር ስኮላርሺፕ አግኝቼ አሸንፌዋለሁ። ህልሜ እውነት ሆነ!',
    'landing_story_2_role': 'የዩኒቨርሲቲ 1ኛ ዓመት ተማሪ',
    'landing_story_3_quote': 'የመንተርሺፕ ፕሮግራሙ ከአሉምኒ ጋር አገናኘኝ፤ ወደ ሃርቫርድ ቢዝነስ ስኩል የMBA ማመልከቻዬን እንዴት እንደማቀርብ መመሪያ ሰጡኝ!',
    'landing_story_3_role': 'የMBA ተማሪ',
    'landing_badge_senior': 'Senior',
    'landing_badge_starter_kit': 'Starter Kit',
    'landing_badge_rise': 'RISE',

    'plan_name_freemium': 'Freemium',
    'plan_name_basic': 'Basic Plan',
    'plan_name_premium': 'Premium Plan',
    'plan_name_enterprise': 'Enterprise Plan',
    'plan_duration_per_month': '/ወር',

    'plan_feature_basic_scholarship_search': 'መሰረታዊ የስኮላርሺፕ ፍለጋ',
    'plan_feature_profile_creation': 'መገለጫ መፍጠር',
    'plan_feature_basic_support': 'መሰረታዊ ድጋፍ',
    'plan_feature_community_access': 'የማህበረሰብ መዳረሻ',
    'plan_feature_access_scholarship_database': 'ወደ የስኮላርሺፕ ዳታቤዝ መዳረሻ',
    'plan_feature_basic_application_tracking': 'መሰረታዊ የማመልከቻ መከታተያ',
    'plan_feature_email_support': 'የኢሜይል ድጋፍ',
    'plan_feature_monthly_webinars': 'ወርሃዊ ዌቢናሮች',
    'plan_feature_everything_in_basic': 'በBasic ያለው ሁሉ',
    'plan_feature_ai_essay_coach': 'AI የኤሴ አማካሪ',
    'plan_feature_priority_support': 'ቅድሚያ የሚሰጥ ድጋፍ',
    'plan_feature_mentor_matching': 'ከአማካሪ ጋር ማጣመር',
    'plan_feature_advanced_analytics': 'የላቀ ትንታኔ',
    'plan_feature_interview_preparation': 'የቃለ-መጠይቅ ዝግጅት',
    'plan_feature_everything_in_premium': 'በPremium ያለው ሁሉ',
    'plan_feature_personal_counselor': 'የግል አማካሪ',
    'plan_feature_custom_application_strategy': 'የተለየ የማመልከቻ ስትራቴጂ',
    'plan_feature_direct_university_connections': 'ቀጥታ የዩኒቨርሲቲ ግንኙነቶች',
    'plan_feature_scholarship_guarantee': 'የስኮላርሺፕ ዋስትና',
    'plan_feature_24_7_phone_support': '24/7 የስልክ ድጋፍ',

    'sub_path_junior_title': 'Negari Junior',
    'sub_path_junior_subtitle': '10-11ኛ ክፍል',
    'sub_path_junior_desc': 'የቅድመ ዝግጅት እና መሠረት መገንባት',
    'sub_path_starter_title': 'Starter Kit',
    'sub_path_starter_subtitle': '12ኛ ክፍል',
    'sub_path_starter_desc': 'የፈተና ዝግጅት እና ሰነድ ዝግጁነት',
    'sub_path_senior_title': 'Negari Senior',
    'sub_path_senior_subtitle': 'ከ12ኛ ክፍል በኋላ',
    'sub_path_senior_desc': 'ስኮላርሺፕ ፍለጋ እና ማመልከቻዎች',
    'sub_path_rise_title': 'Negari RISE',
    'sub_path_rise_subtitle': 'አማራጭ መንገድ',
    'sub_path_rise_desc': 'አማራጭ መንገዶች እና ክህሎት መገንባት'
  },
  om: {
    'start_journey': 'Imala Kee Jalqabi',
    'assessment_test': 'Qormaata Madaallii',
    'scroll_to_explore': 'Ilaaluuf gadi siqsi',
    'landing_hero_title_line1': 'Negari as jira',
    'landing_hero_title_line2': 'Balbala banachuuf',
    'landing_hero_subtitle': 'Hirmaataa scholarships AI-powered kan barattoota Itoophiyaa Kutaa 10 irraa kaasee gara carraa addunyaatti qajeelchu.',
    'welcome': 'Baga Nagaan Dhufte',
    'scholarships': 'Scholarships',
    'mentors': 'Gorsitoota',
    'applications': 'Iyyannoo',
    'profile': 'Ibsa',
    'home': 'Mana',
    'explore': 'Sakatta\'i',
    'journey': 'Imala',
    'messages': 'Ergaa',
    'info': 'Odeeffannoo',
    'stay_updated': 'Yeroo Hunda Haaromfamaa. Qophaa\'aa Taa\'aa.',
    'newsletter_desc': 'Carraa scholarships haaraa, gorsa milkaa\'inaa fi fooyya\'iinsa waltajjii keetii kallatti email kee irratti argadhu.',
    'subscribe_now': 'Amma Galmaa\'i',
    'join_telegram': 'Hawaasa Telegram Keenya Keessa Makamaa',
    'email_placeholder': 'Teessoo email keetii galchi',
    'weekly_opportunities': 'Carraa Torban',
    'success_tips': 'Gorsa Milkaa\'inaa',
    'platform_updates': 'Fooyya\'iinsa Waltajjii',
    'guide_dreams': 'Dhalootaa Haaraa Hooggantoota Addunyaa Qajeelchi',
    'mentor_desc': 'Muuxannoo barnoota addunyaa keetii qooddadhuutii barattootaa Itoophiyaa abjuu isaanii addunyaa keessatti barachuu galmaan ga\'uuf gargaari.',
    'start_mentoring': 'Gorsaa Jalqabi',
    'learn_more': 'Dabalataa Baradhu',
    'support_dreams': 'Abjuu Barnoota Addunyaa Daa\'ima Keetii Deeggari',
    'parent_desc': 'Imala barnoota addunyaa daa\'ima keetii qajeelchuuf meeshaalee, qabeenya fi deeggarsa si barbaachisan argadhu.',
    'empower_institution': 'Dhiibbaa Addunyaa Dhaabbata Keetii Cimsi',
    'school_desc': 'Sagantaa barnoota addunyaa dhaabbata keetii fooyyessuuf fi milkaa\'ina barattootaa sadarkaa addunyaatiin hordofuuf Negari waliin tumsa.',

    'landing_what_is_title': 'Negari maal dha?',
    'landing_what_is_desc': 'Karaa addaa afur kanneen barataa Itoophiyaa hundaa sadarkaa inni irra jiru irratti arganii gara bakka inni barbaadu geessuuf qophaa\'an.',

    'landing_path_jr_title': 'Jr.',
    'landing_path_jr_desc': 'Meeshaalee qophii duraa barattoota sadarkaa giddugaleessaa (Kutaa 7-9)f',
    'landing_path_starter_title': 'Starter Kit',
    'landing_path_starter_desc': 'Barattoota Kutaa 10-12 kan imala scholarship isaanii jalqabaniif baay\'ee mijataa',
    'landing_path_senior_title': 'Senior',
    'landing_path_senior_desc': 'Meeshaalee sadarkaa ol\'aanaa barattoota xumuraa fi iyyattoota yunivarsiitiif',
    'landing_path_rise_title': 'RISE',
    'landing_path_rise_desc': 'Karaa addaa (elite) barattoota addaa kan yunivarsiitii addunyaa gurguddaa irratti xiyyeeffataniif',

    'landing_study_skills': 'Dandeettii barachuu',
    'landing_career_exploration': 'Qorannoo hojii (career)',
    'landing_foundation_building': 'Bu\'uura ijaaruu',
    'landing_essay_writing_coach': 'Gorsaa barreessuu essay',
    'landing_scholarship_database': 'Kuusaa (database) scholarship',
    'landing_application_tracker': 'Hordoffii iyyannoo (application tracker)',
    'landing_ai_interview_prep': 'Qophii interview AI',
    'landing_document_vault': 'Kuusaa sanadootaa (document vault)',
    'landing_mentor_network': 'Neetworkii gorsitootaa (mentor network)',
    'landing_personal_counselor': 'Gorsaa dhuunfaa',
    'landing_research_opportunities': 'Carraa qorannoo (research)',
    'landing_leadership_development': 'Guddina hoggansaa',
    'landing_select_journey_path': 'Karaa imala kee filadhu',

    'landing_weekly_opportunities_desc': 'Carraa scholarship haaraa kan barattoota Itoophiyaaf addatti filataman',
    'landing_success_stories_desc': 'Seenaa kaka\'umsa qabu kan barattoota abjuu isaanii milkeessan',
    'landing_platform_updates_desc': 'Amaloota haaraa fi fooyya\'iinsa haaraa dura beeki',
    'landing_privacy_note': 'Iccitii kee ni kabajna. Yeroo barbaadde keessaa bahuu dandeessa. Spam hin jiru — waadaa keenya.',

    'landing_problem_title': 'Rakkoo nuti furinu',
    'landing_problem_stat_desc': 'Barattoota Itoophiyaa keessaa %85 ol qormaata biyyaalessaa hin darbani; garuu kun dandeettii isaanii hin ibsu, abjuu isaanii illee hin daangeessu jennee amanna.',
    'landing_problem_body': 'Sirni barnootaa aadaa yeroo baay\'ee dandeettii gara garaa fi karaa biraa milkaa\'inaaf jiru hin hubatu. Sammuu hojii guddaa danda\'u baay\'een, sababa hiika barnoota qixa irratti hundaa\'e keessatti hin seenuuf, duubatti hafa.',
    'landing_our_belief_title': 'Amantii keenya',
    'landing_our_belief_quote': 'Dandeettiin sababa haal-duree irraa kan ka\'e hin baduu qabdu.',
    'landing_our_belief_body1': 'Negari, barataan Itoophiyaa hundi meeshaa sirrii, qajeelfama, fi carraa yoo argate waan guddaa hojjechuu akka danda\'u ni amana.',
    'landing_our_belief_body2': 'Sirni aadaa iddoo dallaa ijaarutti, nuti riqicha ijaarra — karaa biraa barnoota addunyaa fi carraa hojii uumuuf.',

    'landing_features_title': 'Amaloota jajjaboo',
    'landing_features_desc': 'Imala barnoota kee qajeelchuuf fi carraa addunyaa banuuf wanti si barbaachisu hundi — waltajjii sammuu-qabeessa tokko keessatti.',
    'landing_feature_ai_essay_coach_title': 'Gorsaa essay AI',
    'landing_feature_ai_essay_coach_desc': 'Deeggarsa barreessuu AI waliin, essay scholarship keef yaada-deebii dhuunfaa argadhu',
    'landing_feature_scholarship_finder_title': 'Barbaadduu scholarship',
    'landing_feature_scholarship_finder_desc': 'Kuusaa carraa addunyaa bal\'aa irraa scholarships siif barbaachisan argadhu',
    'landing_feature_offline_toolkit_title': 'Meeshaalee offline',
    'landing_feature_offline_toolkit_desc': 'Interneetiin osoo hin jirin illee meeshaalee fi qabeenya barbaachisaa argadhu',
    'landing_feature_document_vault_title': 'Kuusaa sanadootaa',
    'landing_feature_document_vault_desc': 'Sanadoota barnootaa fi ragaa (certificate) kee nagaan kuusii, qindeessi',
    'landing_feature_parent_mentor_portal_title': 'Portaalii waaliddaa fi gorsitootaa',
    'landing_feature_parent_mentor_portal_desc': 'Gorsitoota waliin wal-qunnamtii uumi; warri illee imala barnoota kee keessatti akka hirmaatan godhi',
    'landing_feature_rise_pathway_title': 'Karaa RISE',
    'landing_feature_rise_pathway_desc': 'Sagantaa addaa barattoota ciccimoo kan yunivarsiitii addunyaa gurguddaa irratti xiyyeeffataniif',
    'landing_feature_jr_prep_tools_title': 'Meeshaalee qophii Jr.',
    'landing_feature_jr_prep_tools_desc': 'Meeshaalee qophii duraa barattoota kutaa 7-9 bu\'uura barnootaa cimaa ijaaruu irratti gargaaran',
    'landing_feature_mobile_first_title': 'Dursa moobaayilaaf',
    'landing_feature_mobile_first_desc': 'Moobaayilaaf haalaan qophaa\'e, barattoota Itoophiyaa hundaaf salphaatti akka argamu',

    'sub_choose_subscription_title': 'Kaffaltii (subscription) kee filadhu',
    'sub_choose_subscription_desc': 'Karoora siif mijatu filadhu',
    'sub_recommended': 'Kan gorfamu',
    'sub_day_free_trial_suffix': '-guyyaa yaalii bilisaa',
    'sub_choose_prefix': 'Filadhu',
    'sub_select_journey_path_title': 'Karaa imala kee filadhu',
    'sub_select_journey_path_desc': 'Karaa sadarkaa barnoota keetii wajjin walsimu filadhu',
    'sub_select_prefix': 'Filadhu',

    'footer_tagline': 'Fuuldurri kan kee ti. Nuti si qajeelchuuf qofa jirra.',
    'footer_documents': 'Sanadoota',
    'footer_terms_of_use': 'Seera itti fayyadamaa',
    'footer_terms_and_conditions': 'Seera fi haala (Terms & Conditions)',
    'footer_disclaimer': 'Ibsa itti-gaafatamummaa (Disclaimer)',
    'footer_privacy_policy': 'Imaammata iccitii (Privacy Policy)',
    'footer_cookies_policy': 'Imaammata cookies',
    'footer_contact': 'Nu qunnami',
    'footer_rights': '© 2025 Negari. Mirgi hundi eegameera.',

    'landing_student_stories_title': 'Seenaa Barattootaa',
    'landing_student_stories_desc': 'Seenaa dhugaa barattoota Itoophiyaa kan fuuldura isaanii Negari waliin jijjiiran',
    'landing_join_community_title': 'Hawaasa Negari keessatti makamaa',
    'landing_join_community_desc': 'Barataa, waaliddaa, gorsaa, yookaan barsiisaa yoo taate illee, hojii keenya barnoota Itoophiyaa jijjiiru keessatti bakka siif jira.',
    'landing_students_title': 'Barattoota',
    'landing_students_desc': 'Imala barnoota kee to\'achuun carraa addunyaa banuu',
    'landing_start_my_journey': 'Imala koo jalqabi',
    'landing_parents_title': 'Warra',
    'landing_parents_desc': 'Meeshaalee hirmaannaa maatii irratti hundaa\'an waliin abjuu daa\'ima kee deeggari',
    'landing_support_my_child': 'Daa\'ima koo deeggari',
    'landing_mentors_title': 'Gorsitoota',
    'landing_mentors_desc2': 'Dhaloota itti aanu hoggantoota fi jijjiiramaa ta\'an qajeelchi',
    'landing_become_a_guide': 'Gorsaa ta\'i',
    'landing_schools_title': 'Mana barumsaa',
    'landing_schools_desc2': 'Barattoota kee humneessi: gorsa scholarship fi hojii (career) guutuu kenni',
    'landing_bring_negari_to_classroom': 'Negari kutaa koo keessa fidi',
    'landing_students_served': 'Barattoota tajaajilaman',
    'landing_scholarships_won': 'Scholarships mo\'ataman',
    'landing_countries_reached': 'Biyyoota ga\'aman',
    'landing_mentors_active': 'Gorsitoota hojii irra jiran',

    'landing_story_1_quote': 'Gorsaan essay AI kan Negari, essay scholarship koo mo\'ataa barreessuuf na gargaare. Kanaadaa keessatti injinariingii barachuuf scholarship guutuu argadhe!',
    'landing_story_1_role': 'Barataa Kutaa 12',
    'landing_story_2_quote': 'Kuusaa scholarship Negari irraa, Jarmanii keessatti fayyaa (Medicine) barachuuf scholarship argadhe oo mo\'adhe. Abjuun koo dhugaa ta\'e!',
    'landing_story_2_role': 'Barataa Yunivarsiitii waggaa 1ffaa',
    'landing_story_3_quote': 'Sagantaan mentorship, alumni waliin na wal-qunnamsiise; arji (application) MBA koo gara Harvard Business School akka dhiheessu na gorsan!',
    'landing_story_3_role': 'Barataa MBA',
    'landing_badge_senior': 'Senior',
    'landing_badge_starter_kit': 'Starter Kit',
    'landing_badge_rise': 'RISE',

    'plan_name_freemium': 'Freemium',
    'plan_name_basic': 'Basic Plan',
    'plan_name_premium': 'Premium Plan',
    'plan_name_enterprise': 'Enterprise Plan',
    'plan_duration_per_month': '/ji\'a',

    'plan_feature_basic_scholarship_search': 'Barbaacha scholarship bu\'uuraa',
    'plan_feature_profile_creation': 'Uumama profile',
    'plan_feature_basic_support': 'Deeggarsa bu\'uuraa',
    'plan_feature_community_access': 'Seensa hawaasaa',
    'plan_feature_access_scholarship_database': 'Seensa kuusaa scholarship',
    'plan_feature_basic_application_tracking': 'Hordoffii iyyannoo bu\'uuraa',
    'plan_feature_email_support': 'Deeggarsa email',
    'plan_feature_monthly_webinars': 'Webinar torban/ji\'a (monthly) ',
    'plan_feature_everything_in_basic': 'Wanti Basic keessa jiru hundi',
    'plan_feature_ai_essay_coach': 'Gorsaa essay AI',
    'plan_feature_priority_support': 'Deeggarsa dursa kennamu',
    'plan_feature_mentor_matching': 'Wal-makeessuu gorsaa (mentor matching)',
    'plan_feature_advanced_analytics': 'Xiinxala sadarkaa ol\'aanaa',
    'plan_feature_interview_preparation': 'Qophii interview',
    'plan_feature_everything_in_premium': 'Wanti Premium keessa jiru hundi',
    'plan_feature_personal_counselor': 'Gorsaa dhuunfaa',
    'plan_feature_custom_application_strategy': 'Tarsiimoo iyyannoo addaa',
    'plan_feature_direct_university_connections': 'Wal-qunnamtii kallattii yunivarsiitii',
    'plan_feature_scholarship_guarantee': 'Waadaa scholarship',
    'plan_feature_24_7_phone_support': 'Deeggarsa bilbilaa 24/7',

    'sub_path_junior_title': 'Negari Junior',
    'sub_path_junior_subtitle': 'Kutaa 10-11',
    'sub_path_junior_desc': 'Qophii duraa fi bu\'uura ijaaruu',
    'sub_path_starter_title': 'Starter Kit',
    'sub_path_starter_subtitle': 'Kutaa 12',
    'sub_path_starter_desc': 'Qophii qormaataa fi qophii sanadootaa',
    'sub_path_senior_title': 'Negari Senior',
    'sub_path_senior_subtitle': 'Kutaa 12 booda',
    'sub_path_senior_desc': 'Barbaacha scholarship fi iyyannoo',
    'sub_path_rise_title': 'Negari RISE',
    'sub_path_rise_subtitle': 'Karaa filannoo biraa',
    'sub_path_rise_desc': 'Karaa filannoo biraa fi ijaarama dandeettii'
  },
  ti: {
    'start_journey': 'ጉዕዞኻ ጀምር',
    'assessment_test': 'ፈተና ግምገማ',
    'scroll_to_explore': 'ንምርኣይ ታሕቲ ዝርግሕ',
    'landing_hero_title_line1': 'ነጋሪ ኣብዚ ኣሎ',
    'landing_hero_title_line2': 'በሮታት ንምኽፋት',
    'landing_hero_subtitle': 'ካብ 10ይ ክፍሊ ጀሚሩ ተመሃሮ ኢትዮጵያ ናብ ዓለማዊ ዕድላት ዝመርሕ ብAI ዝተጎላበተ መሓዛ ስኮላርሺፕ።',
    'welcome': 'እንቋዕ ብደሓን መጻኻ',
    'scholarships': 'ስኮላርሺፕ',
    'mentors': 'መምህራን',
    'applications': 'ማመልከቲ',
    'profile': 'መግለጺ',
    'home': 'ገዛ',
    'explore': 'ምርመራ',
    'journey': 'ጉዕዞ',
    'messages': 'መልእክቲ',
    'info': 'ሓበሬታ',
    'stay_updated': 'ኩሉ ግዜ ተሓድሽ። ተዳሎው ኮን።',
    'newsletter_desc': 'ናይ ቀረባ እዋን ዕድላት ስኮላርሺፕ፣ ምኽሪ ዓወት፣ ከምኡ ውን ናይ መድረኽ ምዕባለታት ብኸምኡ ናብ ኢመይልካ ተቀበል።',
    'subscribe_now': 'ሕጂ ተመዝገብ',
    'join_telegram': 'ናይ ቴሌግራም ማሕበረሰብና ተጻወት',
    'email_placeholder': 'ናይ ኢመይል አድራሻኻ እተው',
    'weekly_opportunities': 'ሳምንታዊ ዕድላት',
    'success_tips': 'ምኽሪ ዓወት',
    'platform_updates': 'ምዕባለታት መድረኽ',
    'guide_dreams': 'ሓድሽ ወለዶ መራሕቲ ዓለም መርሕ',
    'mentor_desc': 'ተመክሮ ዓለማዊ ትምህርቲኻ ካፈል፣ ከምኡ ውን ተመሃሮ ኢትዮጵያ ሕልምታቶም ኣብ ዓለም ንኽመሃሩ ሓግዞም።',
    'start_mentoring': 'መምህር ምዃን ጀምር',
    'learn_more': 'ዝያዳ ተማሃር',
    'support_dreams': 'ሕልሚ ዓለማዊ ትምህርቲ ውላድካ ደግፍ',
    'parent_desc': 'ጉዕዞ ዓለማዊ ትምህርቲ ውላድካ ንምምራሕ ዘድልዩካ መሳርሒታት፣ ጸጋታት፣ ከምኡ ውን ደገፍ ረክብ።',
    'empower_institution': 'ዓለማዊ ጽልዋ ትካልካ ሓይልን አቀርብ',
    'school_desc': 'ናይ ትካልካ ዓለማዊ ትምህርቲ ፕሮግራማት ንምምሕያሽ፣ ከምኡ ውን ዓወት ተመሃሮ ብዓለማዊ መንገዲ ንምክትታል ምስ ነጋሪ ተሓባበር።',

    'landing_what_is_title': 'ነጋሪ እንታይ እዩ?',
    'landing_what_is_desc': 'ንነፍሲ ወከፍ ተመሃሪ ኢትዮጵያ ኣብ ዘለዎ ደረጃ ንምርካብን ናብ ዝደልዮ ቦታ ንምምራሕን ዝተዳለዉ 4 ፍሉያት መንገድታት።',

    'landing_path_jr_title': 'Jr.',
    'landing_path_jr_desc': 'ንተመሃሮ መካከለኛ ት/ቤት (ክፍሊ 7-9) ዝተዳለወ ኣቐዲሙ ምድላው መሳርሒታት',
    'landing_path_starter_title': 'Starter Kit',
    'landing_path_starter_desc': 'ንተመሃሮ ክፍሊ 10-12 ጉዕዞ ስኮላርሺፕ ዝጀምሩ ብጣዕሚ ዝምችእ',
    'landing_path_senior_title': 'Senior',
    'landing_path_senior_desc': 'ንተመሃሮ ዝወድኡን ንተመልከቲ ዩኒቨርሲቲን ዝኸውን ላዕለዋይ መሳርሒታት',
    'landing_path_rise_title': 'RISE',
    'landing_path_rise_desc': 'ንፍሉያት ተመሃሮ ናብ ላዕለዋይ ዩኒቨርሲቲታት ዓለም ዝተነጠቐ መንገዲ',

    'landing_study_skills': 'ክእለት ምምሃር',
    'landing_career_exploration': 'ምርመራ ሞያ',
    'landing_foundation_building': 'ምስራት መሰረት',
    'landing_essay_writing_coach': 'መምርሒ ጽሑፍ (Essay)',
    'landing_scholarship_database': 'ዳታቤዝ ስኮላርሺፕ',
    'landing_application_tracker': 'መከታተሊ ማመልከቲ',
    'landing_ai_interview_prep': 'ምድላው ቃለ-መጠይቕ ብAI',
    'landing_document_vault': 'መዝገብ ሰነዳት',
    'landing_mentor_network': 'ኔትዎርክ መምህራን',
    'landing_personal_counselor': 'ውልቃዊ ኣማካሪ',
    'landing_research_opportunities': 'ዕድላት ምርምር',
    'landing_leadership_development': 'ምዕባለ መሪነት',
    'landing_select_journey_path': 'መንገዲ ጉዕዞኻ ምረጽ',

    'landing_weekly_opportunities_desc': 'ንተመሃሮ ኢትዮጵያ ብፍሉይ ዝተመረጹ ሓደሽቲ ዕድላት ስኮላርሺፕ',
    'landing_success_stories_desc': 'ሕልሞም ዝኣሳኸዉ ተመሃሮ ዝተነፃፃሪ ታሪኻት',
    'landing_platform_updates_desc': 'ሓደሽቲ ባህርያትን ምምሕያሽን ቀዳማይ ክትፈልጥ',
    'landing_privacy_note': 'ግላዊነትካ ንኽብር ኢና። ዝኾነ ግዜ ክትሰርዝ ትኽእል። ስፓም የለን — ተረጋጊጹ።',

    'landing_problem_title': 'እቲ እንፈትሖ ሽግር',
    'landing_problem_stat_desc': '%85 ላዕሊ ተመሃሮ ኢትዮጵያ ፈተና ብሔራዊ ኣይሓልፉን፤ ግን እዚ ዓቕሞም ኣይውስንን፣ ዕጫኦም ውን ኣይውስንን ኢልና እናምን።',
    'landing_problem_body': 'ባህላዊ ስርዓተ-ትምህርቲ ብዙሕ ግዜ ዝተፈላለዩ ችሎታታትን ኣማራጭ መንገድታት ዓወትን ንምርካብ ይሕጽር። ብሩህ ኣእምሮ ብዙሕ ግዜ ስለ ዝተጠቐሰ ጠባብ መለክዒ ውጽኢት ትምህርቲ ኣይከተሉን ኢሎም ከም ዝተረፉ ይግበር።',
    'landing_our_belief_title': 'እምነትና',
    'landing_our_belief_quote': 'ችሎታ ብሁኔታ ምኽንያት ክጠፍእ ኣይግባእን።',
    'landing_our_belief_body1': 'ነጋሪ ንነፍሲ ወከፍ ተመሃሪ ኢትዮጵያ ትኽክለኛ መሳርሒታት፣ መምርሒ እና ዕድላት እንተ ረኺቡ ነገር ብርቱዕ ክገብር ይኽእል ዝብል እምነት ኣሎዎ።',
    'landing_our_belief_body2': 'ባህላዊ ስርዓት ግድግዳ ኣብ ዝህንጽ እዋን፣ ንሕና ድልድይ ንህንጽ — መንገድታት ናይ ዓለማዊ ትምህርቲን ዕድላት ስራሕን ንምፍጣር።',

    'landing_features_title': 'ሓያል ባህርያት',
    'landing_features_desc': 'ጉዕዞ ትምህርቲኻ ንምምራሕን ዓለማዊ ዕድላት ንምኽፋትን ዝድልየካ ነገር ኩሉ — ኣብ ሓደ ብልሒ ዘለዎ መድረኽ።',
    'landing_feature_ai_essay_coach_title': 'መምርሒ ጽሑፍ (Essay) ብAI',
    'landing_feature_ai_essay_coach_desc': 'ብAI ዝተደገፈ ሓገዝ ጽሑፍ ጋር ንEssay ስኮላርሺፕካ ውልቃዊ ግብረ-መልሲ ረክብ',
    'landing_feature_scholarship_finder_title': 'መርካቢ ስኮላርሺፕ',
    'landing_feature_scholarship_finder_desc': 'ካብ ብዙሕ ዳታቤዝና ዓለማዊ ዕድላት ዝስማዑ ስኮላርሺፕ ረክብ',
    'landing_feature_offline_toolkit_title': 'መሳርሒታት ኦፍላይን',
    'landing_feature_offline_toolkit_desc': 'እንተ ኢንተርኔት የለን እኳ መሳርሒታትን ጸጋታትን ኣገዳስ ረክብ',
    'landing_feature_document_vault_title': 'መዝገብ ሰነዳት',
    'landing_feature_document_vault_desc': 'ሰነዳት ትምህርቲኻን ምስክርነታትካን ብደሓን ኣከማችን ኣደራጅን',
    'landing_feature_parent_mentor_portal_title': 'ፖርታል ወላዲን መምህርን',
    'landing_feature_parent_mentor_portal_desc': 'ምስ መምህራን ተራኸብ እና ወላዲ ኣብ ጉዕዞ ትምህርቲኻ ንኽሳተፍ ግበር',
    'landing_feature_rise_pathway_title': 'መንገዲ RISE',
    'landing_feature_rise_pathway_desc': 'ንፍሉያት ተመሃሮ ናብ ላዕለዋይ ዩኒቨርሲቲታት ዓለም ዝተነጠቐ ፕሮግራም',
    'landing_feature_jr_prep_tools_title': 'መሳርሒታት ምድላው Jr.',
    'landing_feature_jr_prep_tools_desc': 'ንተመሃሮ መካከለኛ ት/ቤት ጽኑዕ መሰረት ንምህናጽ ዝሕግዙ መሳርሒታት',
    'landing_feature_mobile_first_title': 'ሞባይል ቀዳማይ',
    'landing_feature_mobile_first_desc': 'ንኩሎም ተመሃሮ ኢትዮጵያ ቀሊል ተዳረስቲ ንክኾን ንሞባይል ዝተመቻቸ',

    'sub_choose_subscription_title': 'ፕላን ምዝገባኻ ምረጽ',
    'sub_choose_subscription_desc': 'ንድሌትካ ዝስማዕ ፕላን ምረጽ',
    'sub_recommended': 'ዝምከር',
    'sub_day_free_trial_suffix': '-መዓልቲ ናይ ነጻ ፈተና',
    'sub_choose_prefix': 'ምረጽ',
    'sub_select_journey_path_title': 'መንገዲ ጉዕዞኻ ምረጽ',
    'sub_select_journey_path_desc': 'እቲ ከም ደረጃ ትምህርቲኻ ዝስማዕ መንገዲ ምረጽ',
    'sub_select_prefix': 'ምረጽ',

    'footer_tagline': 'ትዕድል ቅድሚት ናትካ እያ። ንሕና ንምምራሕካ ጥራይ ኢና ኣብዚ ዘለና።',
    'footer_documents': 'ሰነዳት',
    'footer_terms_of_use': 'ሕጊ ኣጠቓቕማ',
    'footer_terms_and_conditions': 'ውዕልን ኩነታትን',
    'footer_disclaimer': 'ሓላፍነት መግለጺ (Disclaimer)',
    'footer_privacy_policy': 'ፖሊሲ ግላዊነት',
    'footer_cookies_policy': 'ፖሊሲ ኩኪስ',
    'footer_contact': 'ርኸቡና',
    'footer_rights': '© 2025 ነጋሪ። ኩሉ መሰል ዝተሓለወ እዩ።',

    'landing_student_stories_title': 'ታሪኻት ተመሃሮ',
    'landing_student_stories_desc': 'እውነተኛ ታሪኻት ተመሃሮ ኢትዮጵያ ብነጋሪ ምስ ዝተቀየረ መጻኢኦም',
    'landing_join_community_title': 'ማሕበረሰብ ነጋሪ ተቀላቀል',
    'landing_join_community_desc': 'ተመሃሪ፣ ወላዲ፣ መምህር ወይ መምህር እንተኾንካ እውን፣ ኣብ ምቕያር ትምህርቲ ኢትዮጵያ ተልእኮና ቦታ ኣሎካ።',
    'landing_students_title': 'ተመሃሮ',
    'landing_students_desc': 'ጉዕዞ ትምህርቲኻ ተቆጻጸር እና ዓለማዊ ዕድላት ክፈት',
    'landing_start_my_journey': 'ጉዕዞይ ጀምር',
    'landing_parents_title': 'ወላዲ',
    'landing_parents_desc': 'ውላድካ ንሕልሙ ብመሳርሒታት ናይ ቤተሰብ ሳተፎ ዝተዳለዉ ደግፎ',
    'landing_support_my_child': 'ውላደይ ደግፍ',
    'landing_mentors_title': 'መምህራን',
    'landing_mentors_desc2': 'ዝቐጽል ወለዶ መራሕቲ ኢትዮጵያ መርሕ',
    'landing_become_a_guide': 'መምህር ኩን',
    'landing_schools_title': 'ት/ቤት',
    'landing_schools_desc2': 'ንተመሃሮ ናይ ስኮላርሺፕን ሞያን መምርሒ ዝተሟላ ደገፍ ሃብ',
    'landing_bring_negari_to_classroom': 'ነጋሪ ናብ ክፍሊ ትምህርቲይ ኣምጽእ',
    'landing_students_served': 'ተመሃሮ ዝተገልገሉ',
    'landing_scholarships_won': 'ዝተሸነፉ ስኮላርሺፕ',
    'landing_countries_reached': 'ዝተበጽሑ ሃገራት',
    'landing_mentors_active': 'ንቑ መምህራን',

    'landing_story_1_quote': 'መምርሒ ኤሴ ብAI ናይ ነጋሪ ኤሴ ስኮላርሺፕ ዝሓሸ ንምጽሓፍ እጅግ ሓገዘኒ። ኣብ ካናዳ ምህንድስና ንምምሃር ሙሉእ ስኮላርሺፕ ረኺበ!',
    'landing_story_1_role': 'ተመሃሪ ክፍሊ 12',
    'landing_story_2_quote': 'ብዳታቤዝ ስኮላርሺፕ ነጋሪ ኣብ ጀርመን ሕክምና ንምምሃር ስኮላርሺፕ ረኺበ ኣሸኒፈ። ሕልሚይ ሓቂ ኮይኑ!',
    'landing_story_2_role': 'ተመሃሪ ዩኒቨርሲቲ 1ይ ዓመት',
    'landing_story_3_quote': 'ፕሮግራም መንተርሺፕ ምስ ኣሉምኒ ኣገናኣኒ፤ ኣፕሊኬሽን MBAይ ንHarvard Business School ከም እንታይ ክቐርብ መምርሒ ሃቡኒ!',
    'landing_story_3_role': 'ተመሃሪ MBA',
    'landing_badge_senior': 'Senior',
    'landing_badge_starter_kit': 'Starter Kit',
    'landing_badge_rise': 'RISE',

    'plan_name_freemium': 'Freemium',
    'plan_name_basic': 'Basic Plan',
    'plan_name_premium': 'Premium Plan',
    'plan_name_enterprise': 'Enterprise Plan',
    'plan_duration_per_month': '/ወር',

    'plan_feature_basic_scholarship_search': 'መሰረታዊ ምርካብ ስኮላርሺፕ',
    'plan_feature_profile_creation': 'ምፍጣር መግለጺ',
    'plan_feature_basic_support': 'መሰረታዊ ደገፍ',
    'plan_feature_community_access': 'ምድራሻ ማሕበረሰብ',
    'plan_feature_access_scholarship_database': 'ምድራሻ ዳታቤዝ ስኮላርሺፕ',
    'plan_feature_basic_application_tracking': 'መሰረታዊ መከታተሊ ማመልከቲ',
    'plan_feature_email_support': 'ደገፍ ኢመይል',
    'plan_feature_monthly_webinars': 'ወርሓዊ ዌቢናራት',
    'plan_feature_everything_in_basic': 'ኩሉ ኣብ Basic ዘሎ',
    'plan_feature_ai_essay_coach': 'መምርሒ ጽሑፍ (Essay) ብAI',
    'plan_feature_priority_support': 'ቅድሚያ ዝረክብ ደገፍ',
    'plan_feature_mentor_matching': 'ምምዛዝ መምህር (Mentor matching)',
    'plan_feature_advanced_analytics': 'ላዕለዋይ ትንተና',
    'plan_feature_interview_preparation': 'ምድላው ቃለ-መጠይቕ',
    'plan_feature_everything_in_premium': 'ኩሉ ኣብ Premium ዘሎ',
    'plan_feature_personal_counselor': 'ውልቃዊ ኣማካሪ',
    'plan_feature_custom_application_strategy': 'ፍሉይ ስትራቴጂ ማመልከቲ',
    'plan_feature_direct_university_connections': 'ቀጥታ ግንኙነት ዩኒቨርሲቲ',
    'plan_feature_scholarship_guarantee': 'ዋስትና ስኮላርሺፕ',
    'plan_feature_24_7_phone_support': 'ደገፍ ቴሌፎን 24/7',

    'sub_path_junior_title': 'Negari Junior',
    'sub_path_junior_subtitle': 'ክፍሊ 10-11',
    'sub_path_junior_desc': 'ኣቐዲሙ ምድላውን ምስራት መሰረትን',
    'sub_path_starter_title': 'Starter Kit',
    'sub_path_starter_subtitle': 'ክፍሊ 12',
    'sub_path_starter_desc': 'ምድላው ፈተናን ዝግጁነት ሰነዳትን',
    'sub_path_senior_title': 'Negari Senior',
    'sub_path_senior_subtitle': 'ድሕሪ ክፍሊ 12',
    'sub_path_senior_desc': 'ምርመራ ስኮላርሺፕን ማመልከቲታትን',
    'sub_path_rise_title': 'Negari RISE',
    'sub_path_rise_subtitle': 'ኣማራጭ መንገዲ',
    'sub_path_rise_desc': 'ኣማራጭ መንገድታት እና ምህናጽ ክእለት'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const enabledLanguageCodes = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(LANGUAGE_SETTINGS_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const enabled: string[] = Array.isArray(parsed?.enabledLanguages) ? parsed.enabledLanguages : [];
      const mapped = enabled.map(mapAdminLangToCode).filter(Boolean) as string[];
      return mapped.length ? mapped : null;
    } catch {
      return null;
    }
  }, []);

  const languages = useMemo(() => {
    if (!enabledLanguageCodes) return allLanguages;
    return allLanguages.filter(l => enabledLanguageCodes.includes(l.code));
  }, [enabledLanguageCodes]);

  const [currentLanguage, setCurrentLanguage] = useState<Language>(allLanguages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguageCode = localStorage.getItem('selectedLanguage');
    if (savedLanguageCode) {
      const savedLanguage = allLanguages.find(lang => lang.code === savedLanguageCode);
      if (savedLanguage) setCurrentLanguage(savedLanguage);
      return;
    }

    const rawSettings = localStorage.getItem(LANGUAGE_SETTINGS_KEY);
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings);
        const mappedDefault = mapAdminLangToCode(parsed?.defaultLanguage);
        if (mappedDefault) {
          const defaultLanguage = allLanguages.find(l => l.code === mappedDefault);
          if (defaultLanguage) {
            setCurrentLanguage(defaultLanguage);
            localStorage.setItem('selectedLanguage', defaultLanguage.code);
          }
        }
      } catch {
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (!languages.find(l => l.code === currentLanguage.code)) {
      setCurrentLanguage(languages[0] ?? allLanguages[0]);
    }
  }, [currentLanguage.code, languages]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language.code);
    
    // Update document language
    document.documentElement.lang = language.code;
    
    // Force page re-render by updating a timestamp
    const event = new CustomEvent('languageChanged', { detail: language });
    window.dispatchEvent(event);
    
    // You can add more language switching logic here
    // For example, update the page direction for RTL languages
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
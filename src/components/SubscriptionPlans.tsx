import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubscriptionPlansProps {
  onSelectPlan: (subscriptionType: string) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan }) => {
  const { subscriptions } = useSubscriptions();
  const { t } = useLanguage();

  const planNameKeyMap: Record<string, string> = {
    'Freemium': 'plan_name_freemium',
    'Basic Plan': 'plan_name_basic',
    'Premium Plan': 'plan_name_premium',
    'Enterprise Plan': 'plan_name_enterprise',
  };

  const durationKeyMap: Record<string, string> = {
    '/month': 'plan_duration_per_month',
    ' /month': 'plan_duration_per_month',
    'per month': 'plan_duration_per_month',
  };

  const featureKeyMap: Record<string, string> = {
    'Basic scholarship search': 'plan_feature_basic_scholarship_search',
    'Profile creation': 'plan_feature_profile_creation',
    'Basic support': 'plan_feature_basic_support',
    'Community access': 'plan_feature_community_access',
    'Access to scholarship database': 'plan_feature_access_scholarship_database',
    'Basic application tracking': 'plan_feature_basic_application_tracking',
    'Email support': 'plan_feature_email_support',
    'Monthly webinars': 'plan_feature_monthly_webinars',
    'Everything in Basic': 'plan_feature_everything_in_basic',
    'AI essay coach': 'plan_feature_ai_essay_coach',
    'Priority support': 'plan_feature_priority_support',
    'Mentor matching': 'plan_feature_mentor_matching',
    'Advanced analytics': 'plan_feature_advanced_analytics',
    'Interview preparation': 'plan_feature_interview_preparation',
    'Everything in Premium': 'plan_feature_everything_in_premium',
    'Personal counselor': 'plan_feature_personal_counselor',
    'Custom application strategy': 'plan_feature_custom_application_strategy',
    'Direct university connections': 'plan_feature_direct_university_connections',
    '24/7 phone support': 'plan_feature_24_7_phone_support',
  };

  const translatePlanName = (name: string) => {
    const key = planNameKeyMap[name];
    return key ? t(key) : name;
  };

  const translateDuration = (duration: string) => {
    const key = durationKeyMap[duration];
    return key ? t(key) : duration;
  };

  const translateFeature = (feature: string) => {
    const key = featureKeyMap[feature];
    return key ? t(key) : feature;
  };

  const activePlans = subscriptions.filter(sub => sub.is_active);

  return (
    <div className="space-y-12 py-8">
      {/* Subscription Tiers */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-negari-indigo mb-2">{t('sub_choose_subscription_title')}</h3>
          <p className="text-muted-foreground">{t('sub_choose_subscription_desc')}</p>
        </div>

        <div className="flex flex-col md:flex-row md:flex-nowrap gap-6 max-w-5xl mx-auto justify-center items-stretch overflow-x-auto md:overflow-visible pb-2">
          {activePlans.map((plan) => (
            (() => {
              const planDisplayName = translatePlanName(plan.name);
              const planDuration = translateDuration(plan.duration);

              return (
            <Card 
              key={plan.id}
              className={`relative flex flex-col h-full w-full md:w-72 flex-shrink-0 hover:shadow-lg transition-all duration-200 ${
                plan.recommended 
                  ? 'ring-2 ring-negari-indigo border-negari-indigo border-2 bg-negari-gold/10' 
                  : 'bg-white'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-negari-navy text-white font-bold shadow-md px-4 py-1 rounded-full">
                    {t('sub_recommended')}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className={`text-xl text-negari-indigo ${plan.recommended ? 'font-bold' : ''}`}>
                  {planDisplayName}
                </CardTitle>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-negari-indigo">
                    {plan.currency === 'USD' ? '$' : plan.currency}
                    {plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">{planDuration}</div>
                  {plan.trialDays > 0 && (
                    <div className="text-sm text-negari-orange mt-2">
                      {plan.trialDays}{t('sub_day_free_trial_suffix')}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-negari-orange mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{translateFeature(feature)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full ${
                      plan.recommended
                        ? 'bg-negari-indigo hover:bg-negari-navy text-negari-gold'
                        : 'bg-negari-indigo hover:bg-negari-navy text-negari-gold'
                    }`}
                  >
                    {t('sub_choose_prefix')} {planDisplayName}
                  </Button>
                </div>
              </CardContent>
            </Card>
              );
            })()
          ))}
        </div>
      </div>

      {/* Account Types */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-negari-indigo mb-2">{t('sub_select_journey_path_title')}</h3>
          <p className="text-muted-foreground">{t('sub_select_journey_path_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              id: 'junior',
              title: t('sub_path_junior_title'),
              subtitle: t('sub_path_junior_subtitle'),
              description: t('sub_path_junior_desc'),
              color: 'border-green-400'
            },
            {
              id: 'starter',
              title: t('sub_path_starter_title'),
              subtitle: t('sub_path_starter_subtitle'),
              description: t('sub_path_starter_desc'),
              color: 'border-blue-400'
            },
            {
              id: 'senior',
              title: t('sub_path_senior_title'),
              subtitle: t('sub_path_senior_subtitle'),
              description: t('sub_path_senior_desc'),
              color: 'border-purple-400'
            },
            {
              id: 'rise',
              title: t('sub_path_rise_title'),
              subtitle: t('sub_path_rise_subtitle'),
              description: t('sub_path_rise_desc'),
              color: 'border-orange-400'
            }
          ].map((type) => (
            <Card 
              key={type.id}
              className={`hover:shadow-lg transition-all duration-200 border-2 ${type.color} h-full`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-negari-indigo">{type.title}</CardTitle>
                <CardDescription className="font-medium text-negari-orange">
                  {type.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-sm text-muted-foreground text-center">
                  {type.description}
                </p>

                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => onSelectPlan(type.id)}
                    variant="outline"
                    className="w-full border-negari-navy text-negari-navy hover:bg-negari-navy hover:text-white transition-colors"
                  >
                    {t('sub_select_prefix')} {type.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
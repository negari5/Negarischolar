import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string;
  trialDays: number;
  features: string[];
  popular: boolean;
  recommended: boolean;
  color: string;
  currency: string;
  is_active: boolean;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  setSubscriptions: (subscriptions: Subscription[]) => void;
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
}

const defaultSubscriptions: Subscription[] = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: 0,
    duration: '/month',
    trialDays: 0,
    features: [
      'Basic scholarship search',
      'Profile creation',
      'Basic support',
      'Community access'
    ],
    popular: false,
    recommended: false,
    color: 'border-muted',
    currency: 'USD',
    is_active: true
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    duration: '/month',
    trialDays: 7,
    features: [
      'Access to scholarship database',
      'Basic application tracking',
      'Email support',
      'Monthly webinars'
    ],
    popular: false,
    recommended: false,
    color: 'border-primary',
    currency: 'USD',
    is_active: true
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 19.99,
    duration: '/month',
    trialDays: 14,
    features: [
      'Everything in Basic',
      'AI essay coach',
      'Priority support',
      'Mentor matching',
      'Advanced analytics',
      'Interview preparation'
    ],
    popular: true,
    recommended: true,
    color: 'border-secondary',
    currency: 'USD',
    is_active: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 49.99,
    duration: '/month',
    trialDays: 30,
    features: [
      'Everything in Premium',
      'Personal counselor',
      'Custom application strategy',
      'Direct university connections',
      '24/7 phone support'
    ],
    popular: false,
    recommended: false,
    color: 'border-accent',
    currency: 'USD',
    is_active: true
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptionsState] = useState<Subscription[]>(defaultSubscriptions);

  const setSubscriptions = (newSubscriptions: Subscription[]) => {
    setSubscriptionsState(newSubscriptions);
    localStorage.setItem('subscriptions', JSON.stringify(newSubscriptions));
  };

  const addSubscription = (subscription: Subscription) => {
    const newSubscriptions = [...subscriptions, subscription];
    setSubscriptions(newSubscriptions);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    const newSubscriptions = subscriptions.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    );
    setSubscriptions(newSubscriptions);
  };

  const deleteSubscription = (id: string) => {
    const newSubscriptions = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(newSubscriptions);
  };

  useEffect(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('subscriptions');
    if (saved) {
      try {
        const parsedSubscriptions = JSON.parse(saved);
        setSubscriptionsState(parsedSubscriptions);
      } catch (error) {
        console.error('Error loading subscriptions from localStorage:', error);
      }
    }
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      setSubscriptions,
      addSubscription,
      updateSubscription,
      deleteSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};
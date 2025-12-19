
import React from 'react';
import FunctionalFamilySupport from './FunctionalFamilySupport';

interface FamilySupportProps {
  onNotification: (title: string, description: string) => void;
}

const FamilySupport = ({ onNotification }: FamilySupportProps) => {
  return <FunctionalFamilySupport />;
};

export default FamilySupport;

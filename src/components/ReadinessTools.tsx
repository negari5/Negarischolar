
import React from 'react';
import InteractiveReadinessTools from './InteractiveReadinessTools';

interface ReadinessToolsProps {
  onNotification: (title: string, description: string) => void;
}

const ReadinessTools = ({ onNotification }: ReadinessToolsProps) => {
  return <InteractiveReadinessTools onNotification={onNotification} />;
};

export default ReadinessTools;

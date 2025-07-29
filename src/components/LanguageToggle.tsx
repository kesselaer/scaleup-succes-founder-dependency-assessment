import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'nl' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('nl')}
        className="flex items-center space-x-1 h-8 px-2"
      >
        <div className="w-3 h-2 flex flex-col rounded-sm overflow-hidden">
          <div className="h-px bg-red-500 flex-1"></div>
          <div className="h-px bg-white flex-1"></div>
          <div className="h-px bg-blue-500 flex-1"></div>
        </div>
        <span className="text-xs">NL</span>
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="flex items-center space-x-1 h-8 px-2"
      >
        <div className="w-3 h-2 bg-blue-600 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-1 bg-red-600"></div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-white transform -skew-y-12"></div>
          <div className="absolute top-0.5 left-0 w-full h-0.5 bg-red-600 transform skew-y-12"></div>
          <div className="absolute top-0 left-0 h-full w-0.5 bg-white transform -skew-x-12"></div>
          <div className="absolute top-0 left-0.5 h-full w-0.5 bg-red-600 transform skew-x-12"></div>
        </div>
        <span className="text-xs">EN</span>
      </Button>
    </div>
  );
};

export default LanguageToggle;
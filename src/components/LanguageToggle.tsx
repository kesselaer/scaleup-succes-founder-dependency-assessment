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
        <div className="w-3 h-2 flex">
          <div className="w-1 bg-red-500 rounded-l-sm"></div>
          <div className="w-1 bg-white"></div>
          <div className="w-1 bg-blue-500 rounded-r-sm"></div>
        </div>
        <span className="text-xs">NL</span>
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="flex items-center space-x-1 h-8 px-2"
      >
        <div className="w-3 h-2 flex relative bg-blue-600 rounded-sm">
          <div className="absolute inset-0 bg-blue-600"></div>
          <div className="absolute top-0 left-0 w-1.5 h-1 bg-red-500"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-white"></div>
          <div className="absolute top-0.5 left-0 w-full h-px bg-red-500"></div>
          <div className="absolute top-1 left-0 w-full h-px bg-white"></div>
          <div className="absolute top-0 left-0 w-px h-1 bg-white"></div>
          <div className="absolute top-0 left-0.5 w-px h-1 bg-red-500"></div>
          <div className="absolute top-0 left-1 w-px h-1 bg-white"></div>
        </div>
        <span className="text-xs">EN</span>
      </Button>
    </div>
  );
};

export default LanguageToggle;
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
        <span className="text-sm">🇳🇱</span>
        <span className="text-xs">NL</span>
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="flex items-center space-x-1 h-8 px-2"
      >
        <span className="text-sm">🇬🇧</span>
        <span className="text-xs">EN</span>
      </Button>
    </div>
  );
};

export default LanguageToggle;
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'nl' ? 'en' : 'nl')}
      className="h-8 px-3"
    >
      {language === 'nl' ? 'English' : 'Nederlands'}
    </Button>
  );
};

export default LanguageToggle;
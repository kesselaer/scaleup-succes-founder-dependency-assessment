import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

interface IntroPageProps {
  onStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  const { t } = useLanguage();

  const areas = [
    { name: t('category.strategic'), weight: '25%', desc: t('category.strategic.desc') },
    { name: t('category.operational'), weight: '20%', desc: t('category.operational.desc') },
    { name: t('category.customer'), weight: '20%', desc: t('category.customer.desc') },
    { name: t('category.financial'), weight: '15%', desc: t('category.financial.desc') },
    { name: t('category.leadership'), weight: '10%', desc: t('category.leadership.desc') },
    { name: t('category.external'), weight: '10%', desc: t('category.external.desc') }
  ];

  const steps = [
    { step: 1, title: t('intro.step1.title'), desc: t('intro.step1.desc') },
    { step: 2, title: t('intro.step2.title'), desc: t('intro.step2.desc') },
    { step: 3, title: t('intro.step3.title'), desc: t('intro.step3.desc') },
    { step: 4, title: t('intro.step4.title'), desc: t('intro.step4.desc') }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Language Toggle - Top Right */}
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('intro.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('intro.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent text-accent-foreground">
            {t('intro.badge.questions')}
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent text-accent-foreground">
            {t('intro.badge.time')}
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent text-accent-foreground">
            {t('intro.badge.results')}
          </Badge>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader className="text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">{t('intro.benefits.analysis.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              {t('intro.benefits.analysis.desc')}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader className="text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">{t('intro.benefits.scoring.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              {t('intro.benefits.scoring.desc')}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader className="text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">{t('intro.benefits.actions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              {t('intro.benefits.actions.desc')}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Areas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary" />
            <span>{t('intro.areas.title')}</span>
          </CardTitle>
          <CardDescription>
            {t('intro.areas.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {areas.map((area, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{area.name}</h4>
                    <Badge variant="outline" className="text-xs">{area.weight}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Clock className="w-6 h-6 text-primary" />
            <span>{t('intro.howItWorks.title')}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {steps.map((item) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-6">
        <Card className="shadow-card bg-gradient-subtle border-primary/20">
          <CardContent className="p-8">
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-accent mx-auto" />
              <h3 className="text-2xl font-semibold">{t('intro.cta.title')}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('intro.cta.desc')}
              </p>
              
              <Button 
                onClick={onStart}
                size="lg"
                className="text-lg px-8 py-3 shadow-md hover:shadow-lg transition-smooth"
              >
                {t('intro.cta.button')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          {t('intro.privacy')}
        </p>
      </div>
    </div>
  );
};

export default IntroPage;
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw,
  Download,
  Target,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  id: string;
  name: string;
  weight: number;
  questions: string[];
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
}

interface ResultsPageProps {
  scores: Record<string, number[]>;
  contactInfo: ContactInfo | null;
  onRestart: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ scores, contactInfo, onRestart }) => {
  const { t } = useLanguage();

  const categories: Category[] = [
    {
      id: 'strategic',
      name: t('category.strategic'),
      weight: 25,
      questions: [
        'Strategische beslissingen door founder alleen',
        'Beslissingsbevoegdheden teamleden', 
        'Gedocumenteerd besluitvormingsproces',
        'Zelfstandig opereren MT-leden'
      ]
    },
    {
      id: 'operational',
      name: t('category.operational'),
      weight: 20,
      questions: [
        'Gedocumenteerde processen',
        'Taken door anderen uitvoerbaar',
        'Back-up personen aanwezig',
        'Gestandaardiseerde workflows'
      ]
    },
    {
      id: 'customer',
      name: t('category.customer'),
      weight: 20,
      questions: [
        'Klantrelaties met teamleden',
        'Klantenwerving zonder founder',
        'Overdraagbare klantprocessen',
        'CRM-systeem voor klantkennis'
      ]
    },
    {
      id: 'financial',
      name: t('category.financial'),
      weight: 15,
      questions: [
        'Financiële rapportages door anderen',
        'Gedelegeerde budgetbeslissingen',
        'Transparantie financiële prestaties',
        'Geautomatiseerde processen'
      ]
    },
    {
      id: 'leadership',
      name: t('category.leadership'),
      weight: 10,
      questions: [
        'Zelfstandig teammanagement',
        'KPIs zonder founder tussenkomst',
        'Conflictoplossing zonder founder',
        'Directe rapportagelijnen'
      ]
    },
    {
      id: 'external',
      name: t('category.external'),
      weight: 10,
      questions: [
        'Contacten buiten founder om',
        'Onderhandelingen door anderen',
        'Gediversifieerde externe relaties',
        'Gedocumenteerde procedures'
      ]
    }
  ];

  // Calculate scores per category and total
  const calculateCategoryScore = (categoryId: string, weight: number) => {
    const categoryScores = scores[categoryId] || [];
    const sum = categoryScores.reduce((acc, score) => acc + score, 0);
    const percentage = (sum / 16) * 100; // Max 16 points per category (4 questions × 4 points, scoring 0-4)
    const weightedScore = (percentage * weight) / 100;
    
    return {
      raw: sum,
      percentage,
      weightedScore,
      average: sum / 4
    };
  };

  const categoryResults = categories.map(category => ({
    ...category,
    ...calculateCategoryScore(category.id, category.weight)
  }));

  const totalScore = categoryResults.reduce((acc, cat) => acc + cat.weightedScore, 0);

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: t('results.level.excellent'), color: 'accent', icon: CheckCircle, description: t('results.level.excellent.desc') };
    if (score >= 60) return { level: t('results.level.good'), color: 'primary', icon: TrendingUp, description: t('results.level.good.desc') };
    if (score >= 40) return { level: t('results.level.moderate'), color: 'warning', icon: AlertTriangle, description: t('results.level.moderate.desc') };
    if (score >= 20) return { level: t('results.level.weak'), color: 'destructive', icon: TrendingDown, description: t('results.level.weak.desc') };
    return { level: t('results.level.critical'), color: 'destructive', icon: AlertTriangle, description: t('results.level.critical.desc') };
  };

  const overallAssessment = getScoreLevel(totalScore);
  const lowScoreCategories = categoryResults.filter(cat => cat.average < 3);

  const getAdvice = (category: any) => {
    return t(`advice.${category.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Print Logo - Only visible when printing */}
      <div className="hidden print:flex justify-center mb-8">
        <img 
          src="/lovable-uploads/c83f8102-5851-44d7-a364-12ecac248789.png" 
          alt="ScaleUp Succes Logo" 
          className="h-20 w-auto"
        />
      </div>

      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <div></div>
        <div className="text-sm text-muted-foreground">
          {t('results.title')}
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="shadow-elevated bg-gradient-subtle border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <overallAssessment.icon className={`w-8 h-8 text-primary`} />
            <CardTitle className="text-3xl text-foreground">{t('results.scoreTitle')}</CardTitle>
          </div>
          
          <div className="text-6xl font-bold text-primary mb-2">
            {Math.round(totalScore)}
          </div>
          
          <Badge 
            variant="secondary" 
            className="text-lg px-4 py-2 bg-accent text-accent-foreground"
          >
            {overallAssessment.level}
          </Badge>
          
          <CardDescription className="text-lg mt-4 max-w-2xl mx-auto text-foreground">
            {overallAssessment.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        {categoryResults.map((category) => (
          <Card key={category.id} className="shadow-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{t('assessment.weighting')}: {category.weight}%</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(category.percentage)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category.raw}/16 punten
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Progress value={category.percentage} className="h-2" />
              
              {category.average < 3 && (
                  <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-5 h-5 text-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{t('results.advice.title')}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {getAdvice(category)}
                        </p>
                      </div>
                    </div>
                  </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Plan */}
      {lowScoreCategories.length > 0 && (
        <Card className="shadow-card border-accent/30">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl text-foreground">{t('results.actionPlan.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('results.actionPlan.subtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {lowScoreCategories
                .sort((a, b) => a.average - b.average)
                .slice(0, 3)
                .map((category, index) => (
                  <div key={category.id} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-foreground">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getAdvice(category)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('results.newAssessment')}</span>
        </Button>
        
        <Button
          onClick={() => window.print()}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{t('results.print')}</span>
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('results.disclaimer')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
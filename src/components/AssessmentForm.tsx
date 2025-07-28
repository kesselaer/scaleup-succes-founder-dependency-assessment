import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
  id: string;
  text: string;
}

interface Category {
  id: string;
  name: string;
  weight: number;
  questions: Question[];
}

interface AssessmentFormProps {
  onComplete: (scores: Record<string, number[]>) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  
  const categories: Category[] = [
    {
      id: 'strategic',
      name: t('category.strategic'),
      weight: 25,
      questions: [
        { id: 's1', text: t('question.s1') },
        { id: 's2', text: t('question.s2') },
        { id: 's3', text: t('question.s3') },
        { id: 's4', text: t('question.s4') }
      ]
    },
    {
      id: 'operational',
      name: t('category.operational'),
      weight: 20,
      questions: [
        { id: 'o1', text: t('question.o1') },
        { id: 'o2', text: t('question.o2') },
        { id: 'o3', text: t('question.o3') },
        { id: 'o4', text: t('question.o4') }
      ]
    },
    {
      id: 'customer',
      name: t('category.customer'),
      weight: 20,
      questions: [
        { id: 'c1', text: t('question.c1') },
        { id: 'c2', text: t('question.c2') },
        { id: 'c3', text: t('question.c3') },
        { id: 'c4', text: t('question.c4') }
      ]
    },
    {
      id: 'financial',
      name: t('category.financial'),
      weight: 15,
      questions: [
        { id: 'f1', text: t('question.f1') },
        { id: 'f2', text: t('question.f2') },
        { id: 'f3', text: t('question.f3') },
        { id: 'f4', text: t('question.f4') }
      ]
    },
    {
      id: 'leadership',
      name: t('category.leadership'),
      weight: 10,
      questions: [
        { id: 'l1', text: t('question.l1') },
        { id: 'l2', text: t('question.l2') },
        { id: 'l3', text: t('question.l3') },
        { id: 'l4', text: t('question.l4') }
      ]
    },
    {
      id: 'external',
      name: t('category.external'),
      weight: 10,
      questions: [
        { id: 'e1', text: t('question.e1') },
        { id: 'e2', text: t('question.e2') },
        { id: 'e3', text: t('question.e3') },
        { id: 'e4', text: t('question.e4') }
      ]
    }
  ];

  const [currentCategoryIndex, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number[]>>({});

  const currentCategory = categories[currentCategoryIndex];
  const progress = ((currentCategoryIndex) / categories.length) * 100;

  const handleScoreChange = (questionId: string, score: number) => {
    const categoryId = currentCategory.id;
    const questionIndex = currentCategory.questions.findIndex(q => q.id === questionId);
    
    setScores(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [questionIndex]: score
      }
    }));
  };

  const getCurrentCategoryScores = () => {
    return scores[currentCategory.id] || {};
  };

  const isCurrentCategoryComplete = () => {
    const categoryScores = getCurrentCategoryScores();
    return currentCategory.questions.every((_, index) => 
      categoryScores[index] !== undefined && categoryScores[index] >= 0
    );
  };

  const canProceed = () => {
    return isCurrentCategoryComplete();
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrent(currentCategoryIndex + 1);
    } else {
      // Convert scores to array format expected by parent
      const formattedScores: Record<string, number[]> = {};
      categories.forEach(category => {
        formattedScores[category.id] = category.questions.map((_, index) => 
          scores[category.id]?.[index] || 0
        );
      });
      onComplete(formattedScores);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrent(currentCategoryIndex - 1);
    }
  };

  const ScoreButton = ({ score, questionId, currentScore }: { score: number; questionId: string; currentScore?: number }) => (
    <button
      onClick={() => handleScoreChange(questionId, score)}
      className={`
        w-12 h-12 rounded-full border-2 transition-smooth font-semibold
        ${currentScore === score 
          ? 'bg-primary border-primary text-primary-foreground shadow-md' 
          : 'border-border hover:border-primary hover:bg-primary/5'
        }
      `}
    >
      {score}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <div className="text-sm text-muted-foreground">
          {t('assessment.title')}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t('assessment.progress')}</span>
          <span>{currentCategoryIndex + 1} van {categories.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Category Card */}
      <Card className="shadow-card">
        <CardHeader className="bg-gradient-hero text-primary-foreground rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{currentCategoryIndex + 1}</span>
            </div>
            <div>
              <CardTitle className="text-xl">{currentCategory.name}</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {t('assessment.weighting')}: {currentCategory.weight}% • {currentCategory.questions.length} {t('assessment.questions')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {currentCategory.questions.map((question, index) => {
            const currentScore = getCurrentCategoryScores()[index];
            
            return (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium leading-relaxed">
                  {question.text}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {[0, 1, 2, 3, 4].map(score => (
                      <ScoreButton 
                        key={score}
                        score={score}
                        questionId={question.id}
                        currentScore={currentScore}
                      />
                    ))}
                  </div>
                  
                  <div className="text-right text-sm space-y-1">
                    <div className="text-muted-foreground">{t('assessment.scoreScale.dependent')}</div>
                    <div className="text-muted-foreground">{t('assessment.scoreScale.autonomous')}</div>
                  </div>
                </div>
                
                {index < currentCategory.questions.length - 1 && (
                  <hr className="border-border" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCategoryIndex === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('assessment.previous')}</span>
        </Button>

        <div className="flex items-center space-x-2">
          {isCurrentCategoryComplete() && (
            <div className="flex items-center space-x-2 text-accent">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{t('assessment.complete')}</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center space-x-2"
        >
          <span>{currentCategoryIndex === categories.length - 1 ? t('assessment.viewResults') : t('assessment.next')}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssessmentForm;
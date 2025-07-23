import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

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

const categories: Category[] = [
  {
    id: 'strategic',
    name: 'Strategische Besluitvorming',
    weight: 25,
    questions: [
      { id: 's1', text: 'Worden belangrijke strategische beslissingen alleen door de founder genomen?' },
      { id: 's2', text: 'Hebben teamleden duidelijke beslissingsbevoegdheden binnen hun rol?' },
      { id: 's3', text: 'Bestaat er een gedocumenteerd besluitvormingsproces?' },
      { id: 's4', text: 'Kunnen MT-leden zelfstandig binnen hun domein opereren?' }
    ]
  },
  {
    id: 'operational',
    name: 'Operationele Processen',
    weight: 20,
    questions: [
      { id: 'o1', text: 'Zijn kritieke processen gedocumenteerd en overdraagbaar?' },
      { id: 'o2', text: 'Kunnen belangrijke taken door anderen worden uitgevoerd?' },
      { id: 'o3', text: 'Bestaan er back-up personen voor essentiële functies?' },
      { id: 'o4', text: 'Zijn workflows gestandaardiseerd en niet persoon-afhankelijk?' }
    ]
  },
  {
    id: 'customer',
    name: 'Klantrelaties',
    weight: 20,
    questions: [
      { id: 'c1', text: 'Hebben klanten directe relaties met andere teamleden?' },
      { id: 'c2', text: 'Kan het bedrijf nieuwe klanten binnenhalen zonder directe betrokkenheid van de founder?' },
      { id: 'c3', text: 'Zijn klantprocessen (van lead tot levering) overdraagbaar?' },
      { id: 'c4', text: 'Bestaat er een CRM-systeem dat klantkennis vastlegt?' }
    ]
  },
  {
    id: 'financial',
    name: 'Financiële Controle',
    weight: 15,
    questions: [
      { id: 'f1', text: 'Kunnen anderen financiële rapportages interpreteren en erop handelen?' },
      { id: 'f2', text: 'Zijn budgetbeslissingen gedelegeerd binnen duidelijke kaders?' },
      { id: 'f3', text: 'Bestaat er transparantie in financiële prestaties voor het MT?' },
      { id: 'f4', text: 'Zijn er geautomatiseerde financiële processen en controles?' }
    ]
  },
  {
    id: 'leadership',
    name: 'Team Leadership',
    weight: 10,
    questions: [
      { id: 'l1', text: 'Kunnen teamleiders zelfstandig hun teams managen?' },
      { id: 'l2', text: 'Zijn er duidelijke KPI\'s en feedback-systemen zonder tussenkomst van de founder?' },
      { id: 'l3', text: 'Kunnen conflicten en problemen zonder de founder worden opgelost?' },
      { id: 'l4', text: 'Hebben teamleden directe rapportagelijnen naar andere managers?' }
    ]
  },
  {
    id: 'external',
    name: 'Externe Stakeholders',
    weight: 10,
    questions: [
      { id: 'e1', text: 'Hebben leveranciers en partners contacten buiten de founder om?' },
      { id: 'e2', text: 'Kunnen anderen namens het bedrijf onderhandelen?' },
      { id: 'e3', text: 'Zijn externe relaties gediversifieerd over het team?' },
      { id: 'e4', text: 'Bestaan er gedocumenteerde procedures voor stakeholder management?' }
    ]
  }
];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
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
      categoryScores[index] !== undefined && categoryScores[index] >= 1
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
          scores[category.id]?.[index] || 1
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
          Founder Dependency Assessment
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Voortgang</span>
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
                Weging: {currentCategory.weight}% • {currentCategory.questions.length} vragen
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
                    {[1, 2, 3, 4].map(score => (
                      <ScoreButton 
                        key={score}
                        score={score}
                        questionId={question.id}
                        currentScore={currentScore}
                      />
                    ))}
                  </div>
                  
                  <div className="text-right text-sm space-y-1">
                    <div className="text-muted-foreground">1 = Founder afhankelijk</div>
                    <div className="text-muted-foreground">4 = Volledig autonoom</div>
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
          <span>Vorige</span>
        </Button>

        <div className="flex items-center space-x-2">
          {isCurrentCategoryComplete() && (
            <div className="flex items-center space-x-2 text-accent">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Compleet</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center space-x-2"
        >
          <span>{currentCategoryIndex === categories.length - 1 ? 'Resultaten bekijken' : 'Volgende'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssessmentForm;
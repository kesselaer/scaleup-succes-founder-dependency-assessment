import React, { useState } from 'react';
import IntroPage from '@/components/IntroPage';
import AssessmentForm from '@/components/AssessmentForm';
import ResultsPage from '@/components/ResultsPage';

type AppState = 'intro' | 'assessment' | 'results';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('intro');
  const [assessmentScores, setAssessmentScores] = useState<Record<string, number[]>>({});

  const handleStartAssessment = () => {
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (scores: Record<string, number[]>) => {
    setAssessmentScores(scores);
    setCurrentState('results');
  };

  const handleRestart = () => {
    setAssessmentScores({});
    setCurrentState('intro');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {currentState === 'intro' && (
        <IntroPage onStart={handleStartAssessment} />
      )}
      
      {currentState === 'assessment' && (
        <AssessmentForm onComplete={handleAssessmentComplete} />
      )}
      
      {currentState === 'results' && (
        <ResultsPage 
          scores={assessmentScores} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default Index;

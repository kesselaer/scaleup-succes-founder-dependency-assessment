import React, { useState } from 'react';
import IntroPage from '@/components/IntroPage';
import AssessmentForm from '@/components/AssessmentForm';
import ContactForm, { ContactInfo } from '@/components/ContactForm';
import ResultsPage from '@/components/ResultsPage';

type AppState = 'intro' | 'assessment' | 'contact' | 'results';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('intro');
  const [assessmentScores, setAssessmentScores] = useState<Record<string, number[]>>({});
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  const handleStartAssessment = () => {
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (scores: Record<string, number[]>) => {
    setAssessmentScores(scores);
    setCurrentState('contact');
  };

  const handleContactSubmit = (info: ContactInfo) => {
    setContactInfo(info);
    setCurrentState('results');
  };

  const handleRestart = () => {
    setAssessmentScores({});
    setContactInfo(null);
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
      
      {currentState === 'contact' && (
        <ContactForm onSubmit={handleContactSubmit} scores={assessmentScores} />
      )}
      
      {currentState === 'results' && (
        <ResultsPage 
          scores={assessmentScores} 
          contactInfo={contactInfo}
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default Index;

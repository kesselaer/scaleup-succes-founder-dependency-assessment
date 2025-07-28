import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => void;
  scores: Record<string, number[]>;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, scores }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Input sanitization helper
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .slice(0, 100); // Limit length to prevent buffer overflow
  };

  const handleInputChange = (field: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.firstName || !formData.lastName || !formData.companyName || !formData.email) {
      toast({
        title: t('validation.fieldsTitle'),
        description: t('validation.required'),
        variant: "destructive",
      });
      return;
    }

    // Input length validation
    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      toast({
        title: t('validation.firstNameTitle'),
        description: t('validation.firstName'),
        variant: "destructive",
      });
      return;
    }

    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      toast({
        title: t('validation.lastNameTitle'), 
        description: t('validation.lastName'),
        variant: "destructive",
      });
      return;
    }

    if (formData.companyName.length < 2 || formData.companyName.length > 100) {
      toast({
        title: t('validation.companyNameTitle'),
        description: t('validation.companyName'),
        variant: "destructive",
      });
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email) || formData.email.length > 254) {
      toast({
        title: t('validation.emailTitle'),
        description: t('validation.email'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate overall score for email
      const categories = [
        { id: 'strategic', weight: 25 },
        { id: 'operational', weight: 20 },
        { id: 'customer', weight: 20 },
        { id: 'financial', weight: 15 },
        { id: 'leadership', weight: 10 },
        { id: 'external', weight: 10 }
      ];

      const categoryResults = categories.map(category => {
        const categoryScores = scores[category.id] || [];
        const sum = categoryScores.reduce((acc, score) => acc + score, 0);
        const percentage = (sum / 20) * 100; // Max 20 points per category (5 questions * 4 max score)
        const weightedScore = (percentage * category.weight) / 100;
        return weightedScore;
      });

      const totalScore = categoryResults.reduce((acc, score) => acc + score, 0);
      
      const getScoreLevel = (score: number) => {
        if (score >= 80) return t('results.level.excellent');
        if (score >= 60) return t('results.level.good');
        if (score >= 40) return t('results.level.moderate');
        if (score >= 20) return t('results.level.weak');
        return t('results.level.critical');
      };

      // Send email via edge function
      const { error } = await supabase.functions.invoke("send-assessment-results", {
        body: {
          contactInfo: formData,
          scores,
          totalScore: Math.round(totalScore),
          overallLevel: getScoreLevel(totalScore),
          language
        }
      });

      if (error) {
        console.error('Email sending failed');
        toast({
          title: t('toast.emailErrorTitle'),
          description: t('toast.emailError'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('toast.emailSuccessTitle'),
          description: t('toast.emailSuccess'),
        });
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Submission failed');
      toast({
        title: t('toast.technicalErrorTitle'),
        description: t('toast.technicalError'),
        variant: "destructive",
      });
      // Still proceed to show results even if email fails
      onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-elevated bg-gradient-subtle border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Mail className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl text-foreground">{t('contact.title')}</CardTitle>
          </div>
          <CardDescription className="text-lg">
            {t('contact.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('contact.firstName')} *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  placeholder={t('contact.firstName.placeholder')}
                  maxLength={50}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('contact.lastName')} *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  placeholder={t('contact.lastName.placeholder')}
                  maxLength={50}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">{t('contact.companyName')} *</Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleInputChange('companyName')}
                placeholder={t('contact.companyName.placeholder')}
                maxLength={100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('contact.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder={t('contact.email.placeholder')}
                maxLength={254}
                required
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t('contact.note').replace('**', '').replace('**', '')}
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('contact.submitting') : t('contact.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
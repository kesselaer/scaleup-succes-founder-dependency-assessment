import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

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
        title: "Velden ontbreken",
        description: "Vul alle velden in om door te gaan.",
        variant: "destructive",
      });
      return;
    }

    // Input length validation
    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      toast({
        title: "Ongeldige voornaam",
        description: "Voornaam moet tussen 2 en 50 karakters zijn.",
        variant: "destructive",
      });
      return;
    }

    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      toast({
        title: "Ongeldige achternaam", 
        description: "Achternaam moet tussen 2 en 50 karakters zijn.",
        variant: "destructive",
      });
      return;
    }

    if (formData.companyName.length < 2 || formData.companyName.length > 100) {
      toast({
        title: "Ongeldige bedrijfsnaam",
        description: "Bedrijfsnaam moet tussen 2 en 100 karakters zijn.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email) || formData.email.length > 254) {
      toast({
        title: "Ongeldig emailadres",
        description: "Voer een geldig emailadres in.",
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
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Goed";
        if (score >= 40) return "Matig";
        if (score >= 20) return "Zwak";
        return "Kritiek";
      };

      // Send email via edge function
      const { error } = await supabase.functions.invoke("send-assessment-results", {
        body: {
          contactInfo: formData,
          scores,
          totalScore: Math.round(totalScore),
          overallLevel: getScoreLevel(totalScore)
        }
      });

      if (error) {
        console.error('Email sending failed');
        toast({
          title: "Email fout",
          description: "Het rapport kon niet worden verstuurd, maar je resultaten worden wel getoond.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Rapport verzonden!",
          description: "Je rapport is verstuurd naar info@scaleupsucces.nl",
        });
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Submission failed');
      toast({
        title: "Technische fout",
        description: "Er is een technisch probleem opgetreden. Probeer het later opnieuw.",
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
            <CardTitle className="text-2xl text-foreground">Bijna klaar!</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Laat je gegevens achter om je persoonlijke Founder Dependency rapport te ontvangen
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Voornaam *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  placeholder="Je voornaam"
                  maxLength={50}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Achternaam *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  placeholder="Je achternaam"
                  maxLength={50}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Bedrijfsnaam *</Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleInputChange('companyName')}
                placeholder="Naam van je bedrijf"
                maxLength={100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Emailadres *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="je@email.com"
                maxLength={254}
                required
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Je rapport wordt verstuurd naar <strong>info@scaleupsucces.nl</strong> en je ontvangt een kopie op het opgegeven emailadres.
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Bezig met verzenden...' : 'Verstuur mijn rapport'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
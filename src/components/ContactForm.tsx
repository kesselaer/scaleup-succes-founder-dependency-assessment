import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => void;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validatie
    if (!formData.firstName || !formData.lastName || !formData.companyName || !formData.email) {
      toast({
        title: "Velden ontbreken",
        description: "Vul alle velden in om door te gaan.",
        variant: "destructive",
      });
      return;
    }

    // Email validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Ongeldig emailadres",
        description: "Voer een geldig emailadres in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Voor nu gaan we door zonder email verzenden
      // TODO: Implementeer email functionaliteit via Supabase
      toast({
        title: "Gegevens opgeslagen",
        description: "Je resultaten worden nu getoond.",
      });
      
      onSubmit(formData);
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
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
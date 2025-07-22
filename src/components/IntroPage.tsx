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

interface IntroPageProps {
  onStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Founder Dependency Assessment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ontdek systematisch waar uw bedrijf te afhankelijk van u is als founder 
            en krijg concrete actiestappen voor meer autonomie.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent text-accent-foreground">
            24 Vragen
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent text-accent-foreground">
            5 Minuten
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent text-accent-foreground">
            Directe Resultaten
          </Badge>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader className="text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Systematische Analyse</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              Identificeer precies waar uw bedrijf te afhankelijk van u is 
              met ons wetenschappelijk onderbouwde framework.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader className="text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Gewogen Scoring</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              Krijg een objectieve score gebaseerd op de werkelijke impact 
              van verschillende bedrijfsgebieden op uw autonomie.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader className="text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Concrete Acties</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              Ontvang direct uitvoerbare verbeteracties en een 90-dagen 
              actieplan om uw afhankelijkheid te verminderen.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Areas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary" />
            <span>Wat We Meten</span>
          </CardTitle>
          <CardDescription>
            De assessment evalueert 6 kritieke gebieden van founder dependency
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'Strategische Besluitvorming', weight: '25%', desc: 'Hoe strategische keuzes worden gemaakt' },
              { name: 'Operationele Processen', weight: '20%', desc: 'Documentatie en overdraagbaarheid van processen' },
              { name: 'Klantrelaties', weight: '20%', desc: 'Diversificatie van klantcontacten' },
              { name: 'Financiële Controle', weight: '15%', desc: 'Transparantie en delegatie van financiën' },
              { name: 'Team Leadership', weight: '10%', desc: 'Zelfstandigheid van teammanagement' },
              { name: 'Externe Stakeholders', weight: '10%', desc: 'Beheer van leveranciers en partners' }
            ].map((area, index) => (
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
            <span>Hoe Het Werkt</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Beantwoord 24 vragen', desc: '4 vragen per categorie, score 1-4 per vraag' },
              { step: 2, title: 'Automatische berekening', desc: 'Gewogen score op basis van businessimpact' },
              { step: 3, title: 'Ontvang uw resultaten', desc: 'Totaalscore + gedetailleerde analyse per gebied' },
              { step: 4, title: 'Krijg verbeteracties', desc: '90-dagen actieplan voor meer autonomie' }
            ].map((item) => (
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
              <h3 className="text-2xl font-semibold">Klaar om te beginnen?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start nu uw assessment en ontdek binnen 5 minuten waar uw bedrijf 
                het meest afhankelijk van u is als founder.
              </p>
              
              <Button 
                onClick={onStart}
                size="lg"
                className="text-lg px-8 py-3 shadow-md hover:shadow-lg transition-smooth"
              >
                Assessment Starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Geen registratie vereist • Resultaten worden niet opgeslagen • Volledig privé
        </p>
      </div>
    </div>
  );
};

export default IntroPage;
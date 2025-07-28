import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // IntroPage
  'intro.title': {
    nl: 'Founder Dependency Assessment',
    en: 'Founder Dependency Assessment'
  },
  'intro.subtitle': {
    nl: 'Ontdek systematisch waar uw bedrijf te afhankelijk van u is als founder en krijg concrete actiestappen voor meer autonomie.',
    en: 'Systematically discover where your business is too dependent on you as founder and get concrete action steps for more autonomy.'
  },
  'intro.badge.questions': {
    nl: '24 Vragen',
    en: '24 Questions'
  },
  'intro.badge.time': {
    nl: '5 Minuten',
    en: '5 Minutes'
  },
  'intro.badge.results': {
    nl: 'Directe Resultaten',
    en: 'Instant Results'
  },
  'intro.benefits.analysis.title': {
    nl: 'Systematische Analyse',
    en: 'Systematic Analysis'
  },
  'intro.benefits.analysis.desc': {
    nl: 'Identificeer precies waar uw bedrijf te afhankelijk van u is met ons wetenschappelijk onderbouwde framework.',
    en: 'Identify exactly where your business is too dependent on you with our scientifically based framework.'
  },
  'intro.benefits.scoring.title': {
    nl: 'Gewogen Scoring',
    en: 'Weighted Scoring'
  },
  'intro.benefits.scoring.desc': {
    nl: 'Krijg een objectieve score gebaseerd op de werkelijke impact van verschillende bedrijfsgebieden op uw autonomie.',
    en: 'Get an objective score based on the real impact of different business areas on your autonomy.'
  },
  'intro.benefits.actions.title': {
    nl: 'Concrete Acties',
    en: 'Concrete Actions'
  },
  'intro.benefits.actions.desc': {
    nl: 'Ontvang direct uitvoerbare verbeteracties en een 90-dagen actieplan om uw afhankelijkheid te verminderen.',
    en: 'Receive immediately actionable improvement actions and a 90-day action plan to reduce your dependency.'
  },
  'intro.areas.title': {
    nl: 'Wat We Meten',
    en: 'What We Measure'
  },
  'intro.areas.subtitle': {
    nl: 'De assessment evalueert 6 kritieke gebieden van founder dependency',
    en: 'The assessment evaluates 6 critical areas of founder dependency'
  },
  'intro.howItWorks.title': {
    nl: 'Hoe Het Werkt',
    en: 'How It Works'
  },
  'intro.step1.title': {
    nl: 'Beantwoord 24 vragen',
    en: 'Answer 24 questions'
  },
  'intro.step1.desc': {
    nl: '4 vragen per categorie, score 1-4 per vraag',
    en: '4 questions per category, score 1-4 per question'
  },
  'intro.step2.title': {
    nl: 'Automatische berekening',
    en: 'Automatic calculation'
  },
  'intro.step2.desc': {
    nl: 'Gewogen score op basis van businessimpact',
    en: 'Weighted score based on business impact'
  },
  'intro.step3.title': {
    nl: 'Ontvang uw resultaten',
    en: 'Receive your results'
  },
  'intro.step3.desc': {
    nl: 'Totaalscore + gedetailleerde analyse per gebied',
    en: 'Total score + detailed analysis per area'
  },
  'intro.step4.title': {
    nl: 'Krijg verbeteracties',
    en: 'Get improvement actions'
  },
  'intro.step4.desc': {
    nl: '90-dagen actieplan voor meer autonomie',
    en: '90-day action plan for more autonomy'
  },
  'intro.cta.title': {
    nl: 'Klaar om te beginnen?',
    en: 'Ready to get started?'
  },
  'intro.cta.desc': {
    nl: 'Start nu uw assessment en ontdek binnen 5 minuten waar uw bedrijf het meest afhankelijk van u is als founder.',
    en: 'Start your assessment now and discover within 5 minutes where your business is most dependent on you as founder.'
  },
  'intro.cta.button': {
    nl: 'Assessment Starten',
    en: 'Start Assessment'
  },
  'intro.privacy': {
    nl: 'Geen registratie vereist • Resultaten worden niet opgeslagen • Volledig privé',
    en: 'No registration required • Results not stored • Completely private'
  },

  // Categories
  'category.strategic': {
    nl: 'Strategische Besluitvorming',
    en: 'Strategic Decision Making'
  },
  'category.operational': {
    nl: 'Operationele Processen',
    en: 'Operational Processes'
  },
  'category.customer': {
    nl: 'Klantrelaties',
    en: 'Customer Relations'
  },
  'category.financial': {
    nl: 'Financiële Controle',
    en: 'Financial Control'
  },
  'category.leadership': {
    nl: 'Team Leadership',
    en: 'Team Leadership'
  },
  'category.external': {
    nl: 'Externe Stakeholders',
    en: 'External Stakeholders'
  },

  // Category descriptions
  'category.strategic.desc': {
    nl: 'Hoe strategische keuzes worden gemaakt',
    en: 'How strategic choices are made'
  },
  'category.operational.desc': {
    nl: 'Documentatie en overdraagbaarheid van processen',
    en: 'Documentation and transferability of processes'
  },
  'category.customer.desc': {
    nl: 'Diversificatie van klantcontacten',
    en: 'Diversification of customer contacts'
  },
  'category.financial.desc': {
    nl: 'Transparantie en delegatie van financiën',
    en: 'Transparency and delegation of finances'
  },
  'category.leadership.desc': {
    nl: 'Zelfstandigheid van teammanagement',
    en: 'Independence of team management'
  },
  'category.external.desc': {
    nl: 'Beheer van leveranciers en partners',
    en: 'Management of suppliers and partners'
  },

  // Assessment Form
  'assessment.title': {
    nl: 'Founder Dependency Assessment',
    en: 'Founder Dependency Assessment'
  },
  'assessment.progress': {
    nl: 'Voortgang',
    en: 'Progress'
  },
  'assessment.weighting': {
    nl: 'Weging',
    en: 'Weighting'
  },
  'assessment.questions': {
    nl: 'vragen',
    en: 'questions'
  },
  'assessment.scoreScale.dependent': {
    nl: '0 = Founder afhankelijk',
    en: '0 = Founder dependent'
  },
  'assessment.scoreScale.autonomous': {
    nl: '4 = Volledig autonoom',
    en: '4 = Fully autonomous'
  },
  'assessment.complete': {
    nl: 'Compleet',
    en: 'Complete'
  },
  'assessment.previous': {
    nl: 'Vorige',
    en: 'Previous'
  },
  'assessment.next': {
    nl: 'Volgende',
    en: 'Next'
  },
  'assessment.viewResults': {
    nl: 'Resultaten bekijken',
    en: 'View Results'
  },

  // Assessment Questions
  'question.s1': {
    nl: 'Worden belangrijke strategische beslissingen alleen door de founder genomen?',
    en: 'Are important strategic decisions made only by the founder?'
  },
  'question.s2': {
    nl: 'Hebben teamleden duidelijke beslissingsbevoegdheden binnen hun rol?',
    en: 'Do team members have clear decision-making authority within their role?'
  },
  'question.s3': {
    nl: 'Bestaat er een gedocumenteerd besluitvormingsproces?',
    en: 'Is there a documented decision-making process?'
  },
  'question.s4': {
    nl: 'Kunnen MT-leden zelfstandig binnen hun domein opereren?',
    en: 'Can management team members operate independently within their domain?'
  },
  'question.o1': {
    nl: 'Zijn kritieke processen gedocumenteerd en overdraagbaar?',
    en: 'Are critical processes documented and transferable?'
  },
  'question.o2': {
    nl: 'Kunnen belangrijke taken door anderen worden uitgevoerd?',
    en: 'Can important tasks be performed by others?'
  },
  'question.o3': {
    nl: 'Bestaan er back-up personen voor essentiële functies?',
    en: 'Are there backup people for essential functions?'
  },
  'question.o4': {
    nl: 'Zijn workflows gestandaardiseerd en niet persoon-afhankelijk?',
    en: 'Are workflows standardized and not person-dependent?'
  },
  'question.c1': {
    nl: 'Hebben klanten directe relaties met andere teamleden?',
    en: 'Do customers have direct relationships with other team members?'
  },
  'question.c2': {
    nl: 'Kan het bedrijf nieuwe klanten binnenhalen zonder directe betrokkenheid van de founder?',
    en: 'Can the company attract new customers without direct involvement of the founder?'
  },
  'question.c3': {
    nl: 'Zijn klantprocessen (van lead tot levering) overdraagbaar?',
    en: 'Are customer processes (from lead to delivery) transferable?'
  },
  'question.c4': {
    nl: 'Bestaat er een CRM-systeem dat klantkennis vastlegt?',
    en: 'Is there a CRM system that captures customer knowledge?'
  },
  'question.f1': {
    nl: 'Kunnen anderen financiële rapportages interpreteren en erop handelen?',
    en: 'Can others interpret financial reports and act on them?'
  },
  'question.f2': {
    nl: 'Zijn budgetbeslissingen gedelegeerd binnen duidelijke kaders?',
    en: 'Are budget decisions delegated within clear frameworks?'
  },
  'question.f3': {
    nl: 'Bestaat er transparantie in financiële prestaties voor het MT?',
    en: 'Is there transparency in financial performance for the management team?'
  },
  'question.f4': {
    nl: 'Zijn er geautomatiseerde financiële processen en controles?',
    en: 'Are there automated financial processes and controls?'
  },
  'question.l1': {
    nl: 'Kunnen teamleiders zelfstandig hun teams managen?',
    en: 'Can team leaders independently manage their teams?'
  },
  'question.l2': {
    nl: 'Zijn er duidelijke KPI\'s en feedback-systemen zonder tussenkomst van de founder?',
    en: 'Are there clear KPIs and feedback systems without founder intervention?'
  },
  'question.l3': {
    nl: 'Kunnen conflicten en problemen zonder de founder worden opgelost?',
    en: 'Can conflicts and problems be resolved without the founder?'
  },
  'question.l4': {
    nl: 'Hebben teamleden directe rapportagelijnen naar andere managers?',
    en: 'Do team members have direct reporting lines to other managers?'
  },
  'question.e1': {
    nl: 'Hebben leveranciers en partners contacten buiten de founder om?',
    en: 'Do suppliers and partners have contacts outside the founder?'
  },
  'question.e2': {
    nl: 'Kunnen anderen namens het bedrijf onderhandelen?',
    en: 'Can others negotiate on behalf of the company?'
  },
  'question.e3': {
    nl: 'Zijn externe relaties gediversifieerd over het team?',
    en: 'Are external relationships diversified across the team?'
  },
  'question.e4': {
    nl: 'Bestaan er gedocumenteerde procedures voor stakeholder management?',
    en: 'Are there documented procedures for stakeholder management?'
  },

  // Contact Form
  'contact.title': {
    nl: 'Bijna klaar!',
    en: 'Almost done!'
  },
  'contact.subtitle': {
    nl: 'Laat je gegevens achter om je persoonlijke Founder Dependency rapport te ontvangen',
    en: 'Leave your details to receive your personal Founder Dependency report'
  },
  'contact.firstName': {
    nl: 'Voornaam',
    en: 'First Name'
  },
  'contact.lastName': {
    nl: 'Achternaam',
    en: 'Last Name'
  },
  'contact.companyName': {
    nl: 'Bedrijfsnaam',
    en: 'Company Name'
  },
  'contact.email': {
    nl: 'Emailadres',
    en: 'Email Address'
  },
  'contact.firstName.placeholder': {
    nl: 'Je voornaam',
    en: 'Your first name'
  },
  'contact.lastName.placeholder': {
    nl: 'Je achternaam',
    en: 'Your last name'
  },
  'contact.companyName.placeholder': {
    nl: 'Naam van je bedrijf',
    en: 'Your company name'
  },
  'contact.email.placeholder': {
    nl: 'je@email.com',
    en: 'you@email.com'
  },
  'contact.note': {
    nl: 'Je rapport wordt verstuurd naar **info@scaleupsucces.nl** en je ontvangt een kopie op het opgegeven emailadres.',
    en: 'Your report will be sent to **info@scaleupsucces.nl** and you will receive a copy at the provided email address.'
  },
  'contact.submit': {
    nl: 'Verstuur mijn rapport',
    en: 'Send my report'
  },
  'contact.submitting': {
    nl: 'Bezig met verzenden...',
    en: 'Sending...'
  },

  // Contact Form Validation
  'validation.required': {
    nl: 'Vul alle velden in om door te gaan.',
    en: 'Fill in all fields to continue.'
  },
  'validation.firstName': {
    nl: 'Voornaam moet tussen 2 en 50 karakters zijn.',
    en: 'First name must be between 2 and 50 characters.'
  },
  'validation.lastName': {
    nl: 'Achternaam moet tussen 2 en 50 karakters zijn.',
    en: 'Last name must be between 2 and 50 characters.'
  },
  'validation.companyName': {
    nl: 'Bedrijfsnaam moet tussen 2 en 100 karakters zijn.',
    en: 'Company name must be between 2 and 100 characters.'
  },
  'validation.email': {
    nl: 'Voer een geldig emailadres in.',
    en: 'Enter a valid email address.'
  },
  'validation.fieldsTitle': {
    nl: 'Velden ontbreken',
    en: 'Missing fields'
  },
  'validation.firstNameTitle': {
    nl: 'Ongeldige voornaam',
    en: 'Invalid first name'
  },
  'validation.lastNameTitle': {
    nl: 'Ongeldige achternaam',
    en: 'Invalid last name'
  },
  'validation.companyNameTitle': {
    nl: 'Ongeldige bedrijfsnaam',
    en: 'Invalid company name'
  },
  'validation.emailTitle': {
    nl: 'Ongeldig emailadres',
    en: 'Invalid email address'
  },

  // Results Page
  'results.title': {
    nl: 'Assessment Resultaten',
    en: 'Assessment Results'
  },
  'results.scoreTitle': {
    nl: 'Uw Founder Dependency Score',
    en: 'Your Founder Dependency Score'
  },
  'results.level.excellent': {
    nl: 'Excellent',
    en: 'Excellent'
  },
  'results.level.good': {
    nl: 'Goed',
    en: 'Good'
  },
  'results.level.moderate': {
    nl: 'Matig',
    en: 'Moderate'
  },
  'results.level.weak': {
    nl: 'Zwak',
    en: 'Weak'
  },
  'results.level.critical': {
    nl: 'Kritiek',
    en: 'Critical'
  },
  'results.level.excellent.desc': {
    nl: 'Bedrijf is grotendeels autonoom',
    en: 'Business is largely autonomous'
  },
  'results.level.good.desc': {
    nl: 'Enkele verbeterpunten',
    en: 'Some areas for improvement'
  },
  'results.level.moderate.desc': {
    nl: 'Actie vereist',
    en: 'Action required'
  },
  'results.level.weak.desc': {
    nl: 'Hoge afhankelijkheid',
    en: 'High dependency'
  },
  'results.level.critical.desc': {
    nl: 'Bedrijf kan niet functioneren zonder founder',
    en: 'Business cannot function without founder'
  },
  'results.actionPlan.title': {
    nl: '90-Dagen Actieplan',
    en: '90-Day Action Plan'
  },
  'results.actionPlan.subtitle': {
    nl: 'Focus op de laagst scorende categorieën voor maximale impact',
    en: 'Focus on the lowest scoring categories for maximum impact'
  },
  'results.advice.title': {
    nl: 'Verbeteradvies',
    en: 'Improvement Advice'
  },
  'results.newAssessment': {
    nl: 'Nieuwe Assessment',
    en: 'New Assessment'
  },
  'results.print': {
    nl: 'Resultaten Printen',
    en: 'Print Results'
  },
  'results.disclaimer': {
    nl: 'Deze assessment is bedoeld als indicatie. Voor een grondige analyse van uw bedrijf raden wij professionele begeleiding aan door een ervaren business consultant.',
    en: 'This assessment is intended as an indication. For a thorough analysis of your business, we recommend professional guidance from an experienced business consultant.'
  },

  // Advice texts
  'advice.strategic': {
    nl: 'Investeer in het delegeren van strategische beslissingsbevoegdheden en het documenteren van besluitvormingsprocessen.',
    en: 'Invest in delegating strategic decision-making authority and documenting decision-making processes.'
  },
  'advice.operational': {
    nl: 'Documenteer kritieke processen en train back-up personen voor essentiële functies.',
    en: 'Document critical processes and train backup people for essential functions.'
  },
  'advice.customer': {
    nl: 'Ontwikkel directe klantrelaties voor teamleden en implementeer een robuust CRM-systeem.',
    en: 'Develop direct customer relationships for team members and implement a robust CRM system.'
  },
  'advice.financial': {
    nl: 'Creëer transparantie in financiële rapportages en delegeer budgetbeslissingen binnen duidelijke kaders.',
    en: 'Create transparency in financial reporting and delegate budget decisions within clear frameworks.'
  },
  'advice.leadership': {
    nl: 'Versterk teamleiderschap door KPI-systemen en conflictoplossingsprocessen te implementeren.',
    en: 'Strengthen team leadership by implementing KPI systems and conflict resolution processes.'
  },
  'advice.external': {
    nl: 'Diversifieer externe stakeholderrelaties en documenteer procedures voor stakeholder management.',
    en: 'Diversify external stakeholder relationships and document procedures for stakeholder management.'
  },

  // Toast messages
  'toast.emailSuccess': {
    nl: 'Je rapport is verstuurd naar info@scaleupsucces.nl',
    en: 'Your report has been sent to info@scaleupsucces.nl'
  },
  'toast.emailSuccessTitle': {
    nl: 'Rapport verzonden!',
    en: 'Report sent!'
  },
  'toast.emailError': {
    nl: 'Het rapport kon niet worden verstuurd, maar je resultaten worden wel getoond.',
    en: 'The report could not be sent, but your results will still be shown.'
  },
  'toast.emailErrorTitle': {
    nl: 'Email fout',
    en: 'Email error'
  },
  'toast.technicalError': {
    nl: 'Er is een technisch probleem opgetreden. Probeer het later opnieuw.',
    en: 'A technical problem has occurred. Please try again later.'
  },
  'toast.technicalErrorTitle': {
    nl: 'Technische fout',
    en: 'Technical error'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'nl' || stored === 'en')) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
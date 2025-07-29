import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': 'default-src \'self\'; script-src \'none\'; object-src \'none\';'
};

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

interface AssessmentResults {
  contactInfo: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
  };
  scores: Record<string, number[]>;
  totalScore: number;
  overallLevel: string;
  language?: 'nl' | 'en';
}

// Input sanitization and validation
const sanitizeString = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, maxLength);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isRateLimited = (clientIP: string): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
};

// Email translations
const translations = {
  nl: {
    emailTitle: 'Founder Dependency Assessment Resultaten',
    contactDetails: 'Contactgegevens',
    name: 'Naam',
    company: 'Bedrijf',
    email: 'Email',
    overallScore: 'Overall Score',
    detailedScores: 'Gedetailleerde Scores per Categorie',
    score: 'Score',
    improvementAdvice: '💡 Verbeteradvies',
    actionPlan: '🎯 90-Dagen Actieplan',
    actionPlanDescription: 'Focus op de laagst scorende categorieën voor maximale impact:',
    scoreExplanation: 'Score betekenis:',
    scoreRange: '0 = Founder afhankelijk | 1 = Deels afhankelijk | 2 = Gemiddeld | 3 = Grotendeels onafhankelijk | 4 = Volledig onafhankelijk',
    ctaTitle: 'Wil je de vervolgstappen rondom de uitkomsten vrijblijvend bespreken?',
    ctaButton: 'Plan een vrijblijvend strategiegesprek in',
    disclaimer: 'Deze assessment is bedoeld als indicatie. Voor een grondige analyse van uw bedrijf raden wij professionele begeleiding aan door een ervaren business consultant.',
    emailSubject: 'Nieuwe Assessment: {{company}} - Score: {{score}}',
    rateLimitError: 'Te veel verzoeken. Probeer het later opnieuw.',
    invalidDataError: 'Ongeldige gegevens ontvangen',
    requiredFieldsError: 'Alle velden zijn verplicht',
    invalidEmailError: 'Ongeldig emailadres',
    generalError: 'Er is een fout opgetreden bij het verzenden van de email',
    categories: {
      strategic: {
        name: 'Strategische Besluitvorming',
        questions: [
          'Worden belangrijke strategische beslissingen alleen door de founder genomen?',
          'Hebben teamleden duidelijke beslissingsbevoegdheden binnen hun rol?',
          'Bestaat er een gedocumenteerd besluitvormingsproces?',
          'Kunnen MT-leden zelfstandig binnen hun domein opereren?'
        ],
        advice: 'Investeer in het delegeren van strategische beslissingsbevoegdheden en het documenteren van besluitvormingsprocessen.'
      },
      operational: {
        name: 'Operationele Processen',
        questions: [
          'Zijn kritieke processen gedocumenteerd en overdraagbaar?',
          'Kunnen belangrijke taken door anderen worden uitgevoerd?',
          'Bestaan er back-up personen voor essentiële functies?',
          'Zijn workflows gestandaardiseerd en niet persoon-afhankelijk?'
        ],
        advice: 'Documenteer kritieke processen en train back-up personen voor essentiële functies.'
      },
      customer: {
        name: 'Klantrelaties',
        questions: [
          'Hebben klanten directe relaties met andere teamleden?',
          'Kan het bedrijf nieuwe klanten binnenhalen zonder directe betrokkenheid van de founder?',
          'Zijn klantprocessen (van lead tot levering) overdraagbaar?',
          'Bestaat er een CRM-systeem dat klantkennis vastlegt?'
        ],
        advice: 'Ontwikkel directe klantrelaties voor teamleden en implementeer een robuust CRM-systeem.'
      },
      financial: {
        name: 'Financiële Controle',
        questions: [
          'Kunnen anderen financiële rapportages interpreteren en erop handelen?',
          'Zijn budgetbeslissingen gedelegeerd binnen duidelijke kaders?',
          'Bestaat er transparantie in financiële prestaties voor het MT?',
          'Zijn er geautomatiseerde financiële processen en controles?'
        ],
        advice: 'Creëer transparantie in financiële rapportages en delegeer budgetbeslissingen binnen duidelijke kaders.'
      },
      leadership: {
        name: 'Team Leadership',
        questions: [
          'Kunnen teamleiders zelfstandig hun teams managen?',
          'Zijn er duidelijke KPI\'s en feedback-systemen zonder tussenkomst van de founder?',
          'Kunnen conflicten en problemen zonder de founder worden opgelost?',
          'Hebben teamleden directe rapportagelijnen naar andere managers?'
        ],
        advice: 'Versterk teamleiderschap door KPI-systemen en conflictoplossingsprocessen te implementeren.'
      },
      external: {
        name: 'Externe Stakeholders',
        questions: [
          'Hebben leveranciers en partners contacten buiten de founder om?',
          'Kunnen anderen namens het bedrijf onderhandelen?',
          'Zijn externe relaties gediversifieerd over het team?',
          'Bestaan er gedocumenteerde procedures voor stakeholder management?'
        ],
        advice: 'Diversifieer externe stakeholderrelaties en documenteer procedures voor stakeholder management.'
      }
    }
  },
  en: {
    emailTitle: 'Founder Dependency Assessment Results',
    contactDetails: 'Contact Details',
    name: 'Name',
    company: 'Company',
    email: 'Email',
    overallScore: 'Overall Score',
    detailedScores: 'Detailed Scores by Category',
    score: 'Score',
    improvementAdvice: '💡 Improvement Advice',
    actionPlan: '🎯 90-Day Action Plan',
    actionPlanDescription: 'Focus on the lowest scoring categories for maximum impact:',
    scoreExplanation: 'Score meaning:',
    scoreRange: '0 = Founder dependent | 1 = Partially dependent | 2 = Average | 3 = Largely independent | 4 = Fully independent',
    ctaTitle: 'Would you like to discuss the next steps regarding the results without obligation?',
    ctaButton: 'Schedule a strategy consultation',
    disclaimer: 'This assessment is intended as an indication. For a thorough analysis of your business, we recommend professional guidance from an experienced business consultant.',
    emailSubject: 'New Assessment: {{company}} - Score: {{score}}',
    rateLimitError: 'Too many requests. Please try again later.',
    invalidDataError: 'Invalid data received',
    requiredFieldsError: 'All fields are required',
    invalidEmailError: 'Invalid email address',
    generalError: 'An error occurred while sending the email',
    categories: {
      strategic: {
        name: 'Strategic Decision Making',
        questions: [
          'Are important strategic decisions made only by the founder?',
          'Do team members have clear decision-making authority within their role?',
          'Is there a documented decision-making process?',
          'Can management team members operate independently within their domain?'
        ],
        advice: 'Invest in delegating strategic decision-making authority and documenting decision-making processes.'
      },
      operational: {
        name: 'Operational Processes',
        questions: [
          'Are critical processes documented and transferable?',
          'Can important tasks be performed by others?',
          'Are there backup people for essential functions?',
          'Are workflows standardized and not person-dependent?'
        ],
        advice: 'Document critical processes and train backup personnel for essential functions.'
      },
      customer: {
        name: 'Customer Relations',
        questions: [
          'Do customers have direct relationships with other team members?',
          'Can the company acquire new customers without direct founder involvement?',
          'Are customer processes (from lead to delivery) transferable?',
          'Is there a CRM system that captures customer knowledge?'
        ],
        advice: 'Develop direct customer relationships for team members and implement a robust CRM system.'
      },
      financial: {
        name: 'Financial Control',
        questions: [
          'Can others interpret and act on financial reports?',
          'Are budget decisions delegated within clear frameworks?',
          'Is there transparency in financial performance for the management team?',
          'Are there automated financial processes and controls?'
        ],
        advice: 'Create transparency in financial reporting and delegate budget decisions within clear frameworks.'
      },
      leadership: {
        name: 'Team Leadership',
        questions: [
          'Can team leaders independently manage their teams?',
          'Are there clear KPIs and feedback systems without founder intervention?',
          'Can conflicts and problems be resolved without the founder?',
          'Do team members have direct reporting lines to other managers?'
        ],
        advice: 'Strengthen team leadership by implementing KPI systems and conflict resolution processes.'
      },
      external: {
        name: 'External Stakeholders',
        questions: [
          'Do suppliers and partners have contacts outside the founder?',
          'Can others negotiate on behalf of the company?',
          'Are external relationships diversified across the team?',
          'Are there documented procedures for stakeholder management?'
        ],
        advice: 'Diversify external stakeholder relationships and document stakeholder management procedures.'
      }
    }
  }
};

const categories = [
  { id: 'strategic', weight: 25 },
  { id: 'operational', weight: 20 },
  { id: 'customer', weight: 20 },
  { id: 'financial', weight: 15 },
  { id: 'leadership', weight: 10 },
  { id: 'external', weight: 10 }
];

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  try {
    const requestData = await req.json();
    
    // Detect language from request data
    const language = requestData.language || 'nl';
    const t = translations[language as keyof typeof translations];
    
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: t.rateLimitError }),
        { 
          status: 429, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    // Input validation and sanitization
    if (!requestData.contactInfo || !requestData.scores) {
      throw new Error(t.invalidDataError);
    }

    const contactInfo = {
      firstName: sanitizeString(requestData.contactInfo.firstName, 50),
      lastName: sanitizeString(requestData.contactInfo.lastName, 50),
      companyName: sanitizeString(requestData.contactInfo.companyName, 100),
      email: sanitizeString(requestData.contactInfo.email, 254)
    };

    // Validate required fields
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.companyName || !contactInfo.email) {
      throw new Error(t.requiredFieldsError);
    }

    // Validate email format
    if (!validateEmail(contactInfo.email)) {
      throw new Error(t.invalidEmailError);
    }

    const { scores, totalScore, overallLevel } = requestData;

    // Helper function to get advice for each category
    const getAdvice = (categoryId: string) => {
      return t.categories[categoryId as keyof typeof t.categories]?.advice || 'Focus on improving this category.';
    };

    // Calculate category results for advice
    const categoryResults = categories.map(category => {
      const categoryScores = scores[category.id] || [];
      const sum = categoryScores.reduce((acc, score) => acc + score, 0);
      const average = sum / 4;
      return {
        ...category,
        raw: sum,
        average,
        needsImprovement: average < 3
      };
    });

    const lowScoreCategories = categoryResults.filter(cat => cat.needsImprovement);

    // Create detailed email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://ujlvvjqvvprjwajagknl.supabase.co/storage/v1/object/public/images/scaleup-succes-logo.png" alt="ScaleUp Succes Logo" style="max-height: 80px; margin-bottom: 20px;">
          <h1 style="color: #333;">${t.emailTitle}</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">${t.contactDetails}</h2>
          <p><strong>${t.name}:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
          <p><strong>${t.company}:</strong> ${contactInfo.companyName}</p>
          <p><strong>${t.email}:</strong> ${contactInfo.email}</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: #1565c0; margin-top: 0;">${t.overallScore}</h2>
          <div style="font-size: 48px; font-weight: bold; color: #1565c0;">${totalScore}</div>
          <div style="font-size: 18px; color: #1565c0; margin-top: 10px;">${overallLevel}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333;">${t.detailedScores}</h2>
          
          ${categories.map(category => {
            const categoryScores = scores[category.id] || [];
            const categoryResult = categoryResults.find(c => c.id === category.id);
            const categoryTranslation = t.categories[category.id as keyof typeof t.categories];
            return `
              <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="color: #555; margin-top: 0;">${categoryTranslation?.name || category.id} (${category.weight}%)</h3>
                ${categoryTranslation?.questions.map((question, index) => {
                  const score = categoryScores[index] || 0;
                  return `
                    <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 4px;">
                      <p style="margin: 0 0 5px 0; font-weight: 500;">${question}</p>
                      <p style="margin: 0; color: #666;"><strong>${t.score}: ${score}</strong></p>
                    </div>
                  `;
                }).join('')}
                
                ${categoryResult?.needsImprovement ? `
                  <div style="background: #fff3e0; padding: 12px; border-radius: 6px; border-left: 4px solid #ff9800; margin-top: 10px;">
                    <h4 style="color: #e65100; margin: 0 0 8px 0; font-size: 14px;">${t.improvementAdvice}</h4>
                    <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">
                      ${getAdvice(category.id)}
                    </p>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        ${lowScoreCategories.length > 0 ? `
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <h2 style="color: #2e7d32; margin-top: 0;">${t.actionPlan}</h2>
            <p style="color: #666; margin-bottom: 15px;">${t.actionPlanDescription}</p>
            
            ${lowScoreCategories
              .sort((a, b) => a.average - b.average)
              .slice(0, 3)
              .map((category, index) => {
                const categoryTranslation = t.categories[category.id as keyof typeof t.categories];
                return `
                  <div style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px;">
                    <div style="display: flex; align-items: flex-start;">
                      <div style="background: #4caf50; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 12px; flex-shrink: 0;">
                        ${index + 1}
                      </div>
                      <div>
                        <h4 style="margin: 0 0 6px 0; color: #333; font-size: 14px;">${categoryTranslation?.name || category.id}</h4>
                        <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">
                          ${getAdvice(category.id)}
                        </p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
          </div>
        ` : ''}

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 30px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>${t.scoreExplanation}</strong><br>
            ${t.scoreRange}
          </p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">${t.ctaTitle}</h3>
          <a href="https://scaleupsucces.nl/contact/" style="display: inline-block; background: #1565c0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            ${t.ctaButton}
          </a>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px; padding: 20px 0;">
          <p style="margin: 0;">${t.disclaimer}</p>
        </div>
      </div>
    `;

    const emailSubject = t.emailSubject
      .replace('{{company}}', contactInfo.companyName)
      .replace('{{score}}', totalScore.toString());

    const emailResponse = await resend.emails.send({
      from: "Assessment <amber@scaleupsucces.nl>",
      to: ["info@scaleupsucces.nl", contactInfo.email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Assessment email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-results function", error);
    
    // Enhanced error handling without exposing sensitive information
    const language = 'nl'; // fallback to dutch for error messages
    const t = translations[language];
    let errorMessage = t.generalError;
    let statusCode = 500;
    
    if (error.message.includes(t.requiredFieldsError) || 
        error.message.includes(t.invalidEmailError) ||
        error.message.includes(t.invalidDataError)) {
      errorMessage = error.message;
      statusCode = 400;
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
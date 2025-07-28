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

const categories = [
  {
    id: 'strategic',
    name: 'Strategische Besluitvorming',
    weight: 25,
    questions: [
      'Worden belangrijke strategische beslissingen alleen door de founder genomen?',
      'Hebben teamleden duidelijke beslissingsbevoegdheden binnen hun rol?',
      'Bestaat er een gedocumenteerd besluitvormingsproces?',
      'Kunnen MT-leden zelfstandig binnen hun domein opereren?'
    ]
  },
  {
    id: 'operational',
    name: 'Operationele Processen',
    weight: 20,
    questions: [
      'Zijn kritieke processen gedocumenteerd en overdraagbaar?',
      'Kunnen belangrijke taken door anderen worden uitgevoerd?',
      'Bestaan er back-up personen voor essentiële functies?',
      'Zijn workflows gestandaardiseerd en niet persoon-afhankelijk?'
    ]
  },
  {
    id: 'customer',
    name: 'Klantrelaties',
    weight: 20,
    questions: [
      'Hebben klanten directe relaties met andere teamleden?',
      'Kan het bedrijf nieuwe klanten binnenhalen zonder directe betrokkenheid van de founder?',
      'Zijn klantprocessen (van lead tot levering) overdraagbaar?',
      'Bestaat er een CRM-systeem dat klantkennis vastlegt?'
    ]
  },
  {
    id: 'financial',
    name: 'Financiële Controle',
    weight: 15,
    questions: [
      'Kunnen anderen financiële rapportages interpreteren en erop handelen?',
      'Zijn budgetbeslissingen gedelegeerd binnen duidelijke kaders?',
      'Bestaat er transparantie in financiële prestaties voor het MT?',
      'Zijn er geautomatiseerde financiële processen en controles?'
    ]
  },
  {
    id: 'leadership',
    name: 'Team Leadership',
    weight: 10,
    questions: [
      'Kunnen teamleiders zelfstandig hun teams managen?',
      'Zijn er duidelijke KPI\'s en feedback-systemen zonder tussenkomst van de founder?',
      'Kunnen conflicten en problemen zonder de founder worden opgelost?',
      'Hebben teamleden directe rapportagelijnen naar andere managers?'
    ]
  },
  {
    id: 'external',
    name: 'Externe Stakeholders',
    weight: 10,
    questions: [
      'Hebben leveranciers en partners contacten buiten de founder om?',
      'Kunnen anderen namens het bedrijf onderhandelen?',
      'Zijn externe relaties gediversifieerd over het team?',
      'Bestaan er gedocumenteerde procedures voor stakeholder management?'
    ]
  }
];

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (isRateLimited(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }),
      { 
        status: 429, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  try {
    const requestData = await req.json();
    
    // Input validation and sanitization
    if (!requestData.contactInfo || !requestData.scores) {
      throw new Error('Ongeldige gegevens ontvangen');
    }

    const contactInfo = {
      firstName: sanitizeString(requestData.contactInfo.firstName, 50),
      lastName: sanitizeString(requestData.contactInfo.lastName, 50),
      companyName: sanitizeString(requestData.contactInfo.companyName, 100),
      email: sanitizeString(requestData.contactInfo.email, 254)
    };

    // Validate required fields
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.companyName || !contactInfo.email) {
      throw new Error('Alle velden zijn verplicht');
    }

    // Validate email format
    if (!validateEmail(contactInfo.email)) {
      throw new Error('Ongeldig emailadres');
    }

    const { scores, totalScore, overallLevel } = requestData;

    // Helper function to get advice for each category
    const getAdvice = (categoryId: string) => {
      const adviceMap: Record<string, string> = {
        'strategic': 'Investeer in het delegeren van strategische beslissingsbevoegdheden en het documenteren van besluitvormingsprocessen.',
        'operational': 'Documenteer kritieke processen en train back-up personen voor essentiële functies.',
        'customer': 'Ontwikkel directe klantrelaties voor teamleden en implementeer een robuust CRM-systeem.',
        'financial': 'Creëer transparantie in financiële rapportages en delegeer budgetbeslissingen binnen duidelijke kaders.',
        'leadership': 'Versterk teamleiderschap door KPI-systemen en conflictoplossingsprocessen te implementeren.',
        'external': 'Diversifieer externe stakeholderrelaties en documenteer procedures voor stakeholder management.'
      };
      return adviceMap[categoryId] || 'Focus op het verbeteren van deze categorie.';
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
          <h1 style="color: #333;">Founder Dependency Assessment Resultaten</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Contactgegevens</h2>
          <p><strong>Naam:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
          <p><strong>Bedrijf:</strong> ${contactInfo.companyName}</p>
          <p><strong>Email:</strong> ${contactInfo.email}</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: #1565c0; margin-top: 0;">Overall Score</h2>
          <div style="font-size: 48px; font-weight: bold; color: #1565c0;">${totalScore}</div>
          <div style="font-size: 18px; color: #1565c0; margin-top: 10px;">${overallLevel}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333;">Gedetailleerde Scores per Categorie</h2>
          
          ${categories.map(category => {
            const categoryScores = scores[category.id] || [];
            const categoryResult = categoryResults.find(c => c.id === category.id);
            return `
              <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="color: #555; margin-top: 0;">${category.name} (${category.weight}%)</h3>
                ${category.questions.map((question, index) => {
                  const score = categoryScores[index] || 0;
                  return `
                    <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 4px;">
                      <p style="margin: 0 0 5px 0; font-weight: 500;">${question}</p>
                      <p style="margin: 0; color: #666;"><strong>Score: ${score}</strong></p>
                    </div>
                  `;
                }).join('')}
                
                ${categoryResult?.needsImprovement ? `
                  <div style="background: #fff3e0; padding: 12px; border-radius: 6px; border-left: 4px solid #ff9800; margin-top: 10px;">
                    <h4 style="color: #e65100; margin: 0 0 8px 0; font-size: 14px;">💡 Verbeteradvies</h4>
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
            <h2 style="color: #2e7d32; margin-top: 0;">🎯 90-Dagen Actieplan</h2>
            <p style="color: #666; margin-bottom: 15px;">Focus op de laagst scorende categorieën voor maximale impact:</p>
            
            ${lowScoreCategories
              .sort((a, b) => a.average - b.average)
              .slice(0, 3)
              .map((category, index) => `
                <div style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px;">
                  <div style="display: flex; align-items: flex-start;">
                    <div style="background: #4caf50; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 12px; flex-shrink: 0;">
                      ${index + 1}
                    </div>
                    <div>
                      <h4 style="margin: 0 0 6px 0; color: #333; font-size: 14px;">${category.name}</h4>
                      <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">
                        ${getAdvice(category)}
                      </p>
                    </div>
                  </div>
                </div>
              `).join('')}
          </div>
        ` : ''}

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 30px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Score betekenis:</strong><br>
            0 = Founder afhankelijk | 1 = Deels afhankelijk | 2 = Gemiddeld | 3 = Grotendeels onafhankelijk | 4 = Volledig onafhankelijk
          </p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Wil je de vervolgstappen rondom de uitkomsten vrijblijvend bespreken?</h3>
          <a href="https://scaleupsucces.nl/contact/" style="display: inline-block; background: #1565c0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Plan een vrijblijvend strategiegesprek in
          </a>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px; padding: 20px 0;">
          <p style="margin: 0;">Deze assessment is bedoeld als indicatie. Voor een grondige analyse van uw bedrijf raden wij professionele begeleiding aan door een ervaren business consultant.</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Assessment <amber@scaleupsucces.nl>",
      to: ["info@scaleupsucces.nl", contactInfo.email],
      subject: `Nieuwe Assessment: ${contactInfo.companyName} - Score: ${totalScore}`,
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
    console.error("Error in send-assessment-results function");
    
    // Enhanced error handling without exposing sensitive information
    let errorMessage = 'Er is een fout opgetreden bij het verzenden van de email';
    let statusCode = 500;
    
    if (error.message.includes('Alle velden zijn verplicht') || 
        error.message.includes('Ongeldig emailadres') ||
        error.message.includes('Ongeldige gegevens ontvangen')) {
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
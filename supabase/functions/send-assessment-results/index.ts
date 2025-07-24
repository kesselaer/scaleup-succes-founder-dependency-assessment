import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactInfo, scores, totalScore, overallLevel }: AssessmentResults = await req.json();

    // Create detailed email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
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
          
          <div style="margin-bottom: 15px;">
            <h3 style="color: #555;">Strategische Besluitvorming (25%)</h3>
            <p>Scores: ${scores.strategic?.join(', ') || 'N/A'}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="color: #555;">Operationele Processen (20%)</h3>
            <p>Scores: ${scores.operational?.join(', ') || 'N/A'}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="color: #555;">Klantrelaties (20%)</h3>
            <p>Scores: ${scores.customer?.join(', ') || 'N/A'}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="color: #555;">Financiële Controle (15%)</h3>
            <p>Scores: ${scores.financial?.join(', ') || 'N/A'}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="color: #555;">Team Leadership (10%)</h3>
            <p>Scores: ${scores.leadership?.join(', ') || 'N/A'}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h3 style="color: #555;">Externe Stakeholders (10%)</h3>
            <p>Scores: ${scores.external?.join(', ') || 'N/A'}</p>
          </div>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Score betekenis:</strong><br>
            1 = Founder afhankelijk | 2 = Deels afhankelijk | 3 = Grotendeels onafhankelijk | 4 = Volledig onafhankelijk
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Assessment <amber@scaleupsucces.nl>",
      to: ["info@scaleupsucces.nl", contactInfo.email],
      subject: `Nieuwe Assessment: ${contactInfo.companyName} - Score: ${totalScore}`,
      html: emailHtml,
    });

    console.log("Assessment email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-results function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
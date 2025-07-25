import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = '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';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, age, gender, duration } = await req.json();

    if (!symptoms) {
      return new Response(
        JSON.stringify({ error: 'Symptoms are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Enhanced medical analysis prompt for better accuracy
    const prompt = `You are an advanced medical AI diagnostic assistant with expertise in differential diagnosis. Analyze the following patient presentation and provide a comprehensive medical assessment.

PATIENT INFORMATION:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}  
- Symptom Duration: ${duration || 'Not specified'}
- Presenting Symptoms: ${symptoms}

DIAGNOSTIC REQUIREMENTS:
1. Perform systematic differential diagnosis considering:
   - Most likely diagnoses (common conditions)
   - Serious conditions that must be ruled out
   - Age and gender-specific considerations
   - Symptom pattern analysis (acute vs chronic, associated symptoms)

2. Consider these diagnostic categories:
   - Infectious diseases
   - Cardiovascular conditions
   - Respiratory disorders
   - Gastrointestinal conditions
   - Neurological disorders
   - Endocrine/metabolic conditions
   - Musculoskeletal disorders
   - Psychiatric/psychological conditions
   - Dermatological conditions
   - Hematological disorders

3. Provide evidence-based probability assessments based on:
   - Epidemiological data for age/gender
   - Symptom specificity and sensitivity
   - Clinical presentation patterns

RESPONSE FORMAT:
Return a JSON array with 4-6 most likely diagnoses, ordered by probability:

[
  {
    "condition": "Specific Disease Name (ICD-10 compatible)",
    "probability": "High (85-95%)" | "Moderate-High (70-84%)" | "Moderate (50-69%)" | "Low-Moderate (30-49%)" | "Low (15-29%)",
    "description": "Detailed pathophysiology, typical presentation, and clinical course",
    "recommendations": [
      "Immediate actions if urgent",
      "Specific diagnostic tests needed",
      "Treatment considerations",
      "When to seek emergency care",
      "Follow-up recommendations"
    ]
  }
]

CRITICAL INSTRUCTIONS:
- Use specific, recognized disease names (not symptom descriptions)
- Base probabilities on clinical evidence and epidemiology
- Include both common and serious conditions
- Provide actionable medical recommendations
- Consider red flags and emergency situations
- Always recommend professional medical evaluation
- Focus on differential diagnosis, not just symptom matching

Analyze the patient presentation now:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: `You are a medical diagnostic AI with advanced training in differential diagnosis, clinical reasoning, and evidence-based medicine. You have access to comprehensive medical knowledge including:

- Disease epidemiology and prevalence data
- Clinical presentation patterns
- Diagnostic criteria and guidelines
- Age and gender-specific considerations
- Red flag symptoms requiring immediate attention

Your responses must be:
- Clinically accurate and evidence-based
- Formatted as valid JSON only
- Focused on specific diagnoses, not general categories
- Include appropriate urgency levels
- Always recommend professional medical evaluation

Remember: This is for educational/informational purposes. Always emphasize the need for professional medical assessment.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 3000,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Clean up the response - remove markdown code blocks if present
    if (aiResponse.includes('```json')) {
      aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    }
    if (aiResponse.includes('```')) {
      aiResponse = aiResponse.replace(/```/g, '');
    }
    
    // Remove any leading/trailing whitespace and newlines
    aiResponse = aiResponse.trim();

    // Try to parse the AI response as JSON
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
      
      // Validate the structure
      if (!Array.isArray(analysis)) {
        throw new Error('Response is not an array');
      }
      
      // Ensure each item has required fields and proper structure
      analysis = analysis.map((item, index) => {
        if (!item.condition || !item.probability || !item.description) {
          throw new Error(`Invalid structure in diagnosis ${index + 1}`);
        }
        
        return {
          condition: item.condition.trim(),
          probability: item.probability.trim(),
          description: item.description.trim(),
          recommendations: Array.isArray(item.recommendations) 
            ? item.recommendations.map(rec => rec.trim())
            : ['Consult a healthcare professional for proper evaluation']
        };
      });

      // Limit to maximum 6 diagnoses for better UX
      if (analysis.length > 6) {
        analysis = analysis.slice(0, 6);
      }
      
    } catch (parseError) {
      // Enhanced fallback response with more specific guidance
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      analysis = [
        {
          condition: "Complex Symptom Pattern - Professional Evaluation Required",
          probability: "Immediate medical consultation recommended",
          description: "Your symptom combination requires professional medical evaluation for accurate diagnosis. Multiple conditions could present with similar symptoms, and proper clinical examination, medical history review, and potentially diagnostic tests are needed for accurate assessment.",
          recommendations: [
            "Schedule an appointment with your primary care physician within 24-48 hours",
            "If symptoms are severe, worsening, or include fever, chest pain, difficulty breathing, or severe pain, seek immediate medical attention",
            "Prepare a detailed symptom timeline including onset, triggers, severity, and any relieving factors",
            "List all current medications, supplements, and recent changes in health status",
            "Consider keeping a symptom diary until your appointment",
            "Do not delay seeking care if you feel your condition is serious or worsening"
          ]
        }
      ];
    }

    // Add disclaimer to all responses
    const responseWithDisclaimer = {
      analysis,
      disclaimer: "This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.",
      emergency_note: "If you are experiencing severe symptoms, chest pain, difficulty breathing, severe bleeding, or other emergency symptoms, call emergency services immediately."
    };

    return new Response(JSON.stringify(responseWithDisclaimer), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    
    // Provide helpful error response
    const errorResponse = {
      error: 'Medical analysis temporarily unavailable',
      message: 'We are unable to process your symptoms at this time. Please consult with a healthcare professional for proper medical evaluation.',
      recommendations: [
        'Contact your primary care physician',
        'If symptoms are severe or concerning, seek immediate medical attention',
        'Visit an urgent care center or emergency room if needed',
        'Keep track of your symptoms for when you see a healthcare provider'
      ]
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
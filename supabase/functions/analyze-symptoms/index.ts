import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const prompt = `You are a medical AI assistant. Based on the following symptoms and patient information, provide a medical analysis with possible conditions. Return your response as a JSON array of objects with the following structure:

[
  {
    "condition": "Condition Name",
    "probability": "High/Medium/Low (percentage)",
    "description": "Brief description of the condition",
    "recommendations": ["recommendation 1", "recommendation 2", ...]
  }
]

Patient Information:
- Age: ${age || 'Not provided'}
- Gender: ${gender || 'Not provided'}
- Duration: ${duration || 'Not provided'}
- Symptoms: ${symptoms}

Important guidelines:
1. Provide 3-5 most likely conditions
2. Include probability levels (High/Medium/Low with approximate percentage)
3. Give practical recommendations for each condition
4. Always emphasize consulting a healthcare professional
5. Focus on common conditions first, then less common ones
6. Consider the patient's age and gender in your analysis
7. Return valid JSON only

Remember: This is for informational purposes only and should not replace professional medical advice.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a medical AI assistant that provides symptom analysis. Always return responses in valid JSON format as specified in the user prompt.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse the AI response as JSON
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      console.error('Failed to parse AI response as JSON:', parseError);
      analysis = [
        {
          condition: "Medical Analysis Available",
          probability: "Please consult a doctor",
          description: "I apologize, but I encountered an issue processing your symptoms. Please consult with a healthcare professional for proper evaluation.",
          recommendations: [
            "Schedule an appointment with your primary care physician",
            "Provide detailed symptom information to your doctor",
            "Monitor your symptoms and note any changes",
            "Seek immediate medical attention if symptoms worsen"
          ]
        }
      ];
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze symptoms',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
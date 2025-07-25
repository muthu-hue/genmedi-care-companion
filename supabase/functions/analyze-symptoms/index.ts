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

    const prompt = `You are an advanced medical AI assistant specialized in accurate disease diagnosis. Based on the following symptoms and patient information, provide a precise medical analysis with specific disease conditions. Return your response as a JSON array of objects with the following structure:

[
  {
    "condition": "Exact Disease Name",
    "probability": "High/Medium/Low (percentage)",
    "description": "Detailed medical description of the condition",
    "recommendations": ["specific recommendation 1", "specific recommendation 2", ...]
  }
]

Patient Information:
- Age: ${age || 'Not provided'}
- Gender: ${gender || 'Not provided'}
- Duration: ${duration || 'Not provided'}
- Symptoms: ${symptoms}

CRITICAL INSTRUCTIONS:
1. Provide EXACT disease names, not general categories
2. Include 3-5 most likely specific conditions based on symptoms
3. Consider the patient's age and gender in diagnosis
4. Provide accurate probability assessments
5. Give specific medical recommendations for each condition
6. Focus on precision - avoid vague conditions
7. Consider both common and rare diseases that match the symptoms
8. Return ONLY valid JSON without any markdown formatting or code blocks

Medical Analysis Guidelines:
- Consider symptom combinations and patterns
- Factor in epidemiological data for age/gender
- Include both acute and chronic conditions
- Provide actionable medical advice
- Always recommend professional medical consultation

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'You are a medical AI assistant specialized in accurate disease diagnosis. Always return responses in valid JSON format only, without any markdown formatting, code blocks, or additional text. Focus on providing specific, exact disease names rather than general categories.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
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
    
    // Remove any leading/trailing whitespace
    aiResponse = aiResponse.trim();

    // Try to parse the AI response as JSON
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
      
      // Validate the structure
      if (!Array.isArray(analysis)) {
        throw new Error('Response is not an array');
      }
      
      // Ensure each item has required fields
      analysis = analysis.map(item => ({
        condition: item.condition || 'Unknown Condition',
        probability: item.probability || 'Unknown',
        description: item.description || 'No description available',
        recommendations: Array.isArray(item.recommendations) ? item.recommendations : ['Consult a healthcare professional']
      }));
      
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw AI response:', aiResponse);
      analysis = [
        {
          condition: "Medical Analysis Error",
          probability: "Please consult a doctor",
          description: "We encountered an issue processing your symptoms. For accurate diagnosis, please consult with a healthcare professional who can properly evaluate your condition.",
          recommendations: [
            "Schedule an appointment with your primary care physician immediately",
            "Provide detailed symptom information including onset, duration, and severity",
            "Keep a symptom diary noting patterns and triggers",
            "Seek immediate medical attention if symptoms worsen or new concerning symptoms develop"
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
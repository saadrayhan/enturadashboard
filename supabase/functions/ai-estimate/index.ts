import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, description, requirements, estimated_budget } = await req.json();

    const prompt = `You are a senior agency project estimator. Based on the following client proposal, provide a detailed project estimate.

Title: ${title}
Description: ${description || "Not provided"}
Requirements: ${requirements || "Not provided"}
Client's Budget Estimate: ${estimated_budget ? `$${estimated_budget}` : "Not provided"}

Provide a structured estimate with:
1. **Estimated Timeline**: How long this project would take (in weeks)
2. **Recommended Budget Range**: A realistic budget range in USD
3. **Complexity Level**: Low / Medium / High / Very High
4. **Key Phases**: Break down into 3-5 project phases with time estimates
5. **Risk Factors**: 2-3 potential risks to watch
6. **Recommendations**: 2-3 suggestions for the client

Be concise but thorough. Use markdown formatting.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI proxy error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const estimate = data.choices?.[0]?.message?.content || "Unable to generate estimate.";

    return new Response(JSON.stringify({ estimate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

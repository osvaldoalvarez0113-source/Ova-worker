export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "*",

        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Solo POST", { status: 405 });
    }

    const body = await request.json();
    const prompt = body.prompt || "";

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024 }
        }),

          
        
      }
    );

    const data = await geminiRes.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || ("Sin texto. Razón: " + (data?.candidates?.[0]?.finishReason || JSON.stringify(data).slice(0,200)));


    return new Response(JSON.stringify({ texto }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};

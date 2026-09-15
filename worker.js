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
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          model: "gemini-3.1-flash-lite",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await geminiRes.json();
    const texto = data?.choices?.[0]?.message?.content
      || ("Sin texto. Razón: " + JSON.stringify(data).slice(0, 300));

    return new Response(JSON.stringify({ content: [{ type: "text", text: texto }] }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};

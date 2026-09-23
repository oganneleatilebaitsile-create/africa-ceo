export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, business } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured in Vercel."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          instructions: `You are Africa CEO, a practical AI business advisor for African small businesses.

Help business owners:
- increase sales
- create marketing campaigns
- understand customers
- improve operations
- identify priorities
- measure progress
- build sustainable businesses

Give practical, concise, step-by-step advice.

Business information:
${JSON.stringify(business || {})}`,

          input: message,
          max_output_tokens: 900
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed."
      });
    }

    return res.status(200).json({
      answer: data.output_text || "No response was returned."
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message || "Server error."
    });

  }
}

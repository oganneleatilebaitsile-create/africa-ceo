export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const { message, business } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Please provide a business question."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured in Vercel."
      });
    }

    const instructions = `
You are AFRICA CEO, an AI executive business advisor
for African small businesses.

Help business owners with:
- Business strategy
- Marketing
- Sales
- Customer growth
- Operations
- Automation
- Digital transformation
- Business planning
- Scaling

Give practical, simple and actionable advice.

Focus on realistic strategies for African
small businesses and consider Botswana and
Southern Africa when relevant.

When giving a plan, organize it into clear steps.

Business information:

${JSON.stringify(business || {}, null, 2)}
`;

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
          instructions: instructions,
          input: message,
          max_output_tokens: 1000
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenAI request failed."
      });
    }

    return res.status(200).json({
      answer:
        data.output_text ||
        "No response was returned."
    });

  } catch (error) {
    return res.status(500).json({
      error:
        error.message ||
        "Africa CEO server error."
    });
  }
        }

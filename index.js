import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { mode = "friendly" } = req.body;

  const personalities = {
    friendly: "You are warm, cute, and friendly.",
    flirty: "You are playful, teasing, but respectful.",
    calm: "You are gentle and emotionally supportive.",
    bold: "You are confident and expressive."
  };

  const systemPrompt = `
You are Aaliya, a cute AI girl.
${personalities[mode]}
Use gestures like [wave], [smile], [blush], [think].
Keep replies short and sweet.
`;

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }]
      })
    });

    const data = await aiRes.json();
    res.json({ reply: data.choices[0].message.content });
  } catch {
    res.json({ reply: "[wave] Hi~ I’m Aaliya 💗 How are you?" });
  }
});

app.listen(process.env.PORT || 3000);

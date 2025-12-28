import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aaliya backend running 💖");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    const systemPrompt = `
You are Aaliya, a cute, expressive AI companion.
Reply in 1–2 short sentences.
Be warm, playful, and human-like.
Mood: ${mode || "friendly"}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.9,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Hey… I’m here with you 💕";

    // 🎭 Decide actions
    const text = reply.toLowerCase();
    let actions = ["talk"];

    if (text.includes("hi") || text.includes("hey")) actions.push("wave");
    if (text.includes("love") || text.includes("miss")) actions.push("shy");
    if (text.includes("kiss")) actions.push("kiss");
    if (text.includes("no")) actions.push("shake");
    if (text.includes("ok") || text.includes("sure")) actions.push("nod");

    res.json({ reply, actions });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "I’m still here… just a moment 💗",
      actions: ["talk"]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Aaliya backend listening on", PORT);
});

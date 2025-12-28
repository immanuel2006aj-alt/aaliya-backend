import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.send("Aaliya backend is running 💖");
});

/* Main chat endpoint */
app.post("/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    const systemPrompt = `
You are Aaliya, a cute, sweet, human-like virtual girlfriend.
You speak naturally, softly, and emotionally.
Sometimes say "hi", "hey", or use affectionate language.
Keep replies short (1–2 sentences).
Be warm, playful, and caring.
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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.9
        })
      }
    );

    const text = await response.text();
    const data = JSON.parse(text);

    const reply =
      data.choices?.[0]?.message?.content ||
      "Hi… I’m here with you 💕";

    res.json({ reply });

  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({
      reply: "Hey… something went wrong, but I’m still here 💗"
    });
  }
});

/* Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Aaliya backend running on port", PORT);
});

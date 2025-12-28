import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aaliya backend is running 💖");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    console.log("Incoming:", message, mode);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Aaliya, a cute expressive AI girl. Mood: ${mode}`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const text = await response.text();
    console.log("OpenAI raw:", text);

    const data = JSON.parse(text);

    res.json({
      reply: data.choices?.[0]?.message?.content || "Aaliya is shy 😳"
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      reply: "Aaliya had an internal error 💔"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Aaliya backend running on port", PORT);
});

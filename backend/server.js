import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({path: '.env'});

const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());


app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages array is required" });
    }

 
    const systemMessage = messages.find((m) => m.role === "system")?.content || "";
    const conversationHistory = messages
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const prompt = `
      ${systemMessage}
      
      Conversation history:
      ${conversationHistory}
      
      Respond to the user's last message. Remember to stay in character as a technical interviewer.
    `;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key is missing. Please set the GEMINI_API_KEY environment variable."
      });
    }


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: "There was an error processing your request: " + error.message
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


export default app;
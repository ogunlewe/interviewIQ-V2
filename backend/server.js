import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env' });

const app = express();
const SERVER_TIMEOUT = 60000; // 60 seconds

// Set a dynamic CORS middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://interviewiq-v2.vercel.app'
];

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// Increase timeout for the server
app.use((req, res, next) => {
  res.setTimeout(SERVER_TIMEOUT, () => {
    console.error('Request timeout');
    res.status(504).json({ error: "Request timeout" });
  });
  next();
});

app.use(express.json());

// Your Gemini helper function and endpoint below remain the same
async function generateGeminiResponse(prompt) {
  const GEMINI_TIMEOUT = 30000; // 30 seconds

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Gemini API timeout')), GEMINI_TIMEOUT);
  });

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0" });
    
    // Race between API call and timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

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

    const response = await generateGeminiResponse(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        error: "Request timed out while waiting for the AI response"
      });
    }
    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: "AI service configuration error"
      });
    }
    res.status(500).json({
      error: "There was an error processing your request"
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start the server only in non-production (or use a different setup for serverless)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  server.timeout = SERVER_TIMEOUT;
}

export default app;

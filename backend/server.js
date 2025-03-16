import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({path: '.env'});

const app = express();

// Increase timeout for the server
const SERVER_TIMEOUT = 60000; // 60 seconds
app.use((req, res, next) => {
  res.setTimeout(SERVER_TIMEOUT, () => {
    console.error('Request timeout');
    res.status(504).json({ error: "Request timeout" });
  });
  next();
});

// Configure CORS for local development
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Helper function to handle Gemini API calls with timeout
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
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    
    // Handle specific error types
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

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Set timeout for the server
  server.timeout = SERVER_TIMEOUT;
}

export default app;
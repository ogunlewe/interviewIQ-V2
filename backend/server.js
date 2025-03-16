console.log("server is starting ...");


import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env' });

const app = express();
const SERVER_TIMEOUT = 60000; // 60 seconds

// Allowed origins for dynamic CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://interviewiq-v2.vercel.app'
];

// Dynamic CORS middleware
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (allowedOrigins.includes(requestOrigin)) {
    console.log("CORS allowed for origin:", requestOrigin);
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  } else {
    console.log("CORS not allowed for origin:", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    console.log("OPTIONS request received; returning 200.");
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log("Sending prompt to Gemini:", prompt);
    // Race between API call and timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);

    console.log("Gemini raw result:", result);

    if (!result || !result.response) {
      throw new Error("Gemini API returned invalid response");
    }

    const text = result.response.text();
    console.log("Gemini text response:", text);

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// POST /api/chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid request: messages array is required");
      return res.status(400).json({ error: "Invalid request: messages array is required" });
    }

    // Extract system message
    const systemMessage = messages.find((m) => m.role === "system")?.content || "";
    console.log("System message:", systemMessage);

    // Build conversation history
    const conversationHistory = messages
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");
    console.log("Conversation history:", conversationHistory);

    // Construct prompt
    const prompt = `
      ${systemMessage}

      Conversation history:
      ${conversationHistory}

      Respond to the user's last message. Remember to stay in character as a technical interviewer.
    `;
    console.log("Final prompt:", prompt);

    // Send prompt to Gemini
    const response = await generateGeminiResponse(prompt);
    console.log("Final Gemini response to client:", response);

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

// Health check
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

// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Allowed origins - update with your actual URLs
const allowedOrigins = [
  'http://localhost:5173',
  'https://interviewiq-v2.vercel.app'
];

export default async function handler(req, res) {
  // Dynamically set CORS headers based on the request origin
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    console.log("OPTIONS request received; returning 200.");
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    console.error("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Incoming request body:", req.body);

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid request: messages array is required");
      return res
        .status(400)
        .json({ error: "Invalid request: messages array is required" });
    }

    // Extract system message
    const systemMessage = messages.find((m) => m.role === "system")?.content || "";
    console.log("System message:", systemMessage);

    // Build conversation history string
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
      
      Respond to the user's last message. Remember to stay in character as a technical HR interviewer.
    `;
    console.log("Final prompt:", prompt);

    // Initialize Gemini
    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key missing");
      return res.status(500).json({ error: "Gemini API key is missing" });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Send request to Gemini
    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    console.log("Gemini raw result:", result);

    if (!result || !result.response) {
      console.error("Gemini response object invalid");
      return res.status(500).json({ error: "Invalid Gemini response object" });
    }

    const text = result.response.text();
    console.log("Gemini text response:", text);

    // Send the text back to the client
    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: "There was an error processing your request",
    });
  }
}

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google-vertex";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const google = createGoogleGenerativeAI({
      googleAuthOptions: {
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
      },
    });

    const { messages } = await req.json();

    const systemMessage =
      messages.find((m: any) => m.role === "system")?.content || "";

    const conversationHistory = messages
      .filter((m: any) => m.role !== "system")
      .map(
        (m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
      )
      .join("\n\n");

    const prompt = `
${systemMessage}

Conversation history:
${conversationHistory}

Respond to the user's last message. Remember to stay in character as a technical interviewer.
`;

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error(
        "Google credentials are missing. Please set the GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables."
      );
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      {
        error:
          "There was an error processing your request: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

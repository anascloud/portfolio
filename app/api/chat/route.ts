import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: ChatCompletionMessageParam[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
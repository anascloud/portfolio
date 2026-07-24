import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ reply: "Invalid request" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages,
    });

    const reply = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ reply: "Sorry, I couldn't process that. Please try again." });
  }
}

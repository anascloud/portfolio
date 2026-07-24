import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1].content.toLowerCase();

  let aiResponse = "I am Anas's AI Assistant. How can I help you with his portfolio?";

  if (userMessage.includes("experience") || userMessage.includes("years")) {
    aiResponse = "Anas has 11 years of experience as a Full Stack, AI, and App Developer.";
  } else if (userMessage.includes("projects") || userMessage.includes("work")) {
    aiResponse = "Anas has built numerous ERP systems, Ecommerce platforms, and AI applications. You can filter them in the Projects section below!";
  } else if (userMessage.includes("contact") || userMessage.includes("email")) {
    aiResponse = "You can reach Anas at anasbinsabiet@gmail.com or call +8801793478194.";
  } else if (userMessage.includes("cv") || userMessage.includes("resume")) {
    aiResponse = "You can view and download Anas's CV from the 'Download My CV' button in the navigation bar.";
  }

  return NextResponse.json({ reply: aiResponse });
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(request) {
  try {
    const body = await request.json();
    const input = (body?.input || "").toString();

    if (!input.trim()) {
      return NextResponse.json(
        { error: "Input code is required" },
        { status: 400 }
      );
    }

    const prompt = `Explain the following code in simple, beginner-friendly language. Keep it short, use bullet points, and highlight what it does and how it works.\n\nCode:\n\n${input}`;

    const result = await model.generateContent(prompt);
    const explanationSimple = result.response.text().trim();

    return NextResponse.json({ explanationSimple });
  } catch (error) {
    console.error("get-explanation-simple error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}



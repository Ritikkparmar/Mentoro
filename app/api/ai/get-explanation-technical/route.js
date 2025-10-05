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

    const prompt = `Provide a detailed technical explanation of the following code, including complexity analysis, potential edge cases, architectural concerns, and performance/security considerations. Include refactoring suggestions where applicable. Use markdown headings and code snippets.\n\nCode:\n\n${input}`;

    const result = await model.generateContent(prompt);
    const explanationTechnical = result.response.text().trim();

    return NextResponse.json({ explanationTechnical });
  } catch (error) {
    console.error("get-explanation-technical error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}



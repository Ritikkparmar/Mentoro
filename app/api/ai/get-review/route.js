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

    const prompt = `You are an expert AI Code Reviewer. Review the following code and return a concise markdown report. Identify syntax errors, logic issues, poor practices, and vulnerabilities (like XSS/SQLi). Provide exact fixes or code snippets. End with a short summary and an overall score out of 100.\n\nCode:\n\n${input}`;

    const result = await model.generateContent(prompt);
    const review = result.response.text().trim();

    return NextResponse.json({ review });
  } catch (error) {
    console.error("get-review error:", error);
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}



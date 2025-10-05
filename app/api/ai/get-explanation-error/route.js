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
        { error: "Input error text is required" },
        { status: 400 }
      );
    }

    // Basic heuristic to ensure it's an error-like text
    const looksLikeError = /(error|exception|stack|trace|failed|undefined|reference)/i.test(
      input
    );
    if (!looksLikeError) {
      return NextResponse.json({ error: true }, { status: 200 });
    }

    const prompt = `You will receive an error message or stack trace. Provide:\n1) Root cause analysis\n2) Step-by-step fix\n3) Common pitfalls\n4) Sample corrected code if applicable\n\nReturn markdown.\n\nError:\n${input}`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim();

    // Optional: fetch top StackOverflow results (skipped here; placeholder array)
    const stackOverflowResult = [];

    return NextResponse.json({ explanation, stackOverflowResult });
  } catch (error) {
    console.error("get-explanation-error error:", error);
    return NextResponse.json(
      { error: "Failed to analyze error" },
      { status: 500 }
    );
  }
}



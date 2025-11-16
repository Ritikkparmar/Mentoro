import { NextResponse } from "next/server";
import { isRateLimited, extractRetryAfterSeconds, createFallbackResponse } from "@/lib/api-quota";

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const input = (body?.input || "").toString();

    if (!input.trim()) {
      return NextResponse.json(
        { error: "Input code is required" },
        { status: 400 }
      );
    }

    const generateModule = await import("@/app/(main)/services/gemini.js");
    const generateResponse = generateModule.default || generateModule;

    try {
      const output = await generateResponse(input, "deep");
      return NextResponse.json({ deep: output });
    } catch (err) {
      if (isRateLimited(err)) {
        const retryAfter = extractRetryAfterSeconds(err);
        const fallback = createFallbackResponse('deep', input);
        const headers = new Headers();
        headers.set("Retry-After", String(retryAfter));
        return new NextResponse(
          JSON.stringify({ deep: fallback.deep, warning: fallback.warning, retryAfterSeconds: retryAfter }),
          { status: 200, headers }
        );
      }
      console.error("Gemini deep error:", err);
      return NextResponse.json(
        { error: "Gemini API request failed", details: err?.message || "Unknown error" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("get-deep error:", error);
    return NextResponse.json(
      { error: "Failed to generate deep dive" },
      { status: 500 }
    );
  }
}



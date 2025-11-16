import { NextResponse } from "next/server";
import { getExplanationSimple } from "@/actions/code-review";

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

    const result = await getExplanationSimple({ input });
    return NextResponse.json(result);
  } catch (error) {
    console.error("get-explanation-simple error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

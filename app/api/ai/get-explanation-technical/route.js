import { NextResponse } from "next/server";
import { getExplanationTechnical } from "@/actions/code-review";

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

    const result = await getExplanationTechnical({ input });
    return NextResponse.json(result);
  } catch (error) {
    console.error("get-explanation-technical error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

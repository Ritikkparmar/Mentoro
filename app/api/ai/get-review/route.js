import { NextResponse } from "next/server";
import { getReview } from "@/actions/code-review";
import { isRateLimited, extractRetryAfterSeconds, createFallbackResponse } from "@/lib/api-quota";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || (typeof body === "object" && typeof body.input !== "string")) {
      return NextResponse.json(
        { error: "Invalid request. Send { input: string, mode?: string }" },
        { status: 400 }
      );
    }

    const payload = typeof body === "string" ? { input: body } : body;
    
    try {
      const result = await getReview(payload);
      return NextResponse.json(result);
    } catch (err) {
      if (isRateLimited(err)) {
        const retryAfter = extractRetryAfterSeconds(err);
        const fallbackResponse = createFallbackResponse('review', payload.input);
        const headers = new Headers();
        headers.set("Retry-After", String(retryAfter));
        return new NextResponse(
          JSON.stringify({ 
            review: fallbackResponse.review,
            warning: fallbackResponse.warning,
            retryAfterSeconds: retryAfter 
          }),
          { status: 200, headers }
        );
      }
      console.error("get-review route error:", err);
      const message = err?.message || "Internal Server Error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    console.error("get-review route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate review" },
      { status: 500 }
    );
  }
}
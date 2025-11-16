import { NextResponse } from "next/server";
import { getExplanationError } from "@/actions/code-review";
// import { validateInput } from "@/middleware/validateInput";

export async function POST(request) {
  try {
    const body = await request.json();
    // const error = validateInput(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const result = await getExplanationError(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

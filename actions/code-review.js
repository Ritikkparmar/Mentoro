// ...existing code...
const STACK_EXCHANGE_KEY = process.env.STACK_EXCHANGE_API;

// Dynamic import for CommonJS gemini service
async function getGeminiService() {
  try {
    // Use relative path to avoid issues with parentheses in path
    const geminiModule = await import("../app/(main)/services/gemini.js");
    // Handle CommonJS default export
    const service = geminiModule.default || geminiModule;
    if (typeof service !== "function") {
      throw new Error("Gemini service is not a function");
    }
    return service;
  } catch (error) {
    console.error("Failed to load gemini service:", error);
    // Try with absolute path alias as fallback
    try {
      const geminiModule = await import("@/app/(main)/services/gemini.js");
      const service = geminiModule.default || geminiModule;
      if (typeof service === "function") {
        return service;
      }
    } catch (fallbackError) {
      console.error("Fallback import also failed:", fallbackError);
    }
    throw new Error(`Cannot load Gemini service: ${error.message}`);
  }
}

/**
 * Normalize input and call gemini service.
 * Returns an object the API route can serialize.
 */
// ...existing code...


export async function getReview(payload) {
  try {
    // Accept either a string or an object { input, mode }
    const input =
      typeof payload === "string"
        ? payload
        : (payload?.input ?? payload?.text ?? "");

    const mode = payload?.mode ?? "review";

    if (!input || typeof input !== "string" || input.trim() === "") {
      throw new Error("Invalid input for getReview");
    }

    // Call gemini with requested mode (review | simple | technical | error | quick | deep)
    let gemini;
    try {
      gemini = await getGeminiService();
    } catch (importError) {
      console.error("Failed to import gemini service:", importError);
      throw new Error("Gemini service unavailable");
    }

    if (!gemini || typeof gemini !== "function") {
      console.error("Gemini service is not a function:", typeof gemini);
      throw new Error("Gemini service initialization failed");
    }

    const response = await gemini(input, mode);

    // Return normalized response for the client
    return { review: response, input, mode };
  } catch (error) {
    console.error("Error in getReview:", error);
    throw error;
  }
}
// ...existing code...

export async function getExplanationSimple(payload) {
  try {
    const input =
      typeof payload === "string" ? payload : payload?.input ?? "";

    if (!input || typeof input !== "string" || input.trim() === "") {
      throw new Error("Invalid input for getExplanationSimple");
    }

    const gemini = await getGeminiService();
    const response = await gemini(input, "simple");
    return { explanationSimple: response };
  } catch (error) {
    console.error("Error in getExplanationSimple:", error);
    throw error;
  }
}

export async function getExplanationTechnical(payload) {
  try {
    const input =
      typeof payload === "string" ? payload : payload?.input ?? "";

    if (!input || typeof input !== "string" || input.trim() === "") {
      throw new Error("Invalid input for getExplanationTechnical");
    }

    const gemini = await getGeminiService();
    const response = await gemini(input, "technical");
    return { explanationTechnical: response };
  } catch (error) {
    console.error("Error in getExplanationTechnical:", error);
    throw error;
  }
}

export async function getExplanationError(payload) {
  try {
    const input =
      typeof payload === "string" ? payload : payload?.input ?? "";

    if (!input || typeof input !== "string" || input.trim() === "") {
      throw new Error("Invalid input for getExplanationError");
    }

    const gemini = await getGeminiService();
    const geminiResponse = await gemini(input, "error");

    // Clean fenced JSON if present
    const geminiResponseStr = String(geminiResponse)
      .replace(/^```json\s*/, "")
      .replace(/```\s*$/, "");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(geminiResponseStr);
      if (!parsedResponse || !parsedResponse.error_type) {
        throw new Error("Invalid error format from Gemini");
      }
    } catch (jsonError) {
      throw new Error(
        "Invalid or unrecognized error format. Please enter a valid error message."
      );
    }

    const searchQuery = parsedResponse.summary_title || input;
    const stackOverflowResponse = await fetch(
      `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(
        searchQuery
      )}&accepted=true&site=stackoverflow&key=${STACK_EXCHANGE_KEY}`
    );

    const stackOverflowData = await stackOverflowResponse.json();

    return {
      explanation: parsedResponse,
      stackOverflowResult: stackOverflowData.items ?? [],
    };
  } catch (error) {
    console.error("Error in getExplanationError:", error);
    throw error;
  }
}
// ...existing code...
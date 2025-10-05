"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // use latest stable model

// Utility to safely parse JSON from Gemini
function safeJSONParse(text) {
  try {
    const cleaned = text.replace(/```(?:json)?\n?/g, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ JSON parse failed:", error.message);
    return null;
  }
}

export async function reviewCode({ title, language, code }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const prompt = `
      You are an expert AI Code Reviewer integrated into a web app called Mentoro.
      Review this ${language} code and return structured feedback in pure JSON.

      Code:
      ${code}

      Instructions:
      - Identify issues, explain clearly, and suggest fixes.
      - Provide an overall summary with a quality score (0–100).
      - Return ONLY valid JSON.
      Format:
      {
        "issues": [
          {
            "type": "error|warning|suggestion",
            "severity": "high|medium|low",
            "title": "string",
            "description": "string",
            "line": number or null,
            "suggestion": "string",
            "category": "syntax|logic|security|performance|style|best-practice"
          }
        ],
        "summary": {
          "overallScore": number,
          "readability": "excellent|good|fair|poor",
          "performance": "excellent|good|fair|poor",
          "maintainability": "excellent|good|fair|poor",
          "security": "excellent|good|fair|poor",
          "strengths": ["string"],
          "improvements": ["string"]
        }
      }
    `;

    // Generate review from Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const reviewResult = safeJSONParse(text);
    if (!reviewResult) {
      console.error("⚠️ Invalid Gemini output:", text);
      throw new Error("AI returned invalid JSON. Please retry.");
    }

    // Save to database
    const codeReview = await db.codeReview.create({
      data: {
        userId: user.id,
        title,
        language,
        code,
        reviewResult,
        overallScore: reviewResult.summary?.overallScore ?? 0,
      },
    });

    revalidatePath("/code-review");
    return codeReview;

  } catch (error) {
    console.error("❌ reviewCode error:", error);
    return { error: error.message || "Failed to review code" };
  }
}

// Fetch user code reviews
export async function getCodeReviews() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const codeReviews = await db.codeReview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return codeReviews;
  } catch (error) {
    console.error("❌ getCodeReviews error:", error);
    return { error: "Failed to fetch code reviews" };
  }
}

export async function getCodeReview(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const review = await db.codeReview.findUnique({
      where: { id, userId: user.id },
    });

    if (!review) throw new Error("Code review not found");

    return review;
  } catch (error) {
    console.error("❌ getCodeReview error:", error);
    return { error: "Failed to fetch code review" };
  }
}

export async function deleteCodeReview(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    await db.codeReview.delete({ where: { id, userId: user.id } });

    revalidatePath("/code-review");
    return { success: true };
  } catch (error) {
    console.error("❌ deleteCodeReview error:", error);
    return { error: "Failed to delete code review" };
  }
}

export async function getCodeReviewStats() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const reviews = await db.codeReview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const total = reviews.length;
    const average = total
      ? reviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / total
      : 0;

    const languageStats = reviews.reduce((acc, r) => {
      acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReviews: total,
      averageScore: Math.round(average * 10) / 10,
      languageStats,
      recentReviews: reviews.slice(0, 5),
    };
  } catch (error) {
    console.error("❌ getCodeReviewStats error:", error);
    return { error: "Failed to fetch stats" };
  }
}

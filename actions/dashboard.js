"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isRateLimited, extractRetryAfterSeconds } from "@/lib/api-quota";

export const generateAIInsights = async (industry) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    
    if (isRateLimited(error)) {
      // Return fallback insights when API is rate limited
      return generateFallbackInsights(industry);
    }
    
    throw new Error("Failed to generate industry insights");
  }
};

function generateFallbackInsights(industry) {
  // Generate basic industry insights when AI service is unavailable
  return {
    salaryRanges: [
      { role: "Junior Developer", min: 50000, max: 80000, median: 65000, location: "Global" },
      { role: "Mid-level Developer", min: 70000, max: 120000, median: 95000, location: "Global" },
      { role: "Senior Developer", min: 100000, max: 160000, median: 130000, location: "Global" },
      { role: "Tech Lead", min: 120000, max: 180000, median: 150000, location: "Global" },
      { role: "Engineering Manager", min: 140000, max: 220000, median: 180000, location: "Global" }
    ],
    growthRate: 15,
    demandLevel: "High",
    topSkills: ["JavaScript", "Python", "React", "Node.js", "Cloud Computing"],
    marketOutlook: "Positive",
    keyTrends: ["Remote Work", "AI Integration", "Cloud Migration", "DevOps", "Security Focus"],
    recommendedSkills: ["TypeScript", "Docker", "Kubernetes", "AWS", "Machine Learning"]
  };
}

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
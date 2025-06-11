"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";
import { checkUser } from "@/lib/checkUser";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    // Step 1: Check if industry insights already exist
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    // Step 2: Generate insights outside the transaction if not present
    if (!industryInsight) {
      const insights = await generateAIInsights(data.industry);

      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        },
      });
    }

    // Step 3: Update user profile
    const updatedUser = await db.user.update({
      where: { clerkUserId: userId },
      data: {
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: Array.isArray(data.skills)
          ? data.skills.map((skill) => skill.trim())
          : String(data.skills || "")
              .split(",")
              .map((skill) => skill.trim())
              .filter((s) => s.length > 0),
      },
    });
    

    revalidatePath("/dashboard");

    console.log("User and industry insights updated successfully:", {
      updatedUser,
      industryInsight,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    return { success: false, error: error.message };
  }
}
export async function getUserOnboardingStatus() {
  const { userId } = await auth();

  if (!userId) {
    console.error("User not authenticated.");
    throw new Error("Unauthorized");
  }

  // Ensure user exists in DB
  await checkUser();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  return {
    isOnboarded: !!user?.industry,
  };
}

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isRateLimited, extractRetryAfterSeconds } from "@/lib/api-quota";

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    
    if (isRateLimited(error)) {
      // Generate fallback cover letter when API is rate limited
      const fallbackContent = generateFallbackCoverLetter(data, user);
      
      const coverLetter = await db.coverLetter.create({
        data: {
          content: fallbackContent,
          jobDescription: data.jobDescription,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          status: "completed",
          userId: user.id,
        },
      });

      return coverLetter;
    }
    
    throw new Error("Failed to generate cover letter");
  }
}

function generateFallbackCoverLetter(data, user) {
  return `# Cover Letter

**${user.bio || 'Professional'}**  
**${user.industry} Professional**  
**${user.experience} years of experience**

---

**${new Date().toLocaleDateString()}**

**Hiring Manager**  
**${data.companyName}**

Dear Hiring Manager,

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. With ${user.experience} years of experience in ${user.industry} and expertise in ${user.skills?.join(", ") || 'relevant technologies'}, I am confident that I would be a valuable addition to your team.

## Why I'm a Great Fit

**Relevant Experience**: My background in ${user.industry} has equipped me with the skills and knowledge necessary to excel in this role. I have hands-on experience with ${user.skills?.slice(0, 3).join(", ") || 'industry-standard technologies'}.

**Key Strengths**:
- Strong technical foundation in ${user.industry}
- Proven ability to work collaboratively in team environments
- Experience with modern development practices and tools
- Commitment to continuous learning and professional growth

## What I Bring to ${data.companyName}

I am excited about the opportunity to contribute to ${data.companyName}'s mission and bring my passion for ${user.industry} to your team. My experience with ${user.skills?.join(", ") || 'relevant technologies'} aligns well with the requirements for this position.

I am particularly drawn to this role because it offers the opportunity to work on challenging projects while continuing to develop my skills in a dynamic environment.

## Next Steps

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${data.companyName}'s continued success. Thank you for considering my application.

I look forward to hearing from you soon.

Best regards,  
**${user.bio || 'Your Name'}**

---

*Note: This is a template cover letter generated due to AI service limitations. Please customize it with specific details and achievements.*`;
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isRateLimited, extractRetryAfterSeconds } from "@/lib/api-quota";

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    if (isRateLimited(error)) {
      // Return fallback quiz questions when API is rate limited
      return generateFallbackQuiz(user.industry, user.skills);
    }
    
    throw new Error("Failed to generate quiz questions");
  }
}

function generateFallbackQuiz(industry, skills) {
  // Generate basic quiz questions when AI service is unavailable
  const baseQuestions = [
    {
      question: `What is the primary purpose of version control in ${industry} development?`,
      options: [
        "To track changes in code over time",
        "To compile code faster",
        "To reduce memory usage",
        "To improve code readability"
      ],
      correctAnswer: "To track changes in code over time",
      explanation: "Version control systems like Git help track changes, collaborate with teams, and maintain code history."
    },
    {
      question: `Which of the following is NOT a best practice in ${industry} development?`,
      options: [
        "Writing unit tests",
        "Using meaningful variable names",
        "Hardcoding sensitive information",
        "Following coding standards"
      ],
      correctAnswer: "Hardcoding sensitive information",
      explanation: "Hardcoding sensitive information like passwords or API keys is a security risk and should be avoided."
    },
    {
      question: `What does DRY stand for in software development?`,
      options: [
        "Don't Repeat Yourself",
        "Data Retrieval Yield",
        "Dynamic Resource Yield",
        "Database Response Yield"
      ],
      correctAnswer: "Don't Repeat Yourself",
      explanation: "DRY principle encourages avoiding code duplication to improve maintainability."
    },
    {
      question: `Which approach is better for handling errors in ${industry} applications?`,
      options: [
        "Silently ignoring errors",
        "Using try-catch blocks",
        "Logging errors only",
        "Throwing all errors to the user"
      ],
      correctAnswer: "Using try-catch blocks",
      explanation: "Try-catch blocks allow proper error handling and graceful degradation."
    },
    {
      question: `What is the main benefit of code documentation?`,
      options: [
        "Makes code run faster",
        "Reduces file size",
        "Improves code maintainability",
        "Increases compilation speed"
      ],
      correctAnswer: "Improves code maintainability",
      explanation: "Good documentation helps other developers understand and maintain the code."
    }
  ];

  // Add industry-specific questions if skills are available
  if (skills && skills.length > 0) {
    baseQuestions.push({
      question: `Which of these is most important when working with ${skills[0]}?`,
      options: [
        "Understanding the underlying concepts",
        "Memorizing all syntax",
        "Using the latest version always",
        "Avoiding documentation"
      ],
      correctAnswer: "Understanding the underlying concepts",
      explanation: "Understanding core concepts is more valuable than memorizing syntax or always using the latest version."
    });
  }

  return baseQuestions;
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
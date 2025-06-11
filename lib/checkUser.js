import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found in Clerk.");
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      console.log("User found in the database:", loggedInUser);
      return loggedInUser;
    }

    console.log("User not found in the database. Creating a new user...");

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email = user.emailAddresses?.[0]?.emailAddress || "no-email@example.com";

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl || "",
        email,
      },
    });

    console.log("New user created in the database:", newUser);

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    throw new Error("Failed to check or create user.");
  }
};
import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";

// Mark this route as dynamic since it uses authentication and headers under the hood
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OnboardingPage() {
  try {
    const { isOnboarded } = await getUserOnboardingStatus();

    if (isOnboarded) {
      redirect("/dashboard");
    }

    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    // Fallback gracefully to home if something goes wrong during build/runtime
    redirect("/");
  }
}
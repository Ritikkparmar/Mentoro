import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
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
    console.error("Error fetching onboarding status:", error); // Log full error object
    redirect("/error");
  }
}
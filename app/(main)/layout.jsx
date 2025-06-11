"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MainLayout = ({ isOnboarded, children }) => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding if the user is not onboarded
    if (isOnboarded === false && !window.location.pathname.includes("/onboarding")) {
      router.replace("/onboarding"); // Use replace to avoid adding to history stack
    }
  }, [isOnboarded, router]);

  return (
    <div className="pt-20 pb-10 px-5"> {/* Added padding to shift components downward */}
      {children}
    </div>
  );
};

export default MainLayout;
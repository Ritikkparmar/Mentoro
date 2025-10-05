"use client";
import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("./_components/LandingPage"), {
  ssr: false,
});

export default function CodeReviewPage() {
  return <LandingPage />;
}

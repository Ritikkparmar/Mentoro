"use client";
import { FaCode } from "react-icons/fa6";
import { PiBugFill } from "react-icons/pi";
import { PiArticleNyTimesFill } from "react-icons/pi";

const Home = () => {
  const featureIcons = {
    FaCode: FaCode,
    PiBugFill: PiBugFill,
    PiArticleNyTimesFill: PiArticleNyTimesFill,
  };

  const handleScroll = () => {
    window.scrollBy({ top: window.innerHeight - 20, behavior: "smooth" });
  };

  const features = [
    {
      icon: "FaCode",
      title: "Smart Code Review",
      desc: "AI-driven explanations for both beginners and experts.",
    },
    {
      icon: "PiBugFill",
      title: "Error Analysis",
      desc: "Instant error insights with Stack Overflow solutions.",
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <section className="relative pt-20 md:pt-32 pb-12 px-6 text-center space-y-6">
        <div className="relative max-w-4xl mx-auto">
          <h1 className="max-sm:text-[2.8rem] max-sm:leading-tight sm:text-5xl md:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-gray-300">
            Code <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">Review & Analysis</span>{" "}
            Made Simple
          </h1>
          <p className="text-lg text-gray-400 mt-6 font-medium">
            Get instant code reviews, error analysis, and simplified
            explanations powered by AI.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 flex flex-col items-center gap-10 sm:gap-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
          {features.map((feature, index) => {
            const IconComponent = featureIcons[feature.icon];
            return (
              <div
                key={index}
                className="w-full max-w-sm px-3 sm:px-4 py-5 sm:py-6 rounded-lg border flex flex-col gap-1 sm:gap-2 border-gray-800 bg-gray-900/30 backdrop-blur text-center"
              >
                <IconComponent className="text-3xl mx-auto" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleScroll}
          className="bg-white px-8 py-2 text-black rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
        >
          Try it now
        </button>
      </section>
    </div>
  );
};

export default Home;
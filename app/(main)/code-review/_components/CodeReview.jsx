"use client";

import { useEffect, useState } from "react";
import CodeInput from "./CodeInput";
import ActionButtons from "./ActionButton";
import OutputDisplay from "./OutputDisplay";
import axios from "axios";
import { MAX_LENGTH } from "../constant";

const CodeReview = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [output, setOutput] = useState({
    review: "",
    explanationSimple: "",
    explanationTechnical: "",
  });
  const [loading, setLoading] = useState({
    reviewLoading: false,
    explainationLoading: false, // keep original key name to avoid breaking other components
  });
  const [warnings, setWarnings] = useState({
    review: "",
    explanationSimple: "",
    explanationTechnical: "",
  });

  const handleReview = async () => {
    if (loading.reviewLoading || loading.explainationLoading) return;

    const trimmedCode = code.trim();
    setError("");

    if (trimmedCode === "") {
      setError("Please enter some code to get an explanation or review.");
      return;
    }

    if (trimmedCode.length > MAX_LENGTH) {
      setError("The input is too long. Please shorten it.");
      return;
    }
    setLoading((s) => ({ ...s, reviewLoading: true }));
    try {
      const response = await axios.post("/api/ai/get-review", {
        input: code,
      });

      if (response.status === 200 && response.data && response.data.review) {
        setOutput((prev) => ({ ...prev, review: response.data.review }));
        setWarnings((prev) => ({
          ...prev,
          review: response.data.warning || "",
        }));
      } else {
        setError(response.data?.error || "Unexpected error. Please try again.");
      }
    } catch (err) {
      console.error("handleReview error:", err);
      setError("Failed to fetch review. Please try again.");
    } finally {
      setLoading((s) => ({ ...s, reviewLoading: false }));
    }
  };

  const handleExplain = async () => {
    if (loading.reviewLoading || loading.explainationLoading) return;
    const trimmedCode = code.trim();
    setError("");

    if (trimmedCode === "") {
      setError("Please enter some code to get an explanation or review.");
      return;
    }
    if (trimmedCode.length > MAX_LENGTH) {
      setError("The input is too long. Please shorten it.");
      return;
    }
    setLoading((s) => ({ ...s, explainationLoading: true }));

    try {
      const [response1, response2] = await Promise.allSettled([
        axios.post("/api/ai/get-explanation-simple", { input: code }),
        axios.post("/api/ai/get-explanation-technical", { input: code }),
      ]);

      const explanationData = {
        explanationSimple:
          response1.status === "fulfilled"
            ? response1.value.data.explanationSimple
            : "Error loading simple explanation",
        explanationTechnical:
          response2.status === "fulfilled"
            ? response2.value.data.explanationTechnical
            : "Error loading technical explanation",
      };

      const warningData = {
        explanationSimple:
          response1.status === "fulfilled"
            ? response1.value.data.warning || ""
            : "",
        explanationTechnical:
          response2.status === "fulfilled"
            ? response2.value.data.warning || ""
            : "",
      };

      setOutput((prev) => ({ ...prev, ...explanationData }));
      setWarnings((prev) => ({ ...prev, ...warningData }));
    } catch (err) {
      console.error("handleExplain error:", err);
      setError("Failed to fetch explanation. Please try again.");
    } finally {
      setLoading((s) => ({ ...s, explainationLoading: false }));
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const handleScroll = () => {
    window.scrollBy({ top: 200, behavior: "smooth" });
  };

  useEffect(() => {
    if (
      output.explanationSimple ||
      output.explanationTechnical ||
      output.review
    ) {
      handleScroll();
    }
  }, [output.explanationSimple, output.explanationTechnical, output.review]);
  return (
    <>
      <div>
        <CodeInput code={code} setCode={setCode} />
        <ActionButtons
          onReview={handleReview}
          onExplain={handleExplain}
          loading={loading}
          error={error}
        />
      </div>

      {(output.explanationSimple ||
        output.explanationTechnical ||
        output.review) && (
        <div className="mt-10">
          <OutputDisplay
            output={output}
            warnings={warnings}
            active={
              output.explanationSimple || output.explanationTechnical
                ? "simple"
                : "review"
            }
          />
        </div>
      )}
    </>
  );
};

export default CodeReview;
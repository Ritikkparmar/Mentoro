"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export function useQuizSecurity() {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [violations, setViolations] = useState([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState("");
  
  // Use ref to track if we're already disqualified to prevent multiple triggers
  const disqualifiedRef = useRef(false);

  // ⏱ Timer countdown
  useEffect(() => {
    if (!isQuizActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

  // Format time
  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  // 🚨 RECORD VIOLATION
  const addViolation = useCallback((message) => {
    if (disqualifiedRef.current) return; // Don't add violations if already disqualified

    const v = {
      message,
      timestamp: Date.now(),
    };

    setViolations((prev) => [...prev, v]);
    setTabSwitchCount((prev) => prev + 1);
    
    setWarningCount((prev) => {
      const newCount = prev + 1;
      
      if (newCount === 1) {
        toast.warning("⚠️ 1st Warning: Do not leave the test!", {
          duration: 3000,
        });
      } else if (newCount === 2) {
        toast.warning("⚠️ 2nd Warning: One more violation = ZERO score!", {
          duration: 4000,
        });
      } else if (newCount >= 3) {
        disqualifiedRef.current = true;
        setIsDisqualified(true);
        setDisqualificationReason("Three security violations (3 strikes rule)");
        toast.error("🚫 You have been disqualified due to violations!", {
          duration: 5000,
        });
      }
      
      return newCount;
    });
  }, []);

  // ⚠ Detect tab switch / window blur
  useEffect(() => {
    const handleBlur = () => {
      if (isQuizActive && !disqualifiedRef.current) {
        addViolation("User switched tabs or minimized window");
      }
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [isQuizActive, addViolation]);

  // ⛔ Disable right click
  useEffect(() => {
    const preventContext = (e) => {
      if (isQuizActive) {
        e.preventDefault();
        if (!disqualifiedRef.current) {
          toast.info("Right-click is disabled during the assessment", {
            duration: 2000,
          });
        }
      }
    };
    
    window.addEventListener("contextmenu", preventContext);
    return () => window.removeEventListener("contextmenu", preventContext);
  }, [isQuizActive]);

  // ⛔ Disable keyboard shortcuts
  useEffect(() => {
    const disableKeys = (e) => {
      if (!isQuizActive) return;

      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        if (!disqualifiedRef.current) {
          addViolation("Attempted to use blocked keyboard shortcut");
        }
      }
    };

    window.addEventListener("keydown", disableKeys);
    return () => window.removeEventListener("keydown", disableKeys);
  }, [isQuizActive, addViolation]);

  // 🔒 Fullscreen exit detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (isQuizActive && !document.fullscreenElement && !disqualifiedRef.current) {
        addViolation("Exited fullscreen mode");
        // Try to re-enter fullscreen
        document.documentElement.requestFullscreen?.().catch(() => {
          console.log("Could not re-enter fullscreen");
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isQuizActive, addViolation]);

  // START QUIZ
  const startQuiz = (minutes = 30) => {
    disqualifiedRef.current = false;
    setIsQuizActive(true);
    setTimeRemaining(minutes * 60);
    
    // Request fullscreen with error handling
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
        toast.info("Please allow fullscreen for the best experience", {
          duration: 3000,
        });
      }
    };
    
    enterFullscreen();
  };

  // END QUIZ manually (Emergency exit)
  const endQuiz = () => {
    setIsQuizActive(false);
    
    // Safely exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  };

  return {
    isQuizActive,
    timeRemaining,
    tabSwitchCount,
    warningCount,
    violations,
    isDisqualified,
    disqualificationReason,

    startQuiz,
    endQuiz,
    formatTime,
  };
}
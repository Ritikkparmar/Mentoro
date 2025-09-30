"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useQuizSecurity } from "@/hooks/useQuizSecurity";
import { Clock, Shield, AlertTriangle } from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Use security hook with fallback
  const securityHook = useQuizSecurity();
  const {
    isQuizActive = false,
    timeRemaining = 0,
    tabSwitchCount = 0,
    warningCount = 0,
    violations = [],
    isDisqualified = false,
    disqualificationReason = '',
    startQuiz = () => {},
    endQuiz = () => {},
    formatTime = (time) => `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`,
  } = securityHook || {};

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    // If disqualified, set score to 0
    const score = isDisqualified ? 0 : calculateScore();
    
    try {
      // Pass violation data to save function
      await saveQuizResultFn(quizData, answers, score, {
        isDisqualified,
        disqualificationReason,
        violations,
        tabSwitchCount,
        warningCount
      });
      
      if (typeof endQuiz === 'function') {
        endQuiz(); // End the secure quiz mode
      }
      
      if (isDisqualified) {
        toast.error("Quiz completed with ZERO score due to security violations!");
      } else {
        toast.success("Quiz completed successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  const startSecureQuiz = async () => {
    setIsStarting(true);
    try {
      await generateQuizFn();
    } catch (error) {
      toast.error("Failed to generate quiz");
      setIsStarting(false);
    }
  };

  // Auto-start secure mode when quiz data is loaded (optional)
  useEffect(() => {
    if (quizData && !isQuizActive && !isStarting) {
      // Start secure mode after a short delay
      const timer = setTimeout(() => {
        try {
          if (typeof startQuiz === 'function') {
            console.log("Auto-starting security mode...");
            startQuiz(30); // 30 minutes timer
          }
        } catch (error) {
          console.log("Security mode failed to start, continuing with quiz");
        }
      }, 2000); // Increased delay to 2 seconds
      return () => clearTimeout(timer);
    }
  }, [quizData, isQuizActive, isStarting, startQuiz]);

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Don't block quiz display for isStarting - let security mode start in background
  if (isStarting) {
    console.log("Quiz is starting, but showing questions anyway");
  }

  // Show disqualification screen if user is disqualified
  if (isDisqualified) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Quiz Disqualified - Security Violation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="font-medium text-destructive mb-2">Reason for Disqualification:</p>
            <p className="text-destructive">{disqualificationReason}</p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium mb-2">Security Violations Detected:</p>
            <ul className="space-y-1 text-sm">
              {violations.map((violation, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  <span>{violation.message}</span>
                  <span className="text-muted-foreground text-xs">
                    ({new Date(violation.timestamp).toLocaleTimeString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="font-medium text-yellow-600 mb-2">⚠️ Penalty Applied:</p>
            <p className="text-yellow-600">Your quiz score has been set to ZERO due to security violations.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={finishQuiz} className="w-full" variant="destructive">
            Submit Quiz with Zero Score
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Ready to test your knowledge?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
          
          {/* Security Features Info */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-green-600" />
              Secure Quiz Mode Features:
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
              <li>• Fullscreen mode will be activated</li>
              <li>• Tab switching detection and warnings</li>
              <li>• Right-click and shortcuts will be disabled</li>
              <li>• 30-minute timer with auto-submit</li>
              <li>• Auto-submit after 2 tab switches</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-600 font-medium">
              Important: Once started, you cannot leave the quiz until completion or time expires.
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="space-y-2 w-full">
            <Button onClick={startSecureQuiz} className="w-full" disabled={isStarting}>
              {isStarting ? "Generating Quiz..." : "Start Secure Quiz"}
            </Button>
            {quizData && !isQuizActive && (
              <Button
                onClick={() => startQuiz(30)}
                variant="outline"
                className="w-full"
              >
                Activate Security Mode
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }


  // Show quiz questions if we have quiz data, regardless of security mode
  if (!quizData) {
    console.log("No quiz data available");
    return null;
  }

  console.log("Quiz data available:", quizData.length, "questions");
  console.log("Is quiz active:", isQuizActive);
  console.log("Current question index:", currentQuestion);

  const question = quizData[currentQuestion];
  console.log("Current question:", question);

  return (
    <Card className="mx-2">
      <CardHeader>
        {/* Security Status Banner */}
        {isQuizActive && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Shield className="h-5 w-5" />
              <span>Security Mode Active - Any violations will result in disqualification</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
          <div className="flex items-center gap-4">
            {isQuizActive && timeRemaining && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            {isQuizActive && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Secure Mode</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Security Warnings */}
        {isQuizActive && violations.length > 0 && (
          <div className="space-y-2 mt-2">
            {violations.map((violation, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">
                  {violation.message}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(violation.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {isQuizActive && warningCount > 0 && !isDisqualified && (
          <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-600 font-medium">
              ⚠️ WARNING: {warningCount}/2 violations - Next violation will result in disqualification!
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant="outline"
              disabled={!answers[currentQuestion]}
            >
              Show Explanation
            </Button>
          )}
          {isQuizActive && (
            <Button
              onClick={endQuiz}
              variant="destructive"
              size="sm"
            >
              Emergency Exit
            </Button>
          )}
        </div>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult && (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}

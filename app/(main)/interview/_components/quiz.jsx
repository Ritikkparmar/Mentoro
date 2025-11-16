"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useQuizSecurity } from "@/hooks/useQuizSecurity";
import { Clock, Shield, AlertTriangle, CheckCircle2, XCircle, Eye, Lock, MousePointerClick } from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const security = useQuizSecurity();
  const {
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
  } = security;

  // Fetch quiz
  const { loading: generatingQuiz, fn: generateQuizFn, data: quizData } = useFetch(generateQuiz);

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

  // Handle answer
  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  // Next question
  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  // Score
  const calculateScore = () => {
    let correct = 0;
    answers.forEach((a, i) => {
      if (a === quizData[i].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  // MAIN SAVE FUNCTION
  const finishQuiz = async () => {
    const score = isDisqualified ? 0 : calculateScore();

    try {
      await saveQuizResultFn(quizData, answers, score, {
        isDisqualified,
        disqualificationReason,
        violations,
        tabSwitchCount,
        warningCount,
      });

      if (endQuiz) endQuiz();
      toast.success(isDisqualified ? "Score set to 0 due to violations!" : "Quiz completed");
    } catch {
      toast.error("Failed to save results");
    }
  };

  // ❗ AUTO-SAVE WHEN DISQUALIFIED
  useEffect(() => {
    if (isDisqualified && quizData && answers.length > 0 && !savingResult) {
      const timer = setTimeout(() => {
        finishQuiz();
      }, 2000); // Wait 2 seconds before auto-submit
      
      return () => clearTimeout(timer);
    }
  }, [isDisqualified]);

  // ⏱ AUTO-SUBMIT WHEN TIME EXPIRES
  useEffect(() => {
    if (timeRemaining === 0 && isQuizActive && quizData && !savingResult) {
      toast.info("Time's up! Submitting your assessment...");
      const timer = setTimeout(() => {
        finishQuiz();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isQuizActive]);

  const startSecureQuiz = async () => {
    setIsStarting(true);
    try {
      await generateQuizFn();
      setTimeout(() => startQuiz(30), 1200);
    } catch {
      toast.error("Failed to generate quiz");
      setIsStarting(false);
    }
  };

  // UI BELOW
  if (generatingQuiz || savingResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <BarLoader width={200} color="#3b82f6" />
        <p className="text-muted-foreground">
          {generatingQuiz ? "Generating your secure assessment..." : "Submitting your answers..."}
        </p>
      </div>
    );
  }

  if (resultData)
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={() => location.reload()} />
      </div>
    );

  if (!quizData) {
    return (
      <Card className="mx-2 max-w-3xl mx-auto border-2">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Secure Assessment Mode</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                This assessment runs in proctored mode with advanced security monitoring to ensure fair evaluation.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Security Features */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <Lock className="w-4 h-4" />
              Active Security Measures
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-background border rounded-lg">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Tab Switch Detection</p>
                  <p className="text-sm text-muted-foreground">Switching tabs or minimizing the window will be tracked</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-background border rounded-lg">
                <MousePointerClick className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Right-Click Protection</p>
                  <p className="text-sm text-muted-foreground">Context menu and copy operations are disabled</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-background border rounded-lg">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Keyboard Shortcuts Blocked</p>
                  <p className="text-sm text-muted-foreground">Developer tools and inspect shortcuts are disabled</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-background border rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Timed Assessment</p>
                  <p className="text-sm text-muted-foreground">Auto-submit when time expires</p>
                </div>
              </div>
            </div>
          </div>

          {/* Violation Policy */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4" />
              Three-Strike Violation Policy
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">1</div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">First Warning - Continue with caution</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-orange-300 bg-orange-50 dark:bg-orange-950/20">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2</div>
                <p className="font-medium text-orange-800 dark:text-orange-300">Second Warning - Final chance</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-red-300 bg-red-50 dark:bg-red-950/20">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">3</div>
                <p className="font-medium text-red-800 dark:text-red-300">Automatic Disqualification - Score set to 0</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-300">
              <CheckCircle2 className="w-4 h-4" />
              Before You Begin
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1.5 ml-6 list-disc">
              <li>Ensure you have a stable internet connection</li>
              <li>Close all unnecessary tabs and applications</li>
              <li>Find a quiet environment without distractions</li>
              <li>Do not refresh or navigate away from this page</li>
              <li>Assessment will automatically enter fullscreen mode</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6">
          <Button 
            onClick={startSecureQuiz} 
            disabled={isStarting} 
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isStarting ? (
              <>
                <BarLoader color="white" width={100} height={2} />
                <span className="ml-2">Initializing Secure Mode...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Start Secure Assessment
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By starting, you agree to follow all security protocols
          </p>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2 max-w-3xl mx-auto">
      <CardHeader>
        {isQuizActive && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-700" />
              <span className="text-sm font-medium text-green-700">Secure Mode Active</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Violations: {warningCount}/3</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>

          {isQuizActive && (
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        {warningCount > 0 && !isDisqualified && (
          <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
            warningCount === 1 ? 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30' :
            warningCount === 2 ? 'bg-orange-500/20 text-orange-700 border border-orange-500/30' :
            'bg-red-500/20 text-red-700 border border-red-500/30'
          }`}>
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Warning {warningCount}/3</p>
              <p className="text-sm">
                {warningCount === 1 && "First warning - Please stay focused on the assessment"}
                {warningCount === 2 && "Second warning - One more violation will result in disqualification"}
              </p>
            </div>
          </div>
        )}

        {isDisqualified && (
          <div className="mt-3 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 flex items-start gap-3">
            <XCircle className="h-6 w-6 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-bold text-lg text-red-700">Assessment Disqualified</p>
              <p className="text-sm mt-1 text-red-600">{disqualificationReason}</p>
              <p className="text-sm mt-2 text-red-600">
                Your score has been set to 0. The assessment will be submitted automatically in a few seconds...
              </p>
            </div>
          </div>
        )}

        {timeRemaining === 0 && isQuizActive && !isDisqualified && (
          <div className="mt-3 p-4 rounded-lg bg-orange-500/10 border-2 border-orange-500/50 flex items-start gap-3">
            <Clock className="h-6 w-6 flex-shrink-0 mt-0.5 text-orange-600" />
            <div className="flex-1">
              <p className="font-bold text-lg text-orange-700">Time Expired</p>
              <p className="text-sm mt-1 text-orange-600">
                Your assessment is being submitted automatically...
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-lg font-medium leading-relaxed">{question.question}</p>
        </div>

        <RadioGroup 
          value={answers[currentQuestion]} 
          onValueChange={handleAnswer} 
          className="space-y-3"
          disabled={isDisqualified}
        >
          {question.options.map((opt, i) => (
            <div 
              key={i} 
              className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem id={`opt-${i}`} value={opt} />
              <Label htmlFor={`opt-${i}`} className="cursor-pointer flex-1 text-base">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          {answers.filter(a => a !== null).length} of {quizData.length} answered
        </div>
        <Button 
          onClick={handleNext} 
          disabled={!answers[currentQuestion] || isDisqualified || savingResult || timeRemaining === 0}
          size="lg"
        >
          {savingResult ? "Submitting..." : currentQuestion === quizData.length - 1 ? "Submit Assessment" : "Next Question"}
        </Button>
      </CardFooter>
    </Card>
  );
}
"use client";

import { Trophy, CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  const isDisqualified = result.securityViolations?.isDisqualified || false;
  const violations = result.securityViolations?.violations || [];

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        {isDisqualified ? (
          <AlertTriangle className="h-6 w-6 text-red-500" />
        ) : (
          <Trophy className="h-6 w-6 text-yellow-500" />
        )}
        {isDisqualified ? "Quiz Disqualified" : "Quiz Results"}
      </h1>

      <CardContent className="space-y-6">
        {/* Security Violation Alert */}
        {isDisqualified && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive font-medium mb-2">
              <Shield className="h-5 w-5" />
              <span>Security Violation Detected</span>
            </div>
            <p className="text-destructive text-sm mb-3">
              {result.securityViolations.disqualificationReason}
            </p>
            {violations.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Violations:</p>
                <ul className="text-xs space-y-1">
                  {violations.map((violation, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-destructive">•</span>
                      <span>{violation.message}</span>
                      <span className="text-muted-foreground">
                        ({new Date(violation.timestamp).toLocaleTimeString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className={`text-2xl font-bold ${isDisqualified ? 'text-destructive' : ''}`}>
            {result.quizScore.toFixed(1)}%
            {isDisqualified && <span className="text-sm ml-2">(Zero due to violations)</span>}
          </h3>
          <Progress 
            value={result.quizScore} 
            className={`w-full ${isDisqualified ? '[&>div]:bg-destructive' : ''}`} 
          />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className={`p-4 rounded-lg ${isDisqualified ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}>
            <p className={`font-medium ${isDisqualified ? 'text-destructive' : ''}`}>
              {isDisqualified ? 'Security Notice:' : 'Improvement Tip:'}
            </p>
            <p className={isDisqualified ? 'text-destructive text-sm' : 'text-muted-foreground'}>
              {result.improvementTip}
            </p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>
          {result.questions.map((q, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your answer: {q.userAnswer}</p>
                {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
              </div>
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation:</p>
                <p>{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}

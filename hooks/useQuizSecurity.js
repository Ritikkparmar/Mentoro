"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useQuizSecurity = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');

  // Timer effect
  useEffect(() => {
    let interval;
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("Tab visibility changed, isQuizActive:", isQuizActive, "document.hidden:", document.hidden);
      if (isQuizActive && document.hidden && !isDisqualified) {
        const newTabCount = tabSwitchCount + 1;
        const newWarningCount = warningCount + 1;
        
        setTabSwitchCount(newTabCount);
        setWarningCount(newWarningCount);
        
        // Add violation record
        const violation = {
          type: 'TAB_SWITCH',
          timestamp: new Date().toISOString(),
          count: newTabCount,
          message: `Tab switch detected (${newTabCount} times)`
        };
        setViolations(prev => [...prev, violation]);
        
        if (newWarningCount >= 2) {
          // DISQUALIFY USER - Set score to zero
          setDisqualificationReason('Multiple tab switches detected - Cheating violation');
          setIsDisqualified(true);
          toast.error("🚫 DISQUALIFIED: Multiple tab switches detected! Your score will be set to ZERO due to cheating!");
          handleAutoSubmit();
        } else {
          toast.warning(`⚠️ WARNING ${newWarningCount}/2: Tab switching detected! Next violation will result in disqualification!`);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isQuizActive, tabSwitchCount, warningCount, isDisqualified]);

  // Keyboard shortcuts prevention
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isQuizActive && !isDisqualified) {
        // Prevent common shortcuts
        const blockedKeys = [
          'F12', // Developer tools
          'F5', // Refresh
          'F11', // Fullscreen toggle
        ];

        // Also block Ctrl+Shift+I, Ctrl+U, Ctrl+S, etc.
        const blockedCombinations = [
          { ctrl: true, shift: true, key: 'I' }, // Dev tools
          { ctrl: true, key: 'u' }, // View source
          { ctrl: true, key: 's' }, // Save
          { ctrl: true, key: 'p' }, // Print
          { ctrl: true, key: 'r' }, // Refresh
        ];

        const isBlockedKey = blockedKeys.includes(e.key);
        const isBlockedCombo = blockedCombinations.some(combo => 
          combo.ctrl === e.ctrlKey && 
          combo.shift === e.shiftKey && 
          combo.key.toLowerCase() === e.key.toLowerCase()
        );

        if (isBlockedKey || isBlockedCombo) {
          e.preventDefault();
          
          // Add violation record
          const violation = {
            type: 'KEYBOARD_SHORTCUT',
            timestamp: new Date().toISOString(),
            key: e.key,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            message: `Blocked keyboard shortcut: ${e.key}${e.ctrlKey ? '+Ctrl' : ''}${e.shiftKey ? '+Shift' : ''}`
          };
          setViolations(prev => [...prev, violation]);
          
          // DISQUALIFY immediately for keyboard shortcuts
          setDisqualificationReason('Keyboard shortcuts detected - Cheating violation');
          setIsDisqualified(true);
          toast.error("🚫 DISQUALIFIED: Keyboard shortcuts detected! Your score will be set to ZERO due to cheating!");
          handleAutoSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isQuizActive, isDisqualified]);

  // Right-click prevention
  useEffect(() => {
    const handleContextMenu = (e) => {
      console.log("Right-click detected, isQuizActive:", isQuizActive);
      if (isQuizActive && !isDisqualified) {
        e.preventDefault();
        
        // Add violation record
        const violation = {
          type: 'RIGHT_CLICK',
          timestamp: new Date().toISOString(),
          message: 'Right-click context menu attempted'
        };
        setViolations(prev => [...prev, violation]);
        
        // DISQUALIFY immediately for right-click
        setDisqualificationReason('Right-click context menu detected - Cheating violation');
        setIsDisqualified(true);
        toast.error("🚫 DISQUALIFIED: Right-click detected! Your score will be set to ZERO due to cheating!");
        handleAutoSubmit();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [isQuizActive, isDisqualified]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (isQuizActive && !document.fullscreenElement && !isDisqualified) {
        // Add violation record
        const violation = {
          type: 'FULLSCREEN_EXIT',
          timestamp: new Date().toISOString(),
          message: 'Exited fullscreen mode during quiz'
        };
        setViolations(prev => [...prev, violation]);
        
        // DISQUALIFY for exiting fullscreen
        setDisqualificationReason('Exited fullscreen mode - Cheating violation');
        setIsDisqualified(true);
        toast.error("🚫 DISQUALIFIED: Exited fullscreen mode! Your score will be set to ZERO due to cheating!");
        handleAutoSubmit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isQuizActive, isDisqualified]);

  const startQuiz = useCallback((durationMinutes = 30) => {
    console.log("Starting quiz security mode...");
    setIsQuizActive(true);
    setTimeRemaining(durationMinutes * 60);
    setTabSwitchCount(0);
    setWarningCount(0);
    setViolations([]);
    setIsDisqualified(false);
    setDisqualificationReason('');
    
    // Request fullscreen
    requestFullscreen();
    
    toast.success("🔒 Quiz started! Security mode activated. Any violations will result in disqualification!");
    console.log("Quiz security mode activated");
  }, []);

  const endQuiz = useCallback(() => {
    setIsQuizActive(false);
    setTimeRemaining(null);
    setTabSwitchCount(0);
    setWarningCount(0);
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    if (isDisqualified) {
      toast.error("Quiz ended due to security violations!");
    } else {
      toast.success("Quiz completed successfully!");
    }
  }, [isDisqualified]);

  const handleAutoSubmit = useCallback(() => {
    toast.error("Quiz auto-submitted due to time limit or violations!");
    endQuiz();
  }, [endQuiz]);

  const requestFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isQuizActive,
    timeRemaining,
    tabSwitchCount,
    warningCount,
    isFullscreen,
    violations,
    isDisqualified,
    disqualificationReason,
    startQuiz,
    endQuiz,
    formatTime,
    requestFullscreen,
  };
};

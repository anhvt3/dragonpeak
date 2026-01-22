import { useState, useCallback, useEffect, useMemo } from "react";
import { useGameAPI } from "usegamigameapi";
import { gameConfig } from "@/config/gameConfig";
import { useGameAudio } from "@/hooks/useGameAudio";
import { EnvelopeState } from "@/components/game/LuckyEnvelopes";
import { fallbackQuestions } from "@/data/questions";

const MAX_POSITION = 4;
const FIXED_TOTAL = gameConfig.fixedTotalQuestions; // Always 5
const API_TIMEOUT_MS = 5000; // Fallback to sample after 5s if no API response

// Check sample mode immediately (not in useEffect)
function checkSampleModeImmediate(): boolean {
  if (typeof window === 'undefined') return true;
  const urlParams = new URLSearchParams(window.location.search);
  const sampleParam = urlParams.get('sample');
  return sampleParam === 'true';
}

export interface GameState {
  questions: any[];
  isLoading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  scoreState: EnvelopeState[];
  mascotStep: number;
  isMascotMoving: boolean;
  gameComplete: boolean;
  reachedFinish: boolean;
  currentQuestion: {
    id: number;
    question: string;
    imageUrl?: string;
    answers: string[];
    correctIndex: number;
  } | undefined;
  isLastQuestion: boolean;
  correctCount: number;
  totalQuestions: number;
}

export interface GameActions {
  handleAnswerSelect: (index: number) => void;
  handleSubmit: () => void;
  handleContinue: () => void;
  handleRestart: () => void;
}

/**
 * Hook that integrates usegamigameapi library while maintaining
 * compatibility with the existing game interface.
 * 
 * Uses the exact variables from the library's Complete Quiz Flow Example:
 * - quiz, selectedAnswer, currentResult, answers, correctCount
 * - currentQuestionIndex, isSubmitting, hasSubmitted, isCompleted
 * - handleAnswerSelect, updateAnswer, handleContinue, finish
 */
export function useGameAPILogic(): GameState & GameActions {
  const { playButtonClick, playCorrectAnswer, playWrongAnswer, playFinishGame } = useGameAudio();
  
  // Track mascot movement
  const [mascotStep, setMascotStep] = useState(0);
  const [isMascotMoving, setIsMascotMoving] = useState(false);
  const [reachedFinish, setReachedFinish] = useState(false);
  
  // Track local selected answer index for UI compatibility
  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);
  
  // Sample mode state - initialized immediately
  const [useSampleMode, setUseSampleMode] = useState(() => checkSampleModeImmediate());
  const [sampleQuestionIndex, setSampleQuestionIndex] = useState(0);
  const [sampleSelectedAnswer, setSampleSelectedAnswer] = useState<number | null>(null);
  const [sampleIsAnswered, setSampleIsAnswered] = useState(false);
  const [sampleAnswers, setSampleAnswers] = useState<(boolean | null)[]>([]);
  const [sampleIsCompleted, setSampleIsCompleted] = useState(false);
  
  // Track if we've timed out waiting for API
  const [apiTimedOut, setApiTimedOut] = useState(false);

  // Use the useGameAPI hook exactly as per documentation
  const {
    quiz,
    selectedAnswer,
    currentResult,
    answers,
    correctCount: apiCorrectCount,
    currentQuestionIndex: apiCurrentQuestionIndex,
    isSubmitting,
    hasSubmitted,
    isCompleted: apiIsCompleted,
    handleAnswerSelect: apiHandleAnswerSelect,
    updateAnswer,
    handleContinue: apiHandleContinue,
    finish
  } = useGameAPI({
    onAnswerCorrect: ({ currentQuestionIndex }) => {
      console.log(`Question ${currentQuestionIndex + 1} answered correctly!`);
      playCorrectAnswer();
      setIsMascotMoving(true);
      setMascotStep(prev => Math.min(prev + 1, MAX_POSITION));
      setTimeout(() => setIsMascotMoving(false), 1600);
    },
    onAnswerIncorrect: () => {
      console.log('Incorrect answer');
      playWrongAnswer();
    }
  });

  // Set timeout to fallback to sample mode if API doesn't respond
  useEffect(() => {
    if (useSampleMode || apiTimedOut || quiz) return;
    
    const timeout = setTimeout(() => {
      console.log('API timeout - falling back to sample mode');
      setApiTimedOut(true);
      setUseSampleMode(true);
    }, API_TIMEOUT_MS);
    
    return () => clearTimeout(timeout);
  }, [useSampleMode, apiTimedOut, quiz]);

  // Sample mode question handling
  const sampleCurrentQuestion = useMemo(() => {
    if (!useSampleMode && !apiTimedOut) return undefined;
    return fallbackQuestions[sampleQuestionIndex];
  }, [useSampleMode, apiTimedOut, sampleQuestionIndex]);

  // Calculate correct count for sample mode
  const sampleCorrectCount = useMemo(() => {
    return sampleAnswers.filter(a => a === true).length;
  }, [sampleAnswers]);

  // Determine effective sample mode (explicit or timed out)
  const effectiveSampleMode = useSampleMode || apiTimedOut;

  // Determine if we're loading
  const isLoading = effectiveSampleMode ? false : (!quiz && !apiIsCompleted);

  // Determine current question index
  const currentQuestionIndex = effectiveSampleMode ? sampleQuestionIndex : apiCurrentQuestionIndex;

  // Determine if answered
  const isAnswered = effectiveSampleMode ? sampleIsAnswered : hasSubmitted;

  // Determine if completed
  const isCompleted = effectiveSampleMode ? sampleIsCompleted : apiIsCompleted;

  // Total questions - always use fixed total for progress display
  const totalQuestions = FIXED_TOTAL;

  // Calculate correct count
  const correctCount = effectiveSampleMode ? sampleCorrectCount : apiCorrectCount;

  // Build scoreState for envelope display - always 5 items
  const scoreState: EnvelopeState[] = useMemo(() => {
    const state: EnvelopeState[] = Array(FIXED_TOTAL).fill("pending");
    
    if (effectiveSampleMode) {
      sampleAnswers.forEach((answer, idx) => {
        if (idx < FIXED_TOTAL) {
          if (answer === true) state[idx] = "correct";
          else if (answer === false) state[idx] = "wrong";
        }
      });
    } else {
      answers.forEach((answer, idx) => {
        if (idx < FIXED_TOTAL) {
          if (answer === true) state[idx] = "correct";
          else if (answer === false) state[idx] = "wrong";
        }
      });
    }
    
    return state;
  }, [effectiveSampleMode, sampleAnswers, answers]);

  // Transform quiz data to match existing interface with null safety
  const currentQuestion = useMemo(() => {
    if (effectiveSampleMode) {
      if (!sampleCurrentQuestion) return undefined;
      return {
        id: sampleCurrentQuestion.id ?? sampleQuestionIndex + 1,
        question: sampleCurrentQuestion.question ?? '',
        imageUrl: sampleCurrentQuestion.imageUrl,
        answers: sampleCurrentQuestion.answers ?? [],
        correctIndex: sampleCurrentQuestion.correctIndex ?? 0,
      };
    }

    if (!quiz) return undefined;
    
    // Null safety for API data
    const quizText = quiz.text ?? quiz.content ?? '';
    const quizAnswers = quiz.answers ?? [];
    const quizAudioUrl = quiz.audioUrl ?? quiz.audio_url;
    
    // Transform answers with null safety
    const transformedAnswers = quizAnswers.map((a: any) => {
      if (typeof a === 'string') return a;
      return a?.content ?? a?.text ?? a?.option_value ?? '';
    });
    
    // Find correct answer index from API response
    let correctIdx = 0;
    if (currentResult?.correctAnswerId) {
      correctIdx = quizAnswers.findIndex((a: any) => 
        a?.id === currentResult.correctAnswerId || 
        a?.option_code === currentResult.correctAnswerId
      );
      if (correctIdx < 0) correctIdx = 0;
    }

    return {
      id: quiz.id ?? currentQuestionIndex + 1,
      question: quizText,
      imageUrl: quizAudioUrl, // Keep for compatibility
      answers: transformedAnswers,
      correctIndex: correctIdx,
    };
  }, [effectiveSampleMode, sampleCurrentQuestion, sampleQuestionIndex, quiz, currentQuestionIndex, currentResult]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((index: number) => {
    if (isAnswered) return;
    playButtonClick();
    
    if (effectiveSampleMode) {
      setSampleSelectedAnswer(index);
    } else {
      setLocalSelectedIndex(index);
      // Find the answer object to pass to API
      const answerObj = quiz?.answers?.[index];
      if (answerObj) {
        apiHandleAnswerSelect(answerObj);
      }
    }
  }, [isAnswered, effectiveSampleMode, quiz, apiHandleAnswerSelect, playButtonClick]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (effectiveSampleMode) {
      if (sampleSelectedAnswer === null || !sampleCurrentQuestion) return;
      
      const isCorrect = sampleSelectedAnswer === sampleCurrentQuestion.correctIndex;
      
      setSampleAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[sampleQuestionIndex] = isCorrect;
        return newAnswers;
      });
      
      if (isCorrect) {
        playCorrectAnswer();
        setIsMascotMoving(true);
        setMascotStep(prev => Math.min(prev + 1, MAX_POSITION));
        setTimeout(() => setIsMascotMoving(false), 1600);
      } else {
        playWrongAnswer();
      }
      
      setSampleIsAnswered(true);
    } else {
      if (localSelectedIndex === null) return;
      updateAnswer();
    }
  }, [effectiveSampleMode, sampleSelectedAnswer, sampleCurrentQuestion, sampleQuestionIndex, localSelectedIndex, updateAnswer, playCorrectAnswer, playWrongAnswer]);

  // Handle continue
  const handleContinue = useCallback(() => {
    if (effectiveSampleMode) {
      const isLastQuestion = sampleQuestionIndex >= fallbackQuestions.length - 1;
      
      if (mascotStep >= MAX_POSITION || isLastQuestion) {
        playFinishGame();
        setReachedFinish(mascotStep >= MAX_POSITION);
        setSampleIsCompleted(true);
        return;
      }
      
      setSampleQuestionIndex(prev => prev + 1);
      setSampleSelectedAnswer(null);
      setSampleIsAnswered(false);
    } else {
      if (mascotStep >= MAX_POSITION) {
        playFinishGame();
        setReachedFinish(true);
        finish();
        return;
      }
      
      apiHandleContinue();
      setLocalSelectedIndex(null);
    }
  }, [effectiveSampleMode, sampleQuestionIndex, mascotStep, playFinishGame, finish, apiHandleContinue]);

  // Handle restart
  const handleRestart = useCallback(() => {
    // Reset all state
    setMascotStep(0);
    setIsMascotMoving(false);
    setReachedFinish(false);
    setLocalSelectedIndex(null);
    
    if (effectiveSampleMode) {
      setSampleQuestionIndex(0);
      setSampleSelectedAnswer(null);
      setSampleIsAnswered(false);
      setSampleAnswers([]);
      setSampleIsCompleted(false);
    }
    
    // For API mode, page reload is the cleanest restart
    if (!effectiveSampleMode) {
      window.location.reload();
    }
  }, [effectiveSampleMode]);

  // Get selected answer for UI
  const displaySelectedAnswer = effectiveSampleMode ? sampleSelectedAnswer : localSelectedIndex;

  // Determine if this is the last question
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  // Build questions array for compatibility
  const questions = useMemo(() => {
    if (effectiveSampleMode) {
      return fallbackQuestions;
    }
    // For API mode, create a placeholder array of the fixed length
    return Array(FIXED_TOTAL).fill({ id: 0, question: '', answers: [], correctIndex: 0 });
  }, [effectiveSampleMode]);

  return {
    // State
    questions,
    isLoading,
    error: null,
    currentQuestionIndex,
    selectedAnswer: displaySelectedAnswer,
    isAnswered,
    scoreState,
    mascotStep,
    isMascotMoving,
    gameComplete: isCompleted,
    reachedFinish,
    currentQuestion,
    isLastQuestion,
    correctCount,
    totalQuestions,
    // Actions
    handleAnswerSelect,
    handleSubmit,
    handleContinue,
    handleRestart,
  };
}

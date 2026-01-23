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
export function useGameAPILogic(customQuestions?: any[] | null): GameState & GameActions {
  const { playButtonClick, playCorrectAnswer, playWrongAnswer, playFinishGame } = useGameAudio();

  // Track mascot movement
  const [mascotStep, setMascotStep] = useState(0);
  const [isMascotMoving, setIsMascotMoving] = useState(false);
  const [reachedFinish, setReachedFinish] = useState(false);

  // Track local selected answer index for UI compatibility
  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);

  // Sample mode state - initialized immediately
  // If customQuestions provided, force sample mode logic (local state management) but with custom data
  const [useSampleMode, setUseSampleMode] = useState(() => {
    if (customQuestions && customQuestions.length > 0) return true;
    return checkSampleModeImmediate();
  });

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
    currentResult,
    answers,
    correctCount: apiCorrectCount,
    currentQuestionIndex: apiCurrentQuestionIndex,
    isSubmitting: isSubmitting, // Fix for duplicate identifier if any
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

  // Determine effective questions source
  const effectiveQuestions = useMemo(() => {
    if (customQuestions && customQuestions.length > 0) return customQuestions;
    return fallbackQuestions;
  }, [customQuestions]);

  // Update sample mode if customQuestions change
  useEffect(() => {
    if (customQuestions && customQuestions.length > 0) {
      setUseSampleMode(true);
    }
  }, [customQuestions]);

  // Set timeout only if NOT using custom questions
  useEffect(() => {
    if (useSampleMode || apiTimedOut || quiz || (customQuestions && customQuestions.length > 0)) return;

    const timeout = setTimeout(() => {
      console.log('API timeout - falling back to sample mode');
      setApiTimedOut(true);
      setUseSampleMode(true);
    }, API_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [useSampleMode, apiTimedOut, quiz, customQuestions]);

  // Sample mode question handling
  const sampleCurrentQuestion = useMemo(() => {
    if (!useSampleMode && !apiTimedOut && !customQuestions) return undefined;
    const questions = customQuestions && customQuestions.length > 0 ? customQuestions : fallbackQuestions;
    return questions[sampleQuestionIndex];
  }, [useSampleMode, apiTimedOut, sampleQuestionIndex, customQuestions]);

  // Calculate correct count for sample mode
  const sampleCorrectCount = useMemo(() => {
    return sampleAnswers.filter(a => a === true).length;
  }, [sampleAnswers]);

  // Determine effective sample mode (explicit, timed out, or custom data)
  const effectiveSampleMode = useSampleMode || apiTimedOut || (!!customQuestions && customQuestions.length > 0);

  // Determine if we're loading
  // If fetching custom questions (passed as null initially but expecting them), parent should handle loading state
  // Here we assume if customQuestions is undefined/null, we might be waiting for regular API or fallback
  const isLoading = effectiveSampleMode ? false : (!quiz && !apiIsCompleted);

  // Determine current question index
  const currentQuestionIndex = effectiveSampleMode ? sampleQuestionIndex : apiCurrentQuestionIndex;

  // Determine if answered
  const isAnswered = effectiveSampleMode ? sampleIsAnswered : hasSubmitted;

  // Determine if completed
  const isCompleted = effectiveSampleMode ? sampleIsCompleted : apiIsCompleted;

  // Total questions
  const totalQuestions = effectiveQuestions.length > 0 ? effectiveQuestions.length : FIXED_TOTAL;

  // Calculate correct count
  const correctCount = effectiveSampleMode ? sampleCorrectCount : apiCorrectCount;

  // Build scoreState for envelope display
  const scoreState: EnvelopeState[] = useMemo(() => {
    const total = effectiveQuestions.length || FIXED_TOTAL;
    const state: EnvelopeState[] = Array(total).fill("pending");

    if (effectiveSampleMode) {
      sampleAnswers.forEach((answer, idx) => {
        if (idx < total) {
          if (answer === true) state[idx] = "correct";
          else if (answer === false) state[idx] = "wrong";
        }
      });
    } else {
      answers.forEach((answer, idx) => {
        if (idx < total) {
          if (answer === true) state[idx] = "correct";
          else if (answer === false) state[idx] = "wrong";
        }
      });
    }

    return state;
  }, [effectiveSampleMode, sampleAnswers, answers, effectiveQuestions]);

  // Transform quiz data to match existing interface with null safety
  const currentQuestion = useMemo(() => {
    if (effectiveSampleMode) {
      if (!sampleCurrentQuestion) return undefined;
      return {
        id: sampleCurrentQuestion.id ?? sampleQuestionIndex + 1,
        question: sampleCurrentQuestion.question || sampleCurrentQuestion.text || '',
        imageUrl: sampleCurrentQuestion.imageUrl || sampleCurrentQuestion.audioUrl,
        answers: sampleCurrentQuestion.answers ? sampleCurrentQuestion.answers.map((a: any) => typeof a === 'string' ? a : (a.content || a.text || '')) : [],
        correctIndex: sampleCurrentQuestion.correctIndex !== undefined ? sampleCurrentQuestion.correctIndex : (sampleCurrentQuestion.correctAnswerId ? sampleCurrentQuestion.correctAnswerId - 1 : 0),
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

      // Determine correctness
      // Support both correctIndex (0-based) and correctAnswerId (1-based usually)
      let isCorrect = false;
      if (sampleCurrentQuestion.correctIndex !== undefined) {
        isCorrect = sampleSelectedAnswer === sampleCurrentQuestion.correctIndex;
      } else if (sampleCurrentQuestion.correctAnswerId !== undefined) {
        // Assuming answer IDs are 1-based (A=1, B=2...), and selectedIndex is 0-based
        // So selectedIndex + 1 should match correctAnswerId
        isCorrect = (sampleSelectedAnswer + 1) === sampleCurrentQuestion.correctAnswerId;
      }

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
      const qList = customQuestions && customQuestions.length > 0 ? customQuestions : fallbackQuestions;
      const isLastQuestion = sampleQuestionIndex >= qList.length - 1;

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
  }, [effectiveSampleMode, sampleQuestionIndex, mascotStep, playFinishGame, finish, apiHandleContinue, customQuestions]);

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

  return {
    // State
    questions: effectiveQuestions,
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

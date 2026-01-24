import { useState, useCallback, useEffect, useMemo } from "react";
import { useGameAPI } from "usegamigameapi";
import { gameConfig } from "@/config/gameConfig";
import { useGameAudio } from "@/hooks/useGameAudio";
import { EnvelopeState } from "@/components/game/LuckyEnvelopes";
import { fallbackQuestions } from "@/data/questions";

const MAX_POSITION = 5;
const FIXED_TOTAL = gameConfig.fixedTotalQuestions; // Always 5
const API_TIMEOUT_MS = 5000; // Fallback to sample after 5s if no API response

// Check sample mode immediately (not in useEffect)
function checkSampleModeImmediate(): boolean {
  if (typeof window === 'undefined') return true;
  const urlParams = new URLSearchParams(window.location.search);
  const sampleParam = urlParams.get('sample');
  // Default to API (false) unless sample=true
  return sampleParam === 'true';
}

export interface Answer {
  id: number;
  content: string;
}

export interface GameState {
  questions: any[];
  isLoading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  selectedAnswer: Answer | null; // Changed to object
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
    answers: Answer[]; // Changed to Answer objects
    correctIndex: number; // Index in the answers array // kept for compatibility if needed, but we rely on IDs
    correctAnswerId?: number;
  } | undefined;
  isLastQuestion: boolean;
  correctCount: number;
  totalQuestions: number;

  // Variables from usegamigameapi example
  quiz: any;
  currentResult: any;
  answers: (boolean | null)[]; // History
  isSubmitting: boolean;
  hasSubmitted: boolean;
  isCompleted: boolean;
}

export interface GameActions {
  handleAnswerSelect: (answer: Answer) => void; // Changed to accept object
  handleSubmit: () => void; // Mapped to updateAnswer
  handleContinue: () => void;
  handleRestart: () => void;
  updateAnswer: () => void; // Expose original name too
  finish: () => void;
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

  // Sample mode state - initialized immediately
  const [useSampleMode, setUseSampleMode] = useState(() => {
    if (customQuestions && customQuestions.length > 0) return true;
    return checkSampleModeImmediate();
  });

  // Track if we've timed out waiting for API
  const [apiTimedOut, setApiTimedOut] = useState(false);

  // --- Sample Mode Local State ---
  const [sampleQuestionIndex, setSampleQuestionIndex] = useState(0);
  const [sampleSelectedAnswer, setSampleSelectedAnswer] = useState<Answer | null>(null);
  const [sampleIsSubmitting, setSampleIsSubmitting] = useState(false);
  const [sampleHasSubmitted, setSampleHasSubmitted] = useState(false);
  const [sampleAnswers, setSampleAnswers] = useState<(boolean | null)[]>([]);
  const [sampleIsCompleted, setSampleIsCompleted] = useState(false);
  const [sampleCurrentResult, setSampleCurrentResult] = useState<any>(null); // To match API structure

  // Use the useGameAPI hook exactly as per documentation
  const {
    quiz,
    currentResult,
    answers,
    correctCount: apiCorrectCount,
    currentQuestionIndex: apiCurrentQuestionIndex,
    selectedAnswer: apiSelectedAnswer, // Get selected answer from API hook
    isSubmitting: apiIsSubmitting,
    hasSubmitted: apiHasSubmitted,
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

  // Determine effective questions source (only for Sample Mode reference/Total calc)
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

  // Determine effective sample mode
  const effectiveSampleMode = useSampleMode || apiTimedOut || (!!customQuestions && customQuestions.length > 0);

  // --- Unified State ---

  const isLoading = effectiveSampleMode ? false : (!quiz && !apiIsCompleted);
  const currentQuestionIndex = effectiveSampleMode ? sampleQuestionIndex : apiCurrentQuestionIndex;
  const isSubmitting = effectiveSampleMode ? sampleIsSubmitting : apiIsSubmitting;
  const hasSubmitted = effectiveSampleMode ? sampleHasSubmitted : apiHasSubmitted;
  const isCompleted = effectiveSampleMode ? sampleIsCompleted : apiIsCompleted;
  const displaySelectedAnswer = effectiveSampleMode ? sampleSelectedAnswer : ((apiSelectedAnswer as unknown as Answer) || null);
  // apiSelectedAnswer type from library might need casting if generic defaults don't match exactly, 
  // but assuming library returns {id, content}

  // Total questions - fixed to max 5
  // Note: API might return more, but we limit display/logic to 5
  const totalQuestions = Math.min(effectiveQuestions.length > 0 ? effectiveQuestions.length : FIXED_TOTAL, FIXED_TOTAL);

  // Calculate correct count
  const sampleCorrectCount = useMemo(() => sampleAnswers.filter(a => a === true).length, [sampleAnswers]);
  const correctCount = effectiveSampleMode ? sampleCorrectCount : apiCorrectCount;
  const effectiveAnswers = effectiveSampleMode ? sampleAnswers : answers;

  // Build scoreState for envelope display
  const scoreState: EnvelopeState[] = useMemo(() => {
    const total = Math.min(effectiveQuestions.length || FIXED_TOTAL, FIXED_TOTAL);
    const state: EnvelopeState[] = Array(total).fill("pending");

    effectiveAnswers.forEach((answer, idx) => {
      if (idx < total) {
        if (answer === true) state[idx] = "correct";
        else if (answer === false) state[idx] = "wrong";
      }
    });

    return state;
  }, [effectiveAnswers, effectiveQuestions.length]);

  // Sample mode current question
  const sampleCurrentQuestion = useMemo(() => {
    if (!effectiveSampleMode) return undefined;
    const questions = customQuestions && customQuestions.length > 0 ? customQuestions : fallbackQuestions;
    return questions[sampleQuestionIndex];
  }, [effectiveSampleMode, sampleQuestionIndex, customQuestions]);

  // Transform quiz data to match unified interface
  const currentQuestion = useMemo(() => {
    if (effectiveSampleMode) {
      if (!sampleCurrentQuestion) return undefined;

      const rawAnswers = sampleCurrentQuestion.answers || [];
      const answers: Answer[] = rawAnswers.map((a: any, idx: number) => {
        if (typeof a === 'string') return { id: idx + 1, content: a }; // Assign temp IDs if string
        return { id: a.id || idx + 1, content: a.content || a.option_value || a.text || '' };
      });

      return {
        id: sampleCurrentQuestion.id ?? sampleQuestionIndex + 1,
        question: sampleCurrentQuestion.question || sampleCurrentQuestion.text || '',
        imageUrl: sampleCurrentQuestion.imageUrl || sampleCurrentQuestion.audioUrl,
        answers: answers,
        correctIndex: sampleCurrentQuestion.correctIndex !== undefined ? sampleCurrentQuestion.correctIndex : -1, // Deprecated usage, use ID
        correctAnswerId: sampleCurrentQuestion.correctAnswerId ?? (sampleCurrentQuestion.correctIndex !== undefined ? sampleCurrentQuestion.correctIndex + 1 : undefined)
      };
    }

    if (!quiz) return undefined;

    // Null safety for API data
    const quizText = quiz.text ?? quiz.content ?? '';
    const quizAnswers = quiz.answers ?? [];
    const quizAudioUrl = quiz.audioUrl ?? quiz.audio_url;

    const transformedAnswers: Answer[] = quizAnswers.map((a: any, idx: number) => {
      if (typeof a === 'string') return { id: idx + 1, content: a };
      return {
        id: a.id || a.option_code || idx + 1, // Fallback ID
        content: a.content || a.text || a.option_value || ''
      };
    });

    // Determine correct index for UI helpers (optional)
    let correctIdx = 0;
    // We don't really know correct index upfront from API usually, unless provided
    // but the UI relies on 'correctIndex' in some places. 
    // Ideally we shouldn't peek, but for 'show correct answer' after submit:
    if (currentResult?.correctAnswerId) {
      correctIdx = transformedAnswers.findIndex(a => a.id === currentResult.correctAnswerId);
    }

    return {
      id: quiz.id ?? currentQuestionIndex + 1,
      question: quizText,
      imageUrl: quizAudioUrl, // Keep for compatibility
      answers: transformedAnswers,
      correctIndex: correctIdx,
      correctAnswerId: currentResult?.correctAnswerId
    };
  }, [effectiveSampleMode, sampleCurrentQuestion, sampleQuestionIndex, quiz, currentQuestionIndex, currentResult]);

  // --- ACTIONS ---

  const handleAnswerSelect = useCallback((answer: Answer) => {
    if (hasSubmitted || isSubmitting) return;
    playButtonClick();

    if (effectiveSampleMode) {
      setSampleSelectedAnswer(answer);
    } else {
      apiHandleAnswerSelect(answer);
    }
  }, [hasSubmitted, isSubmitting, effectiveSampleMode, apiHandleAnswerSelect, playButtonClick]);

  const handleSubmit = useCallback(() => {
    if (effectiveSampleMode) {
      if (!sampleSelectedAnswer || !sampleCurrentQuestion || sampleHasSubmitted) return;
      setSampleIsSubmitting(true);

      // Determine correctness
      let isCorrect = false;
      // Compare by ID preferably
      if (sampleCurrentQuestion.correctAnswerId !== undefined) {
        isCorrect = sampleSelectedAnswer.id === sampleCurrentQuestion.correctAnswerId;
      } else if (sampleCurrentQuestion.correctIndex !== undefined) {
        // If using index based, we assume IDs were generating 1-based or matching index
        // But safer to assume sample data has IDs.
        // If sample data answers are strings, we generated IDs 1,2,3...
        isCorrect = sampleSelectedAnswer.id === (sampleCurrentQuestion.correctIndex + 1);
      }

      // Simulate network delay
      setTimeout(() => {
        setSampleIsSubmitting(false);
        setSampleHasSubmitted(true);
        setSampleCurrentResult({
          isCorrect,
          isLastQuestion: sampleQuestionIndex >= FIXED_TOTAL - 1, // Limit to 5
          correctAnswerId: sampleCurrentQuestion.correctAnswerId
        });

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
      }, 500);

    } else {
      updateAnswer(); // This calls api updateAnswer
    }
  }, [effectiveSampleMode, sampleSelectedAnswer, sampleCurrentQuestion, sampleHasSubmitted, sampleQuestionIndex, updateAnswer, playCorrectAnswer, playWrongAnswer]);

  const handleContinue = useCallback(() => {
    if (effectiveSampleMode) {
      const qList = customQuestions && customQuestions.length > 0 ? customQuestions : fallbackQuestions;
      const limit = Math.min(qList.length, FIXED_TOTAL);
      const isLastQuestion = sampleQuestionIndex >= limit - 1;

      if (mascotStep >= MAX_POSITION || isLastQuestion) {
        playFinishGame();
        setReachedFinish(mascotStep >= MAX_POSITION);
        setSampleIsCompleted(true);
        return;
      }

      setSampleQuestionIndex(prev => prev + 1);
      setSampleSelectedAnswer(null);
      setSampleHasSubmitted(false);
      setSampleCurrentResult(null);
    } else {
      // API Mode
      if (mascotStep >= MAX_POSITION) {
        playFinishGame();
        setReachedFinish(true);
        finish(); // Signal finish
        return;
      }
      apiHandleContinue();
    }
  }, [effectiveSampleMode, sampleQuestionIndex, mascotStep, playFinishGame, finish, apiHandleContinue, customQuestions]);

  const handleRestart = useCallback(() => {
    setMascotStep(0);
    setIsMascotMoving(false);
    setReachedFinish(false);

    if (effectiveSampleMode) {
      setSampleQuestionIndex(0);
      setSampleSelectedAnswer(null);
      setSampleHasSubmitted(false);
      setSampleIsSubmitting(false);
      setSampleAnswers([]);
      setSampleIsCompleted(false);
      setSampleCurrentResult(null);
    } else {
      window.location.reload();
    }
  }, [effectiveSampleMode]);

  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  return {
    // State
    questions: effectiveQuestions,
    isLoading,
    error: null,
    currentQuestionIndex,
    selectedAnswer: displaySelectedAnswer,
    isAnswered: hasSubmitted, // For compatibility
    scoreState,
    mascotStep,
    isMascotMoving,
    gameComplete: isCompleted,
    reachedFinish,
    currentQuestion,
    isLastQuestion,
    correctCount,
    totalQuestions,

    // Example Variables
    quiz,
    currentResult: effectiveSampleMode ? sampleCurrentResult : currentResult,
    answers: effectiveAnswers,
    isSubmitting,
    hasSubmitted,
    isCompleted,

    // Actions
    handleAnswerSelect,
    handleSubmit,
    updateAnswer: handleSubmit, // Alias
    handleContinue,
    handleRestart,
    finish
  };
}

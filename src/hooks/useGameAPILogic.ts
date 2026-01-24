import { useState, useCallback, useEffect, useMemo } from "react";
import { useGameAPI } from "usegamigameapi";
import { gameConfig } from "@/config/gameConfig";
import { useGameAudio } from "@/hooks/useGameAudio";
import { EnvelopeState } from "@/components/game/LuckyEnvelopes";
import { fallbackQuestions } from "@/data/questions";

const MAX_POSITION = 5;
const FIXED_TOTAL = gameConfig.fixedTotalQuestions; // Always 5

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

    answers: any[];
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


export function useGameAPILogic(customQuestions?: any[] | null): GameState & GameActions {
  const { playButtonClick, playCorrectAnswer, playWrongAnswer, playFinishGame } = useGameAudio();

  // --- UI/Animation State ---
  const [mascotStep, setMascotStep] = useState(0);
  const [isMascotMoving, setIsMascotMoving] = useState(false);
  const [reachedFinish, setReachedFinish] = useState(false);

  // --- Strategy Determination ---
  const isSampleMode = useMemo(() => {
    // Priority 1: Custom questions passed in (from URL loading in Index.tsx)
    if (customQuestions && customQuestions.length > 0) return true;

    // Priority 2: Query param ?sample=true
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('sample') === 'true';
    }

    return false;
  }, [customQuestions]);

  // --- Real API Hook ---
  // Always call hooks at top level
  const apiGame = useGameAPI({
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

  // --- Sample Mode Simulation State ---
  const [sampleIndex, setSampleIndex] = useState(0);
  const [sampleSelectedAnswer, setSampleSelectedAnswer] = useState<any | null>(null); // Store entire answer object for sample
  const [sampleAnswers, setSampleAnswers] = useState<(boolean | null)[]>([]); // Track correct/wrong history
  const [sampleIsAnswered, setSampleIsAnswered] = useState(false);
  const [sampleIsCompleted, setSampleIsCompleted] = useState(false);
  // Sample result simulation
  const [sampleCurrentResult, setSampleCurrentResult] = useState<{ isCorrect: boolean; correctAnswerId?: number } | null>(null);

  // --- Effective Data Selector ---
  // Select either API data or Sample data based on isSampleMode

  const effectiveQuestionsRaw = useMemo(() => {
    if (isSampleMode) {
      if (customQuestions && customQuestions.length > 0) return customQuestions;
      return fallbackQuestions;
    }
    return apiGame.quiz ? [apiGame.quiz] : []; // In API mode, we only know the current question usually, or previous ones.
  }, [isSampleMode, customQuestions, apiGame.quiz]);

  const rawCurrentQuestion = useMemo(() => {
    if (isSampleMode) {
      return effectiveQuestionsRaw[sampleIndex];
    }
    return apiGame.quiz;
  }, [isSampleMode, effectiveQuestionsRaw, sampleIndex, apiGame.quiz]);

  // --- Derived State for UI ---

  // 1. Current Question Data
  const currentQuestion = useMemo(() => {
    if (!rawCurrentQuestion) return undefined;

    const quizText = rawCurrentQuestion.text || rawCurrentQuestion.content || rawCurrentQuestion.question || '';
    const quizAudioUrl = rawCurrentQuestion.audioUrl || rawCurrentQuestion.audio_url || rawCurrentQuestion.imageUrl; // fallback map

    // Normalize answers
    const rawAnswers = rawCurrentQuestion.answers || rawCurrentQuestion.quiz_possible_options || [];
    const normalizedAnswers = rawAnswers.map((a: any, idx: number) => {
      // If answer is string, wrap it. If it's object, ensure id and content.
      if (typeof a === 'string') return { id: idx + 1, content: a };

      // Ensure ID exists. Some APIs imply A=1, B=2. Sample data might have IDs.
      // Index.tsx map logic uses 1,2,3,4.
      return {
        id: a.id || idx + 1,
        content: a.content || a.text || a.option_value || ''
      };
    });

    // Determine Correct Index for UI highlighting
    // This is TRICKY. We need to match the 'correctAnswerId' from result/question to the index in answers array.
    let correctIdx = -1;

    const relevantResult = isSampleMode ? sampleCurrentResult : apiGame.currentResult;
    const selectedObj = isSampleMode ? sampleSelectedAnswer : apiGame.selectedAnswer;

    // Logic: 
    // 1. If we have a result and it says "Correct", then the selected answer IS the correct answer.
    // This fixes the bug where "Correct" audio plays but UI highlights wrong answer (default 0).
    if (relevantResult?.isCorrect && selectedObj) {
      correctIdx = normalizedAnswers.findIndex((a: any) =>
        String(a.id) === String(selectedObj.id) ||
        a.content === selectedObj.content
      );
    }

    // 2. If we didn't find it yet (or answer was wrong/not submitted), check for explicit Correct ID
    if (correctIdx === -1) {
      let targetCorrectId: any = undefined;

      if (relevantResult?.correctAnswerId) {
        targetCorrectId = relevantResult.correctAnswerId;
      } else if (rawCurrentQuestion.correctAnswerId !== undefined) {
        targetCorrectId = rawCurrentQuestion.correctAnswerId;
      } else if (rawCurrentQuestion.correctIndex !== undefined) {
        targetCorrectId = rawCurrentQuestion.correctIndex;
      }

      if (targetCorrectId !== undefined) {
        // Find index of answer with this ID
        correctIdx = normalizedAnswers.findIndex((a: any) =>
          String(a.id) === String(targetCorrectId) ||
          a.content === targetCorrectId
        );

        // If still not found, and targetCorrectId is small integer, maybe it IS the index?
        if (correctIdx === -1 && typeof targetCorrectId === 'number' && targetCorrectId < normalizedAnswers.length) {
          correctIdx = targetCorrectId;
        }
      }
    }

    // if (correctIdx < 0) correctIdx = 0; // REMOVED: Do not default to 0 (A) if unknown. User says "óc chó".

    return {
      id: rawCurrentQuestion.id || rawCurrentQuestion.quiz_code || 0,
      question: quizText,
      imageUrl: quizAudioUrl,
      answers: normalizedAnswers.map((a: any) => a.content),
      correctIndex: correctIdx,
      _rawAnswers: normalizedAnswers // Keep raw for ID lookup
    };
  }, [rawCurrentQuestion, isSampleMode, sampleCurrentResult, apiGame.currentResult, sampleSelectedAnswer, apiGame.selectedAnswer]);


  // 2. Status Flags
  const isLoading = isSampleMode ? !rawCurrentQuestion : (!apiGame.quiz && !apiGame.isCompleted);
  const isAnswered = isSampleMode ? sampleIsAnswered : apiGame.hasSubmitted;
  const isCompleted = isSampleMode ? sampleIsCompleted : apiGame.isCompleted;
  const currentIdx = isSampleMode ? sampleIndex : apiGame.currentQuestionIndex;

  // Total questions is fixed to 5 for UI consistency
  const totalQuestions = FIXED_TOTAL;

  const correctCount = isSampleMode
    ? sampleAnswers.filter(Boolean).length
    : apiGame.correctCount;

  // 3. Score State (Envelopes)
  const scoreState: EnvelopeState[] = useMemo(() => {
    // Current answers history
    const history = isSampleMode ? sampleAnswers : apiGame.answers;

    const state: EnvelopeState[] = Array(FIXED_TOTAL).fill("pending");
    history.forEach((res, idx) => {
      if (idx < FIXED_TOTAL) {
        if (res === true) state[idx] = "correct";
        else if (res === false) state[idx] = "wrong";
      }
    });
    return state;
  }, [isSampleMode, sampleAnswers, apiGame.answers]);

  // 4. Selected Answer Index (for UI)
  const selectedAnswerIdx = useMemo(() => {
    const selected = isSampleMode ? sampleSelectedAnswer : apiGame.selectedAnswer;
    if (!selected) return null;

    // Find index in currentQuestion answers
    if (currentQuestion?._rawAnswers) {
      return currentQuestion._rawAnswers.findIndex((a: any) => a.id === selected.id);
    }
    return null;
  }, [isSampleMode, sampleSelectedAnswer, apiGame.selectedAnswer, currentQuestion]);


  // --- Actions ---

  const handleAnswerSelect = useCallback((index: number) => {
    if (isAnswered) return;
    playButtonClick();

    // Reconstruct answer object from currentQuestion
    const answerObj = currentQuestion?._rawAnswers?.[index];
    if (!answerObj) return;

    if (isSampleMode) {
      setSampleSelectedAnswer(answerObj);
    } else {
      apiGame.handleAnswerSelect(answerObj);
    }
  }, [isAnswered, isSampleMode, currentQuestion, apiGame, playButtonClick]);

  const handleSubmit = useCallback(() => {
    if (isSampleMode) {
      if (!sampleSelectedAnswer || !rawCurrentQuestion) return;

      // --- Sample Logic Validation ---
      // Compare sampleSelectedAnswer.id with rawCurrentQuestion.correctAnswerId
      // Assuming mapping is consistent (A=1, B=2...)
      const correctId = rawCurrentQuestion.correctAnswerId || rawCurrentQuestion.correctIndex;

      // Flexible comparison
      const isCorrect = String(sampleSelectedAnswer.id) === String(correctId);

      // Update History
      setSampleAnswers(prev => {
        const next = [...prev];
        next[sampleIndex] = isCorrect;
        return next;
      });

      setSampleCurrentResult({ isCorrect, correctAnswerId: correctId });
      setSampleIsAnswered(true);

      if (isCorrect) {
        console.log(`Question ${sampleIndex + 1} answered correctly!`);
        playCorrectAnswer();
        setIsMascotMoving(true);
        setMascotStep(prev => Math.min(prev + 1, MAX_POSITION));
        setTimeout(() => setIsMascotMoving(false), 1600);
      } else {
        console.log('Incorrect answer');
        playWrongAnswer();
      }

    } else {
      // API Mode
      apiGame.updateAnswer();
    }
  }, [isSampleMode, sampleSelectedAnswer, rawCurrentQuestion, sampleIndex, apiGame, playCorrectAnswer, playWrongAnswer]);

  const handleContinue = useCallback(() => {
    // Shared stopping logic
    const nextIdx = isSampleMode ? sampleIndex + 1 : apiGame.currentQuestionIndex + 1;
    const shouldStop = nextIdx >= FIXED_TOTAL || mascotStep >= MAX_POSITION;

    if (shouldStop) {
      playFinishGame();
      setReachedFinish(mascotStep >= MAX_POSITION);
      if (isSampleMode) {
        setSampleIsCompleted(true);
      } else {
        apiGame.finish();
      }
      return;
    }

    if (isSampleMode) {
      // Sample Mode Navigation
      // Check if we run out of sample data?
      if (effectiveQuestionsRaw.length <= nextIdx) {
        // Out of data, must stop
        setSampleIsCompleted(true);
        return;
      }

      setSampleIndex(nextIdx);
      setSampleSelectedAnswer(null);
      setSampleIsAnswered(false);
      setSampleCurrentResult(null);
    } else {
      // API Mode Navigation
      apiGame.handleContinue();
    }
  }, [isSampleMode, sampleIndex, apiGame, mascotStep, playFinishGame, effectiveQuestionsRaw]);

  const handleRestart = useCallback(() => {
    // Basic UI reset
    setMascotStep(0);
    setIsMascotMoving(false);
    setReachedFinish(false);

    if (isSampleMode) {
      setSampleIndex(0);
      setSampleSelectedAnswer(null);
      setSampleIsAnswered(false);
      setSampleAnswers([]);
      setSampleIsCompleted(false);
      setSampleCurrentResult(null);
    } else {
      // Ideally finish/reset API. Reload is safest default to clear iframe state.
      window.location.reload();
    }
  }, [isSampleMode]);


  return {
    questions: isSampleMode ? effectiveQuestionsRaw : (apiGame.quiz ? [apiGame.quiz] : []), // Compat
    isLoading,
    error: null,
    currentQuestionIndex: currentIdx,
    selectedAnswer: selectedAnswerIdx,
    isAnswered,
    scoreState,
    mascotStep,
    isMascotMoving,
    gameComplete: isCompleted,
    reachedFinish,
    currentQuestion,
    isLastQuestion: currentIdx >= FIXED_TOTAL - 1,
    correctCount,
    totalQuestions,
    handleAnswerSelect,
    handleSubmit,
    handleContinue,
    handleRestart
  };
}

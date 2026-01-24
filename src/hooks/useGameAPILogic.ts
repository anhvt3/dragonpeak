import { useState, useCallback, useEffect, useMemo } from "react";
import { useGameAPI } from "usegamigameapi";
import { gameConfig } from "@/config/gameConfig";
import { useGameAudio } from "@/hooks/useGameAudio";
import { EnvelopeState } from "@/components/game/LuckyEnvelopes";
import { fallbackQuestions } from "@/data/questions";

const MAX_POSITION = 5;
const FIXED_TOTAL = gameConfig.fixedTotalQuestions;

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

  const [mascotStep, setMascotStep] = useState(0);
  const [isMascotMoving, setIsMascotMoving] = useState(false);
  const [reachedFinish, setReachedFinish] = useState(false);

  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);

  const [useSampleMode, setUseSampleMode] = useState(() => {
    if (customQuestions && customQuestions.length > 0) return true;
    if (typeof window === 'undefined') return true;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sample') === 'true';
  });

  const [sampleQuestionIndex, setSampleQuestionIndex] = useState(0);
  const [sampleSelectedAnswer, setSampleSelectedAnswer] = useState<number | null>(null);
  const [sampleIsAnswered, setSampleIsAnswered] = useState(false);
  const [sampleAnswers, setSampleAnswers] = useState<(boolean | null)[]>([]);
  const [sampleIsCompleted, setSampleIsCompleted] = useState(false);
  const [sampleCorrectCount, setSampleCorrectCount] = useState(0);

  const {
    quiz,
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
      playCorrectAnswer();
      setIsMascotMoving(true);
      setMascotStep(prev => Math.min(prev + 1, MAX_POSITION));
      setTimeout(() => setIsMascotMoving(false), 1600);
    },
    onAnswerIncorrect: () => {
      playWrongAnswer();
    }
  });

  const effectiveQuestions = useMemo(() => {
    if (customQuestions && customQuestions.length > 0) return customQuestions;
    return fallbackQuestions;
  }, [customQuestions]);

  useEffect(() => {
    if (customQuestions && customQuestions.length > 0) {
      setUseSampleMode(true);
    }
  }, [customQuestions]);

  const sampleCurrentQuestion = useMemo(() => {
    if (!useSampleMode && !customQuestions) return undefined;
    const questions = customQuestions && customQuestions.length > 0 ? customQuestions : fallbackQuestions;
    return questions[sampleQuestionIndex];
  }, [useSampleMode, sampleQuestionIndex, customQuestions]);

  const effectiveSampleMode = useSampleMode || (!!customQuestions && customQuestions.length > 0);

  const isLoading = effectiveSampleMode ? false : (!quiz && !apiIsCompleted);
  const currentQuestionIndex = effectiveSampleMode ? sampleQuestionIndex : apiCurrentQuestionIndex;
  const isAnswered = effectiveSampleMode ? sampleIsAnswered : hasSubmitted;
  const isCompleted = effectiveSampleMode ? sampleIsCompleted : apiIsCompleted;

  const totalQuestions = Math.min(effectiveQuestions.length > 0 ? effectiveQuestions.length : FIXED_TOTAL, FIXED_TOTAL);
  const correctCount = effectiveSampleMode ? sampleCorrectCount : apiCorrectCount;

  const scoreState: EnvelopeState[] = useMemo(() => {
    const questionsLength = effectiveQuestions.length > 0 ? effectiveQuestions.length : FIXED_TOTAL;
    const total = Math.min(questionsLength, FIXED_TOTAL);
    const state: EnvelopeState[] = Array(total).fill("pending");

    const answerList = effectiveSampleMode ? sampleAnswers : answers;

    answerList.forEach((answer, idx) => {
      if (idx < total) {
        if (answer === true) state[idx] = "correct";
        else if (answer === false) state[idx] = "wrong";
      }
    });

    return state;
  }, [effectiveSampleMode, sampleAnswers, answers, effectiveQuestions]);

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

    const quizText = quiz.text ?? quiz.content ?? '';
    const quizAnswers = quiz.answers ?? [];
    const quizAudioUrl = quiz.audioUrl ?? quiz.audio_url;

    const transformedAnswers = quizAnswers.map((a: any) => {
      if (typeof a === 'string') return a;
      return a?.content ?? a?.text ?? a?.option_value ?? '';
    });

    let correctIdx = 0;
    if (currentResult?.correctAnswerId) {
      if (typeof currentResult.correctAnswerId === 'number') {
        correctIdx = currentResult.correctAnswerId - 1;
      } else {
        correctIdx = quizAnswers.findIndex((a: any) =>
          a?.id === currentResult.correctAnswerId ||
          a?.option_code === currentResult.correctAnswerId
        );
      }
      if (correctIdx < 0) correctIdx = 0;
    }

    return {
      id: quiz.id ?? currentQuestionIndex + 1,
      question: quizText,
      imageUrl: quizAudioUrl,
      answers: transformedAnswers,
      correctIndex: correctIdx,
    };
  }, [effectiveSampleMode, sampleCurrentQuestion, sampleQuestionIndex, quiz, currentQuestionIndex, currentResult]);

  const handleAnswerSelect = useCallback((index: number) => {
    if (isAnswered) return;
    playButtonClick();

    if (effectiveSampleMode) {
      setSampleSelectedAnswer(index);
    } else {
      setLocalSelectedIndex(index);
      const answerObj = quiz?.answers?.[index];
      if (answerObj) {
        apiHandleAnswerSelect(answerObj);
      }
    }
  }, [isAnswered, effectiveSampleMode, quiz, apiHandleAnswerSelect, playButtonClick]);

  const handleSubmit = useCallback(() => {
    if (effectiveSampleMode) {
      if (sampleSelectedAnswer === null || !sampleCurrentQuestion) return;

      let isCorrect = false;
      if (sampleCurrentQuestion.correctIndex !== undefined) {
        isCorrect = sampleSelectedAnswer === sampleCurrentQuestion.correctIndex;
      } else if (sampleCurrentQuestion.correctAnswerId !== undefined) {
        isCorrect = (sampleSelectedAnswer + 1) === sampleCurrentQuestion.correctAnswerId;
      }

      setSampleAnswers(prev => {
        const newAnswers = [...prev];
        return [...newAnswers, isCorrect];
      });

      if (isCorrect) {
        setSampleCorrectCount(prev => prev + 1);
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
      setSampleIsAnswered(false);
    } else {
      const limit = Math.min(effectiveQuestions.length > 0 ? effectiveQuestions.length : FIXED_TOTAL, FIXED_TOTAL);

      if (mascotStep >= MAX_POSITION || apiCurrentQuestionIndex >= limit - 1) {
        playFinishGame();
        setReachedFinish(true);
        finish();
        return;
      }

      apiHandleContinue();
      setLocalSelectedIndex(null);
    }
  }, [effectiveSampleMode, sampleQuestionIndex, mascotStep, playFinishGame, finish, apiHandleContinue, customQuestions, apiCurrentQuestionIndex, effectiveQuestions]);

  const handleRestart = useCallback(() => {
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
      setSampleCorrectCount(0);
    } else {
      window.location.reload();
    }
  }, [effectiveSampleMode]);

  const displaySelectedAnswer = effectiveSampleMode ? sampleSelectedAnswer : localSelectedIndex;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  return {
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
    handleAnswerSelect,
    handleSubmit,
    handleContinue,
    handleRestart,
  };
}

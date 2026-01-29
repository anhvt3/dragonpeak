import { useCallback, useEffect, useRef, useState } from "react";

const ACTIONS = {
  SHOW_LO5: "SHOW_LO5",
  RETURN_LO5: "RETURN_LO5",
  UPDATE_ANSWER: "UPDATE_ANSWER",
  RETURN_UPDATE_ANSWER: "RETURN_UPDATE_ANSWER",
  FINISH: "FINISH"
} as const;

type AnswerOption = { id: number; content: string };

type UseGameAPIOptions = {
  onAnswerCorrect?: (params: { currentQuestionIndex: number; correctAnswerId?: number; incorrectAnswerId?: number }) => void;
  onAnswerIncorrect?: (params: { currentQuestionIndex: number; correctAnswerId?: number; incorrectAnswerId?: number }) => void;
};

const buildQuestionSignature = (payload: any) => {
  if (!payload) return "";
  const id = payload.id ?? payload.quiz_code ?? payload.quizCode ?? null;
  const text = payload.text ?? payload.content ?? payload.question ?? null;
  const answers = payload.answers ?? payload.quiz_possible_options ?? null;
  return JSON.stringify({ id, text, answers });
};

const postToParent = (type: string, payload: any = {}) => {
  if (window.parent) {
    window.parent.postMessage({ type, payload }, "*");
  }
};

export function useGameAPIEnhanced({ onAnswerCorrect, onAnswerIncorrect }: UseGameAPIOptions = {}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionIndexRef = useRef(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const isLastQuestionRef = useRef(false);
  const awaitingQuestionRef = useRef(false);
  const lastQuestionSignatureRef = useRef("");
  const hasSubmittedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const pendingExternalAdvanceRef = useRef(false);

  const onAnswerCorrectRef = useRef(onAnswerCorrect);
  const onAnswerIncorrectRef = useRef(onAnswerIncorrect);

  useEffect(() => {
    hasSubmittedRef.current = hasSubmitted;
  }, [hasSubmitted]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    onAnswerCorrectRef.current = onAnswerCorrect;
  }, [onAnswerCorrect]);

  useEffect(() => {
    onAnswerIncorrectRef.current = onAnswerIncorrect;
  }, [onAnswerIncorrect]);

  const forceAdvance = useCallback(() => {
    const nextIndex = currentQuestionIndexRef.current + 1;
    currentQuestionIndexRef.current = nextIndex;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setIsSubmitting(false);
    isSubmittingRef.current = false;
    setHasSubmitted(false);
    hasSubmittedRef.current = false;
    setCurrentResult(null);
    pendingExternalAdvanceRef.current = false;
  }, []);

  const finish = useCallback(() => {
    postToParent(ACTIONS.FINISH);
  }, []);

  const updateAnswer = useCallback(async () => {
    if (!selectedAnswer || isSubmitting) {
      return;
    }
    postToParent(ACTIONS.UPDATE_ANSWER, selectedAnswer.id);
    setIsSubmitting(true);
    isSubmittingRef.current = true;
    setHasSubmitted(true);
    hasSubmittedRef.current = true;
    return Promise.resolve();
  }, [selectedAnswer, isSubmitting]);

  const handleContinue = useCallback(() => {
    if (!hasSubmitted) return;
    if (isLastQuestionRef.current) {
      setIsCompleted(true);
    } else {
      awaitingQuestionRef.current = true;
      postToParent(ACTIONS.SHOW_LO5);
      const nextIndex = currentQuestionIndexRef.current + 1;
      currentQuestionIndexRef.current = nextIndex;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      setHasSubmitted(false);
      hasSubmittedRef.current = false;
      setCurrentResult(null);
    }
  }, [hasSubmitted]);

  const handleAnswerSelect = useCallback(
    (answer: AnswerOption) => {
      if (!isSubmitting && !hasSubmitted) {
        setSelectedAnswer(answer);
      }
    },
    [isSubmitting, hasSubmitted]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === ACTIONS.RETURN_LO5) {
        const signature = buildQuestionSignature(payload);
        const isNewQuestion = signature !== lastQuestionSignatureRef.current;
        const shouldForceAdvance =
          isNewQuestion &&
          !awaitingQuestionRef.current &&
          hasSubmittedRef.current;

        if (shouldForceAdvance) {
          if (isSubmittingRef.current) {
            pendingExternalAdvanceRef.current = true;
          } else {
            forceAdvance();
          }
        }

        lastQuestionSignatureRef.current = signature;
        awaitingQuestionRef.current = false;
        setQuiz(payload);
        return;
      }

      if (type === ACTIONS.RETURN_UPDATE_ANSWER) {
        const isCorrect = payload?.isCorrect === true;
        const isLast = payload?.isLastQuestion === true;
        isLastQuestionRef.current = isLast;

        setAnswers((prevAnswers) => {
          const next = [...prevAnswers];
          next[currentQuestionIndexRef.current] = isCorrect;
          return next;
        });

        if (isCorrect) {
          setCorrectCount((prev) => prev + 1);
          onAnswerCorrectRef.current?.({
            currentQuestionIndex: currentQuestionIndexRef.current,
            correctAnswerId: payload?.correctAnswerId,
            incorrectAnswerId: payload?.incorrectAnswerId
          });
        } else {
          onAnswerIncorrectRef.current?.({
            currentQuestionIndex: currentQuestionIndexRef.current,
            correctAnswerId: payload?.correctAnswerId,
            incorrectAnswerId: payload?.incorrectAnswerId
          });
        }

        setIsSubmitting(false);
        isSubmittingRef.current = false;
        setCurrentResult(payload);

        if (pendingExternalAdvanceRef.current) {
          forceAdvance();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    postToParent(ACTIONS.SHOW_LO5);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [forceAdvance]);

  return {
    quiz,
    currentResult,
    answers,
    correctCount,
    currentQuestionIndex,
    selectedAnswer,
    isSubmitting,
    hasSubmitted,
    isCompleted,
    handleAnswerSelect,
    updateAnswer,
    handleContinue,
    finish
  };
}

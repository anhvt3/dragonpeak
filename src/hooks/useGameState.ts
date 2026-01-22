import { useState, useCallback, useEffect } from "react";
import { Question, loadQuestionsFromApi, fallbackQuestions } from "@/data/questions";
import { gameConfig } from "@/config/gameConfig";
import { useGameAudio } from "@/hooks/useGameAudio";
import { EnvelopeState } from "@/components/game/shared/types";

const MAX_POSITION = 4;

export const useGameState = () => {
  const { playButtonClick, playCorrectAnswer, playWrongAnswer, playFinishGame } = useGameAudio();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreState, setScoreState] = useState<EnvelopeState[]>([]);
  const [mascotStep, setMascotStep] = useState(0);
  const [isMascotMoving, setIsMascotMoving] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [reachedFinish, setReachedFinish] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      
      // If using sample questions, load fallback directly
      if (gameConfig.useSampleQuestions) {
        setQuestions(fallbackQuestions);
        setScoreState(Array(fallbackQuestions.length).fill("pending"));
        setIsLoading(false);
        return;
      }

      try {
        const loadedQuestions = await loadQuestionsFromApi();
        setQuestions(loadedQuestions);
        setScoreState(Array(loadedQuestions.length).fill("pending"));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        setQuestions(fallbackQuestions);
        setScoreState(Array(fallbackQuestions.length).fill("pending"));
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = useCallback(
    (index: number) => {
      if (isAnswered) return;
      playButtonClick();
      setSelectedAnswer(index);
    },
    [isAnswered, playButtonClick],
  );

  const handleSubmit = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    const newScoreState = [...scoreState];
    newScoreState[currentQuestionIndex] = isCorrect ? "correct" : "wrong";
    setScoreState(newScoreState);

    if (isCorrect) {
      playCorrectAnswer();
      setIsMascotMoving(true);
      const newStep = mascotStep + 1;
      setMascotStep(newStep);
      setTimeout(() => setIsMascotMoving(false), 1600);
    } else {
      playWrongAnswer();
    }

    setIsAnswered(true);
  }, [selectedAnswer, currentQuestion, currentQuestionIndex, scoreState, mascotStep, playCorrectAnswer, playWrongAnswer]);

  const handleContinue = useCallback(() => {
    if (mascotStep >= MAX_POSITION) {
      playFinishGame();
      setReachedFinish(true);
      setGameComplete(true);
      return;
    }

    if (isLastQuestion) {
      playFinishGame();
      setReachedFinish(false);
      setGameComplete(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [isLastQuestion, mascotStep, playFinishGame]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScoreState(Array(questions.length).fill("pending"));
    setMascotStep(0);
    setGameComplete(false);
    setReachedFinish(false);
  }, [questions.length]);

  const correctCount = scoreState.filter((s) => s === "correct").length;

  return {
    // State
    questions,
    isLoading,
    error,
    currentQuestionIndex,
    selectedAnswer,
    isAnswered,
    scoreState,
    mascotStep,
    isMascotMoving,
    gameComplete,
    reachedFinish,
    
    // Computed
    currentQuestion,
    isLastQuestion,
    correctCount,
    
    // Handlers
    handleAnswerSelect,
    handleSubmit,
    handleContinue,
    handleRestart,
  };
};

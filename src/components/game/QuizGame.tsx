import { useState, useCallback, useEffect } from "react";
import { Question, loadQuestionsFromApi, fallbackQuestions } from "@/data/questions";
import { gameConfig } from "@/config/gameConfig";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useTheme } from "@/contexts/ThemeContext";
import LuckyEnvelopes, { EnvelopeState } from "./LuckyEnvelopes";
import QuestionPanel from "./QuestionPanel";
import AnswerButton from "./AnswerButton";
import SubmitButton from "./SubmitButton";
import BambooPath from "./BambooPath";
import GameComplete from "./GameComplete";

const MAX_POSITION = 4;

const QuizGame = () => {
  const { playButtonClick, playCorrectAnswer, playWrongAnswer, playFinishGame } = useGameAudio();
  const { assets } = useTheme();
  
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

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-no-repeat flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${assets.background})`, backgroundPosition: "center top" }}
      >
        <div className="text-2xl font-bold text-white drop-shadow-lg">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-no-repeat flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${assets.background})`, backgroundPosition: "center top" }}
      >
        <div className="text-xl font-bold text-red-500 drop-shadow-lg">Lỗi: {error}</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div
      className="game-container"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      <div className="min-h-screen w-full flex flex-col" style={{ paddingTop: '4cqw' }}>
        {!gameComplete && (
          <header className="flex justify-center" style={{ paddingBottom: '2cqw' }}>
            <LuckyEnvelopes scoreState={scoreState} currentIndex={currentQuestionIndex} />
          </header>
        )}

        <main className="flex-1 flex flex-col mx-auto w-full" style={{ padding: '0 2cqw 0.5cqw', maxWidth: '90cqw' }}>
          {gameComplete ? (
            <GameComplete 
              correctCount={correctCount} 
              totalQuestions={questions.length} 
              reachedFinish={reachedFinish}
              onRestart={handleRestart} 
            />
          ) : (
            <>
              <QuestionPanel
                question={currentQuestion.question}
                questionNumber={currentQuestionIndex + 1}
                imageUrl={currentQuestion.imageUrl}
              />

              <div className="answers-grid mx-auto" key={currentQuestionIndex}>
                {currentQuestion.answers.map((answer, index) => (
                  <AnswerButton
                    key={index}
                    answer={answer}
                    index={index}
                    isSelected={selectedAnswer === index}
                    isCorrect={selectedAnswer === index ? selectedAnswer === currentQuestion.correctIndex : null}
                    isDisabled={isAnswered}
                    isAnswered={isAnswered}
                    correctIndex={currentQuestion.correctIndex}
                    onClick={() => handleAnswerSelect(index)}
                  />
                ))}
              </div>

              <div className="flex justify-center" style={{ marginTop: '3cqw' }}>
                <SubmitButton
                  isAnswered={isAnswered}
                  isDisabled={selectedAnswer === null && !isAnswered}
                  onClick={isAnswered ? handleContinue : handleSubmit}
                />
              </div>

              <div style={{ marginTop: '1cqw' }}>
                <BambooPath mascotStep={mascotStep} isMoving={isMascotMoving} totalSteps={questions.length} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuizGame;

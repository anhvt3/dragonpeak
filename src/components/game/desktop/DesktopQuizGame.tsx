import { useGameState } from "@/hooks/useGameState";
import DesktopLuckyEnvelopes from "./DesktopLuckyEnvelopes";
import DesktopQuestionPanel from "./DesktopQuestionPanel";
import DesktopAnswerButton from "./DesktopAnswerButton";
import DesktopSubmitButton from "./DesktopSubmitButton";
import DesktopBambooPath from "./DesktopBambooPath";
import DesktopGameComplete from "./DesktopGameComplete";
import backgroundImg from "@/assets/desktop/bg.png";

const DesktopQuizGame = () => {
  const {
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
    currentQuestion,
    correctCount,
    handleAnswerSelect,
    handleSubmit,
    handleContinue,
    handleRestart,
  } = useGameState();

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="text-2xl font-bold text-white drop-shadow-lg">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
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
      className="min-h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {gameComplete ? (
        <DesktopGameComplete
          correctCount={correctCount}
          totalQuestions={questions.length}
          reachedFinish={reachedFinish}
          onRestart={handleRestart}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
          {/* Lucky Envelopes at top */}
          <header className="mb-6">
            <DesktopLuckyEnvelopes scoreState={scoreState} currentIndex={currentQuestionIndex} />
          </header>

          {/* Main game area */}
          <div className="flex items-start justify-center gap-8 w-full max-w-6xl">
            {/* Left side: Question + Answers */}
            <div className="flex-1 max-w-2xl">
              <DesktopQuestionPanel
                question={currentQuestion.question}
                questionNumber={currentQuestionIndex + 1}
                imageUrl={currentQuestion.imageUrl}
              />

              {/* Answers in 2x2 grid */}
              <div className="grid grid-cols-2 gap-4 mt-6" key={currentQuestionIndex}>
                {currentQuestion.answers.map((answer, index) => (
                  <DesktopAnswerButton
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

              {/* Submit button */}
              <div className="flex justify-center mt-8">
                <DesktopSubmitButton
                  isAnswered={isAnswered}
                  isDisabled={selectedAnswer === null && !isAnswered}
                  onClick={isAnswered ? handleContinue : handleSubmit}
                />
              </div>
            </div>

            {/* Right side: Bamboo Path */}
            <div className="w-80 flex-shrink-0">
              <DesktopBambooPath mascotStep={mascotStep} isMoving={isMascotMoving} totalSteps={questions.length} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopQuizGame;

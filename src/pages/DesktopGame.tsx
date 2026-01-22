import { useGameLogic } from "@/hooks/useGameLogic";
import { desktopAssets } from "@/config/desktopAssets";
import DesktopLuckyEnvelopes from "@/components/desktop/DesktopLuckyEnvelopes";
import DesktopQuestionPanel from "@/components/desktop/DesktopQuestionPanel";
import DesktopAnswerButton from "@/components/desktop/DesktopAnswerButton";
import DesktopSubmitButton from "@/components/desktop/DesktopSubmitButton";
import DesktopBambooPath from "@/components/desktop/DesktopBambooPath";
import DesktopGameComplete from "@/components/desktop/DesktopGameComplete";

const DesktopGame = () => {
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
  } = useGameLogic();

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${desktopAssets.background})` }}
      >
        <div className="text-3xl font-bold text-white drop-shadow-lg">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${desktopAssets.background})` }}
      >
        <div className="text-2xl font-bold text-red-500 drop-shadow-lg">Lỗi: {error}</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${desktopAssets.background})` }}
    >
      <div className="min-h-screen w-full flex flex-col pt-8">
        {!gameComplete && (
          <header className="flex justify-center pb-6">
            <DesktopLuckyEnvelopes scoreState={scoreState} currentIndex={currentQuestionIndex} />
          </header>
        )}

        <main className="flex-1 flex flex-col px-8 pb-4 max-w-[1000px] mx-auto w-full">
          {gameComplete ? (
            <DesktopGameComplete
              correctCount={correctCount}
              totalQuestions={questions.length}
              reachedFinish={reachedFinish}
              onRestart={handleRestart}
            />
          ) : (
            <>
              <DesktopQuestionPanel
                question={currentQuestion.question}
                questionNumber={currentQuestionIndex + 1}
                imageUrl={currentQuestion.imageUrl}
              />

              <div className="grid grid-cols-2 gap-4 w-full max-w-[900px] mx-auto mt-6" key={currentQuestionIndex}>
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

              <div className="flex justify-center mt-8">
                <DesktopSubmitButton
                  isAnswered={isAnswered}
                  isDisabled={selectedAnswer === null && !isAnswered}
                  onClick={isAnswered ? handleContinue : handleSubmit}
                />
              </div>

              <div className="mt-[-250px] pointers-event-none">
                <DesktopBambooPath mascotStep={mascotStep} isMoving={isMascotMoving} totalSteps={questions.length} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DesktopGame;

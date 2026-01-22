import { useGameLogic } from "@/hooks/useGameLogic";
import { mobileAssets } from "@/config/mobileAssets";
import MobileLuckyEnvelopes from "@/components/mobile/MobileLuckyEnvelopes";
import MobileQuestionPanel from "@/components/mobile/MobileQuestionPanel";
import MobileAnswerButton from "@/components/mobile/MobileAnswerButton";
import MobileSubmitButton from "@/components/mobile/MobileSubmitButton";
import MobileBambooPath from "@/components/mobile/MobileBambooPath";
import MobileGameComplete from "@/components/mobile/MobileGameComplete";

const MobileGame = () => {
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
        className="min-h-screen w-full bg-cover bg-no-repeat flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${mobileAssets.background})`, backgroundPosition: "center top" }}
      >
        <div className="text-2xl font-bold text-white drop-shadow-lg">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-no-repeat flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${mobileAssets.background})`, backgroundPosition: "center top" }}
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
      className="min-h-screen w-full bg-cover bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${mobileAssets.background})`, backgroundPosition: "center top" }}
    >
      <div className="min-h-screen w-full flex flex-col pt-8">
        {!gameComplete && (
          <header className="flex justify-center pb-4">
            <MobileLuckyEnvelopes scoreState={scoreState} currentIndex={currentQuestionIndex} />
          </header>
        )}

        <main className="flex-1 flex flex-col px-4 pb-1 max-w-[520px] mx-auto w-full">
          {gameComplete ? (
            <MobileGameComplete 
              correctCount={correctCount} 
              totalQuestions={questions.length} 
              reachedFinish={reachedFinish}
              onRestart={handleRestart} 
            />
          ) : (
            <>
              <MobileQuestionPanel
                question={currentQuestion.question}
                questionNumber={currentQuestionIndex + 1}
                imageUrl={currentQuestion.imageUrl}
              />

              <div className="flex flex-col gap-2 w-full px-4 mt-4" key={currentQuestionIndex}>
                {currentQuestion.answers.map((answer, index) => (
                  <MobileAnswerButton
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

              <div className="flex justify-center mt-6">
                <MobileSubmitButton
                  isAnswered={isAnswered}
                  isDisabled={selectedAnswer === null && !isAnswered}
                  onClick={isAnswered ? handleContinue : handleSubmit}
                />
              </div>

              <div className="mt-2">
                <MobileBambooPath mascotStep={mascotStep} isMoving={isMascotMoving} totalSteps={questions.length} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MobileGame;

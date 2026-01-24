import { useEffect, useState } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { mobileAssets } from '@/config/mobileAssets';
import { desktopAssets } from '@/config/desktopAssets';
import LuckyEnvelopes from '@/components/game/LuckyEnvelopes';
import QuestionPanel from '@/components/game/QuestionPanel';
import AnswerButton from '@/components/game/AnswerButton';
import SubmitButton from '@/components/game/SubmitButton';
import BambooPath from '@/components/game/BambooPath';
import GameComplete from '@/components/game/GameComplete';
import { ThemeProvider } from '@/contexts/ThemeContext';

type GameAssets = typeof desktopAssets | typeof mobileAssets;

const ASSETS = {
  pc: desktopAssets,
  mobile: mobileAssets,
};

const DragonPeakGame = () => {
  const [currentAssets, setCurrentAssets] = useState<GameAssets>(ASSETS.pc);
  const [isMobile, setIsMobile] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const learningObjectCode = urlParams.get('learning_object_code');

      if (learningObjectCode) {
        try {
          const response = await fetch(`https://ai-math.clevai.edu.vn/quiz/load-quizs?learning_object_code=${learningObjectCode}`);
          if (response.ok) {
            const data = await response.json();
             if (data.status && data.quizzes) {
                const fetchedQuestions = data.quizzes.map((quiz: any, index: number) => {
                    // Map options A,B,C,D to 1,2,3,4
                    const letterToId: {[key: string]: number} = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
                    
                    const answers = quiz.quiz_possible_options
                        .sort((a: any, b: any) => a.option_code.localeCompare(b.option_code))
                        .map((opt: any) => ({
                            id: letterToId[opt.option_code] || 0,
                            content: opt.option_value
                        }));
                    
                    return {
                        id: quiz.quiz_code || `Q_${index}`,
                        text: quiz.content,
                        answers: answers, // Array of objects
                        correctAnswerId: letterToId[quiz.quiz_answers.option_code] || 0,
                        audioUrl: null
                    };
                });
                setCustomQuestions(fetchedQuestions);
            }
          }
        } catch (error) {
          console.error("Failed to fetch questions:", error);
        }
      }
    };

    fetchQuestions();

    const handleResize = () => {
      const mobile = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setCurrentAssets(mobile ? ASSETS.mobile : ASSETS.pc);
      document.body.classList.toggle('is-mobile', mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const {
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
    totalQuestions,
    handleAnswerSelect,
    handleSubmit,
    handleContinue,
    handleRestart,
  } = useGameLogic(customQuestions);

  if (isLoading) {
    return (
      <div
        className="game-container"
        style={{ backgroundImage: `url(${currentAssets.background})` }}
      >
        <div className="min-h-screen w-full flex items-center justify-center">
          <div style={{ fontSize: '4cqw', fontWeight: 'bold', color: 'white', textShadow: '0 0.2cqw 0.5cqw rgba(0,0,0,0.5)' }}>
            Đang tải câu hỏi...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="game-container"
        style={{ backgroundImage: `url(${currentAssets.background})` }}
      >
        <div className="min-h-screen w-full flex items-center justify-center">
          <div style={{ fontSize: '3cqw', fontWeight: 'bold', color: '#ff4444', textShadow: '0 0.2cqw 0.5cqw rgba(0,0,0,0.5)' }}>
            Lỗi: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <ThemeProvider assets={currentAssets}>
      <div
        className="game-container"
        style={{ backgroundImage: `url(${currentAssets.background})` }}
      >
        <div className="min-h-full w-full flex flex-col relative overflow-y-auto overflow-x-hidden" style={{ paddingTop: '1.5cqw' }}>
          {!gameComplete && (
            <header className="flex justify-center" style={{ paddingBottom: '1.5cqw' }}>
              <LuckyEnvelopes scoreState={scoreState} currentIndex={currentQuestionIndex} />
            </header>
          )}

          <main className="flex-1 flex flex-col mx-auto w-full question-section">
            {gameComplete ? (
              <GameComplete 
                correctCount={correctCount} 
                totalQuestions={totalQuestions} 
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

                <div className="answers-grid" key={currentQuestionIndex}>
                  {currentQuestion.answers.map((answer, index) => {
                    const isSelected = selectedAnswer?.id === answer.id;
                    // Determine correctness for UI feedback
                    // If not answered, null.
                    // If answered, check if this specific answer is correct relative to the correct ID.
                    // Note: 'isCorrect' prop on AnswerButton is mostly for "if selected, shows red if wrong".
                    // The "green" for correct answer is handled by AnswerButton internal logic comparing index vs correctIndex.
                    
                    // We need to pass the correct index to AnswerButton so it can highlight the correct one.
                    // If correctIndex is -1 (not found), we try to find it via ID.
                    let safeCorrectIndex = currentQuestion.correctIndex;
                    if ((safeCorrectIndex === undefined || safeCorrectIndex < 0) && currentQuestion.correctAnswerId) {
                        safeCorrectIndex = currentQuestion.answers.findIndex(a => a.id === currentQuestion.correctAnswerId);
                    }

                    const isCorrect = isSelected 
                        ? (currentQuestion.correctAnswerId ? answer.id === currentQuestion.correctAnswerId : index === currentQuestion.correctIndex)
                        : null;

                    return (
                      <AnswerButton
                        key={answer.id || index}
                        answer={answer.content}
                        index={index}
                        isSelected={isSelected}
                        isCorrect={isCorrect}
                        isDisabled={isAnswered}
                        isAnswered={isAnswered}
                        correctIndex={safeCorrectIndex}
                        onClick={() => handleAnswerSelect(answer)}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-center submit-wrapper" style={{ marginTop: '2cqw' }}>
                  <SubmitButton
                    isAnswered={isAnswered}
                    isDisabled={selectedAnswer === null && !isAnswered}
                    onClick={isAnswered ? handleContinue : handleSubmit}
                  />
                </div>
              </>
            )}
          </main>

          {!gameComplete && (
            <div className="bamboo-wrapper" style={{ width: '100%' }}>
              <BambooPath mascotStep={mascotStep} isMoving={isMascotMoving} totalSteps={totalQuestions} />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

const Index = () => {
  return <DragonPeakGame />;
};

export default Index;

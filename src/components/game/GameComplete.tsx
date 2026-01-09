// import mascotImg from "@/assets/mascot.png";

interface GameCompleteProps {
  correctCount: number;
  totalQuestions: number;
  onRestart: () => void;
}

const GameComplete = ({ correctCount, totalQuestions, onRestart }: GameCompleteProps) => {
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage === 100) return "Xuất sắc!";
    if (percentage >= 80) return "Giỏi lắm!";
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 animate-slide-up">
      {/* <img
        src={mascotImg}
        alt="Mascot celebration"
        className="w-32 h-32 object-contain mb-4 animate-bounce"
      /> */}

      <h2 className="text-2xl font-black mb-2" style={{ color: '#AD0011' }}>Hoàn thành!</h2>

      {getMessage() && <p className="text-4xl font-black text-secondary mb-2">{getMessage()}</p>}

      <div className="bg-card rounded-2xl p-6 shadow-lg mb-6">
        <p className="text-lg" style={{ color: '#0a0a48' }}>Bạn trả lời đúng</p>
        <p className="text-5xl font-black" style={{ color: '#69b131' }}>
          {correctCount}/{totalQuestions}
        </p>
        <p className="mt-1" style={{ color: '#0a0a48' }}>câu hỏi</p>
      </div>

      <button
        onClick={onRestart}
        className="bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        Tiếp tục
      </button>
    </div>
  );
};

export default GameComplete;

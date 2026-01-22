interface MobileGameCompleteProps {
  correctCount: number;
  totalQuestions: number;
  reachedFinish: boolean;
  onRestart: () => void;
}

const MobileGameComplete = ({ correctCount, totalQuestions, reachedFinish, onRestart }: MobileGameCompleteProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-slide-up">
      <div className="bg-gradient-to-b from-tet-cream to-tet-peach p-8 rounded-3xl shadow-2xl border-4 border-tet-gold max-w-md mx-4 text-center">
        <h2 className="text-3xl font-bold text-tet-red mb-4">Hoàn thành!</h2>

        <div className="bg-primary/10 rounded-2xl p-4 mb-6">
          <p className="text-lg" style={{ color: "#0a0a48" }}>
            Bạn trả lời đúng{" "}
            <span className="text-3xl font-bold" style={{ color: "#69b131" }}>
              {correctCount}/{totalQuestions}
            </span>{" "}
            câu
          </p>
        </div>
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-tet-red to-tet-orange text-primary-foreground font-bold text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default MobileGameComplete;

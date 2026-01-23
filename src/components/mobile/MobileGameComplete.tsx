interface MobileGameCompleteProps {
  correctCount: number;
  totalQuestions: number;
  reachedFinish: boolean;
  onRestart: () => void;
}

const MobileGameComplete = ({ correctCount, totalQuestions, reachedFinish, onRestart }: MobileGameCompleteProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-slide-up">
      <div 
        className="bg-gradient-to-b from-tet-cream to-tet-peach shadow-2xl text-center"
        style={{ padding: '4cqw', borderRadius: '3cqw', border: '0.5cqw solid hsl(45 100% 50%)', maxWidth: '80cqw', margin: '0 2cqw' }}
      >
        <h2 style={{ fontSize: '5cqw', fontWeight: 'bold', color: 'hsl(0 85% 50%)', marginBottom: '2cqw' }}>Hoàn thành!</h2>

        <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderRadius: '2cqw', padding: '2cqw', marginBottom: '3cqw' }}>
          <p style={{ fontSize: '3cqw', color: '#0a0a48' }}>
            Bạn trả lời đúng{" "}
            <span style={{ fontSize: '5cqw', fontWeight: 'bold', color: '#69b131' }}>
              {correctCount}/{totalQuestions}
            </span>{" "}
            câu
          </p>
        </div>
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-tet-red to-tet-orange text-primary-foreground font-bold hover:scale-105 transition-transform shadow-lg"
          style={{ fontSize: '3cqw', padding: '1.5cqw 4cqw', borderRadius: '3cqw' }}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default MobileGameComplete;

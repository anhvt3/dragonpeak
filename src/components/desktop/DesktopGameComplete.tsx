import { desktopAssets } from "@/config/desktopAssets";

interface DesktopGameCompleteProps {
  correctCount: number;
  totalQuestions: number;
  reachedFinish: boolean;
  onRestart: () => void;
}

const DesktopGameComplete = ({ correctCount, totalQuestions, reachedFinish, onRestart }: DesktopGameCompleteProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-slide-up">
      <div 
        className="bg-gradient-to-b from-tet-cream to-tet-peach shadow-2xl text-center relative"
        style={{ padding: '5cqw 6cqw', borderRadius: '2cqw', border: '0.4cqw solid hsl(45 100% 50%)', maxWidth: '50cqw', margin: '0 2cqw' }}
      >
        <img 
          src={desktopAssets.kids1} 
          alt="Kids" 
          className="absolute bottom-0 hidden lg:block"
          style={{ left: '-10cqw', width: '12cqw', height: 'auto' }}
        />
        <img 
          src={desktopAssets.kids2} 
          alt="Kids" 
          className="absolute bottom-0 hidden lg:block"
          style={{ right: '-10cqw', width: '12cqw', height: 'auto' }}
        />
        
        <h2 style={{ fontSize: '4cqw', fontWeight: 'bold', color: 'hsl(0 85% 50%)', marginBottom: '2cqw' }}>
          {reachedFinish ? "🎉 Chúc mừng! Bạn đã về đích!" : "Hoàn thành!"}
        </h2>

        <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderRadius: '2cqw', padding: '2cqw', marginBottom: '3cqw' }}>
          <p style={{ fontSize: '2.5cqw', color: '#0a0a48' }}>
            Bạn trả lời đúng{" "}
            <span style={{ fontSize: '4cqw', fontWeight: 'bold', color: '#69b131' }}>
              {correctCount}/{totalQuestions}
            </span>{" "}
            câu
          </p>
        </div>
        
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-tet-red to-tet-orange text-white font-bold hover:scale-105 transition-transform shadow-lg"
          style={{ fontSize: '2cqw', padding: '1.5cqw 5cqw', borderRadius: '3cqw' }}
        >
          Chơi lại
        </button>
      </div>
    </div>
  );
};

export default DesktopGameComplete;

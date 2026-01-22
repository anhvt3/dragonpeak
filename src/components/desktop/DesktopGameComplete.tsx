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
      <div className="bg-gradient-to-b from-tet-cream to-tet-peach p-12 rounded-3xl shadow-2xl border-4 border-tet-gold max-w-2xl mx-4 text-center relative">
        {/* Kids decorations */}
        <img 
          src={desktopAssets.kids1} 
          alt="Kids" 
          className="absolute -left-20 bottom-0 w-32 h-auto hidden lg:block"
        />
        <img 
          src={desktopAssets.kids2} 
          alt="Kids" 
          className="absolute -right-20 bottom-0 w-32 h-auto hidden lg:block"
        />
        
        <h2 className="text-4xl font-bold text-tet-red mb-6">
          {reachedFinish ? "🎉 Chúc mừng! Bạn đã về đích!" : "Hoàn thành!"}
        </h2>

        <div className="bg-primary/10 rounded-2xl p-6 mb-8">
          <p className="text-xl" style={{ color: "#0a0a48" }}>
            Bạn trả lời đúng{" "}
            <span className="text-4xl font-bold" style={{ color: "#69b131" }}>
              {correctCount}/{totalQuestions}
            </span>{" "}
            câu
          </p>
        </div>
        
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-tet-red to-tet-orange text-white font-bold text-xl px-12 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          Chơi lại
        </button>
      </div>
    </div>
  );
};

export default DesktopGameComplete;

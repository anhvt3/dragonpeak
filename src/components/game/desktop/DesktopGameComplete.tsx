import children1Img from "@/assets/desktop/children-1.png";
import children2Img from "@/assets/desktop/children-2.png";

interface DesktopGameCompleteProps {
  correctCount: number;
  totalQuestions: number;
  reachedFinish: boolean;
  onRestart: () => void;
}

const DesktopGameComplete = ({ correctCount, totalQuestions, reachedFinish, onRestart }: DesktopGameCompleteProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="desktop-complete-container">
        {/* Left children image */}
        <img 
          src={children1Img} 
          alt="Children" 
          className="absolute -left-32 bottom-0 w-48 h-auto object-contain"
        />
        
        {/* Right children image */}
        <img 
          src={children2Img} 
          alt="Children" 
          className="absolute -right-32 bottom-0 w-48 h-auto object-contain"
        />
        
        <div className="relative z-10 text-center px-12 py-10">
          <h2 className="text-4xl font-bold text-tet-red mb-6">
            {reachedFinish ? "🎉 Về Đích!" : "Hoàn thành!"}
          </h2>

          <div className="bg-white/80 rounded-2xl p-6 mb-8">
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
            className="desktop-restart-btn"
          >
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopGameComplete;

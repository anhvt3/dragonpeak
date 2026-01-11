interface GameCompleteProps {
  correctCount: number;
  totalQuestions: number;
  reachedFinish: boolean;
  onRestart: () => void;
}

const GameComplete = ({ correctCount, totalQuestions, reachedFinish, onRestart }: GameCompleteProps) => {
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
            câu hỏi
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
  // return (
  //   <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
  //     <div
  //       className="text-center animate-pop-in"
  //       style={{
  //         background: "linear-gradient(135deg, #fff7e6, #ffe4b3)",
  //         padding: "50px 60px",
  //         borderRadius: "20px",
  //         boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
  //         border: "5px solid #D35400",
  //       }}
  //     >
  //       {reachedFinish ? (
  //         <>
  //           <h2
  //             style={{
  //               fontFamily: "'Medium SF Compact Rounded', 'SF Pro Rounded', -apple-system, sans-serif",
  //               fontSize: "2.5rem",
  //               color: "#27ae60",
  //               marginBottom: "20px",
  //               textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  //             }}
  //           >
  //             🎉 VỀ ĐÍCH!
  //           </h2>
  //           <p
  //             style={{
  //               fontSize: "1.3rem",
  //               color: "#4a2c00",
  //               marginBottom: "30px",
  //               fontWeight: 500,
  //             }}
  //           >
  //             Chúc mừng! Bạn đã về đích!
  //           </p>
  //         </>
  //       ) : (
  //         <>
  //           <h2
  //             style={{
  //               fontFamily: "'Medium SF Compact Rounded', 'SF Pro Rounded', -apple-system, sans-serif",
  //               fontSize: "2.5rem",
  //               color: "#D35400",
  //               marginBottom: "20px",
  //               textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  //             }}
  //           >
  //             🌊 CHƯA VỀ ĐÍCH
  //           </h2>
  //           <p
  //             style={{
  //               fontSize: "1.3rem",
  //               color: "#4a2c00",
  //               marginBottom: "30px",
  //               fontWeight: 500,
  //             }}
  //           >
  //             Hành trình vạn dặm bắt đầu từ một bước chân. Hãy thử lại nhé!
  //           </p>
  //         </>
  //       )}

  //       <button
  //         onClick={onRestart}
  //         style={{
  //           padding: "15px 50px",
  //           fontFamily: "'Medium SF Compact Rounded', 'SF Pro Rounded', -apple-system, sans-serif",
  //           fontSize: "1.3rem",
  //           color: "white",
  //           background: "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)",
  //           border: "none",
  //           borderRadius: "30px",
  //           cursor: "pointer",
  //           boxShadow: "0 4px 15px rgba(30, 132, 73, 0.4)",
  //           textTransform: "uppercase",
  //           letterSpacing: "2px",
  //         }}
  //       >
  //         Chơi lại
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default GameComplete;

import envelopeImg from "@/assets/envelope.png";

export type EnvelopeState = "pending" | "correct" | "wrong" | "current";

interface LuckyEnvelopesProps {
  scoreState: EnvelopeState[];
  currentIndex: number;
}

const LuckyEnvelopes = ({ scoreState, currentIndex }: LuckyEnvelopesProps) => {
  const getEnvelopeClass = (index: number): string => {
    // Current question - gentle slow pulse
    if (index === currentIndex && scoreState[index] === "pending") {
      return "envelope-current-pulse";
    }
    // Correct answer - bright with celebration glow
    if (scoreState[index] === "correct") {
      return "envelope-correct";
    }
    // Wrong answer - dimmed, no animation
    if (scoreState[index] === "wrong") {
      return "envelope-dimmed";
    }
    // Future questions - static, slightly dim
    return "opacity-100";
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {scoreState.map((_, index) => (
        <div key={index} className={`w-10 h-12 transition-all duration-3000 ${getEnvelopeClass(index)}`}>
          <img src={envelopeImg} alt={`Envelope ${index + 1}`} className="w-full h-full object-contain" />
        </div>
      ))}
    </div>
  );
};

export default LuckyEnvelopes;

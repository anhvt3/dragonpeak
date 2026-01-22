import envelopeImg from "@/assets/envelope.png";
import { EnvelopeState } from "@/components/game/shared/types";

interface MobileLuckyEnvelopesProps {
  scoreState: EnvelopeState[];
  currentIndex: number;
}

const MAX_DISPLAY = 5;

const MobileLuckyEnvelopes = ({ scoreState, currentIndex }: MobileLuckyEnvelopesProps) => {
  const totalQuestions = scoreState.length;

  let startIndex = 0;
  let endIndex = Math.min(MAX_DISPLAY, totalQuestions);

  if (totalQuestions > MAX_DISPLAY) {
    const currentGroup = Math.floor(currentIndex / MAX_DISPLAY);
    startIndex = currentGroup * MAX_DISPLAY;
    endIndex = Math.min(startIndex + MAX_DISPLAY, totalQuestions);
  }

  const visibleEnvelopes = scoreState.slice(startIndex, endIndex);

  const getEnvelopeClass = (actualIndex: number): string => {
    if (actualIndex === currentIndex && scoreState[actualIndex] === "pending") {
      return "envelope-current-pulse";
    }
    if (scoreState[actualIndex] === "correct") {
      return "envelope-correct";
    }
    if (scoreState[actualIndex] === "wrong") {
      return "envelope-dimmed";
    }
    return "envelope-dimmed";
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {visibleEnvelopes.map((_, index) => {
        const actualIndex = startIndex + index;
        return (
          <div key={actualIndex} className={`w-10 h-12 transition-all ${getEnvelopeClass(actualIndex)}`}>
            <img src={envelopeImg} alt={`Envelope ${actualIndex + 1}`} className="w-full h-full object-contain" />
          </div>
        );
      })}
    </div>
  );
};

export default MobileLuckyEnvelopes;

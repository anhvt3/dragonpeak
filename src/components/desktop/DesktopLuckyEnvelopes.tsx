import { desktopAssets } from "@/config/desktopAssets";
import { EnvelopeState } from "@/components/game/LuckyEnvelopes";

interface DesktopLuckyEnvelopesProps {
  scoreState: EnvelopeState[];
  currentIndex: number;
}

const MAX_DISPLAY = 5;

const DesktopLuckyEnvelopes = ({ scoreState, currentIndex }: DesktopLuckyEnvelopesProps) => {
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
    <div className="score-container">
      {visibleEnvelopes.map((_, index) => {
        const actualIndex = startIndex + index;
        return (
          <div key={actualIndex} className={`score-item transition-all ${getEnvelopeClass(actualIndex)}`}>
            <img src={desktopAssets.envelope} alt={`Envelope ${actualIndex + 1}`} className="w-full h-full object-contain" />
          </div>
        );
      })}
    </div>
  );
};

export default DesktopLuckyEnvelopes;

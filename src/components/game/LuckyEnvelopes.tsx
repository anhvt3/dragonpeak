import { useTheme } from "@/contexts/ThemeContext";

export type EnvelopeState = "pending" | "correct" | "wrong" | "current";

interface LuckyEnvelopesProps {
  scoreState: EnvelopeState[];
  currentIndex: number;
}

const MAX_DISPLAY = 5;

const LuckyEnvelopes = ({ scoreState, currentIndex }: LuckyEnvelopesProps) => {
  const { assets } = useTheme();
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
            <img src={assets.envelope} alt={`Envelope ${actualIndex + 1}`} className="w-full h-full object-contain" />
          </div>
        );
      })}
    </div>
  );
};

export default LuckyEnvelopes;

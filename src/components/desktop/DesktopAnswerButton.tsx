import HtmlContent from "@/components/game/HtmlContent";

interface DesktopAnswerButtonProps {
  answer: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isDisabled: boolean;
  isAnswered: boolean;
  correctIndex: number;
  onClick: () => void;
}

const DesktopAnswerButton = ({
  answer,
  index,
  isSelected,
  isCorrect,
  isDisabled,
  isAnswered,
  correctIndex,
  onClick,
}: DesktopAnswerButtonProps) => {
  const getButtonClass = (): string => {
    if (isAnswered) {
      if (index === correctIndex) {
        return "answer-btn-correct";
      }
      if (isSelected && !isCorrect) {
        return "answer-btn-wrong";
      }
      return "answer-btn-default opacity-70";
    }

    if (isSelected) {
      return "answer-btn-selected";
    }
    return "answer-btn-default";
  };

  const labels = ["A", "B", "C", "D"];

  const getLetterColor = (): string => {
    if (isAnswered) {
      if (index === correctIndex) {
        return "#2acb42";
      }
      if (isSelected && !isCorrect) {
        return "#ff3b30";
      }
    }
    return "#4a2c00";
  };

  const getCircleBackground = (): string => {
    if (isAnswered) {
      if (index === correctIndex) {
        return "#C8F7C5";
      }
      if (isSelected && !isCorrect) {
        return "#FADBD8";
      }
    }
    return "hsl(var(--primary) / 0.2)";
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        answer-btn flex items-center transition-all duration-200
        ${getButtonClass()}
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"}
      `}
      style={{ borderRadius: '3cqw', padding: '2% 3%', minHeight: '8cqw', gap: '3%' }}
    >
      <span 
        className="rounded-full flex items-center justify-center font-bold shrink-0 transition-colors duration-200"
        style={{ width: '8cqw', height: '8cqw', fontSize: '4cqw', color: getLetterColor(), backgroundColor: getCircleBackground() }}
      >
        {labels[index]}
      </span>
      <span style={{ fontSize: '3.5cqw' }}>
        <HtmlContent 
          html={answer}
          className="font-semibold text-left leading-tight min-w-0 break-all"
        />
      </span>
    </button>
  );
};

export default DesktopAnswerButton;

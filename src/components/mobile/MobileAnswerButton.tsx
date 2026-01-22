import HtmlContent from "@/components/game/HtmlContent";

interface MobileAnswerButtonProps {
  answer: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isDisabled: boolean;
  isAnswered: boolean;
  correctIndex: number;
  onClick: () => void;
}

const MobileAnswerButton = ({
  answer,
  index,
  isSelected,
  isCorrect,
  isDisabled,
  isAnswered,
  correctIndex,
  onClick,
}: MobileAnswerButtonProps) => {
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
        answer-btn rounded-2xl p-2.5 min-h-[60px]
        flex items-center gap-3
        ${getButtonClass()}
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer active:scale-95"}
        transition-all duration-200
      `}
    >
      <span 
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-200"
        style={{ color: getLetterColor(), backgroundColor: getCircleBackground() }}
      >
        {labels[index]}
      </span>
      <span style={{ fontSize: '16px' }}>
        <HtmlContent 
          html={answer}
          className="font-semibold text-left leading-tight min-w-0 break-all"
        />
      </span>
    </button>
  );
};

export default MobileAnswerButton;

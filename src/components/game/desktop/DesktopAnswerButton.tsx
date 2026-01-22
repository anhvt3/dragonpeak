import HtmlContent from "../HtmlContent";

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

const answerLabels = ["A", "B", "C", "D"];

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
  const getStateClass = () => {
    if (!isAnswered) {
      return isSelected ? "desktop-answer-selected" : "";
    }
    
    // After answering, show correct answer in green
    if (index === correctIndex) {
      return "desktop-answer-correct";
    }
    
    // Show selected wrong answer in red
    if (isSelected && isCorrect === false) {
      return "desktop-answer-wrong";
    }
    
    return "";
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        desktop-answer-btn
        transition-all duration-200 animate-slide-up
        ${isDisabled && !isAnswered ? "opacity-70" : ""}
        ${!isDisabled ? "hover:scale-[1.02] active:scale-[0.98]" : ""}
        ${getStateClass()}
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <span className="desktop-answer-label">{answerLabels[index]}</span>
      <span className="desktop-answer-text">
        <HtmlContent html={answer} />
      </span>
    </button>
  );
};

export default DesktopAnswerButton;

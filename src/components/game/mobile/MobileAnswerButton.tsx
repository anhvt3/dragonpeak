import answerBtnImg from "@/assets/answer-button.png";
import HtmlContent from "../HtmlContent";

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

const answerLabels = ["A", "B", "C", "D"];

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
  const getStateClass = () => {
    if (!isAnswered) {
      return isSelected ? "answer-selected" : "";
    }
    
    // After answering, show correct answer in green
    if (index === correctIndex) {
      return "answer-correct";
    }
    
    // Show selected wrong answer in red
    if (isSelected && isCorrect === false) {
      return "answer-wrong";
    }
    
    return "";
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative w-full game-button
        transition-all duration-200 animate-slide-up
        ${isDisabled && !isAnswered ? "opacity-70" : ""}
        ${!isDisabled ? "hover:scale-[1.02] active:scale-[0.98]" : ""}
        ${getStateClass()}
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="answer-btn-container"
        style={{ backgroundImage: `url(${answerBtnImg})` }}
      >
        <span className="answer-label">{answerLabels[index]}</span>
        <span className="answer-text" style={{ fontSize: '16px' }}>
          <HtmlContent html={answer} />
        </span>
      </div>
    </button>
  );
};

export default MobileAnswerButton;

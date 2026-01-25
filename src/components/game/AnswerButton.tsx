import HtmlContent from "./HtmlContent";

interface AnswerButtonProps {
  answer: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isDisabled: boolean;
  isAnswered: boolean;
  correctIndex: number;
  onClick: () => void;
}

const AnswerButton = ({
  answer,
  index,
  isSelected,
  isCorrect,
  isDisabled,
  isAnswered,
  correctIndex,
  onClick,
}: AnswerButtonProps) => {
  const getContainerClass = (): string => {
    let classes = "answer-container";

    if (isAnswered) {
      if (isSelected) {
        if (isCorrect) {
          classes += " correct";
        } else {
          classes += " wrong selected";
        }
      } 
      else if (index === correctIndex) {
        classes += " correct";
      }
      else {
         classes += " wrong";
      }
    } else {
      if (isSelected) {
        classes += " selected";
      }
    }

    return classes;
  };

  const labels = ["A", "B", "C", "D"];

  return (
    <div
      onClick={() => !isDisabled && onClick()}
      className={getContainerClass()}
      style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
    >
      <div className="answer-label">
        {labels[index] ?? index + 1}
      </div>
      <div className="answer-text">
        <HtmlContent html={answer} />
      </div>
    </div>
  );
};

export default AnswerButton;

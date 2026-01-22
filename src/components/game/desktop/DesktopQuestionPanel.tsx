import HtmlContent from "../HtmlContent";

interface DesktopQuestionPanelProps {
  question: string;
  questionNumber: number;
  imageUrl?: string;
}

const DesktopQuestionPanel = ({ question, questionNumber, imageUrl }: DesktopQuestionPanelProps) => {
  return (
    <div className="animate-slide-up">
      <div className="desktop-question-container">
        <div className="desktop-question-text">
          {imageUrl ? (
            <img src={imageUrl} alt="Question" className="max-w-full max-h-[200px] object-contain mx-auto" />
          ) : (
            <HtmlContent html={question} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopQuestionPanel;

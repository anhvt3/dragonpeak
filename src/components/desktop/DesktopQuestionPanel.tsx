import { desktopAssets } from "@/config/desktopAssets";
import HtmlContent from "@/components/game/HtmlContent";

interface DesktopQuestionPanelProps {
  question: string;
  questionNumber: number;
  imageUrl?: string;
}

const DesktopQuestionPanel = ({ question, questionNumber, imageUrl }: DesktopQuestionPanelProps) => {
  return (
    <div className="relative w-full max-w-[800px] mx-auto animate-slide-up">
      <div 
        className="question-container" 
        style={{ 
          backgroundImage: `url(${desktopAssets.questionPanel})`,
          padding: '8% 6%',
        }}
      >
        <div className="question-text" style={{ fontSize: '20px', maxHeight: '150px' }}>
          {imageUrl ? (
            <img src={imageUrl} alt="Question" className="max-w-full max-h-[180px] object-contain mx-auto" />
          ) : (
            <HtmlContent html={question} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopQuestionPanel;

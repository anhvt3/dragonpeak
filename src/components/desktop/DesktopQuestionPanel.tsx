import { desktopAssets } from "@/config/desktopAssets";
import HtmlContent from "@/components/game/HtmlContent";

interface DesktopQuestionPanelProps {
  question: string;
  questionNumber: number;
  imageUrl?: string;
}

const DesktopQuestionPanel = ({ question, questionNumber, imageUrl }: DesktopQuestionPanelProps) => {
  return (
    <div className="relative w-full animate-slide-up" style={{ maxWidth: '60cqw', margin: '0 auto' }}>
      <div 
        className="question-container" 
        style={{ 
          backgroundImage: `url(${desktopAssets.questionPanel})`,
          padding: '8% 6%',
        }}
      >
        <div className="question-text">
          {imageUrl ? (
            <img src={imageUrl} alt="Question" style={{ maxWidth: '100%', maxHeight: '25cqw', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
          ) : (
            <HtmlContent html={question} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopQuestionPanel;

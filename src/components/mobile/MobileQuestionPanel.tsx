import { mobileAssets } from "@/config/mobileAssets";
import HtmlContent from "@/components/game/HtmlContent";

interface MobileQuestionPanelProps {
  question: string;
  questionNumber: number;
  imageUrl?: string;
}

const MobileQuestionPanel = ({ question, questionNumber, imageUrl }: MobileQuestionPanelProps) => {
  return (
    <div className="relative w-full px-4 animate-slide-up" style={{ marginBottom: '0.25rem', marginTop: '-0.5rem' }}>
      <div className="question-container" style={{ backgroundImage: `url(${mobileAssets.questionPanel})` }}>
        <div className="question-text">
          {imageUrl ? (
            <img src={imageUrl} alt="Question" className="max-w-full max-h-[150px] object-contain mx-auto" />
          ) : (
            <HtmlContent html={question} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileQuestionPanel;

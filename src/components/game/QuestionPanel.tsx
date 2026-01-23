import { useTheme } from "@/contexts/ThemeContext";
import HtmlContent from "./HtmlContent";

interface QuestionPanelProps {
  question: string;
  questionNumber: number;
  imageUrl?: string;
}

const QuestionPanel = ({ question, questionNumber, imageUrl }: QuestionPanelProps) => {
  const { assets } = useTheme();

  return (
    <div className="relative w-full animate-slide-up" style={{ padding: '0 1cqw', marginBottom: '0.5cqw', marginTop: '-1cqw' }}>
      <div className="question-container" style={{ backgroundImage: `url(${assets.questionPanel})` }}>
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

export default QuestionPanel;

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
    <div className="relative w-full px-4 animate-slide-up" style={{ marginBottom: '0.25rem', marginTop: '-0.5rem' }}>
      <div className="question-container" style={{ backgroundImage: `url(${assets.questionPanel})` }}>
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

export default QuestionPanel;

import { useTheme } from "@/contexts/ThemeContext";

interface SubmitButtonProps {
  isAnswered: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const SubmitButton = ({ isAnswered, isDisabled, onClick }: SubmitButtonProps) => {
  const { assets } = useTheme();

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative game-button
        transition-all duration-200
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:scale-105"}
      `}
    >
      <img
        src={isAnswered ? assets.continueButton : assets.submitButton}
        alt={isAnswered ? "Tiếp tục" : "Trả lời"}
        style={{ height: '5.5cqw', width: 'auto', objectFit: 'contain' }}
      />
    </button>
  );
};

export default SubmitButton;

import submitImg from "@/assets/submit-button.png";
import continueImg from "@/assets/continue-button.png";

interface MobileSubmitButtonProps {
  isAnswered: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const MobileSubmitButton = ({ isAnswered, isDisabled, onClick }: MobileSubmitButtonProps) => {
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
        src={isAnswered ? continueImg : submitImg}
        alt={isAnswered ? "Tiếp tục" : "Trả lời"}
        className="h-11 lg:h-14 w-auto object-contain"
      />
    </button>
  );
};

export default MobileSubmitButton;

import { mobileAssets } from "@/config/mobileAssets";

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
        src={isAnswered ? mobileAssets.continueButton : mobileAssets.submitButton}
        alt={isAnswered ? "Tiếp tục" : "Trả lời"}
        style={{ height: '10cqw', width: 'auto', objectFit: 'contain' }}
      />
    </button>
  );
};

export default MobileSubmitButton;

interface DesktopSubmitButtonProps {
  isAnswered: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const DesktopSubmitButton = ({ isAnswered, isDisabled, onClick }: DesktopSubmitButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        desktop-submit-btn
        transition-all duration-200
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:scale-105"}
      `}
    >
      {isAnswered ? "Tiếp tục" : "Trả lời"}
    </button>
  );
};

export default DesktopSubmitButton;

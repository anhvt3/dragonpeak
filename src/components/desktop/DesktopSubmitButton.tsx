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
        relative game-button
        font-bold uppercase tracking-wide
        transition-all duration-200
        ${isDisabled 
          ? "opacity-50 cursor-not-allowed bg-gray-400" 
          : "cursor-pointer active:scale-95 hover:scale-105 bg-gradient-to-r from-tet-red to-tet-orange text-white shadow-lg hover:shadow-xl"
        }
      `}
      style={{ padding: '1.5cqw 5cqw', borderRadius: '3cqw', fontSize: '2cqw' }}
    >
      {isAnswered ? "Tiếp tục" : "Trả lời"}
    </button>
  );
};

export default DesktopSubmitButton;

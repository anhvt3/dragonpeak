import { useState, useEffect } from "react";
import bambooPathImg from "@/assets/desktop/bamboo-path.png";
import mascotImg from "@/assets/desktop/mascot.gif";

interface DesktopBambooPathProps {
  mascotStep: number;
  isMoving: boolean;
  totalSteps: number;
}

// Vertical positions for desktop (bottom to top percentage)
const BAMBOO_POSITIONS = [85, 68, 50, 32, 15];

const DesktopBambooPath = ({ mascotStep, isMoving, totalSteps }: DesktopBambooPathProps) => {
  const [displayStep, setDisplayStep] = useState(0);

  const currentPosition = Math.min(displayStep, BAMBOO_POSITIONS.length - 1);
  const mascotPosition = BAMBOO_POSITIONS[currentPosition];

  useEffect(() => {
    if (isMoving && mascotStep > displayStep) {
      const moveTimeout = setTimeout(() => {
        setDisplayStep(mascotStep);
      }, 300);

      return () => {
        clearTimeout(moveTimeout);
      };
    }
  }, [isMoving, mascotStep, displayStep]);

  useEffect(() => {
    if (mascotStep === 0) {
      setDisplayStep(0);
    }
  }, [mascotStep]);

  return (
    <div className="relative h-[500px] flex items-center justify-center">
      <img 
        src={bambooPathImg} 
        alt="Bamboo path" 
        className="h-full w-auto object-contain"
      />
      
      {/* Mascot positioned along the vertical path */}
      <div
        className="absolute left-1/2 w-20 h-20 transition-all duration-700 ease-out"
        style={{
          top: `${mascotPosition}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <img 
          src={mascotImg} 
          alt="Mascot" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default DesktopBambooPath;

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface BambooPathProps {
  mascotStep: number;
  isMoving: boolean;
  totalSteps: number;
}

const BAMBOO_POSITIONS = [10, 26, 42, 58, 74, 90];

const BambooPath = ({ mascotStep, isMoving, totalSteps }: BambooPathProps) => {
  const { assets } = useTheme();
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
    <div
      className="bamboo-section relative pointer-events-none"
      style={{ 
        transformOrigin: "center top", 
        marginTop: "-2cqw", 
        width: '55%',
        maxWidth: '55cqw',
        marginLeft: 'auto',
        marginRight: 'auto',
        containerType: "inline-size" 
      }}
    >
      <div className="relative" style={{ transformOrigin: "center center", transform: "scaleY(0.8)" }}>
        <img src={assets.bambooPath} alt="Bamboo path" className="w-full h-auto object-contain" />

        <div
          className="mascot-wrapper absolute transition-all duration-700 ease-out"
          style={{
            bottom: '57%',
            width: '22%',
            left: `${mascotPosition}%`,
            transform: "translateX(-50%) scaleY(1.2)",
            aspectRatio: "1/1",
          }}
        >
          <img src={assets.maskGroup} alt="Mascot" className="w-full h-full object-contain mascot-rocking" />
        </div>
      </div>
    </div>
  );
};

export default BambooPath;

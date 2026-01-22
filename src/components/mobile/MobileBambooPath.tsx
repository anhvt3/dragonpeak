import { useState, useEffect } from "react";
import { mobileAssets } from "@/config/mobileAssets";

interface MobileBambooPathProps {
  mascotStep: number;
  isMoving: boolean;
  totalSteps: number;
}

const BAMBOO_POSITIONS = [12, 31, 50, 69, 88];

const MobileBambooPath = ({ mascotStep, isMoving, totalSteps }: MobileBambooPathProps) => {
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
      className="relative w-full pointer-events-none"
      style={{ transformOrigin: "center top", marginTop: "-2rem" }}
    >
      <div className="relative" style={{ transformOrigin: "center center" }}>
        <img src={mobileAssets.bambooPath} alt="Bamboo path" className="w-full h-auto object-contain" />

        <div
          className="absolute bottom-[61%] w-[20%] transition-all duration-700 ease-out"
          style={{
            left: `${mascotPosition}%`,
            transform: "translateX(-50%)",
            aspectRatio: "1/1",
          }}
        >
          <img src={mobileAssets.maskGroup} alt="Mascot" className="w-full h-full object-contain mascot-rocking" />
        </div>
      </div>
    </div>
  );
};

export default MobileBambooPath;

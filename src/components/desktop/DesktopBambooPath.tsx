import { useState, useEffect } from "react";
import { desktopAssets } from "@/config/desktopAssets";

interface DesktopBambooPathProps {
  mascotStep: number;
  isMoving: boolean;
  totalSteps: number;
}

const BAMBOO_POSITIONS = [12, 31, 50, 69, 88];

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
    <div
      className="relative w-full max-w-[700px] mx-auto pointer-events-none"
      style={{ transformOrigin: "center top" }}
    >
      <div className="relative scale-[0.85]" style={{ transformOrigin: "center center" }}>
        <img src={desktopAssets.bambooPath} alt="Bamboo path" className="w-full h-auto object-contain" />

        <div
          className="absolute bottom-[61%] w-[18%] transition-all duration-700 ease-out"
          style={{
            left: `${mascotPosition}%`,
            transform: "translateX(-50%)",
            aspectRatio: "1/1",
          }}
        >
          <img src={desktopAssets.maskGroup} alt="Mascot" className="w-full h-full object-contain mascot-rocking" />
        </div>
      </div>
    </div>
  );
};

export default DesktopBambooPath;

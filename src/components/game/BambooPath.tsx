import { useState, useEffect } from "react";
import bambooPathImg from "@/assets/bamboo-path.png";
import mascotImg from "@/assets/mask-group.png";

interface BambooPathProps {
  mascotStep: number;
  isMoving: boolean;
  totalSteps: number;
}

const BAMBOO_POSITIONS = [12, 31, 50, 69, 88];

const BambooPath = ({ mascotStep, isMoving, totalSteps }: BambooPathProps) => {
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
      <div className="relative lg:scale-[0.85]" style={{ transformOrigin: "center center" }}>
        <img src={bambooPathImg} alt="Bamboo path" className="w-full h-auto object-contain" />

        <div
          className={`absolute ${mascotStep === 0 ? bottom-[30%] : bottom-[61%]} w-[20%] lg:w-[18%] transition-all duration-700 ease-out`}
          style={{
            left: `${mascotPosition}%`,
            transform: "translateX(-50%)",
            aspectRatio: "1/1",
          }}
        >
          <img src={mascotImg} alt="Mascot" className="w-full h-full object-contain mascot-rocking" />
        </div>
      </div>
    </div>
  );
};

export default BambooPath;

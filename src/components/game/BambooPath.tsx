import { useState, useEffect } from "react";
import bambooPathImg from "@/assets/bamboo-path.png";
import mascotGif from "@/assets/mascot-idle.gif";

interface BambooPathProps {
  mascotStep: number;
  isMoving: boolean;
  totalSteps: number;
}

const BambooPath = ({ mascotStep, isMoving, totalSteps }: BambooPathProps) => {
  const [isJumping, setIsJumping] = useState(false);
  const [displayStep, setDisplayStep] = useState(mascotStep);

  // Calculate mascot position based on step (0 to totalSteps)
  // Steps are distributed across the bamboo path width
  const stepPositions = [8, 28, 48, 68, 88]; // percentage positions for 5 steps
  const mascotPosition = stepPositions[Math.min(displayStep, totalSteps - 1)] || stepPositions[0];

  useEffect(() => {
    if (isMoving && mascotStep > displayStep) {
      // Step 1: Start jump animation
      setIsJumping(true);

      // Step 2: After jump peaks, start moving forward
      const moveTimeout = setTimeout(() => {
        setDisplayStep(mascotStep);
      }, 300);

      // Step 3: End jump animation after movement completes
      const jumpEndTimeout = setTimeout(() => {
        setIsJumping(false);
      }, 900);

      return () => {
        clearTimeout(moveTimeout);
        clearTimeout(jumpEndTimeout);
      };
    }
  }, [isMoving, mascotStep, displayStep]);

  // Sync displayStep when game resets
  useEffect(() => {
    if (mascotStep === 0) {
      setDisplayStep(0);
    }
  }, [mascotStep]);

  return (
    <div
      className="relative w-full pointer-events-none"
      style={{ transformOrigin: "center top", marginTop: "-4.5rem" }}
    >
      {/* Bamboo path */}
      <div className="relative">
        <img src={bambooPathImg} alt="Bamboo path" className="w-full h-auto object-contain scale-[0.8]" />

        {/* Mascot */}
        <div
          className={`
            absolute bottom-[48%] w-40 h-40
            transition-all duration-600 ease-out
            ${isJumping ? "mascot-bounce" : ""}
          `}
          style={{
            left: `${mascotPosition}%`,
            transform: "translateX(-27%)",
          }}
        >
          <img src={mascotGif} alt="Mascot" className="w-full h-full object-contain scale-[0.8]" />
        </div>
      </div>

      {/* Step indicators */}
      {/* <div className="flex justify-between px-4 mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index < mascotStep ? "bg-accent" : "bg-muted"}
            `}
          />
        ))}
      </div> */}
    </div>
  );
};

export default BambooPath;

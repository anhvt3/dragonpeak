import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options: object) => void;
  }
}

interface HtmlContentProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

const HtmlContent = ({ html, className = "", style }: HtmlContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (window.renderMathInElement) {
      window.renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    }
  }, [html]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target.tagName === "IMG") {
      const imgSrc = (target as HTMLImageElement).src;
      const audioIconPattern = "listen";
      
      if (imgSrc.includes(audioIconPattern)) {
        const parentDiv = target.closest("div");
        if (parentDiv) {
          const audio = parentDiv.querySelector("audio");
          if (audio) {
            if (audio.paused) {
              audio.play();
            } else {
              audio.pause();
            }
          }
        }
        return;
      }

      setModalImage(imgSrc);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={style}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModalImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
            onClick={() => setModalImage(null)}
          >
            ×
          </button>
          <img
            src={modalImage}
            alt="Zoomed"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default HtmlContent;

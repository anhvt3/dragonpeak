import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

  const modal = modalImage ? createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80"
      style={{ zIndex: 99999 }}
      onClick={() => setModalImage(null)}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
        style={{ zIndex: 100000 }}
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
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={style}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {modal}
    </>
  );
};

export default HtmlContent;

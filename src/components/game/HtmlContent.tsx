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
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={() => setModalImage(null)}
    >
      <button
        className="absolute cursor-pointer text-white font-bold hover:text-[#ff6b6b] transition-colors duration-200"
        style={{ 
          zIndex: 10010, 
          top: '3cqw', 
          right: '5cqw', 
          width: '5cqw', 
          height: '5cqw', 
          fontSize: '5cqw' 
        }}
        onClick={() => setModalImage(null)}
      >
        ×
      </button>
      <img
        src={modalImage}
        alt="Zoomed"
        className="max-w-[90vw] max-h-[90vh] object-contain"
        style={{ 
          borderRadius: '1cqw', 
          boxShadow: '0 0.5cqw 3cqw rgba(0, 0, 0, 0.5)' 
        }}
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

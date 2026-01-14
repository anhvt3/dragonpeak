import { useRef, useEffect, useCallback } from 'react';
import { audioUrls } from '@/config/audioConfig';

export const useGameAudio = () => {
  const buttonClickRef = useRef<HTMLAudioElement | null>(null);
  const wrongAnswerRef = useRef<HTMLAudioElement | null>(null);
  const correctAnswerRef = useRef<HTMLAudioElement | null>(null);
  const finishGameRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio files
    buttonClickRef.current = new Audio(audioUrls.buttonClick);
    wrongAnswerRef.current = new Audio(audioUrls.wrongAnswer);
    correctAnswerRef.current = new Audio(audioUrls.correctAnswer);
    finishGameRef.current = new Audio(audioUrls.finishGame);

    // Preload by setting preload attribute
    [buttonClickRef, wrongAnswerRef, correctAnswerRef, finishGameRef].forEach(ref => {
      if (ref.current) {
        ref.current.preload = 'auto';
      }
    });

    return () => {
      // Cleanup
      [buttonClickRef, wrongAnswerRef, correctAnswerRef, finishGameRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  const playAudio = useCallback((audioRef: React.RefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  const playButtonClick = useCallback(() => {
    playAudio(buttonClickRef);
  }, [playAudio]);

  const playWrongAnswer = useCallback(() => {
    playAudio(wrongAnswerRef);
  }, [playAudio]);

  const playCorrectAnswer = useCallback(() => {
    playAudio(correctAnswerRef);
  }, [playAudio]);

  const playFinishGame = useCallback(() => {
    playAudio(finishGameRef);
  }, [playAudio]);

  return {
    playButtonClick,
    playWrongAnswer,
    playCorrectAnswer,
    playFinishGame,
  };
};

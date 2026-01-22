// Mobile assets (cat mascot, blue-ish background)
import background from '@/assets/mobile/background.jpg';
import mascot from '@/assets/mobile/mascot-idle.gif';
import answerButton from '@/assets/mobile/answer-button.png';
import submitButton from '@/assets/mobile/submit-button.png';
import continueButton from '@/assets/mobile/continue-button.png';
import questionPanel from '@/assets/mobile/question-panel.png';
import envelope from '@/assets/mobile/envelope.png';
import bambooPath from '@/assets/mobile/bamboo-path.png';
import maskGroup from '@/assets/mobile/mask-group.png';

export const mobileAssets = {
  background,
  mascot,
  answerButton,
  submitButton,
  continueButton,
  questionPanel,
  envelope,
  bambooPath,
  maskGroup,
};

export type GameAssets = typeof mobileAssets;

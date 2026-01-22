// Mobile assets (current design - cat mascot, blue-ish background)
import mobileBackground from '@/assets/mobile/background.jpg';
import mobileMascot from '@/assets/mobile/mascot-idle.gif';
import mobileAnswerButton from '@/assets/mobile/answer-button.png';
import mobileSubmitButton from '@/assets/mobile/submit-button.png';
import mobileContinueButton from '@/assets/mobile/continue-button.png';
import mobileQuestionPanel from '@/assets/mobile/question-panel.png';
import mobileEnvelope from '@/assets/mobile/envelope.png';
import mobileBambooPath from '@/assets/mobile/bamboo-path.png';
import mobileMaskGroup from '@/assets/mobile/mask-group.png';

// PC assets (new design - squirrel mascot, Tet background)
// TODO: Replace these with actual PC assets when provided
import pcBackground from '@/assets/pc/background.jpg';
import pcMascot from '@/assets/pc/mascot-idle.gif';
import pcAnswerButton from '@/assets/pc/answer-button.png';
import pcSubmitButton from '@/assets/pc/submit-button.png';
import pcContinueButton from '@/assets/pc/continue-button.png';
import pcQuestionPanel from '@/assets/pc/question-panel.png';
import pcEnvelope from '@/assets/pc/envelope.png';
import pcBambooPath from '@/assets/pc/bamboo-path.png';
import pcMaskGroup from '@/assets/pc/mask-group.png';

export interface ThemeAssets {
  background: string;
  mascot: string;
  answerButton: string;
  submitButton: string;
  continueButton: string;
  questionPanel: string;
  envelope: string;
  bambooPath: string;
  maskGroup: string;
}

export const themeAssets: Record<'mobile' | 'pc', ThemeAssets> = {
  mobile: {
    background: mobileBackground,
    mascot: mobileMascot,
    answerButton: mobileAnswerButton,
    submitButton: mobileSubmitButton,
    continueButton: mobileContinueButton,
    questionPanel: mobileQuestionPanel,
    envelope: mobileEnvelope,
    bambooPath: mobileBambooPath,
    maskGroup: mobileMaskGroup,
  },
  pc: {
    background: pcBackground,
    mascot: pcMascot,
    answerButton: pcAnswerButton,
    submitButton: pcSubmitButton,
    continueButton: pcContinueButton,
    questionPanel: pcQuestionPanel,
    envelope: pcEnvelope,
    bambooPath: pcBambooPath,
    maskGroup: pcMaskGroup,
  },
};

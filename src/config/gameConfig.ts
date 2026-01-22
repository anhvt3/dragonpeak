// Helper to check query string for sample mode
function checkSampleMode(): boolean {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  const sampleParam = urlParams.get('sample');
  // ?sample=true → use sample data
  // ?sample=false or no param → use API
  return sampleParam === 'true';
}

export const gameConfig = {
  // Dynamic check for sample mode from query string
  get useSampleQuestions(): boolean {
    return checkSampleMode();
  },

  // Fixed total questions for progress display (always 5)
  fixedTotalQuestions: 5,

  // API endpoint for questions (used when useSampleQuestions is false)
  apiBaseUrl: 'https://ai-math.clevai.edu.vn/quiz/load-quizs',
};

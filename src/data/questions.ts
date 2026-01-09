const API_BASE_URL = 'https://ai-math.clevai.edu.vn/quiz/load-quizs';

export interface Question {
  id: number;
  question: string;
  imageUrl?: string;
  answers: string[];
  correctIndex: number;
  quizCode?: string;
}

interface ApiQuizOption {
  option_code: string;
  option_value: string;
}

interface ApiQuiz {
  quiz_code: string;
  content: string;
  quiz_possible_options: ApiQuizOption[];
  quiz_answers: {
    option_code: string;
  };
}

interface ApiResponse {
  status: boolean;
  quizzes: ApiQuiz[];
}

export function getLearningObjectCode(): string | null {
  const url = window.location.href;
  const match = url.match(/learning_object_code=([^&\/]+)/);
  return match ? match[1] : null;
}

function convertApiResponseToQuestions(apiResponse: ApiResponse): Question[] {
  if (!apiResponse.status || !apiResponse.quizzes) {
    throw new Error('Invalid API response');
  }

  return apiResponse.quizzes.map((quiz, index) => {
    const options = [...quiz.quiz_possible_options]
      .sort((a, b) => a.option_code.localeCompare(b.option_code));

    const answers = options.map(opt => opt.option_value);
    const correctOptionCode = quiz.quiz_answers.option_code;
    const correctIndex = options.findIndex(opt => opt.option_code === correctOptionCode);

    return {
      id: index + 1,
      question: quiz.content,
      answers,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      quizCode: quiz.quiz_code
    };
  });
}

export async function loadQuestionsFromApi(): Promise<Question[]> {
  const learningObjectCode = getLearningObjectCode();

  if (!learningObjectCode) {
    throw new Error('learning_object_code not found in URL. URL format: ?learning_object_code=XXX');
  }

  const apiUrl = `${API_BASE_URL}?learning_object_code=${encodeURIComponent(learningObjectCode)}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return convertApiResponseToQuestions(data);
}

export const fallbackQuestions: Question[] = [
  {
    id: 1,
    question: "Choose the correct answer (A, B, C, or D) to complete each sentence.\n\nThe day before Friday is ________.",
    answers: ["Monday", "Tuesday", "Thursday", "Sunday"],
    correctIndex: 2,
  },
  {
    id: 2,
    question: "Choose the correct answer (A, B, C, or D) to complete each sentence.\n\nA ________ lives next to my house.",
    answers: ["student", "cousin", "neighbour", "best friend"],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Choose the correct answer (A, B, C, or D) to complete each sentence.\n\nI am a ________ in Grade 3.",
    answers: ["cousin", "student", "neighbour", "partner"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Choose the correct answer (A, B, C, or D) to complete each sentence.\n\nMy ________ is my uncle's child.",
    answers: ["best friend", "neighbour", "student", "cousin"],
    correctIndex: 3,
  },
  {
    id: 5,
    question: "Choose the correct answer (A, B, C, or D) to complete each sentence.\n\nI work with my ________ in class.",
    answers: ["cousin", "neighbour", "partner", "student"],
    correctIndex: 2,
  },
];

export type BackendUser = {
  id: number | string;
  username: string;
  email: string;
};

export type SignupApiResponse = {
  success: boolean;
  user: BackendUser;
  token: string;
};

export type LoginApiResponse = {
  success: boolean;
  user: BackendUser;
  token: string;
};

export type LogoutApiResponse = {
  success: boolean;
  message?: string;
};

export type ExtractTextEvaluationQuestion = {
  question_id: string;
  question_text: string;
  answer_text: string;
  score: string;
  total_score: number;
  source: string;
  comments: string;
};

export type ExtractTextEvaluation = {
  success: boolean;
  source: string;
  total_score: number;
  questions: ExtractTextEvaluationQuestion[];
  message?: string;
};

export type ExtractTextResultItem = {
  file_name: string;
  content_type: string;
  extracted_text: string;
  evaluation?: ExtractTextEvaluation;
};

export type ExtractTextApiResponse = {
  success: boolean;
  results: ExtractTextResultItem[];
  message?: string;
};

export type EvaluateAnswerApiRequest = {
  question_text: string;
  student_answer: string;
  paper_id?: string;
  paper_code?: string;
  paper_number?: string;
};

export type EvaluateAnswerApiResponse = {
  success: boolean;
  question_id: string;
  evaluation: string;
  message?: string;
};

export type BatchPaperResult = {
  id: string;
  file_name: string;
  evaluation: string;
  message?: string;
};

export type HistoryItem = {
  id: string;
  created_at: string;
  user_id: string;
  title?: string;
  file_names: string[];
  evaluation: string;
  message?: string;
  /** Structured response from extract-text (if available). */
  extract_results?: ExtractTextResultItem[];
  paper_id?: string;
  paper_code?: string;
  paper_number?: string;
  question_id?: string;
  paper_results?: BatchPaperResult[];
  is_finalized?: boolean;
  raw?: unknown;
};

export type BackendHistoryEntry = {
  paper_id?: string;
  paper_code?: string;
  paper_number?: string;
  question_id?: string;
  evaluation_text: string;
  created_at: string;
};

export type HistoryApiResponse = {
  success: boolean;
  history: BackendHistoryEntry[];
  message?: string;
};

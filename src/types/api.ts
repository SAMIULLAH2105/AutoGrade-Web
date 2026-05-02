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

export type ExtractTextApiResponse = {
  success: boolean;
  extracted_text: string;
  question_text?: string;
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

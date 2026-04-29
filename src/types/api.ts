export type ExtractTextApiResponse = {
  success: boolean;
  extracted_text: {
    success: boolean;
    evaluation: string;
    message?: string;
  };
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
  paper_results?: BatchPaperResult[];
  is_finalized?: boolean;
  raw?: unknown;
};

export type HistoryApiResponse = {
  success: boolean;
  history: HistoryItem[];
  message?: string;
};

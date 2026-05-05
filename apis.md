# Backend API Documentation

Base path: `/api/`

## Authentication

### Signup
- `POST /api/signup/`
- Request headers: `Content-Type: application/json`
- Body:
```json
{
  "username": "teacher1",
  "email": "teacher1@example.com",
  "password": "SafePassword123"
}
```
- Success response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "teacher1",
    "email": "teacher1@example.com"
  },
  "token": "<auth-token>"
}
```
- Error responses:
  - `400` if username or email already exists
  - `400` for invalid request payload

### Login
- `POST /api/login/`
- Request headers: `Content-Type: application/json`
- Body:
```json
{
  "username": "teacher1",
  "password": "SafePassword123"
}
```
- Success response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "teacher1",
    "email": "teacher1@example.com"
  },
  "token": "<auth-token>"
}
```
- Error responses:
  - `401` invalid credentials
  - `400` malformed payload

### Logout
- `POST /api/logout/`
- Request headers:
  - `Content-Type: application/json`
  - `Authorization: Token <auth-token>`
- Body: `{}` or empty
- Success response:
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```
- Error responses:
  - `401` if token is missing or invalid
  - `500` if token deletion fails

## Evaluation History

### Get Evaluation History
- `GET /api/history/`
- Request headers:
  - `Authorization: Token <auth-token>`
- Success response:
```json
{
  "success": true,
  "history": [
    {
      "paper_id": "ISL-2025-2058/21-1",
      "paper_code": "2058/21",
      "paper_number": "1",
      "question_id": "q1a",
      "evaluation_text": "Score: 8/10...",
      "created_at": "2026-05-02T12:34:56.789Z"
    }
  ]
}
```
- Error responses:
  - `401` if authorization is missing or invalid

## Evaluation API

### Evaluate Answer
- `POST /api/evaluate-answer/`
- Request headers: `Content-Type: application/json`
- Body:
```json
{
  "question_text": "Explain the importance of Tajweed in recitation.",
  "student_answer": "Tajweed helps pronounce Quran properly...",
  "paper_id": "ISL-2025-2058/21-1",
  "paper_code": "2058/21",
  "paper_number": "1"
}
```
- Success response:
```json
{
  "success": true,
  "question_id": "<pinecone-question-id>",
  "evaluation": "Score: 8/10\nSuggestions for Improvement: ...",
  "message": "Evaluation completed successfully."
}
```
- Notes:
  - If the request is made with a valid auth token, the evaluation is also saved to user history.
  - `paper_id`, `paper_code`, and `paper_number` are optional metadata fields used for history logging.

## Text Extraction API

### Extract Text
- `POST /api/extract-text/`
- Request headers:
  - `Content-Type: multipart/form-data`
- Form fields:
  - `file`: image or PDF file
- Success response:
```json
{
  "success": true,
  "results": [
    {
      "file_name": "paper.pdf",
      "content_type": "application/pdf",
      "extracted_text": "--- Page 1 ---\n...",
      "evaluation": {
        "success": true,
        "source": "multi_question",
        "total_score": 1,
        "questions": [
          {
            "question_id": "...",
            "question_text": "",
            "answer_text": "...",
            "score": "1/1",
            "total_score": 1,
            "source": "pinecone",
            "comments": "Breakdown: ...\nSuggestions for Improvement: ..."
          }
        ],
        "message": "Evaluated extracted text."
      }
    }
  ],
  "message": "Files processed successfully."
}
```
- Error responses:
  - `400` if file is missing, invalid, or unsupported
  - `500` if Gemini API key is not configured or extraction fails

## Marking Scheme / Paper Management APIs

### Get Marks
- `POST /api/get-marks/`
- Request headers:
  - `Content-Type: multipart/form-data`
- Form fields:
  - `extracted_text`: text extracted from the answer sheet
  - `marking_scheme`: marking scheme image file
- Success response:
```json
{
  "success": true,
  "extracted_text": "Grading results and feedback...",
  "message": "Marks generated successfully."
}
```

### Upload Marking Scheme
- `POST /api/upload-marking-scheme/`
- Request headers:
  - `Content-Type: multipart/form-data`
- Form fields:
  - `file`: PDF file containing the marking scheme
- Success response:
```json
{
  "message": "Structured data generated successfully. Please review and confirm before saving.",
  "structured_data": { ... }
}
```
- Notes:
  - This endpoint extracts text from a marking scheme PDF and attempts to convert it into structured JSON.

### Save Marking Scheme
- `POST /api/save-marking-scheme/`
- Request headers: `Content-Type: application/json`
- Body:
```json
{
  "data": {
    "subject": "ISLAMIAT",
    "paper": "1",
    "code": "2058/21",
    "date": "May 2025",
    "questions": [
      {
        "question_number": "1",
        "subparts": [
          {
            "label": "(a)",
            "question_text": "Explain...",
            "expected_answer": "Expected marking points...",
            "max_marks": 5,
            "subparts": []
          }
        ]
      }
    ]
  }
}
```
- Success response:
```json
{
  "message": "Data saved successfully to Supabase"
}
```

### Manual Pinecone Insert
- `POST /api/manual-marking-scheme/`
- Request headers: `Content-Type: application/json`
- Body:
```json
{
  "exam_code": "2058/21",
  "question_id": "2058_21_Q1a",
  "question_text": "Describe the five pillars of Islam.",
  "max_marks": 10,
  "expected_answer": "Correct answer should mention..."
}
```
- Success response:
```json
{
  "message": "Successfully generated embedding and inserted into Pinecone!",
  "pinecone_id": "2058_21_Q1a"
}
```

## Authentication Notes
- Authenticated endpoints use DRF token authentication.
- Include header:
  - `Authorization: Token <auth-token>`
- Signup and login return the token to use for subsequent authenticated calls.

## Common error structure
- In general, error responses follow this format:
```json
{
  "error": "Description of error"
}
```

## Useful command
- Apply new migrations after changes:
```bash
python3 manage.py migrate
```

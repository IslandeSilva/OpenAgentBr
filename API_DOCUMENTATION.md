# API Documentation - OpenAgentBr

## Overview

This document describes the API endpoints available in the OpenAgentBr application.

## Authentication

All API endpoints require authentication via Supabase Auth. The user must be logged in and have a valid session.

---

## Endpoints

### 1. OpenRouter Validation

**POST** `/api/openrouter/validate`

Validates an OpenRouter API key, fetches account credits, and loads available AI models.

#### Request Body

```json
{
  "apiKey": "sk-or-v1-..."
}
```

#### Response (Success - 200)

```json
{
  "valid": true,
  "credits": {
    "total": 15.00,
    "used": 5.00,
    "remaining": 10.00
  },
  "modelsCount": 247
}
```

#### Response (Error - 400/401)

```json
{
  "error": "API Key inválida"
}
```

#### What it does:

1. Validates the API key format (must start with `sk-or-v1-`)
2. Validates the key with OpenRouter API
3. Fetches account credits information
4. Retrieves all available models from OpenRouter
5. Saves the API key to user_settings
6. Saves all models to available_models table
7. Returns validation status and credit information

---

### 2. Get Available Models

**GET** `/api/openrouter/models`

Retrieves the list of available AI models for the authenticated user.

#### Request

No body required. User must be authenticated.

#### Response (Success - 200)

```json
{
  "models": [
    {
      "id": "uuid",
      "model_id": "openai/gpt-4-turbo",
      "name": "GPT-4 Turbo",
      "provider": "openai",
      "pricing": {
        "prompt": 0.01,
        "completion": 0.03
      },
      "context_length": 128000,
      "supports_vision": false,
      "supports_function_calling": true
    }
  ],
  "count": 247
}
```

#### Response (Error - 401)

```json
{
  "error": "Não autenticado"
}
```

---

### 3. Chat with AI

**POST** `/api/chat`

Sends a message to an AI agent and receives a response.

#### Request Body

```json
{
  "message": "Hello, how are you?",
  "agentId": "uuid",
  "apiKey": "sk-or-v1-..."
}
```

#### Response (Success - 200)

```json
{
  "response": "I'm doing well, thank you! How can I assist you today?",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 12,
    "total_tokens": 57
  }
}
```

#### Response (Error - 400/404)

```json
{
  "error": "Agent not found"
}
```

#### What it does:

1. Validates the agent exists and belongs to the user
2. Fetches chat history (last 10 messages)
3. Builds the message array with system prompt
4. Calls OpenRouter API with the agent's configuration
5. Returns the AI response and token usage

---

### 4. Upload File

**POST** `/api/upload`

Uploads a file to Supabase Storage and saves metadata.

#### Request

Multipart form data with:
- `file`: The file to upload (max 10MB)
- `messageId`: (optional) UUID of the chat message to associate with

#### Supported File Types

- Images: PNG, JPG, JPEG, GIF, WebP
- Documents: PDF, TXT, MD, CSV

#### Response (Success - 200)

```json
{
  "id": "uuid",
  "fileName": "image.png",
  "fileType": "image/png",
  "fileSize": 1024000,
  "publicUrl": "https://storage.supabase.co/...",
  "storagePath": "user-id/timestamp_image.png"
}
```

#### Response (Error - 400)

```json
{
  "error": "Arquivo muito grande. Máximo 10MB"
}
```

#### What it does:

1. Validates file size (max 10MB)
2. Validates file type
3. Uploads to Supabase Storage bucket 'chat-files'
4. Generates public URL
5. Saves metadata to file_uploads table
6. Returns file information

---

### 5. Delete File

**DELETE** `/api/upload?id={fileId}`

Deletes a file from storage and database.

#### Query Parameters

- `id`: UUID of the file to delete

#### Response (Success - 200)

```json
{
  "success": true
}
```

#### Response (Error - 404)

```json
{
  "error": "Arquivo não encontrado"
}
```

#### What it does:

1. Verifies user owns the file
2. Deletes file from Supabase Storage
3. Deletes metadata from database
4. Returns success status

---

### 6. Get Usage Metrics

**GET** `/api/usage`

Retrieves usage statistics for the authenticated user.

#### Response (Success - 200)

```json
{
  "totalAgents": 5,
  "totalMessages": 127,
  "totalTokens": 45230
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Missing or invalid parameters |
| 401  | Unauthorized - Not authenticated or invalid API key |
| 404  | Not Found - Resource doesn't exist |
| 500  | Internal Server Error |

---

## Rate Limiting

Currently, there is no hard rate limiting implemented in the API. However, OpenRouter has its own rate limits based on your account tier.

**Recommendations:**
- Implement client-side debouncing for chat messages
- Cache model lists locally
- Don't refresh models too frequently (once per session is usually enough)

---

## Security Considerations

1. **API Keys**: Never expose OpenRouter API keys in client-side code. They are stored encrypted in the database and only used server-side.

2. **RLS Policies**: All database tables have Row Level Security enabled. Users can only access their own data.

3. **File Validation**: All uploads are validated for type and size before being accepted.

4. **Authentication**: All endpoints verify the user is authenticated before processing requests.

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Validate API Key
const validateKey = async (apiKey: string) => {
  const response = await fetch('/api/openrouter/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey })
  })
  return response.json()
}

// Send Chat Message
const sendMessage = async (message: string, agentId: string, apiKey: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, agentId, apiKey })
  })
  return response.json()
}

// Upload File
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  return response.json()
}
```

---

## Support

For issues or questions, please open an issue on the GitHub repository.

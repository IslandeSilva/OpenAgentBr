# 🧪 Testing Guide - OpenRouter Integration

## Overview

This guide helps you test all the new features implemented in the OpenRouter integration.

## ⚡ Quick Test (5 minutes)

Follow this fast path to verify everything works:

### 1. Start the Application
```bash
npm run dev
```
Visit http://localhost:3000

### 2. Test Settings Page
- [ ] Navigate to **Settings** in menu
- [ ] Paste your OpenRouter API key
- [ ] Click "Validar e Salvar API Key"
- [ ] Verify you see:
  - ✅ Success message
  - ✅ Credits displayed (total, used, remaining)
  - ✅ Number of models (should be 200+)

### 3. Test Model Selection
- [ ] Go to **Dashboard** > **Criar Novo Agente**
- [ ] Click on Model field
- [ ] Verify you see:
  - ✅ Search box appears
  - ✅ List of models with icons
  - ✅ Pricing information
  - ✅ Provider names

### 4. Test Chat
- [ ] Create a simple agent (any model)
- [ ] Click "Chat"
- [ ] Send message: "Hello!"
- [ ] Verify:
  - ✅ Response appears
  - ✅ Message is saved (refresh page, message still there)

### 5. Test File Upload
- [ ] In chat, click the 📎 paperclip icon
- [ ] Drag an image file
- [ ] Verify:
  - ✅ Upload progress shows
  - ✅ File appears in list
  - ✅ Can remove file with X button

**✅ If all above work, basic functionality is good!**

---

## 🔬 Comprehensive Test (30 minutes)

### Test 1: Settings Page - Full Workflow

#### 1.1 Invalid API Key
- [ ] Enter invalid key: `sk-or-invalid-123`
- [ ] Click "Validar e Salvar"
- [ ] **Expected**: Error message "Formato de API Key inválido"

#### 1.2 Valid API Key
- [ ] Enter real OpenRouter key
- [ ] Click "Validar e Salvar"
- [ ] **Expected**:
  - Green success message
  - Credits section appears
  - Models count > 0
  - Last sync timestamp

#### 1.3 Refresh Models
- [ ] Click "Atualizar Lista"
- [ ] **Expected**:
  - Loading indicator
  - Success message
  - Models count updated
  - New timestamp

#### 1.4 Credits Display
- [ ] Verify credits section shows:
  - [ ] Total credits (blue)
  - [ ] Used credits (orange)
  - [ ] Available credits (green)
  - [ ] All values are numbers with 2 decimals

---

### Test 2: Model Selection Component

#### 2.1 Model Search
- [ ] Open agent creation form
- [ ] Type "gpt" in model search
- [ ] **Expected**: Only GPT models shown

- [ ] Clear search, type "claude"
- [ ] **Expected**: Only Claude models shown

- [ ] Clear search, type "vision"
- [ ] **Expected**: Models with vision support shown

#### 2.2 Model Information Display
For each model in list, verify it shows:
- [ ] Model name (clear, readable)
- [ ] Provider (openai, anthropic, etc.)
- [ ] Pricing per 1K tokens
- [ ] Context length (e.g., "128K")
- [ ] Vision icon (👁️) if supported
- [ ] Function icon (⚡) if supported

#### 2.3 Model Selection
- [ ] Click on a model
- [ ] **Expected**:
  - Selected model highlighted (blue background)
  - Sparkle icon (✨) appears
  - Selection persists when scrolling

#### 2.4 No Models Scenario
- [ ] **Before** configuring API key, try to create agent
- [ ] **Expected**: 
  - Orange warning box
  - Message directing to Settings
  - Link to /settings works

---

### Test 3: File Upload System

#### 3.1 Upload Single Image
- [ ] Open chat interface
- [ ] Click 📎 button
- [ ] Upload area appears
- [ ] Drag a PNG image
- [ ] **Expected**:
  - Progress indicator
  - File appears in list with:
    - Image icon
    - File name
    - File size
    - Remove button (X)

#### 3.2 Upload Multiple Files
- [ ] Click 📎 again
- [ ] Select 3 images at once
- [ ] **Expected**:
  - All 3 upload
  - List shows "3 arquivo(s) anexado(s)"
  - Can remove individual files

#### 3.3 File Type Validation
Try uploading:
- [ ] .exe file → **Expected**: Error "Tipo de arquivo não permitido"
- [ ] .mp4 video → **Expected**: Error
- [ ] .pdf → **Expected**: Success
- [ ] .txt → **Expected**: Success

#### 3.4 File Size Validation
- [ ] Try uploading file > 10MB
- [ ] **Expected**: Error "Arquivo muito grande. Máximo 10MB"

#### 3.5 Drag and Drop
- [ ] Drag file over upload area
- [ ] **Expected**: 
  - Area changes color (blue border)
  - Drop releases uploads file

#### 3.6 Remove Files
- [ ] Upload 2 files
- [ ] Click X on first file
- [ ] **Expected**:
  - File removed from list
  - Other file remains
  - Count updates

---

### Test 4: Chat with Vision Models

#### 4.1 Select Vision Model
- [ ] Create agent with vision model:
  - `gpt-4-vision-preview`
  - `anthropic/claude-3-opus`
  - `google/gemini-pro-vision`

#### 4.2 Send Image
- [ ] Upload an image of a cat
- [ ] Type: "What's in this image?"
- [ ] Send
- [ ] **Expected**:
  - AI describes the image correctly
  - Response mentions "cat" or related

#### 4.3 Multiple Images
- [ ] Upload 2 different images
- [ ] Ask: "Compare these two images"
- [ ] **Expected**: AI analyzes both

---

### Test 5: Error Handling

#### 5.1 No API Key
- [ ] Remove API key from settings
- [ ] Try to chat
- [ ] **Expected**: Error "Configure sua API key do OpenRouter"

#### 5.2 Invalid Model
- [ ] Manually edit database to use fake model
- [ ] Try to chat
- [ ] **Expected**: Clear error message

#### 5.3 No Credits
- [ ] Use API key with $0 credits
- [ ] Try to chat
- [ ] **Expected**: OpenRouter error about credits

#### 5.4 Network Error
- [ ] Turn off internet
- [ ] Try to validate API key
- [ ] **Expected**: "Erro ao validar API Key"

---

### Test 6: UI/UX Features

#### 6.1 Loading States
Verify loading indicators appear for:
- [ ] API key validation
- [ ] Model refresh
- [ ] Chat message sending
- [ ] File upload

#### 6.2 Success Messages
Verify success messages appear for:
- [ ] API key saved
- [ ] Models refreshed
- [ ] Agent created

#### 6.3 Responsive Design
Test on:
- [ ] Desktop (1920px) - All elements visible
- [ ] Tablet (768px) - Layout adjusts
- [ ] Mobile (375px) - Stack vertically

#### 6.4 Dropdown Visibility
- [ ] All select dropdowns have visible text
- [ ] Options are readable
- [ ] Hover states work

---

### Test 7: Data Persistence

#### 7.1 Settings Persist
- [ ] Configure API key
- [ ] Refresh page
- [ ] Go back to Settings
- [ ] **Expected**: API key still there (masked)

#### 7.2 Models Persist
- [ ] Fetch models
- [ ] Refresh page
- [ ] Create agent
- [ ] **Expected**: Models still available (no re-fetch)

#### 7.3 Chat History
- [ ] Send 5 messages
- [ ] Refresh page
- [ ] **Expected**: All messages still visible

#### 7.4 File Metadata
- [ ] Upload file
- [ ] Check database `file_uploads` table
- [ ] **Expected**: Record exists with all fields

---

### Test 8: Security

#### 8.1 Row Level Security
Using Supabase SQL Editor:
```sql
-- Try to access another user's models
SELECT * FROM available_models 
WHERE user_id != auth.uid();
```
- [ ] **Expected**: Returns 0 rows (blocked by RLS)

#### 8.2 API Key Security
- [ ] Check browser DevTools > Network
- [ ] Look for API calls
- [ ] **Expected**: API key never visible in requests

#### 8.3 File Access
- [ ] Upload file
- [ ] Copy public URL
- [ ] Open in incognito/private window
- [ ] **Expected**: File accessible (public bucket)

#### 8.4 User Isolation
- [ ] Create agent as User A
- [ ] Login as User B
- [ ] Try to access User A's agent URL
- [ ] **Expected**: Redirect or not found

---

## 🐛 Known Issues / Limitations

Document any issues you find:

### Issue Template
```
**What**: Brief description
**Steps**: How to reproduce
**Expected**: What should happen
**Actual**: What actually happens
**Severity**: Low / Medium / High / Critical
```

---

## ✅ Final Checklist

Before marking as complete:

### Functionality
- [ ] Settings page works 100%
- [ ] Model selection works with search
- [ ] File upload accepts all valid types
- [ ] Chat returns real AI responses
- [ ] Vision models can see images
- [ ] Error messages are helpful

### Performance
- [ ] Page loads in < 3 seconds
- [ ] File upload shows progress
- [ ] Model search is instant
- [ ] No console errors

### Security
- [ ] RLS policies active
- [ ] API keys never exposed
- [ ] File validation works
- [ ] Users can't access others' data

### Documentation
- [ ] README is accurate
- [ ] API docs match implementation
- [ ] Setup guide works

---

## 📊 Test Results Template

```markdown
## Test Results - [Your Name] - [Date]

### Environment
- OS: 
- Browser: 
- Node Version: 
- Database: 

### Quick Test Results
- Settings Page: ✅ / ❌
- Model Selection: ✅ / ❌
- Chat: ✅ / ❌
- File Upload: ✅ / ❌

### Issues Found
1. [Issue description]
2. [Issue description]

### Overall: PASS / FAIL

### Notes
[Any additional comments]
```

---

## 🆘 Troubleshooting

### Settings page won't validate key
**Check**:
1. API key format: `sk-or-v1-...`
2. OpenRouter account has credits
3. Network connection
4. Browser console for errors

### Models not appearing
**Check**:
1. API key validated successfully
2. Check `available_models` table in Supabase
3. Try clicking "Atualizar Lista"
4. Check for API rate limits

### File upload fails
**Check**:
1. Bucket `chat-files` exists
2. Bucket is public
3. File size < 10MB
4. File type is allowed
5. Check Supabase storage permissions

### Chat not responding
**Check**:
1. OpenRouter credits available
2. Model exists and is active
3. Network connection
4. Browser console for errors
5. OpenRouter status page

---

## 📞 Getting Help

If tests fail:
1. Check SETUP_COMPLETO.md for setup issues
2. Check API_DOCUMENTATION.md for API issues  
3. Check SECURITY.md for security questions
4. Open GitHub issue with test results

---

**Happy Testing!** 🧪✨

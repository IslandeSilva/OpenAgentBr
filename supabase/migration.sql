-- Migration script to update existing OpenAgentBr database schema
-- Run this if you already have the database set up from the original schema.sql

-- Step 1: Add new columns to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS credits_total decimal,
ADD COLUMN IF NOT EXISTS credits_used decimal,
ADD COLUMN IF NOT EXISTS last_sync timestamp with time zone;

-- Step 2: Create available_models table
CREATE TABLE IF NOT EXISTS available_models (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  model_id text NOT NULL,
  name text NOT NULL,
  provider text NOT NULL,
  pricing jsonb NOT NULL,
  context_length integer,
  supports_vision boolean DEFAULT false,
  supports_function_calling boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 3: Enable RLS for available_models
ALTER TABLE available_models ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for available_models
CREATE POLICY IF NOT EXISTS "Users can view their own models"
  ON available_models FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own models"
  ON available_models FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own models"
  ON available_models FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own models"
  ON available_models FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Create file_uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  message_id uuid REFERENCES chat_messages,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  public_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 6: Enable RLS for file_uploads
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for file_uploads
CREATE POLICY IF NOT EXISTS "Users can view their own files"
  ON file_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own files"
  ON file_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own files"
  ON file_uploads FOR DELETE
  USING (auth.uid() = user_id);

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS available_models_user_id_idx ON available_models(user_id);
-- Note: Using unique index to prevent duplicate models per user
-- The validate endpoint handles updates by deleting old models first
CREATE UNIQUE INDEX IF NOT EXISTS available_models_user_model_idx ON available_models(user_id, model_id);
CREATE INDEX IF NOT EXISTS file_uploads_user_id_idx ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS file_uploads_message_id_idx ON file_uploads(message_id);

-- Step 9: Create Supabase Storage bucket for file uploads
-- Note: This must be done via the Supabase Dashboard or via the Supabase client
-- Bucket name: chat-files
-- Public: true
-- Allowed MIME types: image/*, application/pdf, text/*
-- File size limit: 10MB

-- Migration complete!
-- Next steps:
-- 1. Create the 'chat-files' storage bucket in Supabase Dashboard
-- 2. Configure your OpenRouter API key in the Settings page
-- 3. Click "Validate and Save" to fetch available models

-- Run this SQL in the Supabase SQL Editor (https://supabase.com/dashboard)

-- Create the checklist table
CREATE TABLE IF NOT EXISTS checklist (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE checklist ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own checklist" ON checklist
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own checklist" ON checklist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own checklist" ON checklist
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete own checklist" ON checklist
  FOR DELETE
  USING (auth.uid() = user_id);

/*
  # Create webtask table

  1. New Tables
    - `webtask`
      - `id` (bigint, primary key, auto-increment) - Unique identifier
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `created_at` (timestamptz) - Timestamp when task was created

  2. Security
    - Enable RLS on `webtask` table
    - Add policy for public access
*/

CREATE TABLE IF NOT EXISTS webtask (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webtask ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read webtask"
  ON webtask
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert webtask"
  ON webtask
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update webtask"
  ON webtask
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete webtask"
  ON webtask
  FOR DELETE
  USING (true);

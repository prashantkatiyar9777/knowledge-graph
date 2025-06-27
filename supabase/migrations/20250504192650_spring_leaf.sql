/*
  # Add Self Relationships Support

  1. New Tables
    - `self_relationships`
      - `id` (uuid, primary key)
      - `table_id` (uuid, references tables)
      - `field_id` (uuid, references relationship_fields)
      - `name` (text)
      - `alternative_names` (text[])
      - `description` (text)
      - `kg_status` (kg_status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `self_relationships` table
    - Add policy for authenticated users to read self relationships
*/

-- Create self_relationships table
CREATE TABLE IF NOT EXISTS self_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES tables(id) ON DELETE CASCADE,
  field_id uuid REFERENCES relationship_fields(id) ON DELETE CASCADE,
  name text NOT NULL,
  alternative_names text[] DEFAULT '{}',
  description text,
  kg_status kg_status DEFAULT 'Not Added',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE self_relationships ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow authenticated read access on self_relationships"
  ON self_relationships FOR SELECT TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_self_relationships_table_id ON self_relationships(table_id);
CREATE INDEX idx_self_relationships_field_id ON self_relationships(field_id);
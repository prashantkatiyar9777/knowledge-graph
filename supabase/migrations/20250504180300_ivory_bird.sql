/*
  # Add example values and create relationship fields table

  1. Changes
    - Add example_values array to value_fields table
    - Create relationship_fields table for storing relationship field metadata

  2. New Tables
    - relationship_fields
      - id (uuid, primary key)
      - name (text)
      - table_id (uuid, references tables)
      - type (text)
      - alternative_names (text array)
      - description (text)
      - mapped_to_table (uuid, references tables)
      - kg_status (kg_status enum)
      - created_at (timestamp)
      - updated_at (timestamp)

  3. Security
    - Enable RLS on relationship_fields table
    - Add policy for authenticated users to read relationship_fields
*/

-- Add example_values to value_fields table
ALTER TABLE value_fields
ADD COLUMN example_values text[] DEFAULT '{}';

-- Create relationship_fields table
CREATE TABLE IF NOT EXISTS relationship_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  table_id uuid REFERENCES tables(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'REFERENCE',
  alternative_names text[] DEFAULT '{}',
  description text,
  mapped_to_table uuid REFERENCES tables(id) ON DELETE SET NULL,
  kg_status kg_status DEFAULT 'Not Added',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE relationship_fields ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow authenticated read access on relationship_fields"
  ON relationship_fields FOR SELECT TO authenticated
  USING (true);

-- Create index
CREATE INDEX idx_relationship_fields_table_id ON relationship_fields(table_id);
CREATE INDEX idx_relationship_fields_mapped_to ON relationship_fields(mapped_to_table);
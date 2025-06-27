/*
  # Initial Schema Setup for Knowledge Graph Module

  1. New Tables
    - sources
      - id (uuid, primary key)
      - name (text, unique)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - tables
      - id (uuid, primary key)
      - name (text)
      - alternative_names (text array)
      - source_id (uuid, foreign key to sources)
      - fields_count (integer)
      - records_count (integer)
      - kg_records_count (integer)
      - description (text)
      - kg_status (enum)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - value_fields
      - id (uuid, primary key)
      - name (text)
      - table_id (uuid, foreign key to tables)
      - type (text)
      - alternative_names (text array)
      - description (text)
      - kg_status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create enum type for KG status
CREATE TYPE kg_status AS ENUM (
  'Added to KG',
  'Partially Added',
  'Not Added',
  'Error'
);

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  alternative_names text[] DEFAULT '{}',
  source_id uuid REFERENCES sources(id) ON DELETE CASCADE,
  fields_count integer DEFAULT 0,
  records_count integer DEFAULT 0,
  kg_records_count integer DEFAULT 0,
  description text,
  kg_status kg_status DEFAULT 'Not Added',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create value_fields table
CREATE TABLE IF NOT EXISTS value_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  table_id uuid REFERENCES tables(id) ON DELETE CASCADE,
  type text NOT NULL,
  alternative_names text[] DEFAULT '{}',
  description text,
  kg_status kg_status DEFAULT 'Not Added',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_fields ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access on sources"
  ON sources FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access on tables"
  ON tables FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access on value_fields"
  ON value_fields FOR SELECT TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_tables_source_id ON tables(source_id);
CREATE INDEX idx_value_fields_table_id ON value_fields(table_id);
/*
  # Insert Initial Data
  
  1. Sources
    - Insert predefined source systems
  
  2. Tables
    - Insert sample tables for testing
  
  3. Fields
    - Insert sample fields for testing
*/

-- Insert sources
INSERT INTO sources (name) VALUES
  ('SAP ERP'),
  ('Maximo ERP'),
  ('Pronto ERP'),
  ('Aveva Pi Historian'),
  ('GE Proficy Historian'),
  ('Factry Historian'),
  ('Oracle EAM'),
  ('Azure IoT Suite'),
  ('Siemens MindSphere IOT'),
  ('Siemens Opcenter MES'),
  ('GE Proficy MES'),
  ('Intelex Suite EHS')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tables
WITH source_ids AS (
  SELECT id, name FROM sources
)
INSERT INTO tables (name, source_id, fields_count, records_count, description, kg_status)
SELECT
  'ASSET_MASTER',
  id,
  24,
  1500,
  'Master data for all enterprise assets',
  'Not Added'
FROM source_ids
WHERE name = 'SAP ERP'
ON CONFLICT DO NOTHING;

-- Insert sample fields
WITH table_ids AS (
  SELECT id FROM tables WHERE name = 'ASSET_MASTER' LIMIT 1
)
INSERT INTO value_fields (name, table_id, type, description, kg_status)
VALUES
  ('ASSET_ID', (SELECT id FROM table_ids), 'UUID', 'Unique identifier for the asset', 'Not Added'),
  ('DESCRIPTION', (SELECT id FROM table_ids), 'TEXT', 'Descriptive text for the asset', 'Not Added'),
  ('STATUS', (SELECT id FROM table_ids), 'VARCHAR', 'Current status of the asset', 'Not Added'),
  ('MANUFACTURER', (SELECT id FROM table_ids), 'VARCHAR', 'Asset manufacturer', 'Not Added'),
  ('INSTALL_DATE', (SELECT id FROM table_ids), 'DATE', 'Installation date', 'Not Added')
ON CONFLICT DO NOTHING;
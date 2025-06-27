/*
  # Populate tables with sample data
  
  1. Sources
    - Inserts various ERP, Historian, and IoT systems
  
  2. Tables
    - Creates sample tables with metadata
    - Uses proper enum casting for kg_status
  
  3. Value Fields
    - Adds sample fields with types and examples
  
  4. Relationship Fields
    - Creates relationship fields between tables
*/

-- Ensure we have all sources
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

-- Insert sample tables for each source
WITH source_data AS (
  SELECT id, name FROM sources
)
INSERT INTO tables (name, source_id, alternative_names, fields_count, records_count, kg_records_count, description, kg_status)
SELECT
  'ASSET_MASTER',
  id,
  ARRAY['Asset Registry', 'Equipment Master'],
  24,
  1500,
  1200,
  'Master data for all enterprise assets including equipment, facilities, and tools',
  'Partially Added'::kg_status
FROM source_data WHERE name = 'SAP ERP'
UNION ALL
SELECT
  'EQUIPMENT',
  id,
  ARRAY['Technical Objects', 'Machine Registry'],
  32,
  2500,
  2500,
  'Detailed equipment data including specifications and maintenance history',
  'Added to KG'::kg_status
FROM source_data WHERE name = 'SAP ERP'
UNION ALL
SELECT
  'WORK_ORDERS',
  id,
  ARRAY['Maintenance Orders', 'Service Orders'],
  45,
  10000,
  0,
  'Work order data for maintenance, repairs, and service activities',
  'Not Added'::kg_status
FROM source_data WHERE name = 'Maximo ERP'
UNION ALL
SELECT
  'MEASUREMENTS',
  id,
  ARRAY['Process Data', 'Time Series'],
  15,
  50000,
  0,
  'Real-time process measurements and sensor data',
  'Not Added'::kg_status
FROM source_data WHERE name = 'GE Proficy Historian'
ON CONFLICT DO NOTHING;

-- Insert sample value fields
WITH table_data AS (
  SELECT id, name FROM tables
)
INSERT INTO value_fields (name, table_id, type, alternative_names, description, example_values, kg_status)
SELECT
  'ASSET_ID',
  id,
  'UUID',
  ARRAY['Equipment Number', 'Asset Number'],
  'Unique identifier for the asset',
  ARRAY['A1000123', 'A1000124', 'A1000125'],
  'Added to KG'::kg_status
FROM table_data WHERE name = 'ASSET_MASTER'
UNION ALL
SELECT
  'DESCRIPTION',
  id,
  'TEXT',
  ARRAY['Asset Description', 'Equipment Description'],
  'Detailed description of the asset',
  ARRAY['Centrifugal Pump', 'Electric Motor', 'Control Valve'],
  'Added to KG'::kg_status
FROM table_data WHERE name = 'ASSET_MASTER'
UNION ALL
SELECT
  'STATUS',
  id,
  'VARCHAR',
  ARRAY['Asset Status', 'Operating Status'],
  'Current operational status of the asset',
  ARRAY['Active', 'Inactive', 'Under Maintenance'],
  'Added to KG'::kg_status
FROM table_data WHERE name = 'ASSET_MASTER'
UNION ALL
SELECT
  'EQUIPMENT_ID',
  id,
  'UUID',
  ARRAY['Equipment Number'],
  'Unique identifier for the equipment',
  ARRAY['E1000123', 'E1000124', 'E1000125'],
  'Added to KG'::kg_status
FROM table_data WHERE name = 'EQUIPMENT'
UNION ALL
SELECT
  'MANUFACTURER',
  id,
  'VARCHAR',
  ARRAY['Equipment Manufacturer', 'Vendor'],
  'Equipment manufacturer name',
  ARRAY['Siemens', 'ABB', 'Schneider'],
  'Added to KG'::kg_status
FROM table_data WHERE name = 'EQUIPMENT'
ON CONFLICT DO NOTHING;

-- Insert sample relationship fields
WITH table_data AS (
  SELECT id, name FROM tables
)
INSERT INTO relationship_fields (name, table_id, type, alternative_names, description, mapped_to_table, kg_status)
SELECT
  'LOCATION_ID',
  t1.id,
  'REFERENCE',
  ARRAY['Site Location', 'Installation Location'],
  'Reference to the physical location of the asset',
  t2.id,
  'Added to KG'::kg_status
FROM table_data t1, table_data t2
WHERE t1.name = 'ASSET_MASTER' AND t2.name = 'EQUIPMENT'
UNION ALL
SELECT
  'PARENT_EQUIPMENT_ID',
  t1.id,
  'REFERENCE',
  ARRAY['Parent Equipment', 'Superior Equipment'],
  'Reference to the parent equipment in hierarchy',
  t1.id,
  'Added to KG'::kg_status
FROM table_data t1
WHERE t1.name = 'EQUIPMENT'
UNION ALL
SELECT
  'ASSET_ID',
  t1.id,
  'REFERENCE',
  ARRAY['Related Asset', 'Equipment Reference'],
  'Reference to the asset related to this work order',
  t2.id,
  'Not Added'::kg_status
FROM table_data t1, table_data t2
WHERE t1.name = 'WORK_ORDERS' AND t2.name = 'ASSET_MASTER'
ON CONFLICT DO NOTHING;
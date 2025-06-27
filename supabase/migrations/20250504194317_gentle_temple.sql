-- Insert additional sources if they don't exist
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

-- Insert 40 tables with realistic data
WITH source_data AS (
  SELECT id, name FROM sources
)
INSERT INTO tables (name, source_id, alternative_names, fields_count, records_count, kg_records_count, description, kg_status)
SELECT
  table_name,
  source_id,
  alternative_names,
  fields_count,
  records_count,
  kg_records_count,
  description,
  kg_status::kg_status
FROM (
  VALUES
    -- SAP ERP Tables
    ('EQUI', 
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Equipment Master', 'Technical Objects'],
      45, 20000, 18500,
      'Equipment master data containing technical objects and specifications',
      'Partially Added'),
    
    ('IFLOT',
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Functional Locations', 'Technical Locations'],
      35, 8000, 8000,
      'Functional location hierarchy and structure',
      'Added to KG'),
    
    ('AUFK',
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Work Order Header', 'Maintenance Orders'],
      40, 150000, 0,
      'Work order header data for maintenance activities',
      'Not Added'),
    
    ('MSEG',
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Material Movements', 'Stock Movements'],
      38, 500000, 0,
      'Material movement and stock transaction records',
      'Not Added'),

    -- Maximo ERP Tables
    ('ASSET',
      (SELECT id FROM source_data WHERE name = 'Maximo ERP'),
      ARRAY['Asset Registry', 'Enterprise Assets'],
      42, 15000, 15000,
      'Enterprise asset management master data',
      'Added to KG'),
    
    ('WORKORDER',
      (SELECT id FROM source_data WHERE name = 'Maximo ERP'),
      ARRAY['Work Orders', 'Service Orders'],
      55, 200000, 180000,
      'Work order management and tracking',
      'Partially Added'),
    
    ('LOCATIONS',
      (SELECT id FROM source_data WHERE name = 'Maximo ERP'),
      ARRAY['Asset Locations', 'Site Locations'],
      28, 5000, 5000,
      'Physical and logical location hierarchy',
      'Added to KG'),
    
    ('INVENTORY',
      (SELECT id FROM source_data WHERE name = 'Maximo ERP'),
      ARRAY['Stock Items', 'Materials'],
      35, 75000, 0,
      'Inventory and materials management',
      'Not Added'),

    -- Aveva Pi Historian Tables
    ('PIPoint',
      (SELECT id FROM source_data WHERE name = 'Aveva Pi Historian'),
      ARRAY['Tags', 'Process Points'],
      25, 100000, 100000,
      'Process data points and tag configurations',
      'Added to KG'),
    
    ('PIValue',
      (SELECT id FROM source_data WHERE name = 'Aveva Pi Historian'),
      ARRAY['Historical Data', 'Time Series'],
      15, 10000000, 0,
      'Historical time-series process data',
      'Error'),
    
    ('PIEvent',
      (SELECT id FROM source_data WHERE name = 'Aveva Pi Historian'),
      ARRAY['Events', 'Alarms'],
      30, 500000, 450000,
      'Process events and alarm history',
      'Partially Added'),

    -- GE Proficy Historian Tables
    ('A_TAGS',
      (SELECT id FROM source_data WHERE name = 'GE Proficy Historian'),
      ARRAY['Tag Configuration', 'Data Points'],
      28, 80000, 80000,
      'Tag configuration and metadata',
      'Added to KG'),
    
    ('A_PROCESSDATA',
      (SELECT id FROM source_data WHERE name = 'GE Proficy Historian'),
      ARRAY['Process Data', 'Time Series Data'],
      20, 15000000, 0,
      'Real-time and historical process data',
      'Not Added'),
    
    ('A_ALARMS',
      (SELECT id FROM source_data WHERE name = 'GE Proficy Historian'),
      ARRAY['Alarm History', 'Event Log'],
      32, 750000, 700000,
      'Process alarms and event history',
      'Partially Added'),

    -- Oracle EAM Tables
    ('EAM_ORGANIZATIONS',
      (SELECT id FROM source_data WHERE name = 'Oracle EAM'),
      ARRAY['Organizations', 'Business Units'],
      25, 1000, 1000,
      'Enterprise organization hierarchy',
      'Added to KG'),
    
    ('EAM_ASSETS',
      (SELECT id FROM source_data WHERE name = 'Oracle EAM'),
      ARRAY['Asset Master', 'Equipment Registry'],
      48, 25000, 22000,
      'Enterprise asset and equipment data',
      'Partially Added'),
    
    ('EAM_WORK_ORDERS',
      (SELECT id FROM source_data WHERE name = 'Oracle EAM'),
      ARRAY['Maintenance Orders', 'Work Requests'],
      52, 300000, 0,
      'Work order and maintenance management',
      'Not Added'),

    -- Azure IoT Suite Tables
    ('DEVICES',
      (SELECT id FROM source_data WHERE name = 'Azure IoT Suite'),
      ARRAY['IoT Devices', 'Connected Assets'],
      35, 50000, 50000,
      'IoT device registry and configuration',
      'Added to KG'),
    
    ('TELEMETRY',
      (SELECT id FROM source_data WHERE name = 'Azure IoT Suite'),
      ARRAY['Device Data', 'Sensor Readings'],
      20, 20000000, 0,
      'IoT device telemetry and sensor data',
      'Not Added'),
    
    ('DEVICE_TWINS',
      (SELECT id FROM source_data WHERE name = 'Azure IoT Suite'),
      ARRAY['Digital Twins', 'Device State'],
      40, 50000, 45000,
      'Digital twin configurations and state',
      'Partially Added'),

    -- Siemens MindSphere Tables
    ('ASSETS_HIERARCHY',
      (SELECT id FROM source_data WHERE name = 'Siemens MindSphere IOT'),
      ARRAY['Asset Structure', 'Equipment Hierarchy'],
      30, 10000, 10000,
      'Industrial asset hierarchy and relationships',
      'Added to KG'),
    
    ('ASPECTS',
      (SELECT id FROM source_data WHERE name = 'Siemens MindSphere IOT'),
      ARRAY['Asset Aspects', 'Data Models'],
      25, 5000, 4500,
      'Asset aspect and characteristic definitions',
      'Partially Added'),
    
    ('TIMESERIES',
      (SELECT id FROM source_data WHERE name = 'Siemens MindSphere IOT'),
      ARRAY['Time Series Data', 'Sensor Data'],
      15, 25000000, 0,
      'Time-series data from industrial assets',
      'Not Added'),

    -- Siemens Opcenter MES Tables
    ('PRODUCTION_ORDERS',
      (SELECT id FROM source_data WHERE name = 'Siemens Opcenter MES'),
      ARRAY['Manufacturing Orders', 'Work Orders'],
      45, 400000, 350000,
      'Production order management and tracking',
      'Partially Added'),
    
    ('OPERATIONS',
      (SELECT id FROM source_data WHERE name = 'Siemens Opcenter MES'),
      ARRAY['Work Centers', 'Production Steps'],
      38, 800000, 800000,
      'Manufacturing operations and work centers',
      'Added to KG'),
    
    ('MATERIAL_LOTS',
      (SELECT id FROM source_data WHERE name = 'Siemens Opcenter MES'),
      ARRAY['Material Batches', 'Production Lots'],
      42, 1000000, 0,
      'Material lot and batch tracking',
      'Not Added'),

    -- GE Proficy MES Tables
    ('WORK_PROCESS',
      (SELECT id FROM source_data WHERE name = 'GE Proficy MES'),
      ARRAY['Production Process', 'Work Instructions'],
      35, 50000, 50000,
      'Manufacturing process definitions',
      'Added to KG'),
    
    ('EQUIPMENT_LOG',
      (SELECT id FROM source_data WHERE name = 'GE Proficy MES'),
      ARRAY['Equipment History', 'Machine Log'],
      30, 750000, 700000,
      'Equipment operation and event history',
      'Partially Added'),
    
    ('QUALITY_RESULTS',
      (SELECT id FROM source_data WHERE name = 'GE Proficy MES'),
      ARRAY['QC Data', 'Quality Checks'],
      40, 2000000, 0,
      'Quality control measurements and results',
      'Not Added'),

    -- Intelex EHS Suite Tables
    ('INCIDENTS',
      (SELECT id FROM source_data WHERE name = 'Intelex Suite EHS'),
      ARRAY['Safety Incidents', 'EHS Events'],
      50, 25000, 25000,
      'Safety and environmental incident records',
      'Added to KG'),
    
    ('AUDITS',
      (SELECT id FROM source_data WHERE name = 'Intelex Suite EHS'),
      ARRAY['Safety Audits', 'Compliance Checks'],
      45, 10000, 9500,
      'Safety and compliance audit data',
      'Partially Added'),
    
    ('RISK_ASSESSMENTS',
      (SELECT id FROM source_data WHERE name = 'Intelex Suite EHS'),
      ARRAY['Risk Analysis', 'Hazard Assessments'],
      48, 15000, 0,
      'Risk assessment and hazard analysis',
      'Not Added'),

    -- Factry Historian Tables
    ('TAGS_MASTER',
      (SELECT id FROM source_data WHERE name = 'Factry Historian'),
      ARRAY['Tag Registry', 'Data Points'],
      30, 60000, 60000,
      'Process tag configuration and metadata',
      'Added to KG'),
    
    ('MEASUREMENTS',
      (SELECT id FROM source_data WHERE name = 'Factry Historian'),
      ARRAY['Process Data', 'Time Series'],
      20, 8000000, 0,
      'Historical process measurements',
      'Not Added'),
    
    ('BATCH_HISTORY',
      (SELECT id FROM source_data WHERE name = 'Factry Historian'),
      ARRAY['Batch Records', 'Production History'],
      35, 100000, 90000,
      'Batch production history and genealogy',
      'Partially Added'),

    -- Pronto ERP Tables
    ('STOCK_ITEMS',
      (SELECT id FROM source_data WHERE name = 'Pronto ERP'),
      ARRAY['Inventory Items', 'Products'],
      40, 50000, 50000,
      'Stock item master and inventory data',
      'Added to KG'),
    
    ('WORK_CENTRES',
      (SELECT id FROM source_data WHERE name = 'Pronto ERP'),
      ARRAY['Production Centers', 'Cost Centers'],
      35, 2000, 1800,
      'Work center and production unit definitions',
      'Partially Added'),
    
    ('JOB_COSTING',
      (SELECT id FROM source_data WHERE name = 'Pronto ERP'),
      ARRAY['Project Costs', 'Job Costs'],
      45, 500000, 0,
      'Job and project cost tracking',
      'Not Added'),

    -- Additional SAP Tables
    ('MARA',
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Material Master', 'Product Master'],
      50, 100000, 90000,
      'Material master data and specifications',
      'Partially Added'),
    
    ('MARC',
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Plant Data', 'Material Plant'],
      42, 200000, 200000,
      'Plant-specific material data',
      'Added to KG'),
    
    ('MAKT',
      (SELECT id FROM source_data WHERE name = 'SAP ERP'),
      ARRAY['Material Descriptions', 'Product Texts'],
      25, 300000, 0,
      'Material descriptions in multiple languages',
      'Not Added')
) AS data(table_name, source_id, alternative_names, fields_count, records_count, kg_records_count, description, kg_status)
ON CONFLICT DO NOTHING;
// Mock data for the application
import { TableData, TableField, Relationship, SyncJob, AuditLog } from '../types';

// Extended mock data for tables
const mockTableData: TableData[] = [
  // SAP Tables
  {
    id: 'sap-equi',
    name: 'EquipmentMaster',
    alternateNames: ['AssetRegistry', 'PlantEquipment'],
    description: 'Master record of all plant equipment and technical assets',
    source: 'SAP HANA ERP',
    fields: 45,
    records: 20000,
    kgStatus: 'mapped',
    lastSync: '2025-05-10T14:30:00Z',
    kgRecords: 20000,
    hasMetadata: true
  },
  {
    id: 'sap-iflot',
    name: 'FunctionalLocationMaster',
    alternateNames: ['PlantLocations', 'EquipmentSites'],
    description: 'Hierarchical structure of plant functional locations',
    source: 'SAP HANA ERP',
    fields: 35,
    records: 8000,
    kgStatus: 'mapped',
    lastSync: '2025-05-10T14:30:00Z',
    kgRecords: 8000,
    hasMetadata: true
  },
  // Factry Historian Tables
  {
    id: 'factry-tags',
    name: 'TAG_MASTER',
    alternateNames: ['Process Tags', 'Data Points'],
    description: 'Process tag configuration and metadata',
    source: 'Factry Historian',
    fields: 25,
    records: 50000,
    kgStatus: 'mapped',
    lastSync: '2025-05-10T15:00:00Z',
    kgRecords: 50000,
    hasMetadata: true
  },
  {
    id: 'factry-data',
    name: 'TIME_SERIES_DATA',
    alternateNames: ['Historical Data', 'Process Values'],
    description: 'Historical time-series process data',
    source: 'Factry Historian',
    fields: 15,
    records: 5000000,
    kgStatus: 'pending',
    lastSync: null,
    kgRecords: 0,
    hasMetadata: false
  },
  // Azure IoT Tables
  {
    id: 'azure-devices',
    name: 'DEVICES',
    alternateNames: ['IoT Devices', 'Connected Assets'],
    description: 'IoT device registry and configuration',
    source: 'Azure IoT Suite',
    fields: 35,
    records: 50000,
    kgStatus: 'mapped',
    lastSync: '2025-05-10T18:00:00Z',
    kgRecords: 50000,
    hasMetadata: true
  },
  {
    id: 'azure-telemetry',
    name: 'TELEMETRY',
    alternateNames: ['Device Data', 'Sensor Readings'],
    description: 'IoT device telemetry and sensor data',
    source: 'Azure IoT Suite',
    fields: 20,
    records: 20000000,
    kgStatus: 'pending',
    lastSync: null,
    kgRecords: 0,
    hasMetadata: false
  },
  // Intelex EHS Tables
  {
    id: 'ehs-incidents',
    name: 'INCIDENTS',
    alternateNames: ['Safety Incidents', 'EHS Events'],
    description: 'Safety and environmental incident records',
    source: 'Intelex Suite EHS',
    fields: 50,
    records: 25000,
    kgStatus: 'mapped',
    lastSync: '2025-05-10T17:00:00Z',
    kgRecords: 25000,
    hasMetadata: true
  },
  {
    id: 'ehs-audits',
    name: 'AUDITS',
    alternateNames: ['Safety Audits', 'Compliance Checks'],
    description: 'Safety and compliance audit data',
    source: 'Intelex Suite EHS',
    fields: 45,
    records: 10000,
    kgStatus: 'partially_mapped',
    lastSync: '2025-05-10T13:00:00Z',
    kgRecords: 9500,
    hasMetadata: true
  },
  // GE Proficy MES Tables
  {
    id: 'mes-orders',
    name: 'PRODUCTION_ORDERS',
    alternateNames: ['Manufacturing Orders', 'Work Orders'],
    description: 'Production order management and tracking',
    source: 'GE Proficy Smart Factory MES',
    fields: 45,
    records: 400000,
    kgStatus: 'partially_mapped',
    lastSync: '2025-05-10T07:00:00Z',
    kgRecords: 350000,
    hasMetadata: true
  },
  {
    id: 'mes-operations',
    name: 'OPERATIONS',
    alternateNames: ['Work Centers', 'Production Steps'],
    description: 'Manufacturing operations and work centers',
    source: 'GE Proficy Smart Factory MES',
    fields: 38,
    records: 800000,
    kgStatus: 'mapped',
    lastSync: '2025-05-10T20:00:00Z',
    kgRecords: 800000,
    hasMetadata: true
  }
];

// Mock audit logs data
const mockAuditLogs = [
  {
    id: 'audit-1',
    timestamp: '2025-05-04T12:30:00Z',
    user: 'john.doe@example.com',
    entity: 'Table',
    entityName: 'ASSET_MASTER',
    action: 'Updated',
    details: 'Updated table metadata: Added description and modified knowledge graph mapping status'
  },
  {
    id: 'audit-2',
    timestamp: '2025-05-04T12:15:00Z',
    user: 'jane.smith@example.com',
    entity: 'Field',
    entityName: 'EQUIPMENT.EQUIPMENT_TYPE',
    action: 'Created',
    details: 'Added new field EQUIPMENT_TYPE to EQUIPMENT table with type STRING'
  },
  {
    id: 'audit-3',
    timestamp: '2025-05-04T11:45:00Z',
    user: 'admin@example.com',
    entity: 'Relationship',
    entityName: 'HAS_LOCATION',
    action: 'Created',
    details: 'Created new relationship between ASSET_MASTER.LOCATION_ID and LOCATIONS.ID'
  },
  {
    id: 'audit-4',
    timestamp: '2025-05-04T11:30:00Z',
    user: 'john.doe@example.com',
    entity: 'Integration',
    entityName: 'SAP Connection',
    action: 'Updated',
    details: 'Updated connection credentials and sync schedule'
  },
  {
    id: 'audit-5',
    timestamp: '2025-05-04T11:00:00Z',
    user: 'jane.smith@example.com',
    entity: 'Table',
    entityName: 'WORK_ORDERS',
    action: 'Deleted',
    details: 'Removed deprecated work orders table from schema'
  }
];

// Mock sync jobs data
const mockSyncJobs = [
  {
    id: 'sync-1',
    name: 'Asset Master Full Sync',
    type: 'Full Sync',
    schedule: 'Every 24 hours',
    lastRun: '2025-05-04T10:00:00Z',
    nextRun: '2025-05-05T10:00:00Z',
    status: 'Success',
    tablesCovered: ['ASSET_MASTER', 'LOCATIONS']
  },
  {
    id: 'sync-2',
    name: 'Equipment Delta Sync',
    type: 'Delta Sync',
    schedule: 'Every 6 hours',
    lastRun: '2025-05-04T08:00:00Z',
    nextRun: '2025-05-04T14:00:00Z',
    status: 'Running',
    tablesCovered: ['EQUIPMENT']
  },
  {
    id: 'sync-3',
    name: 'Work Orders Sync',
    type: 'Full Sync',
    schedule: 'Every 12 hours',
    lastRun: '2025-05-04T06:00:00Z',
    nextRun: '2025-05-04T18:00:00Z',
    status: 'Failed',
    tablesCovered: ['WORK_ORDERS', 'ASSET_MASTER']
  }
];

// Mock relationships data
const mockRelationships = [
  {
    id: 'rel-1',
    fromField: 'LOCATION_ID',
    fromTable: 'AssetRegistry',
    toField: 'LOCATION_ID',
    toTable: 'LocationHierarchy',
    name: 'ASSET_AT_LOCATION',
    description: 'Links each asset to its physical location'
  },
  {
    id: 'rel-2',
    fromField: 'PARENT_LOCATION_ID',
    fromTable: 'LocationHierarchy',
    toField: 'LOCATION_ID',
    toTable: 'LocationHierarchy',
    name: 'PARENT_OF',
    description: 'Hierarchical parent–child link between locations'
  },
  {
    id: 'rel-3',
    fromField: 'EQUIPMENT_ID',
    fromTable: 'EquipmentMaster',
    toField: 'ASSET_ID',
    toTable: 'AssetRegistry',
    name: 'EQUIPMENT_IS_ASSET',
    description: 'Relates equipment record back to the asset registry'
  },
  {
    id: 'rel-4',
    fromField: 'ASSET_ID',
    fromTable: 'WorkOrderMaster',
    toField: 'ASSET_ID',
    toTable: 'AssetRegistry',
    name: 'WORKORDER_FOR',
    description: 'Associates each work order with its asset'
  },
  {
    id: 'rel-5',
    fromField: 'TAG_ID',
    fromTable: 'TimeSeriesData',
    toField: 'TAG_ID',
    toTable: 'TagDefinitions',
    name: 'MEASURED_BY',
    description: 'Connects time series readings to tag definitions'
  },
  {
    id: 'rel-6',
    fromField: 'DEVICE_ID',
    fromTable: 'TelemetryRecords',
    toField: 'DEVICE_ID',
    toTable: 'DeviceRegistry',
    name: 'TELEMETRY_FROM',
    description: 'Links each telemetry reading to its device'
  },
  {
    id: 'rel-7',
    fromField: 'PRODUCTION_ORDER_ID',
    fromTable: 'MaterialLots',
    toField: 'ORDER_ID',
    toTable: 'ProductionOrders',
    name: 'BATCH_OF',
    description: 'Indicates which production order produced each lot'
  }
];

// Mock fields data organized by table ID
const mockFields = {
  'sap-equi': [                  // EquipmentMaster
    { id: 'equi-1', name: 'ASSET_ID', type: 'UUID', alternateName: 'asset,assetId', description: 'PK for asset registry', isRequired: true },
    { id: 'equi-2', name: 'EQUIPMENT_TAG', type: 'STRING', alternateName: 'tag,label', description: 'Unique equipment tag label', isRequired: true },
    { id: 'equi-3', name: 'MODEL_NUMBER', type: 'STRING', alternateName: 'model', description: 'Manufacturer model number', isRequired: false },
    { id: 'equi-4', name: 'INSTALL_DATE', type: 'DATETIME', alternateName: 'commissionDate', description: 'Date equipment was installed', isRequired: false },
    { id: 'equi-5', name: 'LOCATION_ID', type: 'REFERENCE', alternateName: 'locId', description: 'FK to LocationHierarchy', isRequired: true }
  ],
  'sap-iflot': [                 // FunctionalLocationMaster
    { id: 'floc-1', name: 'LOCATION_ID', type: 'UUID', alternateName: 'locId', description: 'PK for functional location', isRequired: true },
    { id: 'floc-2', name: 'SITE_CODE', type: 'STRING', alternateName: 'site', description: 'Plant site code', isRequired: true },
    { id: 'floc-3', name: 'DESCRIPTION', type: 'STRING', alternateName: 'desc', description: 'Location description', isRequired: false },
    { id: 'floc-4', name: 'PARENT_LOCATION_ID', type: 'REFERENCE', alternateName: 'parent', description: 'Self-FK to parent location', isRequired: false }
  ],
  'sap-aufk': [                  // MaintenanceOrders
    { id: 'aufk-1', name: 'ORDER_ID', type: 'UUID', alternateName: 'orderId', description: 'PK for work order', isRequired: true },
    { id: 'aufk-2', name: 'ASSET_ID', type: 'REFERENCE', alternateName: 'asset', description: 'FK to AssetRegistry', isRequired: true },
    { id: 'aufk-3', name: 'ORDER_STATUS', type: 'STRING', alternateName: 'status', description: 'Current status of the order', isRequired: true },
    { id: 'aufk-4', name: 'PRIORITY', type: 'STRING', alternateName: 'prio', description: 'Order priority level', isRequired: false },
    { id: 'aufk-5', name: 'SCHEDULED_DATE', type: 'DATETIME', alternateName: 'schedDate', description: 'Planned start date', isRequired: false }
  ],
  'sap-mara': [                  // MaterialMaster
    { id: 'mara-1', name: 'MATERIAL_ID', type: 'UUID', alternateName: 'matId', description: 'PK for material master', isRequired: true },
    { id: 'mara-2', name: 'MATERIAL_NAME', type: 'STRING', alternateName: 'name', description: 'Material or part name', isRequired: true },
    { id: 'mara-3', name: 'UNIT_OF_MEASURE', type: 'STRING', alternateName: 'uom', description: 'Inventory unit', isRequired: true },
    { id: 'mara-4', name: 'CATEGORY', type: 'STRING', alternateName: 'type', description: 'Material category', isRequired: false }
  ],
  'max-asset': [                 // AssetRegistry
    { id: 'asset-1', name: 'ASSET_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'asset-2', name: 'ASSET_NAME', type: 'STRING', alternateName: 'name', description: 'Asset display name', isRequired: true },
    { id: 'asset-3', name: 'LOCATION_ID', type: 'REFERENCE', alternateName: 'locId', description: 'FK to LocationHierarchy', isRequired: true },
    { id: 'asset-4', name: 'INSTALL_DATE', type: 'DATETIME', alternateName: 'installed', description: 'Installation timestamp', isRequired: false }
  ],
  'max-workorder': [             // WorkOrderMaster
    { id: 'wo-1', name: 'ORDER_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'wo-2', name: 'ASSET_ID', type: 'REFERENCE', alternateName: 'asset', description: 'FK to AssetRegistry', isRequired: true },
    { id: 'wo-3', name: 'CREATED_BY', type: 'STRING', alternateName: 'createdBy', description: 'User who created order', isRequired: true },
    { id: 'wo-4', name: 'CREATION_DATE', type: 'DATETIME', alternateName: 'createdAt', description: 'Timestamp of creation', isRequired: true }
  ],
  'max-locations': [             // LocationHierarchy
    { id: 'loc-1', name: 'LOCATION_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'loc-2', name: 'LOCATION_NAME', type: 'STRING', alternateName: 'name', description: 'Location display name', isRequired: true },
    { id: 'loc-3', name: 'PARENT_LOCATION_ID', type: 'REFERENCE', alternateName: 'parent', description: 'Self-FK to parent location', isRequired: false }
  ],
  'pi-point': [                  // TagDefinitions
    { id: 'pi-1', name: 'TAG_ID', type: 'UUID', alternateName: 'tag', description: 'Primary key', isRequired: true },
    { id: 'pi-2', name: 'TAG_NAME', type: 'STRING', alternateName: 'name', description: 'Tag display name', isRequired: true },
    { id: 'pi-3', name: 'ENGINEERING_UNITS', type: 'STRING', alternateName: 'uom', description: 'Units of measure', isRequired: false }
  ],
  'pi-value': [                  // TimeSeriesData
    { id: 'ts-1', name: 'RECORD_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'ts-2', name: 'TAG_ID', type: 'REFERENCE', alternateName: 'tag', description: 'FK to TagDefinitions', isRequired: true },
    { id: 'ts-3', name: 'TIMESTAMP', type: 'DATETIME', alternateName: 'time', description: 'Reading timestamp', isRequired: true },
    { id: 'ts-4', name: 'VALUE', type: 'NUMBER', alternateName: 'reading', description: 'Sensor reading value', isRequired: true }
  ],
  'iot-devices': [               // DeviceRegistry
    { id: 'dev-1', name: 'DEVICE_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'dev-2', name: 'DEVICE_NAME', type: 'STRING', alternateName: 'name', description: 'Device display name', isRequired: true },
    { id: 'dev-3', name: 'MODEL', type: 'STRING', alternateName: 'model', description: 'Device model identifier', isRequired: false }
  ],
  'iot-telemetry': [             // TelemetryRecords
    { id: 'tel-1', name: 'RECORD_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'tel-2', name: 'DEVICE_ID', type: 'REFERENCE', alternateName: 'device', description: 'FK to DeviceRegistry', isRequired: true },
    { id: 'tel-3', name: 'TIMESTAMP', type: 'DATETIME', alternateName: 'time', description: 'Telemetry timestamp', isRequired: true },
    { id: 'tel-4', name: 'MEASUREMENT', type: 'NUMBER', alternateName: 'value', description: 'Sensor measurement', isRequired: true }
  ],
  'mes-orders': [                 // ProductionOrders
    { id: 'po-1', name: 'ORDER_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'po-2', name: 'PRODUCT_CODE', type: 'STRING', alternateName: 'prodCode', description: 'Code of manufactured product', isRequired: true },
    { id: 'po-3', name: 'QUANTITY', type: 'NUMBER', alternateName: 'qty', description: 'Planned production quantity', isRequired: true },
    { id: 'po-4', name: 'START_DATE', type: 'DATETIME', alternateName: 'start', description: 'Production start date', isRequired: false }
  ],
  'mes-lots': [                   // MaterialLots
    { id: 'lot-1', name: 'LOT_ID', type: 'UUID', alternateName: 'id', description: 'Primary key', isRequired: true },
    { id: 'lot-2', name: 'PRODUCTION_ORDER_ID', type: 'REFERENCE', alternateName: 'order', description: 'FK to ProductionOrders', isRequired: true },
    { id: 'lot-3', name: 'BATCH_QUANTITY', type: 'NUMBER', alternateName: 'batchQty', description: 'Quantity in this lot', isRequired: true }
  ]
};

// Mock inverse relationships data
const mockInverseRelationships = [
  {
    id: 'inv-rel-1',
    fieldName: 'LOCATION_ID',
    tableName: 'ASSET_MASTER',
    mappedTo: 'LOCATIONS.ID',
    inverseName: ['located_at', 'has_location'],
    description: 'Inverse relationship for asset location',
    kgStatus: 'Added to KG'
  },
  {
    id: 'inv-rel-2',
    fieldName: 'PARENT_ID',
    tableName: 'EQUIPMENT',
    mappedTo: 'EQUIPMENT.ID',
    inverseName: ['is_parent_of', 'contains'],
    description: 'Inverse relationship for equipment hierarchy',
    kgStatus: 'Pending'
  },
  {
    id: 'inv-rel-3',
    fieldName: 'ASSET_ID',
    tableName: 'WORK_ORDERS',
    mappedTo: 'ASSET_MASTER.ID',
    inverseName: ['has_work_order', 'maintains'],
    description: 'Inverse relationship for asset work orders',
    kgStatus: 'Added to KG'
  }
];

// Mock indirect relationships data
const mockIndirectRelationships = [
  {
    id: 'ind-rel-1',
    path: ['ASSET_MASTER', 'LOCATIONS', 'WORK_ORDERS'],
    relationships: [
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'LOCATION_ID',
        toTable: 'LOCATIONS',
        toField: 'ID'
      },
      {
        fromTable: 'LOCATIONS',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'LOCATION_ID'
      }
    ],
    name: 'HAS_WORK_ORDER_AT_LOCATION',
    alternateNames: ['Located Work Orders', 'Site Maintenance'],
    description: 'Work orders at the same location as the asset',
    kgStatus: 'Added to KG'
  },
  {
    id: 'ind-rel-2',
    path: ['EQUIPMENT', 'ASSET_MASTER', 'WORK_ORDERS'],
    relationships: [
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'ASSET_ID'
      }
    ],
    name: 'EQUIPMENT_WORK_ORDERS',
    alternateNames: ['Equipment Maintenance', 'Related Work'],
    description: 'Work orders related to equipment through asset master',
    kgStatus: 'Partially Added'
  },
  {
    id: 'ind-rel-3',
    path: ['EQUIPMENT', 'ASSET_MASTER', 'LOCATIONS', 'WORK_ORDERS'],
    relationships: [
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'LOCATION_ID',
        toTable: 'LOCATIONS',
        toField: 'ID'
      },
      {
        fromTable: 'LOCATIONS',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'LOCATION_ID'
      }
    ],
    name: 'EQUIPMENT_LOCATION_WORK_ORDERS',
    alternateNames: ['Site Equipment Work', 'Location Based Maintenance'],
    description: 'Work orders at locations where equipment is installed through asset master',
    kgStatus: 'Not Added'
  },
  {
    id: 'ind-rel-4',
    path: ['EQUIPMENT', 'ASSET_MASTER', 'LOCATIONS', 'EQUIPMENT'],
    relationships: [
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'LOCATION_ID',
        toTable: 'LOCATIONS',
        toField: 'ID'
      },
      {
        fromTable: 'LOCATIONS',
        fromField: 'ID',
        toTable: 'EQUIPMENT',
        toField: 'LOCATION_ID'
      }
    ],
    name: 'CO_LOCATED_EQUIPMENT',
    alternateNames: ['Equipment at Same Location', 'Location Based Equipment'],
    description: 'Equipment located at the same location through asset master',
    kgStatus: 'Added to KG'
  },
  {
    id: 'ind-rel-5',
    path: ['WORK_ORDERS', 'ASSET_MASTER', 'LOCATIONS', 'WORK_ORDERS'],
    relationships: [
      {
        fromTable: 'WORK_ORDERS',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'LOCATION_ID',
        toTable: 'LOCATIONS',
        toField: 'ID'
      },
      {
        fromTable: 'LOCATIONS',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'LOCATION_ID'
      }
    ],
    name: 'RELATED_WORK_ORDERS',
    alternateNames: ['Location Based Work Orders', 'Site Work Orders'],
    description: 'Work orders related through asset location',
    kgStatus: 'Partially Added'
  },
  {
    id: 'ind-rel-6',
    path: ['EQUIPMENT', 'ASSET_MASTER', 'WORK_ORDERS', 'EQUIPMENT'],
    relationships: [
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'ASSET_ID'
      },
      {
        fromTable: 'WORK_ORDERS',
        fromField: 'EQUIPMENT_ID',
        toTable: 'EQUIPMENT',
        toField: 'ID'
      }
    ],
    name: 'EQUIPMENT_MAINTENANCE_CHAIN',
    alternateNames: ['Maintenance Equipment Chain', 'Equipment Work Flow'],
    description: 'Equipment relationships through work order chain',
    kgStatus: 'Not Added'
  },
  {
    id: 'ind-rel-7',
    path: ['ASSET_MASTER', 'EQUIPMENT', 'WORK_ORDERS'],
    relationships: [
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'EQUIPMENT_ID',
        toTable: 'EQUIPMENT',
        toField: 'ID'
      },
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'EQUIPMENT_ID'
      }
    ],
    name: 'ASSET_EQUIPMENT_WORK',
    alternateNames: ['Asset Equipment Maintenance', 'Equipment Based Work'],
    description: 'Work orders related to assets through equipment',
    kgStatus: 'Added to KG'
  },
  {
    id: 'ind-rel-8',
    path: ['LOCATIONS', 'ASSET_MASTER', 'EQUIPMENT', 'WORK_ORDERS'],
    relationships: [
      {
        fromTable: 'LOCATIONS',
        fromField: 'ID',
        toTable: 'ASSET_MASTER',
        toField: 'LOCATION_ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'EQUIPMENT_ID',
        toTable: 'EQUIPMENT',
        toField: 'ID'
      },
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'EQUIPMENT_ID'
      }
    ],
    name: 'LOCATION_EQUIPMENT_WORK',
    alternateNames: ['Location Equipment Maintenance', 'Site Equipment Work'],
    description: 'Work orders for equipment at specific locations',
    kgStatus: 'Partially Added'
  },
  {
    id: 'ind-rel-9',
    path: ['WORK_ORDERS', 'EQUIPMENT', 'ASSET_MASTER', 'LOCATIONS'],
    relationships: [
      {
        fromTable: 'WORK_ORDERS',
        fromField: 'EQUIPMENT_ID',
        toTable: 'EQUIPMENT',
        toField: 'ID'
      },
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      },
      {
        fromTable: 'ASSET_MASTER',
        fromField: 'LOCATION_ID',
        toTable: 'LOCATIONS',
        toField: 'ID'
      }
    ],
    name: 'WORK_ORDER_LOCATION_TRACE',
    alternateNames: ['Work Location Path', 'Maintenance Location Chain'],
    description: 'Location trace for work orders through equipment and assets',
    kgStatus: 'Not Added'
  },
  {
    id: 'ind-rel-10',
    path: ['EQUIPMENT', 'WORK_ORDERS', 'ASSET_MASTER'],
    relationships: [
      {
        fromTable: 'EQUIPMENT',
        fromField: 'ID',
        toTable: 'WORK_ORDERS',
        toField: 'EQUIPMENT_ID'
      },
      {
        fromTable: 'WORK_ORDERS',
        fromField: 'ASSET_ID',
        toTable: 'ASSET_MASTER',
        toField: 'ID'
      }
    ],
    name: 'EQUIPMENT_ASSET_MAINTENANCE',
    alternateNames: ['Equipment Asset Work', 'Maintenance Asset Chain'],
    description: 'Asset relationships through equipment work orders',
    kgStatus: 'Added to KG'
  }
];

// Mock self relationships data
const mockSelfRelationships = [
  {
    id: 'self-rel-1',
    table: { id: 'asset-master', name: 'ASSET_MASTER' },
    reference_table: { id: 'locations', name: 'LOCATIONS' },
    name: 'LOCATED_AT_SAME_SITE',
    alternative_names: ['Co-located Assets', 'Same Location Assets'],
    description: 'Assets that share the same physical location',
    kg_status: 'Added to KG',
    created_at: '2025-02-15T10:00:00Z'
  },
  {
    id: 'self-rel-2',
    table: { id: 'equipment', name: 'EQUIPMENT' },
    reference_table: { id: 'work-orders', name: 'WORK_ORDERS' },
    name: 'MAINTAINED_TOGETHER',
    alternative_names: ['Joint Maintenance', 'Shared Work Orders'],
    description: 'Equipment that are maintained under the same work orders',
    kg_status: 'Added to KG',
    created_at: '2025-02-15T11:00:00Z'
  },
  {
    id: 'self-rel-3',
    table: { id: 'asset-master', name: 'ASSET_MASTER' },
    reference_table: { id: 'equipment', name: 'EQUIPMENT' },
    name: 'SAME_EQUIPMENT_TYPE',
    alternative_names: ['Similar Equipment', 'Equipment Category Match'],
    description: 'Assets that use the same type of equipment',
    kg_status: 'Partially Added',
    created_at: '2025-02-15T12:00:00Z'
  },
  {
    id: 'self-rel-4',
    table: { id: 'work-orders', name: 'WORK_ORDERS' },
    reference_table: { id: 'locations', name: 'LOCATIONS' },
    name: 'SAME_LOCATION_MAINTENANCE',
    alternative_names: ['Site Work Orders', 'Location Based Maintenance'],
    description: 'Work orders being executed at the same location',
    kg_status: 'Added to KG',
    created_at: '2025-02-15T13:00:00Z'
  },
  {
    id: 'self-rel-5',
    table: { id: 'equipment', name: 'EQUIPMENT' },
    reference_table: { id: 'asset-master', name: 'ASSET_MASTER' },
    name: 'SAME_ASSET_COMPONENTS',
    alternative_names: ['Asset Parts', 'Component Group'],
    description: 'Equipment that are components of the same asset',
    kg_status: 'Not Added',
    created_at: '2025-02-15T14:00:00Z'
  },
  {
    id: 'self-rel-6',
    table: { id: 'locations', name: 'LOCATIONS' },
    reference_table: { id: 'work-orders', name: 'WORK_ORDERS' },
    name: 'RELATED_MAINTENANCE_SITES',
    alternative_names: ['Connected Sites', 'Maintenance Zone'],
    description: 'Locations that are related through common maintenance activities',
    kg_status: 'Partially Added',
    created_at: '2025-02-15T15:00:00Z'
  },
  {
    id: 'self-rel-7',
    table: { id: 'asset-master', name: 'ASSET_MASTER' },
    reference_table: { id: 'work-orders', name: 'WORK_ORDERS' },
    name: 'MAINTAINED_IN_SAME_PERIOD',
    alternative_names: ['Concurrent Maintenance', 'Time-based Relations'],
    description: 'Assets that undergo maintenance during the same time periods',
    kg_status: 'Added to KG',
    created_at: '2025-02-15T16:00:00Z'
  },
  {
    id: 'self-rel-8',
    table: { id: 'equipment', name: 'EQUIPMENT' },
    reference_table: { id: 'locations', name: 'LOCATIONS' },
    name: 'SAME_FACILITY_EQUIPMENT',
    alternative_names: ['Facility Group', 'Location Equipment Set'],
    description: 'Equipment located within the same facility or area',
    kg_status: 'Added to KG',
    created_at: '2025-02-15T17:00:00Z'
  },
  {
    id: 'self-rel-9',
    table: { id: 'work-orders', name: 'WORK_ORDERS' },
    reference_table: { id: 'equipment', name: 'EQUIPMENT' },
    name: 'SAME_EQUIPMENT_MAINTENANCE',
    alternative_names: ['Equipment Work Group', 'Related Maintenance'],
    description: 'Work orders that involve the same equipment type',
    kg_status: 'Not Added',
    created_at: '2025-02-15T18:00:00Z'
  },
  {
    id: 'self-rel-10',
    table: { id: 'locations', name: 'LOCATIONS' },
    reference_table: { id: 'asset-master', name: 'ASSET_MASTER' },
    name: 'SAME_ASSET_TYPE_LOCATIONS',
    alternative_names: ['Asset Type Zones', 'Similar Asset Areas'],
    description: 'Locations that house the same types of assets',
    kg_status: 'Partially Added',
    created_at: '2025-02-15T19:00:00Z'
  }
];

export { 
  mockFields, 
  mockTableData, 
  mockAuditLogs, 
  mockRelationships, 
  mockSyncJobs, 
  mockInverseRelationships, 
  mockIndirectRelationships,
  mockSelfRelationships 
};
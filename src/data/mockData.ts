export const dataSources = [
  { id: 'native', name: 'Innovapptive Native', color: '#3B82F6' },
  { id: 'sap', name: 'SAP ERP', color: '#F59E0B' },
  { id: 'maximo', name: 'Maximo', color: '#10B981' },
  { id: 'historian', name: 'PI Historian', color: '#8B5CF6' }
];

export const tables = [
  { id: 'assets', name: 'ASSET_MASTER', source: 'native' },
  { id: 'equipment', name: 'EQUIPMENT', source: 'native' },
  { id: 'workorders', name: 'WORK_ORDERS', source: 'native' },
  { id: 'locations', name: 'LOCATIONS', source: 'sap' },
  { id: 'materials', name: 'MATERIALS', source: 'sap' }
];

export const fields = [
  { id: 'status', name: 'Status', type: 'string' },
  { id: 'type', name: 'Type', type: 'string' },
  { id: 'priority', name: 'Priority', type: 'number' }
];

export const generateGraphElements = () => {
  const elements = [
    // Generate Asset nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `asset${i + 1}`, label: `Asset ${i + 1}`, source: 'native', type: 'asset' }
    })),
    // Generate Equipment nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `equipment${i + 1}`, label: `Equipment ${i + 1}`, source: 'native', type: 'equipment' }
    })),
    // Generate Location nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `location${i + 1}`, label: `Location ${i + 1}`, source: 'sap', type: 'location' }
    })),
    // Generate Work Order nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `workorder${i + 1}`, label: `Work Order ${i + 1}`, source: 'maximo', type: 'workorder' }
    })),
    // Generate edges between assets and equipment (1:1)
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { 
        source: `asset${i + 1}`, 
        target: `equipment${i + 1}`, 
        label: 'HAS_EQUIPMENT',
        id: `edge_ae_${i + 1}`
      }
    })),
    // Generate edges between equipment and locations (many-to-one)
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { 
        source: `equipment${i + 1}`, 
        target: `location${Math.floor(i / 5) + 1}`, 
        label: 'LOCATED_AT',
        id: `edge_el_${i + 1}`
      }
    })),
    // Generate edges between equipment and work orders (1:many)
    ...Array.from({ length: 50 }, (_, i) => ({
      data: { 
        source: `equipment${Math.floor(i / 2) + 1}`, 
        target: `workorder${i % 25 + 1}`, 
        label: 'HAS_WORKORDER',
        id: `edge_ew_${i + 1}`
      }
    })),
    // Generate cross-connections between assets
    ...Array.from({ length: 10 }, (_, i) => ({
      data: { 
        source: `asset${Math.floor(Math.random() * 25) + 1}`, 
        target: `asset${Math.floor(Math.random() * 25) + 1}`, 
        label: 'RELATED_TO',
        id: `edge_aa_${i + 1}`
      }
    })),
    // Generate location hierarchy connections
    ...Array.from({ length: 5 }, (_, i) => ({
      data: { 
        source: `location${i + 1}`, 
        target: `location${i + 6}`, 
        label: 'CONTAINS',
        id: `edge_ll_${i + 1}`
      }
    }))
  ];
  return elements;
}; 
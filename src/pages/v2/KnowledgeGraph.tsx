// import React from 'react';

// const KnowledgeGraph: React.FC = () => {
//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-slate-900">Preview Knowledge Graph</h1>
//       {/* Add knowledge graph content */}
//     </div>
//   );
// };
// export default KnowledgeGraph;





import React, { useState, useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import { 
  Search, Filter, Download, RefreshCw, ZoomIn, ZoomOut, 
  RotateCcw, ChevronDown, X, Calendar, Plus, Minus 
} from 'lucide-react';
import { format } from 'date-fns';
import { Button, Card } from '../../components/ui';
import { cn } from '../utils/cn';

// Register layout extensions
cytoscape.use(cola);
cytoscape.use(fcose);

const KnowledgeGraph: React.FC = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [layout, setLayout] = useState<string>('fcose');
  const [maxNodes, setMaxNodes] = useState<number>(1000);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [selectedSources, setSelectedSources] = useState<string[]>(['native']);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [fieldFilter, setFieldFilter] = useState({
    field: '',
    operator: '=',
    value: ''
  });

  // Mock data sources
  const dataSources = [
    { id: 'native', name: 'Innovapptive Native' },
    { id: 'sap', name: 'SAP ERP' },
    { id: 'maximo', name: 'Maximo' },
    { id: 'historian', name: 'PI Historian' }
  ];

  // Mock tables
  const tables = [
    { id: 'assets', name: 'ASSET_MASTER', source: 'native' },
    { id: 'equipment', name: 'EQUIPMENT', source: 'native' },
    { id: 'workorders', name: 'WORK_ORDERS', source: 'native' },
    { id: 'locations', name: 'LOCATIONS', source: 'sap' },
    { id: 'materials', name: 'MATERIALS', source: 'sap' }
  ];

  // Mock fields for filter
  const fields = [
    { id: 'status', name: 'Status', type: 'string' },
    { id: 'type', name: 'Type', type: 'string' },
    { id: 'priority', name: 'Priority', type: 'number' }
  ];

  // Graph style
  const graphStyle: cytoscape.Stylesheet[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#3B82F6',
        'label': 'data(label)',
        'color': '#1F2937',
        'font-size': '10px',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': '5px',
        'width': '25px',
        'height': '25px'
      }
    },
    {
      selector: 'node[source = "native"]',
      style: {
        'background-color': '#3B82F6'
      }
    },
    {
      selector: 'node[source = "sap"]',
      style: {
        'background-color': '#F59E0B'
      }
    },
    {
      selector: 'node[source = "maximo"]',
      style: {
        'background-color': '#10B981'
      }
    },
    {
      selector: 'node[source = "historian"]',
      style: {
        'background-color': '#8B5CF6'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#94A3B8',
        'target-arrow-color': '#94A3B8',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    },
    {
      selector: ':selected',
      style: {
        'background-color': '#2563EB',
        'line-color': '#2563EB',
        'target-arrow-color': '#2563EB',
        'border-width': '2px',
        'border-color': '#1D4ED8'
      }
    },
    {
      selector: '.highlighted',
      style: {
        'background-color': '#2563EB',
        'line-color': '#2563EB',
        'target-arrow-color': '#2563EB',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.2s'
      }
    },
    {
      selector: '.faded',
      style: {
        'opacity': 0.25,
        'transition-property': 'opacity',
        'transition-duration': '0.2s'
      }
    }
  ];

  // Mock graph data with 100+ nodes
  const elements = [
    // Generate 100 Asset nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `asset${i + 1}`, label: `Asset ${i + 1}`, source: 'native', type: 'asset' }
    })),
    // Generate 25 Equipment nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `equipment${i + 1}`, label: `Equipment ${i + 1}`, source: 'native', type: 'equipment' }
    })),
    // Generate 25 Location nodes
    ...Array.from({ length: 25 }, (_, i) => ({
      data: { id: `location${i + 1}`, label: `Location ${i + 1}`, source: 'sap', type: 'location' }
    })),
    // Generate 25 Work Order nodes
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
    // Generate some cross-connections between assets (10 random connections)
    ...Array.from({ length: 10 }, (_, i) => ({
      data: { 
        source: `asset${Math.floor(Math.random() * 25) + 1}`, 
        target: `asset${Math.floor(Math.random() * 25) + 1}`, 
        label: 'RELATED_TO',
        id: `edge_aa_${i + 1}`
      }
    })),
    // Generate some location hierarchy connections (5 connections)
    ...Array.from({ length: 5 }, (_, i) => ({
      data: { 
        source: `location${i + 1}`, 
        target: `location${i + 6}`, 
        label: 'CONTAINS',
        id: `edge_ll_${i + 1}`
      }
    }))
  ];

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.2);
      setZoom(cyRef.current.zoom());
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
      setZoom(cyRef.current.zoom());
    }
  };

  const handleResetView = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
      setZoom(cyRef.current.zoom());
    }
  };

  const handleNodeClick = (event: cytoscape.EventObject) => {
    const node = event.target;
    setSelectedNode(node.data());

    // Highlight connected nodes and edges
    if (cyRef.current) {
      const cy = cyRef.current;
      const neighborhood = node.neighborhood();
      
      cy.elements().addClass('faded');
      neighborhood.removeClass('faded').addClass('highlighted');
      node.removeClass('faded').addClass('highlighted');
    }
  };

  const handleBackgroundClick = () => {
    setSelectedNode(null);
    if (cyRef.current) {
      cyRef.current.elements()
        .removeClass('faded')
        .removeClass('highlighted');
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;

      // Set up event handlers
      cy.on('tap', 'node', handleNodeClick);
      cy.on('tap', function(event) {
        if (event.target === cy) {
          handleBackgroundClick();
        }
      });

      // Initial layout
      cy.layout({ name: layout }).run();

      return () => {
        cy.removeListener('tap');
      };
    }
  }, [layout]);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Preview Knowledge Graph</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1.5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button variant="secondary">
            <Download size={16} className="mr-1.5" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg border border-slate-200">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 flex-shrink-0">
            <div className="space-y-6">
              {/* Data Sources */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Data Sources</h3>
                <div className="space-y-2">
                  {dataSources.map(source => (
                    <label key={source.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSources([...selectedSources, source.id]);
                          } else {
                            setSelectedSources(selectedSources.filter(id => id !== source.id));
                          }
                        }}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-slate-700">{source.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tables */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Tables</h3>
                <div className="space-y-2">
                  {tables
                    .filter(table => selectedSources.includes(table.source))
                    .map(table => (
                      <label key={table.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTables.includes(table.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTables([...selectedTables, table.id]);
                            } else {
                              setSelectedTables(selectedTables.filter(id => id !== table.id));
                            }
                          }}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-slate-700">{table.name}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Date Range</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">From</label>
                    <input
                      type="date"
                      value={dateRange[0]}
                      onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
                      className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">To</label>
                    <input
                      type="date"
                      value={dateRange[1]}
                      onChange={(e) => setDateRange([dateRange[0], e.target.value])}
                      className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Field Filter */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Field Filter</h3>
                <div className="space-y-2">
                  <select
                    value={fieldFilter.field}
                    onChange={(e) => setFieldFilter({ ...fieldFilter, field: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">Select field...</option>
                    {fields.map(field => (
                      <option key={field.id} value={field.id}>{field.name}</option>
                    ))}
                  </select>
                  <select
                    value={fieldFilter.operator}
                    onChange={(e) => setFieldFilter({ ...fieldFilter, operator: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">{">"}</option>
                    <option value="<">{"<"}</option>
                  </select>
                  <input
                    type="text"
                    value={fieldFilter.value}
                    onChange={(e) => setFieldFilter({ ...fieldFilter, value: e.target.value })}
                    placeholder="Enter value..."
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Max Nodes */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">
                  Max Nodes per Table: {maxNodes}
                </h3>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={maxNodes}
                  onChange={(e) => setMaxNodes(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Layout */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Layout</h3>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="fcose">Force-Directed (F-CoSE)</option>
                  <option value="cola">Force-Directed (CoLa)</option>
                  <option value="concentric">Concentric</option>
                  <option value="grid">Grid</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Graph visualization */}
        <div className="flex-1 relative">
          <CytoscapeComponent
            elements={elements}
            style={{ width: '100%', height: '100%' }}
            stylesheet={graphStyle}
            cy={(cy) => { cyRef.current = cy; }}
            wheelSensitivity={0.2}
          />
          
          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-slate-200 p-2">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              title="Reset View"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 p-3">
            <h4 className="text-xs font-medium text-slate-900 mb-2">Legend</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                <span className="text-xs text-slate-600">Native</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-xs text-slate-600">SAP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-xs text-slate-600">Maximo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span className="text-xs text-slate-600">Historian</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node details panel */}
        {selectedNode && (
          <div className="w-72 bg-white border-l border-slate-200 overflow-y-auto p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900">Node Details</h3>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">ID</label>
                <span className="text-sm text-slate-900">{selectedNode.id}</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Label</label>
                <span className="text-sm text-slate-900">{selectedNode.label}</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Source</label>
                <span className="text-sm text-slate-900">{selectedNode.source}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;
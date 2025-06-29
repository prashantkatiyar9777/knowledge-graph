import React, { useState, useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import { 
  Search, Filter, Download, RefreshCw, ZoomIn, ZoomOut, 
  RotateCcw, ChevronDown, X
} from 'lucide-react';
import { Button } from "../../components/ui/index.js";
import { Card } from '../../components/ui/index.js';
import { cn } from '../../utils/cn.js';
import { dataSources, tables, fields, generateGraphElements } from '../../data/mockData.js';
import { graphStyles } from '../../styles/graphStyles.js';

// Register layout extensions
if (!cytoscape.prototype.hasInitialised) {
  cytoscape.use(cola);
  cytoscape.use(fcose);
  cytoscape.prototype.hasInitialised = true;
}

const GraphViewer: React.FC = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [layout, setLayout] = useState<string>('fcose');
  const [selectedSources, setSelectedSources] = useState<string[]>(['native']);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.layout({ name: layout }).run();
    }
  }, [layout]);

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

  return (
    <div className="flex h-full">
      {/* Filters panel */}
      <div className={cn(
        "w-80 bg-white border-r border-slate-200 p-4 transition-all duration-300 ease-in-out",
        showFilters ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Filter content */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          
          {/* Data Sources */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Data Sources</h3>
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
                        setSelectedSources(selectedSources.filter(s => s !== source.id));
                      }
                    }}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-slate-600">{source.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Tables */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Tables</h3>
            <div className="space-y-2">
              {tables.map(table => (
                <label key={table.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTables.includes(table.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTables([...selectedTables, table.id]);
                      } else {
                        setSelectedTables(selectedTables.filter(t => t !== table.id));
                      }
                    }}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-slate-600">{table.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Graph container */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          <div className="h-4 border-r border-slate-200" />

          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
          >
            <ZoomIn size={16} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
          >
            <ZoomOut size={16} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleResetView}
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        {/* Graph */}
        <CytoscapeComponent
          elements={generateGraphElements()}
          style={{ width: '100%', height: '100%' }}
          stylesheet={graphStyles}
          cy={(cy) => { cyRef.current = cy; }}
          layout={{ name: layout }}
          onClick={handleBackgroundClick}
        />

        {/* Node details */}
        {selectedNode && (
          <Card className="absolute top-4 right-4 w-80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Node Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNode(null)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {selectedNode.id}</p>
              <p><span className="font-medium">Label:</span> {selectedNode.label}</p>
              <p><span className="font-medium">Type:</span> {selectedNode.type}</p>
              <p><span className="font-medium">Source:</span> {selectedNode.source}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GraphViewer;
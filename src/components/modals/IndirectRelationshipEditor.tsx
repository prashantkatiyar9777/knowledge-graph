import React, { useState, useMemo } from 'react';
import { Modal, Button } from '../ui';
import { Search, ChevronRight, ArrowRight, X, Plus } from 'lucide-react';
import { mockRelationships } from '../../utils/mockData';

interface IndirectRelationshipEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (relationship: any) => void;
}

interface RelationshipPath {
  path: string[];
  relationships: typeof mockRelationships;
}

const IndirectRelationshipEditor: React.FC<IndirectRelationshipEditorProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaths, setSelectedPaths] = useState<RelationshipPath[]>([]);
  const [relationshipConfigs, setRelationshipConfigs] = useState<Record<string, {
    name: string;
    alternateNames: string[];
    description: string;
    newAlternateName: string;
  }>>({});

  // Find all possible indirect relationship paths
  const indirectPaths = useMemo(() => {
    const paths: RelationshipPath[] = [];
    
    const findPaths = (
      startTable: string,
      currentPath: string[],
      usedRelationships: typeof mockRelationships,
      visited: Set<string>
    ) => {
      if (currentPath.length > 1 && currentPath.length <= 4) {
        paths.push({
          path: [...currentPath],
          relationships: [...usedRelationships]
        });
      }

      if (currentPath.length >= 4) return;

      const availableRelationships = mockRelationships.filter(rel => 
        rel.fromTable === startTable && !visited.has(rel.toTable)
      );

      for (const rel of availableRelationships) {
        visited.add(rel.toTable);
        findPaths(
          rel.toTable,
          [...currentPath, rel.toTable],
          [...usedRelationships, rel],
          new Set(visited)
        );
        visited.delete(rel.toTable);
      }
    };

    const tables = new Set(mockRelationships.map(rel => rel.fromTable));
    tables.forEach(table => {
      findPaths(table, [table], [], new Set([table]));
    });

    return paths;
  }, []);

  // Filter paths based on search term
  const filteredPaths = indirectPaths.filter(path =>
    path.path.some(table => 
      table.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const togglePath = (path: RelationshipPath) => {
    const pathKey = path.path.join('-');
    setSelectedPaths(prev => {
      const isSelected = prev.some(p => p.path.join('-') === pathKey);
      if (isSelected) {
        return prev.filter(p => p.path.join('-') !== pathKey);
      } else {
        return [...prev, path];
      }
    });

    // Initialize config for newly selected path
    if (!relationshipConfigs[pathKey]) {
      setRelationshipConfigs(prev => ({
        ...prev,
        [pathKey]: {
          name: '',
          alternateNames: [],
          description: '',
          newAlternateName: ''
        }
      }));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPaths(filteredPaths);
      // Initialize configs for all paths
      const newConfigs = { ...relationshipConfigs };
      filteredPaths.forEach(path => {
        const pathKey = path.path.join('-');
        if (!newConfigs[pathKey]) {
          newConfigs[pathKey] = {
            name: '',
            alternateNames: [],
            description: '',
            newAlternateName: ''
          };
        }
      });
      setRelationshipConfigs(newConfigs);
    } else {
      setSelectedPaths([]);
    }
  };

  const handleAddAlternateName = (pathKey: string) => {
    const name = relationshipConfigs[pathKey]?.newAlternateName.trim();
    if (!name) return;

    setRelationshipConfigs(prev => ({
      ...prev,
      [pathKey]: {
        ...prev[pathKey],
        alternateNames: [...(prev[pathKey].alternateNames || []), name],
        newAlternateName: ''
      }
    }));
  };

  const handleRemoveAlternateName = (pathKey: string, index: number) => {
    setRelationshipConfigs(prev => ({
      ...prev,
      [pathKey]: {
        ...prev[pathKey],
        alternateNames: prev[pathKey].alternateNames.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = () => {
    const relationships = selectedPaths.map(path => {
      const pathKey = path.path.join('-');
      const config = relationshipConfigs[pathKey];
      
      return {
        path: path.path,
        relationships: path.relationships,
        name: config.name,
        alternateNames: config.alternateNames,
        description: config.description
      };
    });

    onSave(relationships);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="text-xl font-semibold">Add Indirect Relationship</div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {step === 1 ? (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-900">Select Relationship Paths</h3>
              <p className="text-sm text-slate-600 mt-1">
                Choose the paths of relationships to create indirect connections
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedPaths.length === filteredPaths.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span className="ml-3 text-xs font-medium text-slate-500 uppercase">
                    Select All
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto">
                {filteredPaths.map((path, index) => {
                  const pathKey = path.path.join('-');
                  const isSelected = selectedPaths.some(p => p.path.join('-') === pathKey);
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center px-4 py-3 hover:bg-slate-50 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => togglePath(path)}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                        checked={isSelected}
                        onChange={() => togglePath(path)}
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          {path.path.map((table, i) => (
                            <React.Fragment key={i}>
                              <span className="text-sm font-medium text-slate-900">
                                {table}
                              </span>
                              {i < path.path.length - 1 && (
                                <ArrowRight size={16} className="text-slate-400" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {selectedPaths.map((path, pathIndex) => {
              const pathKey = path.path.join('-');
              const config = relationshipConfigs[pathKey];

              return (
                <div key={pathIndex} className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2">
                      {path.path.map((table, i) => (
                        <React.Fragment key={i}>
                          <span className="text-sm font-medium text-slate-900">
                            {table}
                          </span>
                          {i < path.path.length - 1 && (
                            <ArrowRight size={16} className="text-slate-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900">
                        Relationship Name
                      </label>
                      <input
                        type="text"
                        value={config?.name || ''}
                        onChange={(e) => setRelationshipConfigs(prev => ({
                          ...prev,
                          [pathKey]: {
                            ...prev[pathKey],
                            name: e.target.value
                          }
                        }))}
                        placeholder="e.g., INDIRECTLY_CONNECTED_TO"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900">
                        Alternative Names
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={config?.newAlternateName || ''}
                          onChange={(e) => setRelationshipConfigs(prev => ({
                            ...prev,
                            [pathKey]: {
                              ...prev[pathKey],
                              newAlternateName: e.target.value
                            }
                          }))}
                          placeholder="Enter an alternative name"
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAlternateName(pathKey);
                            }
                          }}
                        />
                        <Button
                          variant="primary"
                          onClick={() => handleAddAlternateName(pathKey)}
                          disabled={!config?.newAlternateName?.trim()}
                          icon={<Plus size={16} />}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="min-h-[2.5rem] p-3 bg-slate-50 rounded-lg border border-slate-200">
                        {config?.alternateNames?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {config.alternateNames.map((name, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm"
                              >
                                <span className="text-sm text-slate-700">{name}</span>
                                <button
                                  onClick={() => handleRemoveAlternateName(pathKey, index)}
                                  className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500 italic">
                            No alternative names added
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900">
                        Description
                      </label>
                      <textarea
                        value={config?.description || ''}
                        onChange={(e) => setRelationshipConfigs(prev => ({
                          ...prev,
                          [pathKey]: {
                            ...prev[pathKey],
                            description: e.target.value
                          }
                        }))}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        placeholder="Describe the purpose of this indirect relationship..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between">
          {step === 2 ? (
            <>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={selectedPaths.length === 0 || 
                  selectedPaths.some(path => {
                    const config = relationshipConfigs[path.path.join('-')];
                    return !config?.name?.trim();
                  })}
              >
                Add Indirect Relationships
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                disabled={selectedPaths.length === 0}
              >
                Next ({selectedPaths.length} selected)
              </Button>
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default IndirectRelationshipEditor;
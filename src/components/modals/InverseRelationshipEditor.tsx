import React, { useState } from 'react';
import { Modal, Button } from '../ui';
import { Search, ChevronRight, X, Plus } from 'lucide-react';
import { mockRelationships } from '../../utils/mockData';

interface InverseRelationshipEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (relationship: any) => void;
}

interface InverseConfig {
  inverseName: string;
  alternateNames: string[];
  description: string;
}

const InverseRelationshipEditor: React.FC<InverseRelationshipEditorProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [inverseConfigs, setInverseConfigs] = useState<Record<string, InverseConfig>>({});
  const [newAlternateName, setNewAlternateName] = useState<Record<string, string>>({});

  // Filter relationships based on search term
  const filteredRelationships = mockRelationships.filter(rel =>
    rel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.fromTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.toTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAlternateName = (relationshipId: string) => {
    const name = newAlternateName[relationshipId]?.trim();
    if (!name) return;

    setInverseConfigs(prev => ({
      ...prev,
      [relationshipId]: {
        ...prev[relationshipId],
        alternateNames: [...(prev[relationshipId]?.alternateNames || []), name]
      }
    }));

    setNewAlternateName(prev => ({
      ...prev,
      [relationshipId]: ''
    }));
  };

  const handleRemoveAlternateName = (relationshipId: string, index: number) => {
    setInverseConfigs(prev => ({
      ...prev,
      [relationshipId]: {
        ...prev[relationshipId],
        alternateNames: prev[relationshipId].alternateNames.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = () => {
    const inverseRelationships = selectedRelationships.map(id => {
      const relationship = mockRelationships.find(r => r.id === id);
      const config = inverseConfigs[id] || { inverseName: '', alternateNames: [], description: '' };
      
      return {
        originalRelationship: relationship,
        inverseName: config.inverseName,
        alternateNames: config.alternateNames,
        description: config.description
      };
    });

    onSave(inverseRelationships);
  };

  const toggleRelationship = (id: string) => {
    setSelectedRelationships(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );

    // Initialize inverse config for newly selected relationship
    if (!inverseConfigs[id]) {
      setInverseConfigs(prev => ({
        ...prev,
        [id]: {
          inverseName: '',
          alternateNames: [],
          description: ''
        }
      }));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? filteredRelationships.map(r => r.id) : [];
    setSelectedRelationships(newSelected);

    // Initialize inverse configs for all newly selected relationships
    if (checked) {
      const newConfigs = { ...inverseConfigs };
      filteredRelationships.forEach(rel => {
        if (!newConfigs[rel.id]) {
          newConfigs[rel.id] = {
            inverseName: '',
            alternateNames: [],
            description: ''
          };
        }
      });
      setInverseConfigs(newConfigs);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="text-xl font-semibold">Add Inverse Relationship</div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {step === 1 ? (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-900">Select Relationships</h3>
              <p className="text-sm text-slate-600 mt-1">
                Choose the relationships you want to create inverses for
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Search relationships..."
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
                    checked={selectedRelationships.length === filteredRelationships.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span className="ml-3 text-xs font-medium text-slate-500 uppercase">
                    Select All
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto">
                {filteredRelationships.map((rel) => (
                  <div
                    key={rel.id}
                    className={`flex items-center px-4 py-3 hover:bg-slate-50 ${
                      selectedRelationships.includes(rel.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedRelationships.includes(rel.id)}
                      onChange={() => toggleRelationship(rel.id)}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-900">
                          {rel.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {rel.fromTable} → {rel.toTable}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {rel.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {selectedRelationships.map(relationshipId => {
              const relationship = mockRelationships.find(r => r.id === relationshipId);
              if (!relationship) return null;

              return (
                <div key={relationshipId} className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-900">{relationship.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {relationship.fromTable}.{relationship.fromField} → {relationship.toTable}.{relationship.toField}
                    </p>
                  </div>

                  <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900">
                        Inverse Name
                      </label>
                      <input
                        type="text"
                        value={inverseConfigs[relationshipId]?.inverseName || ''}
                        onChange={(e) => setInverseConfigs(prev => ({
                          ...prev,
                          [relationshipId]: {
                            ...prev[relationshipId],
                            inverseName: e.target.value
                          }
                        }))}
                        placeholder="e.g., IS_PART_OF, BELONGS_TO"
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
                          value={newAlternateName[relationshipId] || ''}
                          onChange={(e) => setNewAlternateName(prev => ({
                            ...prev,
                            [relationshipId]: e.target.value
                          }))}
                          placeholder="Enter an alternative name"
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAlternateName(relationshipId);
                            }
                          }}
                        />
                        <Button
                          variant="primary"
                          onClick={() => handleAddAlternateName(relationshipId)}
                          disabled={!newAlternateName[relationshipId]?.trim()}
                          icon={<Plus size={16} />}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="min-h-[2.5rem] p-3 bg-slate-50 rounded-lg border border-slate-200">
                        {inverseConfigs[relationshipId]?.alternateNames?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {inverseConfigs[relationshipId].alternateNames.map((name, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm"
                              >
                                <span className="text-sm text-slate-700">{name}</span>
                                <button
                                  onClick={() => handleRemoveAlternateName(relationshipId, index)}
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
                        value={inverseConfigs[relationshipId]?.description || ''}
                        onChange={(e) => setInverseConfigs(prev => ({
                          ...prev,
                          [relationshipId]: {
                            ...prev[relationshipId],
                            description: e.target.value
                          }
                        }))}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        placeholder="Describe the purpose of this inverse relationship..."
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
                disabled={selectedRelationships.length === 0 || 
                  selectedRelationships.some(id => !inverseConfigs[id]?.inverseName?.trim())}
              >
                Add Inverse Relationships
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
                disabled={selectedRelationships.length === 0}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InverseRelationshipEditor;
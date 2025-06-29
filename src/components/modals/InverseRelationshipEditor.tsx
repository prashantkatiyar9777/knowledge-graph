import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../ui';
import { Search, ChevronRight, X, Plus } from 'lucide-react';
import useDataStore from '../../stores/dataStore';

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
  const { relationships, fetchRelationships, isLoading } = useDataStore();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [inverseConfigs, setInverseConfigs] = useState<Record<string, InverseConfig>>({});
  const [newAlternateName, setNewAlternateName] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchRelationships();
    }
  }, [isOpen, fetchRelationships]);

  // Filter relationships based on search term
  const filteredRelationships = relationships.filter(rel =>
    (rel.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rel.sourceTable?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rel.targetTable?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rel.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
      const relationship = relationships.find(r => r._id.toString() === id);
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
    const newSelected = checked ? filteredRelationships.map(r => r._id.toString()) : [];
    setSelectedRelationships(newSelected);

    // Initialize inverse configs for all newly selected relationships
    if (checked) {
      const newConfigs = { ...inverseConfigs };
      filteredRelationships.forEach(rel => {
        const id = rel._id.toString();
        if (!newConfigs[id]) {
          newConfigs[id] = {
            inverseName: '',
            alternateNames: [],
            description: ''
          };
        }
      });
      setInverseConfigs(newConfigs);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Body>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

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
                    key={rel._id.toString()}
                    className={`flex items-center px-4 py-3 hover:bg-slate-50 ${
                      selectedRelationships.includes(rel._id.toString()) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedRelationships.includes(rel._id.toString())}
                      onChange={() => toggleRelationship(rel._id.toString())}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-900">
                          {rel.name || 'Unnamed Relationship'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {rel.sourceTable?.name || 'Unknown'} → {rel.targetTable?.name || 'Unknown'}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {rel.description || 'No description'}
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
              const relationship = relationships.find(r => r._id.toString() === relationshipId);
              if (!relationship) return null;

              return (
                <div key={relationshipId} className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-900">{relationship.name || 'Unnamed Relationship'}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {relationship.sourceTable?.name || 'Unknown'}.{relationship.sourceField?.name || 'Unknown'} → {relationship.targetTable?.name || 'Unknown'}.{relationship.targetField?.name || 'Unknown'}
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
                        >
                          <Plus size={16} />
                        </Button>
                      </div>

                      {inverseConfigs[relationshipId]?.alternateNames.map((name, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg"
                        >
                          <span className="text-sm text-slate-700">{name}</span>
                          <button
                            onClick={() => handleRemoveAlternateName(relationshipId, index)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
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
                        placeholder="Describe the inverse relationship..."
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        rows={3}
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
        <div className="flex justify-between w-full">
          {step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {step === 1 ? (
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                disabled={selectedRelationships.length === 0}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={selectedRelationships.some(id => !inverseConfigs[id]?.inverseName)}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InverseRelationshipEditor;
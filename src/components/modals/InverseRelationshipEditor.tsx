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
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRelationships();
    }
  }, [isOpen, fetchRelationships]);

  // Filter relationships based on search term
  const filteredRelationships = relationships.filter(rel =>
    !searchTerm ||
    (rel.fromTable || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rel.toTable || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rel.name || '').toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelectRelationship = (relationship: any) => {
    setSelectedRelationship(relationship);
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Add Inverse Relationship</h3>
          <p className="mt-1 text-sm text-slate-600">
            Create an inverse relationship for an existing Object ID based connection
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

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredRelationships.map((rel) => (
                <tr key={rel._id.toString()} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.fromTable || 'Unknown'} → {rel.toTable || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {rel.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={() => handleSelectRelationship(rel)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedRelationship && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-900">Selected Relationship</h4>
            <p className="mt-1 text-sm text-slate-600">
              {selectedRelationship.fromTable || 'Unknown'}.{selectedRelationship.fromField || 'Unknown'} → {selectedRelationship.toTable || 'Unknown'}.{selectedRelationship.toField || 'Unknown'}
            </p>
          </div>
        )}
      </div>

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
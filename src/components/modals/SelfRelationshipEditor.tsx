import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../ui';
import { X, Plus } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';

interface SelfRelationshipEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (relationship: any) => void;
}

const SelfRelationshipEditor: React.FC<SelfRelationshipEditorProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const dataStore = useDataStore();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedReferenceTable, setSelectedReferenceTable] = useState<string>('');
  const [name, setName] = useState('');
  const [alternateNames, setAlternateNames] = useState<string[]>([]);
  const [newAlternateName, setNewAlternateName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await dataStore.fetchTables();
    };
    loadData();
  }, [dataStore]);

  const handleAddAlternateName = () => {
    if (newAlternateName.trim()) {
      setAlternateNames([...alternateNames, newAlternateName.trim()]);
      setNewAlternateName('');
    }
  };

  const handleRemoveAlternateName = (index: number) => {
    setAlternateNames(alternateNames.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      table_id: selectedTable,
      reference_table_id: selectedReferenceTable,
      name,
      alternative_names: alternateNames,
      description
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        Add Self Relationship
      </Modal.Header>

      <Modal.Body className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary Table
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-colors"
            >
              <option value="">Select a table...</option>
              {(dataStore.tables ?? []).map(table => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reference Table
            </label>
            <select
              value={selectedReferenceTable}
              onChange={(e) => setSelectedReferenceTable(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-colors"
            >
              <option value="">Select a reference table...</option>
              {(dataStore.tables ?? [])
                .filter(table => table.id !== selectedTable)
                .map(table => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Relationship Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., LOCATED_AT_SAME_SITE"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alternative Names
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAlternateName}
              onChange={(e) => setNewAlternateName(e.target.value)}
              placeholder="Enter an alternative name"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAlternateName();
                }
              }}
            />
            <button
              onClick={handleAddAlternateName}
              disabled={!newAlternateName.trim()}
              className="px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 min-h-[2.5rem] p-3 bg-slate-50 rounded-lg border border-slate-200">
            {alternateNames.length > 0 ? (
              alternateNames.map((name, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm"
                >
                  <span className="text-sm text-slate-700">{name}</span>
                  <button
                    onClick={() => handleRemoveAlternateName(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 italic">
                No alternative names added
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            placeholder="Describe the purpose of this self relationship..."
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedTable || !selectedReferenceTable || !name.trim()}
            className="px-4 py-2 text-sm"
          >
            Create Relationship
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SelfRelationshipEditor;
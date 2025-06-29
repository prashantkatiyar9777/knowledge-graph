import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Modal, Input, Button } from '../ui';
import { ValueField, Table } from '../../types';
import { cn } from '../../utils/cn';

interface FieldMetadataEditorProps {
  isOpen: boolean;
  onClose: () => void;
  field: ValueField | null;
  onSave: (updates: Partial<ValueField>) => void;
}

const FieldMetadataEditor: React.FC<FieldMetadataEditorProps> = ({
  isOpen,
  onClose,
  field,
  onSave
}) => {
  const [alternativeNames, setAlternativeNames] = useState<string[]>(
    field?.alternativeNames || []
  );
  const [newAlternateName, setNewAlternateName] = useState('');
  const [description, setDescription] = useState(field?.description || '');

  const handleSave = () => {
    if (!field) return;
    
    onSave({
      ...field,
      alternativeNames,
      description,
    });
    onClose();
  };

  if (!field) return null;

  const tableName = field.tableId && typeof field.tableId === 'object' && 'name' in field.tableId 
    ? field.tableId.name 
    : 'Unknown Table';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="text-xl font-semibold">Edit Field Metadata</div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {/* Field Information */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">{field.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200 font-medium">
                  {field.type}
                </span>
                <span>•</span>
                <span>From table: {tableName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Names */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Alternative Names
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newAlternateName}
                onChange={(e) => setNewAlternateName(e.target.value)}
                placeholder="Enter an alternative name"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newAlternateName.trim()) {
                    setAlternativeNames([...alternativeNames, newAlternateName.trim()]);
                    setNewAlternateName('');
                  }
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => {
                if (newAlternateName.trim()) {
                  setAlternativeNames([...alternativeNames, newAlternateName.trim()]);
                  setNewAlternateName('');
                }
              }}
              disabled={!newAlternateName.trim()}
              icon={<Plus size={16} />}
              className="px-4"
            >
              Add
            </Button>
          </div>
          <div className="min-h-[2.5rem] p-3 bg-slate-50 rounded-lg border border-slate-200">
            {alternativeNames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {alternativeNames.map((name, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm"
                  >
                    <span className="text-sm text-slate-700">{name}</span>
                    <button
                      onClick={() => setAlternativeNames(alternativeNames.filter((_, i) => i !== index))}
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

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            placeholder="Describe this field's purpose and usage..."
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FieldMetadataEditor;
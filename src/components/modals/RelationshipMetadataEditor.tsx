import React, { useState } from 'react';
import { Modal, Input, Button } from '../ui';
import { X, Plus } from 'lucide-react';
import { Relationship } from '../../types';

interface RelationshipMetadataEditorProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: Relationship;
  onSave: (updates: Partial<Relationship>) => void;
}

const RelationshipMetadataEditor: React.FC<RelationshipMetadataEditorProps> = ({
  isOpen,
  onClose,
  relationship,
  onSave
}) => {
  const [alternateNames, setAlternateNames] = useState<string[]>(
    relationship?.alternativeNames || []
  );
  const [newAlternateName, setNewAlternateName] = useState('');
  const [description, setDescription] = useState(relationship?.description || '');

  const handleSave = () => {
    if (!relationship) return;
    
    onSave({
      ...relationship,
      alternativeNames: alternateNames,
      description,
    });
  };

  if (!relationship) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="text-xl font-semibold">Edit Relationship Metadata</div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {/* Relationship Information */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">{relationship.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <span>From: {relationship.sourceTable.name}.{relationship.sourceField.name}</span>
                <span>•</span>
                <span>To: {relationship.targetTable.name}.{relationship.targetField.name}</span>
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
                    setAlternateNames([...alternateNames, newAlternateName.trim()]);
                    setNewAlternateName('');
                  }
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => {
                if (newAlternateName.trim()) {
                  setAlternateNames([...alternateNames, newAlternateName.trim()]);
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
            {alternateNames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {alternateNames.map((name, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm"
                  >
                    <span className="text-sm text-slate-700">{name}</span>
                    <button
                      onClick={() => setAlternateNames(alternateNames.filter((_, i) => i !== index))}
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
            placeholder="Describe this relationship's purpose and usage..."
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

export default RelationshipMetadataEditor;
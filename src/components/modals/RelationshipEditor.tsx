import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RelationshipEditorProps {
  isOpen: boolean;
  onClose: () => void;
  relationship?: {
    id: string;
    name: string;
    inverseName: string;
    fromTable: string;
    fromField: string;
    toTable: string;
    toField: string;
    description: string;
    cardinality: '1:1' | '1:N' | 'N:M';
  };
  mode: 'add' | 'edit';
}

const RelationshipEditor: React.FC<RelationshipEditorProps> = ({
  isOpen,
  onClose,
  relationship,
  mode
}) => {
  const [fromTable, setFromTable] = useState(relationship?.fromTable || '');
  const [fromField, setFromField] = useState(relationship?.fromField || '');
  const [toTable, setToTable] = useState(relationship?.toTable || '');
  const [toField, setToField] = useState(relationship?.toField || '');
  const [name, setName] = useState(relationship?.name || '');
  const [inverseName, setInverseName] = useState(relationship?.inverseName || '');
  const [description, setDescription] = useState(relationship?.description || '');
  const [cardinality, setCardinality] = useState<'1:1' | '1:N' | 'N:M'>(relationship?.cardinality || '1:N');

  const handleSave = async () => {
    try {
      const payload = {
        fromTable,
        fromField,
        toTable,
        toField,
        name,
        inverseName,
        description,
        cardinality
      };

      // TODO: Call API endpoint
      console.log('Saving relationship:', payload);

      onClose();
    } catch (error) {
      console.error('Error saving relationship:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === 'add' ? 'Add Relationship' : 'Edit Relationship'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Table
              </label>
              <select
                value={fromTable}
                onChange={(e) => setFromTable(e.target.value)}
                className="select"
              >
                <option value="">Select table...</option>
                <option value="ASSET_MASTER">ASSET_MASTER</option>
                <option value="EQUIPMENT">EQUIPMENT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Field
              </label>
              <select
                value={fromField}
                onChange={(e) => setFromField(e.target.value)}
                className="select"
                disabled={!fromTable}
              >
                <option value="">Select field...</option>
                <option value="ID">ID</option>
                <option value="LOCATION_ID">LOCATION_ID</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                To Table
              </label>
              <select
                value={toTable}
                onChange={(e) => setToTable(e.target.value)}
                className="select"
              >
                <option value="">Select table...</option>
                <option value="LOCATIONS">LOCATIONS</option>
                <option value="WORK_ORDERS">WORK_ORDERS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                To Field
              </label>
              <select
                value={toField}
                onChange={(e) => setToField(e.target.value)}
                className="select"
                disabled={!toTable}
              >
                <option value="">Select field...</option>
                <option value="ID">ID</option>
                <option value="ASSET_ID">ASSET_ID</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Relationship Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., LOCATED_AT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Inverse Name
            </label>
            <input
              type="text"
              value={inverseName}
              onChange={(e) => setInverseName(e.target.value)}
              className="input"
              placeholder="e.g., HAS_LOCATION"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input"
              placeholder="Describe this relationship..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cardinality
            </label>
            <select
              value={cardinality}
              onChange={(e) => setCardinality(e.target.value as '1:1' | '1:N' | 'N:M')}
              className="select"
            >
              <option value="1:1">One-to-One (1:1)</option>
              <option value="1:N">One-to-Many (1:N)</option>
              <option value="N:M">Many-to-Many (N:M)</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={!fromTable || !toTable || !name || !inverseName}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipEditor;
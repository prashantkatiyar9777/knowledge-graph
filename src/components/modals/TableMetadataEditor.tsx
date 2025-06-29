import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { Modal, Input, Button } from '../ui';
import { Table } from '../../types';
import { cn } from '../../utils/cn';

interface TableMetadataEditorProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onSave: (updates: Partial<Table>) => void;
}

export const TableMetadataEditor: React.FC<TableMetadataEditorProps> = ({
  isOpen,
  onClose,
  table,
  onSave
}) => {
  const [alternateNames, setAlternateNames] = useState<string[]>(table?.alternativeNames || []);
  const [newAlternateName, setNewAlternateName] = useState('');
  const [description, setDescription] = useState(table?.description || '');
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const [fieldSearch, setFieldSearch] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fieldPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (table) {
      setAlternateNames(table.alternativeNames || []);
      setDescription(table.description || '');
    }
  }, [table]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fieldPickerRef.current && !fieldPickerRef.current.contains(event.target as Node)) {
        setShowFieldPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddAlternateName = () => {
    if (newAlternateName.trim() && !alternateNames.includes(newAlternateName.trim())) {
      setAlternateNames([...alternateNames, newAlternateName.trim()]);
      setNewAlternateName('');
    }
  };

  const handleRemoveAlternateName = (nameToRemove: string) => {
    setAlternateNames(alternateNames.filter(name => name !== nameToRemove));
  };

  const insertFieldReference = (fieldName: string) => {
    if (descriptionRef.current) {
      const start = descriptionRef.current.selectionStart;
      const end = descriptionRef.current.selectionEnd;
      const currentDescription = description;
      const newDescription = 
        currentDescription.substring(0, start) +
        `{{${fieldName}}}` +
        currentDescription.substring(end);
      
      setDescription(newDescription);
      setShowFieldPicker(false);
      setFieldSearch('');
      
      setTimeout(() => {
        if (descriptionRef.current) {
          const newPosition = start + fieldName.length + 4;
          descriptionRef.current.focus();
          descriptionRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  const handleSave = () => {
    if (!table) return;
    
    const updates = {
      ...table,
      alternativeNames: alternateNames,
      description
    };
    
    console.log('Saving table updates:', {
      tableId: table._id,
      updates,
      alternateNames,
      description
    });
    
    onSave(updates);
  };

  if (!table) return null;

  // Mock fields for demonstration
  const mockFields = [
    { name: 'ID', type: 'UUID', description: 'Unique identifier' },
    { name: 'NAME', type: 'VARCHAR', description: 'Name of the item' },
    { name: 'DESCRIPTION', type: 'TEXT', description: 'Detailed description' },
    { name: 'STATUS', type: 'VARCHAR', description: 'Current status' },
    { name: 'CREATED_AT', type: 'TIMESTAMP', description: 'Creation timestamp' },
    { name: 'UPDATED_AT', type: 'TIMESTAMP', description: 'Last update timestamp' }
  ];

  const filteredFields = mockFields.filter(field => 
    field.name.toLowerCase().includes(fieldSearch.toLowerCase()) ||
    field.description.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="text-xl font-semibold">Edit Table Metadata</div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {/* Table Information */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">{table.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <span className="px-2.5 py-1 bg-white rounded-md border border-slate-200 font-medium">
                  {typeof table.source === 'object' && table.source !== null ? table.source.name : 'Unknown Source'}
                </span>
                <span>•</span>
                <span>{table.fieldsCount ?? 0} fields</span>
                <span>•</span>
                <span>{table.recordsCount?.toLocaleString() ?? '0'} records</span>
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
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAlternateName();
                  }
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAddAlternateName}
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
                      onClick={() => handleRemoveAlternateName(name)}
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
          <div className="relative">
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-200 font-mono text-sm resize-none"
              placeholder="Describe this table... Use {{field_name}} to reference fields"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 bottom-2"
              onClick={() => setShowFieldPicker(true)}
            >
              Insert Field
            </Button>
          </div>

          {/* Field Picker Dropdown */}
          {showFieldPicker && (
            <div 
              ref={fieldPickerRef}
              className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-10"
            >
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search fields..."
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {filteredFields.map((field) => (
                  <button
                    key={field.name}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => insertFieldReference(field.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {field.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {field.description}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {field.type}
                      </span>
                    </div>
                  </button>
                ))}
                {filteredFields.length === 0 && (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">
                    No fields found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end gap-2">
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

export default TableMetadataEditor;
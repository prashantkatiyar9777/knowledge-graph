import React, { useState, useEffect } from 'react';
import { Modal, Button, Select } from '../ui';
import useDataStore from '../../stores/dataStore';

interface BulkSelfRelationshipEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (relationships: any[]) => void;
}

const BulkSelfRelationshipEditor: React.FC<BulkSelfRelationshipEditorProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const dataStore = useDataStore();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await dataStore.fetchTables();
      await dataStore.fetchRelationshipFields();
    };
    loadData();
  }, [dataStore]);

  const availableFields = dataStore.relationshipFields?.filter(
    field => field.table_id === selectedTable
  ) ?? [];

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSave = () => {
    const newRelationships = selectedFields.map(fieldId => {
      const field = dataStore.relationshipFields?.find(f => f.id === fieldId);
      return {
        table_id: selectedTable,
        field_id: fieldId,
        name: `SAME_${field?.name}`,
        alternative_names: [],
        description: `Records that share the same ${field?.name}`
      };
    });
    onSave(newRelationships);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        Bulk Create Self Relationships
      </Modal.Header>

      <Modal.Body className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Table
          </label>
          <Select
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedFields([]);
            }}
            options={[
              { value: '', label: 'Select a table...' },
              ...(dataStore.tables ?? []).map(table => ({
                value: table.id,
                label: table.name
              }))
            ]}
          />
        </div>

        {selectedTable && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Relationship Fields
            </label>
            <div className="space-y-2 border border-slate-200 rounded-lg p-4">
              {availableFields.map(field => (
                <label key={field.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleFieldToggle(field.id)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-slate-900">{field.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedFields.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-900 mb-2">
              Preview of Relationships to Create
            </h4>
            <ul className="space-y-2">
              {selectedFields.map(fieldId => {
                const field = dataStore.relationshipFields?.find(f => f.id === fieldId);
                return (
                  <li key={fieldId} className="text-sm text-slate-600">
                    • SAME_{field?.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedTable || selectedFields.length === 0}
          >
            Create Relationships
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkSelfRelationshipEditor;
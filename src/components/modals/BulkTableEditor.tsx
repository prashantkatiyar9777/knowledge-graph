import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../ui';
import { TableData } from '../../types';
import { X, Plus } from 'lucide-react';

interface BulkTableEditorProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableData[];
  onSave: (updates: Partial<TableData>[]) => void;
}

interface TableEdit {
  id: string;
  name: string;
  alternateNames: string[];
  description: string;
  newAlternateName: string;
}

const BulkTableEditor: React.FC<BulkTableEditorProps> = ({
  isOpen,
  onClose,
  tables,
  onSave
}) => {
  const [tableEdits, setTableEdits] = useState<TableEdit[]>([]);

  useEffect(() => {
    setTableEdits(
      tables.map(table => ({
        id: table.id,
        name: table.name,
        alternateNames: table.alternateNames || [],
        description: table.description || '',
        newAlternateName: ''
      }))
    );
  }, [tables]);

  const handleAddAlternateName = (index: number) => {
    const edit = tableEdits[index];
    if (edit.newAlternateName.trim()) {
      const updatedEdits = [...tableEdits];
      updatedEdits[index] = {
        ...edit,
        alternateNames: [...edit.alternateNames, edit.newAlternateName.trim()],
        newAlternateName: ''
      };
      setTableEdits(updatedEdits);
    }
  };

  const handleRemoveAlternateName = (tableIndex: number, nameIndex: number) => {
    const updatedEdits = [...tableEdits];
    updatedEdits[tableIndex] = {
      ...updatedEdits[tableIndex],
      alternateNames: updatedEdits[tableIndex].alternateNames.filter((_, i) => i !== nameIndex)
    };
    setTableEdits(updatedEdits);
  };

  const handleSave = () => {
    const updates = tableEdits.map(edit => ({
      id: edit.id,
      alternateNames: edit.alternateNames,
      description: edit.description
    }));
    onSave(updates);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        Bulk Edit Tables
      </Modal.Header>

      <Modal.Body className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/4">
                  Table Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">
                  Alternative Names
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tableEdits.map((edit, index) => (
                <tr key={edit.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-slate-900">
                      {edit.name}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {edit.alternateNames.map((name, nameIndex) => (
                          <div
                            key={nameIndex}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200 text-sm"
                          >
                            <span>{name}</span>
                            <button
                              onClick={() => handleRemoveAlternateName(index, nameIndex)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={edit.newAlternateName}
                          onChange={(e) => {
                            const updatedEdits = [...tableEdits];
                            updatedEdits[index] = {
                              ...edit,
                              newAlternateName: e.target.value
                            };
                            setTableEdits(updatedEdits);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAlternateName(index);
                            }
                          }}
                          placeholder="Add alternative name"
                          className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <button
                          onClick={() => handleAddAlternateName(index)}
                          className="p-1 text-slate-400 hover:text-primary"
                          disabled={!edit.newAlternateName.trim()}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={edit.description}
                      onChange={(e) => {
                        const updatedEdits = [...tableEdits];
                        updatedEdits[index] = {
                          ...edit,
                          description: e.target.value
                        };
                        setTableEdits(updatedEdits);
                      }}
                      rows={3}
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter description..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default BulkTableEditor;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockTableData, mockFields } from '../utils/mockData';
import { Edit2, Save, X, Plus, Trash2, ArrowDownUp } from 'lucide-react';

const TableDetails: React.FC = () => {
  const { tableId } = useParams();
  const table = mockTableData.find(t => t.id === tableId);
  const fields = mockFields[tableId as keyof typeof mockFields] || [];
  
  const [editMode, setEditMode] = useState(false);
  const [tableName, setTableName] = useState(table?.name || '');
  const [tableDescription, setTableDescription] = useState('Master table for asset data');
  
  if (!table) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Table not found</h2>
        <p className="text-slate-600">The requested table could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {editMode ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="text-2xl font-semibold bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                className="p-1 text-green-600 hover:text-green-700"
                onClick={() => setEditMode(false)}
              >
                <Save size={20} />
              </button>
              <button 
                className="p-1 text-red-600 hover:text-red-700"
                onClick={() => {
                  setTableName(table.name);
                  setEditMode(false);
                }}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900">{tableName}</h1>
              <button 
                className="p-1 text-slate-400 hover:text-slate-600"
                onClick={() => setEditMode(true)}
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
          <p className="text-sm text-slate-500 mt-1">
            Source: {table.source} • {table.fields} fields • {table.records.toLocaleString()} records
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary flex items-center">
            <Plus size={16} className="mr-1.5" />
            Add Field
          </button>
        </div>
      </div>
      
      {/* Table details */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Table Description</h2>
          {editMode ? (
            <textarea
              value={tableDescription}
              onChange={(e) => setTableDescription(e.target.value)}
              className="w-full h-24 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <p className="text-slate-600">{tableDescription}</p>
          )}
        </div>
        
        {/* Fields list */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button className="flex items-center gap-1">
                    Field Name
                    <ArrowDownUp size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Alternate Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Value Mapping
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {field.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {field.alternateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {field.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {field.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {field.hasValueMapping ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Mapped
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-slate-600 mr-2">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableDetails;
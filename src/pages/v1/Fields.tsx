import React, { useState, useEffect } from 'react';
import { Eye, Plus, Search, Edit2, RefreshCw, Database, Filter, ChevronDown } from 'lucide-react';
import { Card, Button, Badge } from "../../components/ui";
import { cn } from "../../utils/cn";
import FieldMetadataEditor from "../../components/modals/FieldMetadataEditor";
import useDataStore from "../../stores/dataStore";
import { Table, Field } from '../types';

const Fields: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const itemsPerPage = 10;

  const { tables, fields, fetchTables, fetchFields } = useDataStore();

  useEffect(() => {
    fetchTables();
    fetchFields();
  }, [fetchTables, fetchFields]);

  const fieldTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'STRING', label: 'String' },
    { value: 'NUMBER', label: 'Number' },
    { value: 'INTEGER', label: 'Integer' },
    { value: 'FLOAT', label: 'Float' },
    { value: 'BOOLEAN', label: 'Boolean' },
    { value: 'DATE', label: 'Date' },
    { value: 'DATETIME', label: 'DateTime' },
    { value: 'TIMESTAMP', label: 'Timestamp' },
    { value: 'JSON', label: 'JSON' },
    { value: 'ARRAY', label: 'Array' }
  ];

  // Filter fields based on type and other criteria
  const filteredFields = (fields || []).filter((field: Field) => {
    const searchTermLower = searchTerm.toLowerCase();
    const tableName = tables.find((t: Table) => t._id?.toString() === field.tableId?.toString())?.name || '';
    const matchesSearch = 
      (field.name || '').toLowerCase().includes(searchTermLower) ||
      (field.alternativeNames || []).some(name => (name || '').toLowerCase().includes(searchTermLower)) ||
      (field.description || '').toLowerCase().includes(searchTermLower) ||
      tableName.toLowerCase().includes(searchTermLower);
    
    const matchesTable = selectedTable === 'all' || field.tableId?.toString() === selectedTable;
    const matchesType = selectedType === 'all' || field.type === selectedType;
    
    return matchesSearch && matchesTable && matchesType;
  });

  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditField = (field: Field) => {
    setSelectedField(field);
  };

  const handleSaveField = () => {
    setSelectedField(null);
    fetchFields();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Fields</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage field metadata and knowledge graph mappings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            className="gap-2"
            disabled={!filteredFields.some(f => f.kgStatus === 'Added to KG')}
          >
            <Eye size={16} />
            Preview Graph
          </Button>
          <Button 
            variant="primary" 
            className="gap-2"
            disabled={!filteredFields.some(f => f.kgStatus === 'Added to KG')}
          >
            <RefreshCw size={16} />
            Update Knowledge Graph
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search fields by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTableDropdown(!showTableDropdown);
              setShowTypeDropdown(false);
            }}
            className="inline-flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{selectedTable === 'all' ? 'All Tables' : tables.find(t => t._id?.toString() === selectedTable)?.name || 'All Tables'}</span>
            <ChevronDown size={16} className="ml-2 text-slate-400" />
          </button>
          
          {showTableDropdown && (
            <div className="absolute z-10 w-48 mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
              <div className="py-1 max-h-64 overflow-y-auto">
                <button
                  key="all"
                  onClick={() => {
                    setSelectedTable('all');
                    setShowTableDropdown(false);
                  }}
                  className={cn(
                    "block w-full px-4 py-2 text-sm text-left hover:bg-slate-50",
                    selectedTable === 'all' ? "text-primary font-medium" : "text-slate-700"
                  )}
                >
                  All Tables
                </button>
                {(tables || []).map((table) => (
                  <button
                    key={table._id?.toString()}
                    onClick={() => {
                      setSelectedTable(table._id?.toString() || 'all');
                      setShowTableDropdown(false);
                    }}
                    className={cn(
                      "block w-full px-4 py-2 text-sm text-left hover:bg-slate-50",
                      selectedTable === table._id?.toString() ? "text-primary font-medium" : "text-slate-700"
                    )}
                  >
                    {table.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowTableDropdown(false);
            }}
            className="inline-flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{fieldTypes.find(t => t.value === selectedType)?.label || 'All Types'}</span>
            <ChevronDown size={16} className="ml-2 text-slate-400" />
          </button>
          
          {showTypeDropdown && (
            <div className="absolute z-10 w-48 mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
              <div className="py-1 max-h-64 overflow-y-auto">
                {fieldTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedType(type.value);
                      setShowTypeDropdown(false);
                    }}
                    className={cn(
                      "block w-full px-4 py-2 text-sm text-left hover:bg-slate-50",
                      selectedType === type.value ? "text-primary font-medium" : "text-slate-700"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fields List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Field Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Table
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Alternative Names
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  KG Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {paginatedFields.map((field) => (
                <tr key={`${field.tableId}-${field._id}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {field.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Database size={14} />
                      {tables.find(t => t._id?.toString() === field.tableId?.toString())?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {field.alternativeNames?.join(', ') || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {field.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={field.kgStatus === 'Added to KG' ? 'success' :
                              field.kgStatus === 'Partially Added' ? 'warning' :
                              field.kgStatus === 'Error' ? 'error' : 'default'}
                      className="text-xs"
                    >
                      {field.kgStatus || 'Not Added'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditField(field)}
                      className="text-slate-400 hover:text-primary"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Field Editor Modal */}
      {selectedField && (
        <FieldMetadataEditor
          field={selectedField}
          onClose={() => setSelectedField(null)}
          onSave={handleSaveField}
        />
      )}
    </div>
  );
};

export default Fields;
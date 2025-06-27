import React, { useState } from 'react';
import { Eye, Plus, Search, Edit2, RefreshCw, Database, Filter, ChevronDown } from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import { TableField } from '../types';
import { mockFields, mockTableData } from '../utils/mockData';
import { cn } from '../utils/cn';
import FieldMetadataEditor from '../components/modals/FieldMetadataEditor';

const Fields: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'value' | 'relationship'>('value');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedField, setSelectedField] = useState<(TableField & { tableName: string; isRelationship?: boolean }) | null>(null);
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const itemsPerPage = 10;

  // Get all fields from all tables
  const allFields = Object.entries(mockFields).flatMap(([tableId, fields]) => {
    const table = mockTableData.find(t => t.id === tableId);
    return fields.map(field => ({
      ...field,
      tableName: table?.name || '',
      tableId,
      isInKG: table?.kgStatus === 'mapped' || table?.kgStatus === 'partially_mapped',
      isRelationship: field.type === 'UUID' || field.type === 'REFERENCE'
    }));
  });

  const tables = [
    { value: 'all', label: 'All Tables' },
    ...mockTableData.map(table => ({
      value: table.id,
      label: table.name
    }))
  ];

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
    { value: 'ARRAY', label: 'Array' },
    { value: 'UUID', label: 'UUID' },
    { value: 'REFERENCE', label: 'Reference' }
  ];

  // Filter fields based on type and other criteria
  const filteredFields = allFields.filter(field => {
    const matchesSearch = 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.alternateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.tableName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTable = selectedTable === 'all' || field.tableId === selectedTable;
    const matchesType = selectedType === 'all' || field.type === selectedType;
    const matchesTab = activeTab === 'relationship' ? field.isRelationship : !field.isRelationship;
    
    return matchesSearch && matchesTable && matchesType && matchesTab;
  });

  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditField = (field: typeof selectedField) => {
    setSelectedField(field);
  };

  const handleSaveField = (updates: Partial<TableField>) => {
    console.log('Saving field updates:', updates);
    setSelectedField(null);
  };

  return (
    <div className="space-y-6">
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
            icon={<Eye size={16} />}
            disabled={!filteredFields.some(f => f.isInKG)}
          >
            Preview Graph
          </Button>
          <Button 
            variant="primary" 
            icon={<RefreshCw size={16} />}
            disabled={!filteredFields.some(f => f.isInKG)}
          >
            Update Knowledge Graph
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={cn(
              'border-b-2 py-4 px-1 text-sm font-medium',
              activeTab === 'value'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
            onClick={() => setActiveTab('value')}
          >
            Value Fields
          </button>
          <button
            className={cn(
              'border-b-2 py-4 px-1 text-sm font-medium',
              activeTab === 'relationship'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            )}
            onClick={() => setActiveTab('relationship')}
          >
            Relationship Fields
          </button>
        </nav>
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
            <span>{tables.find(t => t.value === selectedTable)?.label}</span>
            <ChevronDown size={16} className="ml-2 text-slate-400" />
          </button>
          
          {showTableDropdown && (
            <div className="absolute z-10 w-48 mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
              <div className="py-1 max-h-64 overflow-y-auto">
                {tables.map((table) => (
                  <button
                    key={table.value}
                    onClick={() => {
                      setSelectedTable(table.value);
                      setShowTableDropdown(false);
                    }}
                    className={cn(
                      "block w-full px-4 py-2 text-sm text-left hover:bg-slate-50",
                      selectedTable === table.value ? "text-primary font-medium" : "text-slate-700"
                    )}
                  >
                    {table.label}
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
            <span>{fieldTypes.find(t => t.value === selectedType)?.label}</span>
            <ChevronDown size={16} className="ml-2 text-slate-400" />
          </button>
          
          {showTypeDropdown && (
            <div className="absolute z-10 w-48 mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
              <div className="py-1 max-h-64 overflow-y-auto">
                {fieldTypes
                  .filter(type => activeTab === 'relationship' ? 
                    ['UUID', 'REFERENCE', 'all'].includes(type.value) : 
                    !['UUID', 'REFERENCE'].includes(type.value))
                  .map((type) => (
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
                {activeTab === 'relationship' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Mapped To
                  </th>
                )}
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
                <tr key={`${field.tableId}-${field.id}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {field.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Database size={14} />
                      {field.tableName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">
                      {field.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {field.alternateName.split(',').map((name, index) => (
                        <Badge key={index} variant="default">
                          {name.trim()}
                        </Badge>
                      ))}
                      {!field.alternateName && (
                        <span className="text-sm text-slate-400 italic">
                          Not set
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {field.description || (
                      <span className="text-slate-400 italic">
                        No description
                      </span>
                    )}
                  </td>
                  {activeTab === 'relationship' && (
                    <td className="px-6 py-4">
                      <Badge variant="default">
                        ASSETS
                      </Badge>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {field.isInKG ? (
                      <Badge variant="success">In Knowledge Graph</Badge>
                    ) : (
                      <Badge variant="default">Not Mapped</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Edit2 size={16} />}
                      title="Edit Field Metadata"
                      onClick={() => handleEditField(field)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card.Footer className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredFields.length)}
              </span>{' '}
              of <span className="font-medium">{filteredFields.length}</span> fields
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Field Metadata Editor Modal */}
      <FieldMetadataEditor
        isOpen={!!selectedField}
        onClose={() => setSelectedField(null)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </div>
  );
};

export default Fields;
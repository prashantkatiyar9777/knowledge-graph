import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Eye, Plus, Search, Edit2, RefreshCw, Database, Filter, ChevronDown, ArrowLeft 
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';
import { TableField } from '../../types';
import { mockFields, mockTableData } from '../../utils/mockData';
import { cn } from '../../utils/cn';
import FieldMetadataEditor from '../../components/modals/FieldMetadataEditor';

const TableFields: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table');
  const sourceName = searchParams.get('source');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedField, setSelectedField] = useState<(TableField & { tableName: string; isRelationship?: boolean; mappedToTable?: string }) | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const itemsPerPage = 10;

  // Get table information
  const table = mockTableData.find(t => t.id === tableId);

  // Mock fields data
  const dummyFields = [
    {
      id: 'field1',
      name: 'TAG_ID',
      type: 'UUID',
      alternateName: 'tag,identifier',
      description: 'Unique identifier for the tag',
      tableName: table?.name || '',
      tableId,
      isInKG: true,
      hasValueMapping: false
    },
    {
      id: 'field2',
      name: 'TAG_NAME',
      type: 'STRING',
      alternateName: 'name,label',
      description: 'Display name of the tag',
      tableName: table?.name || '',
      tableId,
      isInKG: true,
      hasValueMapping: false
    },
    {
      id: 'field3',
      name: 'DESCRIPTION',
      type: 'TEXT',
      alternateName: 'desc,details',
      description: 'Detailed description of the tag',
      tableName: table?.name || '',
      tableId,
      isInKG: true,
      hasValueMapping: false
    },
    {
      id: 'field4',
      name: 'DATA_TYPE',
      type: 'STRING',
      alternateName: 'type,format',
      description: 'Data type of the tag value',
      tableName: table?.name || '',
      tableId,
      isInKG: true,
      hasValueMapping: true
    },
    {
      id: 'field5',
      name: 'UNIT',
      type: 'STRING',
      alternateName: 'uom,measurement_unit',
      description: 'Unit of measurement',
      tableName: table?.name || '',
      tableId,
      isInKG: true,
      hasValueMapping: true
    }
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
    { value: 'TEXT', label: 'Text' }
  ];

  // Filter fields based on search and type
  const filteredFields = dummyFields.filter(field => {
    const matchesSearch = 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.alternateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || field.type === selectedType;
    
    return matchesSearch && matchesType;
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
          <Link 
            to={`/platform-tables?source=${encodeURIComponent(sourceName || '')}`} 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-2"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to {sourceName}
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">{table?.name} Fields</h1>
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

        {/* Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="inline-flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{fieldTypes.find(t => t.value === selectedType)?.label}</span>
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
                <tr key={`${field.tableId}-${field.id}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {field.name}
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
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {field.description}
                  </td>
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

export default TableFields;
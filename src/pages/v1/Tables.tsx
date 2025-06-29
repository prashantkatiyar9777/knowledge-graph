import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTableStore } from '../../hooks/useTableStore';
import useDataStore from '../../stores/dataStore';
import { 
  Plus, Search, Filter, Download, RefreshCw, Edit, 
  Eye, Database, Check, AlertCircle,
  ArrowDownUp, Info, X, ChevronDown 
} from 'lucide-react';
import { TableMetadataEditor } from "../../components/modals/TableMetadataEditor";
import { ConversionModal } from "../../components/modals/ConversionModal";
import BulkTableEditor from "../../components/modals/BulkTableEditor";
import { Button, Input, Select, Badge, Card } from "../../components/ui";
import { Table, Source } from "../../types";
import { cn } from "../../utils/cn";
import Loading from "../../components/ui/Loading";
import ErrorBoundary from "../../components/ui/ErrorBoundary";

interface TableData {
  _id: string;
  serialNumber: number;
  name: string;
  source: {
    _id: string;
    name: string;
    description?: string;
    type: string;
  };
  alternativeNames?: string[];
  description?: string;
  recordsCount?: number;
  kgStatus?: string;
  kgRecordsCount?: number;
}

const Tables: React.FC = () => {
  const { tables, selectedTables, toggleTableSelection, setSelectedTables, updateTable, fetchTables } = useTableStore();
  const { sources, fetchSources } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<Table | null>(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [tablesData, setTablesData] = useState<TableData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchTables(), fetchSources()]);
        console.log('Tables component data:', {
          tablesCount: tables.length,
          sourcesCount: sources.length,
          sampleTable: tables[0] ? {
            name: tables[0].name,
            source: tables[0].source,
            hasSource: !!tables[0].source,
            sourceId: tables[0].source?._id
          } : null,
          sampleTableRaw: tables[0]
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchTables, fetchSources]);

  // Ensure we have data before rendering
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Filter and sort tables
  const filteredTables = tables.filter((table: Table) => {
    const matchesSearch = 
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.alternativeNames || []).some((name: string) => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (table.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || (table.source?._id.toString() === filterSource);
    const matchesStatus = filterStatus === 'all' || table.kgStatus === filterStatus;
    return matchesSearch && matchesSource && matchesStatus;
  }).sort((a: Table, b: Table) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'records') {
      return sortDirection === 'asc' 
        ? (a.recordsCount || 0) - (b.recordsCount || 0)
        : (b.recordsCount || 0) - (a.recordsCount || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
  const paginatedTables = filteredTables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Convert sources array to options format
  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    ...sources.map((source: Source) => ({
      value: source._id.toString(),
      label: source.name
    }))
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Added to KG', label: 'Added to KG' },
    { value: 'Partially Added', label: 'Partially Added' },
    { value: 'Not Added', label: 'Not Added' },
    { value: 'Error', label: 'Error' }
  ];

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEditMetadata = (table: Table) => {
    setSelectedTableForEdit(table);
  };

  const handleMetadataUpdate = async (updates: Partial<Table>) => {
    if (!selectedTableForEdit?._id) return;
    try {
      await updateTable(selectedTableForEdit._id.toString(), updates);
      setSelectedTableForEdit(null);
      await fetchTables(); // Refresh the tables list
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  const handleBulkEdit = () => {
    setShowBulkEditor(true);
  };

  const handleBulkUpdate = (updates: Partial<Table>[]) => {
    updates.forEach(update => {
      if (update._id) {
        updateTable(update._id.toString(), update);
      }
    });
    setShowBulkEditor(false);
  };

  const handleConvertSelected = () => {
    setShowConversionModal(true);
  };

  const getStatusBadge = (status: string, table: Table) => {
    switch (status) {
      case 'Added to KG':
        return (
          <Badge variant="success" icon={<Check size={12} />}>
            Added to KG
          </Badge>
        );
      case 'Partially Added':
        return (
          <Badge variant="warning" icon={<Info size={12} />}>
            Partially Added ({table.kgRecordsCount?.toLocaleString() ?? 0} of {table.recordsCount?.toLocaleString() ?? 0})
          </Badge>
        );
      case 'Not Added':
        return (
          <Badge variant="warning" icon={<Info size={12} />}>
            Not Added
          </Badge>
        );
      case 'Error':
        return (
          <Badge variant="error" icon={<AlertCircle size={12} />}>
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tables</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage table metadata and knowledge graph conversion settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedTables.length > 0 && (
              <Button
                variant="secondary"
                icon={<Edit size={16} />}
                onClick={handleBulkEdit}
              >
                Bulk Edit ({selectedTables.length})
              </Button>
            )}
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              disabled={selectedTables.length === 0}
              onClick={handleConvertSelected}
            >
              Convert Selected ({selectedTables.length})
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search tables by name, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Source Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSourceDropdown(!showSourceDropdown);
                setShowStatusDropdown(false);
              }}
              className="inline-flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span>{sourceOptions.find(s => s.value === filterSource)?.label}</span>
              <ChevronDown size={16} className="ml-2 text-slate-400" />
            </button>
            
            {showSourceDropdown && (
              <div className="absolute z-10 w-48 mt-1 bg-white rounded-md shadow-lg border border-slate-200">
                <div className="py-1">
                  {sourceOptions.map((source) => (
                    <button
                      key={source.value}
                      onClick={() => {
                        setFilterSource(source.value);
                        setShowSourceDropdown(false);
                      }}
                      className={cn(
                        "block w-full px-4 py-2 text-sm text-left hover:bg-slate-50",
                        filterSource === source.value ? "text-primary font-medium" : "text-slate-700"
                      )}
                    >
                      {source.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowSourceDropdown(false);
              }}
              className="inline-flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span>{statuses.find(s => s.value === filterStatus)?.label}</span>
              <ChevronDown size={16} className="ml-2 text-slate-400" />
            </button>
            
            {showStatusDropdown && (
              <div className="absolute z-10 w-48 mt-1 bg-white rounded-md shadow-lg border border-slate-200">
                <div className="py-1">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => {
                        setFilterStatus(status.value);
                        setShowStatusDropdown(false);
                      }}
                      className={cn(
                        "block w-full px-4 py-2 text-sm text-left hover:bg-slate-50",
                        filterStatus === status.value ? "text-primary font-medium" : "text-slate-700"
                      )}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tables List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="w-12 px-3 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedTables.length === filteredTables.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTables(filteredTables.map(t => t._id.toString()));
                        } else {
                          setSelectedTables([]);
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center gap-1 hover:text-slate-700"
                      onClick={() => toggleSort('name')}
                    >
                      Table Name {sortField === 'name' && <ArrowDownUp size={14} />}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Alternative Names
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fields
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center gap-1 hover:text-slate-700"
                      onClick={() => toggleSort('records')}
                    >
                      Records {sortField === 'records' && <ArrowDownUp size={14} />}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    KG Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedTables.map((table) => {
                  console.log('Rendering table:', {
                    name: table.name,
                    source: table.source,
                    hasSource: !!table.source,
                    sourceId: table.source?._id
                  });
                  return (
                    <tr key={table._id.toString()} className="hover:bg-slate-50">
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                          checked={selectedTables.includes(table._id.toString())}
                          onChange={() => toggleTableSelection(table._id.toString())}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {table.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-600">
                          {table.description || (
                            <span className="text-slate-400 italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {table.alternativeNames?.map((name, index) => (
                            <Badge key={index} variant="default">
                              {name}
                            </Badge>
                          )) || (
                            <span className="text-sm text-slate-400 italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Database size={14} />
                          {table.source?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {table.fieldsCount}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-600">
                          {table.recordsCount?.toLocaleString() ?? 0}
                        </div>
                        {(table.kgStatus === 'Added to KG' || table.kgStatus === 'Partially Added') && table.kgRecordsCount && (
                          <div className="text-xs text-green-600 mt-0.5">
                            {table.kgRecordsCount?.toLocaleString() ?? 0} in KG
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(table.kgStatus || 'Not Added', table)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Edit size={16} />}
                            onClick={() => handleEditMetadata(table)}
                            title="Edit Metadata"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Eye size={16} />}
                            title="Preview Records"
                          />
                          {table.kgStatus !== 'Added to KG' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<RefreshCw size={16} />}
                              onClick={() => {
                                setSelectedTables([table._id.toString()]);
                                handleConvertSelected();
                              }}
                              title="Convert to Knowledge Graph"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card.Footer className="flex items-center justify-between">
              <div className="text-sm text-slate-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTables.length)}</span> of <span className="font-medium">{filteredTables.length}</span> results
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

        {/* Table Metadata Editor Modal */}
        {selectedTableForEdit && (
          <TableMetadataEditor
            isOpen={!!selectedTableForEdit}
            onClose={() => setSelectedTableForEdit(null)}
            table={selectedTableForEdit}
            onSave={handleMetadataUpdate}
          />
        )}

        {/* Bulk Table Editor Modal */}
        <BulkTableEditor
          isOpen={showBulkEditor}
          onClose={() => setShowBulkEditor(false)}
          tables={tables.filter(table => selectedTables.includes(table._id.toString()))}
          onSave={handleBulkUpdate}
        />

        {/* Conversion Modal */}
        {showConversionModal && (
          <ConversionModal
            isOpen={showConversionModal}
            onClose={() => setShowConversionModal(false)}
            tables={tables.filter(table => selectedTables.includes(table._id.toString()))}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Tables;
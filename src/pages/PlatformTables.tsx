import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, Search, Filter, Download, RefreshCw, Edit, 
  Eye, Database, Check, AlertCircle,
  ArrowDownUp, Info, X, ChevronDown 
} from 'lucide-react';
import { TableMetadataEditor } from '../components/modals/TableMetadataEditor';
import { ConversionModal } from '../components/modals/ConversionModal';
import BulkTableEditor from '../components/modals/BulkTableEditor';
import { Button, Input, Select, Badge, Card } from '../components/ui';
import { TableData } from '../types';
import { cn } from '../utils/cn';
import { mockTableData } from '../utils/mockData';

const PlatformTables: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sourceName = searchParams.get('source');

  // Filter tables for this platform
  const platformTables = mockTableData.filter(table => 
    table.source === sourceName
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<TableData | null>(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Filter and sort tables
  const filteredTables = platformTables.filter(table => {
    const matchesSearch = 
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.alternateNames || []).some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (table.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || table.kgStatus === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'records') {
      return sortDirection === 'asc' 
        ? (a.records || 0) - (b.records || 0)
        : (b.records || 0) - (a.records || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
  const paginatedTables = filteredTables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'mapped', label: 'Added to KG' },
    { value: 'partially_mapped', label: 'Partially Added' },
    { value: 'pending', label: 'Not Added' },
    { value: 'error', label: 'Error' }
  ];

  const getStatusBadge = (status: string, table: TableData) => {
    switch (status) {
      case 'mapped':
        return (
          <Badge variant="success" icon={<Check size={12} />}>
            Added to KG
          </Badge>
        );
      case 'partially_mapped':
        return (
          <Badge variant="warning" icon={<Info size={12} />}>
            Partially Added ({table.kgRecords?.toLocaleString() ?? 0} of {table.records?.toLocaleString() ?? 0})
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" icon={<Info size={12} />}>
            Not Added
          </Badge>
        );
      case 'error':
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            to="/dashboard-builder" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-2"
          >
            ← Back to Dashboard Builder
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">{sourceName}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage table metadata and knowledge graph conversion settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTables.length > 0 && (
            <Button
              variant="secondary"
              icon={<Edit size={16} />}
              onClick={() => setShowBulkEditor(true)}
            >
              Bulk Edit ({selectedTables.length})
            </Button>
          )}
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            disabled={selectedTables.length === 0}
            onClick={() => setShowConversionModal(true)}
          >
            Convert Selected ({selectedTables.length})
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="inline-flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{statuses.find(s => s.value === filterStatus)?.label}</span>
            <ChevronDown size={16} className="ml-2 text-slate-400" />
          </button>
          
          {showStatusDropdown && (
            <div className="absolute z-10 w-48 mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
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

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-12 px-3 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedTables.length === filteredTables.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTables(filteredTables.map(t => t.id));
                      } else {
                        setSelectedTables([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700"
                    onClick={() => {
                      if (sortField === 'name') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortField('name');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    Table Name {sortField === 'name' && <ArrowDownUp size={14} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Alternative Names
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fields
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700"
                    onClick={() => {
                      if (sortField === 'records') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortField('records');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    Records {sortField === 'records' && <ArrowDownUp size={14} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  KG Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedTables.map((table) => (
                <tr 
                  key={table.id} 
                  className="hover:bg-slate-50"
                >
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedTables.includes(table.id)}
                      onChange={() => {
                        if (selectedTables.includes(table.id)) {
                          setSelectedTables(selectedTables.filter(id => id !== table.id));
                        } else {
                          setSelectedTables([...selectedTables, table.id]);
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Link 
                      to={`/fields?table=${table.id}&source=${sourceName}`}
                      className="text-sm font-medium text-slate-900 hover:text-primary"
                    >
                      {table.name}
                    </Link>
                    {table.description && (
                      <div className="text-xs text-slate-500 mt-1">
                        {table.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {table.alternateNames?.map((name, index) => (
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
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {table.fields}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-600">
                      {table.records?.toLocaleString() ?? 0}
                    </div>
                    {(table.kgStatus === 'mapped' || table.kgStatus === 'partially_mapped') && table.kgRecords && (
                      <div className="text-xs text-green-600 mt-0.5">
                        {table.kgRecords?.toLocaleString() ?? 0} in KG
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(table.kgStatus, table)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit size={16} />}
                        onClick={() => setSelectedTableForEdit(table)}
                        title="Edit Metadata"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye size={16} />}
                        title="Preview Records"
                      />
                      {table.kgStatus !== 'mapped' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<RefreshCw size={16} />}
                          onClick={() => {
                            setSelectedTables([table.id]);
                            setShowConversionModal(true);
                          }}
                          title="Convert to Knowledge Graph"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Card.Footer className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredTables.length)}
              </span>{' '}
              of <span className="font-medium">{filteredTables.length}</span> results
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
          onSave={(updates) => {
            console.log('Saving table updates:', updates);
            setSelectedTableForEdit(null);
          }}
        />
      )}

      {/* Bulk Table Editor Modal */}
      <BulkTableEditor
        isOpen={showBulkEditor}
        onClose={() => setShowBulkEditor(false)}
        tables={platformTables.filter(table => selectedTables.includes(table.id))}
        onSave={(updates) => {
          console.log('Saving bulk updates:', updates);
          setShowBulkEditor(false);
        }}
      />

      {/* Conversion Modal */}
      {showConversionModal && (
        <ConversionModal
          isOpen={showConversionModal}
          onClose={() => setShowConversionModal(false)}
          tables={platformTables.filter(table => selectedTables.includes(table.id))}
        />
      )}
    </div>
  );
};

export default PlatformTables;
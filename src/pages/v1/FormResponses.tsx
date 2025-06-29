import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, Download, RefreshCw, Edit2, 
  Eye, ClipboardList, Check, AlertCircle, 
  ArrowDownUp, Info, X, ChevronDown, ArrowLeft 
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { cn } from '../../utils/cn';
import FormMetadataEditor from '../../components/modals/FormMetadataEditor';

interface FormResponse {
  id: string;
  title: string;
  description: string;
  questions: number;
  responses: number;
  kgResponses: number;
  status: 'converted' | 'partially' | 'pending' | 'error';
  lastSync: string;
}

const FormResponses: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const formType = searchParams.get('type');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);

  // Mock data for form responses
  const mockFormResponses: FormResponse[] = [
    {
      id: '1',
      title: 'Equipment Inspection Round',
      description: 'Daily equipment inspection checklist',
      questions: 25,
      responses: 5000,
      kgResponses: 4500,
      status: 'converted',
      lastSync: '2025-02-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Safety Observation',
      description: 'Safety observation and hazard reporting',
      questions: 15,
      responses: 3000,
      kgResponses: 2000,
      status: 'partially',
      lastSync: '2025-02-15T09:00:00Z'
    },
    {
      id: '3',
      title: 'Process Deviation Report',
      description: 'Report for process deviations and impacts',
      questions: 20,
      responses: 1500,
      kgResponses: 0,
      status: 'pending',
      lastSync: null
    }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'converted', label: 'Converted' },
    { value: 'partially', label: 'Partially Converted' },
    { value: 'pending', label: 'Not Converted' },
    { value: 'error', label: 'Error' }
  ];

  const filteredForms = mockFormResponses.filter(form => {
    const matchesSearch = 
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortField === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const getStatusBadge = (status: string, form: FormResponse) => {
    switch (status) {
      case 'converted':
        return <Badge variant="success" icon={<Check size={12} />}>Converted</Badge>;
      case 'partially':
        return (
          <Badge variant="warning" icon={<AlertCircle size={12} />}>
            Partially ({form.kgResponses} / {form.responses})
          </Badge>
        );
      case 'pending':
        return <Badge variant="default">Not Converted</Badge>;
      case 'error':
        return <Badge variant="error" icon={<AlertCircle size={12} />}>Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link 
              to="/dashboard-builder" 
              className="inline-flex items-center text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back to Dashboard Builder
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{formType}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage form responses and knowledge graph conversion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={<RefreshCw size={16} />}
            disabled={selectedForms.length === 0}
          >
            Convert Selected ({selectedForms.length})
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search forms..."
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
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedForms.length === filteredForms.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedForms(filteredForms.map(f => f.id));
                      } else {
                        setSelectedForms([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Responses
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
              {filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedForms.includes(form.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedForms([...selectedForms, form.id]);
                        } else {
                          setSelectedForms(selectedForms.filter(id => id !== form.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{form.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{form.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {form.questions}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {form.responses.toLocaleString()}
                    </div>
                    {form.kgResponses > 0 && (
                      <div className="text-xs text-green-600 mt-0.5">
                        {form.kgResponses.toLocaleString()} in KG
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(form.status, form)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit2 size={16} />}
                        onClick={() => setSelectedForm(form)}
                        title="Edit Form"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye size={16} />}
                        title="Preview Responses"
                      />
                      {form.status !== 'converted' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<RefreshCw size={16} />}
                          onClick={() => {
                            setSelectedForms([form.id]);
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
      </Card>

      <FormMetadataEditor
        isOpen={!!selectedForm}
        onClose={() => setSelectedForm(null)}
        form={selectedForm}
        onSave={(updates) => {
          console.log('Saving form updates:', updates);
          setSelectedForm(null);
        }}
      />
    </div>
  );
};

export default FormResponses;
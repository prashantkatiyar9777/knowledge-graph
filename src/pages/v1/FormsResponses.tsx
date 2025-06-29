import React, { useState } from 'react';
import { 
  Search, Filter, Download, RefreshCw, Edit2, 
  Eye, HelpCircle, Calendar, Check, AlertTriangle, X,
  ChevronDown, FileText, ArrowDownUp, Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, Button, Badge } from "../../components/ui";
import { cn } from "../../utils/cn";
import FormMetadataEditor from "../../components/modals/FormMetadataEditor";

type FormType = 'embedded' | 'round' | 'permit' | 'jha' | 'inspection' | 'generic';
type FormStatus = 'not_converted' | 'partially' | 'converted' | 'error';

interface FormField {
  id: string;
  name: string;
  type: string;
  description?: string;
  ontologyMapping?: string;
  validationRules?: string[];
  examples?: string[];
}

interface Form {
  id: string;
  name: string;
  type: FormType;
  questions: FormField[];
  responses: number;
  description: string;
  kgStatus: FormStatus;
  kgProgress?: number;
  lastConverted?: string;
  ontologyClass?: string;
  relationships?: {
    type: string;
    target: string;
    description: string;
  }[];
}

const mockForms: Form[] = [
  {
    id: 'ef1',
    name: 'Process Deviation Report',
    type: 'embedded',
    questions: [
      { id: 'q1', name: 'Process ID', type: 'reference', ontologyMapping: 'Process.identifier' },
      { id: 'q2', name: 'Deviation Type', type: 'select', ontologyMapping: 'Deviation.category' },
      { id: 'q3', name: 'Impact Level', type: 'select', ontologyMapping: 'Impact.severity' }
    ],
    responses: 89,
    description: 'Form for reporting process deviations and impacts',
    kgStatus: 'converted',
    kgProgress: 100,
    ontologyClass: 'ProcessDeviation',
    relationships: [
      { type: 'IMPACTS', target: 'Process', description: 'Affected process' },
      { type: 'REQUIRES', target: 'Action', description: 'Required corrective actions' }
    ]
  },
  {
    id: 'rt1',
    name: 'Daily Equipment Check',
    type: 'round',
    questions: [
      { id: 'q1', name: 'Equipment ID', type: 'reference', ontologyMapping: 'Equipment.identifier' },
      { id: 'q2', name: 'Operating Parameters', type: 'number[]', ontologyMapping: 'Parameter.value' },
      { id: 'q3', name: 'Condition Rating', type: 'select', ontologyMapping: 'Condition.rating' }
    ],
    responses: 1200,
    description: 'Daily equipment inspection and parameter recording',
    kgStatus: 'partially',
    kgProgress: 80,
    ontologyClass: 'EquipmentCheck',
    relationships: [
      { type: 'CHECKS', target: 'Equipment', description: 'Equipment being inspected' },
      { type: 'RECORDS', target: 'Parameter', description: 'Parameters recorded' }
    ]
  },
  {
    id: 'pt1',
    name: 'Hot Work Permit',
    type: 'permit',
    questions: [
      { id: 'q1', name: 'Work Area', type: 'reference', ontologyMapping: 'Location.identifier' },
      { id: 'q2', name: 'Fire Watch Required', type: 'boolean', ontologyMapping: 'Safety.requirement' },
      { id: 'q3', name: 'PPE Requirements', type: 'multiselect', ontologyMapping: 'PPE.type' }
    ],
    responses: 214,
    description: 'Permit for hot work activities',
    kgStatus: 'converted',
    kgProgress: 100,
    ontologyClass: 'WorkPermit',
    relationships: [
      { type: 'AUTHORIZES', target: 'Work', description: 'Authorized work' },
      { type: 'REQUIRES', target: 'Safety', description: 'Safety requirements' }
    ]
  },
  {
    id: 'jt1',
    name: 'Confined Space Entry JHA',
    type: 'jha',
    questions: [
      { id: 'q1', name: 'Space ID', type: 'reference', ontologyMapping: 'Space.identifier' },
      { id: 'q2', name: 'Hazards', type: 'multiselect', ontologyMapping: 'Hazard.type' },
      { id: 'q3', name: 'Controls', type: 'multiselect', ontologyMapping: 'Control.measure' }
    ],
    responses: 156,
    description: 'Job hazard analysis for confined space entry',
    kgStatus: 'partially',
    kgProgress: 75,
    ontologyClass: 'HazardAnalysis',
    relationships: [
      { type: 'ANALYZES', target: 'Task', description: 'Task being analyzed' },
      { type: 'IDENTIFIES', target: 'Hazard', description: 'Identified hazards' }
    ]
  },
  {
    id: 'if1',
    name: 'Critical Equipment Inspection',
    type: 'inspection',
    questions: [
      { id: 'q1', name: 'Equipment ID', type: 'reference', ontologyMapping: 'Equipment.identifier' },
      { id: 'q2', name: 'Components', type: 'checklist', ontologyMapping: 'Component.status' },
      { id: 'q3', name: 'Measurements', type: 'number[]', ontologyMapping: 'Measurement.value' }
    ],
    responses: 456,
    description: 'Detailed critical equipment inspection checklist',
    kgStatus: 'converted',
    kgProgress: 100,
    ontologyClass: 'EquipmentInspection',
    relationships: [
      { type: 'INSPECTS', target: 'Equipment', description: 'Equipment being inspected' },
      { type: 'GENERATES', target: 'Finding', description: 'Inspection findings' }
    ]
  },
  {
    id: 'gf1',
    name: 'Management of Change',
    type: 'generic',
    questions: [
      { id: 'q1', name: 'Change ID', type: 'reference', ontologyMapping: 'Change.identifier' },
      { id: 'q2', name: 'Impact Areas', type: 'multiselect', ontologyMapping: 'Impact.area' },
      { id: 'q3', name: 'Risk Assessment', type: 'matrix', ontologyMapping: 'Risk.assessment' }
    ],
    responses: 89,
    description: 'Management of change request and assessment',
    kgStatus: 'partially',
    kgProgress: 60,
    ontologyClass: 'ChangeRequest',
    relationships: [
      { type: 'MODIFIES', target: 'Process', description: 'Process being changed' },
      { type: 'REQUIRES', target: 'Approval', description: 'Required approvals' }
    ]
  }
];

const FormsResponses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FormType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FormStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'name' | 'responses' | 'lastConverted'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  const handleEditForm = (form: Form) => {
    setSelectedForm(form);
  };

  const handleSaveForm = (updates: any) => {
    console.log('Saving form updates:', updates);
    setSelectedForm(null);
  };

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'converted', label: 'Converted' },
    { value: 'partially', label: 'Partially Converted' },
    { value: 'not_converted', label: 'Not Converted' },
    { value: 'error', label: 'Error' }
  ];

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = 
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || form.type === activeTab;
    const matchesStatus = filterStatus === 'all' || form.kgStatus === filterStatus;
    return matchesSearch && matchesTab && matchesStatus;
  });

  const sortedForms = [...filteredForms].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'responses') {
      comparison = a.responses - b.responses;
    } else if (sortField === 'lastConverted') {
      comparison = (a.lastConverted || '').localeCompare(b.lastConverted || '');
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: FormStatus, progress?: number) => {
    switch (status) {
      case 'converted':
        return <Badge variant="success" icon={<Check size={12} />}>Converted</Badge>;
      case 'partially':
        return (
          <Badge variant="warning" icon={<AlertTriangle size={12} />}>
            Partially ({progress}%)
          </Badge>
        );
      case 'error':
        return <Badge variant="error" icon={<X size={12} />}>Error</Badge>;
      default:
        return <Badge variant="default">Not Converted</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Forms Responses</h1>
          <HelpCircle 
            size={16} 
            className="text-slate-400 cursor-help"
            title="View and manage form responses and their Knowledge Graph mappings"
          />
        </div>
        <Button
          variant="primary"
          icon={<RefreshCw size={16} />}
        >
          Update Knowledge Graph
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Forms' },
            { id: 'embedded', label: 'Embedded Forms' },
            { id: 'round', label: 'Round Templates' },
            { id: 'permit', label: 'Permit Templates' },
            { id: 'jha', label: 'JHA Templates' },
            { id: 'inspection', label: 'Inspection' },
            { id: 'generic', label: 'Generic Forms' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={cn(
                'border-b-2 py-4 px-1 text-sm font-medium',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              onClick={() => setActiveTab(tab.id as FormType | 'all')}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search forms by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
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
                      setFilterStatus(status.value as FormStatus | 'all');
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

      {/* Forms Table */}
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
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700"
                    onClick={() => handleSort('name')}
                  >
                    Form Name {sortField === 'name' && <ArrowDownUp size={14} />}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700"
                    onClick={() => handleSort('responses')}
                  >
                    Responses {sortField === 'responses' && <ArrowDownUp size={14} />}
                  </button>
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
              {sortedForms.map((form) => (
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
                    <div className="text-sm font-medium text-slate-900">{form.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{form.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {form.questions.length}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {form.responses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(form.kgStatus, form.kgProgress)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye size={16} />}
                        title="View Form"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit2 size={16} />}
                        onClick={() => handleEditForm(form)}
                        title="Edit Form"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Settings size={16} />}
                        title="Form Settings"
                      />
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
        onSave={handleSaveForm}
      />
    </div>
  );
};

export default FormsResponses;
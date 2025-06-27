import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Check, ArrowRight, ChevronLeft, ChevronRight, X, Clock, Plus, Filter, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface OnboardingProps {
  onClose: () => void;
}

const steps = [
  {
    id: 'connect',
    title: 'Connect Data Sources',
    description: 'Select the data sources you want to include in your knowledge graph.',
  },
  {
    id: 'tables',
    title: 'Select Tables',
    description: 'Choose which tables from your data sources to include in your knowledge graph.',
  },
  {
    id: 'configure',
    title: 'Configure Table Import',
    description: 'Set up table configurations and field mappings for your knowledge graph.',
  },
  {
    id: 'confirm',
    title: 'Import Data',
    description: 'Review your configuration and start the import process.',
  },
];

const dataSources = {
  core: [
    { id: 'innovapptive', name: 'Innovapptive', description: 'Connected Worker modules', icon: '🔄', status: 'integrated' },
  ],
  historians: [
    { id: 'factry', name: 'Factry Historian', description: 'Process data historian', icon: '📊', status: 'recent' },
    { id: 'aveva', name: 'Aveva Historian', description: 'Industrial data management', icon: '📈', status: 'integrated' },
    { id: 'aspen', name: 'Aspen InfoPlus.21 Historian', description: 'Process historian', icon: '📉', status: 'integrated' },
    { id: 'ge-historian', name: 'GE Proficy Historian', description: 'Time-series historian', icon: '⏲️', status: 'integrated' },
  ],
  erp: [
    { id: 'oracle-fusion', name: 'Oracle Fusion Cloud ERP', description: 'Enterprise resource planning', icon: '🏢', status: 'recent' },
    { id: 'pronto', name: 'Pronto Xi ERP', description: 'Business management system', icon: '💼', status: 'integrated' },
    { id: 'sap-hana', name: 'SAP HANA ERP', description: 'Enterprise management', icon: '🏭', status: 'recent' },
    { id: 'ibm-maximo', name: 'IBM Maximo ERP', description: 'Asset management', icon: '🔧', status: 'integrated' },
  ],
  iot: [
    { id: 'azure-iot', name: 'Azure IoT Suite', description: 'IoT platform services', icon: '☁️', status: 'integrated' },
    { id: 'siemens-mindsphere', name: 'Siemens MindSphere IoT', description: 'Industrial IoT', icon: '🌐', status: 'integrated' },
    { id: 'ptc-kepware', name: 'PTC Kepware IoT', description: 'Industrial connectivity', icon: '🔌', status: 'integrated' },
    { id: 'ptc-thingworx', name: 'PTC ThingWorx IIoT', description: 'Industrial IoT platform', icon: '📡', status: 'integrated' },
    { id: 'losant', name: 'Losant Enterprise IoT', description: 'IoT application platform', icon: '🛰️', status: 'integrated' },
  ],
  ehs: [
    { id: 'intelex', name: 'Intelex Suite EHS', description: 'EHS management', icon: '🛡️', status: 'integrated' },
    { id: 'enablon', name: 'Wolters Kluwer Enablon EHS', description: 'Risk management', icon: '⚠️', status: 'integrated' },
    { id: 'sphera', name: 'Sphera Cloud EHS', description: 'Safety management', icon: '🔒', status: 'integrated' },
  ],
  mes: [
    { id: 'ge-proficy', name: 'GE Proficy Smart Factory MES', description: 'Manufacturing execution', icon: '🏭', status: 'integrated' },
    { id: 'dynamics-mes', name: 'Microsoft Dynamics 365 MES', description: 'Production management', icon: '⚙️', status: 'integrated' },
    { id: 'siemens-opcenter', name: 'Siemens Opcenter MES', description: 'Manufacturing operations', icon: '🏗️', status: 'integrated' },
    { id: 'rockwell', name: 'Rockwell MES Suite', description: 'Production control', icon: '🔨', status: 'integrated' },
    { id: 'sap-mes', name: 'SAP MES', description: 'Manufacturing execution', icon: '🏢', status: 'integrated' },
  ],
};

const sourceTables = {
  'factry': [
    { id: 'factry-tags', name: 'TAG_MASTER', source: 'Factry Historian', fields: 25, records: 50000 },
    { id: 'factry-data', name: 'TIME_SERIES_DATA', source: 'Factry Historian', fields: 15, records: 5000000 },
    { id: 'factry-alarms', name: 'ALARM_HISTORY', source: 'Factry Historian', fields: 30, records: 100000 },
  ],
  'oracle-fusion': [
    { id: 'oracle-assets', name: 'FA_ASSETS', source: 'Oracle Fusion Cloud ERP', fields: 45, records: 25000 },
    { id: 'oracle-wo', name: 'WO_HEADERS', source: 'Oracle Fusion Cloud ERP', fields: 38, records: 150000 },
    { id: 'oracle-po', name: 'PO_HEADERS', source: 'Oracle Fusion Cloud ERP', fields: 42, records: 75000 },
  ],
  'sap-hana': [
    { id: 'sap-equi', name: 'EQUIPMENT', source: 'SAP HANA ERP', fields: 50, records: 30000 },
    { id: 'sap-floc', name: 'FUNC_LOC', source: 'SAP HANA ERP', fields: 35, records: 10000 },
    { id: 'sap-ord', name: 'ORDERS', source: 'SAP HANA ERP', fields: 48, records: 200000 },
  ],
  'aveva': [
    { id: 'aveva-tags', name: 'PI_POINTS', source: 'Aveva Historian', fields: 28, records: 75000 },
    { id: 'aveva-data', name: 'PI_VALUES', source: 'Aveva Historian', fields: 12, records: 8000000 },
  ],
  'aspen': [
    { id: 'aspen-tags', name: 'TAG_CONFIG', source: 'Aspen InfoPlus.21', fields: 32, records: 45000 },
    { id: 'aspen-hist', name: 'HISTORY', source: 'Aspen InfoPlus.21', fields: 18, records: 6000000 },
  ],
  'ge-historian': [
    { id: 'ge-points', name: 'POINTS', source: 'GE Proficy Historian', fields: 30, records: 60000 },
    { id: 'ge-data', name: 'ARCHIVE', source: 'GE Proficy Historian', fields: 15, records: 7000000 },
  ],
  'pronto': [
    { id: 'pronto-inv', name: 'INVENTORY', source: 'Pronto Xi ERP', fields: 40, records: 50000 },
    { id: 'pronto-po', name: 'PURCHASE_ORDERS', source: 'Pronto Xi ERP', fields: 35, records: 100000 },
  ],
  'ibm-maximo': [
    { id: 'maximo-assets', name: 'ASSET', source: 'IBM Maximo ERP', fields: 55, records: 35000 },
    { id: 'maximo-work', name: 'WORKORDER', source: 'IBM Maximo ERP', fields: 48, records: 180000 },
  ],
};

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [tableConfigs, setTableConfigs] = useState<Record<string, {
    alternateNames: string[];
    newAlternateName: string;
    description: string;
  }>>({});

  // New state for record filtering
  const [selectionMode, setSelectionMode] = useState<'all' | 'last_n' | 'date_range' | 'field_filter'>('all');
  const [lastNRecords, setLastNRecords] = useState<number>(1000);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [fieldFilters, setFieldFilters] = useState<Array<{field: string, operator: string, value: string}>>([]);
  
  const { setIsOnboarded } = useApp();
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (currentStep === steps.length) {
      startImport();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const toggleDataSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };
  
  const toggleTable = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };
  
  const startImport = () => {
    setIsImporting(true);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsOnboarded(true);
            navigate('/dashboard');
          }, 1000);
        }
        return newProgress;
      });
    }, 800);
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedSources.length > 0;
      case 2:
        return selectedTables.length > 0;
      default:
        return true;
    }
  };

  const handleAddAlternateName = (tableId: string) => {
    const config = tableConfigs[tableId];
    if (!config?.newAlternateName.trim()) return;

    setTableConfigs(prev => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        alternateNames: [...(prev[tableId]?.alternateNames || []), config.newAlternateName.trim()],
        newAlternateName: ''
      }
    }));
  };

  const handleRemoveAlternateName = (tableId: string, index: number) => {
    setTableConfigs(prev => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        alternateNames: prev[tableId].alternateNames.filter((_, i) => i !== index)
      }
    }));
  };

  const getTotalRecords = () => {
    return availableTables
      .filter(t => selectedTables.includes(t.id))
      .reduce((sum, table) => sum + table.records, 0);
  };

  const getTotalFields = () => {
    return availableTables
      .filter(t => selectedTables.includes(t.id))
      .reduce((sum, table) => sum + table.fields, 0);
  };

  const addFieldFilter = () => {
    setFieldFilters([...fieldFilters, { field: '', operator: '=', value: '' }]);
  };

  const removeFieldFilter = (index: number) => {
    setFieldFilters(fieldFilters.filter((_, i) => i !== index));
  };

  const updateFieldFilter = (index: number, updates: Partial<{field: string, operator: string, value: string}>) => {
    const newFilters = [...fieldFilters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFieldFilters(newFilters);
  };

  const availableTables = selectedSources.reduce((acc, sourceId) => {
    const tables = sourceTables[sourceId as keyof typeof sourceTables] || [];
    return [...acc, ...tables];
  }, [] as typeof sourceTables['factry']);

  const renderDataSourceCategory = (title: string, sources: typeof dataSources.core) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {sources.map((source) => (
          <button
            key={source.id}
            className={`flex items-center p-2 rounded border transition-colors ${
              selectedSources.includes(source.id)
                ? 'border-primary bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => toggleDataSource(source.id)}
          >
            <span className="flex-shrink-0 text-xl mr-2">{source.icon}</span>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 truncate">{source.name}</span>
                {source.status === 'recent' && (
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Recently Integrated
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 truncate">{source.description}</div>
            </div>
            <div className="flex-shrink-0 ml-2">
              {selectedSources.includes(source.id) ? (
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-300" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {selectedTables.map((tableId) => {
        const table = availableTables.find(t => t.id === tableId);
        if (!table) return null;

        if (!tableConfigs[tableId]) {
          setTableConfigs(prev => ({
            ...prev,
            [tableId]: {
              alternateNames: [],
              newAlternateName: '',
              description: ''
            }
          }));
        }

        const config = tableConfigs[tableId] || { alternateNames: [], newAlternateName: '', description: '' };

        return (
          <div key={table.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h4 className="text-sm font-medium text-slate-900">{table.name}</h4>
              <p className="text-xs text-slate-600">
                {table.source} • {table.fields} fields • {table.records.toLocaleString()} records
              </p>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900">
                  Alternative Names
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={config.newAlternateName}
                      onChange={(e) => setTableConfigs(prev => ({
                        ...prev,
                        [tableId]: { ...prev[tableId], newAlternateName: e.target.value }
                      }))}
                      placeholder="Enter an alternative name"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAlternateName(tableId);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                    onClick={() => handleAddAlternateName(tableId)}
                    disabled={!config.newAlternateName.trim()}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div className="min-h-[2.5rem] p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {config.alternateNames.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {config.alternateNames.map((name, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm"
                        >
                          <span className="text-sm text-slate-700">{name}</span>
                          <button
                            onClick={() => handleRemoveAlternateName(tableId, index)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic">
                      No alternative names added
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900">
                  Description
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => setTableConfigs(prev => ({
                    ...prev,
                    [tableId]: { ...prev[tableId], description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  placeholder="Describe this table's purpose..."
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderStep4 = () => {
    if (isImporting) {
      return (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-primary mb-4">
            <Database size={24} className={importProgress < 100 ? 'animate-pulse' : ''} />
          </div>
          <h3 className="text-base font-medium text-slate-900 mb-1">
            {importProgress < 100 ? 'Importing Data...' : 'Import Complete!'}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {importProgress < 100 
              ? 'Please wait while we process your data.'
              : 'Your knowledge graph has been created successfully.'}
          </p>
          
          <div className="w-full max-w-xs mx-auto bg-slate-200 rounded-full h-1.5 mb-2">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>
          
          {importProgress < 100 && (
            <p className="text-xs text-slate-500">
              {importProgress}% complete
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Summary Section */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-4">Import Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Data Sources:</span>
                <span className="font-medium text-slate-900">{selectedSources.length} selected</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Tables:</span>
                <span className="font-medium text-slate-900">{selectedTables.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Total Records:</span>
                <span className="font-medium text-slate-900">{getTotalRecords().toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Value Fields:</span>
                <span className="font-medium text-slate-900">{getTotalFields().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Relationship Fields:</span>
                <span className="font-medium text-slate-900">
                  {Math.round(getTotalFields() * 0.3).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Record Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Select Records to Convert</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'all', label: 'All Records', icon: <Check size={16} /> },
              { value: 'last_n', label: 'Last N Records', icon: <Filter size={16} /> },
              { value: 'date_range', label: 'Date Range', icon: <Calendar size={16} /> },
              { value: 'field_filter', label: 'Field Filter', icon: <Filter size={16} /> }
            ].map((option) => (
              <button
                key={option.value}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  selectionMode === option.value
                    ? 'bg-primary/5 border-primary'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectionMode(option.value as typeof selectionMode)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mode-specific configuration */}
          {selectionMode === 'last_n' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Number of Records</label>
              <input
                type="number"
                value={lastNRecords}
                onChange={(e) => setLastNRecords(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                min={1}
              />
            </div>
          )}

          {selectionMode === 'date_range' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Start Date</label>
                <input
                  type="datetime-local"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">End Date</label>
                <input
                  type="datetime-local"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>
          )}

          {selectionMode === 'field_filter' && (
            <div className="space-y-4">
              {fieldFilters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={filter.field}
                    onChange={(e) => updateFieldFilter(index, { field: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">Select field...</option>
                    <option value="status">Status</option>
                    <option value="type">Type</option>
                    <option value="priority">Priority</option>
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFieldFilter(index, { operator: e.target.value })}
                    className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">{">"}</option>
                    <option value="<">{"<"}</option>
                  </select>
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFieldFilter(index, { value: e.target.value })}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button
                    onClick={() => removeFieldFilter(index)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addFieldFilter}
                className="w-full px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5"
              >
                Add Field Filter
              </button>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex items-start text-xs">
          <Database size={14} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-blue-800">
            After import, you can define relationships between tables and visualize your knowledge graph.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Convert to Knowledge Graph</h2>
          <button 
            className="text-slate-400 hover:text-slate-500"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-primary h-1 transition-all duration-300" 
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-slate-900">{steps[currentStep - 1].title}</h3>
            <span className="text-sm text-slate-500">Step {currentStep} of {steps.length}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {renderDataSourceCategory('Core Platform', dataSources.core)}
              {renderDataSourceCategory('Historians', dataSources.historians)}
              {renderDataSourceCategory('ERP Systems', dataSources.erp)}
              {renderDataSourceCategory('IoT Platforms', dataSources.iot)}
              {renderDataSourceCategory('EHS Systems', dataSources.ehs)}
              {renderDataSourceCategory('MES Systems', dataSources.mes)}
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-medium text-slate-600">
                <div className="col-span-1"></div>
                <div className="col-span-4">Table Name</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-2">Fields</div>
                <div className="col-span-3">Records</div>
              </div>
              <div className="divide-y divide-slate-200">
                {availableTables.map((table) => (
                  <div 
                    key={table.id}
                    className={`grid grid-cols-12 px-4 py-2 cursor-pointer text-sm ${
                      selectedTables.includes(table.id) ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => toggleTable(table.id)}
                  >
                    <div className="col-span-1">
                      {selectedTables.includes(table.id) ? (
                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-300"></div>
                      )}
                    </div>
                    <div className="col-span-4 font-medium text-slate-900">{table.name}</div>
                    <div className="col-span-2 text-slate-600">{table.source}</div>
                    <div className="col-span-2 text-slate-600">{table.fields}</div>
                    <div className="col-span-3 text-slate-600">{table.records.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 3 && renderStep3()}
          
          {currentStep === 4 && renderStep4()}
        </div>
      </div>

      <div className="flex-shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
        {currentStep > 1 && !isImporting ? (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleBack}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        {!isImporting && (
          <button 
            className={`btn btn-primary btn-sm ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === steps.length ? 'Import and Convert to KG' : 'Next'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
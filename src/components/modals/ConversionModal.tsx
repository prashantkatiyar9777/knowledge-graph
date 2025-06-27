import React, { useState } from 'react';
import { Modal, Button, Input, Select } from '../ui';
import { TableData, ConversionProgress } from '../../types';
import { Check, AlertCircle, Loader, Calendar, Filter } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableData[];
}

type SelectionMode = 'all' | 'last_n' | 'date_range' | 'field_filter';

interface FieldFilter {
  field: string;
  operator: string;
  value: string;
}

export const ConversionModal: React.FC<ConversionModalProps> = ({
  isOpen,
  onClose,
  tables
}) => {
  // Selection mode state
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('all');
  const [lastNRecords, setLastNRecords] = useState<number>(1000);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [fieldFilters, setFieldFilters] = useState<FieldFilter[]>([]);
  
  // Conversion progress state
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress>({
    status: 'pending',
    progress: 0,
    message: 'Preparing to convert tables...'
  });

  const startConversion = () => {
    setIsConverting(true);
    setProgress({
      status: 'processing',
      progress: 0,
      message: 'Starting conversion process...'
    });

    // Simulate conversion process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress({
          status: 'completed',
          progress: 100,
          message: 'Conversion completed successfully!'
        });
      } else {
        setProgress({
          status: 'processing',
          progress: Math.min(currentProgress, 99),
          message: `Converting tables... ${Math.round(currentProgress)}% complete`
        });
      }
    }, 800);
  };

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <Check className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Loader className="w-8 h-8 text-primary animate-spin" />;
    }
  };

  const addFieldFilter = () => {
    setFieldFilters([...fieldFilters, { field: '', operator: '=', value: '' }]);
  };

  const removeFieldFilter = (index: number) => {
    setFieldFilters(fieldFilters.filter((_, i) => i !== index));
  };

  const updateFieldFilter = (index: number, updates: Partial<FieldFilter>) => {
    const newFilters = [...fieldFilters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFieldFilters(newFilters);
  };

  // Mock fields for demonstration
  const availableFields = [
    { value: 'status', label: 'Status' },
    { value: 'created_at', label: 'Created At' },
    { value: 'updated_at', label: 'Updated At' },
    { value: 'priority', label: 'Priority' },
    { value: 'category', label: 'Category' }
  ];

  const renderSelectionConfig = () => {
    switch (selectionMode) {
      case 'last_n':
        return (
          <div className="space-y-4">
            <Input
              type="number"
              label="Number of Records"
              value={lastNRecords}
              onChange={(e) => setLastNRecords(parseInt(e.target.value))}
              min={1}
              className="w-full"
            />
            <p className="text-sm text-slate-600">
              Will convert the last {lastNRecords.toLocaleString()} records from each table
            </p>
          </div>
        );

      case 'date_range':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                label="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="datetime-local"
                label="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <p className="text-sm text-slate-600">
              Will convert records created between the selected dates
            </p>
          </div>
        );

      case 'field_filter':
        return (
          <div className="space-y-4">
            {fieldFilters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  className="flex-1"
                  value={filter.field}
                  onChange={(e) => updateFieldFilter(index, { field: e.target.value })}
                  options={availableFields}
                />
                <Select
                  className="w-32"
                  value={filter.operator}
                  onChange={(e) => updateFieldFilter(index, { operator: e.target.value })}
                  options={[
                    { value: '=', label: 'Equals' },
                    { value: '!=', label: 'Not Equals' },
                    { value: '>', label: 'Greater Than' },
                    { value: '<', label: 'Less Than' }
                  ]}
                />
                <Input
                  className="flex-1"
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFieldFilter(index, { value: e.target.value })}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeFieldFilter(index)}
                >
                  <AlertCircle size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={addFieldFilter}
              className="w-full"
            >
              Add Field Filter
            </Button>
          </div>
        );

      default:
        return (
          <p className="text-sm text-slate-600">
            Will convert all records from the selected tables
          </p>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        Converting Tables to Knowledge Graph
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {!isConverting ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">
                Select Records to Convert
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'all', label: 'All Records', icon: <Check size={16} /> },
                  { value: 'last_n', label: 'Last N Records', icon: <Filter size={16} /> },
                  { value: 'date_range', label: 'Date Range', icon: <Calendar size={16} /> },
                  { value: 'field_filter', label: 'Field Filter', icon: <Filter size={16} /> }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={cn(
                      'p-4 rounded-lg border text-left transition-colors',
                      selectionMode === option.value
                        ? 'bg-primary/5 border-primary'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    )}
                    onClick={() => setSelectionMode(option.value as SelectionMode)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {renderSelectionConfig()}

              <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="text-sm font-medium text-slate-900 mb-2">
                  Selected Tables
                </h4>
                <div className="space-y-2">
                  {tables.map((table) => (
                    <div
                      key={table.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-slate-200"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {table.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {table.records.toLocaleString()} total records
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {progress.status === 'completed' ? 'Conversion Complete!' : 'Converting Tables'}
            </h3>
            
            <p className="text-sm text-slate-600 mb-4">
              {progress.message}
            </p>

            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>

            <div className="space-y-4">
              {tables.map((table, index) => (
                <div 
                  key={table.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    progress.progress > (index / tables.length) * 100
                      ? "bg-green-50 border-green-200"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{table.name}</h4>
                      <p className="text-xs text-slate-500">
                        {table.records.toLocaleString()} records
                      </p>
                    </div>
                    {progress.progress > (index / tables.length) * 100 && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isConverting && progress.status !== 'completed'}
          >
            Cancel
          </Button>
          {!isConverting ? (
            <Button
              variant="primary"
              onClick={startConversion}
            >
              Start Conversion
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onClose}
              disabled={progress.status !== 'completed'}
            >
              {progress.status === 'completed' ? 'Close' : 'Converting...'}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};
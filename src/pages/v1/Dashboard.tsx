import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, FilterX, Filter, Download, RefreshCw, 
  Edit, Eye, Database, AlertCircle, ArrowDownUp,
  Calendar, ChevronDown, CheckCircle, Clock, X,
  ChevronLeft, ChevronRight, BarChart3, Layers, FileText,
  Users, Settings, Activity, Edit2, ClipboardList
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Onboarding from './Onboarding';
import TableMetadataEditor from '../../components/modals/TableMetadataEditor';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('native');
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [showConvertWizard, setShowConvertWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showIntegrationBanner, setShowIntegrationBanner] = useState(true);
  const [showFormsConversionBanner, setShowFormsConversionBanner] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTableMetadataEditor, setShowTableMetadataEditor] = useState(false);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<any>(null);
  
  // Mock summary data
  const summary = {
    platforms: 6,
    collections: 624,
    totalFields: 156,
    totalRecords: 25789,
    convertedToKG: 18,
    pendingConversion: 6,
    conversionRate: 75,
    avgConversionTime: '120ms',
    errorRate: '0.5%',
    ontologyCoverage: '85%'
  };

  // Mock forms data
  const formsInsights = {
    categories: [
      { name: 'Embedded Forms', total: 45, converted: 38 },
      { name: 'Round Templates', total: 32, converted: 28 },
      { name: 'Permit Templates', total: 28, converted: 25 },
      { name: 'JHA Templates', total: 15, converted: 12 },
      { name: 'Inspection', total: 40, converted: 35 },
      { name: 'Generic Forms', total: 20, converted: 15 }
    ],
    totalResponses: 425000,
    convertedResponses: 320000,
    newForms: [
      { name: 'Equipment Inspection Round', category: 'Round Templates' },
      { name: 'Hot Work Permit', category: 'Permit Templates' },
      { name: 'Safety Observation', category: 'Generic Forms' }
    ]
  };

  // Platform conversion data and other existing mock data...
  const platformProgress = [
    { name: 'SAP ERP', converted: 85, total: 100, records: 15000, errors: 2 },
    { name: 'Maximo', converted: 45, total: 50, records: 8000, errors: 0 },
    { name: 'Oracle', converted: 30, total: 40, records: 5000, errors: 1 },
    { name: 'AVEVA PI', converted: 20, total: 30, records: 3000, errors: 0 }
  ];

  // Rest of your existing mock data...

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button 
            className="btn btn-secondary flex items-center"
            onClick={() => {/* Handle graph preview */}}
            disabled={summary.convertedToKG === 0}
          >
            <Eye size={16} className="mr-1.5" />
            Preview Knowledge Graph
          </button>
          <Link to="/integration" className="btn btn-primary flex items-center">
            <Plus size={16} className="mr-1.5" />
            Add Integrations
          </Link>
        </div>
      </div>

      {/* Forms Conversion Banner */}
      {showFormsConversionBanner && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start animate-slide-down">
          <ClipboardList size={20} className="text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              New forms detected: {formsInsights.newForms.length} forms need to be converted
            </p>
            <div className="mt-1 text-xs text-amber-700 space-y-1">
              {formsInsights.newForms.map((form, index) => (
                <p key={index}>• {form.name} ({form.category})</p>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Link 
              to="/forms"
              className="btn btn-primary btn-sm"
            >
              Convert Forms
            </Link>
            <button 
              className="text-sm text-amber-600 hover:text-amber-800"
              onClick={() => setShowFormsConversionBanner(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Integration Banner */}
      {showIntegrationBanner && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start animate-slide-down">
          <AlertCircle size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              New platforms integrated:  Factry Historian, Oracle Fusion Cloud ERP, and SAP HANA ERP
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Would you like to convert their tables to the Knowledge Graph?
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowOnboarding(true)}
            >
              Convert
            </button>
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowIntegrationBanner(false)}
            >
              Do it Later
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Connected Platforms</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1">{summary.platforms}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <ArrowDownUp size={14} className="mr-1" />
              +2 new
            </span>
            <span className="text-slate-500 ml-2">this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Collections</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1">{summary.collections}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Layers className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <BarChart3 size={14} className="mr-1" />
              {summary.conversionRate}% converted
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ontology Coverage</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1">{summary.ontologyCoverage}</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <ArrowDownUp size={14} className="mr-1" />
              +5% improvement
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Error Rate</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1">{summary.errorRate}</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <ArrowDownUp size={14} className="mr-1" />
              -0.2% from last week
            </span>
          </div>
        </div>
      </div>

      {/* Forms Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Categories Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-slate-900">Form Categories</h2>
            <Link to="/forms" className="text-sm text-primary hover:text-primary-dark font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {formsInsights.categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{category.name}</span>
                  <span className="text-slate-600">
                    {category.converted} of {category.total} forms converted to KG
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(category.converted / category.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Responses Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-slate-900">Form Responses</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Last 30 days</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-600">Total Responses</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-semibold text-slate-900">
                    {formsInsights.totalResponses.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600 mb-1">+12%</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-600">Converted to KG</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-semibold text-slate-900">
                    {formsInsights.convertedResponses.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600 mb-1">
                    {Math.round((formsInsights.convertedResponses / formsInsights.totalResponses) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Conversion Progress</h3>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(formsInsights.convertedResponses / formsInsights.totalResponses) * 100}%` 
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {formsInsights.convertedResponses.toLocaleString()} of {formsInsights.totalResponses.toLocaleString()} responses converted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Progress */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-slate-900">Conversion Progress</h2>
            <div className="flex items-center gap-2">
              <button className="text-sm text-slate-600 hover:text-slate-900">Last 7 days</button>
              <button className="text-sm font-medium text-primary">Last 30 days</button>
              <button className="text-sm text-slate-600 hover:text-slate-900">Last 90 days</button>
            </div>
          </div>

          <div className="space-y-6">
            {platformProgress.map((platform) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{platform.name}</span>
                    {platform.errors > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        {platform.errors} errors
                      </span>
                    )}
                  </div>
                  <span className="text-slate-600">
                    {platform.converted} of {platform.total} tables
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(platform.converted / platform.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{platform.records.toLocaleString()} records processed</span>
                  <span>{((platform.converted / platform.total) * 100).toFixed(1)}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Convert Tables</h3>
            </div>
            <p className="text-sm text-slate-600">
              Convert your data tables to knowledge graph format
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Manage Mappings</h3>
            </div>
            <p className="text-sm text-slate-600">
              Update field mappings and relationships
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">View Graph</h3>
            </div>
            <p className="text-sm text-slate-600">
              Explore your knowledge graph visualization
            </p>
          </div>
        </div>
      </div>

      {/* Existing modals */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <Onboarding onClose={() => setShowOnboarding(false)} />
          </div>
        </div>
      )}

      <TableMetadataEditor
        isOpen={showTableMetadataEditor}
        onClose={() => {
          setShowTableMetadataEditor(false);
          setSelectedTableForEdit(null);
        }}
        table={selectedTableForEdit}
        mode={selectedTableForEdit ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Dashboard;
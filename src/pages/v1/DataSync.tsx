import React, { useState } from 'react';
import { 
  Plus, Play, Pause, RefreshCw, Clock, CheckCircle, XCircle, 
  Settings, ChevronDown, Search, Filter, Calendar, AlertCircle,
  ChevronRight, X, Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, Button, Badge } from "../../components/ui";
import { cn } from "../../utils/cn";

type JobType = 'manual' | 'scheduled' | 'cdc';
type JobStatus = 'running' | 'success' | 'failed' | 'pending';

interface SyncJob {
  id: string;
  name: string;
  type: JobType;
  tables: string[];
  filters: string[];
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: JobStatus;
  logs: string[];
}

const DataSync: React.FC = () => {
  const [activeTab, setActiveTab] = useState<JobType>('manual');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<SyncJob | null>(null);

  // Mock data
  const mockJobs: SyncJob[] = [
    {
      id: '1',
      name: 'Asset Master Full Sync',
      type: 'scheduled',
      tables: ['ASSET_MASTER', 'LOCATIONS'],
      filters: ['status = Active'],
      schedule: '0 0 * * *',
      lastRun: '2025-02-15T10:00:00Z',
      nextRun: '2025-02-16T10:00:00Z',
      status: 'success',
      logs: [
        '[2025-02-15 10:00:00] Starting sync job',
        '[2025-02-15 10:01:23] Processing ASSET_MASTER table',
        '[2025-02-15 10:05:45] Processing LOCATIONS table',
        '[2025-02-15 10:08:12] Sync completed successfully'
      ]
    },
    {
      id: '2',
      name: 'Equipment Delta Sync',
      type: 'cdc',
      tables: ['EQUIPMENT'],
      filters: [],
      schedule: 'CDC',
      lastRun: '2025-02-15T09:45:00Z',
      nextRun: 'Real-time',
      status: 'running',
      logs: [
        '[2025-02-15 09:45:00] Starting CDC sync',
        '[2025-02-15 09:45:12] Watching for changes...'
      ]
    },
    {
      id: '3',
      name: 'Work Orders Manual Sync',
      type: 'manual',
      tables: ['WORK_ORDERS'],
      filters: ['created_date > 2025-01-01'],
      schedule: 'On-demand',
      lastRun: '2025-02-15T08:30:00Z',
      nextRun: 'N/A',
      status: 'failed',
      logs: [
        '[2025-02-15 08:30:00] Starting manual sync',
        '[2025-02-15 08:31:15] Error: Connection timeout',
        '[2025-02-15 08:31:15] Sync failed'
      ]
    }
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === job.type;
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'running':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      default:
        return <Clock size={16} className="text-slate-500" />;
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'running':
        return <Badge variant="warning">Running</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  const handleRunJob = (jobId: string) => {
    console.log('Running job:', jobId);
  };

  const handleStopJob = (jobId: string) => {
    console.log('Stopping job:', jobId);
  };

  const handleEditJob = (job: SyncJob) => {
    setSelectedJob(job);
    setShowNewJobModal(true);
  };

  const handleViewLogs = (jobId: string) => {
    setShowLogsModal(jobId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Data Synchronization</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and monitor data synchronization jobs
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowNewJobModal(true)}
        >
          <Plus size={16} className="mr-1.5" />
          New Sync Job
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'manual', label: 'Manual' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'cdc', label: 'Event-Based' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={cn(
                'border-b-2 py-4 px-1 text-sm font-medium',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              onClick={() => setActiveTab(tab.id as JobType)}
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
            placeholder="Search jobs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Job Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tables
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Filters
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{job.name}</div>
                    <div className="text-xs text-slate-500">{job.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {job.tables.map((table, index) => (
                        <Badge key={index} variant="default">{table}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {job.filters.length > 0 ? (
                        job.filters.map((filter, index) => (
                          <Badge key={index} variant="default">{filter}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No filters</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {job.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {format(new Date(job.lastRun), 'MMM d, yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {job.nextRun === 'N/A' || job.nextRun === 'Real-time' 
                      ? job.nextRun 
                      : format(new Date(job.nextRun), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      {getStatusBadge(job.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {job.status === 'running' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStopJob(job.id)}
                          title="Stop Job"
                        >
                          <Pause size={16} />
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRunJob(job.id)}
                          title="Run Job"
                        >
                          <Play size={16} />
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewLogs(job.id)}
                        title="View Logs"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditJob(job)}
                        title="Edit Job"
                      >
                        <Settings size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New/Edit Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedJob ? 'Edit Sync Job' : 'New Sync Job'}
              </h2>
              <button
                onClick={() => {
                  setShowNewJobModal(false);
                  setSelectedJob(null);
                }}
                className="text-slate-400 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Enter job name..."
                  defaultValue={selectedJob?.name}
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Type
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <option value="manual">Manual</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="cdc">Event-Based (CDC)</option>
                </select>
              </div>

              {/* Tables */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tables
                </label>
                <select multiple className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary h-32">
                  <option value="ASSET_MASTER">ASSET_MASTER</option>
                  <option value="EQUIPMENT">EQUIPMENT</option>
                  <option value="WORK_ORDERS">WORK_ORDERS</option>
                  <option value="LOCATIONS">LOCATIONS</option>
                </select>
              </div>

              {/* Schedule (for scheduled jobs) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Schedule (CRON)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="text"
                    placeholder="Minute"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Hour"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Day"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Month"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Week"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Example: "0 0 * * *" (daily at midnight)
                </p>
              </div>

              {/* Filters */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Filters
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                      <option value="">Select field...</option>
                      <option value="status">Status</option>
                      <option value="created_at">Created At</option>
                      <option value="updated_at">Updated At</option>
                    </select>
                    <select className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                      <option value="=">=</option>
                      <option value="!=">!=</option>
                      <option value=">">{">"}</option>
                      <option value="<">{"<"}</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    <Plus size={16} className="mr-1.5" />
                    Add Filter
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowNewJobModal(false);
                  setSelectedJob(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary">
                {selectedJob ? 'Save Changes' : 'Create Job'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Job Logs</h2>
              <button
                onClick={() => setShowLogsModal(null)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 h-96 overflow-y-auto">
                {mockJobs.find(job => job.id === showLogsModal)?.logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <Button variant="primary" onClick={() => setShowLogsModal(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSync;
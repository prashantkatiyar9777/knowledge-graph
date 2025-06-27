import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SyncJobEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncJobEditor: React.FC<SyncJobEditorProps> = ({ isOpen, onClose }) => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [syncMode, setSyncMode] = useState<'full' | 'incremental' | 'cdc'>('full');
  const [schedule, setSchedule] = useState<'once' | 'daily' | 'weekly'>('once');
  const [scheduleTime, setScheduleTime] = useState('00:00');
  const [scheduleDay, setScheduleDay] = useState('1');

  const handleSave = async () => {
    try {
      const payload = {
        tables: selectedTables,
        mode: syncMode,
        schedule: {
          type: schedule,
          time: scheduleTime,
          day: schedule === 'weekly' ? scheduleDay : undefined,
        },
      };

      // TODO: Call API endpoint
      console.log('Creating sync job:', payload);

      onClose();
    } catch (error) {
      console.error('Error creating sync job:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Create Sync Job</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Tables
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
              {['ASSET_MASTER', 'EQUIPMENT', 'WORK_ORDERS'].map((table) => (
                <label key={table} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTables.includes(table)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTables([...selectedTables, table]);
                      } else {
                        setSelectedTables(selectedTables.filter(t => t !== table));
                      }
                    }}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-900">{table}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sync Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="full"
                  checked={syncMode === 'full'}
                  onChange={(e) => setSyncMode(e.target.value as 'full')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-900">Full Load</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="incremental"
                  checked={syncMode === 'incremental'}
                  onChange={(e) => setSyncMode(e.target.value as 'incremental')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-900">Incremental</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="cdc"
                  checked={syncMode === 'cdc'}
                  onChange={(e) => setSyncMode(e.target.value as 'cdc')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-900">Change Data Capture (CDC)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Schedule
            </label>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="once"
                    checked={schedule === 'once'}
                    onChange={(e) => setSchedule(e.target.value as 'once')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-900">One-time</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="daily"
                    checked={schedule === 'daily'}
                    onChange={(e) => setSchedule(e.target.value as 'daily')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-900">Daily</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="weekly"
                    checked={schedule === 'weekly'}
                    onChange={(e) => setSchedule(e.target.value as 'weekly')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-900">Weekly</span>
                </label>
              </div>

              {schedule !== 'once' && (
                <div className="pl-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="input"
                  />
                </div>
              )}

              {schedule === 'weekly' && (
                <div className="pl-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={scheduleDay}
                    onChange={(e) => setScheduleDay(e.target.value)}
                    className="select"
                  >
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="7">Sunday</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={selectedTables.length === 0}
          >
            Create Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncJobEditor;
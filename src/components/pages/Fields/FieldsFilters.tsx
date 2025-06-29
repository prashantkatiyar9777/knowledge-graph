import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/Input.js';
import { Select } from '../../ui/Select.js';
import { Table } from '../../types/index.js';

interface TableOption {
  id: string;
  name: string;
}

interface FieldsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTable: string;
  onTableChange: (value: string) => void;
  tables: TableOption[];
}

const FieldsFilters: React.FC<FieldsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTable,
  onTableChange,
  tables,
}) => {
  const selectOptions = [
    { value: '', label: 'All Tables' },
    ...tables.map(table => ({
      value: table.id,
      label: table.name
    }))
  ];

  return (
    <div className="flex items-center gap-4 mt-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search fields..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select
        value={selectedTable}
        onChange={(e) => onTableChange(e.target.value)}
        className="w-48"
        options={selectOptions}
      />
    </div>
  );
};

export default FieldsFilters; 
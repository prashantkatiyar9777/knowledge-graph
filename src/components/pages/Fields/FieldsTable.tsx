import React from 'react';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';
import type { Field } from '../../../types';

interface FieldsTableProps {
  fields: Field[];
  onFieldClick: (field: Field) => void;
}

const FieldsTable: React.FC<FieldsTableProps> = ({ fields, onFieldClick }) => {
  return (
    <Card className="mt-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Field Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                KG Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {fields.map((field) => (
              <tr
                key={field._id}
                onClick={() => onFieldClick(field)}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {field.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {field.table}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {field.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={field.kgStatus === 'Added to KG' ? 'success' : 'warning'}
                  >
                    {field.kgStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default FieldsTable; 
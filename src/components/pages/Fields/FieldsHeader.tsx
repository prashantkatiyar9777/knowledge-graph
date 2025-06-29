import React from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Field } from '@/types';

interface FieldsHeaderProps {
  fields: Field[];
}

const FieldsHeader: React.FC<FieldsHeaderProps> = ({ fields }) => {
  const fieldsInKG = fields.filter(f => f.kgStatus === 'Added to KG').length;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Fields</h1>
        <p className="mt-1 text-sm text-slate-600">
          {fieldsInKG} of {fields.length} fields added to knowledge graph
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="secondary" 
          className="gap-2"
          disabled={fieldsInKG === 0}
        >
          <Eye size={16} />
          Preview Graph
        </Button>
        <Button 
          variant="primary" 
          className="gap-2"
          disabled={fieldsInKG === 0}
        >
          <RefreshCw size={16} />
          Update Knowledge Graph
        </Button>
      </div>
    </div>
  );
};

export default FieldsHeader; 
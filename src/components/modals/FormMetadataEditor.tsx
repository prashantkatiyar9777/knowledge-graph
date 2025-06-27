import React, { useState } from 'react';
import { Modal, Button, Input, Badge } from '../ui';
import { X, Plus, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FormField {
  id: string;
  name: string;
  type: string;
  description?: string;
  ontologyMapping?: string;
  validationRules?: string[];
  examples?: string[];
}

interface FormMetadataEditorProps {
  isOpen: boolean;
  onClose: () => void;
  form: {
    id: string;
    name: string;
    type: string;
    description: string;
    questions: FormField[];
  } | null;
  onSave: (updates: any) => void;
}

const FormMetadataEditor: React.FC<FormMetadataEditorProps> = ({
  isOpen,
  onClose,
  form,
  onSave
}) => {
  const [description, setDescription] = useState(form?.description || '');
  const [questions, setQuestions] = useState<FormField[]>(form?.questions || []);

  const formCategories = [
    'Embedded Forms',
    'Round Templates',
    'Permit Templates',
    'JHA Templates',
    'Inspection',
    'Generic Forms'
  ];

  // Example questions for demonstration
  const exampleQuestions = [
    { id: 'q1', name: 'Equipment ID', type: 'reference', description: 'Unique identifier for the equipment being inspected' },
    { id: 'q2', name: 'Inspection Date', type: 'date', description: 'Date when the inspection was performed' },
    { id: 'q3', name: 'Inspector Name', type: 'text', description: 'Name of the person performing the inspection' },
    { id: 'q4', name: 'Equipment Status', type: 'select', description: 'Current operational status of the equipment' },
    { id: 'q5', name: 'Inspection Findings', type: 'textarea', description: 'Detailed findings from the inspection' }
  ];

  const handleSave = () => {
    if (!form) return;
    
    onSave({
      ...form,
      description,
      questions
    });
  };

  const handleQuestionUpdate = (index: number, updates: Partial<FormField>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    setQuestions(updatedQuestions);
  };

  if (!form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{form.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="default">{formCategories.find(cat => cat.toLowerCase().includes(form.type)) || form.type}</Badge>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-6">
        {/* Form Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Form Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            placeholder="Describe this form's purpose and usage..."
          />
        </div>

        {/* Questions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Questions
          </label>
          <div className="space-y-4">
            {exampleQuestions.map((question, index) => (
              <div key={question.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-900">{question.name}</h4>
                  <Badge variant="default">{question.type}</Badge>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    value={question.description}
                    onChange={(e) => handleQuestionUpdate(index, { description: e.target.value })}
                    rows={3}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    placeholder="Add any additional details about this question that would help in creating a more comprehensive knowledge graph..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Update Knowledge Graph
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FormMetadataEditor;
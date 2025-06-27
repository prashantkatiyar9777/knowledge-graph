// import React from 'react';

// const AccessControl: React.FC = () => {
//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-slate-900">Access Control</h1>
//       {/* Add access control content */}
//     </div>
//   );
// };

// export default AccessControl;



import React, { useState, useEffect } from 'react';
import { mockRelationships, mockInverseRelationships, mockIndirectRelationships, mockSelfRelationships } from '../../utils/mockData';
import { 
  Plus, Edit2, Search, RefreshCw, ChevronRight, 
  Database, Clock, CheckCircle, X 
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';
import { cn } from '../../utils/cn';
import { useDataStore } from '../../stores/dataStore';
import RelationshipMetadataEditor from '../../components/modals/RelationshipMetadataEditor';
import InverseRelationshipEditor from '../../components/modals/InverseRelationshipEditor';
import IndirectRelationshipEditor from '../../components/modals/IndirectRelationshipEditor';
import SelfRelationshipEditor from '../../components/modals/SelfRelationshipEditor';
import BulkSelfRelationshipEditor from '../../components/modals/BulkSelfRelationshipEditor';

const Relationships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'existing' | 'inverse' | 'indirect' | 'self'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null);
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [selectedInverseRelationships, setSelectedInverseRelationships] = useState<string[]>([]);
  const [selectedIndirectRelationships, setSelectedIndirectRelationships] = useState<string[]>([]);
  const [selectedSelfRelationships, setSelectedSelfRelationships] = useState<string[]>([]);
  const [showInverseEditor, setShowInverseEditor] = useState(false);
  const [showIndirectEditor, setShowIndirectEditor] = useState(false);
  const [showSelfRelationshipEditor, setShowSelfRelationshipEditor] = useState(false);
  const [showBulkSelfRelationshipEditor, setShowBulkSelfRelationshipEditor] = useState(false);
  const { selfRelationships, fetchSelfRelationships, createSelfRelationship, createBulkSelfRelationships } = useDataStore();

  useEffect(() => {
    if (activeTab === 'self') {
      fetchSelfRelationships();
    }
  }, [activeTab, fetchSelfRelationships]);
  
  const tabs = [
    { id: 'existing', label: 'Existing Relationships' },
    { id: 'inverse', label: 'Inverse Relationships' },
    { id: 'indirect', label: 'Indirect Relationships' },
    { id: 'self', label: 'Self Relationships' }
  ];

  const handleUpdateKnowledgeGraph = () => {
    if (activeTab === 'existing') {
      console.log('Updating knowledge graph with selected relationships:', selectedRelationships);
    } else if (activeTab === 'inverse') {
      console.log('Updating knowledge graph with selected inverse relationships:', selectedInverseRelationships);
    } else if (activeTab === 'indirect') {
      console.log('Updating knowledge graph with selected indirect relationships:', selectedIndirectRelationships);
    } else if (activeTab === 'self') {
      console.log('Updating knowledge graph with selected self relationships:', selectedSelfRelationships);
    }
  };

  const toggleRelationshipSelection = (id: string) => {
    setSelectedRelationships(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleInverseRelationshipSelection = (id: string) => {
    setSelectedInverseRelationships(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleIndirectRelationshipSelection = (id: string) => {
    setSelectedIndirectRelationships(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleSelfRelationshipSelection = (id: string) => {
    setSelectedSelfRelationships(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const handleSelectAllInverse = (checked: boolean) => {
    setSelectedInverseRelationships(checked ? mockInverseRelationships.map(r => r.id) : []);
  };

  const handleSelectAllIndirect = (checked: boolean) => {
    setSelectedIndirectRelationships(checked ? mockIndirectRelationships.map(r => r.id) : []);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRelationships(checked ? mockRelationships.map(r => r.id) : []);
  };

  const handleSelectAllSelf = (checked: boolean) => {
    setSelectedSelfRelationships(checked ? mockSelfRelationships.map(r => r.id) : []);
  };

  const renderExistingRelationships = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Existing Relationships</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage metadata for existing relationships
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<RefreshCw size={16} />}
          onClick={handleUpdateKnowledgeGraph}
          disabled={selectedRelationships.length === 0}
        >
          Update Knowledge Graph ({selectedRelationships.length})
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                  checked={selectedRelationships.length === mockRelationships.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Field Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Table Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Mapped To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Alternative Names
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
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
            {mockRelationships.map((rel) => (
              <tr key={rel.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedRelationships.includes(rel.id)}
                    onChange={() => toggleRelationshipSelection(rel.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {rel.fromField}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {rel.fromTable}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {rel.toTable}.{rel.toField}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="default">{rel.name}</Badge>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                  {rel.description}
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success">In Knowledge Graph</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 size={16} />}
                    onClick={() => setSelectedRelationship(rel)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInverseRelationships = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Inverse Relationships</h2>
          <p className="text-sm text-slate-600 mt-1">
            Define inverse relationships for existing Object ID based connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            icon={<RefreshCw size={16} />}
            onClick={handleUpdateKnowledgeGraph}
            disabled={selectedInverseRelationships.length === 0}
          >
            Update Knowledge Graph ({selectedInverseRelationships.length})
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setShowInverseEditor(true)}
          >
            Add Inverse Relationship
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                  checked={selectedInverseRelationships.length === mockInverseRelationships.length}
                  onChange={(e) => handleSelectAllInverse(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Field Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Table Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Mapped To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Inverse Relationship Names
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
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
            {mockInverseRelationships.map((rel) => (
              <tr key={rel.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedInverseRelationships.includes(rel.id)}
                    onChange={() => toggleInverseRelationshipSelection(rel.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {rel.fieldName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {rel.tableName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {rel.mappedTo}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {rel.inverseName.map((name: string, index: number) => (
                      <Badge key={index} variant="default">{name}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                  {rel.description}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={rel.kgStatus === 'Added to KG' ? 'success' : 'default'}>
                    {rel.kgStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 size={16} />}
                    onClick={() => {
                      // Handle edit
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIndirectRelationships = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Indirect Relationships</h2>
          <p className="text-sm text-slate-600 mt-1">
            Discover and define relationships between indirectly connected tables
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            icon={<RefreshCw size={16} />}
            onClick={handleUpdateKnowledgeGraph}
            disabled={selectedIndirectRelationships.length === 0}
          >
            Update Knowledge Graph ({selectedIndirectRelationships.length})
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setShowIndirectEditor(true)}
          >
            Add Indirect Relationship
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                  checked={selectedIndirectRelationships.length === mockIndirectRelationships.length}
                  onChange={(e) => handleSelectAllIndirect(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Table Path
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Alternative Names
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
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
            {mockIndirectRelationships.map((rel) => (
              <tr key={rel.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedIndirectRelationships.includes(rel.id)}
                    onChange={() => toggleIndirectRelationshipSelection(rel.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {rel.path.map((table: string, i: number) => (
                      <React.Fragment key={i}>
                        <span className="text-sm font-medium text-slate-900">
                          {table}
                        </span>
                        {i < rel.path.length - 1 && (
                          <ChevronRight size={16} className="text-slate-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {rel.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {rel.alternateNames.map((name: string, i: number) => (
                      <Badge key={i} variant="default">{name}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                  {rel.description}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={rel.kgStatus === 'Added to KG' ? 'success' : rel.kgStatus === 'Partially Added' ? 'warning' : 'default'}>
                    {rel.kgStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 size={16} />}
                    onClick={() => {
                      // Handle edit
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSelfRelationships = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Self Relationships</h2>
          <p className="text-sm text-slate-600 mt-1">
            Define relationships between records within the same table based on shared references
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={<Plus size={16} />}
            onClick={() => setShowBulkSelfRelationshipEditor(true)}
          >
            Bulk Create
          </Button>
          <Button
            variant="primary"
            icon={<RefreshCw size={16} />}
            onClick={handleUpdateKnowledgeGraph}
            disabled={selectedSelfRelationships.length === 0}
          >
            Update Knowledge Graph ({selectedSelfRelationships.length})
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowSelfRelationshipEditor(true)}
          >
            Add Self Relationship
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                  checked={selectedSelfRelationships.length === mockSelfRelationships.length}
                  onChange={(e) => handleSelectAllSelf(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Primary Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Reference Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Relationship Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Alternative Names
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Created
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
            {mockSelfRelationships.map((relationship) => (
              <tr key={relationship.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedSelfRelationships.includes(relationship.id)}
                    onChange={() => toggleSelfRelationshipSelection(relationship.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Database size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {relationship.table.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Database size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-900">
                      {relationship.reference_table.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {relationship.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {relationship.alternative_names.map((name, index) => (
                      <Badge key={index} variant="default">{name}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                  {relationship.description}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(relationship.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={
                      relationship.kg_status === 'Added to KG' ? 'success' :
                      relationship.kg_status === 'Partially Added' ? 'warning' :
                      relationship.kg_status === 'Not Added' ? 'default' : 'error'
                    }
                    icon={
                      relationship.kg_status === 'Added to KG' ? <CheckCircle size={12} /> :
                      relationship.kg_status === 'Partially Added' ? <Clock size={12} /> :
                      <Clock size={12} />
                    }
                  >
                    {relationship.kg_status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 size={16} />}
                    onClick={() => {
                      // Handle edit
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Relationships</h1>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                'border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search relationships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {activeTab === 'existing' && renderExistingRelationships()}
      {activeTab === 'inverse' && renderInverseRelationships()}
      {activeTab === 'indirect' && renderIndirectRelationships()}
      {activeTab === 'self' && renderSelfRelationships()}

      <RelationshipMetadataEditor
        isOpen={!!selectedRelationship}
        onClose={() => setSelectedRelationship(null)}
        relationship={selectedRelationship}
        onSave={(updates) => {
          console.log('Saving relationship updates:', updates);
          setSelectedRelationship(null);
        }}
      />

      <InverseRelationshipEditor
        isOpen={showInverseEditor}
        onClose={() => setShowInverseEditor(false)}
        onSave={(relationship) => {
          console.log('Creating inverse relationship:', relationship);
          setShowInverseEditor(false);
        }}
      />

      <IndirectRelationshipEditor
        isOpen={showIndirectEditor}
        onClose={() => setShowIndirectEditor(false)}
        onSave={(relationship) => {
          console.log('Creating indirect relationship:', relationship);
          setShowIndirectEditor(false);
        }}
      />

      <SelfRelationshipEditor
        isOpen={showSelfRelationshipEditor}
        onClose={() => setShowSelfRelationshipEditor(false)}
        onSave={(relationship) => {
          createSelfRelationship(relationship);
          setShowSelfRelationshipEditor(false);
        }}
      />

      <BulkSelfRelationshipEditor
        isOpen={showBulkSelfRelationshipEditor}
        onClose={() => setShowBulkSelfRelationshipEditor(false)}
        onSave={(relationships) => {
          createBulkSelfRelationships(relationships);
          setShowBulkSelfRelationshipEditor(false);
        }}
      />
    </div>
  );
};

export default Relationships;
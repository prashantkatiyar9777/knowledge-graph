import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Search, RefreshCw, ChevronRight, Database, Clock, CheckCircle, X } from 'lucide-react';
import { Button, Badge } from "../../components/ui";
import { Input } from '../../components/ui';
import { cn } from "../../utils/cn";
import useDataStore from "../../stores/dataStore";
import RelationshipMetadataEditor from "../../components/modals/RelationshipMetadataEditor";
import InverseRelationshipEditor from "../../components/modals/InverseRelationshipEditor";
import SelfRelationshipEditor from "../../components/modals/SelfRelationshipEditor";
import BulkSelfRelationshipEditor from "../../components/modals/BulkSelfRelationshipEditor";
import IndirectRelationshipEditor from "../../components/modals/IndirectRelationshipEditor";
import { Relationship } from '../../types';
import Loading from "../../components/ui/Loading";
import ErrorBoundary from "../../components/ui/ErrorBoundary";

const Relationships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'existing' | 'inverse' | 'indirect' | 'self'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [selectedInverseRelationships, setSelectedInverseRelationships] = useState<string[]>([]);
  const [selectedIndirectRelationships, setSelectedIndirectRelationships] = useState<string[]>([]);
  const [selectedSelfRelationships, setSelectedSelfRelationships] = useState<string[]>([]);
  const [showInverseEditor, setShowInverseEditor] = useState(false);
  const [showIndirectEditor, setShowIndirectEditor] = useState(false);
  const [showSelfRelationshipEditor, setShowSelfRelationshipEditor] = useState(false);
  const [showBulkSelfRelationshipEditor, setShowBulkSelfRelationshipEditor] = useState(false);
  
  const { 
    relationships,
    inverseRelationships,
    indirectRelationships,
    selfRelationships,
    fetchRelationships,
    fetchInverseRelationships,
    fetchIndirectRelationships,
    fetchSelfRelationships,
    createSelfRelationship,
    createBulkSelfRelationships,
    isLoading,
    error
  } = useDataStore();

  useEffect(() => {
    // Fetch data based on active tab
    switch (activeTab) {
      case 'existing':
        fetchRelationships();
        break;
      case 'inverse':
        fetchInverseRelationships();
        break;
      case 'indirect':
        fetchIndirectRelationships();
        break;
      case 'self':
        fetchSelfRelationships();
        break;
    }
  }, [activeTab, fetchRelationships, fetchInverseRelationships, fetchIndirectRelationships, fetchSelfRelationships]);
  
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

  const handleSaveRelationship = (updates: Partial<Relationship>) => {
    console.log('Saving relationship updates:', updates);
    setSelectedRelationship(null);
  };

  const handleSaveInverseRelationship = (relationship: Partial<Relationship>) => {
    console.log('Creating inverse relationship:', relationship);
    setShowInverseEditor(false);
  };

  const handleSaveIndirectRelationship = (relationship: Partial<Relationship>) => {
    console.log('Creating indirect relationship:', relationship);
    setShowIndirectEditor(false);
  };

  const handleSaveSelfRelationship = (relationship: Partial<Relationship>) => {
    createSelfRelationship(relationship);
    setShowSelfRelationshipEditor(false);
  };

  const handleSaveBulkSelfRelationships = (relationships: Partial<Relationship>[]) => {
    createBulkSelfRelationships(relationships);
    setShowBulkSelfRelationshipEditor(false);
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
    setSelectedInverseRelationships(checked ? inverseRelationships.map(r => r._id.toString()) : []);
  };

  const handleSelectAllIndirect = (checked: boolean) => {
    setSelectedIndirectRelationships(checked ? indirectRelationships.map(r => r._id.toString()) : []);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRelationships(checked ? relationships.map(r => r._id.toString()) : []);
  };

  const handleSelectAllSelf = (checked: boolean) => {
    setSelectedSelfRelationships(checked ? selfRelationships.map(r => r._id.toString()) : []);
  };

  const renderExistingRelationships = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      );
    }

    return (
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
                    checked={selectedRelationships.length === relationships.length}
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
              {relationships.map((rel) => (
                <tr key={rel._id.toString()} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedRelationships.includes(rel._id.toString())}
                      onChange={() => toggleRelationshipSelection(rel._id.toString())}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.sourceField?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.sourceTable?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.targetTable?.name && rel.targetField?.name ? 
                      `${rel.targetTable.name}.${rel.targetField.name}` : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {rel.alternativeNames?.map((name, i) => (
                        <Badge key={i} variant="default">{name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {rel.description || 'No description'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={rel.kgStatus === 'Added to KG' ? "success" : "default"}>
                      {rel.kgStatus || 'Not Added'}
                    </Badge>
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
  };

  const renderInverseRelationships = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      );
    }

    return (
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
                    checked={selectedInverseRelationships.length === inverseRelationships.length}
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
              {inverseRelationships.map((rel) => (
                <tr key={rel._id.toString()} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedInverseRelationships.includes(rel._id.toString())}
                      onChange={() => toggleInverseRelationshipSelection(rel._id.toString())}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.sourceField?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.sourceTable?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.targetTable?.name && rel.targetField?.name ? 
                      `${rel.targetTable.name}.${rel.targetField.name}` : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {rel.alternativeNames?.map((name, i) => (
                        <Badge key={i} variant="default">{name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {rel.description || 'No description'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={rel.kgStatus === 'Added to KG' ? "success" : "default"}>
                      {rel.kgStatus || 'Not Added'}
                    </Badge>
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
  };

  const renderIndirectRelationships = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      );
    }

    return (
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
                    checked={selectedIndirectRelationships.length === indirectRelationships.length}
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
              {indirectRelationships.map((rel) => (
                <tr key={rel._id.toString()} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedIndirectRelationships.includes(rel._id.toString())}
                      onChange={() => toggleIndirectRelationshipSelection(rel._id.toString())}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(rel.tablePath || []).map((table: string, i: number) => (
                        <React.Fragment key={i}>
                          <span className="text-sm font-medium text-slate-900">
                            {table}
                          </span>
                          {i < (rel.tablePath || []).length - 1 && (
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
                      {(rel.alternativeNames || []).map((name: string, i: number) => (
                        <Badge key={i} variant="default">{name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {rel.description}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={rel.inKnowledgeGraph ? "success" : "default"}>
                      {rel.inKnowledgeGraph ? "In Knowledge Graph" : "Not in KG"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
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
  };

  const renderSelfRelationships = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      );
    }

    return (
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
                    checked={selectedSelfRelationships.length === selfRelationships.length}
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
              {selfRelationships.map((rel) => (
                <tr key={rel._id.toString()} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedSelfRelationships.includes(rel._id.toString())}
                      onChange={() => toggleSelfRelationshipSelection(rel._id.toString())}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.primaryTable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.referenceTable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {rel.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {rel.alternativeNames?.map((name, i) => (
                        <Badge key={i} variant="default">{name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                    {rel.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(rel.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={rel.inKnowledgeGraph ? "success" : "default"}>
                      {rel.inKnowledgeGraph ? "In Knowledge Graph" : "Not in KG"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
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
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Relationships</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage relationships between tables and fields
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'px-6 py-3 text-sm font-medium whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'existing' && renderExistingRelationships()}
            {activeTab === 'inverse' && renderInverseRelationships()}
            {activeTab === 'indirect' && renderIndirectRelationships()}
            {activeTab === 'self' && renderSelfRelationships()}
          </div>
        </div>

        {selectedRelationship && (
          <RelationshipMetadataEditor
            isOpen={!!selectedRelationship}
            relationship={selectedRelationship}
            onClose={() => setSelectedRelationship(null)}
            onSave={handleSaveRelationship}
          />
        )}

        {showInverseEditor && (
          <InverseRelationshipEditor
            isOpen={showInverseEditor}
            onClose={() => setShowInverseEditor(false)}
            onSave={handleSaveInverseRelationship}
          />
        )}

        {showIndirectEditor && (
          <IndirectRelationshipEditor
            isOpen={showIndirectEditor}
            onClose={() => setShowIndirectEditor(false)}
            onSave={handleSaveIndirectRelationship}
          />
        )}

        {showSelfRelationshipEditor && (
          <SelfRelationshipEditor
            isOpen={showSelfRelationshipEditor}
            onClose={() => setShowSelfRelationshipEditor(false)}
            onSave={handleSaveSelfRelationship}
          />
        )}

        {showBulkSelfRelationshipEditor && (
          <BulkSelfRelationshipEditor
            isOpen={showBulkSelfRelationshipEditor}
            onClose={() => setShowBulkSelfRelationshipEditor(false)}
            onSave={handleSaveBulkSelfRelationships}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Relationships;
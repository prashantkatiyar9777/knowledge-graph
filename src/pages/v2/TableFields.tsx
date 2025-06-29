import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  RefreshCw,
  Database,
  Filter,
  ChevronDown,
  Eye,
  Trash2
} from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { cn } from "../../utils/cn";
import useDataStore from "../../stores/dataStore";
import FieldMetadataEditor from "../../components/modals/FieldMetadataEditor";
import { Field, Table } from "../../types";

const TableFields = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const { tables, fetchTables } = useDataStore();

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const table = tables.find(t => t._id.toString() === id) as Table | undefined;
  const fields = table?.fields || [];

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditField = (field: Field) => {
    setSelectedField(field);
    setShowFieldEditor(true);
  };

  if (!table) {
    return <div>Table not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{table.name} Fields</h1>
          <p className="text-sm text-gray-500">
            Manage fields and their metadata for {table.name}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search fields..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowFieldEditor(true)}>
            <Plus size={20} className="mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map((field) => (
          <Card key={field._id.toString()} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{field.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {field.description || "No description"}
                </p>
                <Badge variant={field.isRequired ? "success" : "warning"}>
                  {field.type}
                </Badge>
              </div>
              <Badge variant={field.kgStatus === "Added to KG" ? "success" : "warning"}>
                {field.kgStatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleEditField(field)}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Field
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database size={16} className="mr-2" />
                Map to Knowledge Graph
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Trash2 size={16} className="mr-2" />
                Delete Field
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showFieldEditor && (
        <FieldMetadataEditor
          isOpen={showFieldEditor}
          onClose={() => {
            setShowFieldEditor(false);
            setSelectedField(null);
          }}
          field={selectedField}
          tableId={table._id.toString()}
        />
      )}
    </div>
  );
};

export default TableFields;
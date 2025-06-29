import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button, Badge, Card } from "../../components/ui";
import { cn } from "../utils/cn";
import useDataStore from "../../stores/dataStore";
import TableMetadataEditor from "../../components/modals/TableMetadataEditor";

const PlatformTables = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const { tables, fetchTables } = useDataStore();

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTable = (table: any) => {
    setSelectedTable(table);
    setShowTableEditor(true);
  };

  const handleViewDetails = (tableId: string) => {
    navigate(`/tables/${tableId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Platform Tables</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tables..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowTableEditor(true)}>
            <Plus size={20} className="mr-2" />
            Add Table
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table) => (
          <Card key={table._id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{table.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {table.description || "No description"}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Database size={16} />
                  <span>{table.source}</span>
                </div>
              </div>
              <Badge variant={table.kgStatus === "Added to KG" ? "success" : "warning"}>
                {table.kgStatus || "Not Added"}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleEditTable(table)}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Table
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleViewDetails(table._id)}
              >
                <Eye size={16} className="mr-2" />
                View Details
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database size={16} className="mr-2" />
                Map to Knowledge Graph
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showTableEditor && (
        <TableMetadataEditor
          isOpen={showTableEditor}
          onClose={() => {
            setShowTableEditor(false);
            setSelectedTable(null);
          }}
          table={selectedTable}
        />
      )}
    </div>
  );
};

export default PlatformTables;
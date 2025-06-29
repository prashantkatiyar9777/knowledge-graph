import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Edit2, Save, X, Plus, Trash2, ArrowDownUp } from "lucide-react";
import useDataStore from "../../stores/dataStore";

const TableDetails = () => {
  const { id } = useParams();
  const { tables, fetchTables } = useDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const table = tables.find(t => t._id === id);

  if (!table) {
    return <div>Table not found</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...table });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
    setEditedData(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{table.name}</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                onClick={handleSave}
              >
                <Save size={16} className="inline-block mr-2" />
                Save
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={handleCancel}
              >
                <X size={16} className="inline-block mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={handleEdit}
            >
              <Edit2 size={16} className="inline-block mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Table Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{table.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{table.description || "No description"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{table.source}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fields Count</dt>
                  <dd className="mt-1 text-sm text-gray-900">{table.fieldsCount || 0}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Knowledge Graph Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{table.kgStatus || "Not Added"}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fields</h3>
              <div className="space-y-2">
                {table.fields?.map((field: any) => (
                  <div key={field._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{field.name}</p>
                      <p className="text-sm text-gray-500">{field.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Plus size={16} className="mr-2" />
                  Add Field
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDetails;
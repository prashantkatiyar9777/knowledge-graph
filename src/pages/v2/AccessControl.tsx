import { useState, useEffect } from "react";
import { Plus, Search, Edit2, RefreshCw, Database, Filter } from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { cn } from "../../utils/cn";
import useDataStore from "../../stores/dataStore";

const AccessControl = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, fetchUsers } = useDataStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Access Control</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
                  </div>
          <Button>
            <Plus size={20} className="mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user._id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                <Badge variant={user.status === "active" ? "success" : "warning"}>
                  {user.role}
                </Badge>
                  </div>
              <Badge variant={user.status === "active" ? "success" : "warning"}>
                {user.status}
                  </Badge>
      </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Edit2 size={16} className="mr-2" />
                Edit Permissions
          </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database size={16} className="mr-2" />
                View Activity
          </Button>
        </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccessControl;
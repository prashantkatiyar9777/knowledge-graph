import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Field, Table } from '../../../types/index.js';
import FieldsHeader from './FieldsHeader.js';
import FieldsFilters from './FieldsFilters.js';
import FieldsTable from './FieldsTable.js';
import Pagination from './Pagination.js';

const ITEMS_PER_PAGE = 10;

const Fields: React.FC = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldsResponse, tablesResponse] = await Promise.all([
          fetch('/api/fields'),
          fetch('/api/tables')
        ]);

        if (!fieldsResponse.ok || !tablesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [fieldsData, tablesData] = await Promise.all([
          fieldsResponse.json(),
          tablesResponse.json()
        ]);

        setFields(fieldsData);
        setTables(tablesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFields = fields.filter((field) => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTable = !selectedTable || field.tableId === selectedTable;
    return matchesSearch && matchesTable;
  });

  const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);
  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFieldClick = (field: Field) => {
    navigate(`/fields/${field._id}`);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const tableOptions = tables.map(table => ({
    id: table._id.toString(),
    name: table.name
  }));

  return (
    <div className="p-6">
      <FieldsHeader fields={fields} />
      <FieldsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTable={selectedTable}
        onTableChange={setSelectedTable}
        tables={tableOptions}
      />
      <FieldsTable
        fields={paginatedFields}
        tables={tables}
        onFieldClick={handleFieldClick}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Fields; 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import { Button, Table, Badge, Input, Select } from '../components/ui';
import { dummyEquipments, equipmentTypes, statusOptions } from '../data/dummyData';

const Equipments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  // Filter equipments based on search and filters
  const filteredEquipments = dummyEquipments.filter(equipment => {
    const matchesSearch = 
      equipment.Equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.SerialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.MakeModel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || equipment.EquipmentTypeName === filterType;
    const matchesStatus = !filterStatus || equipment.Status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Inactive': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    {
      header: 'S.No',
      accessor: 'SNO',
      width: '80px'
    },
    {
      header: 'Equipment',
      accessor: 'Equipment',
      width: '20%',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.Equipment}</p>
          <p className="text-xs text-gray-500">{row.SerialNo}</p>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'EquipmentTypeName',
      width: '140px',
      render: (row) => (
        <Badge variant="info">{row.EquipmentTypeName}</Badge>
      )
    },
    {
      header: 'Make/Model',
      accessor: 'MakeModel',
      width: '18%'
    },
    {
      header: 'Unit',
      accessor: 'Unit',
      width: '15%'
    },
    {
      header: 'Status',
      accessor: 'Status',
      width: '140px',
      render: (row) => (
        <Badge variant={getStatusVariant(row.Status)}>{row.Status}</Badge>
      )
    },
    {
      header: 'Cost',
      accessor: 'Cost',
      width: '120px',
      render: (row) => `$${row.Cost.toLocaleString()}`
    },
    {
      header: 'Actions',
      accessor: 'actions',
      width: '140px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/dashboard/equipments/${row.EquipmentID}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/dashboard/equipments/edit/${row.EquipmentID}`)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(row.EquipmentID)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      )
    }
  ];

  const handleDelete = (id) => {
    // In real app, this would call API
    alert(`Delete equipment with ID: ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all your equipment inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Download}
            onClick={() => alert('Export functionality')}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/dashboard/equipments/add')}
          >
            Add Equipment
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: dummyEquipments.length, color: 'blue' },
          { label: 'Active', value: dummyEquipments.filter(e => e.Status === 'Active').length, color: 'green' },
          { label: 'Under Repair', value: dummyEquipments.filter(e => e.Status === 'Under Maintenance').length, color: 'yellow' },
          // { label: 'Total Value', value: `$${dummyEquipments.reduce((sum, e) => sum + e.Cost, 0).toLocaleString()}`, color: 'purple' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-4 border-l-4"
            style={{ borderColor: `var(--${stat.color}-500)` }}
          >
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name, serial, or model..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by type"
            options={equipmentTypes}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>

        {(searchTerm || filterType || filterStatus) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredEquipments.length} of {dummyEquipments.length} equipments
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
                setFilterStatus('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Equipment Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow"
      >
        <Table 
          columns={columns} 
          data={filteredEquipments}
        />
      </motion.div>
    </div>
  );
};

export default Equipments;


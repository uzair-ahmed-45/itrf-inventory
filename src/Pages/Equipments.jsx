import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
import { equipmentService, setupService, unitService } from '../services';

const Equipments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCommand, setFilterCommand] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [commands, setCommands] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Status options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'OPS', label: 'OPS' },
    { value: 'NON-OPS', label: 'NON-OPS' },
    { value: 'UNDER-REPAIR', label: 'UNDER-REPAIR' },
    { value: 'BER', label: 'BER' }
  ];

  // Fetch equipments, equipment types, and units
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch equipments
        const equipmentsResponse = await equipmentService.getAllEquipments();
        if (equipmentsResponse.success) {
          setEquipments(equipmentsResponse.data);
        }

        // Fetch equipment types
        const typesResponse = await setupService.getEquipmentTypes();
        if (typesResponse.success) {
          const types = [
            { value: '', label: 'All Types' },
            ...typesResponse.data.map(type => ({
              value: type.SetupDetailName,
              label: type.SetupDetailName
            }))
          ];
          setEquipmentTypes(types);
        }

        // Fetch commands (units with CompanyID = 1)
        const commandsResponse = await unitService.getCommands();
        if (commandsResponse.success) {
          const commandOptions = [
            { value: '', label: 'All Commands' },
            ...commandsResponse.data.map(cmd => ({
              value: cmd.UnitID.toString(),
              label: cmd.UnitName
            }))
          ];
          setCommands(commandOptions);
        }

        // Fetch all units initially
        const unitsResponse = await unitService.getAllUnits();
        if (unitsResponse.success) {
          const unitOptions = [
            { value: '', label: 'All Units' },
            ...unitsResponse.data.map(unit => ({
              value: unit.UnitID.toString(),
              label: unit.UnitName
            }))
          ];
          setUnits(unitOptions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle command filter change - fetch units for selected command
  const handleCommandChange = async (e) => {
    const commandId = e.target.value;
    setFilterCommand(commandId);
    setFilterUnit(''); // Reset unit filter when command changes

    if (commandId) {
      try {
        const unitsResponse = await unitService.getUnitsByCommand(commandId);
        if (unitsResponse.success) {
          const unitOptions = [
            { value: '', label: 'All Units' },
            ...unitsResponse.data.map(unit => ({
              value: unit.UnitID.toString(),
              label: unit.UnitName
            }))
          ];
          setUnits(unitOptions);
        }
      } catch (error) {
        console.error('Error fetching units by command:', error);
        toast.error('Error loading units');
      }
    } else {
      // If no command selected, fetch all units
      try {
        const unitsResponse = await unitService.getAllUnits();
        if (unitsResponse.success) {
          const unitOptions = [
            { value: '', label: 'All Units' },
            ...unitsResponse.data.map(unit => ({
              value: unit.UnitID.toString(),
              label: unit.UnitName
            }))
          ];
          setUnits(unitOptions);
        }
      } catch (error) {
        console.error('Error fetching all units:', error);
      }
    }
  };

  // Filter equipments based on search and filters
  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch =
      equipment.Equipment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.SerialNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.MakeModel?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !filterType || equipment.EquipmentTypeName === filterType;
    const matchesStatus = !filterStatus || equipment.Status === filterStatus;
    const matchesUnit = !filterUnit || equipment.Unit === filterUnit;

    return matchesSearch && matchesType && matchesStatus && matchesUnit;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'OPS': return 'success';
      case 'UNDER-REPAIR': return 'warning';
      case 'NON-OPS': return 'danger';
      case 'BER': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    {
      header: 'S.No',
      accessor: 'EquipmentID',
      width: '80px',
      render: (row, index) => indexOfFirstItem + index + 1
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
      accessor: 'UnitName',
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
      header: 'Actions',
      accessor: 'actions',
      width: '140px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/dashboard/equipments/${row.EquipmentID}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/dashboard/equipments/edit/${row.EquipmentID}`)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(row.EquipmentID)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      )
    }
  ];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        const response = await equipmentService.deleteEquipment(id);
        if (response.success) {
          // Remove from local state
          setEquipments(equipments.filter(e => e.EquipmentID !== id));
          toast.success('Equipment deleted successfully');
        } else {
          toast.error(response.message || 'Error deleting equipment');
        }
      } catch (error) {
        console.error('Error deleting equipment:', error);
        toast.error(error.response?.data?.message || 'Error deleting equipment');
      }
    }
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
          {/* <Button
            variant="outline"
            icon={Download}
            onClick={() => toast.info('Export functionality coming soon')}
          >
            Export
          </Button> */}
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/dashboard/equipments/add')}
          >
            Add Equipment
          </Button>
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Search by name, serial, or model..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            placeholder="Filter by type"
            options={equipmentTypes}
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            placeholder="Filter by command"
            options={commands}
            value={filterCommand}
            onChange={(e) => {
              handleCommandChange(e);
              setCurrentPage(1);
            }}
          />
          <Select
            placeholder="Filter by unit"
            options={units}
            value={filterUnit}
            onChange={(e) => {
              setFilterUnit(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {(searchTerm || filterType || filterCommand || filterStatus || filterUnit) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredEquipments.length} of {equipments.length} equipments
            </p>
            <button
              onClick={async () => {
                setSearchTerm('');
                setFilterType('');
                setFilterCommand('');
                setFilterStatus('');
                setFilterUnit('');
                setCurrentPage(1);

                // Reload all units when clearing filters
                try {
                  const unitsResponse = await unitService.getAllUnits();
                  if (unitsResponse.success) {
                    const unitOptions = [
                      { value: '', label: 'All Units' },
                      ...unitsResponse.data.map(unit => ({
                        value: unit.UnitID.toString(),
                        label: unit.UnitName
                      }))
                    ];
                    setUnits(unitOptions);
                  }
                } catch (error) {
                  console.error('Error fetching all units:', error);
                }
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
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={currentItems}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEquipments.length)} of {filteredEquipments.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${currentPage === pageNumber
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Equipments;


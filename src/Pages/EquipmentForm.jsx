import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Save, 
  ArrowLeft, 
  Package,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';
import { Button, Input, Select, Card } from '../components/ui';
import { equipmentService, unitService, setupService } from '../services';

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    unit: '',
    equipmentTypeSetupDetailID: '',
    equipment: '',
    serialNo: '',
    makeModel: '',
    processor: '',
    ram: '',
    storage: '',
    opticalDrive: '',
    nic: '',
    powerSupply: '',
    dateOfPurchase: '',
    sourceOfProcurement: '',
    contractLPONoDate: '',
    oemInfo: '',
    localOEMRep: '',
    warrantyExpiryDate: '',
    slaRecDMDetails: '',
    status: 'OPS',
    remarks: '',
    referenceNo: ''
  });

  const [units, setUnits] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status options
  const statusOptions = [
    { value: 'OPS', label: 'OPS' },
    { value: 'NON-OPS', label: 'NON-OPS' },
    { value: 'UNDER-REPAIR', label: 'UNDER-REPAIR' },
    { value: 'BER', label: 'BER' }
  ];

  // NIC options
  const nicOptions = [
    { value: '', label: 'Select NIC Type' },
    { value: 'FIXED', label: 'FIXED' },
    { value: 'EXTENDED', label: 'EXTENDED' }
  ];

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);

        // Fetch units
        const unitsResponse = await unitService.getAllUnits();
        if (unitsResponse.success) {
          const unitOptions = unitsResponse.data.map(unit => ({
            value: unit.UnitID.toString(),
            label: unit.UnitName
          }));
          setUnits(unitOptions);
        }

        // Fetch equipment types
        const typesResponse = await setupService.getEquipmentTypes();
        console.log("Equipment Types:", typesResponse);
        if (typesResponse.success) {
          const typeOptions = typesResponse.data.map(type => ({
            value: type.SetupDetailID.toString(),
            label: type.SetupDetailName
          }));
          setEquipmentTypes(typeOptions);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch equipment data for editing
  useEffect(() => {
    const fetchEquipment = async () => {
      if (isEditMode) {
        try {
          const response = await equipmentService.getEquipmentById(id);
          if (response.success) {
            const equipment = response.data;
            setFormData({
              unit: equipment.Unit || '',
              equipmentTypeSetupDetailID: equipment.EquipmentTypeSetupDetailID?.toString() || '',
              equipment: equipment.Equipment || '',
              serialNo: equipment.SerialNo || '',
              makeModel: equipment.MakeModel || '',
              processor: equipment.Processor || '',
              ram: equipment.RAM || '',
              storage: equipment.Storage || '',
              opticalDrive: equipment.OpticalDrive || '',
              nic: equipment.NIC || '',
              powerSupply: equipment.PowerSupply || '',
              dateOfPurchase: equipment.DateOfPurchase ? equipment.DateOfPurchase.split('T')[0] : '',
              sourceOfProcurement: equipment.SourceOfProcurement || '',
              contractLPONoDate: equipment.ContractLPONoDate || '',
              oemInfo: equipment.OEMInfo || '',
              localOEMRep: equipment.LocalOEMRep || '',
              warrantyExpiryDate: equipment.WarrantyExpiryDate ? equipment.WarrantyExpiryDate.split('T')[0] : '',
              slaRecDMDetails: equipment.SLARecDMDetails || '',
              status: equipment.Status || 'OPS',
              remarks: equipment.Remarks || '',
              referenceNo: equipment.ReferenceNo || ''
            });
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
          toast.error('Error loading equipment data');
        }
      }
    };

    fetchEquipment();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data for API
      const equipmentData = {
        unit: formData.unit,
        equipmentTypeSetupDetailID: parseInt(formData.equipmentTypeSetupDetailID),
        equipment: formData.equipment,
        serialNo: formData.serialNo || null,
        makeModel: formData.makeModel || null,
        processor: formData.processor || null,
        ram: formData.ram || null,
        storage: formData.storage || null,
        opticalDrive: formData.opticalDrive || null,
        nic: formData.nic || null,
        powerSupply: formData.powerSupply || null,
        dateOfPurchase: formData.dateOfPurchase || null,
        sourceOfProcurement: formData.sourceOfProcurement || null,
        contractLPONoDate: formData.contractLPONoDate || null,
        oemInfo: formData.oemInfo || null,
        localOEMRep: formData.localOEMRep || null,
        warrantyExpiryDate: formData.warrantyExpiryDate || null,
        slaRecDMDetails: formData.slaRecDMDetails || null,
        status: formData.status,
        remarks: formData.remarks || null,
        referenceNo: formData.referenceNo || null
      };

      let response;
      if (isEditMode) {
        response = await equipmentService.updateEquipment(id, equipmentData);
      } else {
        response = await equipmentService.createEquipment(equipmentData);
      }

      if (response.success) {
        toast.success(isEditMode ? 'Equipment updated successfully!' : 'Equipment added successfully!');
        navigate('/dashboard/equipments');
      } else {
        toast.error(response.message || 'Error saving equipment');
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error(error.response?.data?.message || 'Error saving equipment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/dashboard/equipments')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditMode ? 'Edit Equipment' : 'Add New Equipment'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update equipment information' : 'Enter equipment details to add to inventory'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title="Basic Information" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Select
              label="Unit/Department"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              options={units}
              required
            />
            <Select
              label="Equipment Type"
              name="equipmentTypeSetupDetailID"
              value={formData.equipmentTypeSetupDetailID}
              onChange={handleChange}
              options={equipmentTypes}
              required
            />
            <Input
              label="Equipment Name"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="e.g., Dell Precision 5820"
              required
            />
            <Input
              label="Serial Number"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              placeholder="e.g., DL2023001"
            />
            <Input
              label="Make/Model"
              name="makeModel"
              value={formData.makeModel}
              onChange={handleChange}
              placeholder="e.g., Dell Precision 5820 Tower"
            />
          </div>
        </Card>

        {/* Technical Specifications */}
        <Card title="Technical Specifications" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Processor"
              name="processor"
              value={formData.processor}
              onChange={handleChange}
              placeholder="e.g., Intel Xeon W-2245 3.9GHz"
            />
            <Input
              label="RAM"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              placeholder="e.g., 32GB DDR4"
            />
            <Input
              label="Storage"
              name="storage"
              value={formData.storage}
              onChange={handleChange}
              placeholder="e.g., 1TB NVMe SSD"
            />
            <Input
              label="Optical Drive"
              name="opticalDrive"
              value={formData.opticalDrive}
              onChange={handleChange}
              placeholder="e.g., DVD-RW"
            />
            <Select
              label="NIC"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              options={nicOptions}
            />
            <Input
              label="Power Supply"
              name="powerSupply"
              value={formData.powerSupply}
              onChange={handleChange}
              placeholder="e.g., 950W"
            />
          </div>
        </Card>

        {/* Procurement Information */}
        <Card title="Procurement Information" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Date of Purchase"
              name="dateOfPurchase"
              type="date"
              value={formData.dateOfPurchase}
              onChange={handleChange}
            />
            <Input
              label="Source of Procurement"
              name="sourceOfProcurement"
              value={formData.sourceOfProcurement}
              onChange={handleChange}
              placeholder="e.g., Dell Direct"
            />
            <Input
              label="Contract/LPO No & Date"
              name="contractLPONoDate"
              value={formData.contractLPONoDate}
              onChange={handleChange}
              placeholder="e.g., LPO-2023-001/15-01-2023"
            />
            <Input
              label="Reference Number"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              placeholder="e.g., REF-2023-001"
            />
          </div>
        </Card>

        {/* Warranty & Support */}
        <Card title="Warranty & Support Information" icon={Calendar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="OEM Information"
              name="oemInfo"
              value={formData.oemInfo}
              onChange={handleChange}
              placeholder="e.g., Dell Technologies"
            />
            <Input
              label="Local OEM Representative"
              name="localOEMRep"
              value={formData.localOEMRep}
              onChange={handleChange}
              placeholder="e.g., Dell UAE - Dubai"
            />
            <Input
              label="Warranty Expiry Date"
              name="warrantyExpiryDate"
              type="date"
              value={formData.warrantyExpiryDate}
              onChange={handleChange}
            />
            <Input
              label="SLA/Rec DM Details"
              name="slaRecDMDetails"
              value={formData.slaRecDMDetails}
              onChange={handleChange}
              placeholder="e.g., 3 Year Premium Support"
            />
          </div>
        </Card>

        {/* Status & Remarks */}
        <Card title="Status & Additional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border-none rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Enter any additional remarks or notes..."
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end gap-4 bg-white rounded-lg shadow p-6"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/equipments')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Save}
          >
            {isEditMode ? 'Update Equipment' : 'Add Equipment'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default EquipmentForm;



import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Package,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';
import { Button, Input, Select, Card } from '../components/ui';
import { equipmentTypes, statusOptions, units, dummyEquipments } from '../data/dummyData';

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    sno: '',
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
    cost: '',
    oemInfo: '',
    localOEMRep: '',
    warrantyExpiryDate: '',
    slaRecDMDetails: '',
    status: 'Active',
    remarks: '',
    referenceNo: ''
  });

  useEffect(() => {
    if (isEditMode) {
      // Load equipment data for editing
      const equipment = dummyEquipments.find(e => e.EquipmentID === parseInt(id));
      if (equipment) {
        setFormData({
          sno: equipment.SNO || '',
          unit: equipment.Unit || '',
          equipmentTypeSetupDetailID: equipment.EquipmentTypeName || '',
          equipment: equipment.Equipment || '',
          serialNo: equipment.SerialNo || '',
          makeModel: equipment.MakeModel || '',
          processor: equipment.Processor || '',
          ram: equipment.RAM || '',
          storage: equipment.Storage || '',
          opticalDrive: equipment.OpticalDrive || '',
          nic: equipment.NIC || '',
          powerSupply: equipment.PowerSupply || '',
          dateOfPurchase: equipment.DateOfPurchase || '',
          sourceOfProcurement: equipment.SourceOfProcurement || '',
          contractLPONoDate: equipment.ContractLPONoDate || '',
          cost: equipment.Cost || '',
          oemInfo: equipment.OEMInfo || '',
          localOEMRep: equipment.LocalOEMRep || '',
          warrantyExpiryDate: equipment.WarrantyExpiryDate || '',
          slaRecDMDetails: equipment.SLARecDMDetails || '',
          status: equipment.Status || 'Active',
          remarks: equipment.Remarks || '',
          referenceNo: equipment.ReferenceNo || ''
        });
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would call API
    console.log('Form Data:', formData);
    alert(isEditMode ? 'Equipment updated successfully!' : 'Equipment added successfully!');
    navigate('/dashboard/equipments');
  };

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
            <Input
              label="S.No"
              name="sno"
              value={formData.sno}
              onChange={handleChange}
              placeholder="Enter serial number"
            />
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
            <Input
              label="NIC"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="e.g., Intel I219-LM Gigabit"
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
              label="Cost"
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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



import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Package,
  Cpu,
  HardDrive,
  DollarSign,
  Calendar,
  Shield,
  FileText,
  MapPin
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { dummyEquipments } from '../data/dummyData';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const equipment = dummyEquipments.find(e => e.EquipmentID === parseInt(id));

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Package className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Equipment Not Found</h2>
        <p className="text-gray-600 mb-6">The equipment you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard/equipments')}>
          Back to Equipment List
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Inactive': return 'danger';
      default: return 'default';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      alert('Equipment deleted successfully!');
      navigate('/dashboard/equipments');
    }
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && (
        <div className="mt-1">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-800">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/dashboard/equipments')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{equipment.Equipment}</h1>
            <p className="text-gray-600 mt-1">Serial No: {equipment.SerialNo}</p>
        </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Edit}
            onClick={() => navigate(`/dashboard/equipments/edit/${equipment.EquipmentID}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-blue-100 text-sm mb-1">Status</p>
            <Badge variant={getStatusVariant(equipment.Status)} size="lg">
              {equipment.Status}
            </Badge>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Equipment Type</p>
            <p className="text-xl font-bold">{equipment.EquipmentTypeName}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Unit/Department</p>
            <p className="text-xl font-bold">{equipment.Unit}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Cost</p>
            <p className="text-xl font-bold">${equipment.Cost.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card title="Basic Information" icon={Package}>
          <div className="space-y-0">
            <InfoRow label="S.No" value={equipment.SNO} />
            <InfoRow label="Equipment Name" value={equipment.Equipment} />
            <InfoRow label="Serial Number" value={equipment.SerialNo} />
            <InfoRow label="Make/Model" value={equipment.MakeModel} />
            <InfoRow label="Reference Number" value={equipment.ReferenceNo} />
          </div>
        </Card>

        {/* Technical Specifications */}
        <Card title="Technical Specifications" icon={Cpu}>
          <div className="space-y-0">
            <InfoRow label="Processor" value={equipment.Processor} icon={Cpu} />
            <InfoRow label="RAM" value={equipment.RAM} icon={HardDrive} />
            <InfoRow label="Storage" value={equipment.Storage} icon={HardDrive} />
            <InfoRow label="Optical Drive" value={equipment.OpticalDrive} />
            <InfoRow label="NIC" value={equipment.NIC} />
            <InfoRow label="Power Supply" value={equipment.PowerSupply} />
          </div>
        </Card>

        {/* Procurement Information */}
        <Card title="Procurement Information" icon={DollarSign}>
          <div className="space-y-0">
            <InfoRow 
              label="Date of Purchase" 
              value={equipment.DateOfPurchase ? new Date(equipment.DateOfPurchase).toLocaleDateString() : 'N/A'} 
              icon={Calendar} 
            />
            <InfoRow label="Source of Procurement" value={equipment.SourceOfProcurement} />
            <InfoRow label="Contract/LPO No & Date" value={equipment.ContractLPONoDate} />
            <InfoRow label="Cost" value={`$${equipment.Cost.toLocaleString()}`} icon={DollarSign} />
          </div>
        </Card>

        {/* Warranty & Support */}
        <Card title="Warranty & Support" icon={Shield}>
          <div className="space-y-0">
            <InfoRow label="OEM Information" value={equipment.OEMInfo} />
            <InfoRow label="Local OEM Representative" value={equipment.LocalOEMRep} icon={MapPin} />
            <InfoRow 
              label="Warranty Expiry Date" 
              value={equipment.WarrantyExpiryDate ? new Date(equipment.WarrantyExpiryDate).toLocaleDateString() : 'N/A'} 
              icon={Calendar}
            />
            <InfoRow label="SLA/Rec DM Details" value={equipment.SLARecDMDetails} />
          </div>
        </Card>
      </div>

      {/* Additional Information */}
      <Card title="Additional Information" icon={FileText}>
        <div className="space-y-0">
          <InfoRow label="Created By" value={equipment.CreatedByFullName} />
          <InfoRow 
            label="Created At" 
            value={equipment.CreatedAt ? new Date(equipment.CreatedAt).toLocaleString() : 'N/A'} 
          />
          <InfoRow label="Remarks" value={equipment.Remarks} />
        </div>
      </Card>

      {/* Activity Timeline (Placeholder for future) */}
      <Card title="Activity Timeline">
        <div className="space-y-4">
          {[
            { action: 'Equipment Created', date: equipment.CreatedAt, user: equipment.CreatedByFullName },
            { action: 'Last Updated', date: equipment.CreatedAt, user: equipment.CreatedByFullName }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">By {activity.user}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.date ? new Date(activity.date).toLocaleString() : 'N/A'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EquipmentDetail;


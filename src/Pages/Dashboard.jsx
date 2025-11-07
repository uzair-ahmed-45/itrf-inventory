import { Package, CheckCircle, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import { StatCard, PieChart } from '../components';
import { dashboardStats, equipmentByType, equipmentByStatus } from '../data/dummyData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your equipment overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Equipment"
          value={dashboardStats.totalEquipments}
          subtitle="All registered items"
          trend={12.5}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Active Equipment"
          value={dashboardStats.activeEquipments}
          subtitle="Currently in use"
          trend={8.2}
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          title="Under Maintenance"
          value={dashboardStats.underMaintenance}
          subtitle="Requires attention"
          trend={-15.3}
          color="yellow"
        />
        <StatCard
          icon={DollarSign}
          title="Total Value"
          value={`$${dashboardStats.totalValue.toLocaleString()}`}
          subtitle="Asset valuation"
          trend={5.7}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart 
          data={equipmentByType} 
          title="Equipment by Type"
        />
        <PieChart 
          data={equipmentByStatus} 
          title="Equipment by Status"
        />
      </div>
    </div>
  );
};

export default Dashboard;


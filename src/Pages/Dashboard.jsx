import { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, XCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import toast from 'react-hot-toast';
import { StatCard, PieChart } from '../components';
import { dashboardService } from '../services';

// Import and initialize drilldown module
import('highcharts/modules/drilldown').then(module => {
  module.default(Highcharts);
});

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipments: 0,
    ops: 0,
    nonOps: 0,
    underRepair: 0,
    ber: 0
  });
  const [equipmentByType, setEquipmentByType] = useState([]);
  const [equipmentByStatus, setEquipmentByStatus] = useState([]);
  const [equipmentByCommand, setEquipmentByCommand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await dashboardService.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch equipment by type
      const typeResponse = await dashboardService.getEquipmentByType();
      if (typeResponse.success) {
        const typeData = typeResponse.data.map((item, index) => ({
          name: item.Type || 'Unknown',
          value: item.Count,
          color: getChartColors()[index % getChartColors().length]
        }));
        setEquipmentByType(typeData);
      }

      // Fetch equipment by status
      const statusResponse = await dashboardService.getEquipmentByStatus();
      if (statusResponse.success && statusResponse.data.length > 0) {
        const statusData = statusResponse.data.map(item => ({
          name: item.Status,
          value: item.Count,
          color: getStatusColor(item.Status)
        }));
        setEquipmentByStatus(statusData);
      }

      // Fetch equipment by command
      const commandResponse = await dashboardService.getEquipmentByCommand();
      if (commandResponse.success) {
        setEquipmentByCommand(commandResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getChartColors = () => [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F97316'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPS': return '#10B981';
      case 'NON-OPS': return '#EF4444';
      case 'UNDER-REPAIR': return '#F59E0B';
      case 'BER': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleCommandDrilldown = async (e) => {
    if (!e.seriesOptions) {
      const chart = e.target;
      const commandId = e.point.commandId;
      const commandName = e.point.name;

      try {
        const response = await dashboardService.getEquipmentByUnitsInCommand(commandId);
        if (response.success) {
          const drilldownData = response.data.map(item => ({
            name: item.UnitName,
            y: item.Count
          }));

          chart.addSeriesAsDrilldown(e.point, {
            name: commandName,
            data: drilldownData,
            colorByPoint: true
          });
        }
      } catch (error) {
        console.error('Error fetching units data:', error);
        toast.error('Error loading units data');
      }
    }
  };

  const commandChartOptions = {
    chart: {
      type: 'pie',
      height: 400
    },
    title: {
      text: 'Equipment by Command',
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    subtitle: {
      text: 'Click on a command to view units'
    },
    tooltip: {
      pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Equipment',
      colorByPoint: true,
      data: equipmentByCommand.map((item, index) => ({
        name: item.CommandName,
        y: item.Count,
        drilldown: item.CommandName,
        commandId: item.UnitID,
        color: getChartColors()[index % getChartColors().length]
      }))
    }],
    drilldown: {
      breadcrumbs: {
        position: {
          align: 'right'
        }
      },
      series: []
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
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
          value={stats.totalEquipments}
          subtitle="All registered items"
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="OPS"
          value={stats.ops}
          subtitle="Currently operational"
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          title="Under Repair"
          value={stats.underRepair}
          subtitle="Requires attention"
          color="yellow"
        />
        <StatCard
          icon={XCircle}
          title="Non Ops"
          value={stats.nonOps}
          subtitle="Not operational"
          color="red"
        />
      </div>

      {/* Command Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={commandChartOptions}
          callback={(chart) => {
            chart.drilldownLevels = [];
            Highcharts.addEvent(chart, 'drilldown', handleCommandDrilldown);
          }}
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equipmentByType.length > 0 && (
          <PieChart 
            data={equipmentByType} 
            title="Equipment by Type"
          />
        )}
        {equipmentByStatus.length > 0 && (
          <PieChart 
            data={equipmentByStatus} 
            title="Equipment by Status"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;


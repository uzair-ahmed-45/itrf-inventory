import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get equipment by type
  getEquipmentByType: async () => {
    try {
      const response = await api.get('/dashboard/equipment-by-type');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by type:', error);
      throw error;
    }
  },

  // Get equipment by status
  getEquipmentByStatus: async () => {
    try {
      const response = await api.get('/dashboard/equipment-by-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by status:', error);
      throw error;
    }
  },

  // Get equipment by command
  getEquipmentByCommand: async () => {
    try {
      const response = await api.get('/dashboard/equipment-by-command');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by command:', error);
      throw error;
    }
  },

  // Get equipment by units in command
  getEquipmentByUnitsInCommand: async (commandId) => {
    try {
      const response = await api.get(`/dashboard/equipment-by-command/${commandId}/units`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by units in command:', error);
      throw error;
    }
  }
};

export default dashboardService;


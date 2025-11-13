import api from './api';

const setupService = {
  // Get all setup details
  getAllSetupDetails: async () => {
    try {
      const response = await api.get('/setup-details');
      return response.data;
    } catch (error) {
      console.error('Error fetching setup details:', error);
      throw error;
    }
  },

  // Get setup details by SMS ID
  getSetupDetailsBySMSId: async (smsId) => {
    try {
      const response = await api.get(`/setup-details/sms/${smsId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching setup details by SMS ID:', error);
      throw error;
    }
  },

  // Get equipment types (SMSID = 2 for EquipmentTypes)
  getEquipmentTypes: async () => {
    try {
      const response = await api.get('/setup-details/sms/1');
      console.log("Equipment Types Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment types:', error);
      throw error;
    }
  }
};

export default setupService;


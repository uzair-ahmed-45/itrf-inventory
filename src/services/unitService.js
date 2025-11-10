import api from './api';

const unitService = {
  // Get all units
  getAllUnits: async () => {
    try {
      const response = await api.get('/units');
      return response.data;
    } catch (error) {
      console.error('Error fetching units:', error);
      throw error;
    }
  },

  // Get unit by ID
  getUnitById: async (id) => {
    try {
      const response = await api.get(`/units/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unit by ID:', error);
      throw error;
    }
  },

  // Get units by parent unit
  getUnitsByParentUnit: async (parentUnitId) => {
    try {
      const response = await api.get(`/units/parent/${parentUnitId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching units by parent unit:', error);
      throw error;
    }
  },

  // Get units by company ID
  getUnitsByCompanyId: async (companyId) => {
    try {
      const response = await api.get(`/units/company/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching units by company ID:', error);
      throw error;
    }
  },

  // Create new unit
  createUnit: async (unitData) => {
    try {
      const response = await api.post('/units', unitData);
      return response.data;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw error;
    }
  },

  // Update unit
  updateUnit: async (id, unitData) => {
    try {
      const response = await api.put(`/units/${id}`, unitData);
      return response.data;
    } catch (error) {
      console.error('Error updating unit:', error);
      throw error;
    }
  },

  // Delete unit
  deleteUnit: async (id) => {
    try {
      const response = await api.delete(`/units/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }
  },

  // Get all commands (units with CompanyID = 1)
  getCommands: async () => {
    try {
      const response = await api.get('/units/commands');
      return response.data;
    } catch (error) {
      console.error('Error fetching commands:', error);
      throw error;
    }
  },

  // Get units by command
  getUnitsByCommand: async (commandId) => {
    try {
      const response = await api.get(`/units/command/${commandId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching units by command:', error);
      throw error;
    }
  }
};

export default unitService;


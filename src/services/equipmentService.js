import api from './api';

const equipmentService = {
  // Get all equipments
  getAllEquipments: async () => {
    try {
      const response = await api.get('/equipments');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipments:', error);
      throw error;
    }
  },

  // Get equipment by ID
  getEquipmentById: async (id) => {
    try {
      const response = await api.get(`/equipments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by ID:', error);
      throw error;
    }
  },

  // Get equipments by type
  getEquipmentsByType: async (typeId) => {
    try {
      const response = await api.get(`/equipments/type/${typeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipments by type:', error);
      throw error;
    }
  },

  // Search equipments
  searchEquipments: async (searchTerm) => {
    try {
      const response = await api.get('/equipments/search', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching equipments:', error);
      throw error;
    }
  },

  // Create new equipment
  createEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/equipments', equipmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  },

  // Update equipment
  updateEquipment: async (id, equipmentData) => {
    try {
      const response = await api.put(`/equipments/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  },

  // Delete equipment
  deleteEquipment: async (id) => {
    try {
      const response = await api.delete(`/equipments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw error;
    }
  }
};

export default equipmentService;


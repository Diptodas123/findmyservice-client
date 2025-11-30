import apiClient from './apiClient';
import { API_BASE_URL } from '../config/config';

export const serviceAPI = {
  // Get all services
  getAllServices: async () => {
    return await apiClient.get('/api/v1/services', { baseURL: API_BASE_URL });
  },

  // Get service by ID
  getServiceById: async (serviceId) => {
    return await apiClient.get(`/api/v1/services/${serviceId}`, { baseURL: API_BASE_URL });
  },

  // Create a new service (requires authentication)
  createService: async (serviceData) => {
    return await apiClient.post('/api/v1/services', serviceData, { baseURL: API_BASE_URL });
  },

  // Update service (requires authentication)
  updateService: async (serviceId, serviceData) => {
    return await apiClient.put(`/api/v1/services/${serviceId}`, serviceData, { baseURL: API_BASE_URL });
  },

  // Delete service (requires authentication)
  deleteService: async (serviceId) => {
    return await apiClient.del(`/api/v1/services/${serviceId}`, { baseURL: API_BASE_URL });
  },

  // Search and filter services (client-side filtering)
  searchServices: async (filters = {}) => {
    const { query, location, categories, priceMin, priceMax, ratings } = filters;
    const allServices = await apiClient.get('/api/v1/services', { baseURL: API_BASE_URL });
    
    return allServices.filter(service => {
      // Query filter
      const matchesQuery = !query || 
        service.serviceName?.toLowerCase().includes(query.toLowerCase()) ||
        service.description?.toLowerCase().includes(query.toLowerCase());

      // Category filter
      const serviceCategory = service.serviceName?.split(' ')[0];
      const matchesCategory = !categories?.length || categories.includes(serviceCategory);

      // Price filter
      const servicePrice = Number(service.cost) || 0;
      const matchesPrice = 
        (priceMin === undefined || servicePrice >= priceMin) && 
        (priceMax === undefined || servicePrice <= priceMax);

      // Rating filter
      const serviceRating = Math.floor(Number(service.avgRating) || 0);
      const matchesRating = !ratings?.length || ratings.some(rating => serviceRating >= rating);

      // Location filter
      const matchesLocation = !location || service.location === location;

      // Active services only
      const isActive = service.active !== false;

      return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesLocation && isActive;
    });
  }
};

export default serviceAPI;

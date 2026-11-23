import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serviceAPI } from './serviceAPI';
import apiClient from './apiClient';

vi.mock('./apiClient');

describe('serviceAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllServices', () => {
    it('should fetch all services', async () => {
      const mockServices = [{ id: '1', name: 'Service 1' }];
      apiClient.get.mockResolvedValue(mockServices);

      const result = await serviceAPI.getAllServices();
      expect(apiClient.get).toHaveBeenCalled();
      expect(result).toEqual(mockServices);
    });
  });

  describe('getServiceById', () => {
    it('should fetch service by id', async () => {
      const mockService = { id: '1', name: 'Service 1' };
      apiClient.get.mockResolvedValue(mockService);

      const result = await serviceAPI.getServiceById('1');
      expect(apiClient.get).toHaveBeenCalled();
      expect(result).toEqual(mockService);
    });
  });

  describe('getAllServicesByProvider', () => {
    it('should fetch services by provider', async () => {
      const mockServices = [{ id: '1', providerId: '123' }];
      apiClient.get.mockResolvedValue(mockServices);

      const result = await serviceAPI.getAllServicesByProvider('123');
      expect(apiClient.get).toHaveBeenCalled();
      expect(result).toEqual(mockServices);
    });
  });

  describe('searchServices', () => {
    it('should search services with filters', async () => {
      const mockServices = [{ id: '1', serviceName: 'Plumber' }];
      apiClient.get.mockResolvedValue(mockServices);

      const result = await serviceAPI.searchServices({ query: 'plumber' });
      expect(apiClient.get).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const serviceData = { name: 'New Service', price: 100 };
      const mockResponse = { id: '1', ...serviceData };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await serviceAPI.createService(serviceData);
      expect(apiClient.post).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateService', () => {
    it('should update a service', async () => {
      const updates = { name: 'Updated Service' };
      const mockResponse = { id: '1', ...updates };
      apiClient.patch.mockResolvedValue(mockResponse);

      const result = await serviceAPI.updateService('1', updates);
      expect(apiClient.patch).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      apiClient.del.mockResolvedValue({ success: true });

      const result = await serviceAPI.deleteService('1');
      expect(apiClient.del).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});

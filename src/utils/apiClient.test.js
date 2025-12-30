/* global global */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient from './apiClient';
import toastMessage from './toastMessage';

vi.mock('./toastMessage', () => ({
  default: vi.fn(),
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    global.localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
      });

      const result = await apiClient.get('/test');
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should handle GET with query parameters', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      });

      await apiClient.get('/test', { query: { page: 1, limit: 10 } });
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });

    it('should include authorization header when token exists', async () => {
      global.localStorage.getItem.mockReturnValueOnce('test-token');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      });

      await apiClient.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with body', async () => {
      const postData = { name: 'Test', value: 123 };
      const mockResponse = { id: 1, ...postData };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: async () => JSON.stringify(mockResponse),
      });

      const result = await apiClient.post('/test', postData);
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const putData = { id: 1, name: 'Updated' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(putData),
      });

      const result = await apiClient.put('/test/1', putData);
      
      expect(result).toEqual(putData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: async () => '',
      });

      const result = await apiClient.del('/test/1');
      
      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make successful PATCH request', async () => {
      const patchData = { name: 'Patched' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(patchData),
      });

      const result = await apiClient.patch('/test/1', patchData);
      
      expect(result).toEqual(patchData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('error handling', () => {
    it('should handle 401 unauthorized error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ message: 'Unauthorized' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('should handle 403 forbidden error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => JSON.stringify({ message: 'Forbidden' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('should handle 500 server error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ error: 'Server error' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      const abortError = new Error('Request timed out');
      abortError.name = 'AbortError';
      
      global.fetch.mockRejectedValueOnce(abortError);

      await expect(apiClient.get('/test', { timeout: 100 })).rejects.toThrow('Request timed out');
      expect(toastMessage).toHaveBeenCalledWith({
        msg: 'Network timeout. Please check your connection and try again.',
        type: 'error',
      });
    });

    it('should handle network error', async () => {
      const networkError = new TypeError('Failed to fetch');
      
      global.fetch.mockRejectedValueOnce(networkError);

      await expect(apiClient.get('/test')).rejects.toThrow();
      expect(toastMessage).toHaveBeenCalledWith({
        msg: 'Network error. Please check your connection.',
        type: 'error',
      });
    });

    it('should handle 400 error with message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ message: 'Bad request' }),
      });

      try {
        await apiClient.get('/test');
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.userMessage).toBe('Bad request');
      }
    });
  });

  describe('query parameters', () => {
    it('should skip undefined query parameters', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      });

      await apiClient.get('/test', { query: { page: 1, empty: undefined } });
      
      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('page=1');
      expect(callUrl).not.toContain('empty');
    });

    it('should skip null query parameters', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      });

      await apiClient.get('/test', { query: { page: 1, empty: null } });
      
      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('page=1');
      expect(callUrl).not.toContain('empty');
    });
  });

  describe('custom headers', () => {
    it('should merge custom headers with defaults', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      });

      await apiClient.get('/test', {
        headers: { 'X-Custom': 'value' },
      });
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom': 'value',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('baseURL override', () => {
    it('should use custom baseURL when provided', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({}),
      });

      await apiClient.get('/test', { baseURL: 'https://custom.api.com' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom.api.com'),
        expect.any(Object)
      );
    });
  });

  describe('empty response', () => {
    it('should handle empty response body', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: async () => '',
      });

      const result = await apiClient.get('/test');
      
      expect(result).toBeNull();
    });
  });
});

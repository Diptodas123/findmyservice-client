/* global global */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables before importing cloudinary
vi.stubGlobal('import.meta', {
  env: {
    VITE_CLOUDINARY_CLOUD_NAME: 'test-cloud',
    VITE_CLOUDINARY_UPLOAD_PRESET: 'test-preset',
  }
});

import cloudinary from './cloudinary';
import toastMessage from './toastMessage';

vi.mock('./toastMessage', () => ({
  default: vi.fn(),
}));

describe('cloudinary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('uploadImage', () => {
    it('should successfully upload an image', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        secure_url: 'https://res.cloudinary.com/test/image.jpg',
        public_id: 'test-id',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await cloudinary.uploadImage(mockFile);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.cloudinary.com'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('should upload with folder option', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        secure_url: 'https://res.cloudinary.com/test/image.jpg',
        public_id: 'folder/test-id',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await cloudinary.uploadImage(mockFile, { folder: 'profiles' });

      expect(result).toEqual(mockResponse);
    });

    it('should handle upload failure with error message', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: 'Invalid file' } }),
      });

      try {
        await cloudinary.uploadImage(mockFile);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Invalid file');
        expect(toastMessage).toHaveBeenCalledWith({
          msg: 'Invalid file',
          type: 'error',
        });
      }
    });

    it('should handle network error', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      
      global.fetch.mockRejectedValueOnce(new TypeError('Network error'));

      try {
        await cloudinary.uploadImage(mockFile);
        expect.fail('Should have thrown an error');
      } catch {
        expect(toastMessage).toHaveBeenCalledWith({
          msg: 'Failed to upload image. Check your network or try again.',
          type: 'error',
        });
      }
    });

    it('should handle error response without specific message', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(cloudinary.uploadImage(mockFile)).rejects.toThrow('Upload failed (status 500)');
    });

    it('should handle error with message field', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Upload error' }),
      });

      await expect(cloudinary.uploadImage(mockFile)).rejects.toThrow('Upload error');
    });
  });
});

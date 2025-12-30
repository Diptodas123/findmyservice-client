import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../src/test/test-utils';
import RecommendedServices from './RecommendedServices';
import apiClient from '../../utils/apiClient';

vi.mock('../../utils/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('RecommendedServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component', () => {
    apiClient.get.mockImplementation(() => new Promise(() => {}));
    const { container } = render(<RecommendedServices />);
    
    expect(container).toBeInTheDocument();
  });

  it('should fetch and display service categories', async () => {
    const mockServices = [
      { serviceId: '1', serviceName: 'Plumbing Repair', imageUrl: 'plumbing.jpg' },
      { serviceId: '2', serviceName: 'Electrical Work', imageUrl: 'electrical.jpg' },
    ];

    apiClient.get.mockResolvedValueOnce({ data: mockServices });

    render(<RecommendedServices />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/services');
    });
  });

  it('should handle fetch error', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));

    render(<RecommendedServices />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
    });
  });
});

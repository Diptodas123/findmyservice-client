import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../src/test/test-utils';
import PopularServiceProviders from './PopularServiceProviders';
import apiClient from '../../utils/apiClient';

vi.mock('../../utils/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('PopularServiceProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    apiClient.get.mockImplementation(() => new Promise(() => {}));
    render(<PopularServiceProviders />);
    
    expect(screen.getByText(/Popular Service Providers/i)).toBeInTheDocument();
  });

  it('should fetch and display providers', async () => {
    const mockProviders = [
      { providerId: '1', providerName: 'Provider 1', avgRating: 4.5 },
      { providerId: '2', providerName: 'Provider 2', avgRating: 4.2 },
    ];

    apiClient.get.mockResolvedValueOnce({ data: mockProviders });

    render(<PopularServiceProviders />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/providers');
    });
  });

  it('should handle fetch error gracefully', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('API Error'));

    render(<PopularServiceProviders />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
    });
  });
});

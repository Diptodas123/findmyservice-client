import { describe, it, expect, vi } from 'vitest';
import { navigateToSearch } from './searchNavigation';

vi.mock('../store/store', () => ({
  default: {
    dispatch: vi.fn(),
  },
}));

vi.mock('../store/searchSlice', () => ({
  setFilters: vi.fn((filters) => ({ type: 'SET_FILTERS', payload: filters })),
}));

describe('searchNavigation', () => {
  describe('navigateToSearch', () => {
    it('should call navigate with filters', () => {
      const mockNavigate = vi.fn();
      const filters = { query: 'plumber' };
      navigateToSearch(mockNavigate, filters);
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should navigate with multiple filters', () => {
      const mockNavigate = vi.fn();
      const filters = {
        query: 'plumber',
        location: 'New York',
        categories: ['Plumbing'],
      };
      navigateToSearch(mockNavigate, filters);
      expect(mockNavigate).toHaveBeenCalled();
      const callArg = mockNavigate.mock.calls[0][0];
      expect(callArg).toContain('search');
    });

    it('should navigate with price range filters', () => {
      const mockNavigate = vi.fn();
      const filters = {
        priceMin: 100,
        priceMax: 500,
      };
      navigateToSearch(mockNavigate, filters);
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should handle empty filters', () => {
      const mockNavigate = vi.fn();
      navigateToSearch(mockNavigate, {});
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });
});

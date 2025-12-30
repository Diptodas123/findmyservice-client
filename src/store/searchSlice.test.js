import { describe, it, expect } from 'vitest';
import searchReducer, {
  setSearchQuery,
  setLocation,
  setCategories,
  toggleCategory,
  setPriceRange,
  setRatings,
  clearFilters,
} from './searchSlice';

describe('searchSlice', () => {
  it('should return the initial state', () => {
    const state = searchReducer(undefined, { type: 'unknown' });
    expect(state.filters).toBeDefined();
    expect(state.filters.query).toBe('');
    expect(state.services).toEqual([]);
  });

  it('should handle setSearchQuery', () => {
    const actual = searchReducer(undefined, setSearchQuery('plumber'));
    expect(actual.filters.query).toBe('plumber');
  });

  it('should handle setLocation', () => {
    const actual = searchReducer(undefined, setLocation('New York'));
    expect(actual.filters.location).toBe('New York');
  });

  it('should handle setCategories', () => {
    const actual = searchReducer(undefined, setCategories(['Plumbing']));
    expect(actual.filters.categories).toEqual(['Plumbing']);
  });

  it('should handle toggleCategory', () => {
    const actual = searchReducer(undefined, toggleCategory('Plumbing'));
    expect(actual.filters.categories).toContain('Plumbing');
  });

  it('should handle setPriceRange', () => {
    const actual = searchReducer(undefined, setPriceRange({ min: 100, max: 500 }));
    expect(actual.filters.priceMin).toBe(100);
    expect(actual.filters.priceMax).toBe(500);
  });

  it('should handle setRatings', () => {
    const actual = searchReducer(undefined, setRatings([4, 5]));
    expect(actual.filters.ratings).toEqual([4, 5]);
  });

  it('should handle clearFilters', () => {
    const state = {
      filters: {
        query: 'plumber',
        location: 'New York',
        categories: ['Plumbing'],
        priceMin: 100,
        priceMax: 500,
        ratings: [4],
        sortBy: 'price-low',
      },
      services: [],
      loading: false,
      error: null,
    };
    const actual = searchReducer(state, clearFilters());
    expect(actual.filters.query).toBe('');
    expect(actual.filters.categories).toEqual([]);
  });
});

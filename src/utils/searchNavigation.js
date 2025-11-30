import store from '../store/store';
import { setFilters } from '../store/searchSlice';

/**
 * Navigate to search page with filters applied
 * Can be called from anywhere in the app (e.g., clicking a service card on home page)
 * 
 * @param {object} navigate - React Router navigate function
 * @param {object} filters - Filter options to apply
 * @param {string} filters.query - Search query text
 * @param {string} filters.location - Location filter
 * @param {string[]} filters.categories - Array of category names
 * @param {number} filters.priceMin - Minimum price
 * @param {number} filters.priceMax - Maximum price
 * @param {number[]} filters.ratings - Array of rating values
 * 
 * @example
 * // From a service card click - search for similar services
 * navigateToSearch(navigate, {
 *   categories: ['Plumbing'],
 *   location: 'Mumbai'
 * });
 * 
 * @example
 * // From a category click on home page
 * navigateToSearch(navigate, {
 *   query: 'electrician',
 *   priceMax: 5000
 * });
 */
export const navigateToSearch = (navigate, filters = {}) => {
  // Update Redux store with filters
  store.dispatch(setFilters(filters));

  // Build URL with query params
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.location) params.set('location', filters.location);
  if (filters.categories?.length > 0) params.set('categories', filters.categories.join(','));
  if (filters.priceMin !== undefined && filters.priceMin > 0) params.set('priceMin', filters.priceMin.toString());
  if (filters.priceMax !== undefined && filters.priceMax < 10000) params.set('priceMax', filters.priceMax.toString());
  if (filters.ratings?.length > 0) params.set('ratings', filters.ratings.join(','));

  // Navigate to search page with params
  const queryString = params.toString();
  navigate(queryString ? `/search?${queryString}` : '/search');
};

/**
 * Navigate to search for a specific category
 * @param {object} navigate - React Router navigate function
 * @param {string} category - Category name to search for
 */
export const searchByCategory = (navigate, category) => {
  navigateToSearch(navigate, { categories: [category] });
};

/**
 * Navigate to search for a specific location
 * @param {object} navigate - React Router navigate function
 * @param {string} location - Location to search in
 */
export const searchByLocation = (navigate, location) => {
  navigateToSearch(navigate, { location });
};

/**
 * Navigate to search for similar services based on a service object
 * @param {object} navigate - React Router navigate function
 * @param {object} service - Service object to find similar items for
 */
export const searchSimilarServices = (navigate, service) => {
  const category = service.serviceName?.split(' ')[0];
  navigateToSearch(navigate, {
    categories: category ? [category] : [],
    location: service.location,
    priceMax: service.cost ? Number(service.cost) * 1.5 : undefined, // Up to 50% more expensive
  });
};

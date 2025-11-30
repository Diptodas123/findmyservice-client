import { useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar.jsx';
import ServiceCard from '../../components/ServiceCard/ServiceCard.jsx';
import { useThemeMode } from '../../theme/useThemeMode';
// import apiClient from '../../utils/apiClient';
// import { API_BASE_URL } from '../../config/config';
import { MOCK_SEARCH_SERVICES } from '../../../mockData.js';
import {
  setSearchQuery,
  setLocation,
  toggleCategory,
  setPriceRange,
  toggleRating,
  setSortBy,
  clearFilters,
  setServices,
  setLoading,
  setError,
} from '../../store/searchSlice';

export default function Search() {
  const { mode } = useThemeMode();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get state from Redux
  const { filters, services, loading, error } = useSelector((state) => state.search);
  const { query, location, categories: selectedCategories, priceMin, priceMax, ratings: selectedRatings, sortBy } = filters;

  // Fetch all services from backend
  useEffect(() => {
    // COMMENTED OUT - Using mock data instead of API call
    // const fetchServices = async () => {
    //   try {
    //     dispatch(setLoading(true));
    //     dispatch(setError(null));
    //     const data = await apiClient.get('/api/v1/services', { baseURL: API_BASE_URL });
    //     dispatch(setServices(data || []));
    //   } catch (err) {
    //     console.error('Error fetching services:', err);
    //     dispatch(setError('Failed to load services. Please try again later.'));
    //   }
    // };
    // fetchServices();

    // Using mock data for development
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setServices(MOCK_SEARCH_SERVICES || []));
    }, 500); // Simulate network delay
  }, [dispatch]);

  // Sync URL params with Redux state on mount
  useEffect(() => {
    const queryParam = searchParams.get('q') || '';
    const locationParam = searchParams.get('location') || '';
    const categoriesParam = searchParams.get('categories') || '';
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    const ratingsParam = searchParams.get('ratings') || '';

    if (queryParam) dispatch(setSearchQuery(queryParam));
    if (locationParam) dispatch(setLocation(locationParam));
    if (categoriesParam) {
      const cats = categoriesParam.split(',').filter(Boolean);
      for (const cat of cats) {
        dispatch(toggleCategory(cat));
      }
    }
    if (priceMinParam || priceMaxParam) {
      dispatch(setPriceRange({
        min: priceMinParam ? Number(priceMinParam) : 0,
        max: priceMaxParam ? Number(priceMaxParam) : 10000,
      }));
    }
    if (ratingsParam) {
      const rats = ratingsParam.split(',').filter(Boolean).map(Number);
      for (const rat of rats) {
        dispatch(toggleRating(rat));
      }
    }
  }, []); // Only run on mount

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (priceMin > 0) params.set('priceMin', priceMin.toString());
    if (priceMax < 10000) params.set('priceMax', priceMax.toString());
    if (selectedRatings.length > 0) params.set('ratings', selectedRatings.join(','));

    setSearchParams(params, { replace: true });
  }, [query, location, selectedCategories, priceMin, priceMax, selectedRatings, setSearchParams]);

  // Extract unique locations and categories from services
  const locationOptions = Array.from(new Set(services.map(s => s.location).filter(Boolean)));
  const categories = Array.from(new Set(services.map(s => s.serviceName?.split(' ')[0]).filter(Boolean)));

  // Rating options
  const ratingOptions = [5, 4, 3, 2, 1];

  // Filter logic
  const filteredServices = services.filter(service => {
    // Search query filter
    const matchesQuery = query === '' || 
      service.serviceName?.toLowerCase().includes(query.toLowerCase()) ||
      service.description?.toLowerCase().includes(query.toLowerCase());

    // Category filter
    const serviceCategory = service.serviceName?.split(' ')[0];
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(serviceCategory);

    // Price filter
    const servicePrice = Number(service.cost) || 0;
    const matchesPrice = servicePrice >= priceMin && servicePrice <= priceMax;

    // Rating filter
    const serviceRating = Math.floor(Number(service.avgRating) || 0);
    const matchesRating = selectedRatings.length === 0 || selectedRatings.some(rating => serviceRating >= rating);

    // Location filter
    const matchesLocation = location === '' || service.location === location;

    // Active services only
    const isActive = service.active !== false;

    return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesLocation && isActive;
  });

  // Sort logic
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (Number(a.cost) || 0) - (Number(b.cost) || 0);
      case 'price-high':
        return (Number(b.cost) || 0) - (Number(a.cost) || 0);
      case 'rating-high':
        return (Number(b.avgRating) || 0) - (Number(a.avgRating) || 0);
      case 'rating-low':
        return (Number(a.avgRating) || 0) - (Number(b.avgRating) || 0);
      case 'name-asc':
        return (a.serviceName || '').localeCompare(b.serviceName || '');
      case 'name-desc':
        return (b.serviceName || '').localeCompare(a.serviceName || '');
      case 'relevance':
      default:
        return 0; // Keep original order
    }
  });

  // Handlers
  const handleCategoryChange = (cat) => {
    dispatch(toggleCategory(cat));
  };

  const handleRatingChange = (rate) => {
    dispatch(toggleRating(rate));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSetQuery = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleSetLocation = (value) => {
    dispatch(setLocation(value));
  };

  const handleSetPriceMin = (value) => {
    dispatch(setPriceRange({ min: value, max: priceMax }));
  };

  const handleSetPriceMax = (value) => {
    dispatch(setPriceRange({ min: priceMin, max: value }));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4, pt: 3 }}>
      <Paper sx={{ 
        p: 0, 
        width: '100%', 
        minWidth: { xs: '100%', md: 1300 }, 
        maxWidth: 1650, 
        boxSizing: 'border-box', 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        minHeight: '80vh',
        background: mode === 'dark' ? '#1a1a1a' : '#fff'
      }}>
        {/* Fixed Sidebar */}
        <Box sx={{
          width: { xs: '100%', md: 270 },
          minWidth: { xs: '100%', md: 270 },
          maxWidth: { xs: '100%', md: 270 },
          position: { xs: 'relative', md: 'sticky' },
          left: 0,
          top: 0,
          height: { xs: 'auto', md: '100vh' },
          zIndex: 2,
          background: mode === 'dark' ? '#212121' : '#fff',
          color: mode === 'dark' ? '#fff' : 'inherit',
          p: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
        }}>
          <FilterSidebar
            query={query}
            setQuery={handleSetQuery}
            location={location}
            setLocation={handleSetLocation}
            locationOptions={locationOptions}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            priceMin={priceMin}
            setPriceMin={handleSetPriceMin}
            priceMax={priceMax}
            setPriceMax={handleSetPriceMax}
            ratingOptions={ratingOptions}
            selectedRatings={selectedRatings}
            handleRatingChange={handleRatingChange}
            handleClearFilters={handleClearFilters}
          />
        </Box>

        {/* Vertical Divider */}
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          width: '1px', 
          minWidth: '1px', 
          maxWidth: '1px', 
          background: mode === 'dark' ? '#333' : '#e0e0e0', 
          alignSelf: 'stretch' 
        }} />

        {/* Results Section */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Search Services
            </Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => dispatch(setSortBy(e.target.value))}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating-high">Rating: High to Low</MenuItem>
                <MenuItem value="rating-low">Rating: Low to High</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''} found
              </Typography>

              <Grid container spacing={3}>
                {sortedServices.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      background: mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" gutterBottom>
                        No services found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your filters or search query
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  sortedServices.map(service => (
                    <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
                      <ServiceCard
                        serviceId={service.serviceId}
                        name={service.serviceName}
                        description={service.description}
                        image={service.imageUrl}
                        provider={service.providerId?.providerName}
                        price={service.cost}
                        rating={service.avgRating}
                        location={service.location}
                        availability={service.availability}
                        providerId={service.providerId?.providerId}
                        fullService={service}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

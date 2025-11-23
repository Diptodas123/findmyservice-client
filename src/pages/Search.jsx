import { useState } from 'react';
import { Box, TextField, Typography, Paper, Grid, Checkbox, FormControlLabel, FormGroup, Button } from '@mui/material';
import FilterSidebar from '../components/FilterSidebar.jsx';
import { useThemeMode } from '../theme/useThemeMode';
import ServiceCard from '../components/ServiceCard.jsx';

// Dummy data for demonstration
const services = [
  {
    id: 1,
    name: 'Plumbing Service',
    description: 'Expert plumbing for your home.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    provider: 'John Doe',
    location: 'Mumbai',
    price: '$50/hr',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Electrician Service',
    description: 'Certified electricians for repairs.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    provider: 'Jane Smith',
    location: 'Delhi',
    price: '$60/hr',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Home Cleaning',
    description: 'Professional cleaning services.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    provider: 'CleanCo',
    location: 'Bangalore',
    price: '$30/hr',
    rating: 4.3
  },
  {
    id: 4,
    name: 'Gardening',
    description: 'Garden maintenance and landscaping.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    provider: 'GreenThumb',
    location: 'Kolkata',
    price: '$40/hr',
    rating: 4.6
  },
  {
    id: 5,
    name: 'Car Repair',
    description: 'Reliable car repair and maintenance.',
    image: 'https://www.autotrainingcentre.com/wp-content/uploads/2015/09/Top-5-Most-Common-Repairs-Youll-Encounter-in-an-Auto-Repair-Career.jpg?auto=format&fit=crop&w=400&q=80',
    provider: 'AutoFix',
    location: 'Chennai',
    price: '$70/hr',
    rating: 4.8
  },
];

export default function Search() {
    const { mode } = useThemeMode();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);

  // Extract unique categories from services
    // Extract unique locations from location field
    const locationOptions = Array.from(new Set(services.map(s => s.location)));
  const categories = Array.from(new Set(services.map(s => s.name.split(' ')[0])));

  // Helper to parse price string
  const parsePrice = (priceStr) => {
    const match = priceStr.match(/\$(\d+)/);
    return match ? Number.parseInt(match[1], 10) : 0;
  };

  // Star ratings for filter (5 to 1)
  const ratingOptions = [5, 4, 3, 2, 1];

  // Filter logic
  const filteredServices = services.filter(service => {
    const matchesQuery = service.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 ? true : selectedCategories.includes(service.name.split(' ')[0]);
    const servicePrice = parsePrice(service.price);
    const min = priceMin === '' ? 0 : Number(priceMin);
    const max = priceMax === '' ? 1000 : Number(priceMax);
    const matchesPrice = servicePrice >= min && servicePrice <= max;
    const matchesRating = selectedRatings.length === 0 ? true : selectedRatings.includes(Math.floor(service.rating));
    const matchesLocation = location === '' ? true : service.location === location;
    return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesLocation;
  });

  // Handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const handleRatingChange = (rate) => {
    setSelectedRatings(prev => prev.includes(rate) ? prev.filter(r => r !== rate) : [...prev, rate]);
  };
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    setSelectedRatings([]);
    setQuery('');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper sx={{ p: 0, width: '100%', minWidth: 1300, maxWidth: 1650, boxSizing: 'border-box', display: 'flex', flexDirection: 'row', height: '100%', minHeight: '80vh' }}>
        {/* Fixed Sidebar */}
        <Box sx={{
          width: 270,
          minWidth: 270,
          maxWidth: 270,
          position: 'sticky',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 2,
          background: mode === 'dark' ? '#212121' : '#fff',
          color: mode === 'dark' ? '#fff' : 'inherit',
          p: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
        }}>
          <FilterSidebar
            query={query}
            setQuery={setQuery}
            location={location}
            setLocation={setLocation}
            locationOptions={locationOptions}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            ratingOptions={ratingOptions}
            selectedRatings={selectedRatings}
            handleRatingChange={handleRatingChange}
            handleClearFilters={handleClearFilters}
          />
        </Box>
        {/* Vertical Divider */}
        <Box sx={{ width: '1px', minWidth: '1px', maxWidth: '1px', background: '#e0e0e0', height: '100vh', alignSelf: 'stretch' }} />
        {/* Results beside sidebar */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
          <Typography variant="h5" gutterBottom>Search Services</Typography>
          <Grid container spacing={2}>
            {filteredServices.length === 0 ? (
              <Grid item xs={12}>
                <Typography>No services found.</Typography>
              </Grid>
            ) : (
              filteredServices.map(service => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <ServiceCard
                    name={service.name}
                    description={service.description}
                    image={service.image}
                    provider={service.provider}
                    price={service.price}
                    rating={service.rating}
                    location={service.location}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

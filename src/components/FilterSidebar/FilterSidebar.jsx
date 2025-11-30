import { 
  Box, 
  TextField, 
  Typography, 
  FormControlLabel, 
  FormGroup, 
  Checkbox, 
  Button,
  Slider,
  Select,
  MenuItem,
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Link 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react';
import { useThemeMode } from '../../theme/useThemeMode';

export default function FilterSidebar({
  query, setQuery,
  location, setLocation, locationOptions,
  categories, selectedCategories, handleCategoryChange,
  priceMin, setPriceMin, priceMax, setPriceMax,
  ratingOptions, selectedRatings, handleRatingChange,
  handleClearFilters
}) {
  const { mode } = useThemeMode();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  const [sliderValue, setSliderValue] = useState([Number(priceMin) || 0, Number(priceMax) || 10000]);

  useEffect(() => {
    setSliderValue([Number(priceMin) || 0, Number(priceMax) || 10000]);
  }, [priceMin, priceMax]);

  const handleSliderChange = (e, value) => {
    setSliderValue(value);
    setPriceMin(value[0]);
    setPriceMax(value[1]);
  };

  const handleMinInputChange = (e) => {
    const val = Number(e.target.value);
    setPriceMin(val);
    setSliderValue([val, sliderValue[1]]);
  };

  const handleMaxInputChange = (e) => {
    const val = Number(e.target.value);
    setPriceMax(val);
    setSliderValue([sliderValue[0], val]);
  };

  return (
    <Box sx={{
      borderRight: mode === 'dark' ? { md: '1px solid #333' } : undefined,
      pr: { md: 2 },
      mb: { xs: 2, md: 0 },
      fontSize: '0.85rem',
      background: mode === 'dark' ? '#212121' : undefined,
      color: mode === 'dark' ? '#fff' : undefined,
      borderRadius: mode === 'dark' ? 2 : undefined,
      boxShadow: mode === 'dark' ? 3 : undefined,
      p: 2,
      height: '100vh',
      overflowY: 'auto',
      position: 'sticky',
      top: 0
    }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 2, fontSize: '0.85rem', background: mode === 'dark' ? '#333' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}
        InputProps={{ style: { fontSize: '0.85rem', color: mode === 'dark' ? '#fff' : undefined } }}
        InputLabelProps={{ style: { fontSize: '0.85rem', color: mode === 'dark' ? '#fff' : undefined } }}
      />
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', mb: 0.5, color: mode === 'dark' ? '#fff' : undefined }}>Location</Typography>
        <Select
          displayEmpty
          fullWidth
          value={location}
          onChange={e => setLocation(e.target.value)}
          sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#333' : undefined, borderRadius: mode === 'dark' ? 1 : undefined, color: mode === 'dark' ? '#fff' : undefined }}
        >
          <MenuItem value=""><em>All Locations</em></MenuItem>
          {locationOptions && locationOptions.map(loc => (
            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
          ))}
        </Select>
      </Box>
      <Accordion defaultExpanded sx={{ fontSize: '0.85rem', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: mode === 'dark' ? '#fff' : undefined }} />} sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#333' : undefined, color: mode === 'dark' ? '#fff' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}>
          <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', color: mode === 'dark' ? '#fff' : undefined }}>Category</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#232323' : undefined, color: mode === 'dark' ? '#fff' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}>
          <FormGroup>
            {visibleCategories.map(cat => (
              <FormControlLabel
                key={cat}
                control={<Checkbox checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} sx={{ p: 0.5, color: mode === 'dark' ? '#fff' : undefined }} />}
                label={<span style={{ fontSize: '0.85rem', color: mode === 'dark' ? '#fff' : undefined }}>{cat}</span>}
                sx={{ fontSize: '0.85rem', mb: 0.5, color: mode === 'dark' ? '#fff' : undefined }}
              />
            ))}
          </FormGroup>
          {categories.length > 5 && !showAllCategories && (
            <Link component="button" variant="body2" onClick={() => setShowAllCategories(true)} sx={{ mt: 1, fontSize: '0.85rem' }}>
              More
            </Link>
          )}
          {categories.length > 5 && showAllCategories && (
            <Link component="button" variant="body2" onClick={() => setShowAllCategories(false)} sx={{ mt: 1, fontSize: '0.85rem' }}>
              Show Less
            </Link>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded sx={{ fontSize: '0.85rem', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: mode === 'dark' ? '#fff' : undefined }} />} sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#333' : undefined, color: mode === 'dark' ? '#fff' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}>
          <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', color: mode === 'dark' ? '#fff' : undefined }}>Price</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#232323' : undefined, color: mode === 'dark' ? '#fff' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Min"
                type="number"
                size="small"
                value={sliderValue[0]}
                onChange={handleMinInputChange}
                inputProps={{ min: 0, max: 10000 }}
                sx={{ fontSize: '0.75rem', minWidth: 70, maxWidth: 80, width: 80, background: mode === 'dark' ? '#333' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}
                InputProps={{ style: { fontSize: '0.75rem', padding: 2, color: mode === 'dark' ? '#fff' : undefined } }}
                InputLabelProps={{ style: { fontSize: '0.75rem', color: mode === 'dark' ? '#fff' : undefined } }}
              />
              <TextField
                label="Max"
                type="number"
                size="small"
                value={sliderValue[1]}
                onChange={handleMaxInputChange}
                inputProps={{ min: 0, max: 10000 }}
                sx={{ fontSize: '0.75rem', minWidth: 70, maxWidth: 80, width: 80, background: mode === 'dark' ? '#333' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}
                InputProps={{ style: { fontSize: '0.75rem', padding: 2, color: mode === 'dark' ? '#fff' : undefined } }}
                InputLabelProps={{ style: { fontSize: '0.75rem', color: mode === 'dark' ? '#fff' : undefined } }}
              />
            </Box>
            <Slider
              value={sliderValue}
              min={0}
              max={10000}
              step={10}
              onChange={handleSliderChange}
              sx={{ mt: 1, color: mode === 'dark' ? '#90caf9' : undefined }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded sx={{ fontSize: '0.85rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: mode === 'dark' ? '#fff' : undefined }} />} sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#333' : undefined, color: mode === 'dark' ? '#fff' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}>
          <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', color: mode === 'dark' ? '#fff' : undefined }}>Rating</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ fontSize: '0.85rem', background: mode === 'dark' ? '#232323' : undefined, color: mode === 'dark' ? '#fff' : undefined, borderRadius: mode === 'dark' ? 1 : undefined }}>
          <FormGroup>
            {ratingOptions.map(rate => (
              <FormControlLabel
                key={rate}
                control={<Checkbox checked={selectedRatings.includes(rate)} onChange={() => handleRatingChange(rate)} sx={{ p: 0.5, color: mode === 'dark' ? '#fff' : undefined }} />}
                label={<span style={{ fontSize: '0.85rem', color: mode === 'dark' ? '#fff' : undefined }}>{`${rate}★ & above`}</span>}
                sx={{ fontSize: '0.85rem', mb: 0.5, color: mode === 'dark' ? '#fff' : undefined }}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleClearFilters} sx={{ fontSize: '0.85rem', py: 0.5, flex: 1, borderColor: mode === 'dark' ? '#90caf9' : undefined, color: mode === 'dark' ? '#90caf9' : undefined }}>Clear</Button>
      </Box>
    </Box>
  );
}

import { useState, useMemo, useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  CardHeader,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  Chip,
  Rating,
  InputAdornment,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Select,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoCamera,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import cloudinary from '../../utils/cloudinary';
import { MOCK_PROVIDER } from '../../../mockData';

const ServicesList = ({ provider }) => {
  const initialServices = useMemo(() => (provider?.services || MOCK_PROVIDER.services || []), [provider]);
  const [services, setServices] = useState(initialServices);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    cost: '', 
    location: '', 
    imageUrl: '', 
    availability: 'AVAILABLE', 
    warrantyPeriodMonths: '', 
    active: true 
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [query, setQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuServiceId, setMenuServiceId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuServiceId(null);
  };

  const handleMenuEdit = () => {
    const serviceToEdit = services.find(s => s.id === menuServiceId);
    if (serviceToEdit) {
      setEditMode(true);
      setEditingServiceId(menuServiceId);
      setForm({
        name: serviceToEdit.name || '',
        description: serviceToEdit.description || '',
        cost: serviceToEdit.cost || '',
        location: serviceToEdit.location || '',
        imageUrl: serviceToEdit.imageUrl || '',
        availability: serviceToEdit.availability || 'AVAILABLE',
        warrantyPeriodMonths: serviceToEdit.warrantyPeriodMonths || '',
        active: serviceToEdit.active !== undefined ? serviceToEdit.active : true
      });
      setOpen(true);
    }
    handleCloseMenu();
  };

  const handleMenuDelete = () => {
    const service = services.find(s => s.id === menuServiceId);
    if (service) {
      setServiceToDelete(service);
      setDeleteDialogOpen(true);
    }
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      try {
        // Delete service via API
        // await apiClient.del(`/api/v1/services/${serviceToDelete.id}`);
        
        // For now, delete locally (uncomment above when backend is connected)
        setServices(s => s.filter(x => x.id !== serviceToDelete.id));
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleOpen = () => {
    setEditMode(false);
    setEditingServiceId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditingServiceId(null);
    setForm({ 
      name: '', 
      description: '', 
      cost: '', 
      location: '', 
      imageUrl: '', 
      availability: 'AVAILABLE', 
      warrantyPeriodMonths: '', 
      active: true 
    });
  };

  const handleSave = async () => {
    // Prepare service data according to backend API structure
    const serviceData = {
      providerId: {
        providerId: provider?.providerId || MOCK_PROVIDER.providerId
      },
      serviceName: form.name,
      description: form.description,
      cost: parseFloat(form.cost) || 0,
      location: form.location,
      availability: form.availability || 'AVAILABLE',
      warrantyPeriodMonths: form.warrantyPeriodMonths ? parseInt(form.warrantyPeriodMonths) : null,
      imageUrl: form.imageUrl || '',
      active: form.active
    };

    try {
      if (editMode && editingServiceId) {
        // Update existing service via API
        // const response = await apiClient.put(`/api/v1/services/${editingServiceId}`, serviceData);
        
        // For now, update locally (uncomment above when backend is connected)
        setServices((s) =>
          s.map((service) =>
            service.id === editingServiceId
              ? {
                  ...service,
                  name: form.name,
                  description: form.description,
                  cost: parseFloat(form.cost) || 0,
                  location: form.location,
                  imageUrl: form.imageUrl || service.imageUrl,
                  updatedAt: new Date().toISOString()
                }
              : service
          )
        );
      } else {
        // Create new service via API
        // const response = await apiClient.post('/api/v1/services', serviceData);
        
        // For now, create locally (uncomment above when backend is connected)
        const newService = {
          id: `s-${Date.now()}`,
          providerId: provider?.providerId || MOCK_PROVIDER.providerId,
          name: form.name,
          description: form.description,
          cost: parseFloat(form.cost) || 0,
          location: form.location,
          imageUrl: form.imageUrl || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          active: true,
          avgRating: 0,
          totalRatings: 0
        };
        setServices((s) => [newService, ...s]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5">Services</Typography>
        <TextField
          size="small"
          placeholder="Search services"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
          sx={{ width: { xs: '100%', sm: 320 } }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 2, mt: 1 }}>
        {services
          .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
          .map((svc) => (
            <Box key={svc.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardActionArea sx={{ textAlign: 'left' }}>
                  <Box sx={{ position: 'relative' }}>
                    {svc.imageUrl ? (
                      <CardMedia component="img" height="120" image={svc.imageUrl} alt={svc.name} />
                    ) : (
                      <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                        <Typography color="text.secondary">No image</Typography>
                      </Box>
                    )}

                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: 1,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)',
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`${svc.location}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'common.white', borderRadius: 1 }} />
                      </Box>
                      <Chip label={`₹${svc.cost}`} size="small" sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 700 }} />
                    </Box>
                  </Box>
                </CardActionArea>

                <CardHeader
                  title={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{svc.name}</Typography>}
                  subheader={<Typography variant="caption" color="text.secondary">{svc.location}</Typography>}
                  sx={{ py: 0.5, pb: 0 }}
                />
                <CardContent sx={{ py: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{svc.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                        <Rating value={svc.avgRating || 0} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">{svc.totalRatings || 0} reviews</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Tooltip title="View details">
                        <IconButton aria-label={`view-${svc.id}`} size="small"><VisibilityIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Favorite">
                        <IconButton aria-label={`favorite-${svc.id}`} size="small"><FavoriteBorderIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">{svc.location}</Typography>
                  </Box>

                  <Box>
                    <Tooltip title="More actions">
                      <IconButton aria-label={`more-${svc.id}`} size="small" onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuServiceId(svc.id); }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          ))}
      </Box>

      <Fab color="primary" aria-label="add-service" sx={{ position: 'fixed', right: { xs: 16, md: 24 }, bottom: { xs: 16, md: 24 } }} onClick={handleOpen}>
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Service' : 'Create New Service'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField 
              label="Service Name" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              fullWidth 
              required
              helperText="Max 160 characters"
            />
            <TextField 
              label="Description" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              fullWidth 
              multiline 
              rows={3}
              helperText="Detailed description of the service"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="Cost" 
                value={form.cost} 
                onChange={(e) => setForm({ ...form, cost: e.target.value })} 
                fullWidth 
                required
                type="number"
                InputProps={{ startAdornment: (<InputAdornment position="start">₹</InputAdornment>) }}
                helperText="Must be greater than 0"
              />
              <TextField
                label="Warranty (Months)"
                value={form.warrantyPeriodMonths}
                onChange={(e) => setForm({ ...form, warrantyPeriodMonths: e.target.value })}
                fullWidth
                type="number"
                helperText="Optional warranty period"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="Location" 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                fullWidth
                helperText="Max 120 characters"
              />
              <TextField
                select
                label="Availability"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                fullWidth
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle2">Image</Typography>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  setUploading(true);
                  const res = await cloudinary.uploadImage(file);
                  const url = res?.secure_url || res?.url;
                  setForm(prev => ({ ...prev, imageUrl: url }));
                } catch (err) {
                  console.error('Upload failed', err);
                  alert('Upload failed');
                } finally {
                  setUploading(false);
                  if (fileRef.current) fileRef.current.value = null;
                }
              }} />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <Button aria-label="upload-image" variant="outlined" onClick={() => fileRef.current && fileRef.current.click()} startIcon={<PhotoCamera />}>{uploading ? 'Uploading...' : 'Upload Image'}</Button>
                {form.imageUrl && (
                  <Chip
                    label="Image added"
                    avatar={<Avatar src={form.imageUrl} />}
                    sx={{ cursor: 'default' }}
                  />
                )}
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
              }
              label="Active Status"
              sx={{ mt: 1 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>
                {editMode ? 'Save Changes' : 'Create'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleMenuEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete the service <strong>"{serviceToDelete?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ServicesList;

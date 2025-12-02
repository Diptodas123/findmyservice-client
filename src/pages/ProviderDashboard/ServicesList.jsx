import { useState, useRef, useEffect } from 'react';
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
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoCamera,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import cloudinary from '../../utils/cloudinary';
import { serviceAPI } from '../../utils/serviceAPI';
import apiClient from '../../utils/apiClient';
import formatINR from '../../utils/formatCurrency';

const ServicesList = ({ provider }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    active: true,
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [query, setQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuServiceId, setMenuServiceId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingService, setViewingService] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (provider?.providerId) {
          const res = await apiClient.get(`/api/v1/services/provider/${provider.providerId}`);
          const data = res?.data || res;

          const normalized = Array.isArray(data)
            ? data.map((d) => ({
              id: d.serviceId ?? d.id,
              name: d.serviceName ?? d.name,
              providerId:
                typeof d.providerId === 'object' ? (d.providerId?.providerId ?? d.providerId) : d.providerId,
              providerName: d.providerName ?? d.providerName ?? (d.provider?.name ?? undefined),
              cost: d.cost ?? d.price ?? 0,
              imageUrl: d.imageUrl ?? d.image_url ?? '',
              location: d.location ?? '',
              description: d.description ?? '',
              availability: d.availability ?? 'AVAILABLE',
              warrantyPeriodMonths: d.warrantyPeriodMonths ?? d.warranty_months ?? null,
              active: d.active !== undefined ? d.active : true,
              avgRating: d.avgRating ?? d.avg_rating ?? 0,
              totalRatings: d.totalRatings ?? d.total_ratings ?? 0,
              createdAt: d.createdAt ?? d.created_at,
              updatedAt: d.updatedAt ?? d.updated_at,
            }))
            : [];

          if (mounted) setServices(normalized);
        } else {
          if (mounted) setServices([]);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load services', err);
        if (mounted) setError('Failed to load services');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [provider]);

  const filteredServices = services.filter((s) => (s?.name ?? '').toLowerCase().includes(query?.toLowerCase()));

  const handleOpen = () => {
    setEditMode(false);
    setEditingServiceId(null);
    setForm({ name: '', description: '', cost: '', location: '', imageUrl: '', availability: 'AVAILABLE', warrantyPeriodMonths: '', active: true });
    setValidationErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditingServiceId(null);
    setValidationErrors({});
  };

  const handleMenuEdit = () => {
    const id = menuServiceId;
    const svc = services.find((x) => x.id === id);
    if (!svc) return;
    setEditMode(true);
    setEditingServiceId(id);
    setForm({
      name: svc.name || '',
      description: svc.description || '',
      cost: svc.cost ?? '',
      location: svc.location || '',
      imageUrl: svc.imageUrl || '',
      availability: svc.availability || 'AVAILABLE',
      warrantyPeriodMonths: svc.warrantyPeriodMonths ?? '',
      active: svc.active !== undefined ? svc.active : true,
    });
    setMenuAnchor(null);
    setOpen(true);
  };

  const handleMenuDelete = () => {
    const id = menuServiceId;
    const svc = services.find((x) => x.id === id);
    if (!svc) return;
    setServiceToDelete(svc);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setLoading(true);
    try {
      await serviceAPI.deleteService(serviceToDelete.id);
      setServices((s) => s.filter((x) => x.id !== serviceToDelete.id));
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      setError(null);
    } catch (err) {
      console.error('Failed to delete', err);
      setError('Failed to delete service');
      setServices((s) => s.filter((x) => x.id !== serviceToDelete.id));
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleView = (svc) => {
    const svcData = {
      id: svc.id ?? svc.serviceId,
      name: svc.name ?? svc.serviceName,
      providerId: svc.providerId ?? (svc.providerId?.providerId ?? undefined),
      providerName: svc.providerName ?? svc.providerName ?? undefined,
      cost: svc.cost ?? 0,
      imageUrl: svc.imageUrl ?? svc.image_url ?? '',
      location: svc.location ?? '',
      description: svc.description ?? '',
      availability: svc.availability ?? 'AVAILABLE',
      warrantyPeriodMonths: svc.warrantyPeriodMonths ?? svc.warranty_months ?? null,
      active: svc.active !== undefined ? svc.active : true,
      avgRating: svc.avgRating ?? svc.avg_rating ?? 0,
      totalRatings: svc.totalRatings ?? svc.total_ratings ?? 0,
      createdAt: svc.createdAt ?? svc.created_at,
      updatedAt: svc.updatedAt ?? svc.updated_at,
    };
    setViewingService(svcData);
    setViewDialogOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuServiceId(null);
  };

  const handleSave = async () => {
    const errors = {};
    
    if (!form.name || !form.name.trim()) {
      errors.name = 'Service name is required';
    } else if (form.name.length > 160) {
      errors.name = 'Service name must be 160 characters or less';
    }
    
    if (!form.description || !form.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!form.cost || form.cost <= 0) {
      errors.cost = 'Cost must be greater than 0';
    }
    
    if (!form.location || !form.location.trim()) {
      errors.location = 'Location is required';
    } else if (form.location.length > 120) {
      errors.location = 'Location must be 120 characters or less';
    }
    
    if (form.warrantyPeriodMonths && (form.warrantyPeriodMonths < 0 || !Number.isInteger(parseFloat(form.warrantyPeriodMonths)))) {
      errors.warrantyPeriodMonths = 'Warranty must be a valid positive number';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    
    // Build DTO matching backend Service DTO
    const serviceData = {
      providerId: provider?.providerId ?? null,
      providerName: provider?.name ?? provider?.providerName ?? null,
      serviceName: form.name,
      description: form.description,
      cost: form.cost ? parseFloat(form.cost) : null,
      location: form.location,
      availability: form.availability || 'AVAILABLE',
      warrantyPeriodMonths: form.warrantyPeriodMonths ? parseInt(form.warrantyPeriodMonths, 10) : null,
      imageUrl: form.imageUrl || '',
      active: form.active,
    };

    try {
      setLoading(true);
      if (editMode && editingServiceId) {
        const res = await serviceAPI.updateService(editingServiceId, serviceData);
        const updated = res?.data || res;
        const normalizedUpdated = {
          id: updated.serviceId ?? updated.id,
          name: updated.serviceName ?? updated.name,
          providerId: typeof updated.providerId === 'object' ? (updated.providerId?.providerId ?? updated.providerId) : updated.providerId,
          providerName: updated.providerName ?? updated.providerName ?? (updated.provider?.name ?? provider?.name),
          description: updated.description ?? form.description,
          cost: updated.cost ?? updated.price ?? (form.cost ? parseFloat(form.cost) : 0),
          location: updated.location ?? form.location,
          imageUrl: (updated.imageUrl ?? updated.image_url ?? form.imageUrl) || '',
          availability: (updated.availability ?? form.availability) || 'AVAILABLE',
          warrantyPeriodMonths: updated.warrantyPeriodMonths ?? updated.warranty_months ?? (form.warrantyPeriodMonths ? parseInt(form.warrantyPeriodMonths, 10) : null),
          active: updated.active !== undefined ? updated.active : form.active,
          avgRating: updated.avgRating ?? updated.avg_rating ?? 0,
          totalRatings: updated.totalRatings ?? updated.total_ratings ?? 0,
          createdAt: updated.createdAt ?? updated.created_at,
          updatedAt: updated.updatedAt ?? updated.updated_at,
        };
        setServices((s) => s.map((svc) => (svc.id === editingServiceId ? { ...svc, ...normalizedUpdated } : svc)));
      } else {
        const res = await serviceAPI.createService(serviceData);
        const created = res?.data || res;
        const respProviderId = created?.providerId?.providerId ?? created?.providerId ?? provider?.providerId;
        const newService = {
          id: created.serviceId || created.id || `s-${Date.now()}`,
          name: created.serviceName || form.name,
          providerId: respProviderId,
          providerName: created.providerName ?? provider?.name ?? null,
          description: created.description || form.description,
          cost: (created.cost ?? (form.cost ? parseFloat(form.cost) : null)) || 0,
          location: created.location || form.location,
          imageUrl: created.imageUrl || form.imageUrl || '',
          availability: created.availability || form.availability || 'AVAILABLE',
          warrantyPeriodMonths: created.warrantyPeriodMonths ?? created.warranty_months ?? (form.warrantyPeriodMonths ? parseInt(form.warrantyPeriodMonths, 10) : null),
          createdAt: created.createdAt || new Date().toISOString(),
          updatedAt: created.updatedAt || new Date().toISOString(),
          active: created.active !== undefined ? created.active : form.active,
          avgRating: created.avgRating ?? created.avg_rating ?? 0,
          totalRatings: created.totalRatings ?? created.total_ratings ?? 0,
        };
        setServices((s) => [newService, ...s]);
      }
      setError(null);
      handleClose();
    } catch (err) {
      console.error('Error saving service:', err);
      setError('Failed to save service.');
      alert('Failed to save service. Please try again.');
    } finally {
      setLoading(false);
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

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Loading services...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="error.main">{error}</Typography>
        </Box>
      ) : filteredServices.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, textAlign: 'center' }}>
          <Box sx={{ width: 160, height: 120 }}>
            <svg viewBox="0 0 64 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="No services">
              <rect x="2" y="18" width="60" height="28" rx="4" fill="#f3f4f6" />
              <circle cx="20" cy="10" r="8" fill="#e6eef7" />
              <rect x="36" y="6" width="18" height="8" rx="2" fill="#e6eef7" />
            </svg>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>No services found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>You don't have any services yet. Click the button below to add your first service.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 2, mt: 1 }}>
          {filteredServices.map((svc) => (
            <Box key={svc.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardActionArea sx={{ textAlign: 'left' }}>
                  <Box sx={{ position: 'relative' }}>
                    {svc.imageUrl ? (
                      <CardMedia component="img" height="120" image={svc.imageUrl} alt={svc.name} />
                    ) : (
                      <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                        <Typography color="text.secondary">No image</Typography>
                      </Box>
                    )}

                    <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)', color: 'common.white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`${svc.location}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'common.white', borderRadius: 1 }} />
                      </Box>
                      <Chip label={formatINR(svc.cost)} size="small" sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 700 }} />
                    </Box>
                  </Box>
                </CardActionArea>

                <CardHeader title={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{svc.name}</Typography>} subheader={<Typography variant="caption" color="text.secondary">{svc.location}</Typography>} sx={{ py: 0.5, pb: 0 }} />

                <CardContent sx={{ py: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{svc.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                        <Rating value={svc.avgRating || 0} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">{svc.totalRatings || 0}</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Tooltip title="View details">
                        <IconButton aria-label={`view-${svc.id}`} size="small" onClick={() => handleView(svc)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
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
      )}

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
              error={!!validationErrors.name}
              helperText={validationErrors.name || "Max 160 characters"} 
            />
            <TextField 
              label="Description" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              fullWidth 
              multiline 
              rows={3} 
              required
              error={!!validationErrors.description}
              helperText={validationErrors.description || "Detailed description of the service"} 
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="Cost" 
                value={form.cost} 
                onChange={(e) => setForm({ ...form, cost: e.target.value })} 
                fullWidth 
                required 
                type="number" 
                error={!!validationErrors.cost}
                InputProps={{ startAdornment: (<InputAdornment position="start">₹</InputAdornment>) }} 
                helperText={validationErrors.cost || "Must be greater than 0"} 
              />
              <TextField 
                label="Warranty (Months)" 
                value={form.warrantyPeriodMonths} 
                onChange={(e) => setForm({ ...form, warrantyPeriodMonths: e.target.value })} 
                fullWidth 
                type="number" 
                error={!!validationErrors.warrantyPeriodMonths}
                helperText={validationErrors.warrantyPeriodMonths || "Optional warranty period"} 
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="Location" 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                fullWidth 
                required
                error={!!validationErrors.location}
                helperText={validationErrors.location || "Max 120 characters"} 
              />
              <TextField select label="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} fullWidth>
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
                  setForm((prev) => ({ ...prev, imageUrl: url }));
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
                  <Chip label="Image added" avatar={<Avatar src={form.imageUrl} />} sx={{ cursor: 'default' }} />
                )}
              </Box>
            </Box>

            <FormControlLabel control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />} label="Active Status" sx={{ mt: 1 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleSave} disabled={editMode && uploading}>{editMode ? (uploading ? 'Uploading...' : 'Save Changes') : (uploading ? 'Uploading...' : 'Create')}</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Service Details</DialogTitle>
        <DialogContent>
          {viewingService ? (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {viewingService.imageUrl && <Box component="img" src={viewingService.imageUrl} alt={viewingService.name} sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 1 }} />}
              <Typography variant="h6">{viewingService.name}</Typography>
              <Typography variant="body2" color="text.secondary">{viewingService.description}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                <Typography variant="subtitle1">Price:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formatINR(viewingService.cost)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="body2">Location: <strong>{viewingService.location}</strong></Typography>
                <Typography variant="body2">Availability: <strong>{viewingService.availability}</strong></Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                <Typography variant="body2">Warranty: <strong>{viewingService.warrantyPeriodMonths ?? '—'}</strong></Typography>
                <Typography variant="body2">Active: <strong>{viewingService.active ? 'Yes' : 'No'}</strong></Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                <Rating value={Number(viewingService.avgRating) || 0} precision={0.5} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">{viewingService.totalRatings || 0} reviews</Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2">No service selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleMenuEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

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
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ServicesList;

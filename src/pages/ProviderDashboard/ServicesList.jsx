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
  TextField,
  IconButton,
  Fab,
  Chip,
  Rating,
  InputAdornment,
  Stack,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoCamera,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
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
  const [form, setForm] = useState({ name: '', description: '', cost: '', location: '', imageUrl: '' });
  const [attrs, setAttrs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [query, setQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuServiceId, setMenuServiceId] = useState(null);
  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuServiceId(null);
  };
  const handleMenuEdit = () => {
    // TODO: open edit dialog for menuServiceId
    console.log('edit', menuServiceId);
    handleCloseMenu();
  };
  const handleMenuDelete = () => {
    // TODO: confirm and delete service by menuServiceId
    setServices(s => s.filter(x => x.id !== menuServiceId));
    handleCloseMenu();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', description: '', cost: '', location: '', imageUrl: '' });
    setAttrs([]);
  };

  const handleAddAttr = () => setAttrs((a) => [...a, { id: Date.now(), name: '', value: '', type: 'string' }]);
  const handleAttrChange = (id, key, value) => setAttrs((a) => a.map(x => x.id === id ? { ...x, [key]: value } : x));
  const handleRemoveAttr = (id) => setAttrs((a) => a.filter(x => x.id !== id));

  const handleCreate = () => {
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
      totalRatings: 0,
      attributes: attrs.map(a => ({ attributeId: `attr-${a.id}`, serviceId: `s-${Date.now()}`, attributeName: a.name, attributeValue: a.value, valueType: a.type, createdAt: new Date().toISOString() }))
    };

    setServices((s) => [newService, ...s]);
    handleClose();
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
                      <Chip label={`$${svc.cost}`} size="small" sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 700 }} icon={<AttachMoneyIcon />} />
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
        <DialogTitle>Create New Service</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Service Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
            <TextField label="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoneyIcon /></InputAdornment>) }} />
            <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} fullWidth />

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

            <Box>
              <Typography variant="subtitle2">Attributes</Typography>
              {attrs.map(a => (
                <Box key={a.id} sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                  <TextField placeholder="Name" value={a.name} onChange={(e) => handleAttrChange(a.id, 'name', e.target.value)} sx={{ flex: 1 }} />
                  <TextField placeholder="Value" value={a.value} onChange={(e) => handleAttrChange(a.id, 'value', e.target.value)} sx={{ flex: 1 }} />
                  <TextField placeholder="Type" value={a.type} onChange={(e) => handleAttrChange(a.id, 'type', e.target.value)} sx={{ width: 120 }} />
                  <IconButton onClick={() => handleRemoveAttr(a.id)} size="small">✕</IconButton>
                </Box>
              ))}
              <Button onClick={handleAddAttr} size="small" sx={{ mt: 1 }}>Add attribute</Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleCreate}>Create</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleMenuEdit}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={handleMenuDelete}><DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete</MenuItem>
      </Menu>
    </Paper>
  );
};

export default ServicesList;

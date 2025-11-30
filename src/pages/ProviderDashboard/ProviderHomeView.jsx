import { useState, useRef, useCallback, useMemo, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, Paper, Button, Grid, Avatar, Stack, Dialog, DialogTitle, DialogContent, TextField, CircularProgress, IconButton, Rating } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { MOCK_PROVIDER } from '../../../mockData';
import cloudinary from '../../utils/cloudinary';
import apiClient from '../../utils/apiClient';
import toastMessage from '../../utils/toastMessage';
import { updateProvider } from '../../store/providerSlice';

const PhotoThumbnail = memo(function PhotoThumbnail({ src, onClick, onRemove, width = 120, height = 80 }) {
  return (
    <Box sx={{ position: 'relative', mr: 1 }}>
      <Box component="img"
        src={src} alt="thumb"
        sx={{
          width,
          height,
          objectFit: 'cover',
          borderRadius: 1,
          cursor: 'pointer'
        }}
        onClick={onClick}
      />
      {onRemove && (
        <IconButton size="small" onClick={onRemove} sx={{
          position: 'absolute',
          top: 2,
          right: 2,
          bgcolor: 'rgba(0,0,0,0.4)', color: 'white'
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
});


const ProviderHomeView = ({ provider: providerProp, setProvider: setProviderProp, hideHero = false }) => {
  const dispatch = useDispatch();
  const initial = providerProp ? { ...providerProp } : { ...MOCK_PROVIDER };
  const [p, setPLocal] = useState(initial);
  const setP = setProviderProp || setPLocal;
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingDialog, setUploadingDialog] = useState(false);
  const fileRefDialog = useRef(null);
  const heroImage = (providerProp ? providerProp.imageUrls?.[0] : p.imageUrls?.[0]) || '/banner.jpg';

  const safeImageUrls = useMemo(() => p.imageUrls || [], [p.imageUrls]);

  const handleSetProfile = useCallback((url) => {
    setP(prev => ({ ...prev, profilePictureUrl: url }));
  }, [setP]);

  const handleDialogUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingDialog(true);
      const res = await cloudinary.uploadImage(file);
      const url = res?.secure_url || res?.url;
      if (!url) throw new Error('Upload did not return a URL');
      setForm(prev => ({ ...prev, imageUrls: [url, ...(prev.imageUrls || [])] }));
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + (err.message || err));
    } finally {
      setUploadingDialog(false);
      if (fileRefDialog.current) fileRefDialog.current.value = null;
    }
  }, [fileRefDialog]);

  const handleRemoveFromForm = useCallback((index) => {
    setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  }, []);

  const handleSetFormProfile = useCallback((url) => {
    setForm(prev => ({ ...prev, profilePictureUrl: url }));
  }, []);

  return (
    <Box>
      {!hideHero && (
        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'visible' }}>
          <Box component="img" src={heroImage}
            alt="banner" sx={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              filter: 'brightness(0.85)'
            }}
          />
          <Avatar src={p.profilePictureUrl}
            alt={p.providerName}
            sx={{
              width: 120,
              height: 120,
              position: 'absolute',
              left: 24,
              bottom: 24,
              border: '4px solid',
              borderColor: 'background.paper',
              zIndex: 2,
              boxShadow: 6
            }}
          />
        </Box>
      )}

      <Paper sx={{ mt: 8, p: { xs: 2, md: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{p.providerName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{p.description}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
              <Rating name="read-only" value={Number(p.avgRating) || 0} precision={0.5} readOnly size="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>{Number(p.avgRating).toFixed(1)} · {p.totalRatings} ratings</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <Button variant="contained" onClick={() => { setForm(p); setOpenEdit(true); }}>Edit Profile</Button>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, borderLeft: '6px solid', borderColor: 'primary.main', pl: 2 }}>
                <Typography variant="subtitle2">Contact</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">{p.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">{p.phone}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{p.addressLine1}{p.addressLine2 ? `, ${p.addressLine2}` : ''}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{p.city}, {p.state} {p.zipCode}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Photos</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto', alignItems: 'center' }}>
            {safeImageUrls.map((u, idx) => (
              <Box key={u || idx} sx={{ position: 'relative' }}>
                <PhotoThumbnail src={u} onClick={() => handleSetProfile(u)} width={220} height={130} />
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="subtitle2">Photos</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {(form.imageUrls || []).map((u, i) => (
                  <Box key={u || i} sx={{ position: 'relative' }}>
                    <PhotoThumbnail src={u} onClick={() => handleSetFormProfile(u)} width={120} height={80} />
                    <IconButton size="small" onClick={() => handleRemoveFromForm(i)} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.4)', color: 'white' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <input ref={fileRefDialog} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleDialogUpload} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant="outlined" onClick={() => fileRefDialog.current && fileRefDialog.current.click()} startIcon={<PhotoCamera />}>
                    {uploadingDialog ? <CircularProgress size={16} /> : 'Upload'}
                  </Button>
                </Box>
              </Box>
            </Box>
            <TextField label="Provider Name" value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })} fullWidth />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
            <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
            <TextField label="Address Line 1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} fullWidth />
              <TextField label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} sx={{ width: 120 }} />
              <TextField label="Zip" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} sx={{ width: 120 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    setSaving(true);
                    const payload = { ...form };
                    const providerId = payload.providerId || payload.providerId === 0 ? payload.providerId : p.providerId || payload.providerId || undefined;
                    // prefer providerProp providerId if present
                    const id = providerProp?.providerId || p?.providerId || providerId;
                    if (!id) {
                      toastMessage({ msg: 'Unable to determine provider id for update', type: 'error' });
                      return;
                    }

                    const res = await apiClient.patch(`/api/v1/providers/${id}`, payload);
                    // Use the response data to update state
                    const updatedProvider = res.data || res;
                    setP(prev => ({ ...prev, ...updatedProvider }));
                    if (setProviderProp) setProviderProp(prev => ({ ...prev, ...updatedProvider }));
                    // Update Redux store
                    dispatch(updateProvider(updatedProvider));
                    toastMessage({ msg: 'Profile updated successfully', type: 'success' });
                    setOpenEdit(false);
                  } catch (err) {
                    console.error('Failed to update provider:', err);
                    toastMessage({ msg: err?.userMessage || 'Failed to update profile. Please try again.', type: 'error' });
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProviderHomeView;

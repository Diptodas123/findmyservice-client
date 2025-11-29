import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileSidebar from './ProfileSidebar.jsx';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import cloudinary from '../../utils/cloudinary';
import toastMessage from '../../utils/toastMessage';
import apiClient from '../../utils/apiClient';
import { setUser } from '../../store/userSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const reduxProfile = useSelector((s) => s.user?.profile || {});

  const [activeTab, setActiveTab] = useState('personal');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: reduxProfile?.name || '',
    email: reduxProfile?.email || '',
    phone: reduxProfile?.phone || '',
    addressLine1: reduxProfile?.addressLine1 || '',
    addressLine2: reduxProfile?.addressLine2 || '',
    city: reduxProfile?.city || '',
    state: reduxProfile?.state || '',
    zipCode: reduxProfile?.zipCode || '',
    username: reduxProfile?.username || '',
    profilePictureUrl: reduxProfile?.profilePictureUrl || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: reduxProfile?.name || '',
      email: reduxProfile?.email || '',
      phone: reduxProfile?.phone || '',
      addressLine1: reduxProfile?.addressLine1 || '',
      addressLine2: reduxProfile?.addressLine2 || '',
      city: reduxProfile?.city || '',
      state: reduxProfile?.state || '',
      zipCode: reduxProfile?.zipCode || '',
      username: reduxProfile?.username || '',
      profilePictureUrl: reduxProfile?.profilePictureUrl || '',
    }));
  }, [reduxProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB!');
      return;
    }
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilePictureUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setFormData(prev => ({ ...prev, profilePictureUrl: '' }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!formData.name || !formData.name.trim()) errors.name = 'Name is required';
    if (formData.email && !validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
    if (formData.phone && !validatePhone(formData.phone)) errors.phone = 'Please enter a valid phone number';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    const payload = { ...formData };
    let prev = { ...reduxProfile };

    try {
      if (payload.profilePictureUrl && payload.profilePictureUrl.startsWith && payload.profilePictureUrl.startsWith('data:')) {
        toastMessage({ msg: 'Uploading image...', type: 'info' });
        const blob = await (await fetch(payload.profilePictureUrl)).blob();
        const file = new File([blob], 'profile.png', { type: blob.type });
        const up = await cloudinary.uploadImage(file, { folder: 'findmyservice' });
        if (up?.secure_url) payload.profilePictureUrl = up.secure_url;
      }

      const optimistic = { ...prev, ...payload };
      dispatch(setUser(optimistic));

      const res = await apiClient.put(`/api/v1/users/${reduxProfile.userId}`, payload);

      if (res && (res.profile || res.user)) {
        const updated = res.profile || res.user;
        dispatch(setUser(updated));
      } else {
        try {
          const latest = await apiClient.get(`/api/v1/users/${reduxProfile.userId}`);
          if (latest) dispatch(setUser(latest));
        } catch (fetchErr) {
          console.warn('Could not fetch latest after update, keeping optimistic state', fetchErr);
        }
      }

      toastMessage({ msg: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      dispatch(setUser(prev || {}));
      if (err?.response && err.response.errors) setFieldErrors(err.response.errors);
      if (!err?.isNetworkError) toastMessage({ msg: err.userMessage || err.message || 'Failed to update profile', type: 'error' });
      console.error('Profile update failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const renderPersonalInfo = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>
        Personal Information
      </Typography>

      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar src={formData?.profilePictureUrl} sx={{ width: 150, height: 150 }}>
              {!formData?.profilePictureUrl && 'No Image'}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button variant="contained" color="primary" component="label" startIcon={<PhotoCamera />} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark } } : {}) })}>
                {profilePicture ? 'Change Photo' : 'Upload Photo'}
                <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
              </Button>
              {formData?.profilePicturePreview && (
                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleRemoveProfilePicture} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark } } : {}) })}>
                  Remove
                </Button>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Recommended: Square image, at least 400x400px</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Max file size: 5MB</Typography>
            <Typography variant="body2" color="text.secondary">Supported formats: JPG, PNG, GIF</Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={3} sx={{ maxWidth: { xs: '100%', md: '600px' } }}>
        <TextField fullWidth label="Name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Enter your name" error={!!fieldErrors.name} helperText={fieldErrors.name || ''} />
        <TextField fullWidth label="Email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="Enter your email" error={!!fieldErrors.email} helperText={fieldErrors.email || ''} />
        <TextField fullWidth label="Phone Number" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" error={!!fieldErrors.phone} helperText={fieldErrors.phone || ''} />
      </Stack>

      <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark }, mt: 3 } : { mt: 3 }) })}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );

  const renderAddressInfo = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>Address Information</Typography>

      <Stack spacing={3}>
        <TextField fullWidth label="Address Line 1" name="addressLine1" required value={formData.addressLine1} onChange={handleInputChange} placeholder="Enter your address line 1" error={!!fieldErrors.addressLine1} helperText={fieldErrors.addressLine1 || ''} />
        <TextField fullWidth label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Enter your address line 2 (optional)" error={!!fieldErrors.addressLine2} helperText={fieldErrors.addressLine2 || ''} />
        <TextField fullWidth label="City" name="city" required value={formData.city} onChange={handleInputChange} placeholder="Enter your city" error={!!fieldErrors.city} helperText={fieldErrors.city || ''} />
        <TextField fullWidth label="State/Province" name="state" required value={formData.state} onChange={handleInputChange} placeholder="Enter your state" error={!!fieldErrors.state} helperText={fieldErrors.state || ''} />
        <TextField fullWidth label="ZIP/Postal Code" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} placeholder="Enter your ZIP code" error={!!fieldErrors.zipCode} helperText={fieldErrors.zipCode || ''} />
      </Stack>
      <Button type="submit" variant="contained" color="primary" size="large" sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark }, mt: 3 } : { mt: 3 }) })}>
        Save Changes
      </Button>
    </Box>
  );

  const renderAccountSettings = () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>Account Settings</Typography>

      <Box component="form" onSubmit={handlePasswordChange}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Change Password</Typography>
        <Stack spacing={3}>
          <TextField fullWidth label="Current Password" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleInputChange} error={!!fieldErrors.currentPassword} helperText={fieldErrors.currentPassword || ''} placeholder="Enter current password" />
          <TextField fullWidth label="New Password" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} error={!!fieldErrors.newPassword} helperText={fieldErrors.newPassword || ''} placeholder="Enter new password" />
          <TextField fullWidth label="Confirm New Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} error={!!fieldErrors.confirmPassword} helperText={fieldErrors.confirmPassword || ''} placeholder="Confirm new password" />
        </Stack>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark }, mt: 3 } : { mt: 3 }) })}>
          {loading ? 'Saving...' : 'Change Password'}
        </Button>
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'address':
        return renderAddressInfo();
      case 'settings':
        return renderAccountSettings();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 200px)', py: 5, bgcolor: 'background.default' }}>
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start" sx={{ mt: 6 }}>
          <Box sx={{ width: { xs: '100%', md: '280px' } }}>
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} profilePicturePreview={formData?.profilePictureUrl} />
          </Box>
          <Box sx={{ width: '100%', flex: 1 }}>
            <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>{renderContent()}</Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ProfilePage;

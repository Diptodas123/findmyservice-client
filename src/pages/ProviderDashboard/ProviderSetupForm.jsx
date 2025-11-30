import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Stack,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import { PhotoCamera, Delete, AddPhotoAlternate } from '@mui/icons-material';
import { updateProvider } from '../../store/providerSlice';
import apiClient from '../../utils/apiClient';
import toastMessage from '../../utils/toastMessage';
import cloudinary from '../../utils/cloudinary';

const ProviderSetupForm = () => {
  const dispatch = useDispatch();
  const providerProfile = useSelector((state) => state.provider.profile);

  const [formData, setFormData] = useState({
    providerName: providerProfile?.providerName || '',
    email: providerProfile?.email || '',
    phone: providerProfile?.phone || '',
    addressLine1: providerProfile?.addressLine1 || '',
    addressLine2: providerProfile?.addressLine2 || '',
    city: providerProfile?.city || '',
    state: providerProfile?.state || '',
    zipCode: providerProfile?.zipCode || '',
    profilePictureUrl: providerProfile?.profilePictureUrl || '',
    imageUrls: providerProfile?.imageUrls || [],
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [businessImages, setBusinessImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState(providerProfile?.imageUrls || []);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastMessage({ msg: 'Please select a valid image file!', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastMessage({ msg: 'Image size should be less than 5MB!', type: 'error' });
      return;
    }

    setProfilePicture(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePictureUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleBusinessImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate total images (existing + new)
    const totalImages = imagePreviewUrls.length + files.length;
    if (totalImages > 10) {
      toastMessage({ msg: 'You can upload maximum 10 images', type: 'error' });
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toastMessage({ msg: 'Please select only image files!', type: 'error' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toastMessage({ msg: 'Each image should be less than 5MB!', type: 'error' });
        return;
      }
    }

    // Add new files to businessImages
    setBusinessImages((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setBusinessImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.providerName?.trim()) {
      newErrors.providerName = 'Business name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (imagePreviewUrls.length < 3) {
      newErrors.images = 'Please upload at least 3 business images';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toastMessage({ msg: 'Please fill in all required fields correctly', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      let profilePictureUrl = formData.profilePictureUrl;
      let uploadedImageUrls = [];

      // Upload profile picture if changed
      if (profilePicture) {
        try {
          setUploadingImages(true);
          profilePictureUrl = await cloudinary.uploadImage(profilePicture);
        } catch (uploadErr) {
          console.error('Profile picture upload failed:', uploadErr);
          toastMessage({ msg: 'Failed to upload profile picture. Continuing without it.', type: 'warning' });
        }
      }

      // Upload business images
      if (businessImages.length > 0) {
        try {
          setUploadingImages(true);
          toastMessage({ msg: `Uploading ${businessImages.length} image(s)...`, type: 'info' });
          
          const uploadPromises = businessImages.map(async (file) => {
            try {
              return await cloudinary.uploadImage(file);
            } catch (err) {
              console.error('Failed to upload image:', err);
              return null;
            }
          });

          const results = await Promise.all(uploadPromises);
          uploadedImageUrls = results.filter(url => url !== null);

          // Add existing URLs that weren't files
          const existingUrls = imagePreviewUrls.filter(url => 
            typeof url === 'string' && url.startsWith('http')
          );
          uploadedImageUrls = [...existingUrls, ...uploadedImageUrls];

        } catch (uploadErr) {
          console.error('Business images upload failed:', uploadErr);
          toastMessage({ msg: 'Some images failed to upload', type: 'warning' });
        } finally {
          setUploadingImages(false);
        }
      } else {
        // Keep existing image URLs
        uploadedImageUrls = imagePreviewUrls.filter(url => 
          typeof url === 'string' && url.startsWith('http')
        );
      }

      const updatedData = {
        ...formData,
        profilePictureUrl,
        imageUrls: uploadedImageUrls,
        providerId: providerProfile?.providerId,
      };

      // Update provider details via API
      const response = await apiClient.put(`/api/v1/providers/${providerProfile?.providerId}`, updatedData);

      if (response) {
        // Update Redux store
        dispatch(updateProvider(updatedData));
        toastMessage({ msg: 'Profile setup completed successfully!', type: 'success' });
        // No need to navigate, parent will handle routing based on isProfileComplete
      }
    } catch (error) {
      console.error('Error updating provider profile:', error);
      toastMessage({ 
        msg: error?.userMessage || 'Failed to update profile. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Complete Your Provider Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Please provide your business details to get started
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Profile Picture */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={formData.profilePictureUrl}
                sx={{ width: 120, height: 120 }}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Profile Picture
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </Button>
            </Box>

            {/* Business Name */}
            <TextField
              required
              fullWidth
              label="Business Name"
              name="providerName"
              value={formData.providerName}
              onChange={handleInputChange}
              error={!!errors.providerName}
              helperText={errors.providerName}
            />

            {/* Email and Phone */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
            </Grid>

            {/* Address */}
            <TextField
              fullWidth
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />

            {/* City, State, Zip */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            {/* Business Images */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Business Images *
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload at least 3 images of your business (Maximum 10 images, 5MB each)
              </Typography>

              {imagePreviewUrls.length > 0 && (
                <ImageList sx={{ width: '100%', maxHeight: 400, mb: 2 }} cols={3} rowHeight={200}>
                  {imagePreviewUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={url}
                        alt={`Business ${index + 1}`}
                        loading="lazy"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Delete />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}

              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
                fullWidth
                disabled={uploadingImages || imagePreviewUrls.length >= 10}
              >
                {imagePreviewUrls.length === 0 
                  ? 'Add Business Images' 
                  : `Add More Images (${imagePreviewUrls.length}/10)`}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleBusinessImagesChange}
                />
              </Button>
              {errors.images && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.images}
                </Typography>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || uploadingImages}
              sx={{ mt: 2 }}
            >
              {loading || uploadingImages ? (
                <CircularProgress size={24} />
              ) : (
                'Complete Setup'
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ProviderSetupForm;

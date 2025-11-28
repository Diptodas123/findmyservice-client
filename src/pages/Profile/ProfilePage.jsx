import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar.jsx';
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

const ProfilePage = () => {

  const reduxProfile = useSelector((s) => s.user?.profile || null);

  const [activeTab, setActiveTab] = useState('personal');
  const [profilePicture, setProfilePicture] = useState(null);

  const [formData, setFormData] = useState({
    firstName: reduxProfile?.firstName || (reduxProfile?.name ? reduxProfile.name.split(' ')[0] : ''),
    lastName: reduxProfile?.lastName || (reduxProfile?.name ? reduxProfile.name.split(' ').slice(1).join(' ') : ''),
    email: reduxProfile?.email || '',
    phone: reduxProfile?.phone || '',
    addressLine1: reduxProfile?.addressLine1 || '',
    addressLine2: reduxProfile?.addressLine2 || '',
    city: reduxProfile?.city || '',
    state: reduxProfile?.state || '',
    zipCode: reduxProfile?.zipCode || '',
    username: reduxProfile?.username || '',
    profilePictureUrl: reduxProfile?.profilePictureUrl || '',
  });


  const initializedRef = useRef(false);
  useEffect(() => {
    if (!reduxProfile || initializedRef.current) return;
    initializedRef.current = true;
  }, [reduxProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB!');
        return;
      }
      setProfilePicture(file);
      // show a local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePictureUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);

      // upload to Cloudinary
      (async () => {
        try {
          toastMessage({ msg: 'Uploading image...', type: 'info' });
          const res = await cloudinary.uploadImage(file, { folder: 'findmyservice' });
          if (res?.secure_url) {
            setFormData(prev => ({ ...prev, profilePictureUrl: res.secure_url }));
            toastMessage({ msg: 'Image uploaded', type: 'success' });
          }
        } catch (err) {
          // leave the preview but notify (cloudinary util already toasts on failure)
          console.error('Upload failed', err);
        }
      })();
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setFormData(prev => ({
      ...prev,
      profilePictureUrl: ''
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email && !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address!');
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number!');
      return;
    }

    toast.success('Profile updated successfully!');
    console.log('Form submitted:', formData);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const renderPersonalInfo = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: "primary.main" }}
      >
        Personal Information
      </Typography>

      <Paper sx={{ p: 3, mb: 4, bgcolor: "background.default" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={formData?.profilePictureUrl}
              sx={{ width: 150, height: 150 }}
            >
              {!formData?.profilePictureUrl && "No Image"}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                component="label"
                startIcon={<PhotoCamera />}
                sx={(theme) => ({
                  ...(theme.palette.mode === "dark"
                    ? {
                      color: theme.palette.background.dark,
                      backgroundColor: theme.palette.primary.dark,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.04)",
                      },
                      "& .MuiButton-startIcon": {
                        color: theme.palette.background.dark,
                      },
                    }
                    : {}),
                })}
              >
                {profilePicture ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </Button>
              {formData?.profilePicturePreview && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleRemoveProfilePicture}
                  sx={(theme) => ({
                    ...(theme.palette.mode === "dark"
                      ? {
                        color: theme.palette.background.dark,
                        backgroundColor: theme.palette.primary.dark,
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.04)",
                        },
                        "& .MuiButton-startIcon": {
                          color: theme.palette.background.dark,
                        },
                      }
                      : {}),
                  })}
                >
                  Remove
                </Button>
              )}
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Recommended: Square image, at least 400x400px
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Max file size: 5MB
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: JPG, PNG, GIF
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={3} sx={{ maxWidth: { xs: '100%', md: '600px' } }}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={(theme) => ({
          ...(theme.palette.mode === "dark"
            ? {
              color: theme.palette.background.dark,
              backgroundColor: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.04)",
              },
              "& .MuiButton-startIcon": {
                color: theme.palette.background.dark,
              },
              mt: 3
            }
            : { mt: 3 }),
        })}
      >
        Save Changes
      </Button>
    </Box>
  );

  const renderAddressInfo = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: "primary.main" }}
      >
        Address Information
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Address Line 1"
          name="addressLine1"
          required
          value={formData.addressLine1}
          onChange={handleInputChange}
          placeholder="Enter your address line 1"
        />
        <TextField
          fullWidth
          label="Address Line 2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleInputChange}
          placeholder="Enter your address line 2 (optional)"
        />
        <TextField
          fullWidth
          label="City"
          name="city"
          required
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Enter your city"
        />
        <TextField
          fullWidth
          label="State/Province"
          name="state"
          required
          value={formData.state}
          onChange={handleInputChange}
          placeholder="Enter your state"
        />
        <TextField
          fullWidth
          label="ZIP/Postal Code"
          name="zipCode"
          required
          value={formData.zipCode}
          onChange={handleInputChange}
          placeholder="Enter your ZIP code"
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={(theme) => ({
          ...(theme.palette.mode === "dark"
            ? {
              color: theme.palette.background.dark,
              backgroundColor: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.04)",
              },
              "& .MuiButton-startIcon": {
                color: theme.palette.background.dark,
              },
              mt: 3
            }
            : { mt: 3 }),
        })}
      >
        Save Changes
      </Button>
    </Box>
  );

  const renderAccountSettings = () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: "primary.main" }}
      >
        Account Settings
      </Typography>

      <Box component="form" onSubmit={handlePasswordChange}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Change Password
        </Typography>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Enter current password"
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter new password"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={(theme) => ({
            ...(theme.palette.mode === "dark"
              ? {
                color: theme.palette.background.dark,
                backgroundColor: theme.palette.primary.dark,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.04)",
                },
                "& .MuiButton-startIcon": {
                  color: theme.palette.background.dark,
                },
                mt: 3
              }
              : { mt: 3 }),
          })}
        >
          Change Password
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
            <ProfileSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profilePicturePreview={formData?.profilePictureUrl}
            />
          </Box>
          <Box sx={{ width: '100%', flex: 1 }}>
            <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
              {renderContent()}
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ProfilePage;

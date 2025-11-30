import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, InputAdornment, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { setProvider } from '../../store/providerSlice';
import apiClient from '../../utils/apiClient';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import toastMessage from '../../utils/toastMessage';

export default function Login() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: 'USER',
  });
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    let valid = true;

    if (!validateEmail(userData.email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!userData.password) {
      setPasswordError('Password is required');
      valid = false;
    }
    if (!valid) return;

    const performLogin = async () => {
      setLoading(true);
      try {
        const data = await apiClient.post('/api/v1/auth/login', {
          email: userData.email,
          password: userData.password,
          role: userData.role
        });
        if (data?.token) {
          localStorage.setItem('token', data.token);
          const userId = data?.userId || data?.providerId || null;
          
          // Handle PROVIDER login differently
          if (userData.role === 'PROVIDER') {
            const providerProfile = await getProviderProfile(userId);
            const providerData = {
              providerId: providerProfile?.providerId || userId,
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
              avgRating: providerProfile?.avgRating || 0,
              totalRatings: providerProfile?.totalRatings || 0,
              createdAt: providerProfile?.createdAt || '',
            };
            try {
              dispatch(setProvider(providerData));
            } catch {
              // ignore dispatch errors
            }
            setLoading(false);
            toastMessage({ msg: 'Login successful! Redirecting...', type: 'success' });
            setTimeout(() => {
              navigate('/service-provider-dashboard');
            }, 2000);
          } else {
            // Handle USER login
            const responseProfile = await getUserProfile(userId);
            const profile = {
              name: responseProfile?.name || '',
              email: responseProfile?.email || '',
              userId: userId,
              role: responseProfile?.role || userData.role || 'USER',
              phone: responseProfile?.phone || '',
              addressLine1: responseProfile?.addressLine1 || '',
              addressLine2: responseProfile?.addressLine2 || '',
              city: responseProfile?.city || '',
              state: responseProfile?.state || '',
              zipCode: responseProfile?.zipCode || '',
              profilePictureUrl: responseProfile?.profilePictureUrl || '',
            };
            try {
              dispatch(setUser(profile));
            } catch {
              // ignore dispatch errors
            }
            setLoading(false);
            toastMessage({ msg: 'Login successful! Redirecting...', type: 'success' });
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        } else {
          const msg = data?.error || 'Invalid credentials';
          toastMessage({ msg, type: 'error' });
        }
      } catch (err) {
        setLoading(false);
        const msg = err?.userMessage || err?.message || 'Network error. Please try again.';
        if (!err?.isNetworkError) {
          toastMessage({ msg, type: 'error' });
        }
      }
    }

    const getUserProfile = async (userId) => {
      if (!userId) return null;
      try {
        const data = await apiClient.get(`/api/v1/users/${userId}`);
        return data;
      } catch {
        // ignore errors
      }
      return null;
    };

    const getProviderProfile = async (providerId) => {
      if (!providerId) return null;
      try {
        const data = await apiClient.get(`/api/v1/providers/${providerId}`);
        return data;
      } catch {
        // ignore errors
      }
      return null;
    };

    performLogin();
  };

  return (
    <Box className="login-bg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480, boxSizing: 'border-box' }}>
        <Typography variant="h5" gutterBottom><PermIdentityIcon fontSize='large' /> Login</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Login As</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={userData.role}
              label="Login As"
              onChange={e => setUserData({ ...userData, role: e.target.value })}
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="PROVIDER">Provider</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={userData.email}
            onChange={e => setUserData({ ...userData, email: e.target.value })}
            required
            error={!!emailError}
            helperText={emailError}
            autoComplete="email"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={userData.password}
            onChange={e => setUserData({ ...userData, password: e.target.value })}
            required
            error={!!passwordError}
            helperText={passwordError}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Button variant="text" onClick={() => navigate('/signup')}>Sign Up</Button>
        </Typography>
      </Paper>
    </Box>
  );
}

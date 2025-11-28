import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, InputAdornment, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import apiClient from '../../utils/apiClient';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import toastMessage from '../../utils/toastMessage';

export default function Login() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: 'USER',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (error) {
      toastMessage({ msg: error, type: 'error' });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');
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
          const userId = data?.userId || data?.id || null;
          const responseProfile = await getUserProfile(userId);
          const profile = {
            name: responseProfile?.name || '',
            email: responseProfile?.email || '',
            userId: userId,
            role: responseProfile?.role || '',
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
          }, 4000);
        } else {
          setError(data?.error || 'Invalid credentials');
        }
      } catch (err) {
        setLoading(false);
        setError(err?.message || 'Network error. Please try again.');
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

    performLogin();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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

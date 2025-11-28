import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import toastMessage from '../../utils/toastMessage';
import apiClient from '../../utils/apiClient';

export default function Signup() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePasswordStrength = (password) => {
    // Minimum 8 chars, at least one letter, one number, one special char
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  };

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (!userData.name.trim()) {
      setError('Name is required');
      valid = false;
    }
    if (!validateEmail(userData.email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!validatePasswordStrength(userData.password)) {
      setPasswordError('Password must be at least 8 characters and include a letter, number, and special character');
      valid = false;
    }
    if (userData.password !== userData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      const data = await apiClient.post('/api/v1/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      });
      setLoading(false);
      if (data && data.message) {
        toastMessage({ msg: 'Registration successful! Redirecting to login...', type: 'success' });
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } else {
        setError(data?.error || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      const msg = err?.message || "Network error. Please try again.";
      setError(msg);
      if (!err?.isNetworkError) {
        toastMessage({ msg, type: 'error' });
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480, boxSizing: 'border-box' }}>
        <Typography variant="h5" gutterBottom><HowToRegIcon fontSize='large' /> Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={userData.name}
            onChange={(e) => onChange({ target: { name: 'name', value: e.target.value } })}
            required
            autoComplete="name"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Register As</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={userData.role}
              label="Register As"
              onChange={(e) => onChange({ target: { name: 'role', value: e.target.value } })}
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
            onChange={(e) => onChange({ target: { name: 'email', value: e.target.value } })}
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
            onChange={(e) => onChange({ target: { name: 'password', value: e.target.value } })}
            required
            error={!!passwordError}
            helperText={passwordError || "Minimum 8 characters, include a letter, number, and special character (e.g. !@#$%^&*()_+-=[]{}|;:'.,<>/?`~)."}
            autoComplete="new-password"
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
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={userData.confirmPassword}
            onChange={(e) => onChange({ target: { name: 'confirmPassword', value: e.target.value } })}
            required
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Button variant="text" onClick={() => navigate('/login')}>Login</Button>
        </Typography>
      </Paper>
    </Box>
  );
}

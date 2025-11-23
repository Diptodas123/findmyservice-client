import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // TODO: Replace with real authentication API call
      if (email === 'user@example.com' && password === 'password') {
        localStorage.setItem('token', 'demo-token');
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    }, 1200);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480, boxSizing: 'border-box' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          {error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Button variant="text" size="small" onClick={() => alert('Forgot password flow goes here')}>
              Forgot Password?
            </Button>
          </Box>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Button variant="text" onClick={() => navigate('/signup')}>Sign Up</Button>
        </Typography>
      </Paper>
    </Box>
  );
}

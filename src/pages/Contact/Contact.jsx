import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/useThemeMode';
import toastMessage from '../../utils/toastMessage';

const Contact = () => {
  const { mode } = useThemeMode();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toastMessage({ msg: 'Please fill in all fields', type: 'error' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toastMessage({ msg: 'Please enter a valid email address', type: 'error' });
      return;
    }

    // Construct mailto link
    const mailtoLink = `mailto:support@findmyservice.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    toastMessage({ msg: 'Opening your email client...', type: 'success' });
    
    // Reset form after a short delay
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
      title: 'Email',
      content: 'support@findmyservice.com',
      link: 'mailto:support@findmyservice.com'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
      title: 'Address',
      content: '123 Service Street, Business District, City, Country',
      link: null
    }
  ];

  return (
    <Box sx={{ 
      py: 8, 
      minHeight: '80vh',
      background: mode === 'dark' 
        ? 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)' 
        : 'linear-gradient(180deg, #f5f5f5 0%, #e8f4f8 100%)'
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 700,
            mb: 1,
            color: mode === 'dark' ? '#fff' : '#1a1a1a',
            background: mode === 'dark' 
              ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
              : 'linear-gradient(45deg, #1976d2, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          sx={{ mb: 6, maxWidth: 700, mx: 'auto', fontWeight: 400 }}
        >
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Contact Information Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3} justifyContent="center">
              {contactInfo.map((info, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    elevation={mode === 'dark' ? 0 : 2}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      background: mode === 'dark' ? '#1e1e1e' : '#fff',
                      borderRadius: 3,
                      width: '100%',
                      maxWidth: 350,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: mode === 'dark' ? '0 12px 24px rgba(144, 202, 249, 0.2)' : '0 12px 24px rgba(25, 118, 210, 0.15)',
                        borderColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(25, 118, 210, 0.2)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: '50%',
                        background: mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                      {info.title}
                    </Typography>
                    {info.link ? (
                      <Typography
                        component="a"
                        href={info.link}
                        sx={{
                          color: mode === 'dark' ? '#90caf9' : '#1976d2',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {info.content}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                        {info.content}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12}>
            <Paper
              elevation={mode === 'dark' ? 0 : 3}
              sx={{
                p: 5,
                background: mode === 'dark' ? '#1e1e1e' : '#fff',
                borderRadius: 3,
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                Send us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Fill out the form below and we'll get back to you as soon as possible
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for contacting us! We'll get back to you soon.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={6}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<SendIcon />}
                      sx={{
                        py: 1.8,
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        background: mode === 'dark' 
                          ? 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                          : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        boxShadow: '0 3px 10px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          background: mode === 'dark'
                            ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                            : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Info Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Business Hours
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={mode === 'dark' ? 0 : 2}
                sx={{
                  p: 3,
                  background: mode === 'dark' ? '#1e1e1e' : '#fff',
                  borderRadius: 2,
                  border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: mode === 'dark' ? '0 8px 16px rgba(0,0,0,0.4)' : '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Monday - Friday
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                  9:00 AM - 6:00 PM
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={mode === 'dark' ? 0 : 2}
                sx={{
                  p: 3,
                  background: mode === 'dark' ? '#1e1e1e' : '#fff',
                  borderRadius: 2,
                  border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: mode === 'dark' ? '0 8px 16px rgba(0,0,0,0.4)' : '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Saturday
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                  10:00 AM - 4:00 PM
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={mode === 'dark' ? 0 : 2}
                sx={{
                  p: 3,
                  background: mode === 'dark' ? '#1e1e1e' : '#fff',
                  borderRadius: 2,
                  border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: mode === 'dark' ? '0 8px 16px rgba(0,0,0,0.4)' : '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Sunday
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                  Closed
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;

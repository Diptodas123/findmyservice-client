import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {

  return (
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', borderRadius: 2 }} elevation={3}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={'/404.jpg'}
                alt="Not found"
                sx={{ width: { xs: '100%', md: '100%' }, maxWidth: 1100, borderRadius: 2, boxShadow: 3 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
              Oops — page not found
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto' }}>
              The page you're looking for doesn't exist or you don't have permission to view it. If you think this is an error, please contact support.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
              <Button component={RouterLink} to="/" variant="contained" size="medium">
                Go Home
              </Button>
              <Button href="/contact" variant="outlined" size="medium">
                Contact Support
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NotFound;
